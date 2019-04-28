class Bound {
    constructor(bound){
        this.bound = bound;
        this.centroid = toPolyCentroid(bound);
        this.strokes = [];
        this.children = [];
    }

    addStroke(strokeSpec, attr={}){

        console.log(strokeSpec);

        let centroid = toPolyCentroid(this.bound),
            len = diameter(strokeSpec.angle, this.bound),
            stroke = strokeSpec.toStroke(centroid, len);
        
        this.strokes.push(stroke);

        if (attr.splitting) {
            if(this.children.length === 0){
                let {left, right} = splitPoly(stroke, this.bound);
                
                this.children.push(new Bound(polyShrinkByLength(left, 0.01)));
                this.children.push(new Bound(polyShrinkByLength(right, 0.01)));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = splitPoly(stroke, this.children.splice(0, 1)[0].bound);
                    newChildren.push(new Bound(polyShrinkByLength(left, 0.01)));
                    newChildren.push(new Bound(polyShrinkByLength(right, 0.01)));
                }
                this.children = newChildren;
            }
        }
    }

    getChildByPath(pathArray){
        let ref = this;
        while(pathArray.length > 0){
            ref = ref.children[pathArray.splice(0, 1)];
        }
        return ref;
    }

    draw(ctx, num){
        ctx.drawBound(this.bound, num);
        for (let stroke of this.strokes){
            ctx.drawStroke(stroke);
        }
        for (let [index, child] of this.children.entries()){
            let label = num ? `${num}-${index}` : `${index}`;
            child.draw(ctx, label);
        }
    }
}