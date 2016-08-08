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