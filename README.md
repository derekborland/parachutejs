### Parachute JS - jQuery smooth scrolling/parallax

[Download](https://github.com/derekborland/parachutejs/blob/master/dist/parachute.js) 


```javascript
;(function($){

	$(window).ready(function(){
		
		// page
		Parachute.page({
			scrollContainer: '#scrollContainer',
			heightContainer: '#fakeScrollContainer'
		});

		// parallax
		Parachute.parallax({
			element: '.js-parallax-1',
			pxToMove: -400
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

		// sequence
		Parachute.sequence({
			element: ['.js-cascade-1', '.js-cascade-2'],
			callback: function(active) {
				// `active = true`
				// element is in view
				//
				// `active = false`
				// element not in view
				//
				// if (active) { console.log(this); }
				//
				// use `this.$elemet`
			}
		});

		// let's go!
		Parachute.init();
		
	});

})(jQuery);
```