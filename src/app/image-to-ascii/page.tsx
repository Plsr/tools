import { Metadata } from "next";
import { ImageToAsciiTool } from "./ImageToAsciiTool";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-2xl p-4 border border-neutral-700 bg-neutral-900 rounded-lg">
        <h1 className="text-xl font-bold mb-4">Image to ASCII</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Upload an image and we&apos;ll convert it to ASCII art right in your
          browser.
        </p>
        <ImageToAsciiTool />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Image to ASCII | Chris' Tools",
  description: "Convert any image to ASCII art directly in your browser.",
};
