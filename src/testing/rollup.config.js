import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  format: 'iife',
  plugins: [
    nodeResolve(),
  ]
};
