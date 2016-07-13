;(function($, Parachute) {
	
	'use strict'
	
	function Trigger (element, options) {
		this.options = $.extend({}, Trigger.DEFAULTS, options);
		this.element = element
		this.$element = $(element);
		this.callback = this.options.callback;
		this.offset = this.options.offset;
		this.boundingBox = $(element)[0].getBoundingClientRect();
	};
	
	Trigger.DEFAULTS = {
		offset: 300,
		callback: function() {} // noop
	};
	
	Trigger.prototype.callback = function (active) {
		return this.callback(active);
	};
	
	Parachute.Trigger = Trigger;
	
})(jQuery, Parachute);