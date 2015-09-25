var X = require("xfamous");

X.init();

X.addWidget({
        html: 'xFamous',
        position: [-200, -200]
    });

    X.addWidget({

        height: 400,
        width: 400,

        anim: {
            spin: true,
            spring: true
        },
        style: {
            'background-color': 'lightblue',
            'overflow-y': 'scroll',
            'overflow-x': 'hidden'
        },
        items: [{
            html: 'Hello World!',
            position:[100,100],
            //align:[0.5,0.5],
            style: {
                'background-color': 'white'
            }

        }]
    });