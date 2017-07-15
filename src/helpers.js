/**
 * Recursively extends objects or an array of objects
 * Ignores prototype chain and anything not an object
 * Slices arrays
 * TODO (or maybe not since this won't be exposed to anytihing else): 
 *   1. Add a strict mode that checks type and pre-existence in main
 *   2. Check for infinite loops
 * @param {*} main 
 * @param {*} objs 
 */
const extend = function(main, ...objs){
    objs.forEach((obj)=>{   
        if(typeof obj !== "object")
            return;
        if(obj.constructor == Array)
            return extend(main, ...obj);
        let keys = Object.keys(obj);
        keys.forEach((key)=>{
            if(isObject(main[key]) && isObject(obj[key])){
                extend(main[key], obj[key]);
            }else if(isArray(obj[key])){
                main[key] = obj[key].slice(0);
            }else{
                main[key] = obj[key]
            }
        })
    })
    return main;
}
// extend without replacing existing keys in main only
const extendSafe = function(main, ...objs){
    let obj = objs.length > 1 ? extend({},...objs) : objs[0];
    if(!isObject(obj))
        return main;
    let keys = Object.keys(obj);
    keys.forEach((key)=>{
        if(isObject(main[key]) && isObject(obj[key])){
            extendSafe(main[key], obj[key]);
        }else if(!main[key]){
            if(isArray(obj[key])){
                main[key] = obj[key].slice(0);
            }else{
                main[key] = obj[key]
            }
        }   
    })
    return main;
}

const isObject = function(o){
    return typeof o === "object" && o.constructor !== Array;
}

const isArray = function(a){
    return a && a.constructor == Array
}

module.exports = {
    isObject,
    isArray,
    extend, 
    extendSafe
}