import { Adjust, Tune } from '@mui/icons-material';
import { Paper, Stack, Tab, Tabs, styled } from '@mui/material';
import type { PaperProps } from '@mui/material';
import type { Color } from 'chroma-js';
import { Ref, useCallback, useState } from 'react';
import HsvPicker from './HsvPicker';
import { RadarPicker } from './RadarPicker';

interface ColorPickerProps extends Omit<PaperProps, 'color'> {
  color: Color;
  setColor: (color: Color) => void;
  setColorCommitted?: (color: Color) => void;
  innerRef?: Ref<HTMLDivElement>;
}

const IconTab = styled(Tab)({
  minWidth: "0",
});

enum ColorPickerMode {
  Hsv,
  Radar,
}

export default function ColorPicker({
  color,
  setColor,
  setColorCommitted = () => {},
  innerRef,
  ...props
}: ColorPickerProps) {
  const [mode, setMode] = useState<ColorPickerMode>(ColorPickerMode.Hsv);

  const handleChange = useCallback((_event: any, newMode: ColorPickerMode) => {
    setMode(newMode);
  }, []);

  return (
    <Paper {...props} sx={ props.sx } ref={ innerRef }>
      <Stack spacing={1} sx={{ px: 3, py: 2 }}>
        { mode === ColorPickerMode.Hsv ? <HsvPicker color={color} setColor={ setColor } setColorCommitted={ setColorCommitted } /> : null }
        { mode === ColorPickerMode.Radar ? <RadarPicker color={color} setColor={ setColor } setColorCommitted={ setColorCommitted }/> : null }
      </Stack>
        <Tabs value={mode} onChange={handleChange} centered>
          <IconTab value={ColorPickerMode.Hsv} icon={ <Tune /> } />
          <IconTab value={ColorPickerMode.Radar} icon={ <Adjust /> } />
        </Tabs>
    </Paper>
  );
}
