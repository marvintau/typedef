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

    cut(poly){

        let state = 'outside',
            enteredContour,
            notchPrev, splitPrev,
            candidates = [poly],
            res = [];

        while(candidates.length > 0) polygonCandidateIteration : {
            console.log(candidates.length);
            let currPoly = candidates.pop();

            for (let cutterIndex = 0; cutterIndex < this.segs.length; cutterIndex++){
                let cutterSeg = this.segs[cutterIndex];
    
                // this will also include the leaving segment over the stroke, no matter
                // what type of next contour it is (it could be on same contour or not).
                if(state === 'inside'){
                    let currContourIndex = enteredContour;
                    currPoly.contours[currContourIndex].cutGoing(notchPrev, cutterSeg.head);
                    notchPrev += 1;
                }
    
                // check when multiple contour exists.
                for (let contourIndex = 0; contourIndex < currPoly.contours.length; contourIndex++){
                    let currContour = currPoly.contours[contourIndex];
    
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
    
                                    candidates.push(
                                        new Poly(new List(left)),
                                        new Poly(new List(right))
                                    );
                                    break polygonCandidateIteration;
                            
                                } else {
    
                                    // cutting a different contour, which means we encounter
                                    // a ring.
    
                                    splitPrev = contourSegIndex;
                                    currContour.cutEnter(splitPrev, u);
                                    state = 'outside';
    
                                    let res = poly.contours[enteredContour].cutThroughRing(notchPrev+1, splitPrev+1, currContour);
                                    candidates.push(new Poly(new List(res)));
                                    break polygonCandidateIteration;
                                }
    
                            }
                        }
                    }
            
                }
            }
    
            res.push(currPoly);

        }

        console.log("reached here");
        return res;
    }

}