import { Color } from "chroma-js";
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type ReactSet<Type> = Dispatch<SetStateAction<Type>>;

interface SwatchValue {
  color: Color;
  isLocked: boolean;
}

enum GenerationMode {
  Random,
}

interface ColorContextType {
  swatchValues: SwatchValue[];
  setSwatchValues: ReactSet<SwatchValue[]>;
  generationMode: GenerationMode;
  setGenerationMode: ReactSet<GenerationMode>;
  generateColors: (colorsGiven: Color[], nColors: number) => Color[];
}

const ColorContext = createContext<ColorContextType>({
  swatchValues: [],
  setSwatchValues: () => {},
  generationMode: GenerationMode.Random,
  setGenerationMode: () => {},
  generateColors: () => [],
});

export default ColorContext;
export { GenerationMode };
export type { SwatchValue };
