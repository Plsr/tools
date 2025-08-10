"use client";

import { useEffect, useState } from "react";
import { cssToTailwind } from "./css-to-tailwind";

export const CssToTailwindForm = () => {
  const [css, setCss] = useState("");
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    setClasses(cssToTailwind(css));
  }, [css]);

  return (
    <div>
      <span className="text-sm opacity-70 block mb-2">Enter CSS</span>
      <textarea
        className="border border-neutral-600 p-2 rounded w-full text-neutral-300 h-40 font-mono"
        placeholder={".selector {\n  display: flex;\n}"}
        value={css}
        onChange={(e) => setCss(e.target.value)}
      />
      {classes.length > 0 && (
        <div className="mt-4">
          <span className="text-sm opacity-70 block mb-2">Tailwind classes</span>
          <div className="bg-neutral-800 p-2 rounded break-all">
            {classes.join(" ")}
          </div>
        </div>
      )}
    </div>
  );
};
