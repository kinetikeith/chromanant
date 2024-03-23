import { BoxProps } from "@mui/material";
import chroma, { Color } from "chroma-js";
import { useRef } from "react";
import GradientSlider from "./GradientSlider";
import { useElementSize, usePreservedHsv } from "../hooks";
import { ColorRadarBackground, DraggableRadarChip } from "./ColorRadar";

interface RadarPickerProps {
  color: Color;
  setColor: (color: Color) => void;
  setColorCommitted?: (color: Color) => void;

  backgroundProps?: BoxProps;
}

const black = chroma("#000000");

export function RadarPicker({
  color,
  setColor,
  setColorCommitted = () => {},
  backgroundProps = {},
}: RadarPickerProps) {
  const ref = useRef<HTMLElement>(null);
  const parentSize = useElementSize(ref);
  const [hue, sat, val, setKnownHue, setKnownSat] = usePreservedHsv(color);
  const valGradientColors = [black, chroma.hsv(hue, sat, 1.0)];

  return (
    <>
      <ColorRadarBackground ref={ ref } { ...backgroundProps }>
        <DraggableRadarChip
          parentSize={ parentSize }
          color={ color }
          hue={ hue }
          sat={ sat }
          setHueSat={ (newHue, newSat) => {
            setKnownHue(newHue);
            setKnownSat(newSat);
            setColor(chroma.hsv(newHue,newSat, val));
          } }
          setHueSatCommitted={ (newHue, newSat) => {
            setKnownHue(newHue);
            setKnownSat(newSat);
            setColorCommitted(chroma.hsv(newHue,newSat, val));
          } }
        />
      </ColorRadarBackground>
      <GradientSlider
        gradientColors={valGradientColors}
        color={color}
        value={val}
        step={0.01}
        min={0.0}
        max={1.0}
        onChange={(_event, newVal) => {
          setColor(chroma.hsv(hue, sat, newVal as number));
        }}
        onChangeCommitted={(_event, newVal) => {
          setColorCommitted(chroma.hsv(hue, sat, newVal as number));
        }}
      />
    </>
  )
}
