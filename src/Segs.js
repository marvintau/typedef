import List from './List';
import Seg from './Seg';
import Vec from './Vec';
import Torque from './Torque';

export default class Segs extends List {
    constructor(...segs){
        super(...segs);
    }

    static fromVecs(vecs, {closed=false}={}){
        const actualVecs = closed ? vecs.concat(vecs[0]) : vecs;

        let list = actualVecs.diff(([head, tail])=>new Seg(head, tail));
        return new Segs(...list);
    }

    toVecs(){
        let last;
        let vecs = [];
        for (let {head, tail} of this){
            if (!head.is(last)){
                vecs.push(head);
                last = head;
            }
            if (!tail.is(last)){
                vecs.push(tail);
                last = tail;
            }
        }

        // for closed segs (polygon), needed to remove the last one
        if (last.is(vecs[0])){
            vecs.pop();
        }
        return vecs;
    }

    trans(transVec){
        const vecs = this.toVecs();

        for (let vec of vecs){
            vec.trans(transVec);
        }
    }

    rotate(angle, origin){
        const vecs = this.toVecs();
        for (let vec of vecs){
            vec.rotate(angle, origin);
        }
    }

    scale(ratio, origin){
        const actualOrigin = origin || this[0].head;
        const vecs = this.toVecs();
        for (let vec of vecs){
            vec.mult(ratio, actualOrigin);
        }
    }

    flip(){
        this.reverse();
        for (let seg of this){
            seg.flip();
        }
    }

    area(){

        if (this.length < 3 || this.last().tail !== this[0].head){
            throw Error('Area can be found from closed segment lists a.k.a polygon');
        }

        const vals = this.map(seg => 0.5* seg.cross());
        return vals.sum();
    }

    centroid(){
        let area = this.area();

        return this
            .map(e => {
                const mid = e.lerp(1/2);
                mid.mult(e.cross() / (3 * area))
                return mid;
            })
            .sum();
    }    

    lens(){
        let lens = new List(0);
        for (let seg of this){
            lens.push(seg.len());
        }
        return lens;
    }

    /**
     * intersect with a single segment.
     * 
     * returns a list, since even a signle segment could create multiple
     * intersections.
     * @param {Vec} that 
     */
    intersect(that){
        let intersects = new List(0)
        for (let i = 0; i < this.length; i++){
            const seg = this[i];
            const {
                ratioA:ratioThat,
                ratioB:ratioThis,
                point,
                det
            } = that.intersect(seg);
            intersects.push({ratioThis, ratioThat, point, det, index:i});
        }
        return intersects;
    }

    /**
     * cutEnter
     * --------
     * make the entrance of a cutting by giving a starting point.
     * expected to receive the result from intersection.
     *
     * **cutEnter receives a parameter set containing:**
     * cutTip: the index of segment to be break with the new given point.
     * cutExit: the index of segment to be cut through.
     * point: the new point to be inserted in.
     * 
     * **cutEnter returns a parameter set containing:**
     * cutTip: updated segment index for following cutGoing or cutThrough operation.
     * cutExit: updated index of cutting-through segment.
     * point: the newly added point.
     * 
     * Note that the cutTip will be used in multiple scenario. It
     * always means the index of the segment, of which the tail is
     * the actual cut tip point. According to the definition, the
     * returned cutTip remains same to the given.
     * 
     * @param {object} param0 
     */
    cutEnter({cutTip, cutExit, point}){
        
        point.setAttr({cutEntrance: true});

        const {head, tail} = this[cutTip];

        // replace one with two.
        this.splice(cutTip, 1, new Seg(head, point), new Seg(point, tail));

        return {
            cutTip,
            cutExit: cutExit > cutTip ? cutExit + 1 : cutExit,
            point
        }
    }

    /**
     * cutGoing
     * cutting further from the cut entrance.
     * except the receive the result of cutEnter, or last cutGoing
     * @param {object} param0 
     */
    cutGoing({cutTip, cutExit, point}){

        point.setAttr({cutGoing: true});

        let {tail} = this[cutTip];

        // add two after current one.
        this.splice(cutTip + 1, 0, new Seg(tail, point), new Seg(point, tail));

        return {
            cutTip: cutTip + 1,
            cutExit: cutExit > cutTip ? cutExit + 2 : cutExit,
            point
        }
    }

