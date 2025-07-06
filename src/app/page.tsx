import { CardSim } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">🧰 Chris' Tools</h1>
      <div className="mt-4">
        <Link
          href="/iccid-validator"
          className="flex items-center underline decoration-dashed"
        >
          <CardSim className="h-4 w-4 mr-2" />
          ICCID Validator
        </Link>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chris' Tools",
};
