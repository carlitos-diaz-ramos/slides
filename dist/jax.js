/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/path.ts"
/*!********************!*\
  !*** ./ts/path.ts ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parent_folder: () => (/* binding */ parent_folder),
/* harmony export */   relative_path: () => (/* binding */ relative_path)
/* harmony export */ });
/**
 * path - Module that exports some utility functions to work with paths.
 */
function parent_folder(file) {
    /**
     * Returns the parent folder of a file, or path itself if it is a folder.
     */
    const parts = file.split('/');
    if (parts[parts.length - 1].includes('.'))
        return ''.concat(...parts.slice(0, parts.length - 1).map(p => `${p}/`));
    else
        return file;
}
function relative_path(folder, main) {
    /**
     * Returns the path of "folder" relative to "main".
     * If "main" is a file, the parent folder is taken.
     */
    const f_parts = folder.replace(/\/+$/, '').split('/');
    const m_parts = parent_folder(main).replace(/\/+$/, '').split('/');
    let index = 0;
    while (f_parts[index] !== undefined && f_parts[index] == m_parts[index])
        index++;
    const up = '../'.repeat(m_parts.length - index);
    let result = up.concat(...f_parts.slice(index).map(p => `${p}/`));
    if (f_parts[f_parts.length - 1].includes('.'))
        result = result.slice(0, result.length - 1);
    return result.startsWith('.') ? result : `./${result}`;
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************!*\
  !*** ./ts/jax.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./path.js */ "./ts/path.ts");

function mathjax_config() {
    const doc = document.baseURI;
    const script = document.currentScript;
    const file = script.src;
    const folder = (0,_path_js__WEBPACK_IMPORTED_MODULE_0__.parent_folder)((0,_path_js__WEBPACK_IMPORTED_MODULE_0__.relative_path)(file, doc));
    return {
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
        output: {
            fontPath: `${folder}mathjax/mathjax-newcm-font`,
        },
    };
}
function load_mathjax(mode) {
    const online = "https://cdn.jsdelivr.net/npm/mathjax@4";
    const element = document.currentScript;
    const folder = element.src.split('/jax.js')[0];
    const local = `${folder}/mathjax`;
    let run = mode === "online" ? online : local;
    let script = document.createElement('script');
    script.src = `${run}/tex-chtml.js`;
    script.async = true;
    script.id = "MathJax-script";
    document.head.append(script);
}
const jax_window = window;
jax_window.MathJax = mathjax_config();
load_mathjax("local");

})();

/******/ })()
;
//# sourceMappingURL=jax.js.map