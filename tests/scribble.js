import {Canvas} from '../dist/canvas.js';

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
        const canvas = new Canvas(slide);
        canvas.set_size = (width, height) => {
            [canvas._width, canvas._height] = [400, 300]
        };
        return canvas;
    }

    let canvas, svg;

    beforeEach(() => {
        canvas = create_document();
        canvas.start();
        svg = canvas.slide.querySelector('section svg.scribble');
    });

    it('Inserts svg at current article section', () => {
        assert.notEqual(svg, null);
    })

    it('svg occupies the whole area', () => {
        assert.equal(svg.getAttribute('width'), '100%');
        assert.equal(svg.getAttribute('height'), '100%');
    })

    it('Check size of svg', () => {
        assert.equal(svg.getAttribute('viewBox'), '0,0 400,300')
    })

    it('Mouse down produces polyline in svg', () => {
        canvas.start_stroke(20, 30);
        const polyline = svg.querySelector('polyline');
        assert.notEqual(polyline, null);
        assert.equal(polyline.getAttribute('points'), '20,30');
    })

    it('Mouse down and move once produces polyline with 2 points', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline.getAttribute('points'), '20,30 25,32');
    })

    it('Mouse down and move twice produces polyline with 3 points', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline.getAttribute('points'), '20,30 25,32 22,37');
    })

    it('Mouse down, move, mouse up, produces polyline', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke(17, 54);
        const polyline = svg.querySelector('polyline');
        const expected = '20,30 25,32 22,37 17,54';
        assert.equal(polyline.getAttribute('points'), expected);
    })

    it('Move without starting actually starts stroke', () => {
        canvas.continue_stroke(25, 32);
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline.getAttribute('points'), '25,32');
    })

    it('Mouse down, move, mouse up, mouse down produces 2 polyline', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.start_stroke(50, 60);
        const polylines = svg.querySelectorAll('polyline');
        assert.equal(polylines.length, 2);
    })

    it('Create stroke and undo last removes all polyline', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.undo_last();
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline, null);
    })

    it('Create two strokes and remove one, remains one', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.undo_last();
        const polylines = svg.querySelectorAll('polyline');
        assert.equal(polylines.length, 1);
    })

    it('Create two strokes and remove two, none remain', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.undo_last();
        canvas.undo_last();
        const polylines = svg.querySelectorAll('polyline');
        assert.equal(polylines.length, 0);
    })

    it('Create stroke and undo two removes all, but no error', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.continue_stroke(22, 37);
        canvas.end_stroke();
        canvas.undo_last();
        canvas.undo_last();
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline, null);
    })

    it('Undo while creating stroke produces no error', () => {
        canvas.start_stroke(20, 30);
        canvas.continue_stroke(25, 32);
        canvas.undo_last();
        const polyline = svg.querySelector('polyline');
        assert.equal(polyline, null);
    })
})
