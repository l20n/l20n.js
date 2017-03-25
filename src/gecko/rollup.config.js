import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  format: 'es',
  banner: '{\n',
  footer: '\n}\n',
  plugins: [
    nodeResolve(),
  ]
};
