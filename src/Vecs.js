import List from './List';
import Torque from './Torque';

// 普通的由两点定义的两直线的交点
// General method of finding intersections between two lines defined by two points

// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// 
// 注意以下行列式
// |x1-x3 x3-x4|
// |           |
// |y1-y3 y3-y4|
// 
// 可以记作向量叉积的形式
// cross((x1-x3, y1-y3), (x3-x4, y3-y4))
// 或
// cross(P1-P3, P3-P4) (其中P_i === (x_i, y_i))

function intersect(head1, tail1, head2, tail2){
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
        insideA: ratioA > 0 && ratioA < 1,
        insideB: ratioB > 0 && ratioB < 1,
        overA: ratioA === 0,
        overB: ratioB === 0,
        point, // point
        det  // h1t1 x h2t2 (for determining the direction)
    }
}

// 然而在实际计算中，特别是在计算下面由点构成的连续线段的交点时，我们
// 将线段看作一个半开半闭区间。具体来说，我们认为连续线段是有序的，在
// 连续线段上的每个线段的端点分为头 (head) 和尾 (tail)，每个线段也都
// 有它的前驱 (predecessor) 与后继 (successor)。半开半闭区间
// 的意思是：
// 
// 对于位于连续线段上的某个线段A，如果线段B交于线段A的尾，同时A存在后
// 继，那么认为B与A不相交，而是与A的后继相交，且交于A的后继的头。只有
// A不存在后继时，才能认为B交于A的尾。
// 
// 与此同时，当交于线段的端点时，我们直接使用那个端点的对象，而不是通过
// 上面计算出来的新的点。因为新的点是通过Vec.lerp方法计算出的，它返回
// 一个新的Vec对象。

export default class Vecs extends List {
    constructor(...vecs){
        super(...vecs);
    }

    static fromVecs(vecs, {closed=false}={}){
        const actualVecs = closed ? vecs.concat(vecs[0]) : vecs;
        return new Vecs(...actualVecs);
    }

    trans(transVec){
        for (let i = (this[0] === this.last()) ? 1 : 0; i < this.length; i++) {
            this[i].trans(transVec);
        }
    }

    rotate(angle, origin){
        for (let vec of this){
            vec.rotate(angle, origin);
        }
    }

    scale(ratio, origin){
        const actualOrigin = origin || this[0].head;
        for (let vec of this){
            vec.mult(ratio, actualOrigin);
        }
    }

    breakAt({index, point}) {
        this.splice(index+1, 0, point);
    }

    growEnds({head, tail}={}){
        if (head){
            this.unshift(head);
        }
        if (tail) {
            this.push(tail);
        }
        return this;
    }

