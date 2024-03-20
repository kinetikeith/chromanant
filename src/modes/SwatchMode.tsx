import { useContext } from 'react';
import { Stack } from '@mui/material';
import chroma from 'chroma-js';
import { mapValues, partition } from 'lodash';

import SwatchContext from '../SwatchContext';
import type { Swatch } from '../SwatchContext';
import SwatchBar from '../components/SwatchBar';

interface SwatchModeProps {
  direction: 'row' | 'column';
}

export default function SwatchMode({ direction }: SwatchModeProps) {
  const context = useContext(SwatchContext);

  const randomizeColors = () => {
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
      { context.swatches.map((swatch: Swatch) => (
        <SwatchBar
          swatch={swatch}
          key={swatch.id}
          dispatchSwatch={context.dispatchSwatch}
          isHorizontal={direction === 'column'}
        />
      ))}
    </Stack>
  );
}
