/**
 * Instrument.js
 * -------------
 * We have to manually render measures b/c for some reason
 * VexFlow thinks staves are measures...wtf
 */
const 
    _               = require('./helpers'),
    VexFlow         = require('vexflow').Flow,
    Measure         = require('./Measure'),
    Stave           = require('./Stave')
;

class Instrument{
    constructor(...config){
        _.extend(this,
            {
                staves : [],
                staveCount : 0,
                name : "Instrument"
            },
            ...config,
            {
                __private__ : 
                {
                    lastStave : null    
                }
            }
        );
        for(let i = 0; i < this.staveCount; i++)
            this.addStave();
    }
    /**
     * Adds a measure
     * @param {*} s 
     */
    addStave(s){
        // get number of measures in stave
        if(!s || _.isObject(s))
            s = new Stave(s);
        else if(!(s instanceof Measure))
            throw new TypeError("Not measure or configuration object")

        s.instrument = this;
        s.score = this.score;

        this.staves.push(s);
        this.__private__.lastStave = s;
        // do stuff
        return this;
    }
    /**
     * Adds a measure to every stave
     * @param {*} config 
     */
    addMeasure(...config){
        let s = this.latestStave;
        if(s)
            s.addMeasure(...config)
        return this;
    }
    /**
     * Adds a voice to the most recent stave
     */
    addVoice(...config){
        let m = this.latestStave;
        if(m)
            m.addVoice(...config);
        return this;
    }

    addChord(...config){
        let m = this.latestStave;
        if(m)
            m.addChord(...config)
        return this;
    }

    render(context){

        this.staves.forEach(m => {
            m.render(context)
        });
    }

    get latestStave(){
        return this.__private__.lastStave;
    }

    get firstStave(){
        return this.staves[0];
    }
}

module.exports = Instrument;