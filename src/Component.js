const _ = require('./helpers');

class Component {
    constructor(...props){
        _.extend(this, ...props);
    }
    /** Update this component */
    update(){

    }

    addEventListener(){

    }
}

module.exports = Component;