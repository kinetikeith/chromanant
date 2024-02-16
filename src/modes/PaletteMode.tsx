import { Box, styled } from "@mui/material";
import chroma, { Color } from "chroma-js";
import { useContext } from "react";
import ColorContext from "../ColorContext";


const hueGradientColors = chroma
  .scale(['#ff0000', '#00ff00', '#0000ff', '#ff0000'])
  .mode('hsv')
  .colors(7, null);

const ColorRadarBackground = styled(Box)({
  borderRadius: '50%',
  aspectRatio: '1',
  background: `radial-gradient(closest-side, white, rgba(255, 255, 255, 0.0)), conic-gradient(from 180deg, ${hueGradientColors})`,
  containerType: 'size',
});

const ColorRadarChip = styled('span')({
  position: 'absolute',
  borderRadius: '50%',
  border: '3px solid white',
  width: '30px',
  height: '30px',
  transform: 'translate(50%, 50%)',
  boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.1)',
});

const degToRad = Math.PI / 180;

function colorToCssPosition(color: Color) {
  const [hue, sat, _val] = color.hsv();

  const hueRad = (hue - 90) * degToRad;

  const x = ((Math.cos(hueRad) * sat) + 1) * 50;
  const y = ((Math.sin(hueRad) * sat) + 1) * 50;

  return [x, y];
}

function ColorRadar({colors, size}: {colors: Color[], size: number}) {
  return (
    <ColorRadarBackground width={ size } height={ size }>
      { colors.map((color, index) => {
        const [x, y] = colorToCssPosition(color);
        return (
          <ColorRadarChip
            key={ index }
            style={{
              bottom: `${y}%`,
              right: `${x}%`,
              backgroundColor: color.hex()
            }}
          />
        )
      })}
    </ColorRadarBackground>
  )
}

export default function PaletteMode() {
  const context = useContext(ColorContext);

  const colors = context.swatchValues.map(value => value.color);
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <ColorRadar size={ '100vh' } colors={ colors } />
    </Box>
  );
}
