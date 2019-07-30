import List from './List';
import Seg from './Seg';

export default class Segs extends List {
    constructor(...segs){
        super(...segs);
    }

    // torque calculation will be added here.

    fromVecs(vecs){
        let list = new List(vecs.slice(0, -1), vecs.slice(1))
        .zip(e=>new Seg(...e));

        while(list.length > 0){
            this.push(list.pop());
        }
        this.reverse();
        return this;
    }

    flip(){
        this.reverse();
        for (let seg of this){
            seg.reverse();
        }
    }

    lens(){
        let lens = new List(0);
        for (let seg of this){
            lens.push(seg.len());
        }
        return lens;
    }

    intersect(other){
        let intersects = new List(0)
        for (let seg of this){
            intersects.push(other.intersect(seg));
        }
    }

    partialSums(component){
        let sum = [];
        for (let seg of this){
            sum.push(seg.head[component]+seg.tail[component]);
        }
        return sum;
    }

    crosses(){
        let crosses = [];
        for(let seg of this){
            crosses.push(seg.head.cross(seg.tail))
        }
    }

    trans(transVec){
        for (let seg of this){
            console.log('yay');
            seg.head.iadd(transVec);
        }
        this.last().tail.iadd(transVec);
    }

    rotate(angle){
        let headOffset = this[0].head.copy();
        this.trans(headOffset.neg());
        for (let seg of this){
            seg.tail.irotate(angle);
        }
        this.trans(headOffset);
    }

    scale(ratio){
        let headOffset = this.segs[0].head.copy();
        this.trans(headOffset.neg());
        for (let seg of this){
            seg.tail.imult(ratio);
        }
        this.trans(headOffset);
    }

    pointAt(ratio){
        let lens = this.lens(),
            accum = lens.accum(),
            given = accum.last() * ratio;

        var ithSeg = 0,
            lenInSeg = 0;
        for (let [index, len] of accum.entries()){
            if (given < len) {
                ithSeg = index - 1;
                lenInSeg = len - given;
                break;
            }
        }

        return {
            point: this[ithSeg].lerp(1 - lenInSeg/lens[ithSeg]),
            tan: this[ithSeg].dir()
        };
    }

    cutEnter(ithSeg, ratio){
        let seg = this[ithSeg],
            lerp = seg.lerp(ratio),
            succ = new Seg(lerp, seg.tail);

        seg.tail = lerp;
        this.splice(ithSeg+1, 0, succ);
        console.log(this, 'cutpoint');
    }

    cutGoing(ithSeg, point){
        let seg = this[ithSeg];
        this.splice(ithSeg, 0, new Seg(seg.head, point), new Seg(point, seg.head));
    }

    cutLeave(notchTip, ithSeg, ratio){

        // 1. the leaving point is created over the ith segment
        //    by this moment, the tail of the ith seg or the head
        //    of the ith+1 seg is the leaving point.
        this.cutEnter(ithSeg, ratio);
        // 2. make the current notch tip reach the leaving point
        //    NOTE that the actual tip point is the tail of notchTip.
        this.cutGoing(notchTip, this[ithSeg].tail);

        let result = new List(this.slice(notchTip+1, ithSeg+3), this.slice(1, notchTip+1).concat(this.slice(ithSeg+3)));
        return result;
    }

    torque(){
        let product = new Vec();
        for (let seg of this){
            product.iadd(seg.torque().toProduct());
        }
        let mass = this.lens().sum();
        let center = product.mult((this.length === 0) ? 0 : 1/mass);

        return new Torque({center, mass});
    }

    copy(){
        // console.log(this);
        let segs = this.map(seg => seg.copy ? seg.copy() : seg);
        for (let i = 0; i < segs.length - 1; i++){
            segs[i].tail = segs[i+1].head;
        }
        return segs;
    }
}