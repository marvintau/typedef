
function toFragStroke(frag, len){
    let s = [new Vec(1/2, 0), new Vec(1/6, 0), new Vec(-1/6, 0), new Vec(-1/2, 0)];
    
    s[1].x += frag.shape*(1/3)+1/6;
    s[2].x -= frag.shape*(1/3)+1/6;

    s[1].iadd((new Vec(0, frag.twist * 1/3)).mult(frag.curv));
    s[2].iadd((new Vec(0, 1/3)).mult(frag.curv));

    for (let p of s) {
        p.imult(len * frag.ratio);
        p.irotate(frag.angle);
    }

    return s;
}


class StrokeSpec {
    
    constructor({ratio, angle, curv, shape, twist}){

        this.frags = [];
        this.addFrag({ratio, angle, curv, shape, twist});
    }

    addFrag({ratio, angle, curv, shape, twist}){

        let frag = {};
        frag.ratio = ratio ? ratio : 0.9;
        frag.angle = angle ? angle : 0;
        frag.curv  = curv  ? curv  : 0;
        frag.shape = shape ? shape : 0;
        frag.twist = twist ? twist : 1;

        this.frags.push(frag);

    }

    toStroke(len){
        let s = [];
        let [first, ...rest] = this.frags;

        s.push(...toFragStroke(first));
        for (let frag of rest) {
            let fragStroke = toFragStroke(frag);
            for (let vec of fragStroke){
                vec.iadd(s.last());
                s.push(...fragStroke);
            }
        }

        let sCentroid = toPolyCentroid(s);
        for (let vec of s){
            vec.isub(sCentroid);
            vec.imult(len);
        }
    }
    
}