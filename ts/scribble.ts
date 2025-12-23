/**
 * scribble.ts is a module to allow scribbling on a slide.
 */

import {Canvas} from './canvas.ts';


export function start_scribble() {
    /**
     * Starts the code to scribble on a slide.
     */
    console.log('Start scribbling');
    window.addEventListener('load', on_scribble);
}

function on_scribble() {
    const canvas = new Canvas(document);
    canvas.start();
}

start_scribble();
