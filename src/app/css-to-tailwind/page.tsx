import { Metadata } from "next";
import { CssToTailwindForm } from "./CssToTailwindForm";

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="w-md p-4 border border-neutral-700 bg-neutral-900 rounded-lg">
        <h1 className="text-xl font-bold mb-4">CSS to Tailwind</h1>
        <CssToTailwindForm />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "CSS to Tailwind | Chris' Tools",
  description: "Convert vanilla CSS rules to Tailwind classes.",
};
