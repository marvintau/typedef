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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CanvasExtend.js":
/*!*****************************!*\
  !*** ./src/CanvasExtend.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

CanvasRenderingContext2D.prototype.lineToVec = function (vec) {
  this.lineTo(vec.x, vec.y);
};

CanvasRenderingContext2D.prototype.moveToVec = function (vec) {
  this.moveTo(vec.x, vec.y);
};

CanvasRenderingContext2D.prototype.bezierCurveTo = function (cv1, cv2, ev) {
  this.bezierCurveTo(cv1.x, cv1.y, cv2.x, cv2.y, ev.x, ev.y);
};

CanvasRenderingContext2D.prototype.point = function (v) {
  if (v != undefined) {
    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height / 2 / dpr;
    this.beginPath();
    this.arc(v.x * ratio, v.y * ratio, 1.8, 0, Math.PI * 2);
    this.fill();
  }
};

CanvasRenderingContext2D.prototype.drawSegs = function (segs) {
  let dpr = window.devicePixelRatio,
      ratio = this.canvas.height / 2 / dpr;

  try {
    this.beginPath();
    this.moveToVec(segs[0].head.mult(ratio));

    for (let seg of segs) {
      this.lineToVec(seg.tail.mult(ratio));
    }

    this.stroke();
  } catch {
    console.log('Illegal line segs: ', segs);
  }
};

CanvasRenderingContext2D.prototype.drawContours = function (contours) {
  let dpr = window.devicePixelRatio,
      ratio = this.canvas.height / 2 / dpr;

  try {
    for (let contour of contours) {
      this.moveToVec(contour[0].head.mult(ratio));

      for (let seg of contour) {
        this.lineToVec(seg.tail.mult(ratio));
      }

      this.closePath();
    }
  } catch {
    console.log('Illegal line segs: ', contours);
  }
};

CanvasRenderingContext2D.prototype.text = function (text, vec, fontsize) {
  this.save();
  this.font = `${fontsize ? fontsize : 10}px Helvetica`;
  this.textAlign = 'center';
  this.textBaseline = 'middle';

  if (vec != undefined) {
    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height / 2 / dpr;
    this.fillText(text, vec.x * ratio, vec.y * ratio);
  }

  this.restore();
};

CanvasRenderingContext2D.prototype.drawBound = function (vecs, num, {
  r,
  g,
  b
}) {
  let centroid = toPolyCentroid(vecs);

  if (num !== undefined) {
    this.save();
    this.fillStyle = 'rgb(128, 0, 0, 0.3)';
    this.text(num, centroid);
    this.restore();
  } else {
    this.point(centroid);
  }

  this.fillStyle = `rgba(${r * 128}, ${g}, ${b}, 0.1)`;
  this.beginPath();
  this.drawZig(vecs);
  this.closePath();
  this.fill();
};

/***/ }),

/***/ "./src/List.js":
/*!*********************!*\
  !*** ./src/List.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return List; });
// Extended JavaScript native Array class with handy methods.
class List extends Array {
  constructor(...args) {
    super(...args);
  }

  most() {
    return this.slice(0, -1);
  }

  last() {
    return this[this.length - 1];
  }

  sum(sumFunc = e => e) {
    return this.reduce((acc, n) => acc + sumFunc(n), 0);
  }

  same(func = e => e) {
    return this.every((v, i, a) => func(v) === func(a[0]));
  }

  accum(accumFunc = e => e) {
    return this.reduce((acc, x) => acc.concat(acc.last() + accumFunc(x)), [0]);
  } // copy the list, and try to clone the elements if
  // a copy method exists.


  copy() {
    return this.map(e => e.copy ? e.copy() : e);
  }

  zip(func = e => e) {
    if (this[0].length && this[0].length > 0 && this.same(e => e.length)) {
      let newList = this[0].map((_e, i) => {
        return func(this.map(e => e[i]));
      });
      return new List(...newList);
    } else throw Error('Invalid array dimension for zipping');
  }

}

(() => {
  let list = new List(1, 2, 3);
  console.assert(list[0] === 1 && list.length === 3, 'List: Constructor failed');
  console.assert(list.sum(e => e * 2) === 12, 'List: sum failed');
  console.assert(list.same(e => Number.isInteger(e)), 'List: same failed');
  let listMapped = list.map(e => [e, e * 2]);
  console.assert(listMapped.zip().last().sum() == 12, 'List: zip failed');
})();

/***/ }),

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CanvasExtend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanvasExtend */ "./src/CanvasExtend.js");
/* harmony import */ var _CanvasExtend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_CanvasExtend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Segs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Segs */ "./src/Segs.js");
/* harmony import */ var _Radical__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Radical */ "./src/Radical.js");
/* harmony import */ var _Stroke__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Stroke */ "./src/Stroke.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");







