import {Animation, StopAnimation} from '../dist/animation.js';


function get_class(slide, cls) {
    return Array.from(slide.slide.querySelectorAll(cls))
}

const get_shown = (slide) => get_class(slide, '.shown');
const get_animated = (slide) => get_class(slide, '.animated');
const get_erased = (slide) => get_class(slide, '.erased');

function get_text(element) {
    return element.innerText.trim();
}


describe('Animation', function() {
    it('The slide property returns the input back', function() {
        const article = document.createElement('article');
        const code = '<header></header><section></section>';
        article.innerHTML = code;
        const slide = new Animation(article);
        assert.equal(slide.slide, article);
    })

    it('An empty slide has no animation steps', function() {
        const article = document.createElement('article');
        const code = '<header></header><section></section>';
        article.innerHTML = code;
        const slide = new Animation(article);
        assert.equal(slide.get_steps().length, 0);
    })

    describe('A slide where elements can only appear', function() {
        function create_slide() {
            const slide = document.createElement('article');
            const code = `
                <header></header>
                <section>
                <p class="show-30">Third</p>
                <p>Static</p>
                <p class="mystyle show-10">First</p>
                <p class="show-20">Second</p>
                <p class="show-30">Also third</p>
                </section>
            `;
            slide.innerHTML = code;
            return new Animation(slide);
        }
    
        it('There are 3 steps', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps.length, 3);
        })

        it('1st step: shows 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[0]['show'].length, 1);
        })

        it('2nd step: shows 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[1]['show'].length, 1);
        })

        it('3rd step: shows 2', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['show'].length, 2);
        })

        it('The third step has no animations', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['animate'].length, 0);
        })

        it('The third step has no deletions', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['erase'].length, 0);
        })

        it('At first only normal elements are shown', function() {
            const slide = create_slide();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step: 1 shown', function() {
            const slide = create_slide();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(shown[0].innerText, 'First');
        })

        it('After 2 steps: 2 shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(shown[1].innerText, 'Second');
        })

        it('After 3 steps: 4 shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(shown[0].innerText, 'Third');
            assert.equal(shown[3].innerText, 'Also third');
        })

        it('After 4 steps: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            expect(() => slide.move_forward()).to.throw(StopAnimation);
        })

        it('Going back: StopAnimation thrown', function() {
            const slide = create_slide();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 1 step, going back: goes to initial position', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step, going back twice: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 2 steps, going back: 1 shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(shown[0].innerText, 'First');
        })

        it('After showing all: 4 shown', function() {
            const slide = create_slide();
            slide.show_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(shown[0].innerText, 'Third');
            assert.equal(shown[3].innerText, 'Also third');
        })

        it('Hiding all: goes to the beginning', function() {
            const slide = create_slide();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step, hiding all: goes to the beginning', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After showing all, hiding all: goes to the beginning', function() {
            const slide = create_slide();
            slide.show_all();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })
    })

    describe('Slides allowing animations', function() {
        function create_slide() {
            const slide = document.createElement('article');
            const code = `
                <header></header>
                <section>
                <p class="show-30">Third</p>
                <p>Static <span class="animate-10">animated</span></p>
                <p class="mystyle show-10">
                 First <span class="animate-30">animated</span></p>
                <p class="animate-40">Fourth</p>
                <p class="show-20">
                 Second <span class="animate-30">animated 2</span></p>
                <p class="show-30">Also third</p>
                </section>
            `;
            slide.innerHTML = code;
            return new Animation(slide);
        }
    
        it('There are 4 steps', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps.length, 4);
        })

        it('1st step: shows 1, animates 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[0]['show'].length, 1);
            assert.equal(steps[0]['animate'].length, 1);
        })

        it('2nd step: shows 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[1]['show'].length, 1);
            assert.equal(steps[1]['animate'].length, 0);
        })

        it('3rd step: shows 2, animates 2', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['show'].length, 2);
            assert.equal(steps[2]['animate'].length, 2);
        })

        it('4th step: animates 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[3]['show'].length, 0);
            assert.equal(steps[3]['animate'].length, 1);
        })

        it('4th step: no deletions', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[3]['erase'].length, 0);
        })

        it('At first only normal elements are shown', function() {
            const slide = create_slide();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
        })

        it('After 1 step: 1 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
        })

        it('After 2 steps: 2 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(get_text(shown[1]), 'Second animated 2');
            assert.equal(get_animated(slide).length, 1);
        })

        it('After 3 steps: 4 shown, 3 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
        })

        it('After 4 steps: 4 shown, 4 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
        })

        it('After 5 steps: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            expect(() => slide.move_forward()).to.throw(StopAnimation);
        })

        it('Going back: StopAnimation thrown', function() {
            const slide = create_slide();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 1 step, going back: goes to initial position', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
        })

        it('After 1 step, going back twice: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 2 steps, going back: 1 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
        })

        it('After showing all: 4 shown, 4 animated', function() {
            const slide = create_slide();
            slide.show_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[0]), 'animated');
            assert.equal(get_text(animated[2]), 'Fourth');
        })

        it('Hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
        })

        it('After 1 step, hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);        assert.equal(get_animated(slide).length, 0);
        })

        it('After showing all, hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.show_all();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
        })
    })
    
    describe('Slides allowing animations and deletion', function() {
        function create_slide() {
            const slide = document.createElement('article');
            const code = `
                <header></header>
                <section>
                <p class="show-30 erase-40">Third</p>
                <p>Static <span class="animate-10">animated</span></p>
                <p class="mystyle show-10 erase-20">
                 First <span class="animate-30">animated</span></p>
                <p class="animate-40">Fourth</p>
                <p class="show-20">
                 Second <span class="animate-30 erase-40">animated 2</span></p>
                <p class="show-30">Also third</p>
                </section>
            `;
            slide.innerHTML = code;
            return new Animation(slide);
        }

        it('There are 4 steps', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps.length, 4);
        })

        it('1st step: shows 1, animates 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[0]['show'].length, 1);
            assert.equal(steps[0]['animate'].length, 1);
            assert.equal(steps[0]['erase'].length, 0);
        })

        it('2nd step: shows 1, erases 1', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[1]['show'].length, 1);
            assert.equal(steps[1]['animate'].length, 0);
            assert.equal(steps[1]['erase'].length, 1);
        })

        it('3rd step: shows 2, animates 2', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['show'].length, 2);
            assert.equal(steps[2]['animate'].length, 2);
            assert.equal(steps[2]['erase'].length, 0);
        })

        it('4th step: animates 1, erases 2', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[3]['show'].length, 0);
            assert.equal(steps[3]['animate'].length, 1);
            assert.equal(steps[3]['erase'].length, 2);
        })

        it('At first only normal elements are shown', function() {
            const slide = create_slide();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
            assert.equal(get_erased(slide).length, 0);
        })

        it('After 1 step: 1 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })

        it('After 2 steps: 2 shown, 1 animated, 1 erased', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(get_text(shown[1]), 'Second animated 2');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
            assert.equal(get_text(erased[0]), 'First animated');
        })

        it('After 2 steps: one element shown and erased', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            const erased = get_erased(slide);
            assert.equal(get_text(shown[0]), get_text(erased[0]));
        })

        it('After 3 steps: 4 shown, 3 animated, 1 erased', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('After 4 steps: 4 shown, 4 animated, 3 erased', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('After 4 steps: one element animated and erased', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const animated = get_animated(slide);
            const erased = get_erased(slide);
            assert.equal(get_text(animated[3]), get_text(erased[2]));
        })

        it('After 5 steps: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            expect(() => slide.move_forward()).to.throw(StopAnimation);
        })

        it('Going back: StopAnimation thrown', function() {
            const slide = create_slide();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 1 step, going back: goes to initial position', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
            assert.equal(get_erased(slide).length, 0);
        })

        it('After 1 step, going back twice: StopAnimation thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 2 steps, going back: 1 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })

        it('After 3 steps, going back twice: 1 shown, 1 animated', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            slide.move_backwards();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })

        it('After showing all: 4 shown, 4 animated, 3 erased', function() {
            const slide = create_slide();
            slide.show_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[0]), 'animated');
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('Hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
            assert.equal(get_erased(slide).length, 0);
        })

        it('After 1 step, hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);        
            assert.equal(get_animated(slide).length, 0);
            assert.equal(get_erased(slide).length, 0);
        })

        it('After showing all, hiding all: goes to beginning', function() {
            const slide = create_slide();
            slide.show_all();
            slide.hide_all();
            assert.equal(get_shown(slide).length, 0);
            assert.equal(get_animated(slide).length, 0);
            assert.equal(get_erased(slide).length, 0);
        })
    })
})
