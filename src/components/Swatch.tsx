import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Container, IconButton, Stack, styled } from '@mui/material';
import type { Color } from 'chroma-js';
import chroma from 'chroma-js';

export interface SwatchValue {
  color: Color;
  isLocked: boolean;
}

interface SwatchProps {
  value: SwatchValue;
  setValue: (value: SwatchValue) => void;
  isHorizontal: boolean;
}

const SwatchControlContainer = styled(Container)(({ theme }) => ({
  opacity: '0',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    opacity: '1',
  },
}));

export default function Swatch({ value, setValue, isHorizontal }: SwatchProps) {
  const isDarkText = value.color.luminance() > 0.35;
  const SwatchContent = isHorizontal ? SwatchContentHorizontal : SwatchContentVertical;
  return (
    <Box
      sx={{
        backgroundColor: value.color.hex('rgb'),
        width: '100%',
        height: '100%',
      }}
    >
      <SwatchContent>
        <IconButton sx={{ color: isDarkText ? '#000' : '#fff' }}>
          <TuneOutlined />
        </IconButton>
        <IconButton
          sx={{ color: isDarkText ? '#000' : '#fff' }}
          disabled={value.isLocked}
          onClick={() => setValue({ ...value, color: chroma.random() })}
        >
          <Casino />
        </IconButton>
        <IconButton
          sx={{ color: isDarkText ? '#000' : '#fff' }}
          onClick={() => {
            setValue({ ...value, isLocked: !value.isLocked });
          }}
        >
          {value.isLocked ? <LockOutlined /> : <LockOpenOutlined />}
        </IconButton>
      </SwatchContent>
    </Box>
  );
}

function SwatchContentVertical({ children }) {
  return (
    <SwatchControlContainer sx={{ height: '100%' }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </SwatchControlContainer>
  );
}

function SwatchContentHorizontal({ children }) {
  return (
    <SwatchControlContainer sx={{ height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </SwatchControlContainer>
  );
}
