class Poly {
    constructor(vecs){
        this.update(vecs);
    }

    update(vecs){

        this.segs = toSegs(vecs);
        this.bound = getBound(vecs);

        // Update area
        this.area = this.segs.map(seg => seg.incross()).sum()/2;

        // update centroid
        let xPairSums = this.segs.map(seg => seg.head.x + seg.tail.x),
            yPairSums = this.segs.map(seg => seg.head.y + seg.tail.y),
            crosses = this.segs.map(seg => seg.incross());
        
        this.centroid = new Vec(0, 0);

        let normArea = this.area === 0 ? 1 : this.area;

        while(xPairSums.length > 0){
            let cross = crosses.pop();
            this.centroid.x += xPairSums.pop() * cross / (6 * normArea);
            this.centroid.y += yPairSums.pop() * cross / (6 * normArea);
        }    
    }
}