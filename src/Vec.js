const EPSILON = 1e-6;

export default class Vec{
    /**
     * Simple Vec class.
     * 
     * @param {any} x 
     * @param {any} y 
     */
    constructor(x, y, attr={}){
        if (y === undefined){

            if(x === undefined) {
                // For nothing given, new vec created
                
                this.x = 0;
                this.y = 0;
            } else if (x.constructor === Vec){

                // if argument given as {x:1, y:1}
                
                this.x = x.x;
                this.y = x.y;
            } else if (x.len !== undefined && x.ang !== undefined){

                // if argument given as {len: 1, ang: 0}

                this.x = x.len * Math.cos(x.ang*Math.PI/180);
                this.y = x.len * Math.sin(x.ang*Math.PI/180);
            } else if (typeof x === 'number'){

                // if x is a number 

                this.x = Math.cos(x*Math.PI/180);
                this.y = Math.sin(x*Math.PI/180);
            } else {
                throw Error (`unsupported argument type:${typeof x}, constructor:${x.constructor.name}`)
            }
        } else {
            this.x = x;
            this.y = y;
        }
        this.attr = attr;
    }

    trans({x, y}, {neg=false}={}){
        if (neg) {
            this.x -= x;
            this.y -= y;
        } else {
            this.x += x;
            this.y += y;
        }
    }

    mult(vec){
        if(typeof vec === 'number'){
            this.y *= vec;
            this.x *= vec;
        } else if (vec.constructor === Vec){
            this.x *= vec.x;
            this.y *= vec.y;
        } else {
            throw Error(`invalid parameter type: ${typeof vec}`);
        }
    }

    scale(ratio, about=(new Vec(0, 0))){
        
        this.trans(about, {neg: true});
        this.mult(ratio);
        this.trans(about);
    }

    /**
     * # rotate
     * 
     * rotate about 
     * 
     * @param {number} theta angle to rotate in degree.
     */
    rotate(theta, origin=(new Vec(0, 0))){

        this.trans(origin, {neg:true});

        const {x, y} = this;
        switch(theta){
            case 90 :
                this.x = -y;
                this.y =  x;
                break;
            case -90 : 
                this.x =  y;
                this.y = -x;
                break;
            case 180    : 
            case -180   :
                this.x = -x;
                this.y = -y;
                break;
            default: 
                let rad = theta / 180 * Math.PI,
                sin = Math.sin(rad),
                cos = Math.cos(rad);

                this.x = x * cos - y * sin;
                this.y = x * sin + y * cos;
        }

        this.trans(origin);
    }

    neg(){
        const {x, y} = this;
        this.x = -x;
        this.y = -y;
    }

    // ==================================================================
    // creating something new.

    is(vec){
        return this === vec;
    }

    // this method should be only used by List.sum method.
    add({x, y}){
        return new Vec(this.x + x, this.y + y);
    }

    diff({x, y}){
        return new Vec(this.x - x, this.y - y);
    }

    lerp(ratio, {x, y}){
        return new Vec(
            this.x + (x - this.x) * ratio,
            this.y + (y - this.y) * ratio,
        )
    }

    /**
     * # vector cross product
     * 
     * returns the cross product between this and vec, or is the result of
     * determinant:
     * 
     * |this.x   that.x|
     * |               |
     * |this.y   that.y|
     * 
     * ---
     * 
     * Note: 
     * 1) the cross product conforms to right-hand rule. When A is assigned to
     *    the index finger, and B to middle, then the thumb is pointing to AxB.
     * 
     * 2) When determining of which side does one vector resides on another with
     *    cross product, according to 1), when AxB is positive, B is on the LEFT
     *    of A.
     * 
     * @param {Vec} that another vector
     */
    cross(that){
        return this.x * that.y - that.x * this.y;
    }

    dot(that){
        return this.x * that.x + this.y * that.y;
    }
 
    mag(){
        return Math.hypot(this.x, this.y);
    }

    norm(){
        let mag = this.mag();
        return this.mult(mag === 0 ? 0 : 1/mag);
    }

    angle(){
        return Math.atan2(this.y, this.x) / Math.PI * 180;
    }

    addAttr(attrName, attrValue){
        this.attr[attrName] = attrValue;
    }

    /**
     * Set attribute to Vec. overwrite existing attributes.
     * @param {object} attrObject 
     */
    setAttr(attrObject){
        return Object.assign(this.attr, attrObject);
    }

    /**
     * copy: duplicate an object instance of this.
     * @returns {Vec}
     */
    copy(){
        return new Vec(this.x, this.y, JSON.parse(JSON.stringify(this.attr)));
    }

    toString(){
        return `(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`
    }
}