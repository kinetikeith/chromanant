import chroma from 'chroma-js';
import { Paper, Tabs, Tab } from '@mui/material';
import SwatchMode from './modes/SwatchMode';
import { useState } from 'react';
import type { SwatchValue } from './components/Swatch';

const defaultValues = [
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
  const [values, setValues] = useState<SwatchValue[]>(defaultValues);
  const [mode, setMode] = useState<Mode>(Mode.Swatch);

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
      {mode === Mode.Swatch && (
        <SwatchMode direction="row" values={values} setValues={setValues} />
      )}
    </>
  );
}

export default App;
