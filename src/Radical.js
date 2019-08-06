import List from './List';
import Segs from './Segs';
import Seg from './Seg';
import Vec from './Vec';

export default class Radical {
    constructor(contours){

        if (contours === undefined){
            contours = new List((new Segs(0)).fromVecs([new Vec(-1, -1), new Vec(1, -1), new Vec(1, 1), new Vec(-1, 1)]))
        }

        this.contours = contours;
        this.closeContours();

        this.strokes = [];
    }

    closeContours(){
        for (let contour of this.contours){

            if(!contour.last().tail.equal(contour[0].head)){
                let conn = new Seg(contour.last().tail, contour[0].head);
                contour.push(conn); 
            } else {
                contour.last().tail = contour[0].head;
            }
        }
    }

    union(contourLabels) {
        if(contourLabels.length === 1){
            return this.contours[contourLabels[0]].copy();
        } else if (contourLabels.length > 1){
            let contours = this.contours.copy(),
                [first, ...restLabels] = contourLabels,
                unioned = contours[first].copy();
            
            // console.log(JSON.stringify(contourLabels.map(e => contours[e]), null, 2));
            for (let label of restLabels){
                unioned.undoCutThrough(contours[label]);
                unioned.undoCut();
            }
            // console.log(unioned, 'unioned');
            return unioned;
        } else throw Error('Radical union: YOU MUST EXPLICITLY SPECIFY THE LABELS OF CONTOURS TO BE UNIONED')
    }

    split(stroke, contourLabels){

    }

    addStroke(stroke, unioned=[], splitted=[]){

        // 1. get the union of contours and calculate the place;
        //    where the stroke will be put.
        let unionedContour = this.union(unioned)
        stroke.trans(unionedContour.centroid().sub(stroke.center()));
        // console.log('addStroke unioned', unionedContour);
        if (splitted.length === 0){
            this.contours = stroke.cut(this.contours).copy();
            // console.log('addstroke', this.contours)
            this.closeContours();
        } else {
            // if to split specified
        }

        this.strokes.push(stroke);
    }

    copy(){
        let poly = new Radical(this.contours.copy());
        // poly.close();
        return poly;
    }

    trans(vec){
        for (let contour of this.contours){
            contour.trans(vec);
            contour.last().tail.iadd(vec.neg());
        }
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

    draw(ctx, stroke, color='rgb(0, 0, 0, 0.1)'){
        ctx.strokeStyle = 'black';
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.drawContours(this.contours);
        ctx.fill();
        if(stroke)
        ctx.stroke();

        ctx.save();
        ctx.fillStyle='rgb(0, 0, 0, 0.2)'
        for (let i = 0; i < this.contours.length; i++){
            let contour = this.contours[i];
            for (let [index, seg] of contour.entries()){
                if(stroke)
                    ctx.text(index, seg.head);
                else
                    ctx.point(seg.head);
            }
            // ctx.point(contour.centroid());
            ctx.text(i, contour.centroid(), Math.abs(contour.area())*80);
        }
        ctx.restore();

        ctx.save();
        for (let stroke of this.strokes){
            stroke.draw(ctx);
        }
        ctx.restore();
    }

}

