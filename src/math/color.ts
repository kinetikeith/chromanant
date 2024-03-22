import { Color } from "chroma-js";

export function cleanHsv(color: Color) {
  const [hue, sat, val] = color.hsv();
  return [isNaN(hue) ? 0 : hue, sat, val];
}
