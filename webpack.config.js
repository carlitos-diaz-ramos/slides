import * as path from 'path';
// import {EsbuildPlugin} from 'esbuild-loader';

export default {
    mode: 'development',
    entry: './modules/slides.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'slides.js',
        path: path.resolve('dist'),
    },
    devServer: {
        static: {
            directory: path.resolve(''),
        },
        open: [
            './docs/doc.html',
        ],
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.[jt]sx?$/,
    //             loader: 'esbuild-loader',
    //             options: {
    //                 target: 'es2015',
    //             },
    //         },
    //     ]
    // },
    optimization: {
        // minimize: true,
        // minimizer: [
        //     new EsbuildPlugin({target: 'es2015'}),
        // ]
    },
};
