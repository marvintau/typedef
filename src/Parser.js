let tokenExec = function(tokens){

    for (;tokens.length > 0;){
        if (!(tokens[0] in instrs)) {
            tokens.shift(); continue;
        };
        let args = instrs[tokens[0]].args,
            expr = args === "*" ? 
                   tokens.splice(0) :
                   tokens.splice(0, args);
        let [name, ...params] = expr;
            instrs[name].func(...params);
    }
        
}

let state = {
    path : {default: [new Vec(0,0)]},
    angle : {default: 0}
}

let gets = (key) => {
    return state[key].curr;
}

let sets = (key, val) => {
    state[key].curr = val;
    return true;
}

let resets = (key) => {
    if(Array.isArray(state[key].default))
        state[key].curr = state[key].default.map(e => e.copy());
    else if (typeof state[key].default === 'object')
        state[key].curr = state[key].default.copy();
    else
        state[key].curr = state[key].default;
}

let adds = (key, defaultValue) => {
    state[key] = {curr: undefined, default: defaultValue}
}

let inits = () => {
    for (let key in state){
        resets(key);
    }
}


let instrs = {

    end:{
        args: 1,
        func(name){
            sketch.push({type:'path', path: gets('path')});
            resets('path');
        }
    },

    ang: {
        args: 2,
        func(angle){
            sets('angle', parseFloat(angle));
        }
    },

    len: {
        args: 2,
        func(length){
            console.log(state);
            let newVec = (new Vec(gets('angle'))).mult(length).add(gets('path').last());
            gets('path').push(newVec);
            resets('angle');
        }
    },

    add:{

    },

    def: {
        args: '*',
        func(...args){
            let [name, argc, ...rest] = args;
            
            let argv = rest.splice(0, parseInt(argc));

            for (let arg of argv) if (arg in instrs)
                throw Error(`arg name [${arg}] shouldn't be same as reserved keyword`);
            
            let theArgMappingTable = argv.map(arg => rest.indexOf(arg));

            instrs[name] = {
                args: parseInt(argc)+1,
                func: (function(argMappingTable, tokens){
                    return function(...funcArgs){
                        for (let i = 0; i < funcArgs.length; i++){
                            tokens[argMappingTable[i]] = funcArgs[i];
                        }
                        console.log(tokens)
                        tokenExec(tokens.slice());
                    }
                })(theArgMappingTable, rest)
            };
        }
    }
}