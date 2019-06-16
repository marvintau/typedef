var HINGE_END = 0.999999,
    HINGE_SUCC = {by: 0, at: HINGE_END};

var STROKE_COUNTER = 0;

let strokes = [],
    specSketch = {};

function addStroke(strokeName, strokeSpec){
    strokes[strokeName] = strokeSpec;
}

function getStroke(strokeName, {scale, rotate} = {}){
    let stroke = strokes[strokeName].copy();
    stroke.id = `${STROKE_COUNTER}-${strokeName}`;

    return stroke.scale(scale).rotate(rotate);
}

let sketch = new Radical([new Vec(0.89, 0.89), new Vec(-0.89, 0.89), new Vec(-0.89, -0.89), new Vec(0.89, -0.89)]);

let submitFunc = function(text) {

    let textlines = text.split(';');

    for (let expr of textlines) {
        let tokens = expr.trim().split(/[\s\n]+/);
        console.log(tokens);
        tokenExec(tokens);
    }

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    // Will always clear the right space
    ctx.clearRect(0, 0, dpr*ctx.canvas.width, dpr*ctx.canvas.height);
    ctx.restore();

    // ctx.draw();
}

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    dpr = window.devicePixelRatio;
canvas.width  = 400 * dpr;
canvas.height = 400 * dpr;
canvas.style.width  = 400;
canvas.style.height = 400;
document.getElementById('canvas-container').appendChild(canvas);
ctx.translate(canvas.width/2, canvas.height/2);
ctx.scale(dpr, dpr);

let editorElement = document.getElementById('editor');
// let editor = new Editor(editorElement, submitFunc);

function addDictionaryStrokes(list){
    for (let entry of list){
        let {name, ...spec} = entry;
        addStroke(name, new StrokeSpec(spec));
    }
}

let list = [
    {name: 'heng', id:0, angle: 180, curv:  0.05, shape: 0.35, twist: -1},
    {name: 'shu',  id:1, angle: -90, curv: 0.02, shape: 0.35, twist: 1},
    {name: 'dian', id:2, angle: -135, curv: 0.2, ratio:0.5},
    {name: 'pie',  id:3, angle: -80, curv: 0.3, twist: 1, shape: -0.5},
    {name: 'gou',  id:4, angle: 30, curv: -0.3, ratio:0.3, twist: 1, shape: -0.5},
]

addDictionaryStrokes(list);

let variables = {
    hengScale: {val: 1.1, min: 1.0, max: 1.2, def: 1.1}
}

let program = [
    {opname: 'addStroke', name:'heng', scale: variables['hengScale'].val},
    {opname: 'addStroke', name:'shu', rotate: 3},
    {opname: 'addStroke', name:'gou'},
    {opname: 'addStroke', name:'pie', rotate : 10, scale : 1.5},
    {opname: 'hinge', prevIndex: 0, prevPos: HINGE_END, nextIndex: 1, nextPos: 0},
    {opname: 'hinge', prevIndex: 1, prevPos: HINGE_END, nextIndex: 2, nextPos: 0},
    {opname: 'hinge', prevIndex: 0, prevPos: 0.51, nextIndex: 3, nextPos: 0.25},
    {opname: 'splitByStroke'},
    {opname: 'addStroke', name:'dian', path:[1]},
    {opname: 'addStroke', name:'dian', path:[7]},
    {opname: 'correctPosition'},
]

sketch.exec(program);

sketch.draw(ctx);
