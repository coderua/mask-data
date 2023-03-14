import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/mask-data.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/mask-data.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/mask-data.umd.js',
      format: 'umd',
      name: 'MaskData',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
