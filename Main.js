var CROSS_END = 0.999999,
    CROSS_SUCC = {by: 0, at: CROSS_END};

let strokes = [];

    function addStroke(strokeName, strokeSpec){
        strokes[strokeName] = strokeSpec;
    }

    function getStroke(strokeName){
        return strokes[strokeName].copy();
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
    
    addStroke('heng', new StrokeSpec({angle: 180, curv:  0.05, shape: 0.35, twist: -1}));
    addStroke('shu',  new StrokeSpec({angle: -90, curv: 0.02, shape: 0.35, twist: 1}));
    addStroke('dian', new StrokeSpec({angle: 45, curv: -0.2, ratio:0.5}));
    addStroke('pie',  new StrokeSpec({angle: -80, curv: 0.3, twist: 1, shape: -0.5}));
    addStroke('gou',  new StrokeSpec({ratio:0.3, angle: 30, curv: -0.3, twist: 1, shape: -0.5}));
    
    sketch.addStroke(getStroke('heng'), {})
    sketch.addStroke(getStroke('shu'), {cross : CROSS_SUCC, rotate: 3})
    sketch.addStroke(getStroke('gou'), {cross : CROSS_SUCC});
    sketch.addStroke(getStroke('pie'), {
        cross : {by : 0.25, at : 0.5, to: 0},
        rotate : 10,
        scale : 1.5
    })

    sketch.splitByStroke();
    sketch.addStroke(getStroke('dian'), {}, [1]);
    sketch.addStroke(getStroke('dian'), {}, [7]);
    sketch.correctPosition();
    // console.log(sketch.allDescendants(), sketch.transAllStrokes());

    sketch.draw(ctx);
