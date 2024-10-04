/**
 * canvas.js defines the Canvas class that allows scribbling on a slide.
 */


export class Canvas {
    constructor(document) {
        this._document = document;
        this._stroke = null;
    }

    start() {
        this.slide = this._document.querySelector('.current');
        this._section = this.slide.querySelector('section');
        this._create_svg();
    }

    set_size(width, height) {
        this._width = width;
        this._height = height;
    }

    static _SVG_NS = "http://www.w3.org/2000/svg";

    _create_svg() {
        const ns = this.constructor._SVG_NS;
        const svg = this._svg = this._document.createElementNS(ns, 'svg');
        svg.classList.add('scribble');
        this.set_size(this._section.offsetWidth, this._section.offsetHeight);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0,0 ${this._width},${this._height}`);
        this._add_listeners();
        this._section.append(svg);
    }

    _add_listeners() {
        this._svg.addEventListener('pointerdown', this._on_mouse_down);
        this._svg.addEventListener('pointermove', this._on_mouse_move);
        this._svg.addEventListener('pointerup', this._on_mouse_up);
        this._document.addEventListener('keydown', this._on_key_down);
    }

    _on_mouse_down = (event) => {
        const [x, y] = [event.layerX, event.layerY];
        this.start_stroke(x, y);
    }

    _on_mouse_move = (event) => {
        if (event.buttons == 1) {
            const [x, y] = [event.layerX, event.layerY];
            this.continue_stroke(x, y);
        }
    }

    _on_mouse_up = (event) => {
        const [x, y] = [event.layerX, event.layerY];
        this.end_stroke(x, y);
    }

    _on_key_down = (event) => {
        if (event.code == "KeyZ" && event.ctrlKey) {
            this.undo_last();
        }
    }

    start_stroke(x, y) {
        const ns = this.constructor._SVG_NS;
        this._stroke = this._document.createElementNS(ns, 'polyline');
        this._stroke.setAttribute('points', `${x},${y}`);
        this._svg.append(this._stroke);
    }

    continue_stroke(x, y) {
        if (this._stroke === null) {
            this.start_stroke(x, y);
        } else {
            this._add_stroke(x, y);
        }
    }

    end_stroke(x, y) {
        this._add_stroke(x, y);
        this._stroke = null;
    }

    _add_stroke(x, y) {
        const previous = this._stroke.getAttribute('points');
        const current = previous.concat(' ', `${x},${y}`);
        this._stroke.setAttribute('points', current);
    }

    undo_last() {
        const polyline = this._svg.querySelector('polyline:last-child');
        if (polyline !== null)
            polyline.remove();
    }
}
