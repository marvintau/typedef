
var BOUND_OFFSET = 0.02;

class Radical {
    constructor(bound){
        this.bound = bound;
        this.centroid = toPolyCentroid(bound);
        this.torque = new Torque({});
        this.specs = [];
        this.strokes = [];
        this.children = [];
    }

    updateTorque(){

        for (let child of this.children){
            child.updateTorque();
        }

        let childTorques = this.children.map(c => c.torque),
            strokeTorques = this.strokes.map(s => s.torque()),
            totalTorques = childTorques.concat(strokeTorques);

        this.torque = torqueSum(totalTorques);
        console.log("update torque", this.torque.center, childTorques);
        for (let stroke of this.strokes){
            stroke.trans((new Vec(0, 0)).add(this.centroid).sub(this.torque.center));
        }

    }

    centerStroke(){
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

        this.updateTorque();
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
                    let {left, right} = stroke.splitBound(this.children.shift().bound);
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