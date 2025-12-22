import './slides.js';

const mathjax_config = {
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
        menuOptions: {
            settings: {
                enrich: false,
            }
        },
    },
    output: {
        fontPath: '../code/mathjax/mathjax-newcm-font',
    },
};

function load_mathjax(mode) {
    // TODO: import mathjax directly here
    const online = "https://cdn.jsdelivr.net/npm/mathjax@4";
    const src = document.currentScript.src;   
    const folder = src.split('/slides-jax.bundle.js')[0];
    const local = `${folder}/mathjax`;
    let run = mode === "online" ? online : local;
    let script = document.createElement('script');
    script.src = `${run}/tex-chtml.js`;
    script.async = true;
    script.id = "MathJax-script";
    document.head.append(script);
}

window.MathJax = mathjax_config;
load_mathjax("local");
