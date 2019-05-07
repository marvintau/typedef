class Stroke {
    constructor(vecList){
        this.vecs = vecList;
        
        for(let v of this.vecs) if (v.attr.type != "S"){
            v.attr.type = "S";
        }
    }

    trans(transVec){
        for (let vec of this.vecs){
            vec.iadd(transVec);
        }
    }

    rotate(angle){
        for (let i = 1; i < this.vecs.length; i++){
            this.vecs[i].isub(this.vecs[0]);
            this.vecs[i].irotate(angle);
            this.vecs[i].iadd(this.vecs[0]);
        }
    }

    scale(ratio){
        this.vecs = toSegs(this.vecs)
            .map(seg => seg.diff().mult(ratio))
            .reduce((acc, val) => acc.concat(acc.last().add(val)), this.vecs[0]);
    }

    pointAt(ratio){
        let segs = toSegs(this.vecs),
            lens = segLengths(segs),
            accum = lens.reduce((acc, x) => acc.concat(acc.last() + x), [0]),
            total = accum.last(),
            given = total * ratio;

        var ithSeg = 0,
            lenInSeg = 0;
        for (let [index, len] of accum.entries()){
            if (given < len) {
                ithSeg = index - 1;
                lenInSeg = len - given;
                break;
            }
        }
        console.log(ithSeg);

        return segs[ithSeg].lerp(1 - lenInSeg/lens[ithSeg]);
    }

    torque(){
        return torqueSum(toSegs(this.vecs).map(s => s.torque()));
    }

    splitBound(polyList){
    
        let actualPolyList = polyList.concat(polyList[0].copy()),
            lineSegs = toSegs(this.vecs),
            polySegs = toSegs(actualPolyList);
        
        let enter, leave,
            intersection = [];
    
        // var seg;
        // while (lineSegs.length > 0){
            // seg = lineSegs.shift()[0];
        for (let [segIndex, seg] of lineSegs.entries()){
            // 1. After handling the first intersection, and there are remaining
            //    segs, we put the first one;
            if(enter !== undefined){
                intersection.push(seg.head);
            }
            // 2. Handles if the rest segments of line crosses the edge of
            //    the polygon. If the entering index is not marked, then 
            //    marked, or mark the leaving index;
            for (let [index, edge] of polySegs.entries()){
                let {t, u, p} = seg.cross(edge);
    
                if(u > 0 && u < 1 && (segIndex === 0 || t > 0) && (segIndex == lineSegs.length - 1 || (t < 1))){
                    if(enter === undefined){
                        intersection.push(p);
                        enter = index;
                    } else if (leave === undefined){
                        intersection.push(p);
                        leave = index;
                        break;
                    }
                }
            }
    
            // 3. if both the entering and leaving are marked, then break the
            //    loop and exit.
            if((enter !== undefined) && (leave !== undefined)){
                break;
            }
    
        }
    
        if (enter < leave) {
            intersection.reverse();
        } else {
            [enter, leave] = [leave, enter];
        }
    
        let left  = actualPolyList.slice(enter+1, leave + 1).concat(intersection.map(e=>e.copy())),
            right = actualPolyList.slice(1, enter+1).concat(intersection.reverse()).concat(actualPolyList.slice(leave+1));
    
        return {left, right};
    }

    draw(ctx){
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.drawZig(this.vecs);
        ctx.stroke();
    
        ctx.save();
        ctx.fillStyle = "black";
        for (let [index, vec] of this.vecs.entries()){
            ctx.text(index, vec);
        }

        // for (let vec of this.sample()){
        //     console.log(vec);
        //     ctx.point(vec);
        // }
        ctx.restore();
    }
}