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

  function handleDropEvent( event, ui ) {
    var draggable = ui.draggable;
    $(this).children('div.shelf').addClass('shelf_gold');
    draggable.addClass('display_none');
  }

  function handleMoveEvent( event, ui ) {

  }

  var gameContainer = $('.game_container');
  var moneyMove = $('.money_move');
  var imageSceenWrapp = $('.image_sceen_wrapp');

  gameContainer.addClass('display_none');

  var imageLinks = ['img/main_bg.png','img/screen.png','img/flower2.png','img/flower1.png','img/player.png','img/money.png','img/small_money.png'];

  if ((preload(imageLinks)).length === imageLinks.length){
    gameContainer.fadeIn(1000);
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