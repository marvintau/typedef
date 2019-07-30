import './CanvasExtend';

import Vec from './Vec';
import List from './List';
import Segs from './Segs';
import Poly from './Poly';
import Stroke from './Stroke';

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

function testPoly(){
    let len  = 19, range = 5;
    let vecsCircles = new List(0);
    for (let r = 0; r < 6; r++){

        let vecs = Array(len).fill(0).map((e, i) => (new Vec(i/(len)*360)).mult(0.8 * (r+1) / range));

        vecsCircles.push((new Segs(0)).fromVecs(vecs));

        if(r % 2 === 1){
            console.log(vecsCircles[r]);
            vecsCircles[r].flip();
        }
    }

    let poly = new Poly(vecsCircles),
        polyCopy = poly.copy();
    console.log(poly)
    poly.shrink(0.05, ctx);
    // polyCopy.draw(ctx);
    // poly.draw(ctx);
}
testPoly();

function testStroke(){
    let len  = 15;
    let vecsCricle = Array(len).fill(0).map((e, i) => (new Vec(i/(len)*360)).mult(0.5));
    let vecsLine = Array(len).fill(0).map((e, i)=> new Vec( i/(6-1)*2 - 1, 0.3) );

    let stroke1 = new Stroke((new Segs(0)).fromVecs(vecsCricle), true),
        stroke2 = new Stroke(new Segs(0).fromVecs(vecsLine));

    let enter = 3;
    stroke1.segs.cutEnter(enter, 0.5);
    stroke1.segs.cutGoing(enter+1, new Vec(0, 0));
    stroke1.segs.cutGoing(enter+2, new Vec(-0.1, 0));
    let cuts = stroke1.segs.cutLeave(enter+3, 15, 0.5);
    console.log(cuts[0].map(e=>e.head),'cutresult');
    let poly1 = new Poly(new List(cuts[0])),
        poly2 = new Poly(new List(cuts[1]));


    poly1 = poly1.copy();
    poly2 = poly2.copy();
    // poly1.shrink(0.5);
    // poly2.shrink(0.5);
    // poly1.trans(new Vec(0.1, -0.1));
    poly2.trans(new Vec(0.1, -0.2));

    poly1.draw(ctx, true);
    poly2.draw(ctx, true);

    // stroke1.draw(ctx);
    // stroke2.draw(ctx);

    // segs1.flip();
    // console.assert(segs1[0].head === segs2.last().tail, 'Segs: flip error');

    let segsLine = new Segs(vecsLine);
    // console.log(segsLine.torque().center);
}
testStroke();