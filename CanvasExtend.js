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
    this.beginPath()
    this.arc(v.x, v.y, 10, 0, Math.PI*2);
    this.stroke();
}

CanvasRenderingContext2D.prototype.drawZig = function(vecs){

    let dpr = window.devicePixelRatio;

    try {
        let [first, ...rest] = vecs;
        this.moveToVec(first.mult(this.canvas.height/2));
        for (let vec of rest){
            // console.log(vec.mult(this.canvas.height/2));
            this.lineToVec(vec.mult(this.canvas.height/2));
        }
    } catch {
        console.log('Illegal line segs: ', vecs);
    }
}

CanvasRenderingContext2D.prototype.drawBound = function(vecs){

    let shrinked = polyShrinkByLength(vecs, 0.1);

    let centroid = toPolyCentroid(vecs);
    this.point(centroid.mult(this.canvas.height/2));

    this.strokeStyle = 'gray';
    this.beginPath();
    this.drawZig(shrinked);
    this.closePath();
    this.stroke();
}

CanvasRenderingContext2D.prototype.drawStroke = function(vecs){
    this.strokeStyle = 'black';
    this.beginPath();
    this.drawZig(vecs);
    this.stroke();
}
