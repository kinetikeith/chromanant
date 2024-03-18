import { Color } from "chroma-js";
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type ReactSet<Type> = Dispatch<SetStateAction<Type>>;

interface Swatch {
  color: Color;
  isLocked: boolean;
}

type SetSwatchesFunc = ReactSet<Swatch[]>;

enum GenerationMode {
  Random,
  RgbCube,
}

interface SwatchContextType {
  swatches: Swatch[];
  setSwatches: ReactSet<Swatch[]>;
}

const SwatchContext = createContext<SwatchContextType>({
  swatches: [],
  setSwatches: () => {},
});

export default SwatchContext;
export { GenerationMode };
export type { Swatch, SetSwatchesFunc };
