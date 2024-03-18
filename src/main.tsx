import { StrictMode } from 'react';
// import { render } from 'preact';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

/* render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')!
); */

const root = createRoot(document.getElementById('root') as Element);
root.render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>
);
