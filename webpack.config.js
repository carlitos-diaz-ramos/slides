import * as path from 'path';
// import {EsbuildPlugin} from 'esbuild-loader';

export default {
    mode: 'development',
    entry: {
        "slides": './modules/slides.js',
        // "slides-jax": './modules/slides-jax.js',
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve('dist'),
    },
    devServer: {
        static: {
            directory: path.resolve(''),
        },
    },
};
