import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default defineConfig([
  {
    input: 'src/smart-glass-card.ts',
    output: {
      file: 'dist/smart-glass-card.js',
      format: 'es',
      inlineDynamicImports: true,
    },
    external: ['home-assistant-js-websocket', 'lit', 'lit/decorators.js'],
    plugins: [
      json(),
      resolve(),
      typescript(),
      terser({
        format: {
          comments: false,
        },
        mangle: {
          reserved: ['SmartGlassCard'],
        },
      }),
    ],
  },
  // Additional bundle with debug information
  {
    input: 'src/smart-glass-card.ts',
    output: {
      file: 'dist/smart-glass-card.debug.js',
      format: 'es',
      inlineDynamicImports: true,
    },
    external: ['home-assistant-js-websocket', 'lit', 'lit/decorators.js'],
    plugins: [
      json(),
      resolve(),
      typescript({
        sourceMap: true,
      }),
    ],
  },
]);
