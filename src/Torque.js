import Vec from './Vec';

export default class Torque{

    static sum(torques){
        let prodSum = torques
                .map(t => t.toProduct())
                .reduce((acc, v) => acc.add(v), new Vec(0, 0)),
            massSum = torques
                .map(t => t.mass)
                .reduce((acc, v) => acc + v, 0);
    
        return new Torque({
            center: prodSum.mult((torques.length === 0) ? 0 : 1/massSum),
            mass : massSum
        })    
    }

    constructor({center, mass}){
        // console.log("new torque", center, mass)
        this.center = center ? center : new Vec(0, 0);
        this.mass = mass === undefined ? 0 : mass;
    }

    toProduct(){
        return this.center.mult(this.mass);
    }
}