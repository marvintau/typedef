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
/*! no static exports found */
/***/ (function(module, exports) {

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

  rest() {
    return this.slice(1);
  }

  sum() {
    if (!this.same(e => e.constructor)) {
      throw Error('Sum: cannot be applied to elements with different type');
    }

    let Cons = this[0].constructor,
        func = (acc, n) => acc.add ? acc.add(n) : acc + n;

    return this.reduce(func, new Cons());
  }

  same(func = e => e) {
    return this.every((v, i, a) => func(v) === func(a[0]));
  }

  accum(accumFunc = e => e) {
    return this.reduce((acc, x) => {
      return acc.concat(acc.last() + accumFunc(x));
    }, List.from([0]));
  }

  transpose(func = e => e) {
    if (this[0].length && this[0].length > 0 && this.same(e => e.length)) {
      let newList = this[0].map((_e, i) => {
        return func(this.map(e => e[i]));
      });
      return new List(...newList);
    } else throw Error('transpose: Invalid array dimension for transposing');
  }

  diff(diffFunc = e => e) {
    if (this.length < 2) {
      throw Error('diff: at least two element to get a diff result');
    }

    const list = List.from([this.most(), this.rest()]);
    return list.transpose(diffFunc);
  } // copy the list, and try to clone the elements if
  // a copy method exists.


  copy() {
    return this.map(e => e.copy ? e.copy() : e);
  }

}

module.exports = List;

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
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_List__WEBPACK_IMPORTED_MODULE_2__);
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
  let vecsCircles = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(0);

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
  console.log(poly); // poly.shrink(0.05, ctx);
  // polyCopy.draw(ctx);
  // poly.draw(ctx);
} // testRadical();


function testShrink() {
  let len = 12;
  let vecsCircle = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / len * 360).mult(0.5));
  let vecsLine = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / (6 - 1) * 2 - 1, 0.3)); // let poly1 = new Radical([(new Segs(0).fromVecs(vecsCircle))]);

  let stroke1 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsCircle), true),
      stroke2 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsLine));
  let enter = 3;
  stroke1.segs.cutEnter(enter, 0.5);
  stroke1.segs.cutGoing(enter + 1, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.1, 0));
  stroke1.segs.cutGoing(enter + 2, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.1, 0));
  let cuts = stroke1.segs.cutLeave(enter + 3, 14, 0.5);
  console.log(cuts[0].map(e => e.head), 'cutresult');
  let poly1 = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2___default.a(cuts[0])),
      poly2 = new _Radical__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2___default.a(cuts[1])),
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
      circles = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(0);

  for (let i = 0; i < 4; i++) {
    let vecs = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(edges + i * 4).fill(0).map((e, n) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](n / (edges + i * 4) * 360 + 22.5).mult(0.3 + i * 0.2)),
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
      circles = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(0);

  for (let i = 0; i < 5; i++) {
    let vecs = new _List__WEBPACK_IMPORTED_MODULE_2___default.a(edges + i * 4).fill(0).map((e, n) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](n / (edges + i * 4) * 360 + 22.5).mult(0.3 + i * 0.1).add(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i * 0.05, 0))),
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
  let stroke1 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.4, 0), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0)]));
  let stroke2 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, -0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.1, 0.1), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.4, 0.4)]));
  let stroke3 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, -0.4), new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0.4)]));
  radical.addStroke(stroke1, [0]);
  radical.addStroke(stroke3, [0, 1], [1]); // radical.addStroke(stroke3, [0]);
  // radical.addStroke(stroke2, [2]);
  // radical.shrink(-0.02);

  radical.draw(ctx, false);
  console.log(radical.contours);
}

testRadical();

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
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_List__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Segs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Segs */ "./src/Segs.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");




class Radical {
  constructor(contours) {
    if (contours === undefined) {
      contours = new _List__WEBPACK_IMPORTED_MODULE_0___default.a(new _Segs__WEBPACK_IMPORTED_MODULE_1__["default"](0).fromVecs([new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](-1, -1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](1, -1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](1, 1), new _Vec__WEBPACK_IMPORTED_MODULE_3__["default"](-1, 1)]));
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
        console.log(unioned.map(({
          head,
          tail
        }) => [head, tail]).flat(), 'before undo cut');
        unioned.undoCut();
      }

