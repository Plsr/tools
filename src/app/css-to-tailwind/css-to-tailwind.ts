export const cssToTailwind = (css: string) => {
  const regex = /([\w-]+)\s*:\s*([^;]+);?/g;
  const classes: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(css)) !== null) {
    const property = match[1].trim().toLowerCase();
    const value = match[2].trim().toLowerCase();
    const className = mapPropertyToClass(property, value);
    if (className) {
      classes.push(className);
    }
  }
  return classes;
};

const mapPropertyToClass = (property: string, value: string) => {
  const direct = propertyValueMap[property]?.[value];
  if (direct) {
    return direct;
  }

  if (spacingProperties[property]) {
    const prefix = spacingProperties[property];
    const scale = spacingScale[value];
    if (scale) {
      return `${prefix}-${scale}`;
    }
  }

  if (colorProperties[property]) {
    const prefix = colorProperties[property];
    const color = colorMap[value];
    if (color) {
      return `${prefix}-${color}`;
    }
  }

  return null;
};

const propertyValueMap: Record<string, Record<string, string>> = {
  display: {
    flex: "flex",
    block: "block",
    "inline-block": "inline-block",
  },
  "flex-direction": {
    column: "flex-col",
    row: "flex-row",
  },
  "justify-content": {
    center: "justify-center",
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
  },
  "align-items": {
    center: "items-center",
    "flex-start": "items-start",
    "flex-end": "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  },
  "text-align": {
    center: "text-center",
    left: "text-left",
    right: "text-right",
    justify: "text-justify",
  },
  "font-weight": {
    "400": "font-normal",
    normal: "font-normal",
    "500": "font-medium",
    medium: "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    bold: "font-bold",
  },
};

const spacingProperties: Record<string, string> = {
  margin: "m",
  "margin-top": "mt",
  "margin-bottom": "mb",
  "margin-left": "ml",
  "margin-right": "mr",
  padding: "p",
  "padding-top": "pt",
  "padding-bottom": "pb",
  "padding-left": "pl",
  "padding-right": "pr",
};

const spacingScale: Record<string, string> = {
  "0": "0",
  "0px": "0",
  "4px": "1",
  "0.25rem": "1",
  "8px": "2",
  "0.5rem": "2",
  "16px": "4",
  "1rem": "4",
  "24px": "6",
  "1.5rem": "6",
  "32px": "8",
  "2rem": "8",
};

const colorProperties: Record<string, string> = {
  color: "text",
  "background-color": "bg",
};

const colorMap: Record<string, string> = {
  red: "red-500",
  blue: "blue-500",
  green: "green-500",
  black: "black",
  white: "white",
};
