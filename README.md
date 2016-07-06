```javascript
;(function($){
			
	// window ready
	Parachute.onReady(function(Parachute) {
		// console.log(Parachute);v
		
		// page
		Parachute.page({
			// pageWrapper: '#page',
			scrollContainer: '#scrollContainer',
			heightContainer: '#fakeScrollContainer'
		});

		// parallax
		Parachute.parallax({
			element: '.js-parallax-1',
			pxToMove: -400,
			topTriggerOffset: 400
		});

		Parachute.parallax({
			element: '.js-parallax-2',
			pxToMove: -200,
			topTriggerOffset: 400
		});

		// sequence
		Parachute.sequence({
			element: '.js-cascade-1',
			callback: function(active) {
				// console.log(active);
				// `active = true`
				// element is in view
				//
				// `active = false`
				// element not in view
			},
			offset: (function(){
				return 200;
			})()
		});

		// let's go!
		Parachute.init();
		
	});

})(jQuery);
```