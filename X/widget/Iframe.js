var Widget = require('./Widget');
var DOMElement = require('famous/dom-renderables/DOMElement');


var Iframe = X.define('Iframe', {

    extend: Widget,

    isIframe: true,

    tagName: "iframe",

    constructor: function(config) {

        debugger;

        if (!config.src) {
            config.src = './images/famous_logo.png';
        }

        this.html = "";

        this.superclass.constructor.apply(this, arguments);
    },

    createDomElement: function(node) {

        // Create an [image] DOM element providing the logo 'node' with the 'src' path
        var el;

        if (this.tagName) {

            el = new DOMElement(
                    node, {
                        tagName: 'iframe'
                    })
                .setAttribute('src', this.src)
                .setProperty('overflow', 'hidden')
                .setProperty('border', 'none');

        }
        else {
            el = this.superclass.createDomElement.apply(this, arguments);
        }

        return el;
    }

});


module.exports = Iframe;
