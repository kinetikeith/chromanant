import { useState, useMemo, useEffect } from 'react';
import type { RefObject } from 'react';
import { Paper, Stack } from '@mui/material';
import type { PaperProps } from '@mui/material';
import chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import GradientSlider from './GradientSlider';

interface ColorPickerProps extends PaperProps {
  innerRef?: RefObject<HTMLDivElement>;
  colorValue: Color;
  setColorValue: (color: Color) => void;
}

const hueGradientColors = chroma
  .scale(['#ff0000', '#00ff00', '#0000ff', '#ff0000'])
  .mode('hsv')
  .colors(12, null);

export default function ColorPicker({
  colorValue,
  setColorValue,
  innerRef,
  ...props
}: ColorPickerProps) {
  const [currentHue, currentSat, val] = colorValue.hsv();
  const [lastHue, setLastHue] = useState<number>(0);
  const [lastSat, setLastSat] = useState<number>(0);

  const hue = useMemo(() => (isNaN(currentHue) ? lastHue : currentHue), [lastHue, currentHue]);
  const sat = useMemo(() => (currentSat === 0 ? lastSat : currentSat), [lastSat, currentSat]);

  useEffect(() => {
    if (!isNaN(currentHue)) setLastHue(currentHue);
    if (val !== 0) setLastSat(currentSat);
  }, [currentHue, currentSat, val]);

  const satGradientColors = [chroma.hsv(hue, 0, val), chroma.hsv(hue, 1, val)];
  const valGradientColors = [chroma.hsv(hue, sat, 0), chroma.hsv(hue, sat, 1)];

  return (
    <Paper ref={innerRef} {...props} sx={{ px: 3, py: 2, ...props.sx }}>
      <Stack spacing={1}>
        <GradientSlider
          value={hue}
          min={0}
          max={359}
          colorValue={colorValue}
          gradientColors={hueGradientColors}
          onChange={(_event, newHue) => {
            setColorValue(chroma.hsv(newHue as number, sat, val));
            setLastHue(newHue as number);
          }}
        />
        <GradientSlider
          gradientColors={satGradientColors}
          colorValue={colorValue}
          value={sat}
          step={0.001}
          min={0.0}
          max={1.0}
          onChange={(_event, newSat) => {
            setColorValue(chroma.hsv(hue, newSat as number, val));
            setLastSat(newSat as number);
          }}
        />
        <GradientSlider
          gradientColors={valGradientColors}
          colorValue={colorValue}
          value={val}
          step={0.001}
          min={0.0}
          max={1.0}
          onChange={(_event, newVal) => {
            setColorValue(chroma.hsv(hue, sat, newVal as number));
          }}
        />
      </Stack>
    </Paper>
  );
}
