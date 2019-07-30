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

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var HINGE_END = 0.999999,
    HINGE_SUCC = {
  by: 0,
  at: HINGE_END
};
var STROKE_COUNTER = 0;
let strokes = [],
    specSketch = {};

function addStroke(strokeName, strokeSpec) {
  strokes[strokeName] = strokeSpec;
}

function getStroke(strokeName, {
  scale,
  rotate
} = {}) {
  let stroke = strokes[strokeName].copy();
  stroke.id = `${STROKE_COUNTER}-${strokeName}`;
  return stroke.scale(scale).rotate(rotate);
}

let editorElement = document.getElementById('editor');
console.log('yay'); // let editor = new Editor(editorElement, submitFunc);
// let n = 10
// let randomVecList = Array(n).fill(0).map((e, i) => (new Vec(i/n*360)).mult(0.5));
// let stroke = new Stroke(toSegs(randomVecList), true);
// stroke.rotate(10)
// stroke.trans(new Vec(0.2, 0.0))
// stroke.draw(ctx);
// function addDictionaryStrokes(list){
//     for (let entry of list){
//         let {name, ...spec} = entry;
//         addStroke(name, new StrokeSpec(spec));
//     }
// }
// let list = [
//     {name: 'heng', id:0, angle: 180, curv:  0.05, shape: 0.35, twist: -1},
//     {name: 'shu',  id:1, angle: -90, curv: 0.02, shape: 0.35, twist: 1},
//     {name: 'dian', id:2, angle: -135, curv: 0.2, ratio:0.5},
//     {name: 'pie',  id:3, angle: -80, curv: 0.3, twist: 1, shape: -0.5},
//     {name: 'gou',  id:4, angle: 30, curv: -0.3, ratio:0.3, twist: 1, shape: -0.5},
// ]
// addDictionaryStrokes(list);
// let variables = {
//     hengScale: {val: 1.0, min: 0.9, max: 1.1, def: 1.0}
// }
// let program = [
//     {opname: 'addStroke', name:'shu'},
//     {opname: 'splitByStroke'},
//     {opname: 'addStroke', name:'shu', path:[1]},
// ]
// sketch.exec(program);
// sketch.draw(ctx);

/***/ })

},[["./src/Main.js","manifest"]]]);
});
//# sourceMappingURL=8f3cdd9b2732a137bb3b.js.map