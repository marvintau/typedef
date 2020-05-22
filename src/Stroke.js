import Seg from './Seg';
import List from './List';

const EPSILON = 1e-10;

const lt0 = e => e < EPSILON;
const gt0 = e => e > EPSILON;
const lt1 = e => e < 1 - EPSILON;
const gt1 = e => e > 1 - EPSILON;

const intersectCrits = {
    head(t, u){
        return lt0(t) && lt1(u) && gt0(u);
    },
    tail(t, u){
        return gt1(t) && lt1(u) && gt0(u);
    },
    body(t, u){
        return gt0(t) && lt1(t) && gt0(u) && lt1(u);
    }
}

function intersect(cutterSeg, segs, {position='body'}={}){
    
    return segs
        .map((seg, segIndex) => ({res: cutterSeg.intersect(seg), segIndex}))
        .filter(({res:{ratioA, ratioB}}) => intersectCrits[position](ratioA, ratioB))
        .map(({ratioA:ratioCutter, ratioB:ratioCuttee, det}) => ({ratioCutter, ratioCuttee, det}))
        .sort(({ratioA:rP}, {ratioA:rN}) => rN - rP);

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

    cut(cuttee){

        let notchIndex;

        for (let cutter = 0; cutter < this.segs.length; cutter++) nextCutter:{
            const cutterSeg = this.segs[cutter];
            const position = cutter === 0 ? 'head' : cutter === this.segs.length - 1 ? 'tail' : 'body';
            const intersects = intersect(cutterSeg, cuttee, {position});
            
            if (intersects.length === 0) continue;

            // before encountering the cutted polygon
            if (notchIndex === undefined){

                // skip this one;
                if (intersects.length === 0){
                    continue;
                } else {
                    const intersect = position === 'head'
                        ? intersects.pop()
                        : intersects[0];
    
                    const {point:head, segIndex} = intersect;
                    const res = cuttee.cutEnter({index: segIndex, point:head});
                    notchIndex = res.indexGoing;
                }

            } else {

                // means we havent reach the exit yet.
                if (intersect.length === 0){
                    const res = contours[entered].cutGoing({index: notchIndex, point});
                }

            }

            if(entered !== undefined){
                // console.log(entered, contours);
                
                notchPrev += 1;
            }
        }

        return contours;
        // console.log(contours);
   }

}