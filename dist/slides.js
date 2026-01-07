/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/animation.ts"
/*!*************************!*\
  !*** ./ts/animation.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* binding */ Animation),
/* harmony export */   StopAnimation: () => (/* binding */ StopAnimation)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./ts/util.ts");
/**
 * animations - A module that takes care of animations within a fixed slide.
 */

class StopAnimation extends Error {
    constructor(message) {
        super(message);
        this.name = "StopAnimation";
    }
}
class Animation {
    constructor(slide) {
        this._slide = slide;
        this._steps = this.get_steps();
        this._current = 0;
        this.hide_all();
    }
    get slide() {
        return this._slide;
    }
    get_steps() {
        const self = this.constructor;
        const merged = this._merge_class(self._ANIMATION_TYPES);
        return merged.map(item => item[1]);
    }
    _merge_class(classes) {
        let merged = [];
        const trios = this._get_number_class_list(classes);
        for (let [n, element, cls] of trios) {
            this._add_element(merged, n, element, cls);
        }
        return merged;
    }
    _get_number_class_list(classes) {
        let trios;
        trios = this._get_classes(classes).map(item => [this._get_class_value(...item), ...item]);
        trios.sort((a, b) => a[0] - b[0]);
        return trios;
    }
    _get_classes(classes) {
        let elements = [];
        for (let cls of classes) {
            let pattern = `[class*="${cls}-"]`;
            let selected = this._slide.querySelectorAll(pattern);
            for (let element of selected) {
                elements.push([element, cls]);
            }
        }
        return elements;
    }
    _get_class_value(element, cls) {
        const text = element.className;
        const pattern = `${cls}-(\\d+)`;
        const regex = new RegExp(pattern);
        const matched = text.match(regex);
        return Number(matched[matched.length - 1]);
    }
    _add_element(merged, n, element, cls) {
        if (merged.length > 0) {
            const last = merged.pop();
            if (last[0] == n) {
                last[1][cls].push(element);
                merged.push([n, last[1]]);
            }
            else {
                merged.push(last);
                merged.push([n, this._start_step(element, cls)]);
            }
        }
        else {
            merged.push([n, this._start_step(element, cls)]);
        }
    }
    _start_step(element, cls) {
        const initial = {};
        const self = this.constructor;
        for (const type of self._ANIMATION_TYPES)
            initial[type] = [];
        initial[cls].push(element);
        return initial;
    }
    move_forward() {
        /**
         * Performs the next animation of the slide or informs that there are
         * no more animations by throwing an exception.
         */
        if (this._current + 1 <= this._steps.length) {
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.show_all)(this._steps[this._current]['show']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.animate_all)(this._steps[this._current]['animate']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.erase_all)(this._steps[this._current]['erase']);
            this._current++;
        }
        else {
            throw new StopAnimation('No more animations');
        }
    }
    move_backwards() {
        /**
         * Performs the previous animation of the slide or informs that there
         * are no previous animations by throwing an exception.
         */
        if (this._current > 0) {
            --this._current;
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.hide_all)(this._steps[this._current]['show']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.deanimate_all)(this._steps[this._current]['animate']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.unerase_all)(this._steps[this._current]['erase']);
        }
        else {
            throw new StopAnimation('No more animations');
        }
    }
    show_all() {
        /**
         * Goes to the last animation of the slide.
         */
        for (let step of this._steps) {
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.show_all)(step['show']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.animate_all)(step['animate']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.erase_all)(step['erase']);
        }
        this._current = this._steps.length;
    }
    hide_all() {
        /**
         * Goes to the state of the slide before any animation.
         */
        for (let step of this._steps) {
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.hide_all)(step['show']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.deanimate_all)(step['animate']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.unerase_all)(step['erase']);
        }
        this._current = 0;
    }
    render_canvas() {
        // Used for Three.js
        const canvases = this.slide.getElementsByTagName('canvas');
        for (let canvas of canvases) {
            try {
                canvas.force_render();
            }
            catch (error) {
                if (error instanceof TypeError) {
                    const msg = `Canvas ${canvas} cannot force render.`;
                    console.log(msg);
                }
                else {
                    throw error;
                }
            }
        }
    }
}
Animation._ANIMATION_TYPES = ['show', 'animate', 'erase'];


