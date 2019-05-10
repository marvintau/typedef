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
    

    addStroke('heng', new StrokeSpec({id:0, angle: 180, curv:  0.05, shape: 0.35, twist: -1}));
    addStroke('shu',  new StrokeSpec({id:1, angle: -90, curv: 0.02, shape: 0.35, twist: 1}));
    addStroke('dian', new StrokeSpec({id:2, angle: -135, curv: 0.2, ratio:0.5}));
    addStroke('pie',  new StrokeSpec({id:3, angle: -80, curv: 0.3, twist: 1, shape: -0.5}));
    addStroke('gou',  new StrokeSpec({id:4, angle: 30, curv: -0.3, ratio:0.3, twist: 1, shape: -0.5}));
    


    sketch.addStroke(getStroke('heng', {scale: 1.1}));
    sketch.addStroke(getStroke('shu', {rotate: 3}));
    sketch.addStroke(getStroke('gou'));
    sketch.addStroke(getStroke('pie', {rotate : 10, scale : 1.5}));

    sketch.hinge({prevIndex: 0, prevPos: HINGE_END, nextIndex: 1, nextPos: 0});
    sketch.hinge({prevIndex: 1, prevPos: HINGE_END, nextIndex: 2, nextPos: 0});
    sketch.hinge({prevIndex: 0, prevPos: 0.51, nextIndex: 3, nextPos: 0.25});

    sketch.splitByStroke();
    sketch.addStroke(getStroke('dian'), [1]);
    sketch.addStroke(getStroke('dian'), [7]);
    sketch.correctPosition();

    sketch.draw(ctx);
