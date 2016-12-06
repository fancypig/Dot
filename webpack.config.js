var path = require('path');
var webpack = require('webpack');
var WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: __dirname+ "/src",
    output: {
        path: path.resolve('public'),
        filename: 'bundle.js'
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

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new WatchLiveReloadPlugin({
            files: [
                // Replace these globs with yours
                './public/index.html',
                './src'
            ]
        }),
    ]
};
