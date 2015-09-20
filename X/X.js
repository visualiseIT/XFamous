

/***************************************************************
 * Helper functions for older browsers
 ***************************************************************/
if (!Object.hasOwnProperty('create')) {
    Object.create = function(parentObj) {
        function tmpObj() {}
        tmpObj.prototype = parentObj;
        return new tmpObj();
    };
}

/***************************************************************
 * Framework code
 ***************************************************************/



var X = {

    extend: function(child, parent) {

        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        
        //save ref to parent class
        child.prototype.superclass = parent.prototype;

    },

    define: function(name, config) {

        //debugger;
        
        var Class;

        if (!config.hasOwnProperty('constructor')) {
            config.constructor = function () {
                if (this.superclass) this.superclass.constructor.apply(this, arguments);
            };
            //config.constructor.name = name; //doesn't work. todo: find work around.
        }

        Class = config.constructor;

        if (!config.extend) config.extend = Object; 
        
        this.extend(Class, config.extend);

        this.apply(Class.prototype, config);

        window[name] = Class;

        return Class;
    },

    apply: function(target, source) {

        for (var key in source) {
            target[key] = source[key];
        }

    },

    applyIf: function(target, source) {

        for (var key in source) {
            if (!target[key]) target[key] = source[key];
        }

    }
};




module.exports = X;

/*
//---http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript#1598077
Function.prototype.subclass = function(base) {
    var c = Function.prototype.subclass.nonconstructor;
    c.prototype = base.prototype;
    this.prototype = new c();
};
Function.prototype.subclass.nonconstructor = function() {};
*/

