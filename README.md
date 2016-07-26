### Parachute JS - jQuery smooth scrolling/parallax

[Download](https://github.com/derekborland/parachutejs/blob/master/dist/parachute.js) 


```javascript
;(function($){
			
	/* -------------------- window ready -------------------- */
	$(window).ready(function(){
		
		
		/* -------------------- page setup -------------------- */
		Parachute.page({
			scrollContainer: '#scrollContainer',
			heightContainer: '#fakeScrollContainer'
		});

		
		/* -------------------- parallax -------------------- */
		Parachute.parallax({
			element: '.js-parallax-1',
			pxToMove: -400
			// topTriggerOffset: 200
		});
		
		Parachute.parallax({
			element: '.js-parallax-2',
			pxToMove: -200
		});

		// accepts array of selectors
		// Parachute.parallax({
		// 	element: ['.js-parallax-2', '.js-parallax-1'],
		// 	pxToMove: -200
		// });


		/* -------------------- sequence/trigger -------------------- */
		Parachute.sequence({
			element: '.js-parallax-1',
			callback: function(active) {
				if (active) {
					$(this.$element).addClass('test');
				} else {
					$(this.$element).removeClass('test');
				}
			}
		});
		
		// accepts array of selectors
		// Parachute.sequence({
		// 	element: ['.js-parallax-1', '.js-parallax-2'],
		// 	callback: function(active) {
		// 		if (active) {
		// 			$(this.$element).addClass('test');
		// 		} else {
		// 			$(this.$element).removeClass('test');
		// 		}
		// 	}
		// });


		/* -------------------- init -------------------- */
		Parachute.init();
						
	});

})(jQuery);
```