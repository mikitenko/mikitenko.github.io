'use strict';
window.onload = function(){
  function addClass(node, className) {
    var arrClass = node.className ? node.className.split(' ') : [];
    for (var i=0; i<arrClass.length; i++) {
      if (arrClass[i] == className) return;
    }
    arrClass.push(className);
    node.className = arrClass.join(' ');
  }

  function removeClass(node, className) {
    var arrClass = node.className.split(' ');
    for (var i=0; i<arrClass.length; i++) {
      if (arrClass[i] == className) arrClass.splice(i--, 1);
    }
    node.className = arrClass.join(' ');
  }

  function hasClass(node, className) {
    for (var arrClass = node.className.split(' '),i=arrClass.length-1; i>=0; i--) {
      if (arrClass[i] == className) return true;
    }
    return false;
  }

  function next(node) {
    while ( node && (node = node.nextSibling) ) {
      if ( node.nodeType !== 8 && node.nodeType !== 3 ){
        return node;
      }
    }
  }

  function stopProp(event){
    if (event.stopPropagation){
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }

  function preventDef(event){
    if (event.preventDefault){
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }

  function bind(domNode, eventName, handler) {
    var handlerWrapper = function (event) {
      event = event || window.event;
      if (event.srcElement) {
        event.target = event.srcElement;
      }
      return handler.call(domNode, event);
    };
    if (domNode.addEventListener) {
      domNode.addEventListener(eventName, handler, false);
    } else if (domNode.attachEvent) {
      domNode.attachEvent('on' + eventName, handler);
    }
    return handlerWrapper;
  }

  function delegate (handlerNode, eventName, handlerCondition, handler) {
    var handlerWrapper = function (event) {
      var target;

      event = event || window.event;
      target = event.target || event.srcElement;
      while (target !== handlerNode) {
        if (handlerCondition(target)) {
          handler.call(target, event);
        }
        target = target.parentNode;
      }
    };

    if (handlerNode.addEventListener) {
      handlerNode.addEventListener(eventName, handlerWrapper, false);
    } else if (handlerNode.attachEvent) {
      handlerNode.attachEvent('on' + eventName, handlerWrapper);
    }
  }

  function animate(opts) {
    var start = new Date;
    var delta = opts.delta || linear;
    var timer = setInterval(function() {
      var progress = (new Date - start) / opts.duration;
      if (progress > 1) progress = 1;
      opts.step( delta(progress) );
      if (progress == 1) {
        clearInterval(timer);
        opts.complete && opts.complete();
      }
    }, opts.delay || 13);
    return timer;
  }

  function animateProp(opts) { //меняем margin для панимации прокрутки
    var start = opts.start, end = opts.end, prop = opts.prop;
    opts.step = function(delta) {
      var value = Math.round(start + (end - start)*delta);
      opts.elem.style[prop] = value + 'px';
    };
    return animate(opts);
  }

  function animatePropOpacity(opts) { //меняем opacity картинки для её анимированного отображения
    var prop = opts.prop;
    opts.step = function(delta) {
      opts.elem.style[prop] = delta;
    };
    return animate(opts);
  }

  function linear(progress) {
    return progress;
  }



  function GalleryConstructor(domNode) { //создаем конструктор галереи
    this.widthPreview = 160; //ширина превьюшки
    this.countPreview = 4; //количество превьюшек
    this.position = 0; // позиция превьюшки
    this.galleryWrapper = domNode;
    this.previews = this.galleryWrapper.querySelector('.previews');
    this.itemPreview = this.previews.getElementsByTagName('li');
    this.prevArrow = this.galleryWrapper.querySelector('.left_arrow');
    this.nextArrow = this.galleryWrapper.querySelector('.right_arrow');
    this.bigPicture = this.galleryWrapper.querySelector('.big_picture img');
    var self = this;

    this.sliderInt = setInterval(function() { // интервал прокрутки
      self.autoChangeImage();
    }, 5000);

    bind(this.prevArrow, 'click', function(event){  //вешем обработчик события на стрелку
      self.prevArrowEvent(event);
    });

    bind(this.nextArrow, 'click', function(event){
      self.nextArrowEvent(event);
    });

    bind(this.galleryWrapper, 'mouseenter', function(){
      self.galleryWrapper.setAttribute('tabindex', '0'); //добавляем атрибут для работы клавиш лево, право
      clearInterval(self.sliderInt);
    });
    bind(this.galleryWrapper, 'mouseleave', function(){self.sliderInt = setInterval(function() {
      self.galleryWrapper.removeAttribute('tabindex');
      self.autoChangeImage();
    }, 5000);});

    bind(this.galleryWrapper, 'keydown',function(event){ //вешем обработчик события на клавиши
      self.keyDownEvent(event);
    });

    delegate (this.previews, 'click', function(el) { //методом делегирования отслеживаем клик по элементу
      return el.nodeName === 'A';
    }, function(event){
      self.showBigImg.call(this, self, event);
    });
  }

  GalleryConstructor.prototype.prevArrowEvent = function(event){ //прокрутка назад изображений
    if (this.position >= 0){
      preventDef(event);
    }
    var newPosition = Math.min(this.position + this.widthPreview, 0);
    animateProp({ //функция анимации прокрутки
      elem: this.previews,
      prop: 'marginLeft',
      start: this.position,
      end: newPosition,
      duration: 100,
      delay: 20
    });
    this.position = newPosition;
    preventDef(event);
  };

  GalleryConstructor.prototype.nextArrowEvent = function(event){//прокрутка вперед изображений
    if (this.position <= -this.widthPreview*(this.itemPreview.length-this.countPreview)){
      preventDef(event);
    }
     var newPosition = Math.max(this.position-this.widthPreview, -this.widthPreview*(this.itemPreview.length-this.countPreview));
     animateProp({
       elem: this.previews,
       prop: 'marginLeft',
       start: this.position,
       end: newPosition,
       duration: 100,
       delay: 20
     });
    this.position = newPosition;
    preventDef(event);
  };

  GalleryConstructor.prototype.keyDownEvent = function(event){ //Если нажаты клавиши првоеряем наши стрелки
    if(event.keyCode == 39){ //если стрелка нажата, запускаем соответствующую функцию
      this.nextArrowEvent(event);
    } else if(event.keyCode == 37){
      this.prevArrowEvent(event);
    }
    preventDef(event);
  };

  GalleryConstructor.prototype.removeClassItemList = function(){
    for(var i = 0; i < this.itemPreview.length; i++ ){
      if(hasClass(this.itemPreview[i], 'current')){
        removeClass(this.itemPreview[i], 'current'); // удаляем класс
      }
    }
  };

  GalleryConstructor.prototype.showBigImg = function(self, event){ //выводим текую картинку в большем блоке
    if(self.bigPicture.src !== this.href){
      self.removeClassItemList(); // удаляем класс у всех элементов списка
      addClass(this.parentNode, 'current'); // добавляем класс к элементу списка
      self.bigPicture.src = this.href; // добавляем изображение в большей блок
      animatePropOpacity({ // добавляем Анимацию на появление нашей картинки
        elem: self.bigPicture,
        prop: 'opacity',
        start: 0,
        end: 1,
        step: 0.1,
        duration: 100,
        delay: 20
      });
    }
    preventDef(event);
  };

   GalleryConstructor.prototype.autoChangeImage = function(){
    var currentItem, nextItem;
    currentItem = this.galleryWrapper.querySelector('.current');
    nextItem = next(currentItem);
    if(nextItem === undefined){
      nextItem = this.itemPreview[0];
    }
    this.removeClassItemList(); // удаляем класс у всех элементов списка
    addClass(nextItem, 'current'); // добавляем класс к элементу списка
    this.bigPicture.src = nextItem.childNodes[0].href; // добавляем изображение в большей блок
    animatePropOpacity({ // добавляем Анимацию на появление нашей картинки
      elem: this.bigPicture,
      prop: 'opacity',
      start: 0,
      end: 1,
      step: 0.1,
      duration: 300,
      delay: 20
    });
  };


  var gallery1 = new GalleryConstructor(document.querySelector('.gallery1')); //создаем галерею
};







