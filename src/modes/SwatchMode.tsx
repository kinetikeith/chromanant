import { KeyboardEvent, useCallback, useContext } from 'react';
import { Stack } from '@mui/material';

import SwatchContext from '../SwatchContext';
import type { Swatch } from '../SwatchContext';
import SwatchBar from '../components/SwatchBar';

interface SwatchModeProps {
  direction: 'row' | 'column';
}

export default function SwatchMode({ direction }: SwatchModeProps) {
  const context = useContext(SwatchContext);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      context.dispatchSwatch({type: "randomizeMany", ids: "unlocked"});
      e.preventDefault();
    }
  }, [context.dispatchSwatch]);

  return (
    <Stack
      direction={direction}
      alignItems="center"
      justifyContent="center"
      tabIndex={-1}
      sx={{ height: '100%', width: '100%', '&:focus': { outline: 'none' } }}
      onKeyUp={handleKeyUp}
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
