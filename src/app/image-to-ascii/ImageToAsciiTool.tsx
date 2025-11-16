/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

const MIN_OUTPUT_WIDTH = 160;
const MAX_OUTPUT_WIDTH = 240;
const WIDTH_SCALE = 0.85;
const DEFAULT_BUCKETS = 32;
const DEFAULT_VERTICAL_SCALE = 1.1;
const OUTPUT_FONT_SIZE = 7;
const OUTPUT_LINE_HEIGHT = 0.58;

const BASE_ASCII_GRADIENT =
  " .'`\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const buildAsciiArt = (
  image: HTMLImageElement,
  width: number,
  buckets: number,
  verticalScale: number,
) => {
  const canvas = document.createElement("canvas");
  const scale = width / image.width;
  const height = Math.max(1, Math.round(image.height * scale * verticalScale));

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not get canvas context");
  }

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  const pixelCount = width * height;
  const brightnessValues = new Float32Array(pixelCount);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const pixelIndex = y * width + x;
      brightnessValues[pixelIndex] = brightness;
    }
  }

  const gradient = BASE_ASCII_GRADIENT;
  const bucketSize = 255 / Math.max(1, buckets - 1);
  let ascii = "";

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const brightness = brightnessValues[y * width + x];
      const smoothedBrightness = Math.round(brightness / bucketSize) * bucketSize;
      const gradientIndex = Math.floor(
        ((gradient.length - 1) * (255 - smoothedBrightness)) / 255,
      );
      const safeIndex = Number.isFinite(gradientIndex)
        ? clamp(gradientIndex, 0, gradient.length - 1)
        : 0;
      ascii += gradient.charAt(safeIndex) || " ";
    }
    ascii += "\n";
  }

  return ascii;
};

export const ImageToAsciiTool = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState("");
  const [outputWidth, setOutputWidth] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageDataUrl) {
      setAsciiArt("");
      setError(null);
      setOutputWidth(null);
      return undefined;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      try {
        const derivedWidth = clamp(
          Math.round(image.width * WIDTH_SCALE),
          MIN_OUTPUT_WIDTH,
          MAX_OUTPUT_WIDTH,
        );
        const art = buildAsciiArt(image, derivedWidth, DEFAULT_BUCKETS, DEFAULT_VERTICAL_SCALE);
        setAsciiArt(art);
        setOutputWidth(derivedWidth);
        setError(null);
      } catch (conversionError) {
        setError(
          conversionError instanceof Error
            ? conversionError.message
            : "Unable to convert image to ASCII.",
        );
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setError("Could not load the selected image.");
      }
    };

    image.src = imageDataUrl;

    return () => {
      cancelled = true;
    };
  }, [imageDataUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm opacity-70 block mb-2">Upload image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-300 file:mr-4 file:rounded file:border-0 file:bg-neutral-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-neutral-100 hover:file:bg-neutral-700"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {imageDataUrl && (
        <div>
          <span className="text-sm opacity-70 block mb-2">Preview</span>
          <img
            src={imageDataUrl}
            alt="Uploaded preview"
            className="max-h-48 rounded border border-neutral-800"
          />
        </div>
      )}

      <div>
        <span className="text-sm opacity-70 block mb-2">ASCII output</span>
        <div className="space-y-2">
          <div className="text-xs text-neutral-400">
            {outputWidth
              ? `Rendered at ${outputWidth} columns for maximum detail.`
              : "Upload to see a high-resolution ASCII render."}
          </div>
          <pre
            className="bg-black/40 p-4 rounded overflow-auto whitespace-pre text-green-400 border border-neutral-800 min-h-40"
            style={{
              fontSize: `${OUTPUT_FONT_SIZE}px`,
              lineHeight: `${OUTPUT_FONT_SIZE * OUTPUT_LINE_HEIGHT}px`,
              letterSpacing: "0.4px",
            }}
          >
            {asciiArt || "Upload an image to generate ASCII art."}
          </pre>
        </div>
      </div>
    </div>
  );
};