let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    dpr = window.devicePixelRatio;
canvas.width = 400 * dpr;
canvas.height = 400 * dpr;
canvas.style.width = 400;
canvas.style.height = 400;
document.getElementById('canvas-container').appendChild(canvas);
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(dpr, dpr);

function tes() {
  let len = 19,
      range = 5;
  let vecsCircles = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](0);

  for (let r = 0; r < 6; r++) {
    let vecs = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / len * 360).mult(0.8 * (r + 1) / range));
    vecsCircles.push(new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecs));

    if (r % 2 === 1) {
      console.log(vecsCircles[r]);
      vecsCircles[r].flip();
    }
  }

  let poly = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](vecsCircles),
      polyCopy = poly.copy();
  console.log(poly);
  poly.shrink(0.05, ctx); // polyCopy.draw(ctx);
  // poly.draw(ctx);
} // testRadical();


function testShrink() {
  let len = 12;
  let vecsCircle = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / len * 360).mult(0.5));
  let vecsLine = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / (6 - 1) * 2 - 1, 0.3)); // let poly1 = new Radical([(new Segs(0).fromVecs(vecsCircle))]);

  let stroke1 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsCircle), true),
      stroke2 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsLine));
  let enter = 3;
  stroke1.segs.cutEnter(enter, 0.5);
  stroke1.segs.cutGoing(enter + 1, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.1, 0));
  stroke1.segs.cutGoing(enter + 2, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.1, 0));
  let cuts = stroke1.segs.cutLeave(enter + 3, 14, 0.5);
  console.log(cuts[0].map(e => e.head), 'cutresult');
  let poly1 = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2__["default"](cuts[0])),
      poly2 = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2__["default"](cuts[1])),
      poly3,
      poly4;
  poly1 = poly1.copy();
  poly2 = poly2.copy();
  poly1.trans(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.15, 0.1));
  poly2.trans(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.15, -0.1));
  poly3 = poly1.copy();
  poly4 = poly2.copy();
  poly1.shrink(0.05);
  poly2.shrink(0.05);
  console.log(poly1, poly2);
  poly1.draw(ctx, true);
  poly2.draw(ctx, true);
  poly3.draw(ctx);
  poly4.draw(ctx); // stroke1.draw(ctx);
  // stroke2.draw(ctx);
  // segs1.flip();
  // console.assert(segs1[0].head === segs2.last().tail, 'Segs: flip error');

  let segsLine = new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](vecsLine); // console.log(segsLine.torque().center);
} // testShrink();


function testCut() {
  let seg1 = new _Seg__WEBPACK_IMPORTED_MODULE_6__["default"](new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 1)),
      seg2 = new _Seg__WEBPACK_IMPORTED_MODULE_6__["default"](new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](1, 0)),
      seg3 = new _Seg__WEBPACK_IMPORTED_MODULE_6__["default"](new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-1, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](2, 0));
  console.log(seg1.intersect(seg2));
  console.log(seg1.intersect(seg3));
  let edges = 4,
      circles = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](0);

  for (let i = 0; i < 4; i++) {
    let vecs = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](edges + i * 4).fill(0).map((e, n) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](n / (edges + i * 4) * 360 + 22.5).mult(0.3 + i * 0.2)),
        circle = new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecs);

    if (i % 2 === 0) {
      circle.flip();
    }

    ;
    console.log(circle.area());
    circles.push(circle);
  }

  let poly = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](circles);
  let len = 14,
      width = 0.6;

  for (let i = 0; i < 4; i++) {
    let vecsLine = [new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.2 * (i + 1), i * 0.05), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, i * 0.05), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.2 * (i + 1), i * 0.05)];
    let stroke = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsLine));
    poly.contours = stroke.cut(poly.contours);
    poly = poly.copy();
    stroke.draw(ctx, false);
  }

  let shratio = -0.02;
  poly = poly.copy();
  poly.shrink(shratio);
  poly.draw(ctx, true, '#34567888');
} // testCut();


