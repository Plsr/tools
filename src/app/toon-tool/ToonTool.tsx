"use client";

import { useEffect, useState } from "react";

type ToonContainer = Record<string, unknown> | unknown[];

const COMMENT_RE = /^\s*(#|\/\/)/;

const countIndent = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;

const isScalarValue = (value: unknown) =>
  typeof value !== "object" || value === null;

const parseScalar = (rawValue: string): unknown => {
  if (rawValue === "") {
    return "";
  }

  const trimmed = rawValue.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  if (quoted) {
    return trimmed
      .slice(1, -1)
      .replace(/\\(["'\\])/g, "$1")
      .replace(/\\n/g, "\n");
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "null") {
    return null;
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner.split(",").map((item) => parseScalar(item.trim()));
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
};

const parseToon = (input: string): unknown => {
  const lines = input.replace(/\t/g, "  ").split(/\r?\n/);

  const findNextMeaningfulLine = (startIndex: number) => {
    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const trimmed = lines[i].trim();
      if (!trimmed || COMMENT_RE.test(trimmed)) {
        continue;
      }

      return {
        line: lines[i],
        trimmed,
        indent: countIndent(lines[i]),
        index: i,
      };
    }

    return null;
  };

  const firstMeaningfulLine = findNextMeaningfulLine(-1);
  const rootIsArray = firstMeaningfulLine?.trimmed.startsWith("-") ?? false;
  const root: ToonContainer = rootIsArray ? [] : {};

  const stack: Array<{
    indent: number;
    container: ToonContainer;
    type: "array" | "object";
  }> = [{ indent: -1, container: root, type: rootIsArray ? "array" : "object" }];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed || COMMENT_RE.test(trimmed)) {
      continue;
    }

    const indent = countIndent(rawLine);
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (trimmed.startsWith("-")) {
      if (current.type !== "array") {
        throw new Error(
          "Found an array item where an object entry was expected.",
        );
      }

      const rest = trimmed.slice(1).trim();
      if (!rest) {
        const nextLine = findNextMeaningfulLine(index);
        const childIsArray = nextLine?.trimmed.startsWith("-") ?? false;
        const child: ToonContainer = childIsArray ? [] : {};
        (current.container as unknown[]).push(child);
        stack.push({
          indent,
          container: child,
          type: childIsArray ? "array" : "object",
        });
        continue;
      }

      const match = rest.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const valuePart = match[2];
        if (!valuePart) {
          const nextLine = findNextMeaningfulLine(index);
          const childIsArray = nextLine?.trimmed.startsWith("-") ?? false;
          const child: ToonContainer = childIsArray ? [] : {};
          (current.container as unknown[]).push({ [key]: child });
          stack.push({
            indent,
            container: child,
            type: childIsArray ? "array" : "object",
          });
        } else {
          (current.container as unknown[]).push({
            [key]: parseScalar(valuePart),
          });
        }
      } else {
        (current.container as unknown[]).push(parseScalar(rest));
      }

      continue;
    }

    const match = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (!match) {
      throw new Error(`Unable to parse line: "${trimmed}"`);
    }

    const key = match[1].trim();
    const valuePart = match[2];
    if (!valuePart) {
      const nextLine = findNextMeaningfulLine(index);
      const isIndentedValue =
        nextLine &&
        nextLine.indent > indent &&
        !nextLine.trimmed.startsWith("-") &&
        !nextLine.trimmed.includes(":");

      if (isIndentedValue) {
        const collected: string[] = [];
        let cursor = nextLine.index;
        while (cursor < lines.length) {
          const candidate = lines[cursor];
          const candidateTrimmed = candidate.trim();
          if (!candidateTrimmed || COMMENT_RE.test(candidateTrimmed)) {
            cursor += 1;
            continue;
          }

          const candidateIndent = countIndent(candidate);
          if (candidateIndent <= indent) {
            break;
          }

          if (
            candidateTrimmed.startsWith("-") ||
            candidateTrimmed.includes(":")
          ) {
            break;
          }

          collected.push(candidateTrimmed);
          cursor += 1;
        }

        (current.container as Record<string, unknown>)[key] =
          collected.join("\n");
        index = cursor - 1;
      } else {
        const childIsArray = nextLine?.trimmed.startsWith("-") ?? false;
        const child: ToonContainer = childIsArray ? [] : {};
        (current.container as Record<string, unknown>)[key] = child;
        stack.push({
          indent,
          container: child,
          type: childIsArray ? "array" : "object",
        });
      }
    } else {
      (current.container as Record<string, unknown>)[key] =
        parseScalar(valuePart);
    }
  }

  return root;
};

const formatScalarForToon = (value: unknown) => {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === null) {
    return "null";
  }

  return String(value);
};

