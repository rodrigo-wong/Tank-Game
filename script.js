/** Author: Rodrigo Wong Mac #00088748 */

// Controls for the tank
function rotate_left() {
  if (angle_cannon < -360) {
    angle_cannon = 0
  }
  angle_cannon += -rotate_cannon;
  cannon.setAttribute("transform", "rotate(" + angle_cannon + ", " + centerX + ", " + centerY + ")");
}
function rotate_right() {
  if (angle_cannon > 360) {
    angle_cannon = 0
  }
  angle_cannon += rotate_cannon;
  cannon.setAttribute("transform", "rotate(" + angle_cannon + ", " + centerX + ", " + centerY + ")")
}

function move_right() {
  moveX += move;
  trace_centerX += move;
  tank.setAttribute("transform", "translate(" + moveX + "," + moveY + ")");
  tank_body.setAttribute("transform", "rotate(180, " + centerX + ", " + centerY + ")");
}

function move_left() {
  moveX -= move;
  trace_centerX -= move;
  tank.setAttribute("transform", "translate(" + moveX + "," + moveY + ")");
  tank_body.setAttribute("transform", "rotate(180, " + centerX + ", " + centerY + ")");
}
function move_up() {
  moveY -= move;
  trace_centerY -= move;
  tank.setAttribute("transform", "translate(" + moveX + "," + moveY + ")");
  tank_body.setAttribute("transform", "rotate(90," + centerX + ", " + centerY + ")");
}
function move_down() {
  moveY += move;
  trace_centerY += move;
  tank.setAttribute("transform", "translate(" + moveX + "," + moveY + ")");
  tank_body.setAttribute("transform", "rotate(90, " + centerX + ", " + centerY + ")");
}

function shoot_cannon() {
  if (reload) {
    setTimeout(() => {
      reload = true;
    }, 800);

    let ball = document.createElementNS(svgNS, "circle");
    let angle = angle_cannon;
    let ball_cx = trace_centerX + (cannon_length * Math.cos(Math.PI * angle / 180));
    let ball_cy = trace_centerY + (cannon_length * Math.sin(Math.PI * angle / 180));
    let cx = ball_cx;
    let cy = ball_cy;
    let speed = 3;
    let speed_x = (speed * Math.cos(Math.PI * angle / 180));
    let speed_y = (speed * Math.sin(Math.PI * angle / 180));

    ball.setAttribute("r", 8);
    ball.setAttribute("cx", cx);
    ball.setAttribute("cy", cy);
    ball.setAttribute("fill", "darkgray");
    ball.setAttribute("stroke-width", 2);
    ball.setAttribute("stroke", "black");
    ball.setAttribute("class", "ball");

    canvas.appendChild(ball);

    setInterval(() => {
      ball.setAttribute("cy", (angle > -90 && angle < -270) || (angle < 90 && angle > 270) ? cy -= speed_y : cy += speed_y);
      ball.setAttribute("cx", (angle > -90 && angle < -270) || (angle < 90 && angle > 270) ? cx -= speed_x : cx += speed_x);
    }, 17)

    reload = false;
  }
}

// Handler for control inputs
function controls() {
  var controls = setInterval(() => {
    if (keys["ArrowLeft"]) {
      rotate_left();
    }
    if (keys["ArrowRight"]) {
      rotate_right();
    }
    if (keys["s"] || keys["S"]) {
      move_down();
    }
    if (keys["w"] || keys["W"]) {
      move_up();
    }
    if (keys["d"] || keys["D"]) {
      move_right();
    }
    if (keys["a"] || keys["A"]) {
      move_left();
    }
    if (keys[" "]) {
      shoot_cannon();
    }
    if (!game) {
      clearInterval(controls);
    }
  }, 17)
}

// Remove cannon ball after leaving canvas
function remove_cannon_ball() {
  let max_x = parseInt(canvas_width);
  let max_y = parseInt(canvas_height);
  var remove_ball = setInterval(() => {
    let balls = document.querySelectorAll(".ball")
    balls.forEach(element => {
      let cx = element.getAttribute("cx");
      let cy = element.getAttribute("cy");
      if (cx > max_x || cx < 0 || cy < 0 || cy > max_y) {
        canvas.removeChild(element);
      }
    });
    if (!game) {
      clearInterval(remove_ball);
    }
  }, 17);
}

