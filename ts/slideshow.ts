import {Animation, StopAnimation} from './animation.ts';
import {show_all, animate_all, erase_all, insert_after} from './util.ts';
import {Canvas} from './canvas.ts';


export class SlideShow {
    /**
     * Represents a slide show associated to a given html document.
     */
    protected _document: HTMLDocument
    protected _slides: HTMLElement[]
    protected _canvas: Canvas
    protected _remote_arrows: boolean
    protected _index: number
    protected _current: Animation

    protected static _BACK_BUTTON = '\u276E';
    protected static _NEXT_BUTTON = '\u276F';
    protected static _CONTENTS_BUTTON = '\u2302';
    protected static _PENCIL_BUTTON = '\u270E'

    constructor(document: HTMLDocument) {
        this._document = document;
        const articles = this._document.getElementsByTagName("article");
        this._slides = Array.from(articles);
        this._canvas = new Canvas(document);
        this._remote_arrows = true;
    }

    start(index: number = 0) {
        /**
         * Starts presentation at the page with the given index.
         */
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

    // stop() {
    //     this._document.removeEventListener("keydown", this._on_key_down);
    //     this._document.removeEventListener("wheel", this._wheel_handler);
    //     this._current.slide.classList.remove("current");
    // }

    _insert_title_next_button() {
        const footer = this._document.querySelector('#title footer');
        if (footer !== null) {
            const self = this.constructor as typeof SlideShow;
            const next = self._NEXT_BUTTON;
            const button = this._create_button("next", next);
            footer.insertBefore(button, footer.firstChild);
        }
    }

    _create_navigation_buttons() {
        const self = this.constructor as typeof SlideShow;
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

    _create_button(id: string, text: string) {
        let button = this._document.createElement("button");
        button.type = "button";
        button.id = `button-${id}`;
        button.innerText = text;
        button.addEventListener("click", this._on_button_click);
        return button;
    }

    _on_button_click = (event: Event) => {
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
    }

    _link_click_events() {
        for (let link of this._document.links)
            link.addEventListener("click", this._on_link_click);
    }

    _on_link_click = (event: MouseEvent) => {
        const anchor = event.target as HTMLAnchorElement;
        // Only works for links in the document
        const target = this._document.getElementById(anchor.hash.slice(1));
        if (target) {
            const article = target.closest("article");
            if (article)
                this.change_slide(this._slides.indexOf(article));
        }
    }

    _on_key_down = (event: KeyboardEvent) => {
        const code = event.code;
        if (["Enter", "ArrowRight", "Space"].includes(code)) {
            event.stopPropagation();
            this.move_forward();
        } else if (code == "ArrowLeft") {
            event.stopPropagation();
            this.move_backwards();
        } else if (code == "Home") {
            if (event.altKey) 
                this.move_first();
            else
                this.move_home();
        } else if (code == "End") {
            this.move_end();
        } else if (code == "PageUp") {
            if (event.altKey || this._remote_arrows)
                this.previous_slide();
            else
                this.move_backwards();
        } else if (code == "PageDown") {
            if (event.altKey || this._remote_arrows)
                this.next_slide();
            else
                this.move_forward();
        } else if (code == "F5") {
            this._save_current_slide();
        } else if (code == 'KeyD' && event.ctrlKey && event.altKey) {
            this.start_scribble();
        } else if (code == 'KeyA' && event.ctrlKey && event.altKey) {
            this.toggle_remote_behavior();
        // } else if (code == 'KeyR' && event.ctrlKey && event.altKey) {
        //     this.change_aspect_ratio();
        // } else if (code == 'KeyP' && event.ctrlKey && event.altKey) {
        //     this.change_to_print_mode();
        // } else if (code == 'KeyN' && event.ctrlKey && event.altKey) {
        //     this.change_to_notransitions_mode();
        }
    }

    _save_current_slide() {
        localStorage.setItem("last", this._index.toString());
    }

    _wheel_handler = (event: WheelEvent) => {
        this._move(Math.sign(event.deltaY));
    }

    _move(delta: number) {
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

    change_slide(index: number) {
        /**
         * Goes to the slide with the given index.
         */
        if (index >= this._slides.length) return;
        this._set_current_slide(index);
        console.log(`Slide ${this._index+1} of ${this._slides.length}`);
    }

    _set_current_slide(index: number) {
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
        /**
         * Performs the next animation of the slide show.
         */
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
        /**
         * Goes to the previous animation of the slide show.
         */
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
        this.change_slide(this._slides.length-1);
        this._current.show_all();
    }

    next_slide() {
        /**
         * Goes to the next slide without doing any animation.
         */
        this.change_slide(this._index+1);
        this._current.show_all();
    }

    previous_slide() {
        /**
         * Goes to the last animation of the previous slide.
         */
        this.change_slide(this._index-1);
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
                (canvas as ThreeCanvas).force_render();
            } catch (error) {
                if (error instanceof TypeError) {
                    const msg = `Canvas ${canvas} cannot force render.`;
                    console.log(msg);
                } else {
                    throw error;
                }
            }
        }
    }

    _process_slide(slide: HTMLElement) {
        const animation = new Animation(slide);
        const steps = animation.get_steps();
        for (let i = 0; i < steps.length; i++) 
            this._create_animation(slide, i);
    }

    _create_animation(slide: HTMLElement, index: number) {
        const copy = slide.cloneNode(true) as HTMLElement;
        const animation = new Animation(copy);
        const steps = animation.get_steps();
        for (let j = 0; j < steps.length - index; j++) {
            show_all(steps[j]['show']);
            animate_all(steps[j]['animate']);
            erase_all(steps[j]['erase']);
        }
        insert_after(copy, slide);
    }

    // change_aspect_ratio() {
    //     const root = document.querySelector(':root');
    //     const style = window.getComputedStyle(root);
    //     const current_ratio = style.getPropertyValue('--slide-ratio');
    //     const updated_ratio = style.getPropertyValue('--alt-slide-ratio');
    //     const current_margin = style.getPropertyValue('--side-margin');
    //     const updated_margin = style.getPropertyValue('--alt-side-margin');
    //     const current_size = style.getPropertyValue('--text-size');
    //     const updated_size = style.getPropertyValue('--alt-text-size');
    //     root.style.setProperty('--slide-ratio', updated_ratio);
    //     root.style.setProperty('--alt-slide-ratio', current_ratio);
    //     root.style.setProperty('--side-margin', updated_margin);
    //     root.style.setProperty('--alt-side-margin', current_margin);
    //     root.style.setProperty('--text-size', updated_size);
    //     root.style.setProperty('--alt-text-size', current_size);
    //     console.log(
    //         'Aspect ratio:', updated_ratio, 
    //         ', Margin:', updated_margin,
    //         ', Text size:', updated_size,
    //     );
    // }

    // change_to_print_mode() {
    //     this.stop();
    //     console.log('Print mode');
    //     const link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     TODO: insert path correctly; e.g. in doc.html we need ..
    //     link.href = 'code/print.css';
    //     document.head.append(link);
    //     this.print_mode();
    // }

    // change_to_notransitions_mode() {
    //     this.stop();
    //     console.log('No transitions mode');
    //     const link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.href = 'code/notransitions.css';
    //     document.head.append(link);
    // }
}
    
type ThreeCanvas = HTMLCanvasElement & {force_render: () => null};
