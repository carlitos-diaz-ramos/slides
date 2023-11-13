import {iff_template} from "../modules/boxes.js";

describe('Boxes with arrows', function() {
    describe('iff_template', function() {
        it('A div.two-boxes is created', function() {
            const template = iff_template();
            const boxes = template.content.querySelector('div.two-boxes');
            assert.notEqual(boxes, null);
        })

        it('div.two-boxes has two divs', function() {
            const template = iff_template();
            const boxes = template.content.querySelector('div.two-boxes');
            const divs = boxes.querySelectorAll('div');
            assert.equal(divs.length, 2);
        })

        it('1st div in .two-boxes has a slot with name "left"', function() {
            const template = iff_template();
            const boxes = template.content.querySelector('div.two-boxes');
            const divs = boxes.querySelectorAll('div');
            const slots = divs[0].querySelectorAll('slot[name="left"');
            assert(slots.length, 1);
        })

        it('2nd div in .two-boxes has a slot with name "right"', function() {
            const template = iff_template();
            const boxes = template.content.querySelector('div.two-boxes');
            const divs = boxes.querySelectorAll('div');
            const slots = divs[1].querySelectorAll('slot[name="right"');
            assert(slots.length, 1);
        })

        it('A link is created', function() {
            const template = iff_template();
            const link = template.content.querySelector('link');
            assert.notEqual(link, null);
        })

        it('link refers to slides.css', function() {
            const template = iff_template();
            const link = template.content.querySelector('link');
            assert.equal(link.href.slice(-16), '/code/slides.css');
        })

        it('There is a svg between the divs', function() {
            const template = iff_template();
            const svg = template.content.querySelector('div.two-boxes svg');
            assert.notEqual(svg, null);
            const previous = svg.previousElementSibling
            assert.equal(previous.nodeName.toLowerCase(), 'div');
            const next = svg.nextElementSibling;
            assert.equal(next.nodeName.toLowerCase(), 'div');
        })
    })
})
