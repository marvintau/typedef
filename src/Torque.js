import Vec from './Vec';

export default class Torque{

    static sum(torques){
        let prodSum = torques
                .map(t => t.toProduct())
                .reduce(({x:accX, y:accY}, {x, y}) => new Vec(accX+x, accY+y), new Vec()),
            massSum = torques
                .map(t => t.mass)
                .reduce((acc, v) => acc + v, 0);
    
        prodSum.mult((torques.length === 0) ? 0 : 1/massSum)

        return new Torque({
            center: prodSum,
            mass : massSum
        })    
    }

    static fromVec(vec){
        return new Torque({center:(new Vec()).lerp(0.5, vec), mass: vec.mag()});
    }

    constructor({center=new Vec(), mass=0}={}){
        // console.log("new torque", center, mass)
        this.center = center;
        this.mass   = mass;
    }

    toProduct(){
        const {center, mass} = this;
        const copy = center.copy();
        copy.mult(mass);
        return copy;
    }
}
