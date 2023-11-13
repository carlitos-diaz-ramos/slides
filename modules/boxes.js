export function iff_template() {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = `
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
    return tmpl;
}

class SlideIff extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const tmpl = iff_template();
        this.shadowRoot.append(tmpl.content.cloneNode(true));
    }
}

export function define_elements() {
    customElements.define('slide-iff', SlideIff);
}
