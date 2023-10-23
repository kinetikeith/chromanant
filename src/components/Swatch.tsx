import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Container, IconButton, Stack, Collapse, alpha, styled } from '@mui/material';
import type { IconButtonProps, ContainerProps } from '@mui/material';
import type { Color } from 'chroma-js';
import chroma from 'chroma-js';

import ColorPicker from './ColorPicker';
import { useFocusLogic, useHoverLogic } from '../hooks';

export interface SwatchValue {
  color: Color;
  isLocked: boolean;
}

interface SwatchProps {
  value: SwatchValue;
  setValue: (value: SwatchValue) => void;
  isHorizontal: boolean;
}

interface SwatchControlsProps extends ContainerProps {
  shouldShow: boolean;
}

const SwatchControls = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'shouldShow',
})<SwatchControlsProps>(({ theme, shouldShow }) => ({
  [`.MuiIconButton-root`]: {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
    }),
    opacity: shouldShow ? '1' : '0',
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

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);
  const [isPickerActive, setIsPickerActive, handlePickerFocus, handlePickerBlur] =
    useFocusLogic(colorPickerRef, [pickerButtonRef]);

  return (
    <Box
      style={{ backgroundColor: value.color.hex() }}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <SwatchContent>
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
        <SwatchButton
          style={{ ...(isPickerActive && { opacity: '1' }) }}
          ref={pickerButtonRef}
          isDark={isDark}
          onClick={() => setIsPickerActive(!isPickerActive)}
        >
          <TuneOutlined />
        </SwatchButton>
        <Collapse in={isPickerActive} sx={{ width: '100%' }}>
          <ColorPicker
            sx={{ width: '100%' }}
            colorValue={value.color}
            setColorValue={(colorValue) => setValue({ ...value, color: colorValue })}
            innerRef={colorPickerRef}
            onFocus={handlePickerFocus}
            onBlur={handlePickerBlur}
            tabIndex={0}
          />
        </Collapse>
      </SwatchContent>
    </Box>
  );
}

const hideDelay = 3000;

function SwatchContentVertical({ children }: SwatchContentProps) {
  const [shouldShow, handleMouseMove, handleMouseLeave] = useHoverLogic(hideDelay);

  return (
    <SwatchControls
      shouldShow={shouldShow}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ height: '100%' }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </SwatchControls>
  );
}

function SwatchContentHorizontal({ children }: SwatchContentProps) {
  const [shouldShow, handleMouseMove, handleMouseLeave] = useHoverLogic(hideDelay);

  return (
    <SwatchControls
      shouldShow={shouldShow}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ height: '100%' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%' }}
      >
        {children}
      </Stack>
    </SwatchControls>
  );
}
