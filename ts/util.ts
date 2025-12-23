export function show(element: HTMLElement) {
    element.classList.add("shown");
}

export function show_all(elements: HTMLElement[]) {
    elements.map(show);
}

export function hide(element: HTMLElement) {
    element.classList.remove("shown");
}

export function hide_all(elements: HTMLElement[]) {
    elements.map(hide);
}

export function animate(element: HTMLElement) {
    element.classList.add("animated");
}

export function animate_all(elements: HTMLElement[]) {
    elements.map(animate);
}

export function deanimate(element: HTMLElement) {
    element.classList.remove("animated");
}

export function deanimate_all(elements: HTMLElement[]) {
    elements.map(deanimate);
}

export function erase(element: HTMLElement) {
    element.classList.add("erased");
}

export function erase_all(elements: HTMLElement[]) {
    elements.map(erase);
}

export function unerase(element: HTMLElement) {
    element.classList.remove("erased");
}

export function unerase_all(elements: HTMLElement[]) {
    elements.map(unerase);
}


export function insert_after(node: Node, target: Node) {
    target.parentNode.insertBefore(node, target.nextSibling);
}
