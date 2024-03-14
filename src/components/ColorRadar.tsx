import { Box, BoxProps, styled } from "@mui/material";
import chroma, { Color } from "chroma-js";
import { useRef, useState, useEffect, RefObject } from "react";
import { DraggableCore } from "react-draggable";

const hueGradientColors = chroma
  .scale(['#ff0000', '#00ff00', '#0000ff', '#ff0000'])
  .mode('hsv')
  .colors(7, null);

const degToRad = Math.PI / 180;

function colorToPositionPolar(color: Color) {
  const [hue, sat, _val] = color.hsv();

  const hueRad = (hue - 90) * degToRad;

  const x = ((Math.cos(hueRad) * sat) - 1) * -0.5;
  const y = ((Math.sin(hueRad) * sat) - 1) * -0.5;

  return [x, y];
}

function positionPolarToHS(x: number, y: number) {
  const xBi = (x * -2) + 1;
  const yBi = (y * -2) + 1;

  const hue = (Math.atan2(yBi, xBi) / degToRad) + 90;
  const sat = Math.min(Math.sqrt((yBi * yBi) + (xBi * xBi)), 1);

  return [hue, sat];
}

function useElementSize(ref: RefObject<HTMLElement>): [number, number] {
  const [elWidth, setElWidth] = useState(1);
  const [elHeight, setElHeight] = useState(1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setElWidth(ref.current?.offsetWidth || 0);
      setElHeight(ref.current?.offsetHeight || 0);
    });

    if(ref.current) resizeObserver.observe(ref.current);
  });

  return [elWidth, elHeight];
}

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
  transform: 'translate(-50%, -50%)',
  boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0px 0px 0px 6px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    boxShadow: '0px 0px 0px 10px rgba(0, 0, 0, 0.15)',
  },
});

interface RadarPaletteProps extends BoxProps {
  values: Color[];
  setValue: (index: number, value: Color) => void;
}

interface RadarPickerProps extends BoxProps {
  value: Color;
  setValue: (value: Color) => void;
}

export function RadarPalette({values, setValue = () => {}, ...props}: RadarPaletteProps) {
  const ref = useRef<HTMLElement>(null);
  const [elWidth, elHeight] = useElementSize(ref);

  return (
    <ColorRadarBackground ref={ ref } {...props}>
      { values.map((value, index) => {
        const [x, y] = colorToPositionPolar(value);
        return (
          <DraggableCore
            onDrag={ (_e, data) => {
              const [hue, sat] = positionPolarToHS(data.x / elWidth, data.y / elHeight);
              const newValue = value.set('hsv.h', hue).set('hsv.s', sat);
              setValue(index, newValue);
            } }
          >
            <ColorRadarChip
              key={ index }
              style={{
                left: x * elWidth,
                top: y * elHeight,
                backgroundColor: value.hex()
              }}
            />
          </DraggableCore>
        )
      })}
    </ColorRadarBackground>
  )
}

export function RadarPicker({value, setValue, ...props}: RadarPickerProps) {
  const ref = useRef<HTMLElement>(null);
  const [elWidth, elHeight] = useElementSize(ref);
  const [x, y] = colorToPositionPolar(value);

  return (
    <ColorRadarBackground ref={ ref } {...props}>
      <DraggableCore
        onDrag={ (_e, data) => {
          const [hue, sat] = positionPolarToHS(data.x / elWidth, data.y / elHeight);
          const newValue = value.set('hsv.h', hue).set('hsv.s', sat);
          setValue(newValue);
        } }
      >
        <ColorRadarChip
          style={{
            left: x * elWidth,
            top: y * elHeight,
            backgroundColor: value.hex(),
            width: '30px',
            height: '30px',
          }}
        />
      </DraggableCore>
    </ColorRadarBackground>
  )
}
