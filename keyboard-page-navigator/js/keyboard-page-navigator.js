/**
 * Show focus by keyboard
 */

function KeyboardPageNavigator(config = null) {
	var defaultConfig = {
		tags: {
			headers: {
				keyCodes: ['KeyH'],
				selectors: [
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				]
			},
			links: {
				keyCodes: ['KeyL'],
				selectors: ['a']
			},
			landmarks: {
				keyCodes: ['KeyM'],
				selectors: [
					'header',
					'nav',
					'main',
					'footer',
					'aside',
					'section',
					'article',
					'form',
					'[role="banner"]',
					'[role="navigation"]',
					'[role="main"]',
					'[role="contentinfo"]',
					'[role="complementary"]',
					'[role="region"]',
					'[role="article"]',
					'[role="search"]',
					'[role="form"]'
				]
			}
		}
	};

	this._config = Object.assign(defaultConfig, config);
	this._tagElements = {};
	this._direction = 1;
	this._focusedIndex = -1;
	this._focusedTag = null;

	//Private functions
	this._init = function () {
		this._addOverlayElement();
		this._loadTags();
		this._addObserver();
		this._addEventHandler();
	};

	this._addOverlayElement = function () {
		this._overlayElement = document.createElement('div');
		this._overlayElement.style.cssText = 'position:absolute;opacity:0.3;z-index:1000;background:#00ff22;padding:10px';
		this._overlayElement.style.display = 'none';
		document.body.appendChild(this._overlayElement);
	};

	this._addObserver = function () {
		var callback = function (mutationsList, observer) {
			var i;
			for (i = 0; i < mutationsList.length; i++) {
				if (mutationsList[i].type == 'childList') {
					//added or removed children
					this._loadTags();
					this._overlayElement.style.display = 'none';
					this._focusedIndex = -1;
					this._focusedTag = null;
					return;
				}
			}
		};

		var observer = new MutationObserver(callback);
		observer.observe(document.body, {childList: true, subtree: true});
	}.bind(this);

	this._loadTags = function () {
		var tagsConfig = Object.keys(this._config.tags);
		var i;
		this._tagElements = {};

		for (i = 0; i < tagsConfig.length; i++) {
			this._tagElements[tagsConfig[i]] = document.querySelectorAll(this._config.tags[tagsConfig[i]].selectors.join(', '));
		}
	};

	this._addEventHandler = function () {
		document.addEventListener('keydown', this._onKeyDown.bind(this));
	};

	this._setDirection = function (direction) {
		this._direction = direction;
	};

	this._moveFocus = function (tagName) {
		var tagElements = this._tagElements[tagName];
		var startIndex = -1, nextIndex = -1;

		if (tagElements.length > 0) {
			if (this._focusedTag != tagName) {
				nextIndex = this._direction == 1 ? 0 : tagElements.length - 1;
			} else {
				nextIndex = (this._focusedIndex + this._direction + tagElements.length) % tagElements.length;
			}
			startIndex = nextIndex;

			// skip disabled or hidden items
			while (1) {
				var element = this._tagElements[tagName][nextIndex];
				if (!element.disabled && element.offsetWidth > 0 && element.offsetHeight > 0) {
					break;
				}
				nextIndex = (nextIndex + this._direction + tagElements.length) % tagElements.length;
				if (startIndex == nextIndex) {
					this._removeCurrentFocused();
					break;
				}
			}
		}
		this._addFocus(tagName, nextIndex);
	};


	this._addFocus = function (tagName, tagIndex) {
		this._removeCurrentFocused();
		var tagElements = this._tagElements[tagName];
		if (tagElements.length > 0) {
			this._focusedTag = tagName;
			this._focusedIndex = tagIndex;
			var focusedElement = this._tagElements[this._focusedTag][this._focusedIndex];

			var rect = focusedElement.getBoundingClientRect();
			var body = document.body;

			var scrollTop = window.pageYOffset || focusedElement.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || focusedElement.scrollLeft || body.scrollLeft;

			var clientTop = focusedElement.clientTop || body.clientTop || 0;
			var clientLeft = focusedElement.clientLeft || body.clientLeft || 0;

			var top = rect.top + scrollTop - clientTop;
			var left = rect.left + scrollLeft - clientLeft;

			this._overlayElement.style.top = (top - 10) + 'px';
			this._overlayElement.style.left = (left - 10) + 'px';
			this._overlayElement.style.width = (rect.width + 20) + 'px';
			this._overlayElement.style.height = (rect.height + 20) + 'px';
			this._overlayElement.style.display = 'block';

			// scroll to element if it is not inside the viewport
			if (!(rect.top >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))) {
				window.scrollTo(0, top - 20);
			}

		} else {
			this._focusedTag = null;
			this._focusedIndex = -1;
			this._overlayElement.style.display = 'none';
		}

	};
	this._removeCurrentFocused = function () {
		if (this._focusedTag && this._focusedIndex >= 0) {
			this._overlayElement.style.display = 'none';
		}

		this._focusedIndex = -1;
		this._focusedTag = null;
	};

	this._onKeyDown = function (event) {
		var activeElement = document.activeElement;
		if (activeElement) {
			var tagName = activeElement.tagName.toLowerCase();
			if (tagName == 'input' || tagName == 'textarea' || tagName == 'select') {
				return;
			}
		}

		if (event.code == 'Escape') {
			this._removeCurrentFocused();
			return;
		} else if (event.code == 'ArrowUp') {
			event.preventDefault();
			this._setDirection(-1);
		} else if (event.code == 'ArrowDown') {
			event.preventDefault();
			this._setDirection(1);
		} else {
			var tagName = this._getTagNameByKeycode(event.code);

			if (tagName) {
				this._moveFocus(tagName);
			}
		}
	};

	this._getTagNameByKeycode = function (keycode) {
		var tagsConfig = this._config.tags;
		var tagNames = Object.keys(tagsConfig);
		var i;

		for (i = 0; i < tagNames.length; i++) {
			if (tagsConfig[tagNames[i]].keyCodes.includes(keycode)) {
				return tagNames[i];
			}
		}
		return null;
	};
}

KeyboardPageNavigator.prototype = {
	// Public functions
	apply: function () {
		this._init();
	}
};

var PageNavigator = new KeyboardPageNavigator();
PageNavigator.apply();