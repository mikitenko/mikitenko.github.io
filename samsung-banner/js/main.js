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

    toggleClass: function (node, name, delay) {
        delay = delay || 0;
        this.addClass(node, name);
        setTimeout(function () {
            adB.removeClass(node, name);
        }, delay);
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
        descriptionFadeAria = adB.node('.description-fade-aria'),
        imageFadeAria = adB.node('.image-fade-aria'),
        flashAria = adB.node('.flash');

    var descriptionState = 0;

    var MAIN_IMAGE_H = 221,
        MAIN_IMAGE_MAX_I = 59,
        DESCRIPTION_H = 108,
        DESCRIPTION_FADE_DELAY = 300,
        FLASH_LIGHT_NUM = 29,
        FLASH_LIGHT_DELAY = 500;

    adB.imageOnload(images, function (data) {

        adB.addClass(mainContainer, 'show');

        rangeInput.addEventListener('mousemove', function (event) {
            if (Number(event.target.value) == FLASH_LIGHT_NUM) adB.toggleClass(flashAria, 'light', FLASH_LIGHT_DELAY);

            if (Number(event.target.value) == MAIN_IMAGE_MAX_I){
                adB.addClass(imageFadeAria, 'fade');
                imageFadeAria.style.backgroundPosition = '0px ' + (-Number(event.target.value) * MAIN_IMAGE_H + 'px');
            } else {
                adB.removeClass(imageFadeAria, 'fade');
                mainImage.style.backgroundPosition = '0px ' + (-Number(event.target.value) * MAIN_IMAGE_H + 'px');
            }

            if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 4) {
                if (descriptionState == 0) return;
                adB.toggleClass(descriptionFadeAria, 'fade', DESCRIPTION_FADE_DELAY);
                descriptionContainer.style.backgroundPosition = '0px 0px';
                descriptionState = 0;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 2.25) {
                if (descriptionState == 1) return;
                adB.toggleClass(descriptionFadeAria, 'fade', DESCRIPTION_FADE_DELAY);
                descriptionContainer.style.backgroundPosition = '0px ' + (-1 * DESCRIPTION_H + 'px');
                descriptionState = 1;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I / 1.25) {
                if (descriptionState == 2) return;
                adB.toggleClass(descriptionFadeAria, 'fade', DESCRIPTION_FADE_DELAY);
                descriptionContainer.style.backgroundPosition = '0px ' + (-2 * DESCRIPTION_H + 'px');
                descriptionState = 2;
            } else if (Number(event.target.value) < MAIN_IMAGE_MAX_I) {
                if (descriptionState == 3) return;
                adB.toggleClass(descriptionFadeAria, 'fade', DESCRIPTION_FADE_DELAY);
                descriptionContainer.style.backgroundPosition = '0px ' + (-3 * DESCRIPTION_H + 'px');
                descriptionState = 3;
            }
        }, false);
    });
});