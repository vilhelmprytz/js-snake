// js-snake
// (c) Vilhelm Prytz 2019 - vilhelm@prytznet.se www.vilhelmprytz.se

// screen: 600*600
// each block: 40*40
// block: 15 * 15

player = {
    "x": 7,
    "y": 7,
    "direction": 0,
    "dead": false,
    "length": 1
}

function update() {
    // update coordinates
    if (player.direction == 0) {
        // up
        player.y = player.y-1
    } else if (player.direction == 1) {
        // down
        player.y = player.y+1
    } else if (player.direction == 2) {
        // left
        player.x = player.x-1
    } else if (player.direction == 3) {
        // right
        player.x = player.x+1
    }

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
    draw_food();
};

function draw_player() {
    const player_element = document.querySelector(".player");

    // set x
    player_element.style.left = `${player.x * 40}px`;

    // set y
    player_element.style.top = `${player.y * 40}px`;
};

function draw_food() {

};

function start() {
    var game_timer = window.setInterval(function(){
        if (player.dead == false) {
            update();
        } else {
            clearInterval(game_timer);
            console.log("Player dead!")
        }
      }, 200);
}