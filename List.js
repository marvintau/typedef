// Extended JavaScript native Array class with handy methods.

class List extends Array {
    constructor(...args){
        super(...args);
    }

    last(){
        return this[this.length - 1];
    }

    sum(sumFunc=(e)=>e) {
        return this.reduce((acc, n) => acc + sumFunc(n), 0);      
    }

    same(func=(e) => e){
        return this.every((v, i, a) => func(v) === func(a[0]));
    }

    accum(accumFunc=(e)=>e){
        return this.reduce((acc, x) => acc.concat(acc.last() + accumFunc(x)), [0])
    }

    zip(func=(e)=>e){
        if((this[0].length) && (this[0].length > 0) && this.same(e => e.length)){
            let newList = this[0].map((_e, i) => {
                return func(this.map(e => e[i]));
            })
            return new List(...newList);
        } else throw Error('Invalid array dimension for zipping');
    }
}

if(!PRODUCTION){
    let list = new List(1,2,3);
    console.assert(list[0]===1 && list.length===3, 'List: Constructor failed');
    console.assert(list.sum(e=>e*2)===12, 'List: sum failed');
    console.assert(list.same(e=>Number.isInteger(e)), 'List: same failed');

    let listMapped = list.map(e => [e, e*2]);
    console.assert(listMapped.zip().last().sum()==12, 'List: zip failed');
}