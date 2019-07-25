class Stroke {
    constructor(segList, closed){
        this.segs = segList;

        if (closed){
            this.closed = true;
            let conn = new Seg(this.segs.last().tail.copy(), this.segs[0].head.copy());
            this.segs.push(conn); 
        }
    }

    trans(transVec){
        for (let seg of this.segs){
            seg.trans(transVec);
        }
    }

    rotate(angle){
        let headOffset = this.segs[0].head.copy().mult(1);
        for (let i = 0; i < this.segs.length; i++){
            let seg = this.segs[i];
            seg.trans(headOffset.neg());
            seg.rotate(angle);
            seg.trans(headOffset);
        }

    }

    scale(ratio){
        let headOffset = this.segs[0].head.copy();
        for(let seg of this.segs){
            seg.trans(headOffset);
            seg.scale(ratio);
            seg.trans(headOffset.neg());
        }
    }

    pointAt(ratio){
        let lens = segLengths(this.segs),
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

        return {
            point: this.segs[ithSeg].lerp(1 - lenInSeg/lens[ithSeg]),
            tan: this.segs[ithSeg].dir()
        };
    }

    torque(){
        return torqueSum(this.segs.map(s => s.torque()));
    }

    splitBound(polyList){
    
        let actualPolyList = polyList.concat(polyList[0].copy()),
            lineSegs = toSegs(this.vecs),
            polySegs = toSegs(actualPolyList);
        
        let enter, leave,
            intersection = [];
    
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
        ctx.drawZig(this.segs);
        ctx.stroke();
    
        ctx.save();
        ctx.fillStyle = "black";
        for (let [index, seg] of this.segs.entries()){
            ctx.text(index, seg.head);
        }

        ctx.restore();
    }

    centric(stroke){

        let prev = this.pointAt(0.5),
            succ = stroke.pointAt(0.5);

        return {
            prev : prev.point.sub(succ.point).cross(succ.tan),
            succ : succ.point.sub(prev.point).cross(prev.tan)
        }

    }
}