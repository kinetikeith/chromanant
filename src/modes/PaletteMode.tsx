import { Box } from "@mui/material";
import { useCallback, useContext, SetStateAction, useMemo } from "react";
import SwatchContext, { SetSwatchesFunc, Swatch } from "../SwatchContext";
import { RadarPalette } from "../components/ColorRadar";
import { Color } from "chroma-js";

export function useSwatch(index: number, setSwatches: SetSwatchesFunc) {
  const setSwatch = useCallback((swatch: SetStateAction<Swatch>) => {
    if(typeof swatch === 'function') {
      setSwatches((oldSwatches) => {
        const oldSwatch = oldSwatches[index];
        if(oldSwatch !== undefined) {
          const newSwatch = swatch(oldSwatch);
          const newSwatches = [...oldSwatches];
          newSwatches[index] = newSwatch;
          return newSwatches;
        } else {
          return oldSwatches;
        }
      });
    } else {
      setSwatches((oldSwatches) => {
        const newSwatches = [...oldSwatches];
        newSwatches[index] = swatch;
        return newSwatches;
      });
    }
  }, [index, setSwatches]);

  return {setSwatch};
}

export default function PaletteMode() {
  const context = useContext(SwatchContext);

  const colors = useMemo(() => context.swatches.map(swatch => swatch.color), [context.swatches]);

  const setColor = useCallback((index: number, color: Color) => {
    context.setSwatches((oldSwatches) => {
      const oldSwatch = oldSwatches[index];
      if(oldSwatch === undefined) return oldSwatches;

      const newSwatch = {...oldSwatch, color};
      const newSwatches = [...oldSwatches];
      newSwatches[index] = newSwatch;

      return newSwatches;
    });
  }, [context.setSwatches]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={ 12 } width="100%" height="100%" sx={{ containerType: "size" }}>
      <RadarPalette height="min(100cqh, 100cqw)" colors={ colors } setColor={ setColor } />
    </Box>
  );
}
