var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var game = document.getElementById("game");
var gameCtx = game.getContext("2d");

var left = 20;
var top = 20;

var background = new Image();
background.onload = function () {
    canvas.width = background.width / 2;
    canvas.height = background.height / 2;
    gameCtx.fillStyle = "red";
    gameCtx.strokeStyle = "blue";
    gameCtx.lineWidth = 3;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    move(top, left);
}
background.src = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/game.jpg";



function move(direction) {
    switch (direction) {
        case "left":
            left -= 5;
            break;
        case "up":
            top -= 5;
            break;
        case "right":
            left += 5;
            break;
        case "down":
            top += 5
            break;
    }
    draw(top, left);
}

function draw(top, left) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    gameCtx.clearRect(0, 0, game.width, game.height);
    gameCtx.drawImage(background, left, top, 250, 150, 0, 0, 250, 150);
    gameCtx.beginPath();
    gameCtx.arc(125, 75, 10, 0, Math.PI * 2, false);
    gameCtx.closePath();
    gameCtx.fill();
    gameCtx.stroke();
    ctx.beginPath();
    ctx.rect(left / 2, top / 2, 125, 75);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(left / 2 + 125 / 2, top / 2 + 75 / 2, 5, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
}

$("#moveLeft").click(function () {
    move("left");
});
$("#moveRight").click(function () {
    move("right");
});
$("#moveUp").click(function () {
    move("up");
});
$("#moveDown").click(function () {
    move("down");
});