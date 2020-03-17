const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
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
            template: path.join(__dirname, 'src', 'index.ejs')
        }),
        new CleanWebpackPlugin()
    ],
    optimization:{
        usedExports: false
    },
    // externals:{
    //     "@ant-design/icons": "ant-design/icons",
    //     react: "react",
    //     "react-dom": "react-dom",
    //     uuid: "uuid",
    //     "qrcode.react": "qrcode.react"
    // }
};