import { StrictMode } from 'react';
import { render } from 'preact';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')!
);
