
function toSegs(vecList){
    let most = vecList.slice(0, -1),
        rest = vecList.slice(1);

    let segs = [];
    while(most.length > 0){
        segs.push(new Seg(most.pop(), rest.pop()));
    }
    segs.reverse();
    return segs;
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
