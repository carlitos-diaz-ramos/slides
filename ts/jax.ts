/**
 * jax - A module that configures MathJax.
 */


import {relative_path, parent_folder} from "./path.ts";


type Mode = 'local' | 'online';
type JaxOptions = {
    loader: object,
    tex: object,
    options: object,
    output?: object,
};
type JaxWindow = Window & typeof globalThis & {MathJax: object};


function mathjax_config(mode: Mode) {
    const config: JaxOptions = {
        loader: {
            load: ['[tex]/noerrors']
        },
        tex: {
            packages: {
                '[+]': ['noerrors'],
            },
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            processEscapes: true,
            macros: {
                "N": "{\\mathbb{N}}",
                "Z": "{\\mathbb{Z}}",
                "R": "{\\mathbb{R}}",
                "C": "{\\mathbb{C}}",
                "H": "{\\mathbb{H}}",
                "O": "{\\mathbb{O}}",
                "id": "{\\mathop{\\rm id}}",
                "grad": "{\\mathop{\\rm grad}}",
                "rot": "{\\mathop{\\rm rot}}",
                "Span": "{\\mathop{\\rm span}}",
                "Exp": "{\\mathop{\\rm Exp}}",
                "exp": "{\\mathop{\\rm exp}}",
                "tr": "{\\mathop{\\rm tr}}",
                "Ad": "{\\mathop{\\rm Ad}}",
                "ad": "{\\mathop{\\rm ad}}",
                "Re": "{\\mathop{\\rm Re\\,}}",
                "Im": "{\\mathop{\\rm Im\\,}}",
                "g": ["\\mathfrak{#1}", 1]
            }
        },
        options: {
            ignoreHtmlClass: 'latex-only',
            enableMenu: false,
            menuOptions: {
                settings: {
                    enrich: false,
                }
            },
        },
    };
    if (mode == 'local') {
        const doc = document.baseURI;
        const script = document.currentScript as HTMLScriptElement;
        const file = script.src;
        const folder = parent_folder(relative_path(file, doc));
        config.output = {fontPath: `${folder}mathjax/mathjax-newcm-font`};
    }
    return config;
} 

function load_mathjax(mode: Mode) {
    const online = "https://cdn.jsdelivr.net/npm/mathjax@4";              
    const element = document.currentScript! as HTMLScriptElement;
    const folder = element.src.split('/jax.js')[0];
    const local = `${folder}/mathjax`;
    let run = mode === "online" ? online : local;
    let script = document.createElement('script');
    script.src = `${run}/tex-chtml.js`;
    script.async = true;
    script.id = "MathJax-script";
    document.head.append(script);
}

const jax_window = window as JaxWindow;
jax_window.MathJax = mathjax_config('online');
load_mathjax('online');
