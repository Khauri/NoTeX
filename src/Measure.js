/**
 * Measure.js
 * ----------
 * Why extend VexFlow.Stave when this is a measure?
 * Because someone at VexFlow dun goofed
 */
const 
    _               = require("./helpers"),
    VexFlow         = require('vexflow').Flow,
    Voice           = require('./Voice')
;

class Measure extends VexFlow.Stave{
    constructor(...props){
        super(...props)
        _.extendSafe(this,
            {
                voiceCount : 0,
                voices : [],
                isFirst : true,
                repeat : false,
                repeatCount : 1
            },
            ...props,
            {
                __private__ : {
                    lastVoice : null
                }
            }
        );
        for(let i = 0; i < this.voiceCount; i++)
            this.addVoice();
    }

    addVoice(v){
        super.addVoice && super.addVoice(v);
        if(!v || _.isObject(v))
            v = new Voice(v);
        else if(!(v instanceof VexFlow.Voice))
            throw new TypeError("voice not instance of Voice or configuration object");

        v.measure = this;
        v.stave = this.stave;
        v.instrument = this.instrument;
        v.score = this.score;

        this.voices.push(v);
        this.__private__.lastVoice = v;
        return this;
    }

    addChord(...config){
        let v = this.latestVoice;
        if(v)
            v.addChord(...config);
        return this;
    }

    get latestVoice(){
        return this.__private__.lastVoice ||
            this.voices[this.voices.length - 1];
    }

    render(context){
        // draw the bars
        this.setContext(context);
        this.addClef(this.clef);
        this.addTimeSignature(this.time_signature || "4/4")
        this.draw();
        // draw the voices
        new VexFlow.Formatter().joinVoices(this.voices).format(this.voices, 400);
        this.voices.forEach(v=>{
            v.draw(context, this);
        })
    }

}

module.exports = Measure;