import { Layers, Palette } from '@mui/icons-material';
import { Box, Container, IconButton, Stack } from '@mui/material';
import type { Color } from 'chroma-js';

interface SwatchProps {
  color: Color;
  isHorizontal: boolean;
}

export default function Swatch({ color, isHorizontal }: SwatchProps) {
  const isDarkText = color.luminance() > 0.3;
  const SwatchContent = isHorizontal ? SwatchContentHorizontal : SwatchContentVertical;
  return (
    <Box
      sx={{
        backgroundColor: color.hex('rgb'),
        width: '100%',
        height: '100%',
      }}
    >
      <SwatchContent>
        <IconButton sx={{ color: isDarkText ? '#000' : '#fff' }}>
          <Palette />
        </IconButton>
        <IconButton sx={{ color: isDarkText ? '#000' : '#fff' }}>
          <Layers />
        </IconButton>
      </SwatchContent>
    </Box>
  );
}

function SwatchContentVertical({ children }) {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </Container>
  );
}

function SwatchContentHorizontal({ children }) {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </Container>
  );
}
