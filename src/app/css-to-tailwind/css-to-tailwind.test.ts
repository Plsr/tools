import { describe, expect, test } from "vitest";
import { cssToTailwind } from "./css-to-tailwind";

describe("cssToTailwind", () => {
  test("converts flex layout rules", () => {
    const css = `.box { display: flex; justify-content: center; align-items: center; }`;
    expect(cssToTailwind(css)).toEqual([
      "flex",
      "justify-center",
      "items-center",
    ]);
  });

  test("converts colors and font weight", () => {
    const css = `h1 { color: red; font-weight: 700; }`;
    expect(cssToTailwind(css)).toEqual(["text-red-500", "font-bold"]);
  });

  test("converts spacing properties", () => {
    const css = `.padded { margin-top: 1rem; padding: 0.5rem; }`;
    expect(cssToTailwind(css)).toEqual(["mt-4", "p-2"]);
  });
});
