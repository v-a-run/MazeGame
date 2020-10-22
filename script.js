//_ Boilerplate for any Matter.js Project //
const {Engine, World, Render, Runner, Bodies} = Matter; //. Destructuring from global Matter object.

//- creating objects
const engine = Engine.create();
const { world } = engine;

const render = Render.create({
    engine : engine,
    element : document.body,
    options : {
        width : 800,
        height : 600
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

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
World.add(world, Bodies.rectangle(200,200, 20, 20))

