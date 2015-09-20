var Widget = require('./Widget');
var DOMElement = require('famous/dom-renderables/DOMElement');


var Image = X.define('X.widget.Image', {

    extend:Widget,

    isImage: true,
    
    tagName:"img",

    constructor: function(config) {
        
        //debugger;

        if (!config.src){
            config.src = './images/famous_logo.png';
        }

        this.html = "";

        this.superclass.constructor.apply(this, arguments);
    },

    createDomElement: function(node) {

        // Create an [image] DOM element providing the logo 'node' with the 'src' path
        var el;

        if (this.tagName) {

            el = new DOMElement(node, {
                    tagName: this.tagName
                })
                .setAttribute('src', this.src);

        }
        else {
            el = this.superclass.createDomElement.apply(this, arguments);
        }

        return el;
    }

});


module.exports = Image;


//old

/*
var Image = function(config) {

    debugger;

    this.msg = "Image";

    this.superclass.constructor.apply(this, arguments);
    //Component.apply(this, arguments);

}


$$.extend(Image, Component);

Image.prototype.isImage = true;
*/