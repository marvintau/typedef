import List from './List';
import Seg from './Seg';

export default class Segs extends List {
    constructor(...segs){
        super(...segs);
    }

    conn(){
        for (let i = 0; i < this.length - 1; i++){
            this[i+1].head = this[i].tail;
        }
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

    cutEnter(notch, ratio){
        
        let seg = this[notch],
            lerp = seg.lerp(ratio);

        seg.tail = lerp;
        this.splice(notch+1, 0, new Seg(lerp, seg.tail));
    }

    cutGoing(notchPrev, point){
        let seg = this[notchPrev];
        this.splice(notchPrev+1, 0, new Seg(seg.tail, point), new Seg(point, seg.tail));
    }

    cutLeave(notchPrev, splitPrev){

        let result = [];
        if (notchPrev < splitPrev){
            console.log('notch - split - 0')
            result = new List(this.slice(notchPrev, splitPrev), this.slice(0, notchPrev+1).concat(this.slice(splitPrev)));
        } else if (notchPrev > splitPrev){
            console.log('notch - 0 - split')
            result = new List(this.slice(notchPrev).concat(this.slice(0, splitPrev)), this.slice(splitPrev, notchPrev));
        } else throw Error('its impossible to have same notchPrev and splitPrev', notchPrev, splitPrev);

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