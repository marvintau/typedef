
var BOUND_OFFSET = 0.02;

class Radical {
    constructor(bound){
        this.bound = bound;
        this.centroid = toPolyCentroid(bound);
        this.specs = [];
        this.strokes = [];
        this.children = [];
    }

    centerStroke(){
        let massPoints = [];
        for (let stroke of this.strokes){
            massPoints.push(...stroke.sample());
        }
        let massCenter = massPoints.reduce((center, massPoint) => center.add(massPoint), new Vec(0, 0)).mult(1/massPoints.length);

        for (let stroke of this.strokes){
            stroke.trans((new Vec(0, 0)).sub(massCenter));
        }
    }

    addStrokeSpec(strokeSpec){
        this.specs.push(strokeSpec);
    }

    addStroke(strokeSpec, attr={}){

        if(attr.rotate) {
            strokeSpec.rotate(attr.rotate);
        }

        if(attr.scale) {
            strokeSpec.scale(attr.scale);
        }

        let stroke = strokeSpec.toStroke();
        
        if (attr.cross) {
            let {at, by, to} = attr.cross;
            console.log("to", this.strokes[to]);
            let currPoint = stroke.pointAt(by),
                theStroke = (to !== undefined) ? this.strokes[to] : this.strokes.last(),
                lastPoint = theStroke.pointAt(at);

            stroke.trans(lastPoint.sub(currPoint));
        }

        this.strokes.push(stroke);
        this.centerStroke();
    }

    splitByStroke(){
        for (let stroke of this.strokes)
            if(this.children.length === 0){
                let {left, right} = stroke.splitBound(this.bound);
                
                if(left.length > 0) this.children.push(new Radical(left));
                if(right.length > 0) this.children.push(new Radical(right));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = stroke.splitBound(this.children.splice(0, 1)[0].bound);
                    if(left.length > 0) newChildren.push(new Radical(left));
                    if(right.length > 0) newChildren.push(new Radical(right));
                }
                this.children = newChildren;
            }

        this.children.forEach(child => child.shrink(BOUND_OFFSET));
    }

    getChildByPath(pathArray){
        let ref = this;
        while(pathArray.length > 0){
            ref = ref.children[pathArray.splice(0, 1)];
        }
        return ref;
    }

    shrink(len){
        let centroid = toPolyCentroid(this.bound);
        
        let shrinked = [];
        for (let vec of this.bound) {
            let mag = vec.sub(centroid).mag();
            shrinked.push(vec.sub(centroid).mult((mag - len) / mag).add(centroid));
        }
    
        this.bound = shrinked;
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