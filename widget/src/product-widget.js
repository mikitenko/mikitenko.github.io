/**
 * Product widget
 * Created by Mikitenko.R
 *
 * Options:
 * container — selector for rendering (string)
 * url — path to json (string)
 * speed — animation speed (number), default value 200
 *
 * Example:
 * var widget = new ProductWidget({
 *   container: '#second',
 *   url: '/widget/src/info_box.json',
 *   speed: 300
 * });
 */
;
(function (w) {
    function ProductWidget(data) {
        this.container = data.container || false;
        this.url = data.url || false;
        this.speed = data.speed || 200;
        this.descriptionHeight = 0;
        this.descriptionHeightDefault = 33;
        this.mainImageHeight = 0;
        this.eventChangeState = true;
        this.productsStorage = {};
        this.mainTemplate = '<div class="widget_wrapper"><div class="product_wrapper"></div><div class="control_wrapper"><div class="next_prev_wrapper"><a class="prev_product" href="javascript:void(0);">Prev</a><a class="next_product" href="javascript:void(0);">Next</a></div><div class="find_store_wrapper"><a class="find_product_instore" href="#">Find a Store</a></div></div></div>';
        this.productTemplate = '<div class="product"><a class="link_mainimage" href="{productUrl}"><img class="product_mainimage" src="{img}" alt="" onerror="this.style.visibility =\'hidden\'"/></a><h2 class="product_title">{title}</h2><div class="product_descnot_wrapper"><p class="product_description">{description}</p><p class="product_note">{note}</p></div><a class="show_detail_product" href="javascript:void(0);">show details</a></div>';
        this.current = 0;
        this.ajax.call(this, {
            url: this.url,
            type: 'GET',
            success: function (response) {
                this.productsStorage = JSON.parse(response);
                this.init();
            }
        });
    }

    ProductWidget.prototype = {
        getType: function (obj) {
            return Object.prototype.toString.call(obj);
        },
        addClass: function (node, className) {
            var arrClass = node.className ? node.className.split(' ') : [];
            for (var i = 0; i < arrClass.length; i++) {
                if (arrClass[i] == className) return;
            }
            arrClass.push(className);
            node.className = arrClass.join(' ');
        },
        removeClass: function (node, className) {
            var arrClass = node.className.split(' ');
            for (var i = 0; i < arrClass.length; i++) {
                if (arrClass[i] == className) arrClass.splice(i--, 1);
            }
            node.className = arrClass.join(' ');
        },
        hasClass: function hasClass(node, className) {
            for (var arrClass = node.className.split(' '), i = arrClass.length - 1; i >= 0; i--) {
                if (arrClass[i] == className) return true;
            }
            return false;
        },
        ajax: function (option) {
            if (this.getType(option.type) === '[object Undefined]') option.type = 'GET';
            if (this.getType(option.data) === '[object Undefined]') option.data = '';
            if (this.getType(option.url) !== '[object String]') return;

            var xhr = null,
                myReadyStateChange;

            if (window.XMLHttpRequest || window.ActiveXObject) {
                if (window.ActiveXObject) {
                    try {
                        xhr = new ActiveXObject('Msxml2.XMLHTTP');
                    } catch (e) {
                        xhr = new ActiveXObject('Microsoft.XMLHTTP');
                    }
                }
                else {
                    xhr = new XMLHttpRequest();
                }
            }

            myReadyStateChange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 0) {
                        option.success.call(this, xhr.responseText);
                    }
                }
            };

            xhr.onreadystatechange = myReadyStateChange.bind(this);

            xhr.open(option.type, option.url + option.data, true);
            xhr.send(null);
        },
        addEvent: function (node, event, fn) {
            event = event.split(',');

            for (var i = 0; i < event.length; i++) {
                if (node.addEventListener) {
                    node.addEventListener(event[i], fn, false);
                } else {
                    node.attachEvent('on' + event[i], fn);
                }
            }
        },
        templater: function (string, data) {
            var isVariable = true,
                html = string.replace(/\{([^\{]+)\}/g, function (matchString, paramName) {
                    if (data[paramName] != undefined) {
                        return data[paramName];
                    } else {
                        isVariable = false;
                    }
                });
            return {
                response: html,
                error: isVariable
            }
        },
        animate: function (data) { //node, property, startValue, endValue, time, callback
            var handle, delta,
                frameRate = 0.06, // 60 FPS
                frame = 0,
                property = (data.property != 'opacity') ? 'px' : '';
            data.self = this;
            delta = (data.endValue - data.startValue) / data.time / frameRate;
            this.eventChangeState = false;
            handle = setInterval(function () {
                frame++;
                var value;
                if (data.property != 'opacity') {
                    value = Number((data.startValue + delta * frame).toFixed());
                } else {
                    value = data.startValue + delta * frame;
                }
                data.node.style[data.property] = value + property;
                if (value == data.endValue) {
                    clearInterval(handle);
                    data.self.eventChangeState = true;
                }
            }, 1 / frameRate);
        },
        appendHtml: function () {
            var htmlFillResult = this.templater(this.productTemplate, this.productsStorage[this.current]),
                productWrapper = document.querySelector(this.container + ' .product_wrapper'),
                description,
                mainImage;

            if (htmlFillResult.error) {
                productWrapper.style['opacity'] = 0;
                productWrapper.innerHTML = htmlFillResult.response;
                description = document.querySelector(this.container + ' .product .product_descnot_wrapper');
                mainImage = document.querySelector(this.container + ' .product .link_mainimage');
                this.descriptionHeight = description.offsetHeight;
                this.mainImageHeight = mainImage.offsetHeight;
                description.style.height = this.descriptionHeightDefault + 'px';
                this.animate({node: productWrapper, property: 'opacity', startValue: 0, endValue: 1, time: this.speed});
            } else {
                this.productsStorage.splice(this.current, 1);
                if (this.productsStorage[this.current] == undefined) this.current = 0;
                this.appendHtml();
            }
        },
        renderProduct: function (event) {
            var isTarger = function (event, string) {
                var pathEvent = [],
                    parent = event.target;
                while (parent) {
                    pathEvent.push(parent);
                    parent = parent.parentNode;
                }
                return this.hasClass(event.target, string) && pathEvent.indexOf(document.querySelector(this.container)) != -1;
            };

            var product, description, mainImage;

            if(!this.eventChangeState) return;

            if (event == 'default') {
                document.querySelector(this.container).innerHTML = this.mainTemplate;
                this.appendHtml();
            } else if (isTarger.call(this, event, 'next_product')) {
                if (this.current != this.productsStorage.length - 1) {
                    this.current++;
                } else {
                    this.current = 0;
                }
                this.appendHtml();
            } else if (isTarger.call(this, event, 'prev_product')) {
                if (this.current != 0) {
                    this.current--;
                } else {
                    this.current = this.productsStorage.length - 1;
                }
                this.appendHtml();
            } else if (isTarger.call(this, event, 'show_detail_product')) {
                product = document.querySelector(this.container + ' .product');
                description = document.querySelector(this.container + ' .product .product_descnot_wrapper');
                mainImage = document.querySelector(this.container + ' .product .link_mainimage');
                if (this.hasClass(product, 'show_details')) {
                    this.removeClass(product, 'show_details');
                    event.target.innerHTML = 'show details';
                    this.animate({node: mainImage, property: 'opacity', startValue: 0, endValue: 1, time: this.speed});
                    this.animate({node: mainImage, property: 'height', startValue: 0, endValue: this.mainImageHeight, time: this.speed});
                    this.animate({node: description, property: 'height', startValue: this.descriptionHeight, endValue: this.descriptionHeightDefault, time: this.speed});
                } else {
                    this.addClass(product, 'show_details');
                    event.target.innerHTML = 'hide details';
                    this.animate({node: mainImage, property: 'opacity', startValue: 1, endValue: 0, time: this.speed});
                    this.animate({node: mainImage, property: 'height', startValue: this.mainImageHeight, endValue: 0, time: this.speed});
                    this.animate({node: description, property: 'height', startValue: this.descriptionHeightDefault, endValue: this.descriptionHeight, time: this.speed});
                }
            }
        },
        init: function () {
            if (document.querySelector(this.container) !== null) {
                this.renderProduct('default');
                this.addEvent(document.body, 'click, mousedown', this.renderProduct.bind(this));
            }
        }
    };
    w.ProductWidget = ProductWidget;
})(window);