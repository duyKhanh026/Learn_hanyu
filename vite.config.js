import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://<user>.github.io/<repo>/
// CI sets VITE_BASE=/Learn_hanyu/ automatically via deploy workflow
const base = process.env.VITE_BASE || './';

export default defineConfig({
  plugins: [react()],
  base,
});
