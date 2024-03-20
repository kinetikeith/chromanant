import { Box } from "@mui/material";
import { useContext } from "react";
import SwatchContext from "../SwatchContext";
import { RadarPalette } from "../components/ColorRadar";

export default function PaletteMode() {
  const context = useContext(SwatchContext);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={ 12 } width="100%" height="100%" sx={{ containerType: "size" }}>
      <RadarPalette
        height="min(100cqh, 100cqw)"
        swatches={ context.swatches }
        dispatchSwatch={ context.dispatchSwatch }
      />
    </Box>
  );
}
