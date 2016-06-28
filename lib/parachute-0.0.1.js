/*! parachutejs 0.0.1 | https://github.com/derekborland/parachutejs.git | Built: 1467148972056 */
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
				
				// easing - working / old
				// this.parallaxArr[i].currentScrollTop += (((this.parallaxArr[i].boundingBox.top - this.winHeight - this.scrollTop) / 4) - this.parallaxArr[i].currentScrollTop) * 0.075;

			var elementInViewBottom = this.winHeight + this.scrollTop + this.bottomTriggerOffset >= this.parallaxArr[i].boundingBox.top;
			var elementInViewTop = this.scrollTop <= this.parallaxArr[i].boundingBox.top + this.parallaxArr[i].boundingBox.height -this.parallaxArr[i].topTriggerOffset;
			var _pxToMove = this.parallaxArr[i].pxToMove / this.winHeight;
			var elementPositionFromViewportTop = this.parallaxArr[i].boundingBox.top - this.scrollTop;
			
			// element is in the viewport
			if(elementInViewBottom && elementInViewTop) {
				// parallax easing
				this.parallaxArr[i].currentScrollTop += (((elementPositionFromViewportTop - this.winHeight) * -_pxToMove) - this.parallaxArr[i].currentScrollTop) * 0.075;
				
				
			// element is at the top of the viewport
			} else if (elementInViewBottom) {
				if(!(this.parallaxArr[i].currentScrollTop < this.parallaxArr[i].pxToMove + 1)) { 
					// parallax easing
					this.parallaxArr[i].currentScrollTop += (this.parallaxArr[i].pxToMove - this.parallaxArr[i].currentScrollTop) * 0.075;
				} else if (this.parallaxArr[i].currentScrollTop < this.parallaxArr[i].pxToMove + 2) {
					// snap to the `pxToMove` value
					this.parallaxArr[i].currentScrollTop += (this.parallaxArr[i].pxToMove - this.parallaxArr[i].currentScrollTop);
					
				}
			}
			
			// apply transfomation
			$(this.parallaxArr[i].element).css({
				'transform': 'translateY(' + this.parallaxArr[i].currentScrollTop + 'px) translateZ(0)' 
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