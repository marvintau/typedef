class Layer {
  constructor(poly) {
    this.poly = poly;
    this.cuts = [];
    this.subs = {};
  }

  /**
   * addCut
   * ------
   * Add a new cutting point set to current layers.
   * 
   * @param {*} points 
   */
  addCut(segs) {
    
    // 1. add the cut to the cut set.
    this.cuts.push(segs.copy());

    // 2. check if the new cut intersects with any existing cut. If so,
    //    insert the intersection point to both cuts.
    

    // 3. recalcutate subs with new cuts, by apply the cuts sequentially.
  }

  
}