/***/ },

/***/ "./ts/boxes.ts"
/*!*********************!*\
  !*** ./ts/boxes.ts ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SlideIff: () => (/* binding */ SlideIff),
/* harmony export */   SlideImplied: () => (/* binding */ SlideImplied),
/* harmony export */   SlideImplies: () => (/* binding */ SlideImplies),
/* harmony export */   define_elements: () => (/* binding */ define_elements)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./ts/util.ts");
/**
 * boxes - A module that creates pairs of boxes with arrows.
 * Used for definitions, implications, equivalences and so on.
 */

class TwoBoxes extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        const self = this.constructor;
        const color = this.dataset.bg;
        const tmpl = self.template({
            styles: self._get_stylesheets(),
            color: color ? color : 'white',
        });
        if (this.shadowRoot) {
            this.shadowRoot.append(tmpl.content.cloneNode(true));
        }
        else {
            throw new _util_js__WEBPACK_IMPORTED_MODULE_0__.SlidesError('Element has no shadowRoot.');
        }
    }
    static template({ styles = [], color = 'white' }) {
        const tmpl = document.createElement('template');
        const self = this.prototype.constructor;
        tmpl.innerHTML = self._CODE;
        this._set_styles(tmpl, styles);
        this._set_color(tmpl, color);
        return tmpl;
    }
    static _set_styles(tmpl, styles) {
        const div = tmpl.content.querySelector('div.two-boxes');
        for (let style of styles) {
            const link = document.createElement('link');
            link.href = style;
            link.rel = 'stylesheet';
            tmpl.content.insertBefore(link, div);
        }
    }
    static _set_color(tmpl, color) {
        const bg = `bg-${color}`;
        const divs = tmpl.content.querySelectorAll('.two-boxes div');
        for (let div of divs)
            div.classList.add(bg);
        const path = tmpl.content.querySelector('.two-boxes svg path');
        if (path) {
            path.classList.add(bg);
        }
        else {
            throw new _util_js__WEBPACK_IMPORTED_MODULE_0__.SlidesError('Svg arrow has no path element.');
        }
    }
    static _get_stylesheets() {
        const stylesheets = Array.from(document.styleSheets);
        const with_href = stylesheets.filter(item => item.href !== null);
        return with_href.map(item => item.href ? item.href : '');
    }
}
class SlideIff extends TwoBoxes {
    static template({ styles = [], color = 'yellow' }) {
        return super.template({ styles: styles, color: color });
    }
}
/**
 * Creates two boxes with "if and only if" arrow in the middle.
 * This is entered in the html as a <slide-iff> element with two slots:
 * a <div slot="left"> and a <div slot="right">.
 */
SlideIff._CODE = `
        <div class="two-boxes">
         <div>
          <slot name="left"></slot>
         </div>
         <svg viewBox="0,0 40,22">
          <title>If and only if</title>
          <path d="M11,6 H29 V2 Q29,1 29.71,1.70 L39,11 29.71,20.30 
           Q29,21 29,20 V16 H11 V20 Q11,21 10.29,20.30 L1,11 10.29,1.70 
           Q11,1 11,2 z"/>
         </svg>
         <div>
          <slot name="right"></slot>
         </div>
        </div>
    `;
class SlideImplies extends TwoBoxes {
    static template({ styles = [], color = 'green' }) {
        return super.template({ styles: styles, color: color });
    }
}
/**
 * Creates two boxes with right-pointing arrow in the middle.
 * This is entered in the html as a <slide-implies> element with two
 * slots: a <div slot="left"> and a <div slot="right">.
 */
SlideImplies._CODE = `
        <div class="two-boxes">
         <div>
          <slot name="left"></slot>
         </div>
         <svg viewBox="0,0 40,22">
          <title>Implies</title>
          <path d="M1,11 V6 H29 V2 Q29,1 29.71,1.70 L39,11 29.71,20.30 
           Q29,21 29,20 V16 H1 V11 z"/>
         </svg>
         <div>
          <slot name="right"></slot>
         </div>
        </div>
    `;
