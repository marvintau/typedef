
var BOUND_OFFSET = 0.04;

class Bound {
    constructor(bound){
        this.bound = bound;
        this.centroid = toPolyCentroid(bound);
        this.strokes = [];
        this.children = [];
    }

    addStroke(strokeSpec, attr={}){

        let centroid = toPolyCentroid(this.bound),
            len = Math.sqrt(toPolyArea(toSegs(closePath(this.bound)))),
            stroke = strokeSpec.toStroke(centroid);
        
        this.strokes.push(stroke);

        if (attr.splitting) {
            if(this.children.length === 0){
                let {left, right} = stroke.splitBound(this.bound);
                
                this.children.push(new Bound(polyShrinkByLength(left,  BOUND_OFFSET)));
                this.children.push(new Bound(polyShrinkByLength(right, BOUND_OFFSET)));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = stroke.splitBound(this.children.splice(0, 1)[0].bound);
                    newChildren.push(new Bound(polyShrinkByLength(left,  BOUND_OFFSET)));
                    newChildren.push(new Bound(polyShrinkByLength(right, BOUND_OFFSET)));
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
            stroke.draw(ctx);
        }
        for (let [index, child] of this.children.entries()){
            let label = num ? `${num}-${index}` : `${index}`;
            child.draw(ctx, label);
        }
    }
}