const path = require('path');
const nodeExternals = require('webpack-node-externals');

const srcDir = './src';

const scriptTags = {
  mode: 'production',
  entry: {
    index: `${srcDir}/scriptTags.js`
  },
  output: {
    path: path.join(__dirname, 'dist', 'script_tags'),
    filename: '[name].js'
  },
  target: 'node',
  optimization: {
    minimize: false
  }
};

const servers = {
  mode: 'production',
  entry: {
    server: `${srcDir}/server.js`,
    lambda: `${srcDir}/lambda.js`
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
  },
  externals: [
    nodeExternals({
      modulesDir: '../node_modules',
      whitelist: [/^((?!aws-sdk).)*$/]
    })
  ]
};

module.exports = [scriptTags, servers];
