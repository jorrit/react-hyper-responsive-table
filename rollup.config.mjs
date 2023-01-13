import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import externals from 'rollup-plugin-node-externals';

import packageJson from './package.json' assert { type: 'json' };

const extensions = ['.tsx', '.ts'];

export default {
  input: './src/index.tsx',
  external: [''],
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: false,
      exports: 'default',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: false,
      exports: 'default',
    },
  ],
  plugins: [
    externals({
      builtins: true,
      deps: true,
      peerDeps: true,
      optDeps: true,
      devDeps: true,
    }),
    nodeResolve({ extensions }),
    typescript({
      exclude: ['./src/index.test.tsx'],
    }),
  ],
};
