import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Container, IconButton, Stack, alpha, styled } from '@mui/material';
import type { IconButtonProps } from '@mui/material';
import type { Color } from 'chroma-js';
import chroma from 'chroma-js';
import { ReactNode } from 'react';

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
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    opacity: '1',
  },
}));

interface SwatchButtonProps extends IconButtonProps {
  isDark: boolean;
}

const SwatchButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<SwatchButtonProps>(({ theme, isDark, disableRipple }) => {
  const color = isDark ? '#000' : '#fff';
  return {
    color,
    // Below is from Mui source code for IconButton
    ...(!disableRipple && {
      '&:hover': {
        backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    }),
    '&.Mui-disabled': {
      color: alpha(color, theme.palette.action.disabledOpacity),
    },
  };
});

export default function Swatch({ value, setValue, isHorizontal }: SwatchProps) {
  const isDark = value.color.luminance() > 0.179;
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
        <SwatchButton isDark={isDark}>
          <TuneOutlined />
        </SwatchButton>
        <SwatchButton
          isDark={isDark}
          disabled={value.isLocked}
          onClick={() => setValue({ ...value, color: chroma.random() })}
        >
          <Casino />
        </SwatchButton>
        <SwatchButton
          isDark={isDark}
          onClick={() => {
            setValue({ ...value, isLocked: !value.isLocked });
          }}
        >
          {value.isLocked ? <LockOutlined /> : <LockOpenOutlined />}
        </SwatchButton>
      </SwatchContent>
    </Box>
  );
}

interface SwatchContentProps {
  children: ReactNode;
}

function SwatchContentVertical({ children }: SwatchContentProps) {
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

function SwatchContentHorizontal({ children }: SwatchContentProps) {
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
