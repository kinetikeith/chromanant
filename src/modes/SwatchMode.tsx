import { useContext } from 'react';
import { Stack } from '@mui/material';
import chroma from 'chroma-js';
import { partition } from 'lodash';

import SwatchContext from '../SwatchContext';
import type { Swatch } from '../SwatchContext';
import SwatchBar from '../components/SwatchBar';

interface SwatchModeProps {
  direction: 'row' | 'column';
}

export default function SwatchMode({ direction }: SwatchModeProps) {
  const context = useContext(SwatchContext);

  const setSwatch = (newSwatch: Swatch, newIndex: number) => {
    context.setSwatches(
      context.swatches.map((oldSwatch, oldIndex) => (oldIndex === newIndex ? newSwatch : oldSwatch)),
    );
  };

  const randomizeColors = () => {
    context.setSwatches(oldSwatches => {
      /*
      const [lockedSwatches, unlockedSwatches] = partition(
        oldSwatches, swatch => swatch.isLocked
      );

      const newColors = context.generateColors(
        lockedSwatches.map(swatch => swatch.color),
        unlockedSwatches.length
      );

      const newSwatches = oldSwatches.map(swatch => {
        if(swatch.isLocked) return swatch;

        const color = newColors.shift();
        if(color !== undefined) return {color, isLocked: false};
        else return {color: chroma('#000000'), isLocked: false};
      });

      return newSwatches;
      */
      return oldSwatches;
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
      {context.swatches.map((swatch, index) => (
        <SwatchBar
          swatch={swatch}
          setSwatch={(newSwatch) => setSwatch(newSwatch, index)}
          key={index}
          isHorizontal={direction === 'column'}
        />
      ))}
    </Stack>
  );
}
