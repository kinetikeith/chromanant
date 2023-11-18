import chroma, { Color } from 'chroma-js';
import { Paper, Tabs, Tab } from '@mui/material';
import SwatchMode from './modes/SwatchMode';
import { useCallback, useMemo, useState } from 'react';

import ColorContext, { GenerationMode } from './ColorContext';
import type { SwatchValue } from './ColorContext';
import generate from './math/generate';

const defaultSwatchValues = [
  chroma('#383F51'),
  chroma('#DDDBF1'),
  chroma('#3C4F76'),
  chroma('#D1BEB0'),
  chroma('#AB9F9D'),
].map((color) => ({ color, isLocked: false }));

enum Mode {
  Swatch,
  Palette,
  Export,
}

function App() {
  const [swatchValues, setSwatchValues] = useState<SwatchValue[]>(defaultSwatchValues);
  const [mode, setMode] = useState<Mode>(Mode.Swatch);
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.Random);

  const generateColors = useCallback((colorsGiven: Color[], nColors: number) => (
    generate(colorsGiven, nColors, generationMode)
  ), [generationMode]);

  const colorContextValue = useMemo(() => ({
    swatchValues,
    setSwatchValues,
    generationMode,
    setGenerationMode,
    generateColors,
  }), [
    swatchValues,
    setSwatchValues,
    generationMode,
    setGenerationMode,
    generateColors,
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
        }}
      >
        <Tabs value={mode} onChange={(_event, newMode: Mode) => setMode(newMode)}>
          <Tab label="Swatches" value={Mode.Swatch} />
          <Tab label="Palette" value={Mode.Palette} />
          <Tab label="Export" value={Mode.Export} />
        </Tabs>
      </Paper>
      <ColorContext.Provider value={ colorContextValue }>
        {mode === Mode.Swatch && (
          <SwatchMode direction="row" />
        )}
      </ColorContext.Provider>
    </>
  );
}

export default App;
