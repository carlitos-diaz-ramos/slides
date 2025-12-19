import * as path from 'path';

export default {
    mode: 'development',
    entry: './modules/slides.js',
    output: {
        filename: 'slides.js',
        path: path.resolve('dist'),
    },
};
