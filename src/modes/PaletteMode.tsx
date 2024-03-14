import { Box } from "@mui/material";
import { Color } from "chroma-js";
import { useContext } from "react";
import ColorContext from "../ColorContext";
import { RadarPalette } from "../components/ColorRadar";

export default function PaletteMode() {
  const context = useContext(ColorContext);

  const colors = context.swatchValues.map(value => value.color);

  const setColor = (index: number, color: Color) => {
    const oldSwatch = context.swatchValues[index];
    context.setSwatchValue(index, {...oldSwatch, color});
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={ 12 } width="100%" height="100%" sx={{ containerType: "size" }}>
      <RadarPalette height="min(100cqh, 100cqw)" values={ colors } setValue={ setColor } />
    </Box>
  );
}
