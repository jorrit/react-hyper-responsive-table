module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactHyperResponsiveTable',
      externals: {
        react: 'React'
      }
    }
  }
}
