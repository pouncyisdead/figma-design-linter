import { defineConfig } from 'vite';
import { viteFigmaPlugin } from '@create-figma-plugin/vite-plugin';

export default defineConfig({
  plugins: [viteFigmaPlugin()],
  build: {
    target: 'esnext',
    minify: true,
    outDir: 'dist'
  }
});