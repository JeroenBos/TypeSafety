const nodeEnv = process.env.NODE_ENV || 'development';
const CleanWebpackPlugin = require('clean-webpack-plugin');

var sharedConfig = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    // uncommenting the following would be a performance optimization (use browser caching)
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    // Suppress fatal error: Cannot resolve module 'fs'
    // @relative https://github.com/pugjs/pug-loader/issues/8
    // @see https://github.com/webpack/docs/wiki/Configuration#node
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ],
    watchOptions: {
        aggregateTimeout: 300
    }
};

var mainConfig = {
    ...sharedConfig,
    name: 'main',
    entry: './index.ts',
    output: { filename: './main.js' },
};
var testConfig = {
    ...sharedConfig,
    name: 'test',
    entry: './tests/runtime.tests.ts',
    output: { filename: './test.js' },
};

module.exports = [mainConfig, testConfig];