const formatToon = (value: unknown, indent = 0): string => {
  const prefix = " ".repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isScalarValue(item)) {
          return `${prefix}- ${formatScalarForToon(item)}`;
        }

        const nested = formatToon(item, indent + 2);
        return `${prefix}-\n${nested}`;
      })
      .join("\n");
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([key, entry]) => {
        if (isScalarValue(entry)) {
          return `${prefix}${key}: ${formatScalarForToon(entry)}`;
        }

        const nested = formatToon(entry, indent + 2);
        return `${prefix}${key}:\n${nested}`;
      })
      .join("\n");
  }

  return `${prefix}${formatScalarForToon(value)}`;
};

const formatReadable = (value: unknown, indent = 0): string[] => {
  const prefix = " ".repeat(indent);

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (isScalarValue(item)) {
        return [`${prefix}• ${formatScalarForToon(item)}`];
      }

      return [
        `${prefix}•`,
        ...formatReadable(item, indent + 2),
      ];
    });
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, entry]) => {
      if (isScalarValue(entry)) {
        return [`${prefix}• ${key}: ${formatScalarForToon(entry)}`];
      }

      return [
        `${prefix}• ${key}:`,
        ...formatReadable(entry, indent + 2),
      ];
    });
  }

  return [`${prefix}• ${formatScalarForToon(value)}`];
};

export const ToonTool = () => {
  const [toonInput, setToonInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [readableOutput, setReadableOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<"toon" | "json" | null>(null);

  useEffect(() => {
    if (lastEdited !== "toon") {
      return;
    }

    try {
      const parsed = parseToon(toonInput);
      const formattedJson = JSON.stringify(parsed, null, 2);
      setJsonInput((previous) =>
        previous === formattedJson ? previous : formattedJson,
      );
      setReadableOutput(formatReadable(parsed).join("\n"));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to parse TOON input.",
      );
    }
  }, [lastEdited, toonInput]);

  useEffect(() => {
    if (lastEdited !== "json") {
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formattedToon = formatToon(parsed);
      setToonInput((previous) =>
        previous === formattedToon ? previous : formattedToon,
      );
      setReadableOutput(formatReadable(parsed).join("\n"));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to parse JSON input.",
      );
    }
  }, [jsonInput, lastEdited]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">
        Changes sync automatically between TOON and JSON, and the readable
        summary updates as you type.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-neutral-400">TOON</span>
          <textarea
            className="min-h-[240px] rounded border border-neutral-700 bg-neutral-950 p-3 font-mono text-sm"
            placeholder="Paste TOON input here."
            value={toonInput}
            onChange={(event) => {
              setLastEdited("toon");
              setToonInput(event.target.value);
            }}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-neutral-400">JSON</span>
          <textarea
            className="min-h-[240px] rounded border border-neutral-700 bg-neutral-950 p-3 font-mono text-sm"
            placeholder="Paste JSON input here."
            value={jsonInput}
            onChange={(event) => {
              setLastEdited("json");
              setJsonInput(event.target.value);
            }}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-neutral-400">Readable TOON</span>
          <textarea
            className="min-h-[180px] rounded border border-neutral-700 bg-neutral-950 p-3 font-mono text-sm"
            placeholder="Human readable output will appear here."
            value={readableOutput}
            readOnly
          />
        </label>
      </div>

      {errorMessage ? (
        <div className="rounded border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-400">
          <p className="text-red-400">Error: {errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
};
