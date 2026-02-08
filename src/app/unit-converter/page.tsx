import { Metadata } from "next";
import { UnitConverterTool } from "./UnitConverterTool";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl p-6 border border-neutral-700 bg-neutral-900 rounded-lg">
        <h1 className="text-xl font-bold mb-3">Unit Converter</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Convert cooking amounts between volume and weight with best-effort
          ingredient matching.
        </p>
        <UnitConverterTool />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Unit Converter | Chris' Tools",
  description:
    "Convert between cooking units like cups, grams, and milliliters.",
};
