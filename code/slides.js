"use strict";

(function() {
    // Auxiliary functions
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

    function _get_default(mapping, key) {
        if (mapping.hasOwnProperty(key)) {
            return mapping[key];
        } else {
            return [];
        }
    }


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
            this.hide_all();
        }

        get slide() {
            return this._slide;
        }

        get_steps() {
            const merged = this._merge_class(['show', 'animate', 'erase']);
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
                    merged.push([n, this._add_to_class(last[1], element, cls)]);
                } else {
                    merged.push(last);
                    merged.push([n, {[cls]: [element]}]);
                }
            } else {
                merged.push([n, {[cls]: [element]}]);
            }
        }

        _add_to_class(mapping, element, cls) {
            if (!mapping.hasOwnProperty(cls))
                mapping[cls] = [];
            mapping[cls] = mapping[cls].concat([element]);
            return mapping;
        }

        move_forward() {
            if (this._current + 1 <= this._steps.length) {
                show_all(_get_default(
                    this._steps[this._current], 'show'
                ));
                animate_all(_get_default(
                    this._steps[this._current], 'animate'
                ));
                erase_all(_get_default(
                    this._steps[this._current], 'erase'
                ));
                this._current++;
            } else {
                throw new StopAnimation();
            }
        }

        move_backwards() {
            if (this._current > 0) {
                --this._current;
                hide_all(_get_default(
                    this._steps[this._current], 'show'
                ));
                deanimate_all(_get_default(
                    this._steps[this._current], 'animate'
                ));
                unerase_all(_get_default(
                    this._steps[this._current], 'erase'
                ));
            } else {
                throw new StopAnimation();
            }
        }

        show_all() {
            for (let step of this._steps) {
                if(step.hasOwnProperty('show'))
                    show_all(_get_default(step, 'show'));
                if(step.hasOwnProperty('animate'))
                    animate_all(_get_default(step, 'animate'));
            }
            this._current = this._steps.length;
        }

        hide_all() {
            for (let step of this._steps) {
                if(step.hasOwnProperty('show'))
                    hide_all(_get_default(step, 'show'));
                if(step.hasOwnProperty('animate'))
                    deanimate_all(_get_default(step, 'animate'));
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


    class SlideShow {
        constructor(document) {
            this._document = document;
            const articles = document.getElementsByTagName("article")
            this._slides = Array.from(articles);
        }
    
        start(slide) {
            this._insert_title_next_button();
            this._create_navigation_buttons();
            this._link_click_events();
            document.addEventListener("keydown", this._on_key_down);
            document.addEventListener("wheel", this._wheel_handler);
            this._index = null;
            this._current = null;
            let start = slide ? 
                slide !== undefined : Number(localStorage.getItem("last"));
            this.change_slide(start); 
        }

        _insert_title_next_button() {
            const footer = document.querySelector('#title footer');
            const button = this._create_button("next", "\u276F");
            footer.insertBefore(button, footer.firstChild);
        }
    
        _create_navigation_buttons() {
            for (let slide of this._slides) {
                let headers = slide.getElementsByTagName("header");
                if (headers.length > 0) {
                    let header_nav = document.createElement("nav");
                    let buttons = [
                        this._create_button("back", "\u276E"),
                        this._create_button("next", "\u276F"),
                        this._create_button("contents", "\u2302"),
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
        }
    
        _link_click_events() {
            for (let link of this._document.links)
                link.addEventListener("click", this._on_link_click);
        }
    
        _on_link_click = (event) => {
            /* https://stackoverflow.com/questions/2136461/
            use-javascript-to-intercept-all-document-link-clicks */
            let anchor = 
                event.target || event.srcElement || event.originalTarget;
            // Only works for links in the document
            let target = this._document.getElementById(anchor.hash.slice(1));
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
            }
        }
    
        _save_current_slide() {
            localStorage.setItem("last", this.current);
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
    
        get current() {
            return this._index;
        }

        change_slide(index) {
            if (index >= this._slides.length) return;
            this._set_current_slide(index);
            console.log(`Slide ${this.current+1} of ${this._slides.length}`);
        }
    
        _set_current_slide(index) {
            if (index >= 0 && index < this._slides.length) {
                if (this._current !== null)
                    this._current.slide.classList.remove("current");
                this._index = index;
                this._current = new Animation(this._slides[this.current]);
                this._current.slide.classList.add("current");
                this._current.render_canvas();
            }
        }
    
        move_forward() {
            try {
                this._current.move_forward();
            } catch (error) {
                if (error instanceof StopAnimation) {
                    this.change_slide(this.current+1);
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
                    this.change_slide(this.current-1);
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
    
        move_end() {
            this.change_slide(this._slides.length-1);
            this._current.show_all();
        }
    
        next_slide() {
            this.change_slide(this.current+1);
            this._current.show_all();
        }
    
        previous_slide() {
            this.change_slide(this.current-1);
            this._current.show_all();
        }

        move_first() {
            this.change_slide(0);
        }
    
        print_mode() {
            for (let slide of this._slides) 
                this._process_slide(slide);
        }
    
        _process_slide(slide) {
            let animation = new Animation(slide);
            let steps = animation.get_steps();
            for (let i = 0; i < steps.length; i++) 
                this._create_animation(slide, i);
        }
    
        _create_animation(slide, index) {
            let copy = slide.cloneNode(true);
            let animation = new Animation(copy);
            let steps = animation.get_steps();
            for (let j = 0; j < steps.length - index; j++) {
                show_all(_get_default(steps[j], 'show'));
                animate_all(_get_default(steps[j], 'animate'));
                erase_all(_get_default(steps[j], 'erase'));
            }
            insert_after(copy, slide);
        }
    }
        
    function on_load() {
        let slide_show = new SlideShow(document);
        slide_show.start();
    }

    function on_print_load() {
        let slide_show = new SlideShow(document);
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

    function start_page() {
        const mode = get_mode();
        console.log(`${mode} mode`)
        if (mode === "Slideshow") {
            window.addEventListener("load", on_load);
        } else if (mode === "Print") {
            window.addEventListener("load", on_print_load);
        };
    }
    start_page();

})();
