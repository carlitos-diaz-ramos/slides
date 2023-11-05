import {show, show_all, hide, hide_all} from '../modules/util.js';

function create_p() {
    const div = document.createElement('div');
    const code = '<p>Paragraph for testing.</p>';
    div.innerHTML = code;
    return div.firstChild;
}

function is_shown(element) {
    return Array.from(element.classList).includes('shown');
}

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