      return unioned;
    } else throw Error('Radical union: YOU MUST EXPLICITLY SPECIFY THE LABELS OF CONTOURS TO BE UNIONED');
  }

  split(stroke, contourLabels) {}

  addStroke(stroke, unioned = [], splitted = []) {
    // 1. get the union of contours and calculate the place;
    //    where the stroke will be put.
    let unionedContour = this.union(unioned);
    stroke.trans(unionedContour.centroid().sub(stroke.center()));
    console.log('unioned centroidd', unionedContour.centroid());

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
      }

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
/* harmony import */ var _Torque__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Torque */ "./src/Torque.js");
// The design of seg
// -----------------
// 1) Cloning Vector or Not?
// Line segment is the class for building polygon and path. In our scenario, we have two
// frequent operation of
// 
// * cutting through the polygon and merge them back from the cutting path.
// * move the cutting path.
// 
// The problem of cloning vector, is once we cloned the vector, we will lose the information
// that if the edge of two polygons are actually sharing same path. Thus, before we really need
// to modify the polygons, such as shrinking, we will keep the segs created from same vector
// always refer to same vector object.
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

function FourPointIntersect(head1, tail1, head2, tail2) {
  let h1h2 = head1.diff(head2),
      h1t1 = head1.diff(tail1),
      h2t2 = head2.diff(tail2),
      detA = h1h2.cross(h2t2),
      detB = h1t1.cross(h1h2),
      detS = h1t1.cross(h2t2),
      ratioA = detA / detS,
      ratioB = -detB / detS,
      point = head1.lerp(ratioA, tail1),
      det = detS;
  return {
    ratioA,
    // mag(point - head1) / mag(tail1 - head1)
    ratioB,
    // mag(point - head2) / mag(tail2 - head2)
    point,
    // point
    det // h1t1 x h2t2 (for determining the direction)

  };
}

function TwoSegIntersect(seg1, seg2) {
  const {
    head: head1,
    tail: tail1
  } = seg1;
  const {
    head: head2,
    tail: tail2
  } = seg2;
  return FourPointIntersect(head1, tail1, head2, tail2);
}

class Seg {
  constructor(hd, tl) {
    this.head = hd;
    this.tail = tl;
  } // ==============================================
  // in-place operations / transforms


  trans(vec) {
    this.head.trans(vec);
    this.tail.trans(vec);
  }

  rotate(angle, origin) {
    this.head.rotate(angle, origin);
    this.tail.rotate(angle, origin);
  }

  scale(mag) {
    this.head.mult(mag);
    this.tail.mult(mag);
  }

  flip() {
    const {
      head,
      tail
    } = this;
    this.head = tail;
    this.tail = head;
  } // ==============================================
  // operations that producing other type of values


  diff() {
    const {
      head,
      tail
    } = this;
    return tail.diff(head);
  }

  len() {
    return this.diff().mag();
  }

  lerp(ratio) {
    const {
      head,
      tail
    } = this;
    return head.lerp(ratio, tail);
  }

  torque() {
    const {
      head,
      tail
    } = this;
    return _Torque__WEBPACK_IMPORTED_MODULE_0__["default"].fromVec(tail.diff(head));
  }

  intersect(that) {
    return TwoSegIntersect(this, that);
  }

  cross() {
    const {
      head,
      tail
    } = this;
    return head.cross(tail);
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
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_List__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
/* harmony import */ var _Torque__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Torque */ "./src/Torque.js");




class Segs extends _List__WEBPACK_IMPORTED_MODULE_0___default.a {
  constructor(...segs) {
    super(...segs);
  }

  static fromVecs(vecs, {
    closed = false
  } = {}) {
    const actualVecs = closed ? vecs.concat(vecs[0]) : vecs;
    let list = actualVecs.diff(([head, tail]) => new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](head, tail));
    return new Segs(...list);
  }

  toVecs() {
    let last;
    let vecs = [];

    for (let {
      head,
      tail
    } of this) {
      if (!head.is(last)) {
        vecs.push(head);
        last = head;
      }

      if (!tail.is(last)) {
        vecs.push(tail);
        last = tail;
      }
    } // for closed segs (polygon), needed to remove the last one


    if (last.is(vecs[0])) {
      vecs.pop();
    }

    return vecs;
  }

  trans(transVec) {
    const vecs = this.toVecs();

    for (let vec of vecs) {
      vec.trans(transVec);
    }
  }

  rotate(angle, origin) {
    const vecs = this.toVecs();

    for (let vec of vecs) {
      vec.rotate(angle, origin);
    }
  }

  scale(ratio, origin) {
    const actualOrigin = origin || this[0].head;
    const vecs = this.toVecs();

    for (let vec of vecs) {
      vec.mult(ratio, actualOrigin);
    }
  }

  flip() {
    this.reverse();

    for (let seg of this) {
      seg.flip();
    }
  }

