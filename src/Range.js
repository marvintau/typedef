const RANGE_EPSILON = 0.0001;

class Range{
    constructor(min, max, val){
        this.min = min;
        this.max = max;
        this.val = val ? val : (min + max) / 2;
    }

    set(val){
        this.val = Math.max(this.min, Math.min(this.max, val));
    }

    inc(epoch){
        epoch = epoch ? epoch : RANGE_EPSILON;
        this.val = Math.max(this.val + epoch, this.max);
    }

    dec(epoch){
        epoch = epoch ? epoch : RANGE_EPSILON;
        this.val = Math.min(this.val - epoch, this.min);
    }

    mult(ratio){
        this.set(this.val * ratio);
    }

    add(inc){
        this.set(this.val + inc);
    }
}