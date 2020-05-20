class Region {
    constructor(regionSegs){
        this.region = regionSegs;
        this.strokes = {};
        this.children = new Map();
    }

    addStroke(name, stroke){

        this.strokes[name] = stroke;

        let regions = [this.region];
        for (let strokeName in this.strokes){
            let strokeSegs = this.strokes[strokeName];

        }
    }


}