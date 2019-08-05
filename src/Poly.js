import List from './List';
import Seg from './Seg';

export default class Poly {
    constructor(contours=(new Segs(0))){
        this.contours = contours;
        this.close();
    }

    close(){
        for (let contour of this.contours){
            // console.log(contour);
            if(!contour.last().tail.equal(contour[0].head)){
                let conn = new Seg(contour.last().tail, contour[0].head);
                contour.push(conn); 
            } else {
                contour.last().tail = contour[0].head;
            }
        }
    }

    copy(){
        let poly = new Poly(this.contours.copy());
        // poly.close();
        return poly;
    }

    trans(vec){
        for (let contour of this.contours){
            contour.trans(vec);
            contour.last().tail.iadd(vec.neg());
        }
    }

    draw(ctx, stroke, color='rgb(0, 0, 0, 0.1)'){
        ctx.strokeStyle = 'black';
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.drawContours(this.contours);
        ctx.fill();
        if(stroke)
        ctx.stroke();

        ctx.save();
        ctx.fillStyle='rgb(0, 0, 0, 0.2)'
        for (let contour of this.contours){
            for (let [index, seg] of contour.entries()){
                if(stroke)
                    ctx.text(index, seg.head);
                else
                    ctx.point(seg.head);
            }
        }
        ctx.restore();
    }

    // return intersections between all contours of poly, and
    // the given seg, sorted by t parameter.
    intersectSeg(cutterSeg){
        let intersects = [];
        let EPSILON = 1e-10;

        for (let con = 0; con < this.contours.length; con++){
            let segs = this.contours[con];
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

    intersectHead(cutterSeg){
        let intersects = [];
        let EPSILON = 1e-10;

        for (let con = 0; con < this.contours.length; con++){
            let segs = this.contours[con];
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

    intersectTail(cutterSeg){
        let intersects = [];
        let EPSILON = 1e-10;

        for (let con = 0; con < this.contours.length; con++){
            let segs = this.contours[con];
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

    shrink(shrink){

        let bisecs = new List(0);
        for (let contour of this.contours){
            bisecs.push([]);
            for (let i = 0; i < contour.length; i++){
                let last = (i === 0) ? contour.length - 1 : i - 1;
                let bisec = contour[last].angleBisect(contour[i]);
                bisecs.last().push(bisec.mult(shrink));
            }
        }

        for (let i = 0; i < this.contours.length; i++){
            let contour = this.contours[i];
            for (let j = 0; j < contour.length; j++){
                contour[j].head.iadd(bisecs[i][j]);
            }
        }
    }

}

