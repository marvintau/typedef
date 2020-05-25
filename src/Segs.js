import List from './List';
import Seg from './Seg';
import Vec from './Vec';
import Torque from './Torque';

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
        // .filter(({res:{ratioA, ratioB}}) => intersectCrits[position](ratioA, ratioB))
        // .map(({ratioA:ratioCutter, ratioB:ratioCuttee, det}) => ({ratioCutter, ratioCuttee, det}))
        // .sort(({ratioA:rP}, {ratioA:rN}) => rN - rP);

}

export default class Segs extends List {
    constructor(...segs){
        super(...segs);
    }

    static fromVecs(vecs, {closed=false}={}){
        const actualVecs = closed ? vecs.concat(vecs[0]) : vecs;

        let list = actualVecs.diff(([head, tail])=>new Seg(head, tail));
        return new Segs(...list);
    }

    toVecs(){
        let last;
        let vecs = [];
        for (let {head, tail} of this){
            if (!head.is(last)){
                vecs.push(head);
                last = head;
            }
            if (!tail.is(last)){
                vecs.push(tail);
                last = tail;
            }
        }

        // for closed segs (polygon), needed to remove the last one
        if (last.is(vecs[0])){
            vecs.pop();
        }
        return vecs;
    }

    trans(transVec){
        const vecs = this.toVecs();

        for (let vec of vecs){
            vec.trans(transVec);
        }
    }

    rotate(angle, origin){
        const vecs = this.toVecs();
        for (let vec of vecs){
            vec.rotate(angle, origin);
        }
    }

    scale(ratio, origin){
        const actualOrigin = origin || this[0].head;
        const vecs = this.toVecs();
        for (let vec of vecs){
            vec.mult(ratio, actualOrigin);
        }
    }

    flip(){
        this.reverse();
        for (let seg of this){
            seg.flip();
        }
    }

    area(){

        if (this.length < 3 || this.last().tail !== this[0].head){
            throw Error('Area can be found from closed segment lists a.k.a polygon');
        }
        const vals = this.map(seg => 0.5* seg.cross());
        return vals.sum();
    }

    centroid(){
        let area = this.area();

        return this
            .map(e => {
                const mid = e.lerp(1/2);
                mid.mult(e.cross() / (3 * area))
                return mid;
            })
            .sum();
    }

    isClosed() {
        return this.last().tail === this[0].head;
    }

    // to make slicing more intuitive, the slice INCLUDES the element
    // with the end index.
    rotateSlice(start, end) {
        if (start < end) {
            return this.slice(start, end + 1);
        } else if (start === end){
            return this.slice();
        } else if (this.isClosed()){
            return this.slice(start).concat(this.slice(0, end + 1));
        } else {
            return {
                head: this.slice(start),
                tail: this.slice(0, end + 1)
            }
        }
    }

    /**
     * cutEnter
     * make the entrance of a cutting
     * expected to receive the result from intersection.
     * @param {object} param0 
     */
    cutEnter({index, point}){
        
        point.setAttr({cutEntrance: true});
        const {head, tail} = this[index];
        this.splice(index, 1, new Seg(head, point), new Seg(point, tail));

        return {indexGoing:index, point}
    }

    /**
     * cutGoing
     * cutting further from the cut entrance.
     * except the receive the result of cutEnter, or last cutGoing
     * @param {object} param0 
     */
    cutGoing({index, point, points}){
        console.log(points, 'points')
        if (point !== undefined && point.constructor === Vec){
            let {tail} = this[index];
            this.splice(index+1, 0, new Seg(tail, point), new Seg(point, tail));
            return {indexGoing: index+1}
        } else if (Array.isArray(points) && points.every(v => v.constructor === Vec)){
            let i;
            for (i = 0; i < points.length; i++) {
                const {tail} = this[i + index];
                const newPoint = points[i];
                tail.setAttr({cutTip: undefined});
                newPoint.setAttr({cutGoing: true, cutTip: true});
                this.splice(i+index+1, 0, new Seg(tail, newPoint), new Seg(newPoint, tail));
            }
            return {indexGoing: i};
        } else {
            throw Error('您提供的point或points不合适')
        }
    }

    cutThrough(exitIndex){

        const cutTip = this.toVecs().find(({attr:{cutTip}}) => cutTip);

        cutTip.setAttr({cutGoing:undefined, cutTip: undefined, cutExit: true});
        
        const {head, tail} = this[exitIndex];
        this.splice(exitIndex, 1, new Seg(head, cutTip), new Seg(cutTip, tail));

        console.log(this.findIndex, 'findIndex');

        const rightStart = this.findIndex(({head:{attr:{cutExit}},  tail:{attr:{cutGoing}}}) => cutExit   && !cutGoing);
        const rightEnd   = this.findIndex(({head:{attr:{cutGoing}}, tail:{attr:{cutExit}}})  => cutGoing  &&  cutExit );
        const leftStart  = this.findIndex(({head:{attr:{cutExit}},  tail:{attr:{cutGoing}}}) => cutExit   &&  cutGoing);
        const leftEnd    = this.findIndex(({head:{attr:{cutGoing}}, tail:{attr:{cutExit}}})  => !cutGoing &&  cutExit );
        
        console.log(rightStart, rightEnd, leftStart, leftEnd);

        const left = this.rotateSlice(leftStart, leftEnd);
        const right = this.rotateSlice(rightStart, rightEnd);

        return {left, right};
    }

    cut(cuttee){

        let notchIndex;

        for (let cutter = 0; cutter < this.length; cutter++) {
            const cutterSeg = this[cutter];
            const position = cutter === 0 ? 'head' : cutter === this.length - 1 ? 'tail' : 'body';
            const intersects = intersect(cutterSeg, cuttee, {position});
            console.log(intersects, 'intersects');
            // before encountering the cutted polygon
            if (notchIndex === undefined){

                // the current segment hasn't reached polygon edge.
                if (intersects.length === 0) {
                    console.log(`Cutter seg: ${cutter} pos:${position}, not reached yet`);
                    continue
                };

                const intersect = position === 'head'
                    ? intersects.pop()
                    : intersects[0];

                const {point:head, segIndex} = intersect;
                const resHead = cuttee.cutEnter({index: segIndex, point:head});
                notchIndex = resHead.indexGoing;
                const resTail = cuttee.cutGoing({index: notchIndex, point:cutterSeg.tail});
                notchIndex = resTail.indexGoing;

            } else {

                // the whole segment of the stroke is inside the polygon
                if (intersects.length === 0) {
                    const resGoing = polygon.cutGoing({index:notchIndex, point: cutterSeg.tail});
                    notchIndex = resGoing.indexGoing;
                } else {
                    const {point, segIndex}= intersects[0];
                    const resGoing = polygon.cutGoing({index:notchIndex, point});
                }

            }
        }

        return cuttee;
   }

    torque(){
        return Torque.sum(this.map(e => e.torque()));
    }

    copy(){
        // console.log(this);
        let segs = this.map(seg => seg.copy ? seg.copy() : seg);
        for (let i = 0; i < segs.length - 1; i++){
            segs[i].tail = segs[i+1].head;
        }
        return segs;
    }

    toString(){
        return this.map(seg => seg.toString()).join('\n');
    }
}