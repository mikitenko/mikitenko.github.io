var adB = {
    node: function (selector) {
        return document.querySelector(selector);
    },

    hasClass: function (selector, className) {
        return this.node(selector).className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },


    addClass: function (selector, className) {
        if (!this.hasClass(selector, className)) this.node(selector).className += ' ' + className;
    },

    removeClass: function (selector, className) {
        if (this.hasClass(selector, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            this.node(selector).className = this.node(selector).className.replace(reg, '');
        }
    },

    imageOnload: function (arr, fn) {
        var preloadedImages = [];

        for (var i = 0; i < arr.length; i++) {
            var image = new Image();
            image.src = arr[i];
            image.onload = function () {
                preloadedImages.push(this);
                if (arr.length === preloadedImages.length) return fn(preloadedImages);
            }
        }
    },

    domReady: function (handler) {
        if (document && document.readyState === 'complete') return handler();
        if (window.addEventListener) window.addEventListener('DOMContentLoaded', handler, false);
        else if (window.attachEvent) window.attachEvent('onload', handler);
    }
};


var images = [
    '/samsung-banner/images/phone_sprite.png',
    '/samsung-banner/images/description.png',
    '/samsung-banner/images/dragtext.png',
    '/samsung-banner/images/cta.png'
];


adB.imageOnload(images, function (data) {
    adB.domReady(function () {
        adB.addClass('.main-container', 'show');
    });
});