import {SlideIff, SlideImplies, SlideImplied} from "../dist/boxes.js";

describe('Boxes with arrows', function() {
    describe('SlideIff.template', function() {
        it('A div.two-boxes is created', function() {
            const template = SlideIff.template({});
            const boxes = template.content.querySelector('div.two-boxes');
            assert.notEqual(boxes, null);
        })

        it('div.two-boxes has two divs', function() {
            const template = SlideIff.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            assert.equal(divs.length, 2);
        })

        it('1st div in .two-boxes has a slot with name "left"', function() {
            const template = SlideIff.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            const slots = divs[0].querySelectorAll('slot[name="left"');
            assert(slots.length, 1);
        })

        it('2nd div in .two-boxes has a slot with name "right"', function() {
            const template = SlideIff.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            const slots = divs[1].querySelectorAll('slot[name="right"');
            assert(slots.length, 1);
        })

        it('A link is created', function() {
            const template = SlideIff.template({styles: ['slides.css']});
            const link = template.content.querySelector('link');
            assert.notEqual(link, null);
        })

        it('link refers to slides.css', function() {
            const template = SlideIff.template({styles: ['slides.css']});
            const link = template.content.querySelector('link');
            assert.equal(link.href.slice(-10), 'slides.css');
        })

        it('There is a svg between the divs', function() {
            const template = SlideIff.template({});
            const svg = template.content.querySelector('div.two-boxes svg');
            assert.notEqual(svg, null);
            const previous = svg.previousElementSibling
            assert.equal(previous.nodeName.toLowerCase(), 'div');
            const next = svg.nextElementSibling;
            assert.equal(next.nodeName.toLowerCase(), 'div');
        })

        it('If color is green, divs have class green', function() {
            const template = SlideIff.template({color: 'green'});
            const divs = template.content.querySelectorAll('.two-boxes div');
            for (let div of divs) {
                const cls = Array.from(div.classList);
                assert.isTrue(cls.includes('bg-green'));
            }
        })

        it('If color is green, path has class green', function() {
            const template = SlideIff.template({color: 'green'});
            const selector = '.two-boxes svg path';
            const path = template.content.querySelector(selector);
            const cls = Array.from(path.classList);
            assert.isTrue(cls.includes('bg-green'));
        })

        it('Default color is yellow', function() {
            const template = SlideIff.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            for (let div of divs) {
                const cls = Array.from(div.classList);
                assert.isTrue(cls.includes('bg-yellow'));
            }
        })
    })

    describe('SlideImplies', function() {
        it('A div.two-boxes is created', function() {
            const template = SlideImplies.template({});
            const boxes = template.content.querySelector('div.two-boxes');
            assert.notEqual(boxes, null);
        })

        it('div.two-boxes has two divs', function() {
            const template = SlideImplies.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            assert.equal(divs.length, 2);
        })

        it('1st div in .two-boxes has a slot with name "left"', function() {
            const template = SlideImplies.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            const slots = divs[0].querySelectorAll('slot[name="left"');
            assert(slots.length, 1);
        })

        it('2nd div in .two-boxes has a slot with name "right"', function() {
            const template = SlideImplies.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            const slots = divs[1].querySelectorAll('slot[name="right"');
            assert(slots.length, 1);
        })

        it('A link is created', function() {
            const template = SlideImplies.template({styles: ['slides.css']});
            const link = template.content.querySelector('link');
            assert.notEqual(link, null);
        })

        it('link refers to slides.css', function() {
            const template = SlideImplies.template({styles: ['slides.css']});
            const link = template.content.querySelector('link');
            assert.equal(link.href.slice(-10), 'slides.css');
        })

        it('There is a svg between the divs', function() {
            const template = SlideImplies.template({});
            const svg = template.content.querySelector('div.two-boxes svg');
            assert.notEqual(svg, null);
            const previous = svg.previousElementSibling
            assert.equal(previous.nodeName.toLowerCase(), 'div');
            const next = svg.nextElementSibling;
            assert.equal(next.nodeName.toLowerCase(), 'div');
        })

        it('If color is yellow, divs have class yellow', function() {
            const template = SlideImplies.template({color: 'yellow'});
            const divs = template.content.querySelectorAll('.two-boxes div');
            for (let div of divs) {
                const cls = Array.from(div.classList);
                assert.isTrue(cls.includes('bg-yellow'));
            }
        })

        it('If color is yellow, path has class yellow', function() {
            const template = SlideImplies.template({color: 'yellow'});
            const selector = '.two-boxes svg path';
            const path = template.content.querySelector(selector);
            const cls = Array.from(path.classList);
            assert.isTrue(cls.includes('bg-yellow'));
        })

        it('Default color is green', function() {
            const template = SlideImplies.template({});
            const divs = template.content.querySelectorAll('.two-boxes div');
            for (let div of divs) {
                const cls = Array.from(div.classList);
                assert.isTrue(cls.includes('bg-green'));
            }
        })
    })

    describe('SlideImplied', function() {
        it('Additional stylesheets inserted as links', function() {
            const template = SlideIff.template(
                {styles: ['slides.css', 'custom.css']}
            );
            const links = template.content.querySelectorAll('link');
            const srcs = Array.from(links).map((link) => link.href.slice(-10));
            assert.equal(srcs.length, 2);
            assert.equal(srcs[0], 'slides.css');
            assert.equal(srcs[1], 'custom.css');
        })

        it('There is a svg between the divs', function() {
            const template = SlideImplied.template({});
            const svg = template.content.querySelector('div.two-boxes svg');
            assert.notEqual(svg, null);
            const previous = svg.previousElementSibling
            assert.equal(previous.nodeName.toLowerCase(), 'div');
            const next = svg.nextElementSibling;
            assert.equal(next.nodeName.toLowerCase(), 'div');
        })

        it('If no color is given, path has class white', function() {
            const template = SlideImplied.template({});
            const selector = '.two-boxes svg path';
            const path = template.content.querySelector(selector);
            const cls = Array.from(path.classList);
            assert.isTrue(cls.includes('bg-white'));
        })
    })
})