function testCentroid() {
  let edges = 4,
      circles = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](0);

  for (let i = 0; i < 5; i++) {
    let vecs = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](edges + i * 4).fill(0).map((e, n) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](n / (edges + i * 4) * 360 + 22.5).mult(0.3 + i * 0.1).add(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i * 0.05, 0))),
        circle = new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecs);

    if (i % 2 === 0) {
      circle.flip();
    }

    ;
    console.log(circle.area());
    circles.push(circle);
  }

  let poly = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](circles);
  poly.draw(ctx, true);
} // testCentroid();


function testRadical() {
  let radical = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"]();
  let stroke1 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.4, 0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0.4)])),
      stroke2 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, -0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.3, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0.4)])),
      stroke3 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, -0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0.4)]));
  radical.addStroke(stroke1, [0]);
  radical.addStroke(stroke2, [0, 1]);
  radical.addStroke(stroke3, [0, 2]);
  radical.shrink(-0.02);
  radical.draw(ctx, false);
  console.log(radical.contours);
}

testRadical();

function testCutUndo() {
  let edges = 6;
  let circles = [];

  for (let i = 0; i < 1; i++) {
    let vecs = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](edges + i * 4).fill(0).map((e, n) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](n / (edges + i * 4) * 360 + 22.5).mult(0.8 + i * 0.3).add(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i * 0.05, 0))),
        circle = new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecs); // if(i%2 === 0) {circle.flip()};

    console.log(circle.area());
    circles.push(circle);
  }

  let poly = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](circles);
  let stroke = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.4, 0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0.3)]));
  poly.counters = stroke.cut(poly.contours);
  poly.counters[0].undoCutThrough(poly.counters[1]);
  poly.counters[0].undoCut();
  poly.counters.splice(1, 1);
  console.log(poly.counters); // poly.shrink(-0.02);
  // stroke.draw(ctx);

  poly.draw(ctx, true);
} // testCutUndo()

/***/ }),

/***/ "./src/Radical.js":
/*!************************!*\
  !*** ./src/Radical.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Radical; });
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Segs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Segs */ "./src/Segs.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");




class Radical {
  constructor(contours) {
    if (contours === undefined) {
      contours = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_1__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](-1, -1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](1, -1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](1, 1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](-1, 1)]));
    }

    this.contours = contours;
    this.closeContours();
    this.strokes = [];
  }

  closeContours() {
    for (let contour of this.contours) {
      if (!contour.last().tail.equal(contour[0].head)) {
        let conn = new _Seg__WEBPACK_IMPORTED_MODULE_2__["default"](contour.last().tail, contour[0].head);
        contour.push(conn);
      } else {
        contour.last().tail = contour[0].head;
      }
    }
  }

  union(contourLabels) {
    if (contourLabels.length === 1) {
      return this.contours[contourLabels[0]].copy();
    } else if (contourLabels.length > 1) {
      let contours = this.contours.copy(),
          [first, ...restLabels] = contourLabels,
          unioned = contours[first].copy(); // console.log(JSON.stringify(contourLabels.map(e => contours[e]), null, 2));

      for (let label of restLabels) {
        unioned.undoCutThrough(contours[label]);
        unioned.undoCut();
      } // console.log(unioned, 'unioned');


      return unioned;
    } else throw Error('Radical union: YOU MUST EXPLICITLY SPECIFY THE LABELS OF CONTOURS TO BE UNIONED');
  }

  split(stroke, contourLabels) {}

  addStroke(stroke, unioned = [], splitted = []) {
    // 1. get the union of contours and calculate the place;
    //    where the stroke will be put.
    let unionedContour = this.union(unioned);
    stroke.trans(unionedContour.centroid().sub(stroke.center())); // console.log('addStroke unioned', unionedContour);

    if (splitted.length === 0) {
      this.contours = stroke.cut(this.contours).copy(); // console.log('addstroke', this.contours)

      this.closeContours();
    } else {// if to split specified
    }

    this.strokes.push(stroke);
  }

  copy() {
    let poly = new Radical(this.contours.copy()); // poly.close();

    return poly;
  }

  trans(vec) {
    for (let contour of this.contours) {
      contour.trans(vec);
      contour.last().tail.iadd(vec.neg());
    }
  }

  shrink(shrink) {
    let bisecs = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let contour of this.contours) {
      bisecs.push([]);

      for (let i = 0; i < contour.length; i++) {
        let last = i === 0 ? contour.length - 1 : i - 1;
        let bisec = contour[last].angleBisect(contour[i]);
        bisecs.last().push(bisec.mult(shrink));
      }
    }

    for (let i = 0; i < this.contours.length; i++) {
      let contour = this.contours[i];

      for (let j = 0; j < contour.length; j++) {
        contour[j].head.iadd(bisecs[i][j]);
      }
    }
  }

  draw(ctx, stroke, color = 'rgb(0, 0, 0, 0.1)') {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.drawContours(this.contours);
    ctx.fill();
    if (stroke) ctx.stroke();
    ctx.save();
    ctx.fillStyle = 'rgb(0, 0, 0, 0.2)';

    for (let i = 0; i < this.contours.length; i++) {
      let contour = this.contours[i];

      for (let [index, seg] of contour.entries()) {
        if (stroke) ctx.text(index, seg.head);else ctx.point(seg.head);
      } // ctx.point(contour.centroid());


      ctx.text(i, contour.centroid(), Math.abs(contour.area()) * 80);
    }

    ctx.restore();
    ctx.save();

    for (let stroke of this.strokes) {
      stroke.draw(ctx);
    }

    ctx.restore();
  }

}

