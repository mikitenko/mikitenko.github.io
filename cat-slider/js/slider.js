/**
 * Slider
 * Created by Mikitenko.R on 9/25/2015.
 *
 * Explanation:
 * selector — String parameter (example: selector = 'div.fade'). Specify the element.
 * width — Number parameter (example: width = 420). Slider width.
 * images — Array of images that will represent slides of Swipe slider. Possible number of images: from 2 to ∞.
 * mode — String
 *     auto — slides will be changed automatically. User can not interact with slider.
 *     manual — only user should be able to change slides by making swipe gesture by mouse or by finger (on touch devices).
 *     automanual — both of two previous. Slides are changed automatically and user is able to change them manually.
 *
 * swipeSpeed — the speed of animation.
 * swipeDelay — delay between slides change in automatical swipe mode. Ignored in 'manual' mode.
 */


;
(function (init) {
    //helper methods
    function addClass(node, className) {
        var arrClass = node.className ? node.className.split(' ') : [];
        for (var i = 0; i < arrClass.length; i++) {
            if (arrClass[i] == className) return;
        }
        arrClass.push(className);
        node.className = arrClass.join(' ');
    }

    function removeClass(node, className) {
        var arrClass = node.className.split(' ');
        for (var i = 0; i < arrClass.length; i++) {
            if (arrClass[i] == className) arrClass.splice(i--, 1);
        }
        node.className = arrClass.join(' ');
    }

    function templater(string, data) {
        return string.replace(/\$([^\$]+)\$/g, function (matchString, dataName) {
            return data[dataName];
        });
    }

    var countCreateGallery = 0,
        SLIDER_NAME = 'slider';

    //main Class
    function Slider(data) {
        this.selector = data.selector;
        this.images = data.images;
        this.mode = data.mode;
        this.swipeSpeed = data.swipeSpeed / 1000;
        this.swipeDelay = data.swipeDelay;
        this.width = data.width;
        this.id = SLIDER_NAME + countCreateGallery;
        this.appendImagesList(this);
        this.swipeSlider(this);
        countCreateGallery++;
    }

    Slider.prototype.appendImagesList = function (data) {
        var wrapperStyle = data.wrapperStyle ? data.wrapperStyle : 'width:9999px;left:0',
            itemStyle = data.itemStyle ? data.itemStyle : 'width:$width$px',
            wrapper = document.createElement('div'),
            ul = document.createElement('ul'),
            li,
            img;

        wrapper.setAttribute('class', 'slider_wrapper');
        ul.setAttribute('id', data.id);
        ul.setAttribute('style', templater(wrapperStyle, data));
        wrapper.style.width = data.width + 'px';
        wrapper.appendChild(ul);
        for (var i = 0; i < data.images.length; i++) {
            li = document.createElement('li');
            li.setAttribute('style', templater(itemStyle, data));
            img = new Image();
            img.src = data.images[i];
            img.ondragstart = function () {
                return false
            };
            li.appendChild(img);
            ul.appendChild(li);
        }
        document.querySelector(data.selector).appendChild(wrapper);
    };


    Slider.prototype.swipeSlider = function (data) {
        function handleTouchStart(event) {
            xDown = event.clientX || event.touches[0].clientX;
            yDown = event.clientY || event.touches[0].clientY;
        }

        function handleTouchMove(event) {
            var xUp, yUp, xDiff, yDiff;
            if (!xDown || !yDown) return;
            xUp = event.clientX || event.touches[0].clientX;
            yUp = event.clientY || event.touches[0].clientY;
            xDiff = xDown - xUp;
            yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                xDiff > 0 ? changeImage(this, 'left', data) : changeImage(this, 'right', data);
            }
            xDown = yDown = null;
        }

        function handleMouseEnter(event) {
            changeImage(this, 'stop', data)
        }

        function handleMouseOut(event) {
            changeImage(this, 'start', data)
        }

        var changeImage = this.changeImage,
            listItems = document.querySelectorAll('#' + data.id + ' li'),
            xDown, yDown;
        xDown = yDown = null;

        for (var i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener('touchstart', handleTouchStart, false);
            listItems[i].addEventListener('mousedown', handleTouchStart, false);
            listItems[i].addEventListener('touchmove', handleTouchMove, false);
            listItems[i].addEventListener('mouseup', handleTouchMove, false);
            listItems[i].addEventListener('mouseenter', handleMouseEnter, false);
            listItems[i].addEventListener('mouseout', handleMouseOut, false);
            listItems[i].addEventListener('touchend', handleMouseOut, false);
        }

        changeImage(listItems[0], 'start', data)
    };

    Slider.prototype.changeImage = function (element, course, data) {
        function autoSwipe(element) {
            position == imagesCount * data.width ? position = 0 : position += data.width;
            element.style.left = '-' + position + 'px';
        }

        function swipeLeft(element) {
            position == 0 ? position = imagesCount * data.width : position -= data.width;
            element.style.left = '-' + position + 'px';
        }

        function swipeRight(element) {
            position == imagesCount * data.width ? position = 0 : position += data.width;
            element.style.left = '-' + position + 'px';
        }

        var parent = element.parentElement || document.getElementById(data.id),
            position = Number(parent.style.left.replace(/\D/g, '')),
            imagesCount = data.images.length - 1;

        if (data.interval) clearInterval(data.interval);

        if (data.mode == 'auto') {
            setInterval(function () {
                autoSwipe(parent)
            }, data.swipeDelay);
        } else if (data.mode == 'automanual') {
            if (course == 'left') {
                clearInterval(data.interval);
                swipeRight(parent)
            } else if (course == 'right') {
                clearInterval(data.interval);
                swipeLeft(parent);
            } else if (course == 'start') {
                data.interval = setInterval(function () {
                    autoSwipe(parent)
                }, data.swipeDelay);
            }
        } else {
            if (course == 'left') {
                swipeRight(parent)
            } else if (course == 'right') {
                swipeLeft(parent);
            }
        }
    };

    //Subclass Slide
    function SlideSlider(data) {
        this.wrapperStyle = 'webkit-transition: all $swipeSpeed$s ease-out;-moz-transition: all $swipeSpeed$s ease-out;-o-transition: all $swipeSpeed$s ase-out;transition: all $swipeSpeed$s ease-out;width:9999px;left:0;';
        Slider.apply(this, arguments);
        countCreateGallery++;
    }

    SlideSlider.prototype = Object.create(Slider.prototype);
    SlideSlider.prototype.constructor = SlideSlider;


    //Subclass Fade
    function FadeSlider() {
        this.wrapperStyle = 'width:$width$px';
        this.itemStyle = '-webkit-animation:display-none-transition $swipeSpeed$s;animation:display-none-transition $swipeSpeed$s;width:$width$px;display:none;';
        Slider.apply(this, arguments);
        countCreateGallery++;
    }

    FadeSlider.prototype = Object.create(Slider.prototype);
    FadeSlider.prototype.constructor = FadeSlider;

    FadeSlider.prototype.changeImage = function (element, course, data) {
        function autoSwipe(current, next) {
            addClass(current, 'non_opacity');
            removeClass(current, 'opacity');
            addClass(next, 'opacity');
            removeClass(next, 'non_opacity');
            element = next;
        }

        function swipeLeft(current, prev) {
            addClass(current, 'non_opacity');
            removeClass(current, 'opacity');
            addClass(prev, 'opacity');
            removeClass(prev, 'non_opacity');
        }

        function swipeRight(current, next) {
            addClass(current, 'non_opacity');
            removeClass(current, 'opacity');
            addClass(next, 'opacity');
            removeClass(next, 'non_opacity');
        }


        addClass(element, 'opacity');
        if (data.interval) clearInterval(data.interval);

        if (data.mode == 'auto') {
            setInterval(function () {
                autoSwipe(element, element.nextSibling || element.parentElement.firstChild)
            }, data.swipeDelay);
        } else if (data.mode == 'automanual') {
            if (course == 'left') {
                clearInterval(data.interval);
                swipeRight(element, element.nextSibling || element.parentElement.firstChild)
            } else if (course == 'right') {
                clearInterval(data.interval);
                swipeLeft(element, element.previousSibling || element.parentElement.lastChild)
            } else if (course == 'start') {
                data.interval = setInterval(function () {
                    autoSwipe(element, element.nextSibling || element.parentElement.firstChild)
                }, data.swipeDelay);
            }
        } else {
            if (course == 'left') {
                swipeRight(element, element.nextSibling || element.parentElement.firstChild)
            } else if (course == 'right') {
                swipeLeft(element, element.previousSibling || element.parentElement.lastChild)
            }
        }
    };

    init(Slider, SlideSlider, FadeSlider);

})(function (Slider, SlideSlider, FadeSlider) {
    //Run slider
    window.addEventListener('load', function () {
        var slider = new Slider({
            selector: 'div.slider',
            width: 320,
            images: [
                'images/1.jpg',
                'images/2.jpg',
                'images/3.jpg',
                'images/4.jpg',
                'images/5.jpg',
                'images/6.jpg',
                'images/7.jpg',
                'images/8.jpg',
                'images/9.jpg',
                'images/10.jpg',
                'images/11.jpg'
            ],
            mode: 'auto',
            swipeDelay: 3000
        });

        var slider1 = new SlideSlider({
            selector: 'div.slide',
            width: 320,
            images: [
                'images/1.jpg',
                'images/2.jpg',
                'images/3.jpg',
                'images/4.jpg',
                'images/5.jpg',
                'images/6.jpg',
                'images/7.jpg',
                'images/8.jpg',
                'images/9.jpg',
                'images/10.jpg',
                'images/11.jpg'
            ],
            mode: 'manual',
            swipeSpeed: 700
        });

        var slider2 = new FadeSlider({
            selector: 'div.fade',
            width: 320,
            images: [
                'images/1.jpg',
                'images/2.jpg',
                'images/3.jpg',
                'images/4.jpg',
                'images/5.jpg',
                'images/6.jpg',
                'images/7.jpg',
                'images/8.jpg',
                'images/9.jpg',
                'images/10.jpg',
                'images/11.jpg'
            ],
            mode: 'automanual',
            swipeSpeed: 1000,
            swipeDelay: 7000
        });
    }, false);
});