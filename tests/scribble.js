import {Canvas} from '../modules/canvas.js';

describe('Scribble', () => {
    function create_document() {
        const slide = document.implementation.createHTMLDocument('Test');
        const code = `
            <article class="current">
             <section>
             <p>Some content</p>
             </section>
            </article>
        `;
        const main = slide.createElement('main');
        main.innerHTML = code;
        slide.body.appendChild(main)
        const article = slide.querySelector('.current');
        article.style.width="500px";
        return new Canvas(slide);
    }

    it('Inserts svg at current article', () => {
        const canvas = create_document();
        canvas.start();
        const svg = canvas.slide.querySelector('svg.scribble');
        assert.notEqual(svg, null);
    })
})
