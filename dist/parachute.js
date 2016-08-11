/**
 * parachutejs - inertia scrolling/parallax jquery library
 * @version v0.0.7
 * @link https://github.com/derekborland/parachutejs#readme
 * @license MIT
 */
;(function($){
	
	'use strict'
	
	var Parachute = function () {
		this.options;
		this.$window;
		this.$scrollContainer;
		this.$heightContainer;
		this.$anchorLinks;
		this.windowWidth;
		this.windowHeight;
		this.scrollTop = 0;
		this.currentScrollTop = 0;
		this.triggerArray = [];
		this.parallaxArr = [];
		this.disabled = false;
	};
	
	Parachute.DEFAULTS = {
		scrollContainer: '#scrollContainer',
		heightContainer: '#heightContainer',
		easingMultiplier: 0.075
	};
	
	Parachute.prototype.init = function () {
		this.$window = $(window);
		this.onResize();
		this.initEvents();
		this.initAnchorLinks();
		this.onEnterFrame();
	};
	
	// @todo
	Parachute.prototype.reload = function () {
		// this.reset();
		// this.onResize();
	};
	
	// @todo
	Parachute.prototype.reset = function () {
		// clear arrays
		// save old versions???
		// this.triggerArray.length = 0;
		// this.parallaxArr.length = 0;
	};
	
	// @todo
	Parachute.prototype.disable = function () {
		// freeze scrollbar???
		// this.disabled = true;
	};
	
	// @todo
	Parachute.prototype.enable = function () {
		// this.disabled = false;
	};
	
	// @todo
	Parachute.prototype.resetElements = function () {
		// reset elements to their initial positions. (i.e remove css transforms)
		
		// reset main scroll container
		this.$scrollContainer.css({ 'transform': 'translateY(0) translateZ(0)' });
		
		// reset parallax elements
		for(var i = 0, l = this.parallaxArr.length; i < l; i++) {
			this.parallaxArr[i].$element.css({ 'transform': 'translateY(0) translateZ(0)' });
		}
	};
	
	Parachute.prototype.initEvents = function () {
		this.$window.on('resize', $.proxy(this.onResize, this));
		this.$window.on('scroll', $.proxy(this.onScroll, this));
	};
	
	// Parachute.prototype.disableEvents = function () {
	// 	this.$window.off('resize', $.proxy(this.onResize, this));
	// 	this.$window.off('scroll', $.proxy(this.onScroll, this));
	// };
	
	Parachute.prototype.initAnchorLinks = function () {
		var _Parachute = this;
		this.checkURLHash();
		this.$anchorLinks = $('a[href^="#"]'); // starts with `#`
		this.$anchorLinks.each(function () {
			var $this = $(this);
			$this.addClass('parachute-anchor-active');
			$this.on('click', function () {
				var selectorName = $this[0].hash.split('#')[1];
				_Parachute.scrollToAnchor(selectorName);
			});
		});
	};
	
	Parachute.prototype.checkURLHash = function () {
		var selectorName = window.location.hash.split('#')[1];
		if (selectorName) { this.scrollToAnchor(selectorName); }
	};
	
	Parachute.prototype.scrollToAnchor = function (selectorName) {
		var pxFromTop;
		// @todo
		var target = $('a[id="' + selectorName + '"]');
		if(target.length) {
			pxFromTop = target[0].getBoundingClientRect().top + this.currentScrollTop;
			setTimeout(function () { $(window).scrollTop(pxFromTop); }, 0);
		}
	};
	
	Parachute.prototype.page = function (options) {
		this.options = $.extend({}, Parachute.DEFAULTS, options);
		this.$scrollContainer = $(this.options.scrollContainer);
		this.$heightContainer = $(this.options.heightContainer);
	};
	
	Parachute.prototype.onResize = function () {
		this.windowHeight = this.$window.height();
		this.windowWidth = this.$window.width();
		
		this.$heightContainer.css('height', this.$scrollContainer.height());	
		this.resetElements();
	};
	
	Parachute.prototype.onScroll = function () {
		this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	};
	
	Parachute.prototype.onEnterFrame = function () {
		requestAnimationFrame($.proxy(this.onEnterFrame, this));

		this.scrollEasing();	
		this.triggerAnimations();
		this.parallaxAnimations();
	};
	
	Parachute.prototype.scrollEasing = function () {
		this.currentScrollTop += (this.scrollTop - this.currentScrollTop) * this.options.easingMultiplier;
		if (this.currentScrollTop < 1) { this.currentScrollTop = 0 };
		this.$scrollContainer.css({ 'transform': 'translateY(' + -this.currentScrollTop + 'px) translateZ(0)' });
	};
	
	// trigger
	Parachute.prototype.trigger = Parachute.prototype.sequence = function (options) {
		var _Trigger, _Parachute = this;
		if (!$.isArray(options.element)) options.element = [options.element];
		for (var i = 0; i < options.element.length; i++) {
			var $el = $(options.element[i]);
			$el.each(function () { 
				_Trigger = new _Parachute.Trigger(this, options);
				_Parachute.triggerArray.push(_Trigger);
			});
		}
		return _Trigger;
	};
	
	Parachute.prototype.triggerAnimations = function () {
		for (var i = 0, l = this.triggerArray.length; i < l; i++) {
			this.triggerArray[i].callback(this.triggerInView(i));
		}
	};
	
	Parachute.prototype.triggerInView = function (i) {
		var triggerOffset = this.triggerArray[i].boundingBox.top - this.windowHeight + this.triggerArray[i].offset;
		if (this.scrollTop > triggerOffset) return true;
		return false;
	};
	
	// parallax
	Parachute.prototype.parallax = function (options) {
		var _Parallax, _Parachute = this;
		if (!$.isArray(options.element)) options.element = [options.element];
		for (var i = 0; i < options.element.length; i++) {	
			var $el = $(options.element[i]);
			$el.each(function () {
				_Parallax = new _Parachute.Parallax(this, options);
				_Parachute.parallaxArr.push(_Parallax);
			});
		}
		return _Parallax;
	};
	
	Parachute.prototype.parallaxAnimations = function () {
		
		if(this.windowWidth < 1024) return;
		
		for (var i = 0, l = this.parallaxArr.length; i < l; i++) {
			var elementTopPixelRange = this.parallaxArr[i].boundingBox.top + this.parallaxArr[i].boundingBox.height - this.parallaxArr[i].topTriggerOffset;
			var elementBottomPixedRange = this.parallaxArr[i].boundingBox.top - this.windowHeight;
			var elementRangeDiff = elementTopPixelRange - elementBottomPixedRange;
			var pxMulitplier = this.parallaxArr[i].pxToMove / (this.windowHeight + this.parallaxArr[i].boundingBox.height + this.parallaxArr[i].pxToMove - this.parallaxArr[i].topTriggerOffset);

			// @todo cleanup

			// Element is in view
			if( this.scrollTop > elementBottomPixedRange && this.scrollTop < elementTopPixelRange ) {				
				this.parallaxArr[i].currentScrollTop += ((-(this.parallaxArr[i].boundingBox.top - this.scrollTop - this.windowHeight) * pxMulitplier) - this.parallaxArr[i].currentScrollTop) * this.options.easingMultiplier;
				if( this.parallaxArr[i].currentScrollTop < this.parallaxArr[i].pxToMove ) {
					this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
				}
			}
			
			// Element is below viewport
			if( this.scrollTop < elementBottomPixedRange ) {
				this.parallaxArr[i].currentScrollTop -= this.parallaxArr[i].currentScrollTop * this.options.easingMultiplier;
				if( this.parallaxArr[i].currentScrollTop >= -1 ) {
					this.parallaxArr[i].currentScrollTop = 0;
				}
			}
			
			// Element is above viewport
			// if( this.scrollTop > elementTopPixelRange ) {
			// 	this.parallaxArr[i].currentScrollTop += Math.round(this.parallaxArr[i].currentScrollTop * this.options.easingMultiplier);
			// 	if( this.parallaxArr[i].currentScrollTop <= this.parallaxArr[i].pxToMove+1) {
			// 		this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
			// 	}
			// 	console.log('outta view');
			// }

			this.parallaxArr[i].$element.css({
				'transform': 'translateY(' + this.parallaxArr[i].currentScrollTop + 'px) translateZ(0)',
				'backface-visibility': 'hidden'
			});
		}
	};
	
	window.Parachute = new Parachute();
	
})(jQuery);
;(function($, Parachute) {
	
	'use strict'
	
	function Trigger (element, options) {
		this.options = $.extend({}, Trigger.DEFAULTS, options);
		this.element = element
		this.$element = $(element);
		this.cb = this.options.callback;
		this.offset = this.options.offset;
		this.boundingBox = $(element)[0].getBoundingClientRect();
	};
	
	Trigger.DEFAULTS = {
		offset: 300,
		callback: function() {} // noop
	};
	
	Trigger.prototype.callback = function (active) {
		return this.cb(active);
	};
	
	Parachute.Trigger = Trigger;
	
})(jQuery, Parachute);
;(function($, Parachute) {
	
	'use strict'
	
	function Parallax (element, options) {
		this.options = $.extend({}, Parallax.DEFAULTS, options);
		this.element = element;
		this.$element = $(element);
		this.boundingBox = $(element)[0].getBoundingClientRect();
		this.topTriggerOffset = this.options.topTriggerOffset;
		this.currentScrollTop = 0;
		this.pxToMove = this.options.pxToMove;
	};
	
	Parallax.DEFAULTS = {
		// speed: 1,
		pxToMove: 0,
		topTriggerOffset: 0
	};
	
	Parachute.Parallax = Parallax;
	
})(jQuery, Parachute);