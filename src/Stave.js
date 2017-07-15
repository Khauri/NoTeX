/**
 * Stave.js
 * ----------
 * The stave should ideally know it's current width
 * if that width is more than the bounds it should 
 * get the next line location from parent(?)
 */

const 
    _               = require('./helpers'),
    VexFlow         = require('vexflow').Flow,
    Measure         = require('./Measure')
;

class Stave{
    constructor(...props){
        _.extend(this,
            {
                left : 0,
                measures : [],
                // the number of measures to automatically generate
                measureCount : 0,
                top : 0,
            },
            ...props,
            {
                __private__ : {
                    lastMeasure : null
                }
            }
        );

        for(let i=0; i<this.measureCount; i++)
            this.addMeasure();
    }
    /**
     * Adds a measure
     * @param {*} m 
     */
    addMeasure(...m){
        if(!(m[0] instanceof Measure))
            m = new Measure(...m);
        else if(!(m instanceof Measure))
            throw new Error("Not a measure or configuration object");
        
        m.stave = this;
        m.instrument = this.instrument;
        m.score = this.score;

        this.measures.push(m);
        this.__private__.lastMeasure = m;
        return this;
    }
    /**
     * Adds a voice to the most recently created measure
     * @param {*} config 
     */
    addVoice(...config){
        let m = this.latestMeasure;
        if(m)
            m.addVoice(...config);
        return this;
    }
    /**
     * Adds a chord to the most recently added voice
     * @param {*} config 
     */
    addChord(...config){
        let m = this.latestMeasure;
        if(m)
            m.addChord(...config);
        return this;
    }
    
    get latestMeasure(){
        return this.__private__.lastMeasure || 
            this.measures[this.measures.length - 1];
    }

    render(context){
        this.measures.forEach(m => {
            m.render(context)
        })
    }

}

module.exports = Stave;