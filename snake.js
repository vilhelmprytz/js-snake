// js-snake
// (c) Vilhelm Prytz 2019 - vilhelm@prytznet.se www.vilhelmprytz.se

// screen: 600*600
// each block: 40*40
// block: 15 * 15

score = 0;

player = {
    "x": 7,
    "y": 7,
    "direction": 0,
    "length": 0,
    "dead": false,
    "tail": []
};

food_objects = [];

function return_coordinate_operation(direction) {
    // update coordinates
    var x_operation = 0;
    var y_operation = 0;

    if (direction == 0) {
        // up
        var y_operation = -1;
    } else if (direction == 1) {
        // down
        var y_operation = 1;
    } else if (direction == 2) {
        // left
        var x_operation = -1;
    } else if (direction == 3) {
        // right
        var x_operation = 1;
    };

    return {x_operation, y_operation};
};

function update() {
    // calculate coordinate operation
    var {x_operation, y_operation} = return_coordinate_operation(player.direction);

    // perform operation on player coordinate
    player.x = player.x + x_operation;
    player.y = player.y + y_operation;

    // move tail
    player.tail.forEach(function (tail, index) {
        if (index == 0) {
            {x_operation, y_operation} = return_coordinate_operation(tail.direction);
            
            tail.x = tail.x+x_operation;
            tail.y = tail.y+y_operation;
        } else {
            console.log(player.tail[index-1]);
            tail.x = player.tail[index-1].x;
            tail.y = player.tail[index-1].y;
        };
    });

    // check for collisions
    food_objects.forEach(function (food, index) {
        if(player.x == food.x && player.y == food.y) {
            food_objects.splice(index, 1);
            create_food();
            create_tail();
            score++;
        };
    });

    // check if outside boundaries
    if (player.x >= 15) {
        player.dead = true;
    } else if (player.x <= -1) {
        player.dead = true;
    } else if (player.y <= -1) {
        player.dead = true;
    } else if (player.y >= 15) {
        player.dead = true;
    };

    // run draw function
    draw_player();
    draw_tail();
    draw_food();
};

function create_food() {
    var new_x = Math.floor(Math.random() * 14) + 1;
    var new_y = Math.floor(Math.random() * 14) + 1;

    var new_food = {
        "x": new_x,
        "y": new_y
    };

    food_objects.push(new_food);
};

function create_tail() {
    player.length++;

    var {x_operation, y_operation} = return_coordinate_operation(player.direction);

    var new_tail = {
        "x": player.x - x_operation,
        "y": player.y - y_operation,
        "direction": player.direction
    }

    player.tail.push(new_tail);
};

function draw_player() {
    const player_element = document.querySelector(".player");

    // set x
    player_element.style.left = `${player.x * 40}px`;

    // set y
    player_element.style.top = `${player.y * 40}px`;
};

function draw_tail() {
    const all_tail = document.querySelector(".all-tail");

    // clear/remove
    while (all_tail.firstChild) {
        all_tail.removeChild(all_tail.firstChild);
    };

    // for every tail
    player.tail.forEach(function (tail) {
        var element = document.createElement("div");
        
        // add style
        element.classList.add("player");
        
        // set coordinates
        element.style.left = `${tail.x * 40}px`;
        element.style.top = `${tail.y * 40}px`;

        all_tail.appendChild(element);
    });
};

function draw_food() {
    // remove all food
    const all_food = document.querySelector(".all-food");
    while (all_food.firstChild) {
        all_food.removeChild(all_food.firstChild);
    };

    // for every food
    food_objects.forEach(function (food) { 
        var element = document.createElement("div");
        
        // add style
        element.classList.add("food");
        
        // set coordinates
        element.style.left = `${food.x * 40}px`;
        element.style.top = `${food.y * 40}px`;

        all_food.appendChild(element);
    });
};

function start() {
    // inital food
    create_food();

    var game_timer = window.setInterval(function(){
        if (player.dead == false) {
            update();
        } else {
            clearInterval(game_timer);
            console.log("Player dead!")
            console.log("Score: " + score)
        }
      }, 200);
}

// keyboard input
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 38 || event.keyCode == 87) {
        // up
        player.direction = 0;
    } else if(event.keyCode == 40 || event.keyCode == 83) {
        // down
        player.direction = 1;
    } else if(event.keyCode == 37 || event.keyCode == 65) {
        // left
        player.direction = 2;
    } else if(event.keyCode == 39 || event.keyCode == 68) {
        // right
        player.direction = 3;
    };
});