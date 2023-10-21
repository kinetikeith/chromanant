import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { ReactNode, RefObject, Dispatch, SetStateAction } from 'react';
import { Casino, LockOpenOutlined, LockOutlined, TuneOutlined } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Stack,
  Collapse,
  Paper,
  alpha,
  styled,
} from '@mui/material';
import type { IconButtonProps, ContainerProps } from '@mui/material';
import type { Color } from 'chroma-js';
import chroma from 'chroma-js';

import GradientSlider from './GradientSlider';

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

const hueGradientColors = chroma
  .scale(['#ff0000', '#00ff00', '#0000ff', '#ff0000'])
  .mode('hsv')
  .colors(12, null);

function useFocusLogic(
  mainRef: RefObject<HTMLElement>,
  ignoreRefs: RefObject<HTMLElement>[] = [],
): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  (event: React.FocusEvent) => void,
  (event: React.FocusEvent) => void,
] {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (isActive) mainRef.current?.focus();
    else mainRef.current?.blur();
  }, [isActive, mainRef]);

  const handleFocus = useCallback(
    (event: React.FocusEvent): void => {
      if (mainRef.current?.contains(event.relatedTarget)) return;
      else setIsActive(true);
    },
    [mainRef],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent): void => {
      if (mainRef.current?.contains(event.relatedTarget)) return;
      else if (ignoreRefs.some((ref) => ref.current?.contains(event.relatedTarget))) return;
      else setIsActive(false);
    },
    [mainRef, ignoreRefs],
  );

  return [isActive, setIsActive, handleFocus, handleBlur];
}

export default function Swatch({ value, setValue, isHorizontal }: SwatchProps) {
  const isDark = value.color.luminance() > 0.179;
  const SwatchContent = isHorizontal ? SwatchContentHorizontal : SwatchContentVertical;
  const [currentHue, sat, val] = value.color.hsv();
  const [lastHue, setLastHue] = useState<number>(0);
  const hue = useMemo(() => (isNaN(currentHue) ? lastHue : currentHue), [lastHue, currentHue]);

  const satGradientColors = [chroma.hsv(hue, 0, val), chroma.hsv(hue, 1, val)];

  const valGradientColors = [chroma.hsv(hue, sat, 0), chroma.hsv(hue, sat, 1)];

  useEffect(() => {
    if (!isNaN(currentHue)) setLastHue(currentHue);
  }, [currentHue]);

  const paperRef = useRef<HTMLDivElement>(null);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);
  const [isPickerActive, setIsPickerActive, handlePickerFocus, handlePickerBlur] =
    useFocusLogic(paperRef, [pickerButtonRef]);

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
          <Paper
            sx={{ width: '100%', px: 3, py: 2 }}
            ref={paperRef}
            onFocus={handlePickerFocus}
            onBlur={handlePickerBlur}
            tabIndex={0}
          >
            <Stack spacing={1}>
              <GradientSlider
                value={hue}
                min={0}
                max={359}
                currentColor={value.color}
                gradientColors={hueGradientColors}
                onChange={(_event, newHue) => {
                  setValue({
                    ...value,
                    color: chroma.hsv(newHue as number, sat, val),
                  });
                  setLastHue(newHue as number);
                }}
              />
              <GradientSlider
                gradientColors={satGradientColors}
                currentColor={value.color}
                value={sat}
                step={0.001}
                min={0.0}
                max={1.0}
                onChange={(_event, newSat) => {
                  setValue({
                    ...value,
                    color: chroma.hsv(hue, newSat as number, val),
                  });
                }}
              />
              <GradientSlider
                gradientColors={valGradientColors}
                currentColor={value.color}
                value={val}
                step={0.001}
                min={0.0}
                max={1.0}
                onChange={(_event, newVal) => {
                  setValue({
                    ...value,
                    color: chroma.hsv(hue, sat, newVal as number),
                  });
                }}
              />
            </Stack>
          </Paper>
        </Collapse>
      </SwatchContent>
    </Box>
  );
}

function useHoverLogic(delay: number): [boolean, () => void, () => void] {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(() => {
    setShouldShow(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    const timerId = setTimeout(() => {
      setShouldShow(false);
    }, delay);
    timerRef.current = timerId;
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    setShouldShow(false);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  return [shouldShow, handleMouseMove, handleMouseLeave];
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
