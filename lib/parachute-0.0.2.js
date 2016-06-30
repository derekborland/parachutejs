/*! parachutejs 0.0.2 | https://github.com/derekborland/parachutejs.git | Built: 1467317913337 */
;(function($, window, document, undefined){


	// Usage:

	// Page setup:
	//
	// Parachute.page({
	// 	pageWrapper: '#pageWrapper'
	// 	scrollContainer: '#scrollContainer',
	// 	fakeContainer: '#fakeContainer'
	// });

	// Parallax elements
	//
	// Parachute.parallax({
	// 	element: '#element',
	//  pxToMove: -200,
	//  topTriggerOffset: 600
	// });

	// Sequence elements:
	//
	// `active` passed to callback is TRUE for scrolled into view
	// FALSE for out of view (below fold)
	//
	// `offset` is from bottom of the browser
	//
	// Parachute.sequence({
	// 	element: '#element',
	// 	callback: function(active) {},
	// 	offset: 200
	// });

	// Init
	//
	// Parachute.init();


	function Parachute() {
		// defaults
		this.defaults = {
			pageWrapper: '#pageWrapper',
			scrollContainer: '#scrollContainer',
			heightContainer: '#heightContainer',
		};
		this.opts;

		this.$pageWrapper;
		this.$scrollContainer;
		this.$heightContainer;

		this.$win;
		this.winHeight;
		this.winWidth;

		this.scrollTop = 0;
		this.currentScrollTop = 0;

		this.parallaxArr = [];
		this.parallaxArrLength = 0;

		this.sequenceArr = [];
		this.sequenceArrLength = 0;

		this.triggerOffset = 200;

		this.bottomTriggerOffset = 250;
	};

	// page setup function
	Parachute.prototype.page = function(opts) {
		// merge defaults with user passed options
		this.opts = $.extend({}, this.defaults, opts);
		this.$pageWrapper = $(this.opts.pageWrapper);
		this.$scrollContainer = $(this.opts.scrollContainer);
		this.$heightContainer = $(this.opts.heightContainer);
	};

	// add to parallax array
	Parachute.prototype.parallax = function(opts) {
		this.parallaxArr.push({
			element: opts.element,
			$element: $(opts.element),
			speed: opts.speed || 1,
			pxToMove: opts.pxToMove || 0,
			topTriggerOffset: opts.topTriggerOffset || 0,
			boundingBox: $(opts.element)[0].getBoundingClientRect(),
			currentScrollTop: 0
		});
		this.parallaxArrLength++;
	};

	// add to sequence array
	Parachute.prototype.sequence = function(opts) {
		this.sequenceArr.push({
			element: opts.element,
			callback: opts.callback,
			offset: opts.offset,
			boundingBox: $(opts.element)[0].getBoundingClientRect()
		});
		this.sequenceArrLength++;
	};

	// initialize
	Parachute.prototype.init = function() {
		// events
		this.$win = $(window);
		this.$win.scroll($.proxy(this.onScroll, this));
		this.$win.resize($.proxy(this.onResize, this));
		// init
		this.onResize();
		this.updateHeight();
		this.onEnterFrame();
	};


	// update height function
	Parachute.prototype.updateHeight = function() {
		this.$heightContainer.css('height', this.$scrollContainer.height());
	};

	// resize event callback
	Parachute.prototype.onResize = function() {
		this.$win = $(window);
		this.winHeight = this.$win.height();
		this.winWidth = this.$win.width();
	};

	// scroll event callback
	Parachute.prototype.onScroll = function() {
		this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		// console.log('scrolling');
	};

	// frame animation callback
	Parachute.prototype.onEnterFrame = function() {
		requestAnimationFrame($.proxy(this.onEnterFrame, this));

		// animate...
		this.scrollEasing();
		this.parallaxAnimations();
		this.sequenceAnimations();
	};

	// scroll easing function
	Parachute.prototype.scrollEasing = function() {
		// page scroll easing
		this.currentScrollTop += (this.scrollTop - this.currentScrollTop) * 0.075;
		if(this.currentScrollTop < 1) { this.currentScrollTop = 0 }
		this.$scrollContainer.css({
			'transform': 'translateY(' + -this.currentScrollTop + 'px) translateZ(0)'
		});
	};

	// parallax animations
	Parachute.prototype.parallaxAnimations = function() {
		for(var i = 0; i < this.parallaxArrLength; i++) {
			
			var elementTopPixelRange = this.parallaxArr[i].boundingBox.top + this.parallaxArr[i].boundingBox.height - this.parallaxArr[i].topTriggerOffset;
			var elementBottomPixedRange = this.parallaxArr[i].boundingBox.top - this.winHeight;
			var elementRangeDiff = elementTopPixelRange - elementBottomPixedRange;
			var pxMulitplier = this.parallaxArr[i].pxToMove / this.winHeight;

			// console.log('scrollTop:', this.scrollTop, 'topRange:', elementTopPixelRange, 'bottomRange:',elementBottomPixedRange, 'diff:', elementRangeDiff);

			// Element is in view
			if( this.scrollTop > elementBottomPixedRange && this.scrollTop < elementTopPixelRange ) {
				this.parallaxArr[i].currentScrollTop += ((( this.scrollTop - elementBottomPixedRange ) * pxMulitplier ) - this.parallaxArr[i].currentScrollTop ) * 0.075;
				if( this.parallaxArr[i].currentScrollTop < this.parallaxArr[i].pxToMove ) {
					this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
				}
			}
			
			// Element is below viewport
			if( this.scrollTop < elementBottomPixedRange ) {
				this.parallaxArr[i].currentScrollTop -= this.parallaxArr[i].currentScrollTop * 0.075;
				if( this.parallaxArr[i].currentScrollTop >= -1 ) {
					this.parallaxArr[i].currentScrollTop = 0;
				}
			}
			
			// Element is above viewport
			if( this.scrollTop > elementTopPixelRange ) {
				this.parallaxArr[i].currentScrollTop += Math.round(this.parallaxArr[i].currentScrollTop * 0.075);
				if( this.parallaxArr[i].currentScrollTop <= this.parallaxArr[i].pxToMove+2) {
					this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
				}
			}

			this.parallaxArr[i].$element.css({
				'transform': 'translateY(' + this.parallaxArr[i].currentScrollTop + 'px) translateZ(0)',
				'backface-visibility': 'hidden'
			});
		}
	};

	// check if element is in view ( parallax )
	Parachute.prototype.elementInView = function(i) {
		if(this.scrollTop > (this.parallaxArr[i].boundingBox.top - this.winHeight - this.triggerOffset)) {
			if(this.scrollTop < (this.parallaxArr[i].boundingBox.top + this.parallaxArr[i].boundingBox.height + this.triggerOffset)) {
				return true
			}
		}
		return false;
	};

	// sequence animations
	Parachute.prototype.sequenceAnimations = function() {
		for(var i = 0; i < this.sequenceArrLength; i++) {
			if(this.sequenceElementInView(i)) {
				this.sequenceArr[i].callback(true);
			} else {
				this.sequenceArr[i].callback(false);
			}
		}
	};

	// check if element is in view ( sequence )
	Parachute.prototype.sequenceElementInView = function(i) {
		if(this.scrollTop > (this.sequenceArr[i].boundingBox.top - this.winHeight + Number(this.sequenceArr[i].offset))) {
			return true;
		}
		return false;
	};

	window.Parachute = new Parachute();

})(jQuery, window, document);