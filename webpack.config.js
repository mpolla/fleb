const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

var webpack = require("webpack");

module.exports = {
    entry: './src/index.ts',

    // https://github.com/webpack/webpack-dev-server/issues/2792#issuecomment-724169118
    optimization: {
        runtimeChunk: "single"
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.ico/,
                type: "asset/resource"
            }
        ],
    },

    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            $: require.resolve('jquery'),
            jQuery: require.resolve('jquery')
        }),


        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        })
    ],

    output: {
        //path: path.resolve(__dirname, 'dist'),
        publicPath: "/fleb/",
        filename: '[name].js',
        assetModuleFilename: 'asset/[name][ext]'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    }

};

