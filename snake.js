// js-snake
// (c) Vilhelm Prytz 2019 - vilhelm@prytznet.se www.vilhelmprytz.se

const game_settings = {
    "screen_length": 600, // screen pixels, default 600x600
    "block_length": 20, // pixel length of blocks, 20x20 default
    "frame_delay": 125, // default 125
    "tails_per_food": 1, // how many tails are created for every food, default 1
};

game_settings.amount_blocks = game_settings.screen_length / game_settings.block_length;

var score = 0;
var game_timer;

var player = {
    "x": game_settings.amount_blocks/2,
    "y": game_settings.amount_blocks/2,
    "direction": 0,
    "dead": false,
    "invincible": false,
    "tail": []
};

var food_objects = [];

function apply_settings() {
    const content_element = document.querySelector(".content");
    const player_element = document.querySelector(".player");

    content_element.style.width = `${game_settings.screen_length}px`;
    content_element.style.height = `${game_settings.screen_length}px`;

    player_element.style.width = `${game_settings.block_length}px`;
    player_element.style.height = `${game_settings.block_length}px`;
};

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
    // create tail in players current position
    create_tail();
    player.tail.shift();

    // calculate coordinate operation
    var {x_operation, y_operation} = return_coordinate_operation(player.direction);

    // perform operation on player coordinate
    player.x = player.x + x_operation;
    player.y = player.y + y_operation;

    // check for collisions with tail
    player.tail.forEach(function (tail, index) {
        if(player.x == tail.x && player.y == tail.y) {
            player_dead(true);
        };
    });

    // check for collisions with food
    food_objects.forEach(function (food, index) {
        if(player.x == food.x && player.y == food.y) {
            food_objects.splice(index, 1);
            create_food();
            for (let step = 0; step < game_settings.tails_per_food; step++) {
                create_tail();
            };
            score++;
        };
    });

    // check if outside boundaries
    if (player.x >= game_settings.amount_blocks) {
        player_dead(true);
    } else if (player.x <= -1) {
        player_dead(true);
    } else if (player.y <= -1) {
        player_dead(true);
    } else if (player.y >= game_settings.amount_blocks) {
        player_dead(true);
    };

    // run draw function
    if (player.dead == false) {
        draw_player();
        draw_tail();
        draw_food();
    };

    // update score
    update_score();
};

function create_food() {
    var new_x = Math.floor(Math.random() * game_settings.amount_blocks) + 0;
    var new_y = Math.floor(Math.random() * game_settings.amount_blocks) + 0;

    var new_food = {
        "x": new_x,
        "y": new_y
    };

    food_objects.push(new_food);
};

function create_tail() {
    player.tail.push({
        "x": player.x,
        "y": player.y
    });
};

function draw_player() {
    const player_element = document.querySelector(".player");

    // set x
    player_element.style.left = `${player.x * game_settings.block_length}px`;

    // set y
    player_element.style.top = `${player.y * game_settings.block_length}px`;
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
        element.classList.add("tail");

        // use game settings to set width and height
        element.style.width = `${game_settings.block_length}px`;
        element.style.height = `${game_settings.block_length}px`;
        
        // set coordinates
        element.style.left = `${tail.x * game_settings.block_length}px`;
        element.style.top = `${tail.y * game_settings.block_length}px`;

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

        // set width and height
        element.style.width = `${game_settings.block_length}px`;
        element.style.height = `${game_settings.block_length}px`;
        
        // set coordinates
        element.style.left = `${food.x * game_settings.block_length}px`;
        element.style.top = `${food.y * game_settings.block_length}px`;

        all_food.appendChild(element);
    });
};

function update_score() {
    document.querySelectorAll(".score").forEach(function (element) {
        element.innerHTML = score;
    });
};

function player_dead(new_status) {
    const game_over_element = document.querySelector("#game-over-box");

    if (new_status) {
        game_over_element.style.display = "block";
        player.dead = true;
    } else {
        game_over_element.style.display = "none";
        player.dead = false;
    };
}

function start() {
    const start_game_element = document.querySelector("#start-box");

    start_game_element.style.display = "none";

    clearInterval(game_timer);

    reset_variables();

    // inital food
    create_food();

    game_timer = window.setInterval(function(){
        if (player.dead == false) {
            update();
        } else {
            clearInterval(game_timer);
            console.log("Player dead!")
            console.log("Score: " + score)
        }
      }, game_settings.frame_delay);
};

function reset_variables(game_timer) {
    player_dead(false);
    score = 0;
    food_objects = [];
    player.tail = [];
    player.x = game_settings.amount_blocks/2;
    player.y = game_settings.amount_blocks/2;
};

// keyboard input
document.addEventListener('keydown', function(event) {
    if((event.keyCode == 38 || event.keyCode == 87) && player.direction != 1) {
        // up
        player.direction = 0;
    } else if((event.keyCode == 40 || event.keyCode == 83) && player.direction != 0) {
        // down
        player.direction = 1;
    } else if((event.keyCode == 37 || event.keyCode == 65) && player.direction != 3) {
        // left
        player.direction = 2;
    } else if((event.keyCode == 39 || event.keyCode == 68) && player.direction != 2) {
        // right
        player.direction = 3;
    };
});