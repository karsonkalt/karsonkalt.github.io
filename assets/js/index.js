/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/ts/home/updateAccentColor.ts":
/*!*********************************************!*\
  !*** ./assets/ts/home/updateAccentColor.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PALETTE: () => (/* binding */ PALETTE),\n/* harmony export */   updateAccentColor: () => (/* binding */ updateAccentColor)\n/* harmony export */ });\n// Curated palette — each entry looks great as a gradient and has\n// accessible link colors for both dark and light modes.\nvar PALETTE = [\n    { base: [30, 80, 180], darkLink: \"#60a5fa\", lightLink: \"#1d4ed8\", darkLinkHover: \"#93c5fd\", lightLinkHover: \"#1e40af\" },\n    { base: [100, 40, 200], darkLink: \"#a78bfa\", lightLink: \"#5b21b6\", darkLinkHover: \"#c4b5fd\", lightLinkHover: \"#4c1d95\" },\n    { base: [0, 120, 120], darkLink: \"#2dd4bf\", lightLink: \"#0f766e\", darkLinkHover: \"#5eead4\", lightLinkHover: \"#115e59\" },\n    { base: [170, 20, 60], darkLink: \"#f87171\", lightLink: \"#b91c1c\", darkLinkHover: \"#fca5a5\", lightLinkHover: \"#991b1b\" },\n    { base: [150, 80, 0], darkLink: \"#fbbf24\", lightLink: \"#92400e\", darkLinkHover: \"#fcd34d\", lightLinkHover: \"#78350f\" },\n    { base: [0, 110, 60], darkLink: \"#34d399\", lightLink: \"#065f46\", darkLinkHover: \"#6ee7b7\", lightLinkHover: \"#064e3b\" },\n    { base: [60, 40, 180], darkLink: \"#818cf8\", lightLink: \"#3730a3\", darkLinkHover: \"#a5b4fc\", lightLinkHover: \"#312e81\" },\n    { base: [160, 0, 80], darkLink: \"#f472b6\", lightLink: \"#9d174d\", darkLinkHover: \"#f9a8d4\", lightLinkHover: \"#831843\" },\n];\nvar updateAccentColor = function (palette) {\n    var root = document.documentElement;\n    root.style.setProperty(\"--accent-color-base\", palette.base.join(\", \"));\n    root.style.setProperty(\"--accent-color-link-dark\", palette.darkLink);\n    root.style.setProperty(\"--accent-color-link-light\", palette.lightLink);\n    root.style.setProperty(\"--accent-color-link-dark-hover\", palette.darkLinkHover);\n    root.style.setProperty(\"--accent-color-link-light-hover\", palette.lightLinkHover);\n};\n\n\n//# sourceURL=webpack://karsonkalt.github.io/./assets/ts/home/updateAccentColor.ts?");

/***/ }),

/***/ "./assets/ts/index.ts":
/*!****************************!*\
  !*** ./assets/ts/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home/updateAccentColor */ \"./assets/ts/home/updateAccentColor.ts\");\nvar _a, _b;\n\n// ─── Dropdown overlay — blocks background while any menu is open ──────────────\nvar overlay = document.createElement(\"div\");\noverlay.style.cssText = \"position:fixed;inset:0;z-index:9;display:none;cursor:default;\";\ndocument.body.appendChild(overlay);\nvar closeAllDropdowns = function () {\n    var _a;\n    (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();\n    overlay.style.display = \"none\";\n};\noverlay.addEventListener(\"click\", closeAllDropdowns);\ndocument.querySelectorAll(\".dropdown-menu\").forEach(function (menu) {\n    menu.addEventListener(\"focusin\", function () {\n        overlay.style.display = \"block\";\n    });\n    menu.addEventListener(\"focusout\", function (e) {\n        if (!menu.contains(e.relatedTarget)) {\n            overlay.style.display = \"none\";\n        }\n    });\n});\n// Dismiss on Escape\ndocument.addEventListener(\"keydown\", function (e) {\n    if (e.key === \"Escape\")\n        closeAllDropdowns();\n});\n// ─── Theme toggle ─────────────────────────────────────────────────────────────\nvar html = document.documentElement;\nvar applyTheme = function (theme) {\n    html.classList.remove(\"dark\", \"light\");\n    if (theme !== \"system\")\n        html.classList.add(theme);\n    if (theme === \"system\")\n        localStorage.removeItem(\"theme\");\n    else\n        localStorage.setItem(\"theme\", theme);\n};\nvar toggleTheme = function () {\n    var stored = localStorage.getItem(\"theme\");\n    var systemDark = window.matchMedia(\"(prefers-color-scheme: dark)\").matches;\n    var effectivelyDark = stored === \"dark\" || (!stored && systemDark);\n    applyTheme(effectivelyDark ? \"light\" : \"dark\");\n};\n(_a = document.getElementById(\"theme-toggle\")) === null || _a === void 0 ? void 0 : _a.addEventListener(\"click\", toggleTheme);\nconsole.log(\"\\nHi there! \\uD83D\\uDC4B I see you opened up the dev tools.\\n\\nThis site is powered by Jekyll and GitHub Pages.\\n\\nIf you're interested in connecting, reach out at:\\nhttps://linkedin.com/in/kaltkarson\\n\");\n// ─── Accent color palette cycling ────────────────────────────────────────────\nvar PALETTE_KEY = \"palette-index\";\nvar getStoredIndex = function () {\n    var stored = localStorage.getItem(PALETTE_KEY);\n    var idx = stored !== null ? parseInt(stored, 10) : Math.floor(Math.random() * _home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.PALETTE.length);\n    return idx % _home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.PALETTE.length;\n};\nvar currentIndex = getStoredIndex();\nlocalStorage.setItem(PALETTE_KEY, String(currentIndex));\nvar applyPalette = function (index) {\n    (0,_home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.updateAccentColor)(_home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.PALETTE[index]);\n    var dot = document.getElementById(\"swatch-dot\");\n    if (dot) {\n        var _a = _home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.PALETTE[index].base, r = _a[0], g = _a[1], b = _a[2];\n        dot.style.background = \"rgb(\".concat(r, \", \").concat(g, \", \").concat(b, \")\");\n    }\n};\napplyPalette(currentIndex);\n(_b = document.getElementById(\"color-swatch\")) === null || _b === void 0 ? void 0 : _b.addEventListener(\"click\", function () {\n    currentIndex = (currentIndex + 1) % _home_updateAccentColor__WEBPACK_IMPORTED_MODULE_0__.PALETTE.length;\n    localStorage.setItem(PALETTE_KEY, String(currentIndex));\n    applyPalette(currentIndex);\n});\nvar prefersReducedMotion = window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches;\nif (!prefersReducedMotion) {\n    document.addEventListener(\"scroll\", function () {\n        var wrapper = document.querySelector(\".wrapper\");\n        var scrollTop = window.scrollY || document.documentElement.scrollTop;\n        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;\n        var offset = (scrollTop / scrollHeight) * -(window.innerHeight * 0.5);\n        wrapper === null || wrapper === void 0 ? void 0 : wrapper.style.setProperty(\"--gradient-top-offset\", \"\".concat(offset, \"px\"));\n    });\n}\n\n\n//# sourceURL=webpack://karsonkalt.github.io/./assets/ts/index.ts?");

/***/ })

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./assets/ts/index.ts");
/******/ 	
/******/ })()
;