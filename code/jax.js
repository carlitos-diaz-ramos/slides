"use strict";

(function() {
    const mathjax_config = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            processEscapes: true,
            macros: {
                R: "{\\mathbb{R}}",
                C: "{\\mathbb{C}}",
                H: "{\\mathbb{H}}",
                O: "{\\mathbb{O}}",
                g: ["\\mathfrak{#1}", 1],
                Id: "\\mathop{\\rm Id}",
            },
            autoload: {
                color: [],
                colorV2: ['color']
            },
            packages: {
                '[+]': ['noerrors']
            }
        },
        options: {
            renderActions: {
                addMenu: [],
                checkLoading: []
            },
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
        },
        loader: {
            load: ['[tex]/noerrors']
        }
    };

    function load_mathjax(mode) {
        const online = "https://cdn.jsdelivr.net/npm/mathjax@3";              
        const folder = document.currentScript.src.split('/jax.js')[0];
        const local = `${folder}/mathjax`;
        let run = mode === "online" ? online : local;
        let script = document.createElement('script');
        script.src = `${run}/es5/tex-chtml.js`
        script.async = true;
        script.id = "MathJax-script";
        document.head.appendChild(script);
    }

    window.MathJax = mathjax_config;
    load_mathjax("local");
    
})();
