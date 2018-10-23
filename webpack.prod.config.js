const path = require("path");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: "./client/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: { presets: ['env'] }
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, "./deployment"),
    filename: "bundle.js"
  },
  plugins: [
    new MinifyPlugin(),
    new CompressionPlugin()
  ]
};