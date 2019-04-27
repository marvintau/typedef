Array.prototype.last = function(){
    return this[this.length - 1];
}

Array.prototype.sum = function(){
    return this.reduce((acc, n) => acc + n, 0);
}
