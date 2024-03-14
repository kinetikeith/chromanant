import { Slider, SliderProps, styled } from '@mui/material';
import { Color } from 'chroma-js';
import { useMemo } from 'preact/hooks';

interface GradientSliderProps extends SliderProps {
  colorValue?: Color;
  gradientColors: Color[];
}

const GradientSliderBase = styled(Slider)({
  color: '#fff',
  height: 8,
  '& .MuiSlider-track': {
    display: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: '1',
  },
  '& .MuiSlider-thumb': {
    width: 20,
    height: 20,
    border: '5px solid currentColor',
    boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.1)',
    '&:before': {
      boxShadow: 'none',
    },
    '&:hover': {
      boxShadow: '0px 0px 0px 6px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
      boxShadow: '0px 0px 0px 10px rgba(0, 0, 0, 0.15)',
    },
  },
});

export default function GradientSlider({
  colorValue,
  gradientColors,
  ...props
}: GradientSliderProps) {
  const gradientCss = useMemo(() => {
    const cssHex = gradientColors.map((color) => color.hex()).join(', ');
    return `linear-gradient(90deg, ${cssHex})`;
  }, [gradientColors]);

  return (
    <GradientSliderBase
      slotProps={{
        rail: {
          style: {
            background: gradientCss,
          },
        },
        thumb: {
          style: {
            backgroundColor: colorValue?.hex(),
          },
        },
      }}
      {...props}
    />
  );
}
