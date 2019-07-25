
function same(array, func){
    return array.every((v, i, a) => func(v) === func(a[0]));
}

function toBBox(vecList){

    let xs = vecList.map(v => v.x),
        ys = vecList.map(v => v.y),
        left =  Math.min(...xs),
        right = Math.max(...xs),
        top =   Math.max(...ys),
        bott =  Math.min(...ys);

    return [
        new Vec(right, top),
        new Vec(left, top),
        new Vec(left, bott),
        new Vec(right, bott)
    ]
}

function convexity(vecList){
    if(vecList.length > 2){
        let segs = toSegs(vecList.concat(vecList[0]));
        let dirs = segs.concat(segs[0]).map(seg => seg.dir());

        let most = dirs.slice(0, -1),
            rest = dirs.slice(1);
        
        let res = [];
        for (let i = 0; i < most.length; i++){
            res.push(most[i].cross(rest[i]));
        }
        return same(res, Math.sign);
    } else {
        return false;
    }
}

function dilateBBox(bbox, len){
    let centroid = toPolyCentroid(bbox);

    let dilated = [];
    for (let vec of bbox) {
        let mag = vec.sub(centroid).mag();
        dilated.push(vec.sub(centroid).mult((mag + len) / mag).add(centroid));
    }

    return dilated;
}

function toSegs(vecList){
    let most = vecList.slice(0, -1),
        rest = vecList.slice(1);

    let segs = [];
    while(most.length > 0){
        segs.push(new Seg(most.pop().copy(), rest.pop().copy()));
    }
    segs.reverse();
    return segs;
}

function torqueSum(torques){
    let torqueSum = torques.map(t => t.toProduct()).reduce((acc, v) => acc.add(v), new Vec(0, 0));
    let massSum = torques.map(t => t.mass).reduce((acc, v) => acc + v, 0);

    return new Torque({
        center: torqueSum.mult((torques.length === 0) ? 0 : 1/massSum),
        mass : massSum
    })
}

function segLengths(segs){
    return segs.map((seg) => seg.len());
}

function closePath(vecList){
    return vecList.concat(vecList[0].copy());
}

function toPolyArea(polySegs){
    return polySegs.map(seg => seg.incross()).sum()/2;
}

function toPolyCentroid(vecList){
    if (vecList.length > 0){
        let polySegs = toSegs(vecList.concat(vecList[0].copy())),
            polyArea = toPolyArea(polySegs),
            xPairSums = polySegs.map(seg => seg.head.x + seg.tail.x),
            yPairSums = polySegs.map(seg => seg.head.y + seg.tail.y),
            crosses = polySegs.map(seg => seg.incross());
        
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
    } else {
        return undefined;
    }
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

    return resseg.head.sub(resseg.tail).mag();
}
