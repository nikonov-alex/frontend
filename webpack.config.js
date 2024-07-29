const path = require('path');

module.exports = {
    entry: {
        index: './sources/index.ts',
        "jsx-runtime": './sources/jsx-runtime.ts'
    },
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    },
    output: {
        filename: '[name].js',
        path: path.resolve( "./build" ),
        library: {
            type: "module"
        }
    },
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true
    }
};