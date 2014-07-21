'use strict';
window.onload = function run_onload(){
    // Create the canvas
    var saveCanvas = [];
    var canvas = document.getElementById("canvas");
    var scroll_canvas =  document.getElementById("canvas").parentNode;
    canvas.width = "1000";
    canvas.height = "1000";
    canvas.style.position = "absolute";
    var treeWidth = 120;
    var treeHeight = 120;
    var playerWidth = 100;
    var playerHeight = 100;
    var frameWidth = 100;
    var frameHeight = 100;
    var ctx  = canvas.getContext("2d");

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    //random tree image
    var treeImage = new Image();
    treeImage.src = "../mini/img/tree.png";
    treeImage.onload = function () {
        function randomNumber (tree,canvas){
            tree = parseInt(tree);
            canvas = parseInt(canvas);
            return Math.floor( Math.random() * (canvas - tree)/tree)* tree;
        }
        for (var i = 0; i < 30; i ++) {
            var x = randomNumber(treeWidth,canvas.width);
            var y = randomNumber(treeWidth,canvas.height);
            ctx.drawImage(treeImage, x, y, treeWidth, treeHeight);
            var treeRand = {
                img:treeImage,
                x:x,
                y:y,
                width:treeWidth,
                height:treeHeight
            };
            saveCanvas.push(treeRand);
        }
    };

    //Player
    var playerImage = new Image();
    playerImage.src = "../mini/img/player.png";
    playerImage.onload = function () {
        ctx.drawImage(playerImage, 0, frameWidth*9, frameWidth, frameHeight, 60,50, playerWidth, playerHeight);
    };

    //create move player
    var progress = 0; // Progress move
    var canvasX = 60, canvasY = 50; //start position player
    var positX, positY;

    //function move canvas
    canvas.onmousedown = function canvas_mousedown (event) {
        var event = event || window.event;


        var max_left;
        var max_top;
        var x_fix;
        var y_fix;

        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;

        max_left = scroll_canvas.offsetWidth - canvas.offsetWidth;//200px
        max_top = scroll_canvas.offsetHeight - canvas.offsetHeight;
        x_fix = canvas.offsetLeft - event.clientX;// - ... px
        y_fix = canvas.offsetTop - event.clientY;




        // move canvas
        scroll_canvas.onmousemove = function canvas_mousemove (event) {

            var new_x;
            var new_y;

            new_x = event.clientX + x_fix;
            new_y = event.clientY + y_fix;

            // move horizontal
            if (new_x < max_left) {
                canvas.style.left = max_left + "px";
            } else if (new_x > 0) {
                canvas.style.left = 0 + "px";
            } else {
                canvas.style.left = new_x + "px";
            }


            // move vertical
            if (new_y < max_top) {
                canvas.style.top = max_top + "px";
            } else if (new_y > 0) {
                canvas.style.top = 0 + "px";
            } else {
                canvas.style.top = new_y + "px";
            }

            scroll_canvas.onmouseup = function canvas_mouseup (event) {
                scroll_canvas.onmousemove = null;
                scroll_canvas.onmouseup = null;
            };

        };



        //player canvas move
        scroll_canvas.onmouseup = function canvas_mouseup (event) {
            scroll_canvas.onmousemove = null;
            scroll_canvas.onmouseup = null;


            // if we are moving, return
            if (progress !== 0) return;

            /// set start point
            positX = canvasX;
            positY = canvasY;

            //coordinate click canvas
            var rect = canvas.getBoundingClientRect();
            canvasX= event.clientX - rect.left - (frameWidth/2);
            canvasY= event.clientY - rect.top - (frameHeight-10);

            var x, y; // position
            var changeFrame = 0; //interval frame change
            var directionFrame; // direction frame change

            var dist; //Distance
            var steps = 10; // steps (constant speed)

            // Calc distance move
            var distX = canvasX - positX;
            var distY = canvasY - positY;
            dist = Math.abs(Math.sqrt(distX * distX + distY * distY));

            var speed = steps / dist; // speed will be number of steps / distance

            function drawCircle() {
                setTimeout(function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    //restore canvas tree
                    for (var i = 0; i < saveCanvas.length; i ++) {
                        ctx.drawImage(saveCanvas[i].img, saveCanvas[i].x, saveCanvas[i].y, saveCanvas[i].width, saveCanvas[i].height);
                    }
                    // move a step
                    progress += speed;

                    // calc current x/y position
                    x = positX + (canvasX - positX) * progress;
                    y = positY + (canvasY - positY) * progress;


                    // at goal? if not, loop
                    if (progress < 1) {
                        // draw the "player"
                        ctx.drawImage(playerImage, changeFrame, directionFrame, frameWidth, frameHeight, x, y, playerWidth, playerHeight);

                        //change frame amimation
                        if (changeFrame != frameWidth*7){
                            changeFrame += frameWidth;
                        } else {
                            changeFrame = 0;
                        }

                        //change in the direction of the frame
                        if (x < canvasX && 40 > Math.abs(y - canvasY)){
                            directionFrame = frameWidth*4;
                        } else if (x > canvasX && 40 > Math.abs(y - canvasY)){
                            directionFrame = 0;
                        } else if (y < canvasY && 40 > Math.abs(x - canvasX)){
                            directionFrame = frameWidth*6;
                        } else if (y > canvasY && 40 > Math.abs(x - canvasX)){
                            directionFrame = frameWidth*2;
                        } else if (x < canvasX && y < canvasY){
                            directionFrame = frameWidth*5;
                        } else if (x > canvasX && y > canvasY){
                            directionFrame = frameWidth;
                        } else if (x < canvasX && y > canvasY){
                            directionFrame = frameWidth*3;
                        } else if (x > canvasX && y < canvasY){
                            directionFrame = frameWidth*7;
                        }


                        //start drawCircle
                        requestAnimationFrame(drawCircle);

                    } else {
                        // draw the "player"
                        changeFrame = 0;
                        if (x < canvasX){
                            directionFrame = frameWidth*8;
                        } else if (x > canvasX){
                            directionFrame = frameWidth*9;
                        }
                        ctx.drawImage(playerImage, changeFrame, directionFrame, frameWidth, frameHeight, canvasX, canvasY, playerWidth, playerHeight);

                        // reset progress so we can click again
                        progress = 0;
                    }

                    for (var j = 0; j < saveCanvas.length; j ++) {
                        if (y-treeHeight/4 < saveCanvas[j].y){
                            ctx.drawImage(saveCanvas[j].img, saveCanvas[j].x, saveCanvas[j].y, saveCanvas[j].width, saveCanvas[j].height);
                        }
                    }


                }, 1000 / 30);
            }
            drawCircle();
        };
    };



};
