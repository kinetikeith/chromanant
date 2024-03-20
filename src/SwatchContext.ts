import { Color } from "chroma-js";
import { createContext } from "react";
import type { Dispatch } from "react";
import { SwatchAction } from "./SwatchReducer";

interface Swatch {
  id: string;
  color: Color;
  isLocked: boolean;
}

enum GenerationMode {
  Random,
  RgbCube,
}

interface SwatchContextType {
  swatches: Swatch[];
  dispatchSwatch: Dispatch<SwatchAction>;
}

const SwatchContext = createContext<SwatchContextType>({
  swatches: [],
  dispatchSwatch: () => {},
});

export default SwatchContext;
export { GenerationMode };
export type { Swatch };
