"use strict";

(function() {
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
        target.parentNode.insertBefore(node, target.nextSibling);
    }


    class StopAnimation extends Error {
        constructor(message) {
            super(message);
            this.name = "StopAnimation";
        }
    }


    class Animation {
        static _ANIMATION_TYPES = ['show', 'animate', 'erase'];

        constructor(slide) {
            this._slide = slide;
            this._steps = this.get_steps();
            this._current = null;
            this.hide_all();
        }

        get slide() {
            return this._slide;
        }

        get_steps() {
            const merged = this._merge_class(this.constructor._ANIMATION_TYPES);
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
            let trios = this._get_classes(classes).map(
                item => [this._get_class_value(...item), ...item]
            );
            trios.sort((a, b) => a[0] - b[0]);
            return trios;
        }

        _get_classes(classes) {
            let elements = [];
            for (let cls of classes) {
                let pattern = `[class*="${cls}-"]`;
                let selected = this._slide.querySelectorAll(pattern);
                for(let element of selected) {
                    elements.push([element, cls]);
                }
            }
            return elements;
        }

        _get_class_value(element, cls) {
            const text = element.attributes.class.nodeValue;
            const pattern = `${cls}-(\\d+)`;
            const regex = new RegExp(pattern);
            const matched = text.match(regex);
            return Number(matched[matched.length-1]);
        }

        _add_element(merged, n, element, cls) {
            if (merged.length > 0) {
                const last = merged.pop();
                if (last[0] == n) {
                    last[1][cls].push(element);
                    merged.push([n, last[1]]);
                } else {
                    merged.push(last);
                    merged.push([n, this._start_step(element, cls)]);
                }
            } else {
                merged.push([n, this._start_step(element, cls)]);
            }
        }

        _start_step(element, cls) {
            let initial = {};
            for (let type of this.constructor._ANIMATION_TYPES) 
                initial[type] = [];
            initial[cls].push(element);        
            return initial;
        }

        move_forward() {
            if (this._current + 1 <= this._steps.length) {
                show_all(this._steps[this._current]['show']);
                animate_all(this._steps[this._current]['animate']);
                erase_all(this._steps[this._current]['erase']);
                this._current++;
            } else {
                throw new StopAnimation();
            }
        }

        move_backwards() {
            if (this._current > 0) {
                --this._current;
                hide_all(this._steps[this._current]['show']);
                deanimate_all(this._steps[this._current]['animate']);
                unerase_all(this._steps[this._current]['erase']);
            } else {
                throw new StopAnimation();
            }
        }

        show_all() {
            for (let step of this._steps) {
                show_all(step['show']);
                animate_all(step['animate']);
                erase_all(step['erase']);
            }
            this._current = this._steps.length;
        }

        hide_all() {
            for (let step of this._steps) {
                hide_all(step['show']);
                deanimate_all(step['animate']);
                unerase_all(step['erase']);
            }
            this._current = 0;
        }

        render_canvas() {
            // Used for Three.js
            const canvases = this.slide.getElementsByTagName('canvas');
            for (let canvas of canvases) {
                try {
                    canvas.force_render();
                } catch(error) {}
            }
        }
    }

    class Canvas {
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


    class SlideShow {
        static _BACK_BUTTON = '\u276E';
        static _NEXT_BUTTON = '\u276F';
        static _CONTENTS_BUTTON = '\u2302';
        static _PENCIL_BUTTON = '\u270E'

        constructor(document) {
            this._document = document;
            const articles = this._document.getElementsByTagName("article")
            this._slides = Array.from(articles);
            this._canvas = new Canvas(document);
        }

        start(index) {
            this._insert_title_next_button();
            this._create_navigation_buttons();
            this._link_click_events();
            this._document.addEventListener("keydown", this._on_key_down);
            this._document.addEventListener("wheel", this._wheel_handler);
            this._index = null;
            this._current = null;
            const saved = Number(localStorage.getItem("last"))
            let start = index !== undefined ? index : saved;
            if (isNaN(start)) 
                start = 0;
            this.change_slide(start); 
        }

        _insert_title_next_button() {
            const footer = this._document.querySelector('#title footer');
            if (footer !== null) {
                const next = this.constructor._NEXT_BUTTON;
                const button = this._create_button("next", next);
                footer.insertBefore(button, footer.firstChild);
            }
        }

        _create_navigation_buttons() {
            const back = this.constructor._BACK_BUTTON;
            const next = this.constructor._NEXT_BUTTON;
            const contents = this.constructor._CONTENTS_BUTTON;
            const pencil = this.constructor._PENCIL_BUTTON;
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

        _on_button_click = (event) => {
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

        _link_click_events() {
            for (let link of this._document.links)
                link.addEventListener("click", this._on_link_click);
        }

        _on_link_click = (event) => {
            /* https://stackoverflow.com/questions/2136461/
            use-javascript-to-intercept-all-document-link-clicks */
            const anchor = 
                event.target || event.srcElement || event.originalTarget;
            // Only works for links in the document
            const target = this._document.getElementById(anchor.hash.slice(1));
            this.change_slide(this._slides.indexOf(target.closest("article")));
        }

        _on_key_down = (event) => {
            const code = event.code;
            if (["Enter", "ArrowRight", "Space"].includes(code)) {
                event.stopPropagation();
                this.move_forward();
            } else if (code == "ArrowLeft") {
                event.stopPropagation();
                this.move_backwards();
            } else if (code == "Home") {
                if (event.ctrlKey) 
                    this.move_first();
                else
                    this.move_home();
            } else if (code == "End") {
                this.move_end();
            } else if (code == "PageUp") {
                this.previous_slide();
            } else if (code == "PageDown") {
                this.next_slide();
            } else if (code == "F5") {
                this._save_current_slide();
            } else if (code == 'KeyD' && event.ctrlKey && event.altKey) {
                this.start_scribble();
            }
        }

        _save_current_slide() {
            localStorage.setItem("last", this._index);
        }

        _wheel_handler = (event) => {
            this._move(Math.sign(event.deltaY));
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
            if (index >= this._slides.length) return;
            this._set_current_slide(index);
            console.log(`Slide ${this._index+1} of ${this._slides.length}`);
        }

        _set_current_slide(index) {
            if (index >= 0 && index < this._slides.length) {
                if (this._current !== null)
                    this._current.slide.classList.remove("current");
                this._index = index;
                this._current = new Animation(this._slides[this._index]);
                this._current.slide.classList.add("current");
                this._current.render_canvas();
            }
        }

        move_forward() {
            try {
                this._current.move_forward();
            } catch (error) {
                if (error instanceof StopAnimation) {
                    this.change_slide(this._index+1);
                } else {
                    console.log(error);
                }
            }
        }

        move_backwards() {
            try {
                this._current.move_backwards();
            } catch (error) {
                if (error instanceof StopAnimation) {
                    this.change_slide(this._index-1);
                    this._current.show_all();
                } else {
                    console.log(error);
                }
            }
        }

        move_home() {
            const home = this._document.getElementById("contents");
            this.change_slide(this._slides.indexOf(home));
            this._current.show_all();
        }

        move_first() {
            this.change_slide(0);
        }

        move_end() {
            this.change_slide(this._slides.length-1);
            this._current.show_all();
        }

        next_slide() {
            this.change_slide(this._index+1);
            this._current.show_all();
        }

        previous_slide() {
            this.change_slide(this._index-1);
            this._current.show_all();
        }

        start_scribble() {
            this._canvas.start();
        }

        print_mode() {
            for (let slide of this._slides) 
                this._process_slide(slide);
        }

        _process_slide(slide) {
            const animation = new Animation(slide);
            const steps = animation.get_steps();
            for (let i = 0; i < steps.length; i++) 
                this._create_animation(slide, i);
        }

        _create_animation(slide, index) {
            const copy = slide.cloneNode(true);
            const animation = new Animation(copy);
            const steps = animation.get_steps();
            for (let j = 0; j < steps.length - index; j++) {
                show_all(steps[j]['show']);
                animate_all(steps[j]['animate']);
                erase_all(steps[j]['erase']);
            }
            insert_after(copy, slide);
        }
    }
    
    class TwoBoxes extends HTMLElement {
        connectedCallback() {
            this.attachShadow({mode: 'open'});
            const tmpl = this.constructor.template({
                color: this.dataset.bg,
                styles: this.constructor._get_stylesheets()
            });
            this.shadowRoot.append(tmpl.content.cloneNode(true));
        }

        static template({styles = [], color = 'white'}) {
            const tmpl = document.createElement('template');
            tmpl.innerHTML = this.prototype.constructor._CODE;
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
            path.classList.add(bg);
        }

        static _get_stylesheets() {
            const stylesheets = Array.from(document.styleSheets);
            const with_href = stylesheets.filter(
                (item) => {return item.href !== null}
            );
            return with_href.map((item) => {return item.href});
        }
    }

    class SlideIff extends TwoBoxes {
        static _CODE = `
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

        static template({styles = [], color = 'yellow'}) {
            return super.template({styles: styles, color: color});
        }
    }

    class SlideImplies extends TwoBoxes {
        static _CODE = `
            <div class="two-boxes">
             <div>
              <slot name="left"></slot>
             </div>
             <svg viewBox="0,0 40,22">
              <title>If and only if</title>
              <path d="M1,11 V6 H29 V2 Q29,1 29.71,1.70 L39,11 29.71,20.30 
               Q29,21 29,20 V16 H1 V11 z"/>
             </svg>
             <div>
              <slot name="right"></slot>
             </div>
            </div>
        `;

        static template({styles = [], color = 'green'}) {
            return super.template({styles: styles, color: color});
        }
    }

    class SlideImplied extends TwoBoxes {
        static _CODE = `
            <div class="two-boxes">
             <div>
              <slot name="left"></slot>
             </div>
             <svg viewBox="0,0 40,22">
              <title>If and only if</title>
              <path d="M10,6 Q22,20 33,1 L33,8 39,9 Q22,29 5,11 L1,15 L1,2 
               L14,2 z"/>
             </svg>
             <div>
              <slot name="right"></slot>
             </div>
            </div>
        `;
    }

    function define_elements() {
        customElements.define('slide-iff', SlideIff);
        customElements.define('slide-implies', SlideImplies);
        customElements.define('slide-implied', SlideImplied);
    }


    function start_page() {
        const mode = get_mode();
        console.log(`${mode} mode`)
        if (mode === "Slideshow") {
            window.addEventListener("load", on_load);
        } else if (mode === "Print") {
            window.addEventListener("load", on_print_load);
        };
    }


    function on_load() {
        const slide_show = new SlideShow(document);
        slide_show.start();
    }

    function on_print_load() {
        const slide_show = new SlideShow(document);
        slide_show.print_mode();
        const canvases = document.querySelectorAll('canvas');
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].force_render();
        }
    }

    function get_mode() {
        // Decide if slideshow mode is on, based on whether "code/print.css" 
        // is loaded or not
        let parts, mode = "Slideshow";
        for (let sheet of document.styleSheets) {
            if (sheet.href !== null) {
                parts = sheet.href.split("code/");
                if (parts.length > 1) {
                    if (parts[1] === "print.css") {
                        mode = "Print";
                        break;
                    } else if (parts[1] === "notransitions.css") {
                        mode ="No transitions";
                        break;
                    }
                }
            }
        }
        return mode;
    }

    define_elements();
    start_page();

})();
