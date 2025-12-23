import * as path from 'path';
// import {EsbuildPlugin} from 'esbuild-loader';

export default {
    mode: 'development',
    entry: {
        "slides": './modules/slides.js',
        // "slides-jax": './modules/slides-jax.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
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
                test: /\.tsx?$/, 
                loader: "ts-loader", 
            },
            { 
                test: /\.js$/, 
                loader: "source-map-loader", 
            },
        ],
    },
};