    /**
     * cutThrough
     * cutting through the polygon / closed segment list.
     * 
     * By far, the last point of cutting point is the intersection between the cutting path
     * and the polygon, on the exit side, now we need to make the polygon into two.
     * 
     * The result of plain cutting (not considering the cutting path intersect with itself)
     * causes two intersections, and finally split the polygon into two. 
     * 
     * When cutting a polygon, there is an "entrance" segment and an "exit". The issue here is
     * that by the cutting path growing on the polygon, the index of exit segment will grow as
     * well, if its index is greater than the index of entrance segment before cutting.
     * 
     * When cutting through a polygon, if the exit index is greater than the entrance index, then
     * we define the new polygon that doesn't contain the zero-index segment of original polygon
     * the "left one". otherwise the "right one". ASSUME the segments are indexed in CCW manner.
     * 
     *          | Entrance                          | Entrance
     * +--------+-------+  ^               +--------+-------+  
     * |        |       |  | index         |        |       |  
     * |        |       0  | direction     0        |       |  
     * |        |       |  | (CCW)         |        |       |  
     * +--------+-------+  |               +--------+-------+  
     *          | Exit                              | Exit
     *          V                                   V
     * We call the one of the new polygons "parent", if it contains the zero segment index
     * of original polygon, and 'child' for the other. You can imagine the zero segment index
     * 
     */
    cutThrough({cutTip, cutExit}){

        // 在这里我们需要特别注意Array.slice方法的重要特性，就是slice的起止下标代表了半开半闭区间
        // array.slice(a, b)
        // 所得到的新的Array中，是不包含array[b]的，代表了[a, b)。我们必须要写成
        // array.slice(a, b+1)
        // 才有可能得到真正的[a, b]区间的元素。

        // 在下面的代码中，要特别注意slice方法中起止下标的“+1”代表的含义是不一样的。位于start位置
        // 的+1代表真的要从下一个开始，而位于end位置的+1代表要将最后一个囊括进来。

        // NOTE: 如果你（包括日后的我）无法理解这部分代码，请保持原样，不要修改。
        const closedSplit = (start, end) => {

            const left = this.slice(end + 1) // From end Succ
                .concat(this.slice(0, start + 1)) // To start Prev
                .concat(new Seg(this[start].tail, this[end].tail)); //connect / close

            const right = this.slice(start + 1, end + 1)
                .concat(new Seg(this[end].tail, this[start].tail));
          
            return {left, right};
        }

        if (cutTip < cutExit){
            return closedSplit(cutTip, cutExit);
        } else if (cutTip > cutExit){
            return closedSplit(cutExit, cutTip);
        } else throw Error('its impossible to have same enterIndex and exitIndex when cutting through', cutTip, cutExit);

    }

    // cut
    // ===
    // the function that integrates all three functions above, for cutting a polygon
    // with given point set at one time.
    // Note that when startPos is given, it will calculate the point with startPos,
    // otherwise use the first point of the points. Same to endPos.
    cut({points, start:{index:startIndex, pos:startPos}={}, end:{index:endIndex, pos:endPos}={}}) {
        const pointSet = points.slice();
        if (startIndex === undefined) {
            throw Error('cut: startIndex not specified');
        }
        if (endIndex === undefined) {
            throw Error('cut: endIndex not specified');
        }
        if (startPos !== undefined) {
            pointSet.unshift(this[startIndex].lerp(startPos));
        }
        if (endPos !== undefined) {
            pointSet.unshift(this[endIndex].lerp(endPos));
        }
        const [firstPoint, ...restPoints] = pointSet;

        let {cutTip, cutExit} = this.cutEnter({cutTip: startIndex, cutExit: endIndex, point: firstPoint});
        for (let restPoint of restPoints) {
            const {cutTip: newCutTip, cutExit: newCutExit} = this.cutGoing({cutTip, cutExit, point: restPoint});
            cutTip = newCutTip;
            cutExit = newCutExit;
        }
        let {left, right} = this.cutThrough({cutTip, cutExit});

        return {left, right};
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