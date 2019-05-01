let strokes = [];

    function addStroke(strokeName, strokeSpec){
        strokes[strokeName] = strokeSpec;
    }

    function getStroke(strokeName){
        return strokes[strokeName];
    }

    let sketch = new Bound([new Vec(0.89, 0.89), new Vec(-0.89, 0.89), new Vec(-0.89, -0.89), new Vec(0.89, -0.89)]);

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
    addStroke('shu',  new StrokeSpec({angle: -90, curv: 0.05, shape: 0.35, twist: 1}));
    addStroke('dian', new StrokeSpec({angle: 45, curv: -0.2, ratio:0.5}));

    addStroke('hengzhe', new StrokeSpec(getStroke('heng').toSpec()));
    getStroke('hengzhe').addFrag(getStroke('shu').toSpec());

    sketch.addStroke(getStroke('hengzhe'), {})
    sketch.addStroke(getStroke('shu'), {cross:{by:0.5, at:0.25}})
    sketch.splitByStroke();

    // sketch.addStroke(getStroke('shu'), {splitting: true})
    // sketch.getChildByPath([0]).addStroke(getStroke('dian'), {splitting: true});

    // let points = sketch.strokes[0].sample(0.05);
    // for (let point of points){
    //     ctx.point(point);
    // }

    ctx.point(sketch.strokes[0].pointAt(0.25));

    sketch.draw(ctx);
