module.exports = {
  publicPath: './',
  outputDir: './dist/secure',
  configureWebpack: {
    mode: 'development',
    devtool: 'source-map'
  },
  devServer: {
    proxy: 'http://localhost:8080',
    watchOptions: {
      poll: true
    }
  }
};