/***/ }),

/***/ "./src/Seg.js":
/*!********************!*\
  !*** ./src/Seg.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Seg; });
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
/* harmony import */ var _Torque__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Torque */ "./src/Torque.js");
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// 
// note that:
// |x1-x3 x3-x4|
// |           | (determinant) is equivalent to
// |y1-y3 y3-y4|
// 
// cross((x1-x3, y1-y3), (x3-x4, y3-y4)), or
// 
// cross(P1-P3, P3-P4)
function segIntersect(head1, tail1, head2, tail2) {
  let h1h2 = head1.sub(head2),
      h1t1 = head1.sub(tail1),
      h2t2 = head2.sub(tail2),
      detT = h1h2.cross(h2t2),
      detU = h1t1.cross(h1h2),
      detS = h1t1.cross(h2t2),
      t = detT / detS,
      u = -detU / detS,
      p = head1.add(tail1.sub(head1).mult(t)),
      d = detS;
  return {
    t,
    u,
    p,
    d
  };
}



class Seg {
  constructor(hd, tl) {
    this.head = hd;
    this.tail = tl;
  }

  diff() {
    return this.tail.sub(this.head);
  }

  len() {
    return this.tail.sub(this.head).mag();
  }

  dir() {
    return this.tail.sub(this.head).norm();
  }

  lerp(ratio) {
    return this.head.add(this.tail.sub(this.head).mult(ratio));
  }

  trans(vec) {
    this.head.iadd(vec);
    this.tail.iadd(vec);
  }

  rotate(angle) {
    this.head.irotate(angle);
    this.tail.irotate(angle);
  }

  scale(mag) {
    this.head.imult(mag);
    this.tail.imult(mag);
  }

  torque() {
    return new _Torque__WEBPACK_IMPORTED_MODULE_1__["default"]({
      center: this.lerp(0.5),
      mass: this.len()
    });
  }

  intersect(that) {
    return segIntersect(this.head, this.tail, that.head, that.tail);
  }

  cross() {
    return this.head.cross(this.tail);
  } // the previous one connect with the 


  angleBisect(that) {
    if (that.head == this.tail) {
      let thisDir = this.dir().neg(),
          thatDir = that.dir();

      if (thisDir.cross(thatDir) === 0) {
        if (thisDir.dot(thatDir) > 0) {
          return thisDir;
        } else {
          return new _Vec__WEBPACK_IMPORTED_MODULE_0__["default"](-thisDir.y, thisDir.x);
        }
      } else {
        return thisDir.add(thatDir).mult(Math.sign(thisDir.cross(thatDir))).norm();
      }
    } else console.error('angleBisector is only permitted if two segs share same vec', this, that);
  }

  reverse() {
    let temp = this.head;
    this.head = this.tail;
    this.tail = temp;
  }

  copy() {
    return new Seg(this.head.copy(), this.tail.copy());
  }

}

/***/ }),

