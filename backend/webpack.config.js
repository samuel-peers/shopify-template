const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    server: './server.js',
    lambda: './lambda.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-build.js',
    library: '',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    minimize: false
  }
};
