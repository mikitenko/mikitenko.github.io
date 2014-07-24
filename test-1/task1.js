(function(){
  var JSON = JSON || {};
  // implement JSON.stringify serialization
  JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
      // simple data type
      if (t == "string") obj = '"'+obj+'"';
      return String(obj);
    }
    else {
      // recurse array or object
      var n, v, json = [], arr = (obj && obj.constructor == Array);
      for (n in obj) {
        v = obj[n]; t = typeof(v);

        if (t == "string") v = '"'+v+'"';
        else if (t == "object" && v !== null) v = JSON.stringify(v);

        json.push((arr ? "" : '"' + n + '":') + String(v));
      }
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  };

  // implement JSON.parse de-serialization
  JSON.parse = JSON.parse || function (str) {
    if (str === ""){
      str = '""';
    }
    eval("var p=" + str + ";");
    return p;
  };

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

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }



  function load() {
    var window = {
      filter_results: '0'
    };
    var checkboxesWrapp = document.getElementById('filter-holder');

    var addCount = (function(){
      var checkboxesMatrix,sr1,sr2,sr3,sr4,sr5;
      sr1=sr2=sr3=sr4=sr5 = 0;
      checkboxesMatrix = [sr1,sr2,sr3,sr4,sr5];

      return function(event){

        if (!(getCookie('checkboxesMatrix') === undefined)){
          checkboxesMatrix = JSON.parse(getCookie('checkboxesMatrix'));
        }

        if(this.checked || this.getAttribute('checked') === 'checked'){
          checkboxesMatrix[this.getAttribute('value')-1] += 1;
          document.cookie = ('checkboxesMatrix' + ' = ' + JSON.stringify(checkboxesMatrix));
          if(checkboxesMatrix[this.getAttribute('value')-1] === getMaxOfArray(checkboxesMatrix)){
            window.filter_results = this.getAttribute('id') + '=' + getMaxOfArray(checkboxesMatrix);
          }
        }

        alert(window.filter_results, checkboxesMatrix);
      }
    })();

    delegate (checkboxesWrapp, 'click', function(el) {
      return el.nodeName === 'INPUT';
    }, addCount);

    delegate (checkboxesWrapp, 'touchstart', function(el) {
      return el.nodeName === 'INPUT';
    }, addCount);

  }
  bind(window, 'load', load);
})();