import * as path from 'path';

export default {
    mode: 'development',
    entry: {
        "slides": './ts/slides.ts',
        // "slides-jax": './modules/slides-jax.js',
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
        filename: '[name].bundle.js',
        path: path.resolve('dist'),
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
        ],
    },
};
