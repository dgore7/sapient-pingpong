var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:8080',
    // 'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve : {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/pub/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './public/dist',
    hot: true
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin()
  // ]
}