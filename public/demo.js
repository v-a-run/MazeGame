//! NOT CONNECTED TO ANY HTML FILE //
//! Just for Experiment purpose //

//_ Boilerplate for any Matter.js Project //
const {Engine, World, Render, Runner, Bodies, Mouse, MouseConstraint} = Matter; //. Destructuring from global Matter object.

//- creating objects
const engine = Engine.create();
const { world } = engine;

const width = 800;
const height = 600;

const render = Render.create({
    engine : engine,
    element : document.body,
    options : {
        width,
        height,
        wireframes : false      //* to apply color to shapes, we set to false
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

//# Creating walls made of 4 rectangles //
const walls = [
        //. first 2 parameters = for center of shape
        //- last 2 parameters = for width & height
        //_ By Default GRAVITY is enabled, to disable isStatic : true is used
    Bodies.rectangle(400, 0, 800, 40, {isStatic : true}),
    Bodies.rectangle(400, 600, 800, 40, {isStatic : true}),
    Bodies.rectangle(0, 300, 40, 600, {isStatic : true}),
    Bodies.rectangle(800, 300, 40, 600, {isStatic : true})
];

World.add(world, walls)     //* Without adding to World, walls will not show up //

//. Genearting Random Shapes
for (let i=0; i<50; i++) {
    if(Math.random() > 0.5){
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50))
    }else{
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 37, {
            render : {
                fillStyle: 'pink'   //- To set color of shapes
            }
        }))
    }
}


