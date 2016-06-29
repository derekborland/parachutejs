```javascript
$(window).ready(function(){
				
	// page
	Parachute.page({
		pageWrapper: '#page',
		scrollContainer: '#scrollContainer',
		heightContainer: '#fakeScrollContainer'
	});
	
	// parallax
	Parachute.parallax({
		element: '.js-parallax-1',
		pxToMove: -400,
		topTriggerOffset: 600
	});
	
	Parachute.parallax({
		element: '.js-parallax-2',
		speed: 1,
		pxToMove: -200,
		topTriggerOffset: 600
	});
	
	// sequence
	Parachute.sequence({
		element: '.js-cascade-1',
		callback: function(active) {
			// console.log(active);
		},
		offset: 200
	});
	
	Parachute.sequence({
		element: '.js-cascade-1',
		callback: function(active) {
			// `active == true` - element in view
		},
		offset: (function(){
			return 200;
		})()
	});
	
	// let's go!
	Parachute.init();
	
});
```