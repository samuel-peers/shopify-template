const path = require('path');
const nodeExternals = require('webpack-node-externals');

const srcDir = './src';

const servers = {
  mode: 'production',
  entry: {
    lambda: `${srcDir}/lambda.js`,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-build.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    minimize: false,
  },
  externals: [
    nodeExternals({
      modulesDir: 'node_modules',
      whitelist: [/^((?!aws-sdk).)*$/],
    }),
  ],
};

module.exports = [servers];
