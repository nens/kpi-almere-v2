var path = require('path');
var webpack = require('webpack');

var config = {
  // We change to normal source mapping
  devtool: 'source-map',
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },     
      {
        test: /\.css$/, 
        loader: "style-loader!css-loader?modules"
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        loader: 'transform/cacheable?brfs'
      },
      { test: /\.(png|jpg|svg|woff|eot|ttf|otf)$/, 
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};

module.exports = config;
