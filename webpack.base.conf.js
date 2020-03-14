const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'lib')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            template: path.join(__dirname, 'src', 'index.ejs')
        }),
        new CleanWebpackPlugin()
    ],
    optimization:{
        usedExports: false
    }
};