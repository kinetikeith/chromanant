import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Container, IconButton, Stack, Collapse, Paper, Slider, alpha, styled } from '@mui/material';
import type { IconButtonProps } from '@mui/material';
import type { Color } from 'chroma-js';
import chroma from 'chroma-js';
import { ReactNode, useState } from 'react';

export interface SwatchValue {
  color: Color;
}

interface SwatchProps {
  value: SwatchValue;
  setValue: (value: SwatchValue) => void;
  isHorizontal: boolean;
}

const SwatchControlContainer = styled(Container)(({ theme }) => ({
  [`.MuiIconButton-root`]: {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
    }),
    opacity: '0',
  },
  [`&:hover .MuiIconButton-root`]: {
    opacity: '1',
  },
}));

interface SwatchButtonProps extends IconButtonProps {
  isDark: boolean;
  isLocked?: boolean;
}

interface SwatchContentProps {
  children: ReactNode;
}

const SwatchButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['isDark', 'isLocked'].includes(prop as string),
})<SwatchButtonProps>(({ theme, isDark, isLocked, disableRipple }) => {
  const color = isDark ? '#000' : '#fff';
  return {
    color,
    ...(isLocked && {
      opacity: '1',
    }),
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
  const [showControls, setShowControls] = useState<boolean>(false);

  const [hue, sat, val] = value.color.hsv();

  return (
    <Box
      sx={{
        backgroundColor: value.color.hex('rgb'),
        width: '100%',
        height: '100%',
      }}
    >
      <SwatchContent>
        <SwatchButton
          isDark={isDark}
          onClick={() => {
            setShowControls(!showControls);
          }}
        >
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
          style={{ ...(value.isLocked && { opacity: '1' }) }}
          onClick={() => {
            setValue({ ...value, isLocked: !value.isLocked });
          }}
        >
          {value.isLocked ? <LockOutlined /> : <LockOpenOutlined />}
        </SwatchButton>
        <Collapse in={showControls} sx={{width: "100%"}}>
          <Paper sx={{width: "100%", p: 1}}>
            <Stack spacing={ 1 }>
              <Slider
                value={hue}
                min={0}
                max={359}
                onChange={(_event, newHue) => {
                  setValue({
                    ...value,
                    color: chroma.hsv(newHue as number, sat, val)
                  });
                }}
              />
              <Slider
                value={sat}
                step={0.001}
                min={0.0}
                max={1.0}
                onChange={(_event, newSat) => {
                  console.log(newSat);
                  setValue({
                    ...value,
                    color: chroma.hsv(hue, newSat as number, val)
                  })
                }}/>
              <Slider
                value={val}
                step={0.001}
                min={0.0}
                max={1.0}
                onChange={(_event, newVal) => {
                  setValue({
                    ...value,
                    color: chroma.hsv(hue, sat, newVal as number)
                  })
                }}/>
            </Stack>
          </Paper>
        </Collapse>
      </SwatchContent>
    </Box>
  );
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
