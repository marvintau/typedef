
Array.prototype.sum = function(){
    return this.reduce((acc, n) => acc + n, 0);
}

function toSegs(vecList){
    let most = vecList.slice(0, -1),
        rest = vecList.slice(1);

    let segs = [];
    while(most.length > 0){
        segs.push([most.pop(), rest.pop()]);
    }
    segs.reverse();
    return segs;
}

function toPolyArea(polySegs){
    return polySegs.map(seg => seg[0].cross(seg[1])).sum()/2;
}

function toPolyCentroid(vecList){
    let polySegs = toSegs(vecList.concat(vecList[0].copy())),
        polyArea = toPolyArea(polySegs),
        xPairSums = polySegs.map(seg => seg[0].x + seg[1].x),
        yPairSums = polySegs.map(seg => seg[0].y + seg[1].y),
        crosses = polySegs.map(seg => seg[0].cross(seg[1]));
    
    let centroid = new Vec(0, 0);
    while(xPairSums.length > 0){
        let cross = crosses.pop();
        centroid.x += xPairSums.pop() * cross / (6 * polyArea);
        centroid.y += yPairSums.pop() * cross / (6 * polyArea);
    }
    
    return centroid;
}

function polyShrinkByLength(vecList, len){
    let polyCentroid = toPolyCentroid(vecList);
    
    let shrinked = [];
    for (let vec of vecList) {
        let mag = vec.sub(polyCentroid).mag();
        shrinked.push(vec.mult((mag - len) / mag));
    }

    return shrinked;
}

// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// 
// note that:
// |x1-x3 x3-x4|
// |           | (determinant) is equivalent to
// |y1-y3 y3-y4|
// 
// cross((x1-x3, y1-y3), (x3-x4, y3-y4)), or
// 
// cross(P1-P3, P3-P4)

function segVecCross(head1, tail1, head2, tail2){
    let h1h2 = head1.sub(head2),
        h1t1 = head1.sub(tail1),
        h2t2 = head2.sub(tail2),
        detT = h1h2.cross(h2t2),
        detU = h1t1.cross(h1h2),
        detS = h1t1.cross(h2t2),
        t = detT/detS,
        u = -detU/detS,
        p = head1.add(tail1.sub(head1).mult(t));
    
    return {t, u, p}
}

function segCross(seg1, seg2){
    return segVecCross(seg1[0], seg1[1], seg2[0], seg2[1]);
}

function lineSplitPoly(lineList, polyList){
    
    let actualPolyList = polyList.concat(polyList[0].copy()),
        lineSegs = toSegs(lineList),
        polySegs = toSegs(actualPolyList);
    
    let enter,
        leave,
        intersection = [];

    var seg;
    while (lineSegs.length > 0){
        seg = lineSegs.splice(0, 1)[0];

        // 1. After handling the first intersection, and there are remaining
        //    segs, we put the first one;
        if(enter !== undefined){
            intersection.push(seg[0]);
        }
        // 2. Handles if the rest segments of line crosses the edge of
        //    the polygon. If the entering index is not marked, then 
        //    marked, or mark the leaving index;
        for (let [index, edge] of polySegs.entries()){
            let {t, u, p} = segCross(seg, edge);

            // for the first and last segment, we don't need it strictly
            // intersect with polygon edge, but merely get the off-segment
            // intersection.
            let isFirst = lineSegs.length === lineList.length - 2,
                isLast = lineSegs.length === 0;
            
            if(u > 0 && u < 1 && (isFirst || t > 0) && (isLast || (t < 1))){
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

    let left  = actualPolyList.slice(enter, leave + 1).concat(intersection),
        right = actualPolyList.slice(1, enter+1).concat(intersection.reverse()).concat(actualPolyList.slice(leave));

    return {left, right};
}
