import { useContext } from 'react';
import { Stack } from '@mui/material';
import Swatch from '../components/Swatch';
import chroma from 'chroma-js';
import { partition } from 'lodash';

import ColorContext from '../ColorContext';
import type { SwatchValue } from '../ColorContext';

interface SwatchModeProps {
  direction: 'row' | 'column';
}

export default function SwatchMode({ direction }: SwatchModeProps) {
  const context = useContext(ColorContext);

  const setValue = (newValue: SwatchValue, newIndex: number) => {
    context.setSwatchValues(
      context.swatchValues.map((oldValue, oldIndex) => (oldIndex === newIndex ? newValue : oldValue)),
    );
  };

  const randomizeColors = () => {
    context.setSwatchValues(oldValues => {
      const [lockedValues, unlockedValues] = partition(
        oldValues, value => value.isLocked
      );

      const newColors = context.generateColors(
        lockedValues.map(value => value.color),
        unlockedValues.length
      );

      console.log(unlockedValues.length);

      const newValues = oldValues.map(value => {
        if(value.isLocked) return value;

        const color = newColors.shift();
        if(color !== undefined) return {color, isLocked: false};
        else return {color: chroma('#000000'), isLocked: false};
      });

      return newValues;
    });
  };

  return (
    <Stack
      direction={direction}
      alignItems="center"
      justifyContent="center"
      tabIndex={-1}
      sx={{ height: '100%', width: '100%', '&:focus': { outline: 'none' } }}
      onKeyUp={(e) => {
        if (e.code === 'Space') {
          randomizeColors();
          e.preventDefault();
        }
      }}
    >
      {context.swatchValues.map((value, index) => (
        <Swatch
          value={value}
          setValue={(newValue) => setValue(newValue, index)}
          key={index}
          isHorizontal={direction === 'column'}
        />
      ))}
    </Stack>
  );
}
