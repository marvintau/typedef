// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// 
// note that:
// |x1-x3 x3-x4|
// |           | (determinant) is equivalent to
// |y1-y3 y3-y4|
// 
// cross((x1-x3, y1-y3), (x3-x4, y3-y4)), or
// 
// cross(P1-P3, P3-P4)

function segIntersect(head1, tail1, head2, tail2){
    let h1h2 = head1.sub(head2),
        h1t1 = head1.sub(tail1),
        h2t2 = head2.sub(tail2),
        detT = h1h2.cross(h2t2),
        detU = h1t1.cross(h1h2),
        detS = h1t1.cross(h2t2),
        t = detT/detS,
        u = -detU/detS,
        p = head1.add(tail1.sub(head1).mult(t)),
        d = detS;
    
    return {t, u, p, d}
}

import Vec from './Vec';
import Torque from './Torque';

export default class Seg {
    constructor(hd, tl){
        this.head = hd;
        this.tail = tl;
    }

    diff (){
        return this.tail.sub(this.head);
    }

    len (){
        return this.tail.sub(this.head).mag();
    }

    dir (){
        return this.tail.sub(this.head).norm();
    }

    lerp(ratio){
        return this.head.add(this.tail.sub(this.head).mult(ratio));
    }

    trans(vec){
        this.head.iadd(vec);
        this.tail.iadd(vec);
    }

    rotate(angle){
        this.head.irotate(angle);
        this.tail.irotate(angle);
    }

    scale(mag){
        this.head.imult(mag);
        this.tail.imult(mag);
    }

    torque(){
        return new Torque({center:this.lerp(0.5), mass: this.len()});
    }

    intersect(that){
        return segIntersect(this.head, this.tail, that.head, that.tail);
    }

    cross(){
        return this.head.cross(this.tail);
    }

    // the previous one connect with the 
    angleBisect(that){
        if(that.head == this.tail){
            
            let thisDir = this.dir().neg(),
                thatDir = that.dir();

            if(thisDir.cross(thatDir) === 0){
                if (thisDir.dot(thatDir) > 0){
                    return thisDir;
                } else {
                    return new Vec(-thisDir.y, thisDir.x);
                }
            } else {
                return thisDir.add(thatDir).mult(Math.sign(thisDir.cross(thatDir))).norm();
            }


        } else console.error('angleBisector is only permitted if two segs share same vec', this, that);
    }

    reverse(){
        let temp = this.head;
        this.head = this.tail;
        this.tail = temp;
    }

    copy(){
        return new Seg(this.head.copy(), this.tail.copy());
    }
}