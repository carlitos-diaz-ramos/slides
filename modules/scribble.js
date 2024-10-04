/**
 * scribble.js is a module to allow scribbling in a slide.
 */
import {Canvas} from './canvas.js';

export function start_scribble() {
    console.log('Start scribbling');
    window.addEventListener('load', on_scribble);
}

function on_scribble() {
    const canvas = new Canvas(document);
    canvas.start();
}

start_scribble();
