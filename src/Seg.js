// The design of seg
// -----------------
// 1) Cloning Vector or Not?
// Line segment is the class for building polygon and path. In our scenario, we have two
// frequent operation of
// 
// * cutting through the polygon and merge them back from the cutting path.
// * move the cutting path.
// 
// The problem of cloning vector, is once we cloned the vector, we will lose the information
// that if the edge of two polygons are actually sharing same path. Thus, before we really need
// to modify the polygons, such as shrinking, we will keep the segs created from same vector
// always refer to same vector object.

import Torque from './Torque';

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

function FourPointIntersect(head1, tail1, head2, tail2){
    let h1h2 = head1.diff(head2),
        h1t1 = head1.diff(tail1),
        h2t2 = head2.diff(tail2),
        detA = h1h2.cross(h2t2),
        detB = h1t1.cross(h1h2),
        detS = h1t1.cross(h2t2),
        ratioA =  detA/detS,
        ratioB = -detB/detS,
        point = head1.lerp(ratioA, tail1),
        det = detS;
    
    return {
        ratioA, // mag(point - head1) / mag(tail1 - head1)
        ratioB, // mag(point - head2) / mag(tail2 - head2)
        point, // point
        det  // h1t1 x h2t2 (for determining the direction)
    }
}

function TwoSegIntersect(seg1, seg2){
    const {head: head1, tail:tail1} = seg1;
    const {head: head2, tail:tail2} = seg2;
    return FourPointIntersect(head1, tail1, head2, tail2);
}

export default class Seg {
    constructor(hd, tl){
        this.head = hd;
        this.tail = tl;
    }

    // ==============================================
    // in-place operations / transforms

    trans(vec){
        this.head.trans(vec);
        this.tail.trans(vec);
    }

    rotate(angle, origin){
        this.head.rotate(angle, origin);
        this.tail.rotate(angle, origin);
    }

    scale(mag){
        this.head.mult(mag);
        this.tail.mult(mag);
    }

    flip(){
        const {head, tail} = this;
        this.head = tail;
        this.tail = head;
    }

    // ==============================================
    // operations that producing other type of values

    diff (){
        const {head, tail} = this;
        return tail.diff(head);
    }

    len (){
        return this.diff().mag();
    }

    lerp(ratio){
        const {head, tail} = this;
        return head.lerp(ratio, tail);
    }

    torque(){
        const {head, tail} = this;
        return Torque.fromVec(tail.diff(head));
    }

    intersect(that){
        return TwoSegIntersect(this, that);
    }

    cross(){
        const {head, tail} = this;
        return head.cross(tail);
    }

    copy(){
        return new Seg(this.head.copy(), this.tail.copy());
    }
}