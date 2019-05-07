
var BOUND_OFFSET = 0.02;

class Radical {
    constructor(bound, upperLevelArea){
        this.bound = bound.map(v => v.copy());
        this.centroid = toPolyCentroid(bound);
        this.torque = new Torque({});
        this.specs = [];
        this.strokes = [];
        this.children = [];
                
        this.areaRatio = upperLevelArea === undefined ? 1 : this.boundArea()/upperLevelArea;
    }

    boundArea(){
        return toPolyArea(toSegs(this.bound.concat(this.bound[0].copy())));
    }

    density(){
        return torqueSum(this.strokes.map(s => s.torque())).mass / this.boundArea();
    }

    updateTorque(){

        for (let child of this.children){
            child.updateTorque();
        }

        let childTorques = this.children.map(c => c.torque),
            strokeTorques = this.strokes.map(s => s.torque()),
            totalTorques = childTorques.concat(strokeTorques);

        this.torque = torqueSum(totalTorques);
        this.transStrokes(this.centroid.sub(this.torque.center));
    }

    allDescendants() {
        let res = [];
    
        for (let radical of this.children){
            res.push(...radical.allDescendants());
            res.push(radical);
        }
    
        return res;    
    }
    

    transStrokes(trans){
        this.allDescendants().map(e => e.strokes)
            .concat(this.strokes).flat()
            .forEach(e => e.trans(trans));
    }

    transBoundings(trans){
        this.allDescendants().map(e => e.bound)
            .concat(this.bound).flat()
            .forEach(e => e.iadd(trans));
    }

    correctPosition(){
        this.updateTorque();
        this.transBoundings(this.centroid.sub(this.torque.center));
    }

    addStrokeSpec(strokeSpec){
        this.specs.push(strokeSpec);
    }

    addStroke(strokeSpec, attr={}, path=[]){

        let refs = this.getChildListByPath(path),
            ref = refs.last();

        if(attr.rotate) {
            strokeSpec.rotate(attr.rotate);
        }

        if(attr.scale) {
            strokeSpec.scale(attr.scale);
        }

        strokeSpec.scale(Math.pow(ref.areaRatio, 0.25));

        let stroke = strokeSpec.toStroke();
        
        if (attr.cross) {
            let {at, by, to} = attr.cross;
            console.log("to", ref.strokes[to]);
            let currPoint = stroke.pointAt(by),
                theStroke = (to !== undefined) ? ref.strokes[to] : ref.strokes.last(),
                lastPoint = theStroke.pointAt(at);

            stroke.trans(lastPoint.sub(currPoint));
        }

        ref.strokes.push(stroke);

        if(path.length === 0){
            this.bound = dilateBBox(toBBox(this.strokes.map(e => e.vecs).flat()), 0.1);
            this.bound.forEach(v => v.attr.type = 'B');

        }
    }

    splitByStroke(){

        let thisArea = this.boundArea();

        for (let stroke of this.strokes)
            if(this.children.length === 0){
                let {left, right} = stroke.splitBound(this.bound);
                
                if(left.length > 0) this.children.push(new Radical(left, thisArea));
                if(right.length > 0) this.children.push(new Radical(right, thisArea));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = stroke.splitBound(this.children.shift().bound);

                    if(left.length > 0) newChildren.push(new Radical(left, thisArea));
                    if(right.length > 0) newChildren.push(new Radical(right, thisArea));
                }
                this.children = newChildren;
            }

        this.children.forEach(child => child.shrink(BOUND_OFFSET));
    }

    getChildByPath(pathArray){
        let ref = this;
        while(pathArray.length > 0){
            ref = ref.children[pathArray.shift()];
        }
        return ref;
    }

    getChildListByPath(pathArray){
        let refs = [this];
        while(pathArray.length > 0){
            refs.push(refs.last().children[pathArray.shift()]);
        }
        return refs;
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
    

    draw(ctx, par){
        let den = this.density();
        if (den > 0) console.log(par, this.density());
        let color = {r: this.density(), g:0, b: 0};

        ctx.drawBound(this.bound, par, color);
        for (let stroke of this.strokes){
            stroke.draw(ctx);
        }
        for (let [index, child] of this.children.entries()){
            let label = par ? `${par}-${index}` : `${index}`;
            child.draw(ctx, label);
        }
    }
}