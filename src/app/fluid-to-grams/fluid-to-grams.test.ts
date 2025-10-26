import { describe, expect, test } from "vitest";
import {
  FLUID_DENSITIES,
  convertFluidToGrams,
  convertVolumeToMilliliters,
} from "./fluid-to-grams";

describe("convertVolumeToMilliliters", () => {
  test("returns the same value for milliliters", () => {
    expect(convertVolumeToMilliliters(250, "ml")).toBe(250);
  });

  test("converts liters to milliliters", () => {
    expect(convertVolumeToMilliliters(1.5, "l")).toBe(1500);
  });
});

describe("convertFluidToGrams", () => {
  test("converts water correctly", () => {
    expect(convertFluidToGrams(100, "ml", "water")).toBe(100);
  });

  test("converts oil correctly", () => {
    const grams = convertFluidToGrams(2, "l", "oil");
    expect(grams).toBeCloseTo(1840);
  });

  test("rounds to two decimal places", () => {
    const grams = convertFluidToGrams(1, "ml", "oil");
    expect(grams).toBe(Number((1 * FLUID_DENSITIES.oil).toFixed(2)));
  });
});
