import Seg from './Seg';

export default class Stroke {
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