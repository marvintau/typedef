// Extended JavaScript native Array class with handy methods.

export default class List extends Array {
    constructor(...args){
        super(...args);
    }

    most(){
        return this.slice(0, -1);
    }

    last(){
        return this[this.length - 1];
    }

    sum() {
        if(!this.same(e => e.constructor)){
            throw Error('Sum: cannot be applied to elements with different type');
        }
        let Cons = this[0].constructor,
            func = (acc, n) => acc.add ? acc.add(n) : (acc + n);

        return this.reduce(func, new Cons());
    }

    same(func=(e) => e){
        return this.every((v, i, a) => func(v) === func(a[0]));
    }

    accum(accumFunc=(e)=>e){
        return this.reduce((acc, x) => acc.concat(acc.last() + accumFunc(x)), [0])
    }

    // copy the list, and try to clone the elements if
    // a copy method exists.
    copy(){
        return this.map(e => e.copy ? e.copy() : e);
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