/**
 * canvas.js defines the Canvas class that allows scribbling on a slide.
 */


export class Canvas {
    constructor(document) {
        this._document = document;
    }

    start() {
        this.slide = this._document.querySelector('.current');
        const svg = this._document.createElement('svg');
        svg.classList.add('scribble');
        this.slide.appendChild(svg);
    }
}

