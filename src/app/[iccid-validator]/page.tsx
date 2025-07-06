import { Metadata } from "next";
import { IccidValidatorForm } from "./IccidValidatorForm";

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="w-md p-4 border border-neutral-700 bg-neutral-900 rounded-lg">
        <h1 className="text-xl font-bold mb-4">ICCID Validator</h1>
        <div>
          <IccidValidatorForm />
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "ICCID Validator | Chris' Tools",
  description: "Validate if the number you have is a valid ICCID.",
};
