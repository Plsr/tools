"use client";

import { useMemo, useState } from "react";
import {
  FLUID_DENSITIES,
  FluidType,
  VolumeUnit,
  convertFluidToGrams,
} from "./fluid-to-grams";

export function FluidToGramsForm() {
  const [volume, setVolume] = useState("1");
  const [unit, setUnit] = useState<VolumeUnit>("ml");
  const [fluid, setFluid] = useState<FluidType>("water");

  const grams = useMemo(() => {
    const parsedVolume = Number.parseFloat(volume);

    if (!Number.isFinite(parsedVolume)) {
      return null;
    }

    try {
      return convertFluidToGrams(parsedVolume, unit, fluid);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [volume, unit, fluid]);

  const density = FLUID_DENSITIES[fluid];

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="volume">
          Volume
        </label>
        <div className="flex gap-2">
          <input
            id="volume"
            name="volume"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            aria-describedby="volume-helper"
          />
          <select
            aria-label="Unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value as VolumeUnit)}
            className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            <option value="ml">milliliters (ml)</option>
            <option value="l">liters (l)</option>
          </select>
        </div>
        <p id="volume-helper" className="mt-1 text-xs text-neutral-400">
          Density is applied per milliliter. Liters are converted automatically.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="fluid">
          Fluid
        </label>
        <select
          id="fluid"
          name="fluid"
          value={fluid}
          onChange={(event) => setFluid(event.target.value as FluidType)}
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="water">Water (1.00 g/ml)</option>
          <option value="oil">Oil (0.92 g/ml)</option>
        </select>
      </div>

      <div className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-3">
        <h2 className="text-sm font-semibold">Result</h2>
        {grams === null ? (
          <p className="text-sm text-neutral-400">Enter a valid volume to convert.</p>
        ) : (
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-medium">Mass:</span> {grams} g
            </p>
            <p className="text-neutral-400">
              Density used: {density.toFixed(2)} g/ml.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
