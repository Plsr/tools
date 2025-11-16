/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_WIDTH = 80;
const ASCII_GRADIENT = "@%#*+=-:. ";

const buildAsciiArt = (
  image: HTMLImageElement,
  width: number,
  gradient: string,
) => {
  const canvas = document.createElement("canvas");
  const scale = width / image.width;
  const height = Math.max(1, Math.round(image.height * scale * 0.55));

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not get canvas context");
  }

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  let ascii = "";

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const gradientIndex = Math.floor(
        ((gradient.length - 1) * (255 - brightness)) / 255,
      );
      ascii += gradient[gradientIndex];
    }
    ascii += "\n";
  }

  return ascii;
};

export const ImageToAsciiTool = () => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [error, setError] = useState<string | null>(null);

  const gradient = useMemo(() => ASCII_GRADIENT, []);

  useEffect(() => {
    if (!imageDataUrl) {
      setAsciiArt("");
      setError(null);
      return undefined;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      try {
        const art = buildAsciiArt(image, width, gradient);
        setAsciiArt(art);
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
  }, [gradient, imageDataUrl, width]);

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

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    setWidth(Math.min(200, Math.max(20, value)));
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

      <div>
        <label className="text-sm opacity-70 block mb-2" htmlFor="ascii-width">
          Output width ({width} characters)
        </label>
        <input
          id="ascii-width"
          type="range"
          min={20}
          max={200}
          value={width}
          onChange={handleWidthChange}
          className="w-full"
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
        <pre className="bg-black/40 p-4 rounded overflow-auto text-xs leading-[0.8rem] whitespace-pre text-green-400 border border-neutral-800 min-h-40">
          {asciiArt || "Upload an image to generate ASCII art."}
        </pre>
      </div>
    </div>
  );
};
