import { CardSim, Palette } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">🧰 Chris&apos; Tools</h1>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/iccid-validator"
          className="flex items-center underline decoration-dashed"
        >
          <CardSim className="h-4 w-4 mr-2" />
          ICCID Validator
        </Link>
        <Link
          href="/css-to-tailwind"
          className="flex items-center underline decoration-dashed"
        >
          <Palette className="h-4 w-4 mr-2" />
          CSS to Tailwind
        </Link>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chris' Tools",
};
