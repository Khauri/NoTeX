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
                                    notes : ["c4/q", "d4", "e4", "f4"] 
                                }
                            ]
                        }
                    ]
                },
                {
                    clef : "bass",
                    measures : [
                        {
                            voices : [
                                {
                                    // note strings or one giant string or array of strings
                                    notes : ["c3/h", "c3/h"] 
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
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
    }
}