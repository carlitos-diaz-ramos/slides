import {
    hide_all, show_all, animate_all, deanimate_all, erase_all, unerase_all
} from './util.js';


export class StopAnimation extends Error {
    constructor(message) {
        super(message);
        this.name = "StopAnimation";
    }
}


export class Animation {
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

    // CHECK: This 2 seems wrong: why is _get_default needed??
    // why not erase_all??
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


function _get_default(mapping, key) {
    if (mapping.hasOwnProperty(key)) {
        return mapping[key];
    } else {
        return [];
    }
}

