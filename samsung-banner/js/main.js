var adB = {
    node: function (selector) {
        return document.querySelector(selector);
    },

    hasClass: function (node, className) {
        return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },


    addClass: function (node, className) {
        if (!this.hasClass(node, className)) node.className += ' ' + className;
    },

    removeClass: function (node, className) {
        if (this.hasClass(node, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            node.className = node.className.replace(reg, '');
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
    },

    fade: function (node) {
        this.addClass(node, 'fade');
        setTimeout(function () {
            adB.removeClass(node, 'fade');
        }, 500);
    }

};


adB.domReady(function () {


    var images = [
        '/samsung-banner/images/phone_sprite.png',
        '/samsung-banner/images/description.png',
        '/samsung-banner/images/dragtext.png',
        '/samsung-banner/images/cta.png'
    ];

    var mainContainer = adB.node('.main-container'),
        rangeInput = adB.node('input[type=range]'),
        mainImage = adB.node('.image'),
        descriptionContainer = adB.node('.description'),
        fadeAria = adB.node('.fade-aria');


    var MAIN_IMAGE_H = 221,
        MAIN_IMAGE_MAX_I = 59,
        DESCRIPTION_H = 108,
        DESCRIPTION_STAT = 0;


    adB.imageOnload(images, function (data) {

        adB.addClass(mainContainer, 'show');

        rangeInput.addEventListener('mousemove', function (event) {

            mainImage.style.backgroundPosition = '0px ' + (-Number(event.target.value) * MAIN_IMAGE_H + 'px');

            if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 4) {
                if (DESCRIPTION_STAT == 0) return;
                adB.fade(fadeAria);

                descriptionContainer.style.backgroundPosition = '0px 0px';
                DESCRIPTION_STAT = 0;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 2.25) {
                if (DESCRIPTION_STAT == 1) return;
                adB.fade(fadeAria);

                descriptionContainer.style.backgroundPosition = '0px ' + (-1 * DESCRIPTION_H + 'px');
                DESCRIPTION_STAT = 1;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 1.25) {
                if (DESCRIPTION_STAT == 2) return;
                adB.fade(fadeAria);

                descriptionContainer.style.backgroundPosition = '0px ' + (-2 * DESCRIPTION_H + 'px');
                DESCRIPTION_STAT = 2;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I) {
                if (DESCRIPTION_STAT == 3) return;
                adB.fade(fadeAria);

                descriptionContainer.style.backgroundPosition = '0px ' + (-3 * DESCRIPTION_H + 'px');
                DESCRIPTION_STAT = 3;
            }

        }, false);

    });
});