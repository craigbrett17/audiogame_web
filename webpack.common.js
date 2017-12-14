const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'meadow_runner': './src/meadow_runner/app/index.ts'
    },
    target: 'web',
    output: {
        path: __dirname + '/dist',
        filename: '[name]-bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunks: []
        }),
        new HtmlWebpackPlugin({
            template: 'src/meadow_runner/meadowrunner.html',
            chunks: ['meadow_runner'],
            filename: 'meadowrunner.html'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.NamedModulesPlugin(),
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loaders: ['babel-loader', 'ts-loader'] },
            // handle loading fonts and svgs and images into the output as well
            { test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'url-loader?limit=100000&name=img/[name].[ext]' },
            { test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
            { include: path.resolve(__dirname, 'src/meadow_runner/music'), loader: 'url-loader?name=music/[name].[ext]' },
            { include: path.resolve(__dirname, 'src/meadow_runner/sounds'), loader: 'file-loader?name=sounds/[name].[ext]' },
            // inject CSS as well
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    }
}