/**
 * animations - A module that takes care of animations within a fixed slide.
 */

import {
    hide_all, show_all, animate_all, deanimate_all, erase_all, unerase_all,
} from './util.ts';


export class StopAnimation extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StopAnimation";
    }
}


export class Animation {
    /**
     * Represents an animation in a slide.
     */
    protected readonly _slide: HTMLElement;
    protected _steps: {[key: string]: Element[]}[];
    protected _current: number;
    protected static readonly _ANIMATION_TYPES = ['show', 'animate', 'erase'];

    constructor(slide: HTMLElement) {
        this._slide = slide;
        this._steps = this.get_steps();
        this._current = 0;
        this.hide_all();
    }

    get slide() {
        return this._slide;
    }

    get_steps() {
        const self = this.constructor as typeof Animation;
        const merged = this._merge_class(self._ANIMATION_TYPES);
        return merged.map(item => item[1]);
    }
    
    protected _merge_class(classes: string[]) {
        let merged: [number, {[key: string]: Element[]}][] = [];
        const trios = this._get_number_class_list(classes);
        for (let [n, element, cls] of trios) {
            this._add_element(merged, n, element, cls);
        }
        return merged;
    }

    protected _get_number_class_list(classes: string[]) {
        let trios: [number, Element, string][];
        trios = this._get_classes(classes).map(
            item => [this._get_class_value(...item), ...item]
        );
        trios.sort((a, b) => a[0] - b[0]);
        return trios;
    }

    protected _get_classes(classes: string[]): [Element, string][] {
        let elements: [Element, string][] = [];
        for (let cls of classes) {
            let pattern = `[class*="${cls}-"]`;
            let selected = this._slide.querySelectorAll(pattern);
            for (let element of selected) {
                elements.push([element, cls]);
            }
        }
        return elements;
    }

    protected _get_class_value(element: Element, cls: string): number {
        const text = element.className;
        const pattern = `${cls}-(\\d+)`;
        const regex = new RegExp(pattern);
        const matched = text.match(regex)!;
        return Number(matched[matched.length-1]);
    }

    protected _add_element(
        merged: [number, {[key: string]: Element[]}][], 
        n: number, 
        element: Element, 
        cls: string
    ) {
        if (merged.length > 0) {
            const last = merged.pop()!;
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

    protected _start_step(element: Element, cls: string) {
        const initial: {[key: string]: Element[]} = {};
        const self = this.constructor as typeof Animation;
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
            show_all(this._steps[this._current]['show']);
            animate_all(this._steps[this._current]['animate']);
            erase_all(this._steps[this._current]['erase']);
            this._current++;
        } else {
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
            hide_all(this._steps[this._current]['show']);
            deanimate_all(this._steps[this._current]['animate']);
            unerase_all(this._steps[this._current]['erase']);
        } else {
            throw new StopAnimation('No more animations');
        }
    }

    show_all() {
        /**
         * Goes to the last animation of the slide.
         */
        for (let step of this._steps) {
            show_all(step['show']);
            animate_all(step['animate']);
            erase_all(step['erase']);
        }
        this._current = this._steps.length;
    }

    hide_all() {
        /**
         * Goes to the state of the slide before any animation.
         */
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
}

type ThreeCanvas = HTMLCanvasElement & {force_render: () => null};
