//_ Boilerplate for any Matter.js Project //
const {Engine, World, Render, Runner, Bodies, Body, Events} = Matter; //. Destructuring from global Matter object.

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight*0.99;
const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertical;

//- creating objects
const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;

const render = Render.create({
    engine : engine,
    element : document.body,
    options : {
        width,
        height,
        wireframes : false
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//# Creating walls made of 4 rectangles //
const walls = [
        //. first 2 parameters = for center of shape
        //- last 2 parameters = for width & height
        //_ By Default GRAVITY is enabled, to disable isStatic : true is used
    Bodies.rectangle(width/2, 0, width, 2, {isStatic : true}),
    Bodies.rectangle(width/2, height, width, 2, {isStatic : true}),
    Bodies.rectangle(0, height/2, 2, height, {isStatic : true}),
    Bodies.rectangle(width, height/2, 2, height, {isStatic : true})
];

World.add(world, walls);     //* Without adding to World, walls will not show up //

//. Creating Maze //
const shuffle = (arr) => {
    let count = arr.length;

    while(count > 0){
        const index = Math.floor(Math.random() * count);
        count--;
        const temp = arr[count];
        arr[count] = arr[index];
        arr[index] = temp; 
    }
    return arr;
}

const grid = Array(cellsVertical)
.fill(null)
.map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
.fill(null)
.map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
.fill(null)
.map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

const mazeCreation = (row, col) => {
    //# If cell is already visited then return
    if(grid[row][col]){
        return;
    }

    //. Otherwise, mark this cell as visited
    grid[row][col] = true;

    //_ Generate randomly ordered list of neighbours
    const neighbours = shuffle([
        [row-1, col, 'up'],
        [row, col+1, 'right'],
        [row+1, col, 'down'],
        [row, col-1, 'left']
    ])

    //- For each neighbour :
    for (let neighbour of neighbours) {
        
        const[nextRow, nextCol, direction] = neighbour;

        //* If it is out of bounds, continue to next neighbour.
        if
            (nextRow<0 || 
            nextRow>=cellsVertical || 
            nextCol<0 || 
            nextCol>=cellsHorizontal){
            continue;
        }

        //_ If it is already visited, continue to next neighbour.
        if(grid[nextRow][nextCol]){
            continue;
        }

        //# Remove a wall either from horizontals or verticals.
        if(direction === 'left'){
            verticals[row][col-1] = true;
        }else if(direction === 'right'){
            verticals[row][col] = true;
        }else if(direction === 'up'){
            horizontals[row-1][col] = true;
        }else if(direction === 'down'){
            horizontals[row][col] = true;
        }

        //. Visit the cell
        mazeCreation(nextRow,nextCol);
    }
};

mazeCreation(startRow, startCol);

//- Creating horizontal walls of MAZE :
horizontals.forEach((rows, rowIndex) => {
    rows.forEach((open, colIndex) => {
        if(open){
            return;
        }

        //* Draw walls if open = false
        const walls = Bodies.rectangle(
            (colIndex + 0.5) * unitLengthX,      //_ x-value of centre
            (rowIndex + 1) * unitLengthY,        //. y-value of centre
            unitLengthX,                         //_ width of rectangle
            5,                                  //. height of rectangle
            {
                label: 'walls',
                isStatic: true,
                render : {
                    fillStyle : 'crimson'
                }
            }
        );
        World.add(world, walls);
    })
});

//# Creating vertical walls of MAZE :
verticals.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if(open){
            return;
        }

        //* Draw walls if open = false
        const walls = Bodies.rectangle(
            (colIndex + 1) * unitLengthX,
            (rowIndex + 0.5) * unitLengthY,
            5,
            unitLengthY,
            {
                label: 'walls',
                isStatic: true,
                render : {
                    fillStyle : 'crimson'
                }
            }
        );
        World.add(world, walls);
    })
});

//* Creating the goal
const goal = Bodies.rectangle(
    width - unitLengthX/2,
    height - unitLengthY/2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        isStatic: true,
        label: 'goal',
        render : {
            fillStyle : 'lime'
        }
    }
);
World.add(world, goal);

//_ Creating the ball
const ballRadius = Math.min(unitLengthX,unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX/2,           //- x-value of centre
    unitLengthY/2,           //# y-value of centre
    ballRadius,              //- radius of circle
    {
        label: 'ball',
        render : {
            fillStyle : 'gold',
        }
    }
);
World.add(world, ball);

document.addEventListener("keydown", event => {
    const {x, y} = ball.velocity;

    if(event.key === "ArrowDown" || event.key === "s"){
        Body.setVelocity(ball, { x, y : y+5});
    }
    if(event.key === "ArrowUp" || event.key === "w"){
        Body.setVelocity(ball, { x, y : y-5});
    }
    if(event.key === "ArrowLeft" || event.key === "a"){
        Body.setVelocity(ball, { x: x-5, y});
    }
    if(event.key === "ArrowRight" || event.key === "d"){
        Body.setVelocity(ball, { x: x+5, y});
    }
})

//* User WINS 
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];

        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            document.querySelector(".winner").classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label === "walls"){
                    Body.setStatic(body, false);
                }
            })
        }
    })
})

//? Play Again button
const reload = document.querySelector('.reload');
reload.addEventListener('click', () => {
    window.location.reload();
});