/***/ "./src/Segs.js":
/*!*********************!*\
  !*** ./src/Segs.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Segs; });
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
/* harmony import */ var _Torque__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Torque */ "./src/Torque.js");




class Segs extends _List__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(...segs) {
    super(...segs);
  }

  conn() {
    for (let i = 0; i < this.length - 1; i++) {
      this[i + 1].head = this[i].tail;
    }
  }

  area() {
    return this.map(seg => seg.cross()).sum() / 2;
  }

  centroid() {
    if (this.length > 0) {
      let area = this.area();
      return this.map(e => e.head.add(e.tail).mult(e.cross() / (6 * area))).reduce((acc, e) => acc.add(e), new _Vec__WEBPACK_IMPORTED_MODULE_2__["default"](0, 0));
    } else {
      return undefined;
    }
  }

  fromVecs(vecs) {
    let list = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](vecs.slice(0, -1), vecs.slice(1)).zip(e => new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](...e));

    while (list.length > 0) {
      this.push(list.pop());
    }

    this.reverse();
    return this;
  }

  flip() {
    this.reverse();

    for (let seg of this) {
      seg.reverse();
    }
  }

  lens() {
    let lens = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let seg of this) {
      lens.push(seg.len());
    }

    return lens;
  }

  intersect(other) {
    let intersects = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let seg of this) {
      intersects.push(other.intersect(seg));
    }
  }

  partialSums(component) {
    let sum = [];

    for (let seg of this) {
      sum.push(seg.head[component] + seg.tail[component]);
    }

    return sum;
  }

  crosses() {
    let crosses = [];

    for (let seg of this) {
      crosses.push(seg.head.cross(seg.tail));
    }
  }

  trans(transVec) {
    for (let seg of this) {
      console.log('yay', transVec);
      seg.head.iadd(transVec);
    }

    this.last().tail.iadd(transVec);
  }

  rotate(angle) {
    let headOffset = this[0].head.copy();
    this.trans(headOffset.neg());

    for (let seg of this) {
      seg.tail.irotate(angle);
    }

    this.trans(headOffset);
  }

  scale(ratio) {
    let headOffset = this.segs[0].head.copy();
    this.trans(headOffset.neg());

    for (let seg of this) {
      seg.tail.imult(ratio);
    }

    this.trans(headOffset);
  }

  pointAt(ratio) {
    let lens = this.lens(),
        accum = lens.accum(),
        given = accum.last() * ratio;
    var ithSeg = 0,
        lenInSeg = 0;

    for (let [index, len] of accum.entries()) {
      if (given < len) {
        ithSeg = index - 1;
        lenInSeg = len - given;
        break;
      }
    }

    return {
      point: this[ithSeg].lerp(1 - lenInSeg / lens[ithSeg]),
      tan: this[ithSeg].dir()
    };
  }

  cutEnter(notch, ratio) {
    let seg = this[notch],
        lerp = seg.lerp(ratio),
        tail = seg.tail;
    seg.tail = lerp;
    this.splice(notch + 1, 0, new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](lerp, tail));
  }

  cutGoing(notchPrev, point) {
    let seg = this[notchPrev];
    this.splice(notchPrev + 1, 0, new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](seg.tail, point), new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](point, seg.tail.copy()));
    this[notchPrev + 2].head = this[notchPrev + 1].tail;
  }

  cutThrough(notchPrev, splitPrev) {
    let result = [];

    if (notchPrev < splitPrev) {
      console.log('notch - split - 0');
      result = [this.slice(notchPrev, splitPrev), this.slice(0, notchPrev + 1).concat(this.slice(splitPrev))];
    } else if (notchPrev > splitPrev) {
      console.log('notch - 0 - split');
      result = [this.slice(notchPrev).concat(this.slice(0, splitPrev)), this.slice(splitPrev, notchPrev)];
    } else throw Error('its impossible to have same notchPrev and splitPrev', notchPrev, splitPrev);

    return result;
  }

  cutThroughRing(notchPrev, splitPrev, ringSegs) {
    let splittedRingSegs = [...ringSegs.slice(splitPrev), ...ringSegs.slice(0, splitPrev + 1)];
    return new Segs(...[...this.slice(0, notchPrev + 1), ...splittedRingSegs, ...this.slice(notchPrev)]);
  }

  undoCut() {
    let thereIsStillNotch = true;

    while (thereIsStillNotch) next: {
      for (let i = 0; i < this.length - 1; i++) {
        if (this[i].head.equal(this[i + 1].tail) && this[i].tail.equal(this[i + 1].head)) {
          console.log(i, 'undo');
          this.splice(i, 2);
          console.log(this, this[i - 1]);
          this[i].head = this[i - 1].tail;
          break next;
        }
      }

      thereIsStillNotch = false;
    }
  }

  undoCutThrough(that) {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < that.length; j++) {
        if (this[i].head.equal(that[j].tail) && this[i].tail.equal(that[j].head)) {
          let thatSlice = [...that.slice(j + 1), ...that.slice(0, j)];
          console.log('encountered', thatSlice);
          this.splice(i + 1, ...thatSlice);
          return;
        }
      }
    }
  }

  torque() {
    let product = new _Vec__WEBPACK_IMPORTED_MODULE_2__["default"]();

    for (let seg of this) {
      product.iadd(seg.torque().toProduct());
    }

    let mass = this.lens().sum();
    let center = product.mult(this.length === 0 ? 0 : 1 / mass);
    return new _Torque__WEBPACK_IMPORTED_MODULE_3__["default"]({
      center,
      mass
    });
  }

  copy() {
    // console.log(this);
    let segs = this.map(seg => seg.copy ? seg.copy() : seg);

    for (let i = 0; i < segs.length - 1; i++) {
      segs[i].tail = segs[i + 1].head;
    }

    return segs;
  }

}

