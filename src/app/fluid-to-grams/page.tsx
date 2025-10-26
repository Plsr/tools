import { Metadata } from "next";
import { FluidToGramsForm } from "./FluidToGramsForm";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-md space-y-4 rounded-lg border border-neutral-700 bg-neutral-900 p-4">
        <div>
          <h1 className="text-xl font-bold">Fluid to Grams Converter</h1>
          <p className="text-sm text-neutral-300">
            Convert common kitchen liquids from milliliters or liters to grams using
            their density.
          </p>
        </div>
        <FluidToGramsForm />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Fluid to Grams Converter | Chris' Tools",
  description:
    "Convert water and oil volumes into grams based on their density.",
};
