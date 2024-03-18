import { useCallback, useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Container, IconButton, Stack, Collapse, alpha, styled } from '@mui/material';
import type { IconButtonProps, ContainerProps } from '@mui/material';
import chroma from 'chroma-js';

import ColorPicker from './ColorPicker';
import { useFocusLogic, useHoverLogic } from '../hooks';
import type { Swatch } from '../SwatchContext';
import SwatchContext from '../SwatchContext';
import { RadarPicker } from './ColorRadar';

interface SwatchBarProps {
  swatch: Swatch;
  setSwatch: (swatch: Swatch) => void;
  isHorizontal: boolean;
}

interface SwatchBarControlsProps extends ContainerProps {
  shouldShow: boolean;
}

const SwatchBarControls = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'shouldShow',
})<SwatchBarControlsProps>(({ theme, shouldShow }) => ({
  [`.MuiIconButton-root`]: {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
    }),
    opacity: shouldShow ? '1' : '0',
  },
}));

interface SwatchBarButtonProps extends IconButtonProps {
  isDark: boolean;
  isLocked?: boolean;
}

interface SwatchBarContentProps {
  children: ReactNode;
}

const SwatchBarButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['isDark', 'isLocked'].includes(prop as string),
})<SwatchBarButtonProps>(({ theme, isDark, isLocked, disableRipple }) => {
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

export default function SwatchBar({ swatch, setSwatch, isHorizontal }: SwatchBarProps) {
  const isDark = swatch.color.luminance() > 0.179;
  const SwatchBarContent = isHorizontal ? SwatchBarContentHorizontal : SwatchBarContentVertical;
  const context = useContext(SwatchContext);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);
  const [isPickerActive, setIsPickerActive, _handlePickerFocus, _handlePickerBlur] =
    useFocusLogic(colorPickerRef, [pickerButtonRef]);

  const randomizeColor = useCallback(() => {
    /* const otherColors = context.swatches
    .filter(tSwatch => tSwatch != swatch)
    .map(swatch => swatch.color);

    const color = context.generateColors(otherColors, 1).shift() || chroma("#000000");
    */
    const color = swatch.color;
    setSwatch({...swatch, color});
  }, [context, swatch, setSwatch]);


  return (
    <Box
      style={{ backgroundColor: swatch.color.hex() }}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <SwatchBarContent>
        <SwatchBarButton
          isDark={isDark}
          disabled={swatch.isLocked}
          onClick={randomizeColor}
        >
          <Casino />
        </SwatchBarButton>
        <SwatchBarButton
          isDark={isDark}
          style={{ ...(swatch.isLocked && { opacity: '1' }) }}
          onClick={() => {
            setSwatch({ ...swatch, isLocked: !swatch.isLocked });
          }}
        >
          {swatch.isLocked ? <LockOutlined /> : <LockOpenOutlined />}
        </SwatchBarButton>
        <SwatchBarButton
          style={{ ...(isPickerActive && { opacity: '1' }) }}
          ref={pickerButtonRef}
          isDark={isDark}
          onClick={() => setIsPickerActive(!isPickerActive)}
        >
          <TuneOutlined />
        </SwatchBarButton>
        <Collapse in={isPickerActive} sx={{ width: '100%' }}>
          {/* <ColorPicker
            sx={{ width: '100%' }}
            color={swatch.color}
            setColor={(color) => setSwatch({ ...swatch, color: color })}
            innerRef={colorPickerRef}
            onFocus={handlePickerFocus}
            onBlur={handlePickerBlur}
            tabIndex={0}
          />
          */ }
          <RadarPicker
            sx={{ width: '100%' }}
            color={ swatch.color }
            setColor={(newColor) => setSwatch({ ...swatch, color: newColor})}
          />
        </Collapse>
      </SwatchBarContent>
    </Box>
  );
}

const hideDelay = 3000;

function SwatchBarContentVertical({ children }: SwatchBarContentProps) {
  const [shouldShow, handleMouseMove, handleMouseLeave] = useHoverLogic(hideDelay);

  return (
    <SwatchBarControls
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
    </SwatchBarControls>
  );
}

function SwatchBarContentHorizontal({ children }: SwatchBarContentProps) {
  const [shouldShow, handleMouseMove, handleMouseLeave] = useHoverLogic(hideDelay);

  return (
    <SwatchBarControls
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
    </SwatchBarControls>
  );
}
