/**
 * slides - The main module of this page.
 * It creates a slide show after the page is loaded.
 */


import {SlideShow} from './slideshow.ts';
import {define_elements} from './boxes.ts';


export function start_page() {
    /**
     * Creates a callback that starts the slide show after the page is loaded.
     */
    const mode = get_mode();
    console.log(`${mode} mode`)
    if (mode === "Slideshow") {
        window.addEventListener("load", on_load);
    } else if (mode === "Print") {
        window.addEventListener("load", on_print_load);
    };
}


function on_load() {
    /**
     * Callback that creates the slide show.
     */
    const slide_show = new SlideShow(document);
    slide_show.start();
}

function on_print_load() {
    /**
     * Callback that creates a printable version of the slide show with all
     * the animations.
     */
    const slide_show = new SlideShow(document);
    slide_show.print_mode();
}

function get_mode() {
    /**
     * Decide if slideshow mode is on, based on whether "print.css" or 
     * "notransitions.css" is loaded or not.
     */
    for (let sheet of document.styleSheets) {
        if (sheet.href !== null) {
            if (sheet.href.endsWith('print.css')) 
                return 'Print';
            else if (sheet.href.endsWith('notransitions.css')) 
                return 'No transitions';
        }
    }
    return 'Slideshow';
}

define_elements();
start_page();
