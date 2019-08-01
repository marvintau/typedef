import List from './List';
import Seg from './Seg';

export default class Poly {
    constructor(contours=(new Segs(0))){
        this.contours = contours;
        this.close();
    }

    close(){
        for (let contour of this.contours){
            console.log(contour);
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
        if (stroke){
            ctx.fillStyle='rgb(0, 0, 0, 0.5)'
            for (let contour of this.contours){
                for (let [index, seg] of contour.entries()){
                    ctx.text(index, seg.head);
                    // ctx.point(seg.head);
                }
            }
        }
        ctx.restore();
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

    cut(cutterStroke){

        let state = 'outside',
            enteredContour,
            notchPrev, splitPrev,
            res = [];

        for (let cutterIndex = 0; cutterIndex < cutterStroke.segs.length; cutterIndex++){
            let cutterSeg = cutterStroke.segs[cutterIndex];

            // this will also include the leaving segment over the stroke, no matter
            // what type of next contour it is (it could be on same contour or not).
            if(state === 'inside'){
                let currContourIndex = enteredContour;
                this.contours[currContourIndex].cutGoing(notchPrev, cutterSeg.head);
                notchPrev += 1;
            }

            // check when multiple contour exists.
            for (let contourIndex = 0; contourIndex < this.contours.length; contourIndex++){
                let currContour = this.contours[contourIndex];

                for (let contourSegIndex = 0; contourSegIndex < currContour.length; contourSegIndex++){
                    let {t, u}= cutterSeg.intersect(currContour[contourSegIndex]);
                    
                    if(t < 1 && t > 0 && u < 1 && u > 0){
    
                        if(state == 'outside'){
                            // if the state is outside, and an intersection between
                            // the cutter segment and polygon contour is detected,
                            // save the current contour index
                            enteredContour = contourIndex;
                            notchPrev = contourSegIndex;
                            currContour.cutEnter(notchPrev, u);
                            state = 'inside';
                            console.log('entered');
                            break;
    
                        } else if (state == 'inside') {

                            // if the current state is inside, and an interdsection is
                            // detected, then we need to discuss whether the cutter has
                            // cut through the shape, or a ring is encountered.

                            if (enteredContour === contourIndex){

                                // we are cutting through the shape.

                                splitPrev = contourSegIndex;
                                currContour.cutEnter(splitPrev, u);
                                notchPrev += notchPrev > splitPrev ? 1 : 0;
                                state = 'outside';

                                let [left, right] = currContour.cutThrough(notchPrev+1, splitPrev+1);

                                return [
                                    new Poly(new List(left)),
                                    new Poly(new List(right))
                                ];
                        
                            } else {

                                // cutting a different contour, which means we encounter
                                // a ring.

                                splitPrev = contourSegIndex;
                                currContour.cutEnter(splitPrev, u);
                                state = 'outside';

                                let res = this.contours[enteredContour].cutThroughRing(notchPrev+1, splitPrev+1, currContour);
                                return [new Poly(new List(res))];
                            }

                        }
                    }
                }
        
            }
        }

    }
}

