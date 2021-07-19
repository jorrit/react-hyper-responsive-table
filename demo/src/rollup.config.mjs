import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-import-css';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import terser from '@rollup/plugin-terser';

const inputDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(inputDir, '..', 'dist');

export default {
  input: join(inputDir, 'index.tsx'),
  external: [''],
  output: [
    {
      dir: outputDir,
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    nodeResolve({ browser: true }),
    commonjs({}),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
        },
      },
    }),
    terser({
      compress: { global_defs: { 'process.env.NODE_ENV': 'production' } },
    }),
    css({}),
    html({
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=no' },
      ],
      title: 'react-hyper-responsive-table demo',
    }),
  ],
};
