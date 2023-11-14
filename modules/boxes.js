class TwoBoxes extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const template = this.constructor.template(this.dataset.bg);
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static template(color) {
        const tmpl = document.createElement('template');
        tmpl.innerHTML = this.prototype.constructor._CODE;
        this._set_color(tmpl, color);
        return tmpl;
    }

    static _set_color(tmpl, color) {
        const bg = `bg-${color}`;
        const divs = tmpl.content.querySelectorAll('.two-boxes div');
        for (let div of divs) 
            div.classList.add(bg);
        const path = tmpl.content.querySelector('.two-boxes svg path');
        path.classList.add(bg);
    }
}

export class SlideIff extends TwoBoxes {
    static _CODE = `
        <link rel="stylesheet" href="../code/slides.css">
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
        <link rel="stylesheet" href="../code/slides.css">
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
        <link rel="stylesheet" href="../code/slides.css">
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
