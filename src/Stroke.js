import Seg from './Seg';
import List from './List';

export default class Stroke {
    constructor(segList, closed){
        this.segs = segList;

        if (closed){
            this.closed = true;
            let conn = new Seg(this.segs.last().tail.copy(), this.segs[0].head.copy());
            this.segs.push(conn); 
        }
        
        this.displayed = this.segs.copy();
    }

    trans(vec){
        this.segs.trans(vec);
        this.displayed = this.segs.copy();
    }

    joint(that, {thisPos, thatPos}){
        if (thisPos === 1){
            this.segs.push(...(thatPos === 0 ? that.segs : that.segs.reverse()));
        } else if (thisPos === 0){
            this.segs.unshift(...(thatPos === 0 ? that.segs : that.segs.reverse()));
        }
        this.displayed = this.segs.copy();
    }
}