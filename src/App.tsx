import chroma from 'chroma-js';
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

function App() {
  const [values, setValues] = useState<SwatchValue[]>(defaultValues);
  return <SwatchMode direction="row" values={values} setValues={setValues} />;
}

export default App;
