class Segs extends List {
    constructor(vecs){
        let list = new List(vecs.slice(0, -1), vecs.slice(1))
            .zip(e=>new Seg(...e));
        super(...list);
    }

    // torque calculation will be added here.

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
            seg.head.iadd(transVec);
        }
        seg.last().tail.iadd(transVec);
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

    torque(){
        let product = new Vec();
        for (let seg of this){
            product.iadd(seg.torque().toProduct());
        }
        let mass = this.lens().sum();
        let center = product.mult((this.length === 0) ? 0 : 1/mass);

        return new Torque({center, mass});
    }
}

if (!PRODUCTION){
    let len  = 10;
    let vecsCricle = Array(len).fill(0).map((e, i) => (new Vec(i/len*360)).mult(0.5));

    let vecsLine = Array(len).fill(0).map((e, i)=> new Vec( i/(len-1)*0.6 - 0.3, 0) );

    let segs1 = new Segs(vecsCricle),
        segs2 = new Segs(vecsCricle);

    segs1.flip();
    console.assert(segs1[0].head === segs2.last().tail, 'Segs: flip error');

    let segsLine = new Segs(vecsLine);
    // console.log(segsLine.torque().center);
}