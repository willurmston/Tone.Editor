var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    entry: {
        main: path.join(__dirname, './ToneEditor/Initialize'),
    },
    resolve: {
        extensions: [".js"]
    },
    output: {
        publicPath: "/ToneEditor/",
        path: path.join(__dirname, 'build'),
        filename: 'Tone-Editor.js'
    },
    module: {
      loaders:[],
      rules: [
        { test: /\.jpg$/, use: [ "file-loader" ] },
        { test: /\.png$/, use: [ "url-loader?mimetype=image/png" ] },
        {
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
        {
          test: /\.sass$/,
          use: ['style-loader', 'css-loader','sass-loader']
        }
      ]
    },
    plugins: [
      new UglifyJSPlugin()
    ]
};
