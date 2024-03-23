import { Adjust, Tune } from '@mui/icons-material';
import { Paper, Stack, Tab, Tabs, TextField, styled } from '@mui/material';
import type { PaperProps, TextFieldProps } from '@mui/material';
import type { Color } from 'chroma-js';
import { ChangeEvent, FocusEvent, Ref, useCallback, useState } from 'react';
import HsvPicker from './HsvPicker';
import { RadarPicker } from './RadarPicker';
import chroma from 'chroma-js';

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

interface HexFieldProps extends Omit<TextFieldProps, 'color'> {
  color: Color;
  setColor: (color: Color) => void;
  setColorCommitted?: (color: Color) => void;
}

function HexField({color, setColor, setColorCommitted = () => {}, ...props}: HexFieldProps) {
  const [inputHex, setInputHex] = useState<string | null>(null);
  const currentHex = inputHex === null ? color.hex('rgb') : inputHex;
  
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputHex(newValue);
    if(chroma.valid(newValue)) setColor(chroma(newValue));
  }, []);
  
  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputHex(null);
    if(chroma.valid(newValue)) setColorCommitted(chroma(newValue));
  }, []);
  
  return (
    <TextField
      value={ currentHex }
      onChange={ handleChange }
      onBlur={ handleBlur }
      { ...props }
    />
  );
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
      <Stack spacing={1} sx={{ p: 3 }}>
        { mode === ColorPickerMode.Hsv ? 
          <HsvPicker
            color={color}
            setColor={ setColor }
            setColorCommitted={ setColorCommitted } 
          />
          :
          null
        }
        { mode === ColorPickerMode.Radar ?
          <RadarPicker
            color={color}
            setColor={ setColor }
            setColorCommitted={ setColorCommitted }
          />
          :
          null
        }
        <HexField
          color={ color }
          setColor={ setColor }
          setColorCommitted={ setColorCommitted }
          label="Hex"
          variant='standard'
        />
      </Stack>
        <Tabs value={mode} onChange={handleChange} centered>
          <IconTab value={ColorPickerMode.Hsv} icon={ <Tune /> } />
          <IconTab value={ColorPickerMode.Radar} icon={ <Adjust /> } />
        </Tabs>
    </Paper>
  );
}
