class TwoBoxes extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const tmpl = this.constructor.template({
            color: this.dataset.bg,
            cls: this.classList,
            styles: TwoBoxes._get_stylesheets()
        });
        this.shadowRoot.append(tmpl.content.cloneNode(true));
    }

    static template({styles = [], cls = [], color = 'white'}) {
        const tmpl = document.createElement('template');
        tmpl.innerHTML = this.prototype.constructor._CODE;
        this._set_styles(tmpl, styles);
        this._set_class(tmpl, cls);
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

    static _set_class(tmpl, cls) {
        const div = tmpl.content.querySelector('div.two-boxes');
        for (let item of cls) 
            div.classList.add(item);
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

export class SlideIff extends TwoBoxes {
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
}

export class SlideImplies extends TwoBoxes {
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
}

export class SlideImplied extends TwoBoxes {
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

export function define_elements() {
    customElements.define('slide-iff', SlideIff);
    customElements.define('slide-implies', SlideImplies);
    customElements.define('slide-implied', SlideImplied);
}
