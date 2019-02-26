const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackIntegrationPlugin = require('../index');

module.exports = (config) => ({
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
        other: path.resolve(__dirname, './src/other.js')
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].[hash:4].js',
        chunkFilename: '[name].[chunkhash:4].js',
        publicPath: '/static/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new WebpackIntegrationPlugin(config)
    ]
});
