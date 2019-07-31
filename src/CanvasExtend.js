CanvasRenderingContext2D.prototype.lineToVec = function(vec){
    this.lineTo(vec.x, vec.y);
}

CanvasRenderingContext2D.prototype.moveToVec = function(vec){
    this.moveTo(vec.x, vec.y);
}

CanvasRenderingContext2D.prototype.bezierCurveTo = function(cv1, cv2, ev){
    this.bezierCurveTo(cv1.x, cv1.y, cv2.x, cv2.y, ev.x, ev.y);
}


CanvasRenderingContext2D.prototype.point = function(v){

    if (v != undefined){
        let dpr = window.devicePixelRatio,
            ratio = this.canvas.height/2/dpr;
    
        this.beginPath()
        this.arc(v.x*ratio, v.y*ratio, 1.8, 0, Math.PI*2);
        this.fill();
    }
}

CanvasRenderingContext2D.prototype.drawSegs = function(segs){

    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height/2/dpr;
    try {
        this.beginPath();
        this.moveToVec(segs[0].head.mult(ratio));
        for (let seg of segs){
            this.lineToVec(seg.tail.mult(ratio));
        }
        this.stroke();
    } catch {
        console.log('Illegal line segs: ', segs);
    }
}

CanvasRenderingContext2D.prototype.drawContours = function(contours){

    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height/2/dpr;
    try {
        for (let contour of contours){
            this.moveToVec(contour[0].head.mult(ratio));
            for (let seg of contour){
                this.lineToVec(seg.tail.mult(ratio));
            }
            this.closePath();
        }
    } catch {
        console.log('Illegal line segs: ', contours);
    }
}


CanvasRenderingContext2D.prototype.text = function(text, vec){

    if (vec != undefined){
        let dpr = window.devicePixelRatio,
            ratio = this.canvas.height/2/dpr;
    
        this.fillText(text, vec.x*ratio, vec.y*ratio);
    }

}

CanvasRenderingContext2D.prototype.drawBound = function(vecs, num, {r, g, b}){

    let centroid = toPolyCentroid(vecs);
    if (num !== undefined){
        this.save();
        this.fillStyle = 'rgb(128, 0, 0, 0.3)';
        this.text(num, centroid);
        this.restore();
    } else {
        this.point(centroid);
    }

    this.fillStyle = `rgba(${r*128}, ${g}, ${b}, 0.1)`;
    this.beginPath();
    this.drawZig(vecs);
    this.closePath();
    this.fill();
}
