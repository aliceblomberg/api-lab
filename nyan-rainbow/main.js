var mousePos = view.center + [view.bounds.width / 3, 100]; // Assigning the value of center point of the viewport and the point coordinates [x, y]
var position = view.center;

// Function that updates the frame
function onFrame(event) {
	framePosition += (mousePos - framePosition) / 10;
	var vector = (view.center - framePosition) / 10;
	moveStars(vector * 3);
	// moveRainbow(vector, event);
}
// Assign the mouse co-ordinates to mousePos on mousemove.
function onMouseMove(event) {
	mousePos = event.point;
}

// Function for the star background
var moveStars = new function() {
	// The amount of stars (symbols) to be placed
	var count = 50;

	// Declaring the appearance of the star to be used as a symbol
	var path = new Path.Circle({
		center: [0, 0],
		radius: 5,
		fillColor: 'white',
		strokeColor: 'black'
	});

	// Declaring the new symbol from the Path

	var symbol = new Symbol(path);

	// Place the instances of the symbol:
	for (var i = 0; i < count; i++) {
		// The center position is a random point in the view:
		var center = Point.random() * view.size;

		//Assigns the newly placed symbol to the variable 'placed'
		var placed = symbol.place(center);
		placed.scale(i / count + 0.01); // Scales every instance slightly bigger than the last
		// Assigns extra values to the 'placed' object
		placed.data = {
			vector: new Point({
				angle: Math.random() * 360,
				length: (i / count) * Math.random() / 5
			})
		};
	}
	// Function to keep every instance within view
	function keepInView(item) {
		var position = item.position; // Assigns the given item's position to var position
		var viewBounds = view.bounds; //Assigns the view object property 'bounds' to variable
		
		//If the position is within view, return (stop) the function
		if (position.isInside(viewBounds))
			return;
		
		// Sets and checks so that the circle isn't clipped by any edges by moving the center x or y to within bounds	
		var itemBounds = item.bounds;
		if (position.x > viewBounds.width + 5) {
			position.x = -item.bounds.width;
		}

		if (position.x < -itemBounds.width - 5) {
			position.x = viewBounds.width;
		}

		if (position.y > viewBounds.height + 5) {
			position.y = -itemBounds.height;
		}

		if (position.y < -itemBounds.height - 5) {
			position.y = viewBounds.height
		}
	}
	// The return function that will be called each frame 
	return function(vector) {
		// Run through the active layer's children list and change
		// the position of the placed symbols:
		var layer = project.activeLayer;
		for (var i = 0; i < count; i++) {
			var item = layer.children[i];
			var size = item.bounds.size;
			var length = vector.length / 10 * size.width / 10;
			item.position += vector.normalize(length) + item.data.vector;
			keepInView(item);
		}
	};
};

// Function for the moving rainbow
var moveRainbow = new function() {

	//Declare the empty array
	var paths = [];
	var colors = ['red', 'orange', 'yellow', 'lime', 'blue', 'purple'];
	
	// For every color in the array colors, create a new Path object with that color and push it to the paths array
	for (var i = 0; i < colors.length; i++) {
		var path = new Path({
			fillColor: colors[i]
		});
		paths.push(path);
	}
	/* Group is a collection of items. 
	When you transform a Group, its children are treated as a single unit without changing their relative positions. */
	var group = new Group(paths);

	var headGroup;
	// Eye variables
	var eyePosition = new Point();
	var eyeFollow = (Point.random() - 0.5);
	var blinkTime = 200;

	// Function for creating the "head"
	function createHead(vector, count) {
		var eyeVector = (eyePosition - eyeFollow);
		eyePosition -= eyeVector / 4;
		if (eyeVector.length < 0.00001)
			eyeFollow = (Point.random() - 0.5);
		if (headGroup)
			headGroup.remove();

		// Setting positions of the circle that is to be the eye to that of the "top" of the "paths"	
		var top = paths[0].lastSegment.point;
		var bottom = paths[paths.length - 1].firstSegment.point; // The point on the first segment of the last path in paths.
		var radius = (bottom - top).length / 2; //Radius set to half the length between top and bottom

		var circle = new Path.Circle({
			center: top + (bottom - top) / 2,
			radius: radius,
			fillColor: 'black'
		});
		/* By default the item.scale(scale) function scales an item around its center point. If you want to scale around a specific position, you can pass the scale function an optional center point: item.scale(scale, point).
		//Scaling and rotating the previous circle to make the sclera (white of the eye)  
		// scale(percentage in decimal, center point)
		circle.scale(vector.length / 100, 1);
		//Rotates by the degrees of the vector angle 
		//around the circle center point
		/* path.rotate(degrees, point) */
		
		circle.rotate(vector.angle, circle.center);
		innerCircle = circle.clone(); 
		innerCircle.scale(0.5);

		// Color changes between white and black simulating blinking
		// If the remainder of count (50) divided by the blinkTime is less than three OR the remainder of count divided by blinkTime + 5 is less than 3
		// Fill innerCircle with black
		// else fill it with black 
		innerCircle.fillColor = (count % blinkTime < 3) || (count % (blinkTime + 5) < 3) ? 'black' : 'white';

		// If the remainder of count divded by blinkTime + 40 is 0, then set blinkTime to the rounded value of 40 + 200
		if (count % (blinkTime + 40) == 0)
			blinkTime = Math.round(Math.random() * 40) + 200;

		// Clone the circle again to create the pupil
		var eye = circle.clone();
		eye.position += eyePosition * radius;
		eye.scale(0.15, innerCircle.position);
		eye.fillColor = 'black';

		//Group all of the above elements into the headGroup
		headGroup = new Group(circle, innerCircle, eye);
	}

	// Return function that is called on every frame, so the whole thing follows the mouse
	return function(vector, event) {
		var vector = (view.center - position) / 10; //Vector set by the direction of the mouse movement

		if (vector.length < 5)
			vector.length = 5;

		group.translate(vector); //Translating the position of the rainbow path group to that of the vector
		var rotated = vector.rotate(90);
		var middle = paths.length / 2;

		// The loop that creates the wavy effect
		for (var j = 0; j < paths.length; j++) {
			var path = paths[j];
			var unitLength = vector.length * (2 + Math.sin(event.count / 10)) / 2; //event.count = the number of times the mouse event was fired
			var length = (j - middle) * unitLength;  

			//set top to the normalized value of the rotated vector to the length of "length"
			var top = view.center + rotated.normalize(length);
		
		
			var bottom = view.center + rotated.normalize(length + unitLength);
			path.add(top);
			path.insert(0, bottom);
			if (path.segments.length > 200) {
				var index = Math.round(path.segments.length / 2);
				path.segments[index].remove();
				path.segments[index - 1].remove();
			}
			path.smooth();
		}
		createHead(vector, event.count);
	}
}

