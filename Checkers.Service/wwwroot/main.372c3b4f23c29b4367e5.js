/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/css/main.css":
/*!**************************!*\
  !*** ./src/css/main.css ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/css/main.css?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/main.css */ \"./src/css/main.css\");\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_main_css__WEBPACK_IMPORTED_MODULE_0__);\n\r\nvar Color;\r\n(function (Color) {\r\n    Color[Color[\"Black\"] = 0] = \"Black\";\r\n    Color[Color[\"Red\"] = 1] = \"Red\";\r\n})(Color || (Color = {}));\r\nvar PieceType;\r\n(function (PieceType) {\r\n    PieceType[PieceType[\"Piece\"] = 0] = \"Piece\";\r\n    PieceType[PieceType[\"King\"] = 1] = \"King\";\r\n})(PieceType || (PieceType = {}));\r\n;\r\nconst BOARD_SQUARE = 75;\r\nconst PIECE_RADIUS = 30;\r\nconst SVG_NS = 'http://www.w3.org/2000/svg';\r\nclass Piece {\r\n    constructor(color, type, svgId) {\r\n        this.color = color;\r\n        this.type = type;\r\n        this.svgId = svgId;\r\n    }\r\n}\r\nclass Move {\r\n    constructor(fromX, fromY, toX, toY) {\r\n        this.fromX = fromX;\r\n        this.fromY = fromY;\r\n        this.toX = toX;\r\n        this.toY = toY;\r\n    }\r\n}\r\nclass Board {\r\n    constructor() {\r\n        this.maxId = 0;\r\n        this.pieces = [\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n        ];\r\n        this.nextPlayer = Color.Red;\r\n    }\r\n    ResetBoard(color = Color.Red) {\r\n        for (let x = 0; x < 8; x++) {\r\n            for (let y = 0; y < 8; y++) {\r\n                let piece = this.pieces[x][y];\r\n                if (piece != null) {\r\n                    this.DeleteSvg(piece);\r\n                }\r\n            }\r\n        }\r\n        this.pieces = [\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n            [null, null, null, null, null, null, null, null],\r\n        ];\r\n        for (let y = 0; y < 3; y++) {\r\n            for (let x = 0; x < 8; x++) {\r\n                if ((x + y) % 2 == 0) {\r\n                    let newPiece = new Piece(Color.Red, PieceType.Piece, this.PieceId(this.maxId++));\r\n                    this.pieces[x][y] = newPiece;\r\n                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);\r\n                    this.maxId++;\r\n                }\r\n                else {\r\n                    this.pieces[x][y] = null;\r\n                }\r\n            }\r\n        }\r\n        for (let y = 5; y < 8; y++) {\r\n            for (let x = 0; x < 8; x++) {\r\n                if ((x + y) % 2 == 0) {\r\n                    let newPiece = new Piece(Color.Black, PieceType.Piece, this.PieceId(this.maxId++));\r\n                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);\r\n                    this.maxId++;\r\n                }\r\n                else {\r\n                    this.pieces[x][y] = null;\r\n                }\r\n            }\r\n        }\r\n        this.nextPlayer = color;\r\n    }\r\n    PieceId(val) {\r\n        return `piece${val}`;\r\n    }\r\n    AddPieceSvg(x, y, color, id) {\r\n        var svgRoot = document.getElementById(\"board\");\r\n        var newCircle = document.createElementNS(SVG_NS, \"circle\");\r\n        newCircle.setAttribute(\"id\", id);\r\n        newCircle.setAttribute(\"r\", PIECE_RADIUS.toString());\r\n        if (color === Color.Red) {\r\n            newCircle.setAttribute(\"fill\", \"red\");\r\n        }\r\n        else {\r\n            newCircle.setAttribute(\"fill\", \"black\");\r\n        }\r\n        newCircle.setAttribute(\"cx\", (BOARD_SQUARE * (x + 0.5)).toString());\r\n        newCircle.setAttribute(\"cy\", (BOARD_SQUARE * (y + 0.5)).toString());\r\n        svgRoot.appendChild(newCircle);\r\n    }\r\n    ApplyMove(move, animate = false) {\r\n        let piece = this.pieces[move.fromX][move.fromY];\r\n        if (!piece) {\r\n            return;\r\n        }\r\n        this.pieces[move.toX][move.toY] = piece;\r\n        this.pieces[move.fromX][move.fromY] = null;\r\n        if (Math.abs(move.toX - move.fromX) == 2) {\r\n            var middleX = (move.fromX + move.toX) / 2;\r\n            var middleY = (move.fromY + move.toY) / 2;\r\n            let jumpedPiece = this.pieces[middleX][middleY];\r\n            this.DeleteSvg(jumpedPiece);\r\n            this.pieces[middleX][middleY] = null;\r\n        }\r\n        this.UpdateSvgPosition(piece, move.toX, move.toY);\r\n    }\r\n    GetSvg(piece) {\r\n        return document.getElementById(piece.svgId);\r\n        ;\r\n    }\r\n    DeleteSvg(piece, animate = false) {\r\n        let pieceSvg = this.GetSvg(piece);\r\n        if (animate) {\r\n            // TODO: Add fade out\r\n            window.setTimeout(pieceSvg.remove, 1000);\r\n        }\r\n        else {\r\n            pieceSvg.remove();\r\n        }\r\n    }\r\n    UpdateSvgPosition(piece, x, y, animate = false) {\r\n        let pieceSvg = this.GetSvg(piece);\r\n        if (animate) {\r\n            // TODO: Add move animation\r\n        }\r\n        else {\r\n            pieceSvg.setAttribute('cx', `${BOARD_SQUARE * (x + 0.5)}`);\r\n            pieceSvg.setAttribute('cy', `${BOARD_SQUARE * (y + 0.5)}`);\r\n        }\r\n    }\r\n}\r\nlet board = new Board();\r\nboard.ResetBoard();\r\nboard.ApplyMove(new Move(0, 2, 1, 3));\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });