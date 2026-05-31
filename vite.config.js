import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set base to your repo name when deploying to GitHub Pages:
// base: '/Learn_hanyu/'
// For user/organization pages (username.github.io), use base: '/'
export default defineConfig({
  plugins: [react()],
  base: './',
});
