import {
    show, show_all, hide, hide_all, 
    animate, animate_all, deanimate, deanimate_all,
    erase, unerase, erase_all, unerase_all
} from '../modules/util.js';


describe('Functions that animate elements', function() {
    function create_p() {
        const div = document.createElement('div');
        const code = '<p>Paragraph for testing.</p>';
        div.innerHTML = code;
        return div.firstChild;
    }
    
    function is_in_class(element, tag) {
        return Array.from(element.classList).includes(tag);
    }
    
    const is_shown = (element) => is_in_class(element, 'shown');
    const is_animated = (element) => is_in_class(element, 'animated');
    const is_erased = (element) => is_in_class(element, 'erased');
    
    describe('show and hide', function() {
        it('"shown" is not in class by default', function() {
            const p = create_p();
            assert.isFalse(is_shown(p));
        })
        it('show() adds "shown" to class', function() {
            const p = create_p();
            show(p);
            assert.isTrue(is_shown(p));
        })
        it('hide() does nothing to an element that is not "shown"', function() {
            const p = create_p();
            hide(p)
            assert.isFalse(is_shown(p));
        })
        it('First show() then hide(), and element is not "shown"', function() {
            const p = create_p();
            show(p);
            hide(p)
            assert.isFalse(is_shown(p));
        })
        it('show(), hide(), show() and element is "shown"', function() {
            const p = create_p();
            show(p);
            hide(p)
            show(p);
            assert.isTrue(is_shown(p));
        })
        it('"shown" not in an array by default', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            for (let element of elements) {
                assert.isFalse(is_shown(element));
            }
        })
        it('show_all() makes all elements to be "shown"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            show_all(elements);
            for (let element of elements) {
                assert.isTrue(is_shown(element));
            }
        })
        it('hide_all() does nothing to elements that are not "shown"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            hide_all(elements);
            for (let element of elements) {
                assert.isFalse(is_shown(element));
            }
        })
        it('show_all(), then hide_all() and elements are not "shown"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            show_all(elements);
            hide_all(elements);
            for (let element of elements) {
                assert.isFalse(is_shown(element));
            }
        })
        it('show_all(), hide_all(), show_all() implies "shown"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            show_all(elements);
            hide_all(elements);
            show_all(elements);
            for (let element of elements) {
                assert.isTrue(is_shown(element));
            }
        })
    })

    describe('animate', function() {
        it('"animated" is not in class by default', function() {
            const p = create_p();
            assert.isFalse(is_animated(p));
        })
        it('animate() adds "animated" to class', function() {
            const p = create_p();
            animate(p);
            assert.isTrue(is_animated(p));
        })
        it(
            'deanimate() does nothing to an element that is not "animated"', 
            function() {
            const p = create_p();
            deanimate(p)
            assert.isFalse(is_animated(p));
        })
        it(
            'First animate() then deanimate(), and element is not "animated"', 
            function() {
            const p = create_p();
            animate(p);
            deanimate(p)
            assert.isFalse(is_animated(p));
        })
        it(
            'animate(), deanimate(), animate() and element is "animated"', 
            function() {
            const p = create_p();
            animate(p);
            deanimate(p)
            animate(p);
            assert.isTrue(is_animated(p));
        })
        it('"animated" not in an array by default', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            for (let element of elements) {
                assert.isFalse(is_animated(element));
            }
        })
        it('animate_all() makes all elements to be "animated"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            animate_all(elements);
            for (let element of elements) {
                assert.isTrue(is_animated(element));
            }
        })
        it(
            'deanimate_all() does nothing to elements that are not "animated"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            deanimate_all(elements);
            for (let element of elements) {
                assert.isFalse(is_animated(element));
            }
        })
        it(
            'animate_all(), then deanimate_all() and elements are not "animated"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            animate_all(elements);
            deanimate_all(elements);
            for (let element of elements) {
                assert.isFalse(is_animated(element));
            }
        })
        it(
            'animate_all(), deanimate_all(), animate_all() implies "animated"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            animate_all(elements);
            deanimate_all(elements);
            animate_all(elements);
            for (let element of elements) {
                assert.isTrue(is_animated(element));
            }
        })
    })

    describe('erase', function() {
        it('"erased" is not in class by default', function() {
            const p = create_p();
            assert.isFalse(is_erased(p));
        })
        it('erase() adds "erased" to class', function() {
            const p = create_p();
            erase(p);
            assert.isTrue(is_erased(p));
        })
        it(
            'unerase() does nothing to an element that is not "erased"', 
            function() {
            const p = create_p();
            unerase(p)
            assert.isFalse(is_erased(p));
        })
        it(
            'First erase() then unerase(), and element is not "erased"', 
            function() {
            const p = create_p();
            erase(p);
            unerase(p)
            assert.isFalse(is_erased(p));
        })
        it(
            'erase(), unerase(), erase() and element is "erased"', 
            function() {
            const p = create_p();
            erase(p);
            unerase(p)
            erase(p);
            assert.isTrue(is_erased(p));
        })
        it('"erased" not in an array by default', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            for (let element of elements) {
                assert.isFalse(is_erased(element));
            }
        })
        it('erase_all() makes all elements to be "erased"', function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            erase_all(elements);
            for (let element of elements) {
                assert.isTrue(is_erased(element));
            }
        })
        it(
            'unerase_all() does nothing to elements that are not "erased"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            unerase_all(elements);
            for (let element of elements) {
                assert.isFalse(is_erased(element));
            }
        })
        it(
            'erase_all(), then unerase_all() and elements are not "erased"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            erase_all(elements);
            unerase_all(elements);
            for (let element of elements) {
                assert.isFalse(is_erased(element));
            }
        })
        it(
            'erase_all(), unerase_all(), erase_all() implies "erased"', 
            function() {
            const p1 = create_p(), p2 = create_p();
            const elements = [p1, p2];
            erase_all(elements);
            unerase_all(elements);
            erase_all(elements);
            for (let element of elements) {
                assert.isTrue(is_erased(element));
            }
        })
    })
})

