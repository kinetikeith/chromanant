import chroma, { Color } from "chroma-js";
import { GenerationMode } from '../ColorContext';
import { range } from "lodash";

export default function generate(_colorsGiven: Color[], nColors: number, mode: GenerationMode): Color[] {
  switch(mode) {
    case GenerationMode.Random:
    default:
      return range(nColors).map(() => chroma.random());
  }
}
