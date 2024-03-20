import chroma, { Color } from 'chroma-js';
import { Paper, Tabs, Tab } from '@mui/material';
import SwatchMode from './modes/SwatchMode';
import PaletteMode from './modes/PaletteMode';
import { useMemo, useState } from 'react';

import SwatchContext, { GenerationMode } from './SwatchContext';
import type { Swatch } from './SwatchContext';
import generate from './math/generate';
import { nanoid } from 'nanoid';
import { useImmerReducer } from 'use-immer';
import { swatchReducer } from './SwatchReducer';

const defaultSwatchEntries: [string, Swatch][] = [
  chroma('#383F51'),
  chroma('#DDDBF1'),
  chroma('#3C4F76'),
  chroma('#D1BEB0'),
  chroma('#AB9F9D'),
].map((color) => {
  const id = nanoid();
  return [id, { id, color, isLocked: false }];
});

const defaultSwatchMap = new Map<string, Swatch>(defaultSwatchEntries);

enum Mode {
  Swatch,
  Palette,
  Export,
}

function App() {
  const [swatchMap, dispatchSwatch] = useImmerReducer(swatchReducer, defaultSwatchMap);
  const [mode, setMode] = useState<Mode>(Mode.Swatch);
  // const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.RgbCube);

  /*
  const generateColors = useCallback((colorsGiven: Color[], nColors: number) => (
    generate(colorsGiven, nColors, generationMode)
  ), [generationMode]);
  */

  const swatchContextValue = useMemo(() => ({
    swatches: Array.from(swatchMap.values()),
    dispatchSwatch,
  }), [
    swatchMap,
    dispatchSwatch,
  ]);

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 1,
          position: 'absolute',
          left: '50%',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Tabs value={mode} onChange={(_event, newMode: Mode) => setMode(newMode)}>
          <Tab label="Swatches" value={Mode.Swatch} />
          <Tab label="Palette" value={Mode.Palette} />
          <Tab label="Export" value={Mode.Export} />
        </Tabs>
      </Paper>
      <SwatchContext.Provider value={ swatchContextValue }>
        {mode === Mode.Swatch && (
          <SwatchMode direction="row" />
        )}
        {mode === Mode.Palette && (
          <PaletteMode />
        )}
      </SwatchContext.Provider>
    </>
  );
}

export default App;
