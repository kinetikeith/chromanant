import { BoxProps } from "@mui/material";
import chroma, { Color } from "chroma-js";
import { useRef } from "react";
import GradientSlider from "./GradientSlider";
import { useElementSize } from "../hooks";
import { ColorRadarBackground, DraggableRadarChip } from "./ColorRadar";
import { isNaN } from "lodash";

interface RadarPickerProps extends Omit<BoxProps, 'color'> {
  color: Color;
  setColor: (color: Color) => void;
  setColorCommitted?: (color: Color) => void;
}

const black = chroma("#000000");

export function RadarPicker({
  color,
  setColor,
  setColorCommitted = () => {},
  ...props
}: RadarPickerProps) {
  const ref = useRef<HTMLElement>(null);
  const parentSize = useElementSize(ref);
  const val = color.get('hsv.v');
  const valGradientColors = [black, color.set('hsv.v', 1)];

  return (
    <>
      <ColorRadarBackground ref={ ref } { ...props }>
        <DraggableRadarChip
          parentSize={ parentSize }
          color={ color }
          setColor={ setColor }
          setColorCommitted={ setColorCommitted }
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
          setColor(color.set('hsv.v', newVal as number));
        }}
        onChangeCommitted={(_event, newVal) => {
          setColorCommitted(color.set('hsv.v', newVal as number));
        }}
      />
    </>
  )
}
