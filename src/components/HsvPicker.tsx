import chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import GradientSlider from './GradientSlider';
import { usePreservedHsv } from '../hooks';

interface HsvPickerProps {
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
}: HsvPickerProps) {
  const [hue, sat, val, setKnownHue, setKnownSat] = usePreservedHsv(color);
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
          setKnownHue(newHue as number);
        }}
        onChangeCommitted={(_event, newHue) => {
          setColorCommitted(chroma.hsv(newHue as number, sat, val));
          setKnownHue(newHue as number);
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
          setKnownSat(newSat as number);
        }}
        onChangeCommitted={(_event, newSat) => {
          setColorCommitted(chroma.hsv(hue, newSat as number, val));
          setKnownSat(newSat as number);
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
          setColorCommitted(chroma.hsv(hue, sat, newVal as number));
        }}
      />
    </>
  );
}
