/**
 * NoteXParser.js  
 * --------------  
 * NoteX is a dumb format I created in order to compress the   
 * representation of a note into a string. The string can be  
 * parsed using regex. The parser can be case insensitive.  
 *   
 * TODO:  
 *      1. Add Glypgh Support  
 *      2. Add sharp and flat unicode symbol support  
 *      3. Add emoji support (because why the fuck not?)  
 *      4. Perform validation to make NoteX parser more strict(?)  
 * 
 * Format:  
 *   NoteX   
 *   <MOD><MOD>[Note]<Accidental><octave></[value]><MOD><MOD><...[separator][NoteX]>  
 *      The Main NoteX Syntax. See below for more specifics details.  
 *   <key>            
 *      This key is optional inside the scope.   
 *      Creates a scope.  
 *   [key]  
 *      This key is required inside the scope.  
 *      Not including it throws an error, so don't do it bro.  
 *      Creates a scope.  
 *   MOD [~-]  
 *      ~   = Indicates this note has a tie.  
 *            Placed at the beginning it means it's tied from the last  
 *            note with a tie placed at the end. Vice versa for at the end.  
 *      -   = Indicates this note has a bar.  
 *            Follows placement rules of ties.       
 *   Note [a-grx]  
 *      a-g = A standard key  
 *      r   = Rest  
 *      x   = ???   
 *   Accidental [#bknos]+
 *      The accidental
 *      s#  = Sharp
 *      n   = Natural
 *      b   = Flat
 *      k   = ???
 *      o   = ???
 *   Octave -?\d+
 *      The Note's octave. Can be a negative number.
 *   Value /[\dqhwrd]+
 *      The note value or duration.
 *      \d  = Any number
 *            If not combined with other values represents
 *            the inverse of the number. (i.e. 1/number)
 *      q   = Quarter Note
 *      h   = Half note
 *      w   = Whole note
 *   Seperator [&,\s]
 *      If the note is a chord, the seperator seperates notes in
 *      that chord.
 * 
 * Examples:
 * C
 * C#
 * C#4
 * C##4
 * C##4/q
 * C##4/16
 * C##4/8d
 * -~C##4/8d~-
 * ~-C##4/8d~- & E#4
 * 
 * @author Khauri
 */
const NoteXPattern = /([~-])?([~-])?(([a-grx])([#bknos]+)?)(-?\d+)?(\/([\dqhwrd]+))?([~-])?([~-])?/i;

/**
 * Parse NoteX format to JSON  
 * **NOTE**  
 * The rules of the parser are pretty loose. The Value should be validated after
 * receiving the response to determine if it matches the format you would like. One issue
 * currently is that sharps and flats won't be automatically converted. E# and F, for example.
 * This can be fixed easily...but I'm not getting paid for this so...
 * @param {str} str - String
 */
function noteXToJSON(str, format){
    let strArr;
    // Split by spaces, &, and commas
    strArr = str.split(/[&,\s]/gi) 
        .filter((str)=>{
            return str;
        })
        .map((str)=>{
            let [full, fromMod1, fromMod2, note, rootNote, acc, oct, , val = 'q', toMod1, toMod2] = 
                str.match(NoteXPattern) || [];
            
            if(format){
                // do formatting stuff here
            }
                
            return {
                full,
                rootNote,
                note,
                acc,
                barFrom : fromMod1 == "-" || fromMod2 == "-",
                barTo   : toMod1 == "-" || toMod2 == "-",
                tieFrom : fromMod1 == "~" || fromMod2 == "~",
                tieTo   : toMod1 == "~" || toMod2 == "~",
                oct : parseInt(oct) || oct,
                val : val || val
            }
        });
    return strArr;
}

function JSONToNoteX(json){
    return "";
}
/**
 * Parse a line
 * Assume a line of NoteX ends with a newline character, EOF, or semicolon
 */
function praseLine(){

}

module.exports = {
    noteXToJSON : noteXToJSON,
    JSONToNoteX : null
}