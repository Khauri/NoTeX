const 
    _               = require('./helpers'),
    VexFlow         = require('vexflow').Flow,
    Chord           = require('./Chord')
;

class Voice extends VexFlow.Voice{
    constructor(config){
        super(config);
        _.extendSafe(this, 
            {
                chords : [],
            },
            config,
            {
                __private__ : {
                    lastChord : null
                }
            }
        )
    }

    addChord(...config){
        let c;
        if(!config.length)
            throw new Error("Forgot some arguments there buddy")
        if(config[0] instanceof Chord)
            c = config[0];
        else
            c = new Chord(...config);
        this.addTickable(c);
        this.chords.push(c);
        this.__private__.lastChord = c;

    }
    /**
     * Tries to ripple insert the chord
     */
    addChordAndRipple(onFailure, ...config){

    }

    get latestChord(){
        return this.__private__.lastChord || 
            this.chords[this.chords.length]
    }
}

module.exports = Voice;