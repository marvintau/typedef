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
     * make the entrance of a cutting
     * expected to receive the result from intersection.
     * @param {object} param0 
     */
    cutEnter({index, point}){
        
        point.setAttr('cutEntrance', true);

        const {head, tail} = this[indexThis];

        // remove one, create two.
        this.splice(index, 1, new Seg(head, point), new Seg(point, tail));

        return {index, point}
    }

    /**
     * cutGoing
     * cutting further from the cut entrance.
     * except the receive the result of cutEnter, or last cutGoing
     * @param {object} param0 
     */
    cutGoing(index, point){
        let {tail} = this[index];
        this.splice(index, 0, new Seg(tail, point), new Seg(point, tail));

        return index+1
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
    cutThrough(enterIndex, exitIndex, point){

        point.setAttr('cutExit', true);

        if (enterIndex < exitIndex){
            // in this case, exit index changed along with cutting progress.
            console.log('notch - split - 0')
            const left = this.slice(0, enterIndex+1).concat(this.slice(exitIndex));
            const right = this.slice(enterIndex, exitIndex);
            return {left, right};
        } else if (enterIndex > exitIndex){
            console.log('notch - 0 - split')
            const left = this.slice(enterIndex).concat(this.slice(0, exitIndex));
            const right = this.slice(exitIndex, enterIndex);
            return {left, right};
        } else throw Error('its impossible to have same enterIndex and exitIndex when cutting through', enterIndex, exitIndex);

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