module.exports = 
{
    author : "Khauri",
    title : "Unwritten",
    clef : "treble",
    connect_staves : true,
    num_beats : 4,
    beats_value : 4,
    strict : true, // turn on/off strict mode
    instruments : [
        {
            name : "Piano",
            staves : [
                {
                    measures : [
                        {
                            voices : [
                                {
                                    // note strings or one giant string or array of strings
                                    notes : ["c4/q e4/q g4/q", "d4/q", "e4/q", "f4/q"] 
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}