"use client";

import { useMemo, useState } from "react";

const INGREDIENT_DENSITIES: Array<{ name: string; gPerMl: number }> = [
  { name: "olive oil", gPerMl: 0.92 },
  { name: "flour", gPerMl: 0.53 },
  { name: "sugar", gPerMl: 0.85 },
  { name: "butter", gPerMl: 0.91 },
  { name: "milk", gPerMl: 1.03 },
  { name: "water", gPerMl: 1 },
];

const VOLUME_UNITS: Record<string, number> = {
  ml: 1,
  l: 1000,
  cup: 240,
  cups: 240,
  tbsp: 15,
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,
};

const MASS_UNITS: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,
  lb: 453.592,
  pound: 453.592,
  pounds: 453.592,
};

const normalizeUnit = (unit: string) => unit.toLowerCase();

const getUnitCategory = (unit: string) => {
  if (unit in VOLUME_UNITS) {
    return "volume";
  }
  if (unit in MASS_UNITS) {
    return "mass";
  }
  return null;
};

const formatNumber = (value: number) => {
  if (Number.isNaN(value)) {
    return "";
  }
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
};

const unitRegex =
  /(ml|l|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|g|gram|grams|kg|kilogram|kilograms|oz|ounce|ounces|lb|pound|pounds)/i;

export const UnitConverterTool = () => {
  const [input, setInput] = useState("");

  const parsed = useMemo(() => {
    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    const amountMatch = normalized.match(/\d+(?:\.\d+)?/);
    const amount = amountMatch ? Number(amountMatch[0]) : null;

    const fromMatch = normalized.match(
      /\d+(?:\.\d+)?\s*(ml|l|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|g|gram|grams|kg|kilogram|kilograms|oz|ounce|ounces|lb|pound|pounds)/,
    );
    const fromUnit = fromMatch ? normalizeUnit(fromMatch[1]) : null;

    const targetMatch = normalized.match(
      /(?:to|in)\s+(ml|l|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|g|gram|grams|kg|kilogram|kilograms|oz|ounce|ounces|lb|pound|pounds)/,
    );
    const toUnit = targetMatch ? normalizeUnit(targetMatch[1]) : null;

    const ingredient = INGREDIENT_DENSITIES.find((item) =>
      normalized.includes(item.name),
    );

    return {
      amount,
      fromUnit,
      toUnit,
      ingredient,
    };
  }, [input]);

  const recognizedWords = useMemo(() => {
    if (!parsed || !input.trim()) {
      return new Set<string>();
    }

    const recognized = new Set<string>();
    const amountToken = parsed.amount?.toString();
    if (amountToken) {
      recognized.add(amountToken);
    }
    if (parsed.fromUnit) {
      recognized.add(parsed.fromUnit);
    }
    if (parsed.toUnit) {
      recognized.add(parsed.toUnit);
    }
    if (parsed.ingredient) {
      parsed.ingredient.name.split(" ").forEach((word) => recognized.add(word));
    }

    return recognized;
  }, [input, parsed]);

  const highlightedParts = useMemo(() => {
    if (!input) {
      return [];
    }

    return input.split(/(\s+)/).map((part, index) => {
      if (part.trim() === "") {
        return { key: `${part}-${index}`, content: part, highlighted: false };
      }

      const normalizedPart = part.toLowerCase().replace(/[^\w.]/g, "");
      const isUnit = unitRegex.test(normalizedPart);
      const isRecognized = recognizedWords.has(normalizedPart) || isUnit;

      return {
        key: `${part}-${index}`,
        content: part,
        highlighted: isRecognized,
      };
    });
  }, [input, recognizedWords]);

  const conversion = useMemo(() => {
    if (!parsed || parsed.amount === null || !parsed.fromUnit || !parsed.toUnit) {
      return null;
    }

    const fromCategory = getUnitCategory(parsed.fromUnit);
    const toCategory = getUnitCategory(parsed.toUnit);

    if (!fromCategory || !toCategory) {
      return null;
    }

    let grams = 0;
    let milliliters = 0;
    let isEstimated = false;

    if (fromCategory === "mass") {
      grams = parsed.amount * MASS_UNITS[parsed.fromUnit];
    } else {
      milliliters = parsed.amount * VOLUME_UNITS[parsed.fromUnit];
    }

    if (fromCategory !== toCategory) {
      const density = parsed.ingredient?.gPerMl ?? 1;
      isEstimated = parsed.ingredient == null;
      if (fromCategory === "mass") {
        milliliters = grams / density;
      } else {
        grams = milliliters * density;
      }
    }

    let resultValue = 0;
    if (toCategory === "mass") {
      resultValue = grams / MASS_UNITS[parsed.toUnit];
    } else {
      resultValue = milliliters / VOLUME_UNITS[parsed.toUnit];
    }

    const ingredientLabel = parsed.ingredient
      ? parsed.ingredient.name
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      : "Unknown ingredient";

    return {
      resultValue,
      isEstimated,
      ingredientLabel,
    };
  }, [parsed]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm opacity-70 block mb-2" htmlFor="unit-input">
          Describe your conversion
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded border border-transparent p-2 text-neutral-300 whitespace-pre-wrap">
            {highlightedParts.length === 0 ? (
              <span className="text-neutral-500">
                e.g. &quot;80ml olive oil in grams&quot; or &quot;1 cup flour to
                grams&quot;
              </span>
            ) : (
              highlightedParts.map((part) => (
                <span
                  key={part.key}
                  className={
                    part.highlighted
                      ? "rounded bg-emerald-600/30 px-1.5 py-0.5 text-emerald-200"
                      : "text-neutral-400"
                  }
                >
                  {part.content}
                </span>
              ))
            )}
          </div>
          <input
            id="unit-input"
            className="relative border border-neutral-600 bg-transparent p-2 rounded w-full text-transparent caret-emerald-200"
            placeholder='e.g. "80ml olive oil in grams" or "1 cup flour to grams"'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded border border-neutral-700 bg-neutral-900/70 p-3">
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Conversion
        </p>
        {conversion ? (
          <div className="space-y-2 text-sm text-neutral-200">
            <p>
              {formatNumber(parsed?.amount ?? 0)} {parsed?.fromUnit} {" "}
              {conversion.ingredientLabel} ={" "}
              <span className="text-lg font-semibold text-emerald-300">
                {formatNumber(conversion.resultValue)} {parsed?.toUnit}
              </span>
            </p>
            {conversion.isEstimated && (
              <p className="text-xs text-amber-300">
                Estimated with water density. Add an ingredient name for a more
                accurate result.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Enter a quantity, a unit, and a target unit to see a conversion.
          </p>
        )}
      </div>
    </div>
  );
};
