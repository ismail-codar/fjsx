export type ColorFormat = "rgb" | "rgba" | "hsl" | "hsla";
export interface ColorObject {
  type: ColorFormat;
  values: [number, number, number] | [number, number, number, number];
}

export function recomposeColor(color: ColorObject);
export function convertHexToRGB(hex);
export function decomposeColor(color): ColorObject;
export function getContrastRatio(foreground, background);
export function getLuminance(color);
export function emphasize(color, coefficient?);
export function fade(color, value);
export function darken(color, coefficient?);
export function lighten(color, coefficient?);