    // 另一种用于分割多边形的思路
    // 
    // Note：
    // 1. 在使用前cutter上所有的点都已经标记了ID（这一步应当在应用breakClosed之前完成）
    // 2. 在使用前cutter与polygon，以及cutter之间的intersection已经完成
    // 3. 存在这样一种可能性，cutter自相交且交于polygon上一点，此时head和tail是同一个值
    // 
    // 原理：
    // 将当前polygon转换为点，然后形成两个新的polygon。
    split(cutter) {

        if (this.length < 4 || this.last() !== this[0]){
            throw Error('split: not splitting a polygon');
        }

        // 1. cutter是一个点序列，代表一个连续线段。head和tail分别代表它的头和尾分别
        //    对应当前闭合连续线段（多边形）上顶点的index。如果cutter的两个端点不同时
        //    在当前多边形上，则意味着cutter并不切割当前多边形。由于cutter中包含与其他
        //    cutter相交的intersection，因此可能存在只有一个端点位于多边形上的情况。

        let head, tail;
        for (let i = 0; i < this.length; i ++) {
            if (polyPoints[i] === cutter[0]){
                head = i;
            }
            if (polyPoints[i] === cutter.last()){
                tail = i;
            }
            if (head !== undefined && tail !== undefined) {
                break;
            }
        }
        if (head === undefined || tail === undefined) {
            console.log('cutter may shares point of this poly, but not cutting.');
            return [this];
        }

        // 2. cutter是一个连续线段，但是你需要想象一下它的两侧(sides)。连续线段的两侧也都是
        //    连续线段，并且都是同一套点，但是它的含义和原始的线段并不相同。如果你用一个连续
        //    线段切割一个多边形，那么新的多边形是由它原始连续线段的一部分，外加cutter的一侧
        //    构成。如果要求新的多边形的点序和原来的一致，比如均是逆时针，那么cutter两侧的点
        //    序必定是相反的。

        // 2.a. 我们约定cutter的head总是位于靠近多边形0的一侧，从而保证分割后的两个多边形
        //      上的点仍然是逆时针的顺序。
        if (head > tail) {
            cutter.reverse()
        
        // 2.b. 对于cutter本身就是一个闭合连续线段的情况比较tricky，我们需要专门判断它的点
        //      本身是否是顺时针的顺序。你可能会奇怪，为什么一般的多边形点序都是逆时针，这
        //      里却要顺时针呢？答案在下面。
        } else if (head === tail && cutter.area() > 0) {
            cutter.reverse();
        }

        // 3. 这里是最关键的部分，阅读时需要确保头脑清晰，不要冲动地修改这里。

        //    orig是被分割的多边形中，包含头/尾顶点的一侧（index为0）。它在被cutter分割后，
        //    点的序列为
        //    [tail, ..., 0, ..., head]
        //    那么和cutter接驳后则变为
        //    [tail, ..., 0, ..., head, cutter(0), ... cutter(-2)]
        //    那么新的连续线段仍然是一个多边形，头尾相接处在原先多边形的头尾相接处。
        const orig = this.slice(tail)
            .concat(this.slice(0, head + 1))
            .concat(normedCutter);
        
        //   curr是被分割的多边形不包含头尾顶点的一侧。他被分割后的点序为
        //   [head, ..., tail]
        //   显然，这里需要把cutter调转顺序接过来，才能成为一个闭合连续线段
        //   [head, ..., tail, cutter(-2), ..., cutter(0)]
        //   但是不要忘记，闭合线段需要在末尾有一个多余的头顶点的ref，所以最终是
        //   [head, ..., tail, cutter(-2), ..., cutter(0), head]
        const curr = this.slice(head, tail + 1)
            .concat(normedCutter.slice().reverse())
            .concat(this[head])

        return [orig, curr]
    }

    area(){

        if (this.length < 4 || this.last() !== this[0]){
            throw Error('Area can be found from closed segment lists a.k.a polygon');
        }

        return this.diff()
            .map(([prev, succ]) => 0.5* prev.cross(succ))
            .sum();
    }

    centroid(){
        let area = this.area();

        return this.diff()
            .map(([head, tail]) => {
                return head.lerp(1/2, tail).mult(head.cross(tail) / (3 * area))
            })
            .sum();
    }    

    /**
     * intersect with another Segs.
     * 
     * returns a list, since even a signle segment could create multiple
     * intersections.
     * @param {Segs} that 
     */
    intersect(that, {isLogging}={}) {

        const intersections = [];

        for(let i = 0; i < this.length - 1; i++) {

            const thisHead = this[i];
            const thisTail = this[i+1];

            for (let j = 0; j < that.length - 1; j++) {

                const thatHead = that[j];
                const thatTail = that[j+1];

                const {
                    overA:overThis,
                    overB:overThat,
                    insideA:insideThis,
                    insideB:insideThat,
                    point
                } = intersect(thisHead, thisTail, thatHead, thatTail);

                if (overThis && insideThat) {
                    isLogging && console.log('overThis && insideThat');
                    intersections.push(thisHead)
                    that.breakAt({index: j, point: thisHead});
                    j+=1;
                } else if (overThat && insideThis) {
                    isLogging && console.log('overThat && insideThis');
                    intersections.push(thatHead)
                    this.breakAt({index: i, point: thatHead});
                    i+=1;
                } else if (insideThis && insideThat) {
                    isLogging && console.log('insideThis && insideThat');
                    intersections.push(point);
                    this.breakAt({index: i, point});
                    that.breakAt({index: j, point});
                    j+=1;
                    i+=1;
                }
            }
        }
        
        return intersections;
    }

    torque(){
        return Torque.sum(this.map(e => e.torque()));
    }

    copy(){
        // console.log(this);
        let segs = this.map(seg => seg.copy ? seg.copy() : seg);
        for (let i = 0; i < segs.length - 1; i++){
            segs[i].tail = segs[i+1].head;
        }
        return segs;
    }
}