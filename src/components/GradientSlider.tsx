import { Slider, SliderProps, styled } from '@mui/material';
import { Color } from 'chroma-js';

interface GradientSliderProps extends SliderProps {
  currentColor?: Color;
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
  currentColor,
  gradientColors,
  ...props
}: GradientSliderProps) {
  const cssHex = gradientColors.map((color) => color.hex()).join(', ');
  return (
    <GradientSliderBase
      slotProps={{
        rail: {
          style: {
            background: `linear-gradient(90deg, ${cssHex})`,
          },
        },
        thumb: {
          style: {
            backgroundColor: currentColor?.hex(),
          },
        },
      }}
      {...props}
    />
  );
}
