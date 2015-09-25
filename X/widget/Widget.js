var X = require("../X");

var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Align = require('famous/components/Align');

var PhysicsEngine = require('famous/physics/PhysicsEngine');
var FamousEngine = require('famous/core/FamousEngine');
var physics = require('famous/physics');
var math = require('famous/math');
var Box = physics.Box;
var Spring = physics.Spring;
var Vec3 = math.Vec3;


var Widget = X.define('X.widget.Widget', {

    html: '',//'Hello Famous',

    isComponent: true,

    //tagName:'div',

    constructor: function(config) {

        //debugger;

        var scene = config.addTo,
            node = scene.addChild();

        this._config = config;
        this._node = node;

        this.initComponent(config);

        X.apply(this, config);

        this._el = this.createDomElement(node);

        this.initSize(node);

        this.initStyles(node);

        this.initItems();


        this.initAnimations(config);


        this._node.addUIEvent('click');

        this._node.onReceive = function() {

            debugger;

            if (this.onReceive) this.onReceive.apply(this, arguments);

        }.bind(this);

        //alert(this.msg);

    },

    initComponent: function(config) {

        if (config.anim && config.anim.spring) {

            this._simulation = new PhysicsEngine();
            FamousEngine.requestUpdate(this);

            // A `Box` body to relay simulation data back to the visual element
            var box = new Box({
                mass: 100,
                size: [100, 100, 100]
                
            });

            //debugger;
            box.setPosition(0.5,0.5,-20); 
            
            
            // Place all anchors off the screen, except for the
            // anchor belonging to the first image node
            //var anchor = new Vec3(0.5, 0.5, -10);
            var anchor = new Vec3(config.align[0], config.align[1], config.align[2] || 0);

            // Attach the box to the anchor with a `Spring` force
            var spring = new Spring(null, box, {
                period: 0.6,
                dampingRatio: 0.7,
                anchor: anchor
            });

            this._simulation.add(box, spring);

            this.box = box;

            setTimeout(function() {
                //debugger;
                //anchor.set(config.align[0], config.align[1], config.align[2] || 0);

            }.bind(this), 1000)
        }



    },

    onUpdate: function(time) {

        this._simulation.update(time)

        var page,
            physicsTransform,
            p,
            r;

        // Get the transform from the `Box` body
        physicsTransform = this._simulation.getTransform(this.box);
        p = physicsTransform.position;

        // Set the `imageNode`'s x-position to the `Box` body's x-position
        //        this._node.setPosition(p[0] * this.pageWidth, 0, 0);
        this._node.setPosition(p[0] * window.innerWidth, p[1] * window.innerHeight, p[2] * 100);

        // by queueing up our .onUpdate, we can be sure this will be called every frame
        FamousEngine.requestUpdateOnNextTick(this);

    },
    createDomElement: function(node) {

        // Create an [image] DOM element providing the logo 'node' with the 'src' path
        var el;

        el = new DOMElement(node, {})
            .setContent(this.html)
            //.setProperty('background-color', 'blue')
        ;

        return el;
    },

    initSize: function(node) {

        // Chainable API
        //node
        // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
        //.setSizeMode('absolute', 'absolute', 'absolute')
        //.setAbsoluteSize(this.height || 250, this.width || 250)
        // Center the 'node' to the parent (the screen, in this instance)
        //.setAlign(0.5, 0.5)
        // Set the translational origin to the center of the 'node'
        //.setMountPoint(0.5, 0.5)
        // Set the rotational origin to the center of the 'node'
        //.setOrigin(0.5, 0.5);

        // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
        if (this.sizeMode) {
            node.setSizeMode(this.sizeMode[0], this.sizeMode[1], this.sizeMode[2])
        }
        else {
            node.setSizeMode('absolute', 'absolute', 'absolute')
        }

        if (this.size) {
            node.setAbsoluteSize(this.size[0], this.size[1], this.size[2]);
        }
        else if (this.height || this.width) {
            node.setAbsoluteSize(this.height, this.width);
        }
        else {
            node.setAbsoluteSize(250, 250);
        }

        if (this.position) {
            node.setPosition(this.position[0], this.position[1]);
        }

        if (!this.anim || !this.anim.spring) {
            // Center the 'node' to the parent (the screen, in this instance)
            if (this.align) {
                node.setAlign(this.align[0], this.align[1]);
            }
            else {
                //node.setAlign(0.5, 0.5);
            }

        }
        else if (this.align) {
            //debugger;
            node.setPosition(this.align[0] * window.innerWidth, this.align[1] * window.innerHeight);
        }

        // Set the rotational origin to the center of the 'node'
        if (this.origin) {
            node.setOrigin(this.origin[0], this.origin[1]);
        }
        else {
            //node.setOrigin(0.5, 0.5);
        }

        // Set the translational origin to the center of the 'node'
        if (this.mount) {
            node.setMountPoint(this.mount[0], this.mount[1]);
        }
        else {
            //node.setMountPoint(0.5, 0.5);
        }


    },

    initStyles: function(node) {

        if (this.style) {
            for (var key in this.style) {
                this._el.setProperty(key, this.style[key]);
            }
        }

    },

    initItems: function() {

        var _items = this.items || [];

        this.items = [];

        //debugger;

        _items.forEach(function(item) {

            if (this.defaults) {
                X.applyIf(item, this.defaults);
            }

            this.items.push(this.addItem(item));

        }.bind(this));

        // for (var item in _items) {
        // this.items.push(this.addItem(item));
        // }

        //this.items = _items;
    },

    addItem: function(item) {

        //debugger;

        var config = {

            addTo: this._node,
            //html: item.html,

            // sizeMode: ['default', 'absolute'],
            sizeMode: ['default', 'absolute', 'default'],
            height: 100,
            width: null,

            //align: [0, 0.5],
            //mount: [0, 0.5],
            //origin: [0.5, 0.5],
            // position: [0, 100 * this.items.length, -10],

            anim: {
                spin: false
            },
            style: {
                'background-color': 'white',

                'boxSizing': 'border-box',
                'lineHeight': '100px',
                'borderBottom': '1px solid black',
                'font-size': '12px'
            }

        };

        if (this.layout === 'list') {
            config.position = [0, 100 * this.items.length, -10];
        }

        X.apply(config, item);

        var cmp;
        
        if (config.nodeType === 'iframe'){
            cmp = new Iframe(config);
        }
        else {
            cmp = new Widget(config);   
        }

        return cmp;

        /*
                var _item = this._node.addChild()
                    .setSizeMode('default', 'absolute')
                    .setAbsoluteSize(null, 100)
                    .setPosition(0, 100 * this.items.length)
                    //.setContent(item.html)
                ;

                new DOMElement(_item, {})
                    .setContent(item.html)
                    .setProperty('background-color', 'white');

                return _item;
        */
    },


    initAnimations: function(config) {

        if (config.anim && config.anim.spin) {
            this.spin(this._node);
        }

        this._position = new Position(this._node);

        this._align = new Align(this._node);

    },

    spin: function(node) {
        // Add a spinner component to the logo 'node' that is called, every frame
        var spinner = node.addComponent({
            onUpdate: function(time) {
                node.setRotation(0, time / 1000, 0);
                node.requestUpdateOnNextTick(spinner);
            }
        });

        // Let the magic begin...
        node.requestUpdate(spinner);
    }

});




module.exports = Widget;