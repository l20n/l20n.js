import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  format: 'iife',
  context: 'this',
  plugins: [
    nodeResolve(),
    babel(),
  ],
};
