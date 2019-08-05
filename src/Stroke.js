import Seg from './Seg';
import List from './List';
import Poly from './Poly';

export default class Stroke {
    constructor(segList, closed){
        this.segs = segList;

        if (closed){
            this.closed = true;
            let conn = new Seg(this.segs.last().tail.copy(), this.segs[0].head.copy());
            this.segs.push(conn); 
        }
    }

    draw(ctx, stroke){
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.drawSegs(this.segs);
        ctx.stroke();
    
        ctx.save();
        ctx.fillStyle = "rgb(0, 0, 0, 0.2)";
        for (let [index, seg] of this.segs.entries()){
            if(stroke)
                ctx.text(index, seg.head);
            else
                ctx.point(seg.head);
        }

        ctx.restore();
    }

    cut(poly){

        let entered, notchPrev, splitPrev;

        for (let cutter = 0; cutter < this.segs.length; cutter++) nextCutter:{
            let cutterSeg = this.segs[cutter];

            if(cutter===0){
                let headIntersects = poly.intersectHead(cutterSeg);
                if (headIntersects.length > 0){
                    let {t, con, d} = headIntersects[0];
                    console.log('head', con, t, d);
                    if (d < 0) cutterSeg.head.iadd(cutterSeg.diff().mult(t-0.01));
                }
            }

            if(cutter === this.segs.length - 1){
                let tailIntersects = poly.intersectTail(cutterSeg);
                if (tailIntersects.length > 0){
                    let {t, con, d, p} = tailIntersects[0];
                    if (d > 0) cutterSeg.tail.iadd(p.sub(cutterSeg.tail).mult(t));
                }
            }

            if(entered !== undefined){
                // console.log(entered, contours);
                poly.contours[entered].cutGoing(notchPrev, cutterSeg.head);
                notchPrev += 1;
            }

            // find the intersections bettwen the segment from cutter
            // stroke and from all contours. Sort them by the distance
            // bettwen the intersection to the head of cutter segment.

            // let counter = 5;
            while(true){
                let intersects = poly.intersectSeg(cutterSeg);
                if (intersects.length === 0) break;

                let {u, d, con, seg} = intersects[0];
                if (entered === undefined){
                    console.log('entered', con);
                    entered = con;
                    notchPrev = seg;
                    poly.contours[entered].cutEnter(notchPrev, u);
                } else {

                    splitPrev = seg;
                    if (entered === con) {
                        console.log('cutting through self');
                        poly.contours[entered].cutEnter(splitPrev, u);
                        notchPrev += notchPrev > splitPrev ? 1: 0;
    
                        let [left, right] = poly.contours[entered].cutThrough(notchPrev+1, splitPrev+1);
                        poly.contours.splice(con, 1, left, right);
                    } else {
                        console.log('cutting through ring', con);
                        poly.contours[con].cutEnter(splitPrev, u);
                        poly.contours[entered] = poly.contours[entered].cutThroughRing(notchPrev+1, splitPrev+1, poly.contours[con]);
                        poly.contours.splice(con, 1);
                    }
                    entered = undefined;
                    console.log('contours', poly.contours);
                }    
            }
        }

        // console.log(contours);
   }

}