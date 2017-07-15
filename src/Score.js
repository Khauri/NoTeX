/**
 * Score.js
 * --------
 * More or less wraps VexFlow with a more low level API
 * I appreciate 0xfe for designing VexFlow, but his API 
 * wasn't made for people who ain't got time fo all dat
 * 
 * Notes for me:
 *  If a chard/note gets added or removed, then we may
 *  need to re-render the whole score to compensate for
 *  bars getting moved around. That or we have two modes:
 *  a "delete" that replaces it with a rest and a "ripple
 *  delete" that re-renders the score.
 * 
 * @author Khauri
 */

const 
    _               = require('./helpers'),
    VexFlow         = require('vexflow').Flow,
    Component       = require('./Component'),
    Instrument      = require('./Instrument'),
    Chord           = require('./Chord'),
    Voice           = require('./Voice'),
    Measure         = require("./Measure"),
    Stave           = require('./Stave')
;


class Score{
    constructor(...props){
        _.extend(this, {
            author : "Unknown Person",
            arranger : "Unknown Person",
            baseClass : "NoTeX_View",
            beats_value : 4,
            clef : "treble",
            connect_staves : true,
            context : null,
            /**
             * The max-height of the score,
             * undefined or "auto" sets it to height of view
             */
            height : "auto",
            // whether or not to indent the first line
            indent : false,
            // starting number of instruments
            instrumentCount : 0,
            key_signature : undefined,
            num_beats : 4,
            page : {
                fontFamily: "Times New Roman",
                fontSize : 20,
                format : "one_line",
                width : 2550, // standard paper width
                height : 3300, // standard paper height
                scale : .25,
                indent : 200, // amount to indent first stave
                margin_top : 400,
                margin_left : 200,
                margin_bottom : 100,
                margin_right : 200
            },
            renderer : null,
            scale : 1,
            strict : true,
            title : "Unwritten Score",
            view : null,
            /**
             * 
             */
            width : "auto"
        }, 
        ...props,
        {
            changes : 0,
            instruments : [],
            __private__ : {
                y : 100,
                events : {
                    "change" : [],
                    "note_added" : [],
                    "note_removed" : [],
                    "render" : []
                },
                lastInstr : null,
                lastStave : null,
                lastMeasure : null,
                lastVoice : null
            }
        });

        this._init();
        // Every score has at least one instrument so let's hit it
        for(let i = 0, count = this.instruments.length; i < count; i++)
            this.addInstrument(); 
    }

    _init(){
        if(!(this.view instanceof HTMLElement))
            this.view = document.createElement('view');
        this.view.classList.add(`${this.baseClass}`);
        this.renderer = new VexFlow.Renderer(this.view, VexFlow.Renderer.Backends.SVG);
        this.context = this.renderer.getContext();
        let width = this.page.width * this.page.scale,
            height = this.page.height * this.page.scale;
        this.renderer.resize(width, height);
    }

    addEventListener(e, cb){
        if(typeof cb !== "function")
            return this;
        if(typeof e == "string" && (e = e.toLowerCase()))
            if(!this.__private__.events[e])
                this.__private__.events[e] = [];
            this.__private__.events[e].push(cb);
        return this;
    }

    removeEventListener(e, cb){
        if(typeof cb !== "function")
            return this;
        if(typeof e == "string" && (e = e.toLowerCase()))
            if(!this.__private__.events[e])
                return this;
            this.__private__.events[e].filter(f=>{return f == cb})
        return this;
    }

    callEventListeners(e, eventData){
        let packet = Object.assign({cancel : false}, eventData)
        if(typeof e == "string" && (e = e.toLowerCase()))
            if(!this.__private__.events[e])
                return this;
            this.__private__.events[e].forEach(f=>{
                if(packet.cancel === true)
                    return;
                let result = f.call(this, packet);
                if(result === false)
                    packet.cancel = true;
            })
        return this;
    }
    /**
     * Add an instrument
     */
    addInstrument(i){
        if(!i || _.isObject(i))
            i = new Instrument(i);
        else if(!(i instanceof Instrument))
            throw new TypeError("Not instrument or configuration object"); 

        i.score = this;

        this.instruments.push(i);
        this.__private__.lastInstr = i;
        return this;
    }
    /**
     * Gets the most recent instrument added and
     * adds a stave to it. The stave will be the
     * same length as all other staves
     */
    addStave(...config){
        let i = this.latestInstrument;
        if(i)
            i.addStave(...config);
        else
            throw new Error("At least one instrument must exist")
        return this;
    }
    /**
     * Adds a measure for each stave
     */
    addMeasure(...config){
        let bb = this.boundingBox;
        let i = this.latestInstrument;
        let x = bb.left + this.page.indent * this.page.scale,
            y = this.__private__.y,
            width = this.__private__.width || 400;
        // if x + width outside of bounding box(?)
        if(i)
            i.addMeasure(x * this.scale, y * this.scale, width, ...config);
        this.__private__.y += 100;
        return this;
    }
    /**
     * Gets the most recent stave added and
     * adds a voice to it
     */
    addVoice(...config){
        let i = this.latestInstrument;
        if(i)
            i.addVoice(...config);
        return this;
    }
    /**
     * Gets the most recent voice added and 
     * adds a chord to it. 
     * @param {boolean} ripple - If the chord can't be added to the most recent voice
     *                           then create a new measure and add it there
     */
    addChord(...config){
        let i = this.latestInstrument;
        if(i)
            i.addChord(...config)
        return this;
    }

