'use strict';
$(function(){
  (function(){
    function preload(links){
      var images = [];
      for (var i = 0; i < links.length; ++i) {
        images[i] = new Image();
        images[i].src = links[i];
      }
      return images;
    }
    //game ajax
    var gameLoader = (function(){
      function coinAnimate(obj){
        var childObj = obj.children('div.shelf');
        $('.coin').remove();
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
          }, 350, function() {
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
        var newMoneyMove = $('<div class="money_move ui-draggable">');
        money.after(newMoneyMove);
        newMoneyMove.draggable({
          containment: '#content',
          snap: '#content',
          revert: true,
          stop: handleMoveEvent
        });
        draggable.remove();
        setMaxExeuctionInterval( function(){
          coinAnimate(thisScreen);
        }, 400, 5);
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

      var imageLinks = ['img/main_bg.png','img/screen.png','img/flower2.png','img/flower1.png','img/men.png','img/money.png','img/small_money.png','img/coin_anim.png','img/work_computer.png'];

      if ((preload(imageLinks)).length === imageLinks.length){
        setInterval(function(){
          gameContainer.fadeIn(500);
        }, 1000);
      }


      moneyMove.draggable({
        containment: '#content',
        snap: '#content',
        revert: true,
        stop: handleMoveEvent
      });
      imageSceenWrapp.droppable({
        drop: handleDropEvent
      });

    });
    //video ajax
    var videoTransformSolution = (function(){
      /* var newAttachStyle = function(iframeSelector, stringStyle) {
       var iframe = document.querySelector(iframeSelector);
       var iframeScope = (iframe.contentWindow || iframe.contentDocument);
       var st = iframeScope.document.createElement("style");
       var head = iframeScope.document.querySelector('head');
       if (st.styleSheet) {
       st.styleSheet.cssText += stringStyle;
       } else {
       st.innerHTML += stringStyle;
       }
       head.appendChild(st);
       return true;
       };*/

      function intervalCheckDom (){
        var time;
        function stopInterval(){
          clearInterval(time);
        }
        function chekElement(){
          var iframeElem = document.querySelector('iframe.cboxIframe');

          if(Object.prototype.toString.call(iframeElem) === '[object HTMLIFrameElement]'){
            var iframe = $("iframe.cboxIframe");
            // if(newAttachStyle('iframe.cboxIframe','video{width:100%}')){
            iframe.contents().find("video")
              .attr("controls",true)
              .attr("autoplay");
            //.attr("preload",true).css('width','100%');
            iframe.addClass('show');
            stopInterval();
            //}
          }
        }
        time = setInterval(chekElement, 600);
      }

      var s = document.createElement("script");
      var videoStart =  $('.vimeo');
      var gameContainer = $('.game_container');
      gameContainer.addClass('display_none');
      var imageLinks = ['img/main_bg.png','img/screen.png','img/flower2.png','img/flower1.png','img/men.png','img/money.png','img/video_bg.png','img/shelf_video.png','img/work_computer.png'];
      if ((preload(imageLinks)).length === imageLinks.length){
        setInterval(function(){
          gameContainer.fadeIn(500);
        }, 1000);
      }
      s.type = "text/javascript";
      s.src = "js/jquery.colorbox.js";
      $("head").append(s);
      $(".vimeo").colorbox({
        rel:'vimeo',
        iframe:true,
        width: '50%',
        height: '50%',
        speed: 300
      });


      videoStart.click(function(event){
        event.preventDefault();
        intervalCheckDom();
        var cboxNext = $('#cboxNext');
        var cboxPrevious = $('#cboxPrevious');
        cboxNext.click(function(event){
          event.preventDefault();
          intervalCheckDom();
        });
        cboxPrevious.click(function(event){
          event.preventDefault();
          intervalCheckDom();
        });
      })
    });


    $('.play_game').click(function(event){
      event.preventDefault();
      $.get( "./game.html", function(data) {
        $('body').html(data);
        gameLoader();

      });
    });

    $('.promo_video').click(function(event){
      event.preventDefault();
      $.get( "./video.html", function(data) {
        $('body').html(data);
        videoTransformSolution();
      });
    });


  })();
});