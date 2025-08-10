"use client";

import { useEffect, useState } from "react";
import { validateIccid } from "./iccid-validator";
import { CheckCircleIcon, X } from "lucide-react";

type IccidState = "valid" | "invalid";

export const IccidValidatorForm = () => {
  const [iccid, setIccid] = useState("");
  const [iccidState, setIccidState] = useState<IccidState | null>(null);

  useEffect(() => {
    if (iccid.length === 0) {
      setIccidState(null);
      return;
    }

    const validIccid = validateIccid(iccid);
    setIccidState(validIccid ? "valid" : "invalid");
  }, [iccid]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIccid(event.target.value);
  };

  return (
    <div>
      <span className="text-sm opacity-70 block mb-2">Enter ICCID</span>
      <input
        className="border border-neutral-600 p-2 rounded w-full text-neutral-300"
        placeholder="iccid"
        autoFocus
        value={iccid}
        onChange={handleInputChange}
      />
      <div className="mt-4">
        {iccidState === "valid" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="h-4 w-4" />

            <span>Valid ICCID</span>
          </div>
        )}
        {iccidState === "invalid" && (
          <div className="flex items-center gap-2 text-red-600">
            <X className="h-4 w-4" />

            <span>Invalid ICCID</span>
          </div>
        )}
      </div>
    </div>
  );
};
