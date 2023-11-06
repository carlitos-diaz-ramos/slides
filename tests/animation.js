import {Animation, StopAnimation} from '../modules/animation.js';

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
    
        function get_shown(slide) {
            return Array.from(slide.slide.querySelectorAll('.shown'))
        }

        it('There are three steps', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps.length, 3);
        })

        it('The first step shows 1 element', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[0]['show'].length, 1);
        })

        it('The second step shows 1 element', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[1]['show'].length, 1);
        })

        it('The third step shows 2 elements', function() {
            const steps = create_slide().get_steps();
            assert.equal(steps[2]['show'].length, 2);
        })

        it('The third step has no animations', function() {
            const steps = create_slide().get_steps();
            assert.isFalse(steps[2].hasOwnProperty('animate'));
        })

        it('The third step has no deletions', function() {
            const steps = create_slide().get_steps();
            assert.isFalse(steps[2].hasOwnProperty('erase'));
        })

        it('At first only normal elements are shown', function() {
            const slide = create_slide();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step, 1 element is shown', function() {
            const slide = create_slide();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(shown[0].innerText, 'First');
        })

        it('After 2 steps, 2 elements are shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(shown[1].innerText, 'Second');
        })

        it('After 3 steps, 4 elements are shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(shown[0].innerText, 'Third');
            assert.equal(shown[3].innerText, 'Also third');
        })

        it('After 4 steps, StopAnimation is thrown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_forward();
            expect(() => slide.move_forward()).to.throw(StopAnimation);
        })

        it('Going back throws StopAnimation', function() {
            const slide = create_slide();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 1 step, going back goes to initial position', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step, going back twice throws StopAnimation', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_backwards();
            expect(() => slide.move_backwards()).to.throw(StopAnimation);
        })

        it('After 2 steps, going back, then 1 element is shown', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.move_forward();
            slide.move_backwards();
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(shown[0].innerText, 'First');
        })

        it('After showing all, 4 elements are shown', function() {
            const slide = create_slide();
            slide.show_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(shown[0].innerText, 'Third');
            assert.equal(shown[3].innerText, 'Also third');
        })

        it('Hiding all goes to the beginning', function() {
            const slide = create_slide();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After 1 step, hiding all goes to the beginning', function() {
            const slide = create_slide();
            slide.move_forward();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })

        it('After showing all, hiding all goes to the beginning', function() {
            const slide = create_slide();
            slide.show_all();
            slide.hide_all();
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
        })
    })
})
