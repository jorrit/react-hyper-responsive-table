module.exports = {
  presets: [
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        jsxPragma: 'h',
        allExtensions: true,
        allowNamespaces: false,
        allowDeclareFields: true,
      },
    ],

    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