    walk(cb, speed){
        /**
         // Iterates from small to large
         let chord, voice, measure, stave, instrument, score = this;
         function getNext(){
             // do stuff to get next shit
            cb(chord, voice, measure, stave, instrument, score);
         }
         setInterval(getNext, speed);
        */
    }

    render(){
        console.log(this);
        let bb = this.boundingBox;
        // the job of this renderer is just to draw the instruments
        this.instruments.forEach(i=>{
            i.render && i.render(this.context);
        })
        // draw the title and what not
        let metrics = this.context.measureText(this.title);
        console.log(metrics);
        this.context.setFont(this.page.fontFamily, this.page.fontSize);
        this.context.setFillStyle("#000000");
        this.context.fillText(this.title, bb.width/2, bb.top);
        return this;
    }
    /**
     * Serialize this score
     */
    toJSON(){
        return {};
    }
    /**
     * Calculates x, y, width, and height
     * including padding and margins
     */
    get boundingBox(){
        let scale = this.page.scale;
        let width = this.page.width - this.page.margin_left - this.page.margin_right,
            height = this.page.height - this.page.margin_top - this.page.margin_bottom,
            top = this.page.margin_top,
            left = this.page.margin_left;

        width *= scale;
        height *= scale;
        top *= scale; 
        left *= scale;

        return { width, height, top, left }
    }

    get latestInstrument(){
        return this.__private__.lastInstr || 
            this.instruments[this.instruments.length - 1]
    }
    /**
     * Returns all the bars
     */
    get Bars(){

    }
    /**
     * Returns all the instruments
     */
    get Instruments(){

    }
    /**
     * Gets all the Staves
     */
    get Staves(){

    }
    /**
     * Gets all the voices
     */
    get Voices(){

    }
    /**
     * Updates the entire score (shouldn't be necessary usually)
     */
    /*
    update(){

    }
    */
    /**
     * @param {Obj} options - Add some settings
     */
    static fromJSON(json, options){
        // create the score
        let score = new Score(json, options);
        // These will all bubble downward
        let 
            clef            = score.clef || "treble",
            num_beats       = score.num_beats || 4,
            beat_value      = score.beat_value || 4,
            time_signature  = score.time_signature || "4/4"
        ;
        // Iterate through instruments
        json.instruments.forEach((i)=>{
            clef            = i.clef || clef;
            beat_value      = i.beat_value || beat_value;
            name            = i.name;
            num_beats       = i.num_beats || num_beats;

            score.addInstrument({clef, name, num_beats, beat_value});
            // Iterate through staves
            i.staves.forEach((s)=>{
                clef            = s.clef || clef;
                num_beats       = s.num_beats || num_beats;
                beat_value      = s.beat_value || beat_value;

                score.addStave({clef, num_beats, beat_value})
                // iterate through measures
                s.measures.forEach(m =>{
                    score.addMeasure({clef}); // I don't like unnamed parameters like this
                    // Iterate through voices
                    m.voices.forEach((v)=>{
                        clef            = v.clef || clef;
                        num_beats       = v.num_beats || num_beats;
                        beat_value      = v.beat_value || beat_value;
                        
                        //s.VFVoices.push(voice);

                        score.addVoice({clef, num_beats, beat_value});
                        // iterate through notes
                        v.notes.forEach((n, note_index)=>{
                            if(!n || typeof n != "string")
                                if(n.constructor == Array)
                                    n = n.join("&")
                                else
                                    throw new TypeError("Notes currently can only be represented as string or array of strings")
                            score.addChord(n, {clef})
                        });
                    })
                })
            })
        })
        return score;
    }

    /**
     * Parse a string 
     */
    static fromString(){

    }
    /**
     * Parse a Music XML document
     */
    static fromMML(){

    }
}

module.exports = Score;