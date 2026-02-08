import { Beaker, CardSim, Image as ImageIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">🧰 Chris&apos; Tools</h1>
      <div className="mt-4 space-y-2">
        <Link
          href="/iccid-validator"
          className="flex items-center underline decoration-dashed"
        >
          <CardSim className="h-4 w-4 mr-2" />
          ICCID Validator
        </Link>
        <Link
          href="/image-to-ascii"
          className="flex items-center underline decoration-dashed"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Image to ASCII
        </Link>
        <Link
          href="/unit-converter"
          className="flex items-center underline decoration-dashed"
        >
          <Beaker className="h-4 w-4 mr-2" />
          Unit Converter
        </Link>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chris' Tools",
};