/***/ }),

/***/ "./src/Stroke.js":
/*!***********************!*\
  !*** ./src/Stroke.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Stroke; });
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./List */ "./src/List.js");



function intersectHead(cutterSeg, contours) {
  let intersects = [];
  let EPSILON = 1e-10;

  for (let con = 0; con < contours.length; con++) {
    let segs = contours[con];

    for (let seg = 0; seg < segs.length; seg++) {
      let {
        t,
        u,
        d
      } = cutterSeg.intersect(segs[seg]);

      if (t < EPSILON && u < 1 - EPSILON && u > EPSILON) {
        intersects.push({
          t,
          u,
          d,
          con,
          seg
        });
      }
    }
  }

  intersects.sort((a, b) => b.t - a.t); // console.log(intersects, 'headIntersects')

  return intersects;
}

function intersectTail(cutterSeg, contours) {
  let intersects = [];
  let EPSILON = 1e-10;

  for (let con = 0; con < contours.length; con++) {
    let segs = contours[con];

    for (let seg = 0; seg < segs.length; seg++) {
      let {
        t,
        u,
        p,
        d
      } = cutterSeg.intersect(segs[seg]);

      if (t > 1 - EPSILON && u < 1 - EPSILON && u > EPSILON) {
        intersects.push({
          t,
          u,
          p,
          d,
          con,
          seg
        });
      }
    }
  }

  intersects.sort((a, b) => a.t - b.t); // console.log(intersects, 'tailIntersects')

  return intersects;
} // return intersections between all contours of poly, and
// the given seg, sorted by t parameter.


function intersectSeg(cutterSeg, contours) {
  let intersects = [];
  let EPSILON = 1e-10;

  for (let con = 0; con < contours.length; con++) {
    let segs = contours[con];

    for (let seg = 0; seg < segs.length; seg++) {
      let {
        t,
        u,
        d
      } = cutterSeg.intersect(segs[seg]);

      if (t < 1 - EPSILON && t > EPSILON && u < 1 - EPSILON && u > EPSILON) {
        intersects.push({
          t,
          u,
          d,
          con,
          seg
        });
      }
    }
  }

  intersects.sort((a, b) => a.t - b.t);
  return intersects;
}

class Stroke {
  constructor(segList, closed) {
    this.segs = segList;

    if (closed) {
      this.closed = true;
      let conn = new _Seg__WEBPACK_IMPORTED_MODULE_0__["default"](this.segs.last().tail.copy(), this.segs[0].head.copy());
      this.segs.push(conn);
    }

    this.displayed = this.segs.copy();
  }

  trans(vec) {
    this.segs.trans(vec);
    this.displayed = this.segs.copy();
  }

