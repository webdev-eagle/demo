const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            $shared: path.resolve(__dirname, '../shared'),
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: 'babel-loader',
                include: [__dirname, path.resolve(__dirname, '../shared')],
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            { test: /\.svg$/, use: 'raw-loader' },
            { test: /\.css$/, use: 'raw-loader' },
        ],
    },
    optimization: {
        minimize: false,
    },
    externals: [nodeExternals()],
    plugins: [
        new NodemonPlugin({
            nodeArgs: [`--inspect=${process.env.PORT || 8011}`],
            env: {
                NODE_ENV: process.env.NODE_ENV,
            },
        }),
    ],
};
