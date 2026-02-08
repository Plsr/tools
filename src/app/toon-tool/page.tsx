import { Metadata } from "next";
import { ToonTool } from "./ToonTool";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-6xl p-6 border border-neutral-700 bg-neutral-900 rounded-lg">
        <h1 className="text-xl font-bold mb-3">TOON Formatter</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Convert between TOON and JSON, or generate an easy-to-read TOON
          summary.
        </p>
        <ToonTool />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "TOON Formatter | Chris' Tools",
  description: "Convert TOON to JSON, JSON to TOON, and generate readable TOON.",
};
