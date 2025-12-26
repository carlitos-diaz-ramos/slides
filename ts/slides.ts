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
    let parts: string[], mode = "Slideshow";
    for (let sheet of document.styleSheets) {
        if (sheet.href !== null) {
            parts = sheet.href.split("code/");
            if (parts.length > 1) {
                if (parts[1] === "print.css") {
                    mode = "Print";
                    break;
                } else if (parts[1] === "notransitions.css") {
                    mode = "No transitions";
                    break;
                }
            }
        }
    }
    return mode;
}

define_elements();
start_page();
