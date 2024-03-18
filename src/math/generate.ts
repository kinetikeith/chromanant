import chroma, { Color } from "chroma-js";
import { GenerationMode } from '../SwatchContext';
import { range } from "lodash";

function lerp(a: number, b: number, t: number): number {
  return ((1.0 - t) * a) + (t * (b - a));
}

function rgbCube(rMin: number, gMin: number, bMin: number, rMax: number, gMax: number, bMax: number): Color {
  const r = lerp(rMin, rMax, Math.random());
  const g = lerp(gMin, gMax, Math.random());
  const b = lerp(bMin, bMax, Math.random());

  return chroma.rgb(r, g, b);
}

export default function generate(colorsGiven: Color[], nColors: number, mode: GenerationMode): Color[] {
  switch(mode) {
    case GenerationMode.RgbCube:
      {
        let r0 = 0;
        let g0 = 0;
        let b0 = 0;
        let r1 = 255;
        let g1 = 255;
        let b1 = 255;

        if(colorsGiven.length < 2) {
          r1 = Math.random() * 255;
          g1 = Math.random() * 255;
          b1 = Math.random() * 255;
        } if(colorsGiven.length === 0) {
          r0 = Math.random() * 255;
          g0 = Math.random() * 255;
          b0 = Math.random() * 255;
        } else if (colorsGiven.length === 1) {
          [r0, g0, b0] = colorsGiven[0].rgb();
        } else {
          const rVals = colorsGiven.map(color => color.get('rgb.r'));
          const gVals = colorsGiven.map(color => color.get('rgb.g'));
          const bVals = colorsGiven.map(color => color.get('rgb.b'));

          r0 = Math.min(...rVals);
          g0 = Math.min(...gVals);
          b0 = Math.min(...bVals);
   
          r1 = Math.max(...rVals);
          g1 = Math.max(...gVals);
          b1 = Math.max(...bVals);
        }

        return range(nColors).map(() => rgbCube(r0, g0, b0, r1, g1, b1));
      }
    case GenerationMode.Random:
    default:
      return range(nColors).map(() => chroma.random());
  }
}
