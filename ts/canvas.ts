/**
 * canvas.ts defines the Canvas class that allows scribbling on a slide.
 */


export class Canvas {
    /**
     * Represents a canvas for very basic drawing on a slide.
     */
    protected readonly _document: HTMLDocument;
    protected _section: HTMLElement | null = null;
    protected _stroke: SVGPolylineElement | null = null;
    protected _svg: SVGElement | null = null;
    protected _width: number = 0;
    protected _height: number = 0;
    public slide: HTMLElement | null = null;

    protected static _SVG_NS = "http://www.w3.org/2000/svg";

    constructor(document: HTMLDocument) {
        this._document = document;
    }

    start() {
        /**
         * Starts the drawing process.
         */
        const current = this._document.querySelector('.current');
        this.slide = current as HTMLElement;
        const section = this.slide.querySelector('section');
        this._section = section as HTMLElement;
        this._create_svg();
    }

    set_size(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    protected _create_svg() {
        const self = this.constructor as typeof Canvas;
        const ns = self._SVG_NS;
        const svg = this._document.createElementNS(ns, 'svg') as SVGElement;
        this._svg = svg;
        svg.classList.add('scribble');
        const section = this._section!;
        this.set_size(section.offsetWidth, section.offsetHeight);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0,0 ${this._width},${this._height}`);
        this._add_listeners();
        section.append(svg);
    }

    protected _add_listeners() {
        this._svg!.addEventListener('pointerdown', this._on_mouse_down);
        this._svg!.addEventListener('pointermove', this._on_mouse_move);
        this._svg!.addEventListener('pointerup', this._on_mouse_up);
        this._document.addEventListener('keydown', this._on_key_down);
    }

    protected _on_mouse_down = (event: PointerEvent) => {
        const [x, y] = [event.layerX, event.layerY];
        this.start_stroke(x, y);
    }

    protected _on_mouse_move = (event: PointerEvent) => {
        if (event.buttons == 1) {
            const [x, y] = [event.layerX, event.layerY];
            this.continue_stroke(x, y);
        }
    }

    protected _on_mouse_up = (event: PointerEvent) => {
        const [x, y] = [event.layerX, event.layerY];
        this.end_stroke(x, y);
    }

    protected _on_key_down = (event: KeyboardEvent) => {
        if (event.code == "KeyZ" && event.ctrlKey) {
            this.undo_last();
        }
    }

    start_stroke(x: number, y: number) {
        const self = this.constructor as typeof Canvas;
        const ns = self._SVG_NS;
        const stroke = this._document.createElementNS(ns, 'polyline');
        this._stroke = stroke as SVGPolylineElement;
        this._stroke.setAttribute('points', `${x},${y}`);
        this._svg!.append(this._stroke);
    }

    continue_stroke(x: number, y: number) {
        if (this._stroke === null) {
            this.start_stroke(x, y);
        } else {
            this._add_stroke(x, y);
        }
    }

    end_stroke(x: number, y: number) {
        this._add_stroke(x, y);
        this._stroke = null;
    }

    protected _add_stroke(x: number, y: number) {
        const stroke = this._stroke as SVGPolylineElement;
        const previous = stroke.getAttribute('points') || '';
        const current = previous.concat(' ', `${x},${y}`);
        stroke.setAttribute('points', current);
    }

    undo_last() {
        /**
         * Undoes the last stroke.
         */
        const polyline = this._svg!.querySelector('polyline:last-child');
        if (polyline !== null)
            polyline.remove();
    }
}
