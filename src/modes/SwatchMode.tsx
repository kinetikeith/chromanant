import { Stack } from '@mui/material';
import Swatch, { SwatchValue } from '../components/Swatch';
import chroma from 'chroma-js';

interface SwatchModeProps {
  direction: 'row' | 'column';
  values: SwatchValue[];
  setValues: (values: SwatchValue[]) => void;
}

export default function SwatchMode({ direction, values, setValues }: SwatchModeProps) {
  const setValue = (newValue: SwatchValue, newIndex: number) => {
    setValues(
      values.map((oldValue, oldIndex) => (oldIndex === newIndex ? newValue : oldValue)),
    );
  };

  const randomizeColors = () => {
    setValues(
      values.map((value) => {
        return value.isLocked ? value : { ...value, color: chroma.random() };
      }),
    );
  };

  return (
    <Stack
      direction={direction}
      alignItems="center"
      justifyContent="center"
      tabIndex={-1}
      sx={{ height: '100%', width: '100%' }}
      onKeyUp={(e) => {
        if (e.code === 'Space') {
          randomizeColors();
          e.preventDefault();
        }
      }}
    >
      {values.map((value, index) => (
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