// Enemy spawn locations
function make_enemy_top() {
  let enemy = document.createElementNS(svgNS, "circle");
  let random_r = Math.random() * 30 + 30;
  let random_cx = Math.random() * (canvas_width);
  let random_cy = -random_r;
  enemy.setAttribute("r", random_r);
  enemy.setAttribute("cx", random_cx);
  enemy.setAttribute("cy", random_cy);
  enemy.setAttribute("class", "enemy")
  enemy.setAttribute("fill", "red");
  enemy.setAttribute("stroke-width", 10)
  enemy.setAttribute("stroke", "orange")
  canvas.appendChild(enemy);
}
function make_enemy_bottom() {
  let enemy = document.createElementNS(svgNS, "circle");
  let random_r = Math.random() * 30 + 30;
  let random_cx = Math.random() * (canvas_width);
  let random_cy = parseInt(canvas_height) + random_r;
  enemy.setAttribute("r", random_r);
  enemy.setAttribute("cx", random_cx);
  enemy.setAttribute("cy", random_cy);
  enemy.setAttribute("class", "enemy")
  enemy.setAttribute("fill", "red");
  enemy.setAttribute("stroke-width", 10)
  enemy.setAttribute("stroke", "orange")
  canvas.appendChild(enemy);
}
function make_enemy_left() {
  let enemy = document.createElementNS(svgNS, "circle");
  let random_r = Math.random() * 30 + 30;
  let random_cy = Math.random() * (canvas_height);
  let random_cx = - random_r;
  enemy.setAttribute("r", random_r);
  enemy.setAttribute("cx", random_cx);
  enemy.setAttribute("cy", random_cy);
  enemy.setAttribute("class", "enemy")
  enemy.setAttribute("fill", "red");
  enemy.setAttribute("stroke-width", 10)
  enemy.setAttribute("stroke", "orange")
  canvas.appendChild(enemy);
}
function make_enemy_right() {
  let enemy = document.createElementNS(svgNS, "circle");
  let random_r = Math.random() * 30 + 30;
  let random_cy = Math.random() * (canvas_height);
  let random_cx = parseInt(canvas_width) + random_r;
  enemy.setAttribute("r", random_r);
  enemy.setAttribute("cx", random_cx);
  enemy.setAttribute("cy", random_cy);
  enemy.setAttribute("class", "enemy")
  enemy.setAttribute("fill", "red");
  enemy.setAttribute("stroke-width", 10)
  enemy.setAttribute("stroke", "orange")
  canvas.appendChild(enemy);
}

// Enemy moves towards tank
function move_enemy() {
  var move = setInterval(() => {
    let enemys = document.querySelectorAll(".enemy");
    enemys.forEach(element => {
      let cx = element.getAttribute("cx");
      let cy = element.getAttribute("cy");
      let angle = Math.atan((trace_centerY - cy) / (trace_centerX - cx));
      let speed = 1;
      let speed_x = (speed * Math.cos(angle));
      let speed_y = (speed * Math.sin(angle));
      let new_cx;
      let new_cy
      if (cx < trace_centerX) {
        new_cx = parseFloat(cx) + speed_x;
        new_cy = parseFloat(cy) + speed_y;
      }
      else {
        new_cx = parseFloat(cx) - speed_x;
        new_cy = parseFloat(cy) - speed_y;
      }
      element.setAttribute("cx", new_cx);
      element.setAttribute("cy", new_cy);
      if (!game) {
        clearInterval(move);
      }
    });
  }, 17)
}

// Timer for enemy spawn and randomized spawn location
function spawn_timer() {
  var spawn = setInterval(() => {
    let random = parseInt(Math.random() * 4);
    if (random === 0) {
      make_enemy_top();
    }
    if (random === 1) {
      make_enemy_bottom();
    }
    if (random === 2) {
      make_enemy_left();
    }
    if (random === 3) {
      make_enemy_right();
    }
    if (!game) {
      clearInterval(spawn);
    }
  }, 1200)
}

// Collision code for cannon ball and enemy
function collision() {
  var collision = setInterval(() => {
    balls = document.querySelectorAll(".ball");
    enemys = document.querySelectorAll(".enemy");
    balls.forEach(ball => {
      let ball_cx = parseFloat(ball.getAttribute("cx"));
      let ball_cy = parseFloat(ball.getAttribute("cy"));
      let ball_r = parseFloat(ball.getAttribute("r"));

      enemys.forEach(enemy => {
        let enemy_cx = parseFloat(enemy.getAttribute("cx"));
        let enemy_cy = parseFloat(enemy.getAttribute("cy"));
        let enemy_r = parseFloat(enemy.getAttribute("r"));
        let distance = Math.sqrt((ball_cx - enemy_cx) ** 2 + (ball_cy - enemy_cy) ** 2);
        let colliding = distance < (enemy_r + ball_r);
        if (colliding) {
          canvas.removeChild(ball);
          canvas.removeChild(enemy);
          points += 1;
          update_points();
        }
      })
    });
    if (!game) {
      clearInterval(collision);
    }
  }, 17)
}

