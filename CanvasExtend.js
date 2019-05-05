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
        this.arc(v.x*ratio, v.y*ratio, 3, 0, Math.PI*2);
        this.stroke();
    }
}

CanvasRenderingContext2D.prototype.drawZig = function(vecs){

    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height/2/dpr;

    try {
        let [first, ...rest] = vecs;
        this.moveToVec(first.mult(ratio));
        for (let [index, vec] of rest.entries()){
            this.lineToVec(vec.mult(ratio));
        }
    } catch {
        console.log('Illegal line segs: ', vecs);
    }
}

CanvasRenderingContext2D.prototype.text = function(text, vec){

    if (vec != undefined){
        let dpr = window.devicePixelRatio,
            ratio = this.canvas.height/2/dpr;
    
        this.fillText(text, vec.x*ratio, vec.y*ratio);
    }

}

CanvasRenderingContext2D.prototype.drawBound = function(vecs, num){

    let centroid = toPolyCentroid(vecs);
    if (num !== undefined){
        this.save();
        this.fillStyle = 'rgb(128, 0, 0, 0.3)';
        this.text(num, centroid);
        this.restore();
    } else {
        this.point(centroid);
    }

    this.fillStyle = 'rgb(0, 0, 0, 0.1)';
    this.beginPath();
    this.drawZig(vecs);
    this.closePath();
    this.fill();
}
