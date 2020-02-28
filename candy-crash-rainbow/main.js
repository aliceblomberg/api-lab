//--------------------- main ---------------------

var balls = [];
var numBalls = 30;
var mousePos = view.center + [view.bounds.width / 3, 100];
var framePosition = view.center;

var colors = ['red', 'orange', 'yellow', 'lime', 'blue', 'purple'];
var colorCount = 0;

// creates the class Ball with the arguments radius, point and vector ( how big, where, and how they move)
function Ball(r, p, v) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 15;
	this.numSegment = Math.floor(r / 3 + 2); // bigger r - more segments
	this.boundOffset = [];
	this.boundOffsetBuff = [];
    this.sidePoints = [];


    if (colorCount == colors.length) {
        colorCount = 0;
    }
    else {
        colorCount++;
    }


    // for every new ball, assigns a path.
	this.path = new Path({
        fillColor: colors[colorCount],
		blendMode: 'lighter'
	});
        //setting up a circle path
	for (var i = 0; i < this.numSegment; i ++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));
	}
}
Ball.prototype = {
	iterate: function() {
		this.checkBorders();
		if (this.vector.length > this.maxVec)
			this.vector.length = this.maxVec; //if too big cap it into value.
		this.point += this.vector; // updates position.
		this.updateShape();
	},

    // when ball moves off one side it re-positions it on the other side, it doesn't bounce
	checkBorders: function() {
		var size = view.size;
		if (this.point.x < -this.radius)
			this.point.x = size.width + this.radius;
		if (this.point.x > size.width + this.radius)
			this.point.x = -this.radius;
		if (this.point.y < -this.radius)
			this.point.y = size.height + this.radius;
		if (this.point.y > size.height + this.radius)
			this.point.y = -this.radius;
	},

	updateShape: function() {
		var segments = this.path.segments;
		for (var i = 0; i < this.numSegment; i ++)
			segments[i].point = this.getSidePoint(i);

        this.path.smooth();

        // smooths out the offsets based on previous and next segments
        for (var i = 0; i < this.numSegment; i ++) {
			if (this.boundOffset[i] < this.radius / 4)
                this.boundOffset[i] = this.radius / 4;

            // this gets the previous and next segment indexes
			var next = (i + 1) % this.numSegment;
            var prev = (i > 0) ? i - 1 : this.numSegment - 1;

			var offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},
    // what happens when balls hit each other
	react: function(b) {
        // distance between this ball and the ball passed in the argument
        var dist = this.point.getDistance(b.point);

        // have the balls overlapped?
		if (dist < this.radius + b.radius && dist != 0) {
			var overlap = this.radius + b.radius - dist;
            var direc = (this.point - b.point).normalize(overlap * 0.015);

            // when overlapped, bounce
			this.vector += direc;
			b.vector -= direc;

            // make sure balls don't visually overlap "squish"
			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

	getBoundOffset: function(b) {
		var diff = this.point - b;
		var angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function(b) {
		for (var i = 0; i < this.numSegment; i ++) {
			var tp = this.getSidePoint(i); // the point
			var bLen = b.getBoundOffset(tp); //bLen?
			var td = tp.getDistance(b.point); // td - distance from centre to point?
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen  - td) / 2;
			}
		}
	},

	getSidePoint: function(index) {
		return this.point + this.sidePoints[index] * this.boundOffset[index];
	},
    // update main bounds from buffer
	updateBounds: function() {
		for (var i = 0; i < this.numSegment; i ++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
}

// Fills the balls array with random balls
for (var i = 0; i < numBalls; i++) {
	var position = Point.random() * view.size;
	var vector = new Point({
		angle: 360 * Math.random(), // direction balls start at 0 - 360
		length: Math.random() * 10  // speed 0 - 10
	});
	var radius = Math.random() * 60 + 30;  // 60 - 120
	balls.push(new Ball(radius, position, vector));
}

/* ON FRAME */

// paper automatically calls onFrame every frame
function onFrame(event) {

    var event1 = event;

    // Set up new directions and speed for every bounce
	for (var i = 0; i < balls.length - 1; i++) {
		for (var j = i + 1; j < balls.length; j++) {
			balls[i].react(balls[j]);
		}
    }
    // adjust ball shape for every bounce
	for (var i = 0, l = balls.length; i < l; i++) {
		balls[i].iterate();
    }

    framePosition += (mousePos - framePosition) / 10;
    var vector = (view.center - framePosition) / 10;
    moveRainbow(vector, event);
}

function onMouseMove(event) {
	mousePos = event.point;
}


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
		var vector = (view.center - framePosition) / 10;

		if (vector.length < 5)
			vector.length = 5;
		group.translate(vector);
		var rotated = vector.rotate(90);
		var middle = paths.length / 2;
		for (var j = 0; j < paths.length; j++) {
			var path = paths[j];
			var unitLength = vector.length * (2 + Math.sin(event.count / 10)) / 2;
			var length = (j - middle) * unitLength;  
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