  area() {
    if (this.length < 3 || this.last().tail !== this[0].head) {
      throw Error('Area can be found from closed segment lists a.k.a polygon');
    }

    const vals = this.map(seg => 0.5 * seg.cross());
    return vals.sum();
  }

  centroid() {
    let area = this.area();
    return this.map(e => {
      const mid = e.lerp(1 / 2);
      mid.mult(e.cross() / (3 * area));
      return mid;
    }).sum();
  }

  lens() {
    let lens = new _List__WEBPACK_IMPORTED_MODULE_0___default.a(0);

    for (let seg of this) {
      lens.push(seg.len());
    }

    return lens;
  }
  /**
   * intersect with a single segment.
   * 
   * returns a list, since even a signle segment could create multiple
   * intersections.
   * @param {Vec} that 
   */


  intersect(that) {
    let intersects = new _List__WEBPACK_IMPORTED_MODULE_0___default.a(0);

    for (let i = 0; i < this.length; i++) {
      const seg = this[i];
      const {
        ratioA: ratioThat,
        ratioB: ratioThis,
        point,
        det
      } = that.intersect(seg);
      intersects.push({
        ratioThis,
        ratioThat,
        point,
        det,
        index: i
      });
    }

    return intersects;
  }
  /**
   * cutEnter
   * make the entrance of a cutting
   * expected to receive the result from intersection.
   * @param {object} param0 
   */


