/**
 * util - A module with utility functions for a slide show.
 */


export class SlidesError extends Error {}


export function show(element: Element) {
    element.classList.add("shown");
}

export function show_all(elements: Element[]) {
    elements.map(show);
}

export function hide(element: Element) {
    element.classList.remove("shown");
}

export function hide_all(elements: Element[]) {
    elements.map(hide);
}

export function animate(element: Element) {
    element.classList.add("animated");
}

export function animate_all(elements: Element[]) {
    elements.map(animate);
}

export function deanimate(element: Element) {
    element.classList.remove("animated");
}

export function deanimate_all(elements: Element[]) {
    elements.map(deanimate);
}

export function erase(element: Element) {
    element.classList.add("erased");
}

export function erase_all(elements: Element[]) {
    elements.map(erase);
}

export function unerase(element: Element) {
    element.classList.remove("erased");
}

export function unerase_all(elements: Element[]) {
    elements.map(unerase);
}


export function insert_after(node: Node, target: Node) {
    if (target.parentNode) {
        target.parentNode.insertBefore(node, target.nextSibling);
    } else {
        throw new SlidesError('Target node has no parent.');
    }
}
