'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: __dirname+ "/src",
    output: {
        path: path.resolve('public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query:{
                    presets: ['es2015','react'],
                }
            },
            {
              test: /\.css$/,
              loader: 'style-loader'
            },
            {
              test: /\.css$/,
              loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              test: /\.(png|jpg|)$/,
              loader: 'url-loader?limit=200000'
            }
        ]
    },


};