class SlideImplied extends TwoBoxes {
}
/**
 * Creates two boxes with a left-pointing arrow in the middle.
 * This is entered in the html as a <slide-implied> element with two
 * slots: a <div slot="left"> and a <div slot="right">.
 */
SlideImplied._CODE = `
        <div class="two-boxes">
         <div>
          <slot name="left"></slot>
         </div>
         <svg viewBox="0,0 40,22">
          <title>Is implied by</title>
          <path d="M10,6 Q22,20 33,1 L33,8 39,9 Q22,29 5,11 L1,15 L1,2 
           L14,2 z"/>
         </svg>
         <div>
          <slot name="right"></slot>
         </div>
        </div>
    `;
function define_elements() {
    customElements.define('slide-iff', SlideIff);
    customElements.define('slide-implies', SlideImplies);
    customElements.define('slide-implied', SlideImplied);
}


/***/ },

/***/ "./ts/canvas.ts"
/*!**********************!*\
  !*** ./ts/canvas.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Canvas: () => (/* binding */ Canvas)
/* harmony export */ });
/**
 * canvas.ts defines the Canvas class that allows scribbling on a slide.
 */
class Canvas {
    constructor(document) {
        this._section = null;
        this._stroke = null;
        this._svg = null;
        this._width = 0;
        this._height = 0;
        this.slide = null;
        this._on_mouse_down = (event) => {
            const [x, y] = [event.layerX, event.layerY];
            this.start_stroke(x, y);
        };
        this._on_mouse_move = (event) => {
            if (event.buttons == 1) {
                const [x, y] = [event.layerX, event.layerY];
                this.continue_stroke(x, y);
            }
        };
        this._on_mouse_up = (event) => {
            const [x, y] = [event.layerX, event.layerY];
            this.end_stroke(x, y);
        };
        this._on_key_down = (event) => {
            if (event.code == "KeyZ" && event.ctrlKey) {
                this.undo_last();
            }
        };
        this._document = document;
    }
    start() {
        /**
         * Starts the drawing process.
         */
        const current = this._document.querySelector('.current');
        this.slide = current;
        const section = this.slide.querySelector('section');
        this._section = section;
        this._create_svg();
    }
    set_size(width, height) {
        this._width = width;
        this._height = height;
    }
    _create_svg() {
        const self = this.constructor;
        const ns = self._SVG_NS;
        const svg = this._document.createElementNS(ns, 'svg');
        this._svg = svg;
        svg.classList.add('scribble');
        const section = this._section;
        this.set_size(section.offsetWidth, section.offsetHeight);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0,0 ${this._width},${this._height}`);
        this._add_listeners();
        section.append(svg);
    }
    _add_listeners() {
        this._svg.addEventListener('pointerdown', this._on_mouse_down);
        this._svg.addEventListener('pointermove', this._on_mouse_move);
        this._svg.addEventListener('pointerup', this._on_mouse_up);
        this._document.addEventListener('keydown', this._on_key_down);
    }
    start_stroke(x, y) {
        const self = this.constructor;
        const ns = self._SVG_NS;
        const stroke = this._document.createElementNS(ns, 'polyline');
        this._stroke = stroke;
        this._stroke.setAttribute('points', `${x},${y}`);
        this._svg.append(this._stroke);
    }
    continue_stroke(x, y) {
        if (this._stroke === null) {
            this.start_stroke(x, y);
        }
        else {
            this._add_stroke(x, y);
        }
    }
    end_stroke(x, y) {
        this._add_stroke(x, y);
        this._stroke = null;
    }
    _add_stroke(x, y) {
        const stroke = this._stroke;
        const previous = stroke.getAttribute('points') || '';
        const current = previous.concat(' ', `${x},${y}`);
        stroke.setAttribute('points', current);
    }
    undo_last() {
        /**
         * Undoes the last stroke.
         */
        const polyline = this._svg.querySelector('polyline:last-child');
        if (polyline !== null)
            polyline.remove();
    }
}
Canvas._SVG_NS = "http://www.w3.org/2000/svg";


/***/ },

/***/ "./ts/slides.ts"
/*!**********************!*\
  !*** ./ts/slides.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   start_page: () => (/* binding */ start_page)
/* harmony export */ });
/* harmony import */ var _slideshow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slideshow.js */ "./ts/slideshow.ts");
/* harmony import */ var _boxes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boxes.js */ "./ts/boxes.ts");
/**
 * slides - The main module of this package.
 * It creates a slide show after the page is loaded.
 */


function start_page() {
    /**
     * Creates a callback that starts the slide show after the page is loaded.
     */
    const mode = get_mode();
    console.log(`${mode} mode`);
    if (mode === "Slideshow") {
        window.addEventListener("load", on_load);
    }
    else if (mode === "Print") {
        window.addEventListener("load", on_print_load);
    }
    ;
}
function on_load() {
    /**
     * Callback that creates the slide show.
     */
    const slide_show = new _slideshow_js__WEBPACK_IMPORTED_MODULE_0__.SlideShow(document);
    slide_show.start();
}
function on_print_load() {
    /**
     * Callback that creates a printable version of the slide show with all
     * the animations.
     */
    const slide_show = new _slideshow_js__WEBPACK_IMPORTED_MODULE_0__.SlideShow(document);
    slide_show.print_mode();
}
function get_mode() {
    /**
     * Decide if slideshow mode is on, based on whether "print.css" or
     * "notransitions.css" is loaded or not.
     */
    for (let sheet of document.styleSheets) {
        if (sheet.href !== null) {
            if (sheet.href.endsWith('print.css'))
                return 'Print';
            else if (sheet.href.endsWith('notransitions.css'))
                return 'No transitions';
        }
    }
    return 'Slideshow';
}
(0,_boxes_js__WEBPACK_IMPORTED_MODULE_1__.define_elements)();
start_page();


/***/ },

/***/ "./ts/slideshow.ts"
/*!*************************!*\
  !*** ./ts/slideshow.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SlideShow: () => (/* binding */ SlideShow)
/* harmony export */ });
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ "./ts/animation.ts");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./ts/util.ts");
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas.js */ "./ts/canvas.ts");
/**
 * slideshow - A module that define the class SlideShow whose aim is to
 * represent a slide show.
 */



class SlideShow {
    constructor(document) {
        this._remote_arrows = true;
        this._index = -1;
        this._current = null;
        this._on_button_click = (event) => {
            if (event.target && 'id' in event.target) {
                const id = event.target.id;
                if (id === "button-next")
                    this.move_forward();
                else if (id === "button-back")
                    this.move_backwards();
                else if (id === "button-contents")
                    this.move_home();
                else if (id === "button-scribble")
                    this.start_scribble();
            }
        };
        this._on_link_click = (event) => {
            const anchor = event.target;
            // Only works for links in the document
            const target = this._document.getElementById(anchor.hash.slice(1));
            if (target) {
                const article = target.closest("article");
                if (article)
                    this.change_slide(this._slides.indexOf(article));
            }
        };
        this._on_key_down = (event) => {
            const code = event.code;
            if (["Enter", "ArrowRight", "Space"].includes(code)) {
                event.stopPropagation();
                this.move_forward();
            }
            else if (code == "ArrowLeft") {
                event.stopPropagation();
                this.move_backwards();
            }
            else if (code == "Home") {
                if (event.ctrlKey)
                    this.move_first();
                else
                    this.move_home();
            }
            else if (code == "End") {
                this.move_end();
            }
            else if (code == "PageUp") {
                if (event.altKey || this._remote_arrows)
                    this.previous_slide();
                else
                    this.move_backwards();
            }
            else if (code == "PageDown") {
                if (event.altKey || this._remote_arrows)
                    this.next_slide();
                else
                    this.move_forward();
            }
            else if (code == "F5") {
                this._save_current_slide();
            }
            else if (code == 'KeyD' && event.ctrlKey && event.altKey) {
                this.start_scribble();
            }
            else if (code == 'KeyA' && event.ctrlKey && event.altKey) {
                this.toggle_remote_behavior();
            }
            else if (code == 'KeyR' && event.ctrlKey && event.altKey) {
                this.change_aspect_ratio();
            }
            else if (code == 'KeyP' && event.ctrlKey && event.altKey) {
                this.change_to_print_mode();
            }
            else if (code == 'KeyN' && event.ctrlKey && event.altKey) {
                this.change_to_notransitions_mode();
            }
        };
        this._wheel_handler = (event) => {
            this._move(Math.sign(event.deltaY));
        };
        this._document = document;
        const articles = this._document.getElementsByTagName("article");
        this._slides = Array.from(articles);
        this._canvas = new _canvas_js__WEBPACK_IMPORTED_MODULE_2__.Canvas(document);
    }
    start(index = undefined) {
        /**
         * Starts presentation at the page with the given index.
         */
        this._insert_title_next_button();
        this._create_navigation_buttons();
        this._link_click_events();
        this._document.addEventListener("keydown", this._on_key_down);
        this._document.addEventListener("wheel", this._wheel_handler);
        const saved = Number(localStorage.getItem("last"));
        let start = index !== undefined ? index : saved;
        if (isNaN(start))
            start = 0;
        this.change_slide(start);
    }
    stop() {
        this._document.removeEventListener("keydown", this._on_key_down);
        this._document.removeEventListener("wheel", this._wheel_handler);
        this._current.slide.classList.remove("current");
    }
    _insert_title_next_button() {
        const footer = this._document.querySelector('#title footer');
        if (footer !== null) {
            const self = this.constructor;
            const next = self._NEXT_BUTTON;
            const button = this._create_button("next", next);
            footer.insertBefore(button, footer.firstChild);
        }
    }
    _create_navigation_buttons() {
        const self = this.constructor;
        const back = self._BACK_BUTTON;
        const next = self._NEXT_BUTTON;
        const contents = self._CONTENTS_BUTTON;
        const pencil = self._PENCIL_BUTTON;
        for (let slide of this._slides) {
            const headers = slide.getElementsByTagName("header");
            if (headers.length > 0) {
                const header_nav = this._document.createElement("nav");
                const buttons = [
                    this._create_button('back', back),
                    this._create_button('next', next),
                    this._create_button('scribble', pencil),
                    this._create_button('contents', contents),
                ];
                buttons.map(button => header_nav.appendChild(button));
                headers[0].appendChild(header_nav);
            }
        }
    }
    _create_button(id, text) {
        let button = this._document.createElement("button");
        button.type = "button";
        button.id = `button-${id}`;
        button.innerText = text;
        button.addEventListener("click", this._on_button_click);
        return button;
    }
    _link_click_events() {
        for (const link of this._document.links)
            link.addEventListener("click", this._on_link_click);
    }
    _save_current_slide() {
        localStorage.setItem("last", this._index.toString());
    }
    _move(delta) {
        if (delta > 0)
            this.move_forward();
        else if (delta < 0)
            this.move_backwards();
    }
    get index() {
        return this._index;
    }
    get current() {
        return this._current;
    }
    change_slide(index) {
        /**
         * Goes to the slide with the given index.
         */
        if (index >= this._slides.length)
            return;
        this._set_current_slide(index);
        console.log(`Slide ${this._index + 1} of ${this._slides.length}`);
    }
    _set_current_slide(index) {
        if (index >= 0 && index < this._slides.length) {
            // This is the only place where this._current could be null
            if (this._current !== null)
                this._current.slide.classList.remove("current");
            this._index = index;
            this._current = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation(this._slides[this._index]);
            this._current.slide.classList.add("current");
            this._current.render_canvas();
        }
    }
    move_forward() {
        /**
         * Performs the next animation of the slide show.
         */
        try {
            this._current.move_forward();
        }
        catch (error) {
            if (error instanceof _animation_js__WEBPACK_IMPORTED_MODULE_0__.StopAnimation) {
                this.change_slide(this._index + 1);
            }
            else {
                console.log(error);
            }
        }
    }
    move_backwards() {
        /**
         * Goes to the previous animation of the slide show.
         */
        try {
            this._current.move_backwards();
        }
        catch (error) {
            if (error instanceof _animation_js__WEBPACK_IMPORTED_MODULE_0__.StopAnimation) {
                this.change_slide(this._index - 1);
                this._current.show_all();
            }
            else {
                console.log(error);
            }
        }
    }
    move_home() {
        /**
         * Goes to the contents slide of the presentation.
         */
        const home = this._document.getElementById("contents");
        if (home) {
            this.change_slide(this._slides.indexOf(home));
            this._current.show_all();
        }
    }
    move_first() {
        /**
         * Goes to the first slide without doing any animation.
         */
        this.change_slide(0);
    }
    move_end() {
        /**
         * Goes to the last animation of the last slide.
         */
        this.change_slide(this._slides.length - 1);
        this._current.show_all();
    }
    next_slide() {
        /**
         * Goes to the next slide without doing any animation.
         */
        this.change_slide(this._index + 1);
        this._current.show_all();
    }
    previous_slide() {
        /**
         * Goes to the last animation of the previous slide.
         */
        this.change_slide(this._index - 1);
        this._current.show_all();
    }
    start_scribble() {
        /**
         * Allows basic scribbling on a slide.
         */
        this._canvas.start();
    }
    toggle_remote_behavior() {
        /**
         * Toggles the behavious of NextPage and PreviousPage keys.
         */
        this._remote_arrows = !this._remote_arrows;
    }
    print_mode() {
        /**
         * Produces a static page with all the animations for printing.
         */
        for (let slide of this._slides)
            this._process_slide(slide);
        const canvases = document.querySelectorAll('canvas');
        for (const canvas of canvases) {
            try {
                canvas.force_render();
            }
            catch (error) {
                if (error instanceof TypeError) {
                    const msg = `Canvas ${canvas} cannot force render.`;
                    console.log(msg);
                }
                else {
                    throw error;
                }
            }
        }
    }
    _process_slide(slide) {
        const animation = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation(slide);
        const steps = animation.get_steps();
        for (let i = 0; i < steps.length; i++)
            this._create_animation(slide, i);
    }
    _create_animation(slide, index) {
        const copy = slide.cloneNode(true);
        const animation = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation(copy);
        const steps = animation.get_steps();
        for (let j = 0; j < steps.length - index; j++) {
            (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.show_all)(steps[j]['show']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.animate_all)(steps[j]['animate']);
            (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.erase_all)(steps[j]['erase']);
        }
        (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.insert_after)(copy, slide);
    }
    change_aspect_ratio() {
        /**
         * Changes the aspect ratio to an alternative configuration set in a
         * css file.
         */
        const root = this._document.documentElement;
        const style = window.getComputedStyle(root);
        const current_ratio = style.getPropertyValue('--slide-ratio');
        const updated_ratio = style.getPropertyValue('--alt-slide-ratio');
        const current_margin = style.getPropertyValue('--side-margin');
        const updated_margin = style.getPropertyValue('--alt-side-margin');
        const current_size = style.getPropertyValue('--text-size');
        const updated_size = style.getPropertyValue('--alt-text-size');
        root.style.setProperty('--slide-ratio', updated_ratio);
        root.style.setProperty('--alt-slide-ratio', current_ratio);
        root.style.setProperty('--side-margin', updated_margin);
        root.style.setProperty('--alt-side-margin', current_margin);
        root.style.setProperty('--text-size', updated_size);
        root.style.setProperty('--alt-text-size', current_size);
        console.log('Aspect ratio:', updated_ratio, ', Margin:', updated_margin, ', Text size:', updated_size);
    }
    change_to_print_mode() {
        /**
         * Stops the slide show and enters print mode producing a slide for
         * each animation.
         */
        this.stop();
        console.log('Print mode');
        this._add_style_sheet('print.css');
        this.print_mode();
    }
    change_to_notransitions_mode() {
        /**
         * Stops the slide show and enters print mode producing a slide with
         * its last animation.
         */
        this.stop();
        console.log('No transitions mode');
        this._add_style_sheet('notransitions.css');
    }
    _add_style_sheet(file) {
        const link = this._document.createElement('link');
        link.rel = 'stylesheet';
        // All slides' style sheets are assumed to be in the same folder
        const path = this._get_style_sheet_path();
        link.href = `${path}${file}`;
        this._document.head.append(link);
    }
    _get_style_sheet_path() {
        const links = Array.from(this._document.querySelectorAll('link'));
        for (const link of links) {
            if (link.href !== null && link.href.endsWith('slides.css'))
                return link.href.split('slides.css')[0];
        }
        throw new _util_js__WEBPACK_IMPORTED_MODULE_1__.SlidesError('slides.css not included.');
    }
}
SlideShow._BACK_BUTTON = '\u276E';
SlideShow._NEXT_BUTTON = '\u276F';
SlideShow._CONTENTS_BUTTON = '\u2302';
SlideShow._PENCIL_BUTTON = '\u270E';


/***/ },

/***/ "./ts/styles/html5-reset.css"
/*!***********************************!*\
  !*** ./ts/styles/html5-reset.css ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "html5-reset.css";

/***/ },

/***/ "./ts/styles/notransitions.css"
/*!*************************************!*\
  !*** ./ts/styles/notransitions.css ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "notransitions.css";

/***/ },

/***/ "./ts/styles/print.css"
/*!*****************************!*\
  !*** ./ts/styles/print.css ***!
  \*****************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "print.css";

/***/ },

/***/ "./ts/styles/slides.css"
/*!******************************!*\
  !*** ./ts/styles/slides.css ***!
  \******************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "slides.css";

/***/ },

/***/ "./ts/util.ts"
/*!********************!*\
  !*** ./ts/util.ts ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SlidesError: () => (/* binding */ SlidesError),
/* harmony export */   animate: () => (/* binding */ animate),
/* harmony export */   animate_all: () => (/* binding */ animate_all),
/* harmony export */   deanimate: () => (/* binding */ deanimate),
/* harmony export */   deanimate_all: () => (/* binding */ deanimate_all),
/* harmony export */   erase: () => (/* binding */ erase),
/* harmony export */   erase_all: () => (/* binding */ erase_all),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   hide_all: () => (/* binding */ hide_all),
/* harmony export */   insert_after: () => (/* binding */ insert_after),
/* harmony export */   show: () => (/* binding */ show),
/* harmony export */   show_all: () => (/* binding */ show_all),
/* harmony export */   unerase: () => (/* binding */ unerase),
/* harmony export */   unerase_all: () => (/* binding */ unerase_all)
/* harmony export */ });
/**
 * util - A module with utility functions for a slide show.
 */
class SlidesError extends Error {
}
function show(element) {
    element.classList.add("shown");
}
function show_all(elements) {
    elements.map(show);
}
function hide(element) {
    element.classList.remove("shown");
}
function hide_all(elements) {
    elements.map(hide);
}
function animate(element) {
    element.classList.add("animated");
}
function animate_all(elements) {
    elements.map(animate);
}
function deanimate(element) {
    element.classList.remove("animated");
}
function deanimate_all(elements) {
    elements.map(deanimate);
}
function erase(element) {
    element.classList.add("erased");
}
function erase_all(elements) {
    elements.map(erase);
}
function unerase(element) {
    element.classList.remove("erased");
}
function unerase_all(elements) {
    elements.map(unerase);
}
function insert_after(node, target) {
    if (target.parentNode) {
        target.parentNode.insertBefore(node, target.nextSibling);
    }
    else {
        throw new SlidesError('Target node has no parent.');
    }
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _slides_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slides.js */ "./ts/slides.ts");
/* harmony import */ var _styles_slides_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/slides.css */ "./ts/styles/slides.css");
/* harmony import */ var _styles_print_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/print.css */ "./ts/styles/print.css");
/* harmony import */ var _styles_notransitions_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/notransitions.css */ "./ts/styles/notransitions.css");
/* harmony import */ var _styles_html5_reset_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/html5-reset.css */ "./ts/styles/html5-reset.css");






})();

/******/ })()
;
//# sourceMappingURL=slides.js.map