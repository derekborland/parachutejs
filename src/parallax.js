;(function($, Parachute) {
	
	'use strict'
	
	function Parallax (options) {
		this.options = $.extend({}, Parallax.DEFAULTS, options);
		this.element = this.options.element;
		this.$element = $(this.options.element);
		this.boundingBox = $(this.options.element)[0].getBoundingClientRect();
		this.topTriggerOffset = this.options.topTriggerOffset;
		this.currentScrollTop = 0;
		this.pxToMove = this.options.pxToMove;
	};
	
	Parallax.DEFAULTS = {
		speed: 1,
		pxToMove: 0,
		topTriggerOffset: 400
	};
	
	Parachute.Parallax = Parallax;
	
})(jQuery, Parachute);