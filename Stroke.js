class Stroke {
    constructor(segList, closed){
        this.segs = segList;

        if (closed){
            this.closed = true;
            let conn = new Seg(this.segs.last().tail.copy(), this.segs[0].head.copy());
            this.segs.push(conn); 
        }
    }

    draw(ctx){
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.drawSegs(this.segs);
        ctx.stroke();
    
        ctx.save();
        ctx.fillStyle = "black";
        for (let [index, seg] of this.segs.entries()){
            ctx.text(index, seg.head);
        }

        ctx.restore();
    }
}

if (!PRODUCTION){
    let len  = 19;
    let vecsCricle = Array(len).fill(0).map((e, i) => (new Vec(i/(len)*360)).mult(0.5));
    let vecsLine = Array(len).fill(0).map((e, i)=> new Vec( i/(len)*2 - 1, 0.3) );

    let stroke1 = new Stroke(new Segs(vecsCricle), true),
        stroke2 = new Stroke(new Segs(vecsLine));

    console.log(stroke1);

    // stroke1.draw(ctx);
    stroke2.draw(ctx);

    // segs1.flip();
    // console.assert(segs1[0].head === segs2.last().tail, 'Segs: flip error');

    let segsLine = new Segs(vecsLine);
    console.log(segsLine.torque().center);
}