import {Engine, Render, World, Bodies, Body, Events} from 'matter-js';

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

// create an engine
const engine = Engine.create();
engine.world.gravity.y = 0;

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        showAngleIndicator: true
    }
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 80, 80);
boxA.frictionAir = .1;

// add all of the bodies to the world
World.add(engine.world, [boxA]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

let boxAngularVelocity = 0;
let boxAVelocity = {x: 0, y: 0};

Events.on(engine, "afterUpdate", () => {
    // without test here we would kill the slippage immediately
    if(boxAngularVelocity != 0) {
        Body.setAngularVelocity(boxA, boxAngularVelocity);
    }

    // without test here we would kill the slippage immediately
    if(boxAVelocity.x != 0 || boxAVelocity.y != 0) {
        Body.setVelocity(boxA, boxAVelocity);
    }
})

const chair1 = {
    move: ({motionType, velocity}) => {
        switch (motionType) {
            case 'Rotation' :
                boxAngularVelocity = velocity * Math.PI / 6
                return;
            case 'Straight' :
                const x = velocity * Math.cos(boxA.angle - Math.PI);
                const y = velocity * Math.sin(boxA.angle - Math.PI);
                boxAVelocity = {x, y};
        }
    },
    stop: () => {
        boxAngularVelocity = 0;
        boxAVelocity = {x: 0, y: 0};
    },
    getPosition: () => ({
        x: boxA.position.x,
        y: boxA.position.y,
        bearing: toDegrees(boxA.angle) - 90
    })
}

const ChairControl = {
    getChairs: () => {
        return [chair1];
    }
}

window.ChairControl = ChairControl;