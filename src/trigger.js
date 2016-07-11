;(function($, Parachute) {
	
	'use strict'
	
	function Trigger (options) {
		this.options = $.extend({}, Trigger.DEFAULTS, options);
		this.element = this.options.element;
		this.$element = $(this.options.element);
		this.callback = this.options.callback;
		this.offset = this.options.offset;
		this.boundingBox = $(this.options.element)[0].getBoundingClientRect();
	};
	
	Trigger.DEFAULTS = {
		offset: 300,
		callback: function() {} // no op
	};
	
	Trigger.prototype.callback = function (active) {
		return this.callback(active);
	};
	
	Parachute.Trigger = Trigger;
	
})(jQuery, Parachute);