//Colision code for enemy and tank
function collision_tank() {
  var check_collision = setInterval(() => {
    let enemys = document.querySelectorAll(".enemy");
    enemys.forEach(enemy => {
      let enemy_cx = parseFloat(enemy.getAttribute("cx"));
      let enemy_cy = parseFloat(enemy.getAttribute("cy"));
      let enemy_r = parseFloat(enemy.getAttribute("r"));
      let distance_x = Math.abs(enemy_cx - trace_centerX);
      let distance_y = Math.abs(enemy_cy - trace_centerY);
      let distance = Math.sqrt(distance_x ** 2 + distance_y ** 2)
      let colliding = distance < (enemy_r + 65);
      if (colliding) {
        let game_over = document.createElementNS(svgNS, "text");
        game_over.setAttribute("font-size", 80);
        game_over.setAttribute("font-weight", 2000);
        game_over.setAttribute("x", 360);
        game_over.setAttribute("y", 225);
        game_over.setAttribute("id", "game_over");
        canvas.appendChild(game_over);
        document.querySelector("#game_over").textContent = "Game Over";
        console.log("Game Over");
        clearInterval(check_collision);
        game = false;

        // Create a restart button
        let restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        restartButton.setAttribute("id", "restartButton");
        restartButton.classList.add("btn", "btn-success", "btn-lg"); // Add Bootstrap classes
        restartButton.style.position = "absolute";
        restartButton.style.left = "50%";
        restartButton.style.top = "50%";
        restartButton.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(restartButton);

        // Add event listener to restart button
        restartButton.addEventListener("click", () => {
          document.location.reload(); // Reload the page to restart the game
        });
      }
    })
  }, 17)
}


// Update points
function update_points() {
  document.querySelector("#points").textContent = "Points: " + points;
}

// Start button handler
function start() {
  if (!game) {
    game = true;
    controls();
    remove_cannon_ball();
    spawn_timer();
    move_enemy();
    collision();
    collision_tank();
    overlay();
  }
}

// Overlay handler
function overlay() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("overlay-menu").style.display = "none";
}

// Choose color for tank
function chooseColor() {
  console.log("here");
  let tankColor = document.getElementById("tank-color").value;
  let body = document.getElementById("body");
  let cannon = document.getElementById("cannon");
  let top = document.getElementById("top");
  if (tankColor === "green") {
    body.setAttribute("fill", tankColor);
    body.setAttribute("stroke", "darkgreen");
    cannon.setAttribute("fill", tankColor);
    cannon.setAttribute("stroke", "darkgreen");
    top.setAttribute("fill", "darkgreen")
  } else if (tankColor == "red") {
    body.setAttribute("fill", tankColor);
    body.setAttribute("stroke", "darkred");
    cannon.setAttribute("fill", tankColor);
    cannon.setAttribute("stroke", "darkred");
    top.setAttribute("fill", "darkred")

  } else {
    body.setAttribute("fill", tankColor);
    body.setAttribute("stroke", "hotpink");
    cannon.setAttribute("fill", tankColor);
    cannon.setAttribute("stroke", "hotpink");
    top.setAttribute("fill", "hotpink")
  }

}

const cannon = document.querySelector("#tank_cannon");
const tank = document.querySelector("#tank");
const tank_body = document.querySelector("#tank_body");
const canvas = document.querySelector("#canvas");
const canvas_width = 1100;
const canvas_height = 700;
var game = false;
var points = 0;
var angle_cannon = 0;
var rotate_cannon = 1;
const centerX = canvas_width / 2;
const centerY = canvas_height / 2;
var move = 1;
var moveY = 0;
var moveX = 0;

const svgNS = "http://www.w3.org/2000/svg";
var trace_centerX = centerX;
var trace_centerY = centerY;
var cannon_length = 80;

var reload = true;

var keys = [];

document.addEventListener("keydown", (e) => {
  keys[e.key] = true
  e.preventDefault();
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Mouse click event
document.querySelector("#start-btn").addEventListener("click", start);

document.querySelector("#tank-color").addEventListener("change", chooseColor);