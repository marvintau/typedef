var PRODUCTION=false;

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
