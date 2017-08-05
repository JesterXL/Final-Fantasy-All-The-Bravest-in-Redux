
module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devtool: "inline-source-map",
  output: {
    filename: 'bundle.js'
  }
};

// give cheap-module-source-map a shot later in case of issues
// https://github.com/webpack/webpack/issues/2145#issuecomment-294361203