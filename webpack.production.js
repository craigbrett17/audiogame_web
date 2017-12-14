const webpack = require('webpack');
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const uglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
    devtool: 'source-map',
    output: {
        filename: '[name]-bundle-[hash].js'
    },
    plugins: [
        new uglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
})