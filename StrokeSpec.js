
function toFragStroke(frag){

    return s;
}

class StrokeSpec {
    
    constructor({ratio, angle, curv, shape, twist}){

        this.ratio = ratio ? ratio : 0.9;
        this.angle = angle ? angle : 0;
        this.curv  = curv  ? curv  : 0;
        this.shape = shape ? shape : 0;
        this.twist = twist ? twist : 1;
    }

    copy(){
        return new StrokeSpec(this);
    }

    scale(ratio){
        this.ratio *= ratio;
        return this;
    }

    rotate(angle){
        this.angle += angle;
        return this;
    }

    toStroke(){

        let s = [new Vec(1/2, 0), new Vec(1/6, 0), new Vec(-1/6, 0), new Vec(-1/2, 0)];
    
        s[1].x += this.shape*(1/3)+1/6;
        s[2].x -= this.shape*(1/3)+1/6;
    
        s[1].iadd((new Vec(0, this.twist * 1/3)).mult(this.curv));
        s[2].iadd((new Vec(0, 1/3)).mult(this.curv));
    
        for (let p of s) {
            p.imult(this.ratio);
            p.irotate(this.angle);
        }
    
        return new Stroke(s);
    }
    
}