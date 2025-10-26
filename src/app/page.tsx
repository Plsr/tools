import { CardSim, Droplet } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">🧰 Chris&apos; Tools</h1>
      <div className="mt-4">
        <Link
          href="/iccid-validator"
          className="flex items-center underline decoration-dashed"
        >
          <CardSim className="h-4 w-4 mr-2" />
          ICCID Validator
        </Link>
      </div>
      <div className="mt-2">
        <Link
          href="/fluid-to-grams"
          className="flex items-center underline decoration-dashed"
        >
          <Droplet className="mr-2 h-4 w-4" />
          Fluid to Grams Converter
        </Link>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chris' Tools",
};
