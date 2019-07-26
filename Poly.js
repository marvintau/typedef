
class Poly {
    constructor(contours=(new List(0))){
        this.contours = contours;

        for (let contour of this.contours){
            let conn = new Seg(contour.last().tail.copy(), contour[0].head.copy());
            contour.push(conn); 
        }
    }

    draw(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle='rgb(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.drawContours(this.contours);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.fillStyle='rgb(0, 0, 0, 0.5)'
        for (let contour of this.contours){
            for (let [index, seg] of contour.entries()){
                ctx.text(index, seg.head);
            }
        }
        ctx.restore();
    }
}

if(!PRODUCTION){
    let len  = 19, range = 5;
    let vecsCircles = new List(0);
    for (let r = 0; r < 6; r++){

        let vecs = Array(len).fill(0).map((e, i) => (new Vec(i/(len)*360)).mult(0.8 * (r+1) / range));

        vecsCircles.push(new Segs(vecs));

        if(r % 2 === 1){
            console.log(vecsCircles[r]);
            vecsCircles[r].flip();
        }
    }

    let poly = new Poly(vecsCircles);
    console.log(poly)
    poly.draw(ctx);
}