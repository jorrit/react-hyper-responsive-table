import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-import-css';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import pkg from '../../package.json' assert { type: 'json' };

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
      title: `react-hyper-responsive-table ${pkg.version} demo`,
    }),
    replace({
      preventAssignment: true,
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.HOMEPAGE': JSON.stringify(pkg.homepage),
    }),
  ],
};
