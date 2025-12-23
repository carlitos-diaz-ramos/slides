/**
 * boxes - A module that creates pairs of boxes with arrows.
 * Used for definitions, implications, equivalences and so on.
 */

import {SlidesError} from './util.ts';


class TwoBoxes extends HTMLElement {
    /**
     * Base clase for the boxes definded in this module.
     * It creates a <template> html element with two slots that contain the 
     * content for each of the two boxes of the element.
     */
    protected static _CODE: string

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const self = this.constructor as typeof TwoBoxes;
        const color = this.dataset.bg;
        const tmpl = self.template({
            styles: self._get_stylesheets(),
            color: color ? color : 'white',
        });
        if (this.shadowRoot) {
            this.shadowRoot.append(tmpl.content.cloneNode(true));
        } else {
            throw new SlidesError('Element has no shadowRoot.')
        }
    }

    static template(
        {styles = [], color = 'white'}: {styles: string[], color: string}
    ) {
        const tmpl = document.createElement('template');
        const self = this.prototype.constructor as typeof TwoBoxes;
        tmpl.innerHTML = self._CODE;
        this._set_styles(tmpl, styles);
        this._set_color(tmpl, color);
        return tmpl;
    }

    protected static _set_styles(
        tmpl: HTMLTemplateElement, 
        styles: string[]
    ) {
        const div = tmpl.content.querySelector('div.two-boxes');
        for (let style of styles) {
            const link = document.createElement('link');
            link.href = style;
            link.rel = 'stylesheet';
            tmpl.content.insertBefore(link, div);
        }
    }

    protected static _set_color(tmpl: HTMLTemplateElement, color: string) {
        const bg = `bg-${color}`;
        const divs = tmpl.content.querySelectorAll('.two-boxes div');
        for (let div of divs) 
            div.classList.add(bg);
        const path = tmpl.content.querySelector('.two-boxes svg path');
        if (path) {
            path.classList.add(bg);
        } else {
            throw new SlidesError('Svg arrow has no path element.')
        }
    }

    protected static _get_stylesheets(): string[] {
        const stylesheets = Array.from(document.styleSheets);
        const with_href = stylesheets.filter(item => item.href !== null);
        return with_href.map(item => item.href ? item.href : '');
    }
}

export class SlideIff extends TwoBoxes {
    /**
     * Creates two boxes with "if and only if" arrow in the middle.
     * This is entered in the html as a <slide-iff> element with two slots:
     * a <div slot="left"> and a <div slot="right">.
     */
    protected static _CODE = `
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

    static template(
        {styles = [], color = 'yellow'}: {styles: string[], color: string}
    ) {
        return super.template({styles: styles, color: color});
    }
}

export class SlideImplies extends TwoBoxes {
    /**
     * Creates two boxes with right-pointing arrow in the middle.
     * This is entered in the html as a <slide-implies> element with two 
     * slots: a <div slot="left"> and a <div slot="right">.
     */
    protected static _CODE = `
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

    static template(
        {styles = [], color = 'green'}: {styles: string[], color: string}
    ) {
        return super.template({styles: styles, color: color});
    }
}

export class SlideImplied extends TwoBoxes {
    /**
     * Creates two boxes with a left-pointing arrow in the middle.
     * This is entered in the html as a <slide-implied> element with two 
     * slots: a <div slot="left"> and a <div slot="right">.
     */
    protected static _CODE = `
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
}

export function define_elements() {
    customElements.define('slide-iff', SlideIff);
    customElements.define('slide-implies', SlideImplies);
    customElements.define('slide-implied', SlideImplied);
}
