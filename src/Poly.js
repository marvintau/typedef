import List from './List';
import Seg from './Seg';

export default class Poly {
    constructor(contours=(new Segs(0))){
        this.contours = contours;
        this.close();
    }

    close(){
        for (let contour of this.contours){
            if(!contour.last().tail.equal(contour[0].head)){
                let conn = new Seg(contour.last().tail, contour[0].head);
                contour.push(conn); 
            } else {
                contour.last().tail = contour[0].head;
            }
        }
    }

    copy(){
        let poly = new Poly(this.contours.copy());
        // poly.close();
        return poly;
    }

    trans(vec){
        for (let contour of this.contours){
            contour.trans(vec);
            contour.last().tail.iadd(vec.neg());
        }
    }

    draw(ctx, stroke, color='rgb(0, 0, 0, 0.1)'){
        ctx.strokeStyle = 'black';
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.drawContours(this.contours);
        ctx.fill();
        if(stroke) ctx.stroke();

        ctx.save();
        ctx.fillStyle='rgb(0, 0, 0, 0.5)'
        for (let contour of this.contours){
            for (let [index, seg] of contour.entries()){
                // ctx.text(index, seg.head);
                ctx.point(seg.head);
            }
        }
        ctx.restore();
    }

    shrink(shrink){

        let bisecs = new List(0);
        for (let contour of this.contours){
            bisecs.push([]);
            for (let i = 0; i < contour.length; i++){
                let last = (i === 0) ? contour.length - 1 : i - 1;
                let bisec = contour[last].angleBisect(contour[i]);
                bisecs.last().push(bisec.mult(shrink));
            }
        }

        for (let i = 0; i < this.contours.length; i++){
            let contour = this.contours[i];
            for (let j = 0; j < contour.length; j++){
                contour[j].head.iadd(bisecs[i][j]);
            }
        }
    }

    cut(stroke){

        let state = 'outside',
            notchPrev, splitPrev,
            res = undefined;

        for (let i = 0; i < stroke.segs.length; i++){
            let strokeSeg = stroke.segs[i];

            // this will also include the leaving segment over the stroke.
            if(state === 'inside'){
                this.contours[0].cutGoing(notchPrev, strokeSeg.head);
                notchPrev += 1;
            }

            for (let j = 0; j < this.contours[0].length; j++){

                let {t, u}= strokeSeg.intersect(this.contours[0][j]);
                if(t < 1 && t > 0 && u < 1 && u > 0){

                    if(state == 'outside'){
                        notchPrev = j;
                        this.contours[0].cutEnter(notchPrev, u);
                        state = 'inside';
                        console.log('entered');
                        break;

                    } else if (state == 'inside') {

                        // create the cut-through point over j. notchPrev shifts
                        // if greater than j.
                        splitPrev = j;
                        this.contours[0].cutEnter(splitPrev, u);
                        notchPrev += notchPrev > splitPrev ? 1 : 0;

                        res = this.contours[0].cutLeave(notchPrev+1, splitPrev+1);
                        state = 'outside';
                    }
                }
            }
        }

        let [left, right] = res;
        console.log(left, right, 'cut');
        return {
            left: new Poly(new List(left)),
            right: new Poly(new List(right))
        };
    }
}

