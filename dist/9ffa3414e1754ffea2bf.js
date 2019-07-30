(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["start-webpack-conf"] = factory();
	else
		root["start-webpack-conf"] = factory();
})(window, function() {
return (window["webpackJsonpstart_webpack_conf"] = window["webpackJsonpstart_webpack_conf"] || []).push([["main"],{

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
        ratio = this.canvas.height / dpr;
    this.beginPath();
    this.arc(v.x * ratio, v.y * ratio, 3, 0, Math.PI * 2);
    this.stroke();
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

CanvasRenderingContext2D.prototype.text = function (text, vec) {
  if (vec != undefined) {
    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height / 2 / dpr;
    this.fillText(text, vec.x * ratio, vec.y * ratio);
  }
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

/***/ "./src/Configure.js":
/*!**************************!*\
  !*** ./src/Configure.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var PRODUCTION = false;
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
/* harmony import */ var _Configure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Configure */ "./src/Configure.js");
/* harmony import */ var _Configure__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Configure__WEBPACK_IMPORTED_MODULE_1__);



/***/ })

},[["./src/Main.js","manifest"]]]);
});
//# sourceMappingURL=9ffa3414e1754ffea2bf.js.map