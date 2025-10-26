export const FLUID_DENSITIES = {
  water: 1,
  oil: 0.92,
} as const;

export type FluidType = keyof typeof FLUID_DENSITIES;

export type VolumeUnit = "ml" | "l";

export function convertVolumeToMilliliters(volume: number, unit: VolumeUnit) {
  if (!Number.isFinite(volume)) {
    throw new Error("Volume must be a finite number");
  }

  switch (unit) {
    case "ml":
      return volume;
    case "l":
      return volume * 1000;
    default: {
      const _exhaustiveCheck: never = unit;
      throw new Error(`Unsupported unit: ${_exhaustiveCheck}`);
    }
  }
}

export function convertFluidToGrams(
  volume: number,
  unit: VolumeUnit,
  fluid: FluidType,
) {
  const volumeInMilliliters = convertVolumeToMilliliters(volume, unit);
  const density = FLUID_DENSITIES[fluid];

  return Number((volumeInMilliliters * density).toFixed(2));
}
