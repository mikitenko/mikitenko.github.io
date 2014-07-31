'use strict';
$(function() {
  function preload(links){
    var images = [];
    for (var i = 0; i < links.length; ++i) {
      images[i] = new Image();
      images[i].src = links[i];
    }
    return images;
  }

  function coinAnimate(obj){
    var childObj = obj.children('div.shelf');
    coin = $('<div class="coin">')
      .insertAfter(bottomSide)
      .css({
        'width': money.width(),
        'height': money.height(),
        'left': money.offset().left,
        'top': money.offset().top
      })
      .animate({
        'width': shelf.width(),
        'height': shelf.height(),
        "top": childObj.offset().top,
        "left": childObj.offset().left
      }, 250, function() {
        coin.remove();
        childObj.addClass('shelf_gold');
      });
  }

  function setMaxExeuctionInterval( callback, delay, maxExecutions ){
    var intervalCallback = function(){
      var self = intervalCallback;
      if ( 'undefined' == typeof self.executedIntervals ){
        self.executedIntervals = 1;
      }
      if ( self.executedIntervals == maxExecutions ){
        clearInterval( self.interval )
      }
      self.executedIntervals += 1;
      callback();
    };
    intervalCallback.interval = setInterval( intervalCallback, delay );
  }

  function handleDropEvent(event, ui) {
    var draggable = ui.draggable;
    var thisScreen = $(this);
    draggable.addClass('display_none');
    setMaxExeuctionInterval( function(){
      coinAnimate(thisScreen);
    }, 300, 5);

  }

  function handleMoveEvent(event, ui) {

  }

  var coin;
  var gameContainer = $('.game_container');
  var moneyMove = $('.money_move');
  var money = $('.money');
  var shelf = $('.shelf');
  var bottomSide = $('.bottom_side');
  var imageSceenWrapp = $('.image_sceen_wrapp');

  gameContainer.addClass('display_none');

  var imageLinks = ['img/main_bg.png','img/screen.png','img/flower2.png','img/flower1.png','img/player.png','img/money.png','img/small_money.png','img/coin_anim.png','img/work_computer.png'];

  if ((preload(imageLinks)).length === imageLinks.length){
    setInterval(function() {
      gameContainer.fadeIn(500);
    }, 1000);
  }


  moneyMove.draggable({
    containment: '#content',
    cursor: 'move',
    snap: '#content',
    revert: true,
    stop: handleMoveEvent
  });
  imageSceenWrapp.droppable( {
    drop: handleDropEvent
  });






});