  joint(that, {
    thisPos,
    thatPos
  }) {
    if (thisPos === 1) {
      this.segs.push(...(thatPos === 0 ? that.segs : that.segs.reverse()));
    } else if (thisPos === 0) {
      this.segs.unshift(...(thatPos === 0 ? that.segs : that.segs.reverse()));
    }

    this.displayed = this.segs.copy();
  }

  draw(ctx, stroke) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.drawSegs(this.displayed);
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = "rgb(0, 0, 0, 0.2)";

    for (let [index, seg] of this.segs.entries()) {
      if (stroke) ctx.text(index, seg.head);else ctx.point(seg.head);
    }

    ctx.restore();
  }

  center() {
    return this.segs.torque().center;
  }

  cut(contours) {
    let entered, notchPrev, splitPrev;

    for (let cutter = 0; cutter < this.segs.length; cutter++) nextCutter: {
      let cutterSeg = this.segs[cutter];

      if (cutter === 0) {
        let headIntersects = intersectHead(cutterSeg, contours);

        if (headIntersects.length > 0) {
          let {
            t,
            con,
            d
          } = headIntersects[0];
          console.log('head', con, t, d);
          if (d < 0) cutterSeg.head.iadd(cutterSeg.diff().mult(t - 0.01));
        }
      }

      if (cutter === this.segs.length - 1) {
        let tailIntersects = intersectTail(cutterSeg, contours);

        if (tailIntersects.length > 0) {
          let {
            t,
            con,
            d,
            p
          } = tailIntersects[0];
          if (d > 0) cutterSeg.tail.iadd(p.sub(cutterSeg.tail).mult(t));
        }
      }

      if (entered !== undefined) {
        // console.log(entered, contours);
        contours[entered].cutGoing(notchPrev, cutterSeg.head);
        notchPrev += 1;
      } // find the intersections bettwen the segment from cutter
      // stroke and from all contours. Sort them by the distance
      // bettwen the intersection to the head of cutter segment.


      while (true) {
        let intersects = intersectSeg(cutterSeg, contours);
        if (intersects.length === 0) break;
        let {
          u,
          d,
          con,
          seg
        } = intersects[0];

        if (entered === undefined) {
          console.log('entered', con);
          entered = con;
          notchPrev = seg;
          contours[entered].cutEnter(notchPrev, u);
        } else {
          splitPrev = seg;

          if (entered === con) {
            console.log('cutting through self');
            contours[entered].cutEnter(splitPrev, u);
            notchPrev += notchPrev > splitPrev ? 1 : 0;
            let [left, right] = contours[entered].cutThrough(notchPrev + 1, splitPrev + 1);
            contours.splice(con, 1, left, right);
          } else {
            console.log('cutting through ring', con);
            contours[con].cutEnter(splitPrev, u);
            contours[entered] = contours[entered].cutThroughRing(notchPrev + 1, splitPrev + 1, contours[con]);
            contours.splice(con, 1);
          }

          entered = undefined; // console.log('contours', contours);
        }
      }
    }

    return contours; // console.log(contours);
  }

}

/***/ }),

/***/ "./src/Torque.js":
/*!***********************!*\
  !*** ./src/Torque.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Torque; });
class Torque {
  constructor({
    center,
    mass
  }) {
    // console.log("new torque", center, mass)
    this.center = center ? center : new Vec(0, 0);
    this.mass = mass !== undefined ? mass : 0;
  }

  toProduct() {
    return this.center.mult(this.mass);
  }

}

/***/ }),

