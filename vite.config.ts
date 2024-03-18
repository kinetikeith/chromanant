import { defineConfig } from 'vite';
//import preact from '@preact/preset-vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
