const 
    _               = require('./helpers'),
    VexFlow         = require('vexflow').Flow,
    Component       = require('./Component'),
    NoteXParser     = require('./NoteXParser')
;

class Chord extends VexFlow.StaveNote{
    constructor(keys, ...options){
        let k = [];
        if(typeof keys == "string"){
            keys = NoteXParser.noteXToJSON(keys);
            k = keys.map(key=> {return `${key.note}/${key.oct}`})
        }else if(typeof keys == "object" && keys.constructor == Array){
            throw new Error("Feature not implemented. Go shout at the dev");
        }else{
            throw new TypeError("First argument must be Array or String");
        }
        let config = 
            _.extend(
                {
                    clef : "treble",
                    duration : keys[0].val,
                    keys : k,
                }, 
                ...options,
                {
                    __private__ : {
                        keys : keys
                    }
                }
            );

        super(config);
        
        _.extendSafe(this, config)
        // request accidentals and dots and all that here
    }
}

module.exports = Chord;