/***/ "./src/Vec.js":
/*!********************!*\
  !*** ./src/Vec.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Vec; });
const EPSILON = 1e-6;
class Vec {
  /**
   * Simple Vector class.
   * 
   * @param {any} x 
   * @param {any} y 
   */
  constructor(x, y, attr) {
    if (attr === undefined) {
      this.attr = {};

      if (y === undefined) {
        if (x === undefined) {
          // For nothing given, new vec created
          this.x = 0;
          this.y = 0;
        } else if (x.x !== undefined && x.y !== undefined) {
          // if argument given as {x:1, y:1}
          this.x = x.x;
          this.y = x.y;
        } else if (x.len !== undefined && x.ang !== undefined) {
          // if argument given as {len: 1, ang: 0}
          this.x = x.len * Math.cos(x.ang * Math.PI / 180);
          this.y = x.len * Math.sin(x.ang * Math.PI / 180);
        } else if (typeof x === 'number') {
          // if x is a number 
          this.x = Math.cos(x * Math.PI / 180);
          this.y = Math.sin(x * Math.PI / 180);
        }
      } else {
        this.x = x;
        this.y = y;
      }
    } else {
      this.attr = attr;
      this.x = x;
      this.y = y;
    }
  }

  equal(vec) {
    return Math.abs(this.x - vec.x) < EPSILON && Math.abs(this.y - vec.y) < EPSILON;
  }
  /**
   * 
   * @param {Vec} vec another vec to be added
   * @returns {Vec}
   */


  add(vec) {
    return new Vec(this.x + vec.x, this.y + vec.y);
  }

  iadd(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }
  /**
   * 
   * @param {Vec} vec another vec to be subtracted
   * @returns {Vec}
   */


  sub(vec) {
    return new Vec(this.x - vec.x, this.y - vec.y);
  }

  isub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }
  /**
   * 
   * @param {Vec, number} vec can be either a vec or a scalar. If it's a scalar,
   *                          then times it both to x and y.
   * @returns {Vec}
   */


  mult(vec) {
    if (vec.x === undefined) {
      return new Vec(this.x * vec, this.y * vec);
    } else {
      return new Vec(this.x * vec.x, this.y * vec.y);
    }
  }

  imult(vec) {
    if (vec.x === undefined) {
      this.y *= vec;
      this.x *= vec;
    } else {
      this.x *= vec.x;
      this.y *= vec.y;
    }
  }
  /**
   * transform point in polar manner. returns a new vector relative
   * to this one.
   * @param {number} len length
   * @param {number} ang angle in degree
   */


  polar(vec) {
    return new Vec(this.x + vec.len * Math.cos(vec.ang * Math.PI / 180), this.y + vec.len * Math.sin(vec.ang * Math.PI / 180));
  }

  ipolar(vec) {
    this.x += vec.len * Math.cos(vec.ang * Math.PI / 180);
    this.y += vec.len * Math.sin(vec.ang * Math.PI / 180);
  }

  iscale(ratio, about) {
    // console.log(this, ratio, about, "iscale");
    this.isub(about);
    this.imult(ratio);
    this.iadd(about);
  }
  /**
  * rotate
  * @param {number} theta angle to rotate in degree.
  */


  rotate(theta) {
    switch (theta) {
      case 90:
        return new Vec(-this.y, this.x);

      case -90:
        return new Vec(this.y, -this.x);

      case 180:
      case -180:
        return new Vec(-this.x, -this.y);

      default:
        let rad = theta / 180 * Math.PI,
            sin = Math.sin(rad),
            cos = Math.cos(rad);
        return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
  }

  irotate(theta) {
    let vec = this.rotate(theta);
    this.x = vec.x;
    this.y = vec.y;
  }

  neg() {
    return new Vec(-this.x, -this.y);
  }
  /**
   * returns the cross product between this and vec.
   * also is the result of det
   * 
   * |this.x   that.x|
   * |               |
   * |this.y   that.y|
   * 
   * also, this can be used for determining which side
   * does the "that" vector resides, left or right.
   * When the cross product is positive, the "that" is
   * on LEFT of this vector.
   * 
   * @param {Vec} that another vector
   */


  cross(that) {
    return this.x * that.y - that.x * this.y;
  }

  dot(that) {
    return this.x * that.x + this.y * that.y;
  }

  mag() {
    return Math.hypot(this.x, this.y);
  }

  norm() {
    let mag = this.mag();
    return this.mult(mag === 0 ? 0 : 1 / mag);
  }

  angle() {
    return Math.atan2(this.y, this.x) / Math.PI * 180;
  }

  isNaN() {
    return isNaN(this.x) || isNaN(this.y);
  }

  addAttr(attr) {
    this.attr.push(attr);
  }
  /**
   * Set attribute to Vector. overwrite existing attributes.
   * @param {object} attrObject 
   */


  setAttr(attrObject) {
    return Object.assign(this.attr, attrObject);
  }

  removeAttr(attrKey) {
    this.attr[attrKey] = undefined;
  }
  /**
   * copy: duplicate an object instance of this.
   * @returns {Vec}
   */


  copy() {
    return new Vec(this.x, this.y, JSON.parse(JSON.stringify(this.attr)));
  }

  toArray() {
    return [this.x, this.y];
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = 'gray';
    ctx.point(this);
    ctx.restore();
  }

}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map