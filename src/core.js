const
    Score       = require('./Score'),
    parser      = require('./NoteXParser')
;

// load a hard-coded test file
let example = require('./example.js');

let score = Score.fromJSON(example, {});
// append score to body
document.body.appendChild(score.view);

score.render();

console.log(score);

module.exports = {
    Score,
    baseURL : "/"
}