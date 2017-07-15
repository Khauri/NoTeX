/**
 * Adds the CSS and adds a minimal WYSIWYG editor
 */
const
    Score       = require('./Score'),
    stringify   = require("json-stringify-pretty-compact"),
    parser      = require('./NoteXParser')
;

// load a hard-coded test file
let 
    example = require('./example.js'),
    example_str = stringify(example, {maxLength : 60}),
    score = null,
    input_cont = document.querySelector('.input_cont'),
    output_cont = document.querySelector('.output_cont'),
    error_msg_cont = document.querySelector('.err'),
    update_timer = 500, // half a second
    timeout;

function reset(){
    score = Score.fromJSON(example, {}).render();
    input_cont.value = example_str;
    output_cont.innerHTML = "";
    output_cont.appendChild(score.view);
}

function update(){
    let json;
    try{
        json = JSON.parse(input_cont.value)
    }catch(e){
        error_msg_cont.classList.remove("green");
        error_msg_cont.innerHTML = "JSON Parse Error";
        return false;
    }
    // current strategy is to throw away contents of output_cont
    // and refresh it
    try{
        score = Score.fromJSON(json).render();
        output_cont.innerHTML = "";
        output_cont.appendChild(score.view);
    }catch(e){
        console.log(e);
        error_msg_cont.classList.remove("green");
        error_msg_cont.innerHTML = "Score Format Error";
        return false;
    }
    error_msg_cont.classList.add("green");
    error_msg_cont.innerHTML = "OK";
}

input_cont.addEventListener('keydown', function(e){
    // intercept and insert two spaces as tab
    let spaces = 2;
    if(e.keyCode == 9 || e.which == 9){
        e.preventDefault();
        this.focus();
        var s = this.selectionStart;
        let value  = " ".repeat(spaces)
                   + this.value.substring(s, this.selectionEnd);
        this.selectionEnd = s;
        document.execCommand && document.execCommand('insertText', false, value); 
    }
})

input_cont.addEventListener('input', e => {
    clearTimeout(timeout);
    timeout = setTimeout(update, update_timer);
})

document.querySelector(".reset_btn").addEventListener("click", e=>{
    reset();
})

reset();

module.exports = {
    Score,
    baseURL : "/"
}