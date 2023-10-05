import { Stack } from '@mui/material';
import Swatch from '../components/Swatch';
import chroma from 'chroma-js';

interface SwatchModeProps {
  direction: 'row' | 'column';
}

export default function SwatchMode({ direction }: SwatchModeProps) {
  const colors = [
    chroma('#383F51'),
    chroma('#DDDBF1'),
    chroma('#3C4F76'),
    chroma('#D1BEB0'),
    chroma('#AB9F9D'),
    chroma('#FF0000'),
  ];

  return (
    <Stack
      direction={direction}
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100%', width: '100%' }}
    >
      {colors.map((color, index) => (
        <Swatch color={color} key={index} isHorizontal={direction === 'column'} />
      ))}
    </Stack>
  );
}
