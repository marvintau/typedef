import Seg from './Seg';

function intersectHead(cutterSeg, contours){
    let intersects = [];
    let EPSILON = 1e-10;

    for (let con = 0; con < contours.length; con++){
        let segs = contours[con];
        for (let seg = 0; seg < segs.length; seg++){
            let {t, u, d} = cutterSeg.intersect(segs[seg]);
            if ( t < EPSILON && u < 1-EPSILON && u > EPSILON ){
                intersects.push({t, u, d, con, seg});
            }
        }
    }
    intersects.sort((a, b) => b.t - a.t)
    // console.log(intersects, 'headIntersects')
    return intersects;
}

function intersectTail(cutterSeg, contours){
    let intersects = [];
    let EPSILON = 1e-10;

    for (let con = 0; con < contours.length; con++){
        let segs = contours[con];
        for (let seg = 0; seg < segs.length; seg++){
            let {t, u, p, d} = cutterSeg.intersect(segs[seg]);
            if ( t > 1 - EPSILON && u < 1-EPSILON && u > EPSILON ){
                intersects.push({t, u, p, d, con, seg});
            }
        }
    }
    intersects.sort((a, b) => a.t - b.t)
    // console.log(intersects, 'tailIntersects')
    return intersects;
}

// return intersections between all contours of poly, and
// the given seg, sorted by t parameter.
function intersectSeg(cutterSeg, contours){
    let intersects = [];
    let EPSILON = 1e-10;

    for (let con = 0; con < contours.length; con++){
        let segs = contours[con];
        for (let seg = 0; seg < segs.length; seg++){
            let {t, u, d} = cutterSeg.intersect(segs[seg]);
            if ( t < 1-EPSILON && t > EPSILON && u < 1-EPSILON && u > EPSILON ){
                intersects.push({t, u, d, con, seg});
            }
        }
    }
    intersects.sort((a, b) => a.t - b.t)
    
    return intersects;
}

export default class Stroke {
    constructor(segList, closed){
        this.segs = segList;

        if (closed){
            this.closed = true;
            let conn = new Seg(this.segs.last().tail.copy(), this.segs[0].head.copy());
            this.segs.push(conn); 
        }
        
        this.displayed = this.segs.copy();
    }

    trans(vec){
        this.segs.trans(vec);
        this.displayed = this.segs.copy();
    }

    joint(that, {thisPos, thatPos}){
        if (thisPos === 1){
            this.segs.push(...(thatPos === 0 ? that.segs : that.segs.reverse()));
        } else if (thisPos === 0){
            this.segs.unshift(...(thatPos === 0 ? that.segs : that.segs.reverse()));
        }
        this.displayed = this.segs.copy();
    }

    draw(ctx, stroke){
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.drawSegs(this.displayed);
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

    center(){
        return this.segs.torque().center;
    }

    cut(contours){

        let entered, notchPrev, splitPrev;

        for (let cutter = 0; cutter < this.segs.length; cutter++) nextCutter:{
            let cutterSeg = this.segs[cutter];

            if(cutter===0){
                let headIntersects = intersectHead(cutterSeg, contours);
                if (headIntersects.length > 0){
                    let {t, con, d} = headIntersects[0];
                    console.log('head', con, t, d);
                    if (d < 0) cutterSeg.head.iadd(cutterSeg.diff().mult(t-0.01));
                }
            }

            if(cutter === this.segs.length - 1){
                let tailIntersects = intersectTail(cutterSeg, contours);
                if (tailIntersects.length > 0){
                    let {t, con, d, p} = tailIntersects[0];
                    if (d > 0) cutterSeg.tail.iadd(p.sub(cutterSeg.tail).mult(t));
                }
            }

            if(entered !== undefined){
                // console.log(entered, contours);
                contours[entered].cutGoing(notchPrev, cutterSeg.head);
                notchPrev += 1;
            }

            // find the intersections bettwen the segment from cutter
            // stroke and from all contours. Sort them by the distance
            // bettwen the intersection to the head of cutter segment.
            while(true){
                let intersects = intersectSeg(cutterSeg, contours);
                if (intersects.length === 0) break;

                let {u, d, con, seg} = intersects[0];
                if (entered === undefined){
                    console.log('entered', con);
                    entered = con;
                    notchPrev = seg;
                    contours[entered].cutEnter(notchPrev, u);
                } else {

                    splitPrev = seg;
                    if (entered === con) {
                        console.log('cutting through self');
                        contours[entered].cutEnter(splitPrev, u);
                        notchPrev += notchPrev > splitPrev ? 1: 0;
    
                        let [left, right] = contours[entered].cutThrough(notchPrev+1, splitPrev+1);
                        contours.splice(con, 1, left, right);
                    } else {
                        console.log('cutting through ring', con);
                        contours[con].cutEnter(splitPrev, u);
                        contours[entered] = contours[entered].cutThroughRing(notchPrev+1, splitPrev+1, contours[con]);
                        contours.splice(con, 1);
                    }
                    entered = undefined;
                    // console.log('contours', contours);
                }    
            }
        }

        return contours;
        // console.log(contours);
   }

}