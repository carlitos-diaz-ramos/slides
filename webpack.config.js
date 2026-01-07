import * as path from 'path';

export default {
    mode: 'development',
    entry: {
        slides: './ts/index.ts',
        jax: './ts/jax.ts',
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist'),
        assetModuleFilename: '[name][ext]'
    },
    devServer: {
        static: {
            directory: path.resolve(''),
        },
    },
    module: {
        rules: [
            { 
                test: /\.([cm]?ts|tsx)$/, 
                loader: "ts-loader", 
            },
            { 
                test: /\.js$/, 
                loader: "source-map-loader", 
            },
            {
                test: /\.css|\.js$/,
                type: 'asset/resource',
            },
        ],
    },
};
