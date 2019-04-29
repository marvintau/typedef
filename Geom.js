
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

function segLengths(segs){
    return segs.map(([hd, tl]) => tl.sub(hd).mag());
}

function closePath(vecList){
    return vecList.concat(vecList[0].copy());
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
    // console.log(vecList,  xPairSums, yPairSums, crosses, polyArea);
    // console.log('polyArea', polyArea);
    polyArea = polyArea === 0 ? 1 : polyArea;
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
        shrinked.push(vec.sub(polyCentroid).mult((mag - len) / mag).add(polyCentroid));
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

function diameter(angle, polyList){

    let centroid = toPolyCentroid(polyList),
        testVec = centroid.add(new Vec(angle)),
        polySegs = toSegs(polyList.concat(polyList[0].copy()));
    
    let resSeg = [];
    for (let seg of polySegs) {
        let {u, p} = segCross([centroid, testVec], seg);
        if(u > 0 && u < 1){
            resSeg.push(p);
        }
    }

    return resSeg[0].sub(resSeg[1]).mag();
}
