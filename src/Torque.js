class Torque{
    constructor({center, mass}){
        // console.log("new torque", center, mass)
        this.center = center ? center : new Vec(0, 0);
        this.mass = (mass !== undefined) ? mass : 0;
    }

    toProduct(){
        return this.center.mult(this.mass);
    }
}