const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        './src/app/index.ts' // the actual entry file
    ],
    target: 'web',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Audio game test page',
            template: 'index.html'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loaders: ['ts-loader'] },
            // handle loading fonts and svgs and images into the output as well
            { test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'url-loader?limit=100000&name=img/[name].[ext]' },
            { test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
            { test: /\.(mp3|wav|ogg)(\?\S*)?$/, loader: 'file-loader?name=sounds/[name].[ext]' },
            // inject CSS as well
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    }
}