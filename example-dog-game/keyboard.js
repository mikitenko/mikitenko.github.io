var KeyBoard = function () {
    this.leftArrow = false;
    this.rightArrow = false;
    this.upArrow = false;
    this.downArrow = false;

};


var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;
var DIR_E = 1;
var DIR_NE = 2;
var DIR_N = 4;
var DIR_NW = 8;
var DIR_W = 16;
var DIR_SW = 32;
var DIR_S = 64;
var DIR_SE = 128;

//var keyState = [false, false, false, false]; //KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN

var key = new KeyBoard();

function InitializeKeyboard () {
    $(document).on('keydown', function (event) {
        if(event.keyCode == KEY_LEFT){
            key.leftArrow = true;
        } else if (event.keyCode == KEY_RIGHT){
            key.rightArrow = true;
        }else if (event.keyCode == KEY_UP){
            key.upArrow = true;
        }else if (event.keyCode == KEY_DOWN){
            key.downArrow = true;
        }
    }).on('keyup', function (event) {
        if(event.keyCode == KEY_LEFT){
            key.leftArrow = false;
        } else if (event.keyCode == KEY_RIGHT){
            key.rightArrow = false;
        }else if (event.keyCode == KEY_UP){
            key.upArrow = false;
        }else if (event.keyCode == KEY_DOWN){
            key.downArrow = false;
        }
    });
}