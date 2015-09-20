var X = require("../X");
var Widget = require('./Widget');

var PhysicsEngine = require('famous/physics/PhysicsEngine');
var FamousEngine = require('famous/core/FamousEngine');

var physics = require('famous/physics');
var math = require('famous/math');
var Box = physics.Box;
var Spring = physics.Spring;
var RotationalSpring = physics.RotationalSpring;
var RotationalDrag = physics.RotationalDrag;
var Quaternion = math.Quaternion;
var Vec3 = math.Vec3;

var Carousel = X.define('Carousel', {

    extend: Widget,

    initComponent: function() {

        this.currentIndex = 0;

        this.simulation = new PhysicsEngine();
        FamousEngine.requestUpdate(this);

        var resizeComponent = {
            onSizeChange: function(x, y, z) {
                this.defineWidth([x, y, z]);
            }.bind(this)
        };
        this._node.addComponent(resizeComponent);

        this.superclass.initComponent.apply(this, arguments);
    },

    defineWidth: function(size) {
        this.pageWidth = size[0];
    },
    onUpdate: function(time) {

        this.simulation.update(time)

        var page,
            physicsTransform,
            p,
            r;

        for (var i = 0, len = this.items.length; i < len; i++) {
            page = this.items[i];

            // Get the transform from the `Box` body
            physicsTransform = this.simulation.getTransform(page.box);
            p = physicsTransform.position;
            r = physicsTransform.rotation;

            // Set the `imageNode`'s x-position to the `Box` body's x-position
            page._node.setPosition(p[0] * this.pageWidth, 0, 0);

            // Set the `imageNode`'s rotation to match the `Box` body's rotation
            page._node.setRotation(r[0], r[1], r[2], r[3]);
        }


        // by queueing up our .onUpdate, we can be sure this will be called every frame
        FamousEngine.requestUpdateOnNextTick(this);

        //this.superclass.onUpdate.apply(this, arguments);

    },

    addItem: function(config) {
        
        //debugger;

        var item = this.superclass.addItem.apply(this, arguments);

        // A `Box` body to relay simulation data back to the visual element
        var box = new Box({
            mass: 100,
            size: [100, 100, 100]
        });

        var i = this.items.length;

        // Place all anchors off the screen, except for the
        // anchor belonging to the first image node
        var anchor = i === 0 ? new Vec3(0, 0, 0) : new Vec3(1, 0, 0);

        // Attach the box to the anchor with a `Spring` force
        var spring = new Spring(null, box, {
            period: 0.6,
            dampingRatio: 0.5,
            anchor: anchor
        });

        // Rotate the image 90deg about the y-axis,
        // except for first image node
        var quaternion = i === 0 ? new Quaternion() : new Quaternion().fromEuler(0, -Math.PI / 2, 0);

        // Attach an anchor orientation to the `Box` body with a `RotationalSpring` torque
        var rotationalSpring = new RotationalSpring(null, box, {
            period: 1,
            dampingRatio: 0.2,
            anchor: quaternion
        });

        // Notify the physics engine to track the box and the springs
        this.simulation.add(box, spring, rotationalSpring);

        X.apply(item, {
            box: box,
            spring: spring,
            quaternion: quaternion,
            rotationalSpring: rotationalSpring,
            anchor: anchor
        });

        return item;
    },

    pageChange: function(oldIndex, newIndex) {

        if (!this.pages) this.pages = this.items;

        if (oldIndex < newIndex) {
            this.pages[oldIndex].anchor.set(-1, 0, 0);
            this.pages[oldIndex].quaternion.fromEuler(0, Math.PI / 2, 0);
            this.pages[newIndex].anchor.set(0, 0, 0);
            this.pages[newIndex].quaternion.set(1, 0, 0, 0);
        }
        else {
            this.pages[oldIndex].anchor.set(1, 0, 0);
            this.pages[oldIndex].quaternion.fromEuler(0, -Math.PI / 2, 0);
            this.pages[newIndex].anchor.set(0, 0, 0);
            this.pages[newIndex].quaternion.set(1, 0, 0, 0);
        }
        this.currentIndex = newIndex;
    },
    onReceive: function(e, payload) {
        
        debugger;
        
        // Verify the event as being 'click' and the appropriate 'Node'
        //var isArrowClicked = (e === 'click') &&
        //  (payload.node.constructor === Arrow);
        if (true) {
            // var direction = payload.node.direction;
            // var amount = payload.node.amount;
            // amount = amount || 1;

            var direction = 1;
            var amount = 1;

            if (e === -1) direction = -1;

            var oldIndex = this.currentIndex;

            var i = oldIndex + (direction * amount);
            var min = 0;
            var max = this.items.length - 1;

            var newIndex = i > max ? max : i < min ? min : i;

            if (this.currentIndex !== newIndex) {
                this.currentIndex = newIndex;
                //this.dots.pageChange(oldIndex, this.currentIndex);
                this.pageChange(oldIndex, this.currentIndex);
            }
        }


    }
});

module.exports = Carousel;