import List from './List';
import Seg from './Seg';
import Vec from './Vec';
import Torque from './Torque';

export default class Segs extends List {
    constructor(...segs){
        super(...segs);
    }

    conn(){
        for (let i = 0; i < this.length - 1; i++){
            this[i+1].head = this[i].tail;
        }
    }

    area(){
        return this.map(seg => seg.cross()).sum()/2;
    }

    centroid(){
        if (this.length > 0){
            let area = this.area();
            return this
            .map(e => e.head.add(e.tail).mult(e.cross() / (6 * area)))
            .reduce((acc, e) => acc.add(e), new Vec(0, 0));
        } else {
            return undefined;
        }
    }    

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
            console.log('yay', transVec);
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
            lerp = seg.lerp(ratio),
            tail = seg.tail;

        seg.tail = lerp;
        this.splice(notch+1, 0, new Seg(lerp, tail));
    }

    cutGoing(notchPrev, point){
        let seg = this[notchPrev];
        this.splice(notchPrev+1, 0, new Seg(seg.tail, point), new Seg(point, seg.tail.copy()));
        this[notchPrev+2].head = this[notchPrev+1].tail;
    }

    cutThrough(notchPrev, splitPrev){

        let result = [];
        if (notchPrev < splitPrev){
            console.log('notch - split - 0')
            result = [this.slice(notchPrev, splitPrev), this.slice(0, notchPrev+1).concat(this.slice(splitPrev))];
        } else if (notchPrev > splitPrev){
            console.log('notch - 0 - split')
            result = [this.slice(notchPrev).concat(this.slice(0, splitPrev)), this.slice(splitPrev, notchPrev)];
        } else throw Error('its impossible to have same notchPrev and splitPrev', notchPrev, splitPrev);

        return result;
    }

    cutThroughRing(notchPrev, splitPrev, ringSegs){
        let splittedRingSegs = [...ringSegs.slice(splitPrev), ...ringSegs.slice(0, splitPrev+1)];
        return new Segs(...[...this.slice(0, notchPrev+1), ...splittedRingSegs, ...this.slice(notchPrev)]);
    }

    undoCut(){
        let thereIsStillNotch = true;
        while(thereIsStillNotch) next:{
            for (let i = 0; i < this.length-1; i++){
                if (this[i].head.equal(this[i+1].tail) && this[i].tail.equal(this[i+1].head)){
                    console.log(i, 'undo')
                    this.splice(i, 2);
                    console.log(this, this[i-1]);
                    this[i].head = this[i-1].tail;
                    break next;
                }
            }
            thereIsStillNotch = false;
        }
    }

    undoCutThrough(that){
        for (let i = 0; i < this.length; i++){
            for (let j = 0; j < that.length; j++){
                if (this[i].head.equal(that[j].tail) && this[i].tail.equal(that[j].head)){
                    let thatSlice = [...that.slice(j+1), ...that.slice(0, j)];
                    console.log('encountered', thatSlice);
                    this.splice(i+1, ...thatSlice);
                    return;
                }
            }
        }
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
}