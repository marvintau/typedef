class Bound {
    constructor(bound){
        this.bound = bound;
        this.centroid = toPolyCentroid(bound);
        this.strokes = [];
        this.children = [];
    }

    addStroke({angle, curv, shape}, attr={}){
        let len = diameter(angle, this.bound) * 0.8,
            stroke = fromStrokeSpec(len, angle, curv, shape);
        this.strokes.push(stroke);

        if (attr.splitting) {
            if(this.children.length === 0){
                let {left, right} = splitPoly(stroke, this.bound);
                this.children.push(new Bound(left), new Bound(right));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = splitPoly(stroke, this.children.pop());
                    // this.children
                }
            }
        }
    }

    draw(ctx){
        ctx.drawBound(this.bound);
        for (let stroke of this.strokes){
            ctx.drawStroke(stroke);
        }
        for (let child of this.children){
            child.draw(ctx);
        }
    }
}