  cutEnter({
    index,
    point
  }) {
    point.setAttr('cutEntrance', true);
    const {
      head,
      tail
    } = this[index]; // remove one, create two.
    // Meanwhile, notice that 

    this.splice(index, 1, new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](head, point), new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](point, tail));
    return {
      index,
      point
    };
  }
  /**
   * cutGoing
   * cutting further from the cut entrance.
   * except the receive the result of cutEnter, or last cutGoing
   * @param {object} param0 
   */


  cutGoing({
    index,
    point
  }) {
    let {
      tail
    } = this[index];
    this.splice(index + 1, 0, new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](tail, point), new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](point, tail));
    return {
      index: index + 1,
      point
    };
  }
  /**
   * cutThrough
   * cutting through the polygon / closed segment list.
   * 
   * By far, the last point of cutting point is the intersection between the cutting path
   * and the polygon, on the exit side, now we need to make the polygon into two.
   * 
   * The result of plain cutting (not considering the cutting path intersect with itself)
   * causes two intersections, and finally split the polygon into two. 
   * 
   * When cutting a polygon, there is an "entrance" segment and an "exit". The issue here is
   * that by the cutting path growing on the polygon, the index of exit segment will grow as
   * well, if its index is greater than the index of entrance segment before cutting.
   * 
   * When cutting through a polygon, if the exit index is greater than the entrance index, then
   * we define the new polygon that doesn't contain the zero-index segment of original polygon
   * the "left one". otherwise the "right one". ASSUME the segments are indexed in CCW manner.
   * 
   *          | Entrance                          | Entrance
   * +--------+-------+  ^               +--------+-------+  
   * |        |       |  | index         |        |       |  
   * |        |       0  | direction     0        |       |  
   * |        |       |  | (CCW)         |        |       |  
   * +--------+-------+  |               +--------+-------+  
   *          | Exit                              | Exit
   *          V                                   V
   * We call the one of the new polygons "parent", if it contains the zero segment index
   * of original polygon, and 'child' for the other. You can imagine the zero segment index
   * 
   */


  cutThrough(enterIndex, exitIndex, point) {
    point.setAttr('cutExit', true);

    if (enterIndex < exitIndex) {
      // in this case, exit index changed along with cutting progress.
      console.log('notch - split - 0');
      const left = this.slice(0, enterIndex + 1).concat(this.slice(exitIndex));
      const right = this.slice(enterIndex, exitIndex);
      return {
        left,
        right
      };
    } else if (enterIndex > exitIndex) {
      console.log('notch - 0 - split');
      const left = this.slice(enterIndex).concat(this.slice(0, exitIndex));
      const right = this.slice(exitIndex, enterIndex);
      return {
        left,
        right
      };
    } else throw Error('its impossible to have same enterIndex and exitIndex when cutting through', enterIndex, exitIndex);
  }

  torque() {
    return _Torque__WEBPACK_IMPORTED_MODULE_3__["default"].sum(this.map(e => e.torque()));
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
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");

class Torque {
  static sum(torques) {
    let prodSum = torques.map(t => t.toProduct()).reduce(({
      x: accX,
      y: accY
    }, {
      x,
      y
    }) => new _Vec__WEBPACK_IMPORTED_MODULE_0__["default"](accX + x, accY + y), new _Vec__WEBPACK_IMPORTED_MODULE_0__["default"]()),
        massSum = torques.map(t => t.mass).reduce((acc, v) => acc + v, 0);
    prodSum.mult(torques.length === 0 ? 0 : 1 / massSum);
    return new Torque({
      center: prodSum,
      mass: massSum
    });
  }

  static fromVec(vec) {
    return new Torque({
      center: new _Vec__WEBPACK_IMPORTED_MODULE_0__["default"]().lerp(0.5, vec),
      mass: vec.mag()
    });
  }

  constructor({
    center = new _Vec__WEBPACK_IMPORTED_MODULE_0__["default"](),
    mass = 0
  } = {}) {
    // console.log("new torque", center, mass)
    this.center = center;
    this.mass = mass;
  }

  toProduct() {
    const {
      center,
      mass
    } = this;
    const copy = center.copy();
    copy.mult(mass);
    return copy;
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
   * Simple Vec class.
   * 
   * @param {any} x 
   * @param {any} y 
   */
  constructor(x, y, attr = {}) {
    if (y === undefined) {
      if (x === undefined) {
        // For nothing given, new vec created
        this.x = 0;
        this.y = 0;
      } else if (x.constructor === Vec) {
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
      } else {
        throw Error(`unsupported argument type:${typeof x}, constructor:${x.constructor.name}`);
      }
    } else {
      this.x = x;
      this.y = y;
    }

    this.attr = attr;
  }

  trans({
    x,
    y
  }, {
    neg = false
  } = {}) {
    if (neg) {
      this.x -= x;
      this.y -= y;
    } else {
      this.x += x;
      this.y += y;
    }
  }

  mult(vec) {
    if (typeof vec === 'number') {
      this.y *= vec;
      this.x *= vec;
    } else if (vec.constructor === Vec) {
      this.x *= vec.x;
      this.y *= vec.y;
    } else {
      throw Error(`invalid parameter type: ${typeof vec}`);
    }
  }

  scale(ratio, about = new Vec(0, 0)) {
    this.trans(about, {
      neg: true
    });
    this.mult(ratio);
    this.trans(about);
  }
  /**
   * # rotate
   * 
   * rotate about 
   * 
   * @param {number} theta angle to rotate in degree.
   */


  rotate(theta, origin = new Vec(0, 0)) {
    this.trans(origin, {
      neg: true
    });
    const {
      x,
      y
    } = this;

    switch (theta) {
      case 90:
        this.x = -y;
        this.y = x;
        break;

      case -90:
        this.x = y;
        this.y = -x;
        break;

      case 180:
      case -180:
        this.x = -x;
        this.y = -y;
        break;

      default:
        let rad = theta / 180 * Math.PI,
            sin = Math.sin(rad),
            cos = Math.cos(rad);
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
    }

    this.trans(origin);
  }

  neg() {
    const {
      x,
      y
    } = this;
    this.x = -x;
    this.y = -y;
  } // ==================================================================
  // creating something new.


  is(vec) {
    return this === vec;
  } // this method should be only used by List.sum method.


  add({
    x,
    y
  }) {
    return new Vec(this.x + x, this.y + y);
  }

  diff({
    x,
    y
  }) {
    return new Vec(this.x - x, this.y - y);
  }

  lerp(ratio, {
    x,
    y
  }) {
    return new Vec(this.x + (x - this.x) * ratio, this.y + (y - this.y) * ratio);
  }
  /**
   * # vector cross product
   * 
   * returns the cross product between this and vec, or is the result of
   * determinant:
   * 
   * |this.x   that.x|
   * |               |
   * |this.y   that.y|
   * 
   * ---
   * 
   * Note: 
   * 1) the cross product conforms to right-hand rule. When A is assigned to
   *    the index finger, and B to middle, then the thumb is pointing to AxB.
   * 
   * 2) When determining of which side does one vector resides on another with
   *    cross product, according to 1), when AxB is positive, B is on the LEFT
   *    of A.
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

  addAttr(attrName, attrValue) {
    this.attr[attrName] = attrValue;
  }
  /**
   * Set attribute to Vec. overwrite existing attributes.
   * @param {object} attrObject 
   */


  setAttr(attrObject) {
    return Object.assign(this.attr, attrObject);
  }
  /**
   * copy: duplicate an object instance of this.
   * @returns {Vec}
   */


  copy() {
    return new Vec(this.x, this.y, JSON.parse(JSON.stringify(this.attr)));
  }

  toString() {
    return `(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`;
  }

}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map