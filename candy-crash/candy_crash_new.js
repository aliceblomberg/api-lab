// creates the Balls with the arguments radius, point and vector ( how big, where, and how they move)
function Ball(r, p, v) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 15;
	this.numSegment = Math.floor(r / 3 + 2); // bigger r - more segments
	this.boundOffset = [];
	this.boundOffsetBuff = [];
    this.sidePoints = [];

    // for every new ball, assigns a path.
	this.path = new Path({
		fillColor: {
			hue: Math.random() * 360, //a number between 0 and 1 * 360 - hsl wheel is 360 random colour on that wheel fully bright fully saturated.
			saturation: 1,
			brightness: 1
		},
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
        //every ball has the methods of the prototype
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
			var solidity = 0.01;
            var direc = (this.point - b.point).normalize(overlap * solidity);
            
            // when overlapped, bounce
			this.vector += direc;
			b.vector -= direc;

			// Make the balls move in horizontal direction.
			this.vector.x = Math.abs(this.vector.x);
			b.vector.x = Math.abs(b.vector.x);
			this.vector.y *= 0.8;
			b.vector.y *= 0.8;

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
};

//--------------------- main ---------------------

var balls = [];
var numBalls = 30;

// Fills the balls array with random balls
for (var i = 0; i < numBalls; i++) {
	var position = Point.random() * view.size;
	var vector = new Point({
		angle: 360 * Math.random(), // direction balls start at 0 - 360
		length: Math.random() * 10  // speed 0 - 10
	});
	var radius = Math.random() * 30 + 30;  // 30 - 60
	balls.push(new Ball(radius, position, vector));
}
// paper automatically calls onFrame every frame
function onFrame() {

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
}