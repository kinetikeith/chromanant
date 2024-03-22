import { useState, useMemo, useEffect } from 'react';
import type { PaperProps } from '@mui/material';
import chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import GradientSlider from './GradientSlider';
import { cleanHsv } from '../math/color';

interface HsvPickerProps extends Omit<PaperProps, 'color'> {
  color: Color;
  setColor: (color: Color) => void;
  setColorCommitted?: (color: Color) => void;
}

const hueGradientColors = chroma
  .scale(['#ff0000', '#00ff00', '#0000ff', '#ff0000'])
  .mode('hsv')
  .colors(12, null);

export default function HsvPicker({
  color,
  setColor,
  setColorCommitted = () => {},
  ...props
}: HsvPickerProps) {
  const [currentHue, currentSat, val] = useMemo(() => cleanHsv(color), [color]);
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
    <>
      <GradientSlider
        value={hue}
        min={0}
        max={359}
        color={color}
        gradientColors={hueGradientColors}
        onChange={(_event, newHue) => {
          setColor(chroma.hsv(newHue as number, sat, val));
          setLastHue(newHue as number);
        }}
        onChangeCommitted={(_event, newHue) => {
          setColorCommitted(chroma.hsv(newHue as number, sat, val));
          setLastHue(newHue as number);
        }}
      />
      <GradientSlider
        gradientColors={satGradientColors}
        color={color}
        value={sat}
        step={0.01}
        min={0.0}
        max={1.0}
        onChange={(_event, newSat) => {
          setColor(chroma.hsv(hue, newSat as number, val));
          setLastSat(newSat as number);
        }}
        onChangeCommitted={(_event, newSat) => {
          setColorCommitted(chroma.hsv(hue, newSat as number, val));
          setLastSat(newSat as number);
        }}
      />
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
          setColor(chroma.hsv(hue, sat, newVal as number));
        }}
      />
    </>
  );
}
