// Sets the center point to the center of the viewport
var point = view.center;

// Fill an array with colors that change gradually for each iteration (60 times)

var colors = [];
var cycles = 4;

for (var i = 0, l = 60; i < l; i++) {
    var brightness = 1 - (i / l) * 1.5;
    var hue = i / l * cycles * 360;
    var color = {
        hue: hue,
        saturation: 1,
        brightness: brightness
    };
    colors.push(color);
}
// Sets radius of the radial
var radius = Math.max(view.size.width, view.size.height) * 0.75;

var path = new Path.Rectangle({
    rectangle: view.bounds,

    // Set fillColor to a gradient Color object that evenly distributes every color in the array continously
    // (http://paperjs.org/reference/color/#color-gradient-origin-destination)
    fillColor: {
        origin: point,
        destination: point + [radius, 0],
        gradient: {
            stops: colors,
            radial: true
        }
    }
});

/* Mouse interaction variables */

var color = path.fillColor;
var gradient = color.gradient;
var mouseDown = false;
var mousePoint = view.center;

// Mouse events

function onMouseDown(event) {
    mouseDown = true;
    mousePoint = event.point;
}

function onMouseDrag(event) {
    mousePoint = event.point;
}

function onMouseUp(event) {
    vector.length = 10;
    mouseDown = false;
}

var grow = false;
var vector = new Point(150, 0);
// Depending on how far away the new radial center is from the original center, the rays grow 

function onFrame() {
    for (var i = 0, l = gradient.stops.length; i < l; i++) { // Creates a slight fade between each gradient stop
        gradient.stops[i].color.hue -= 20;
    }

    // Control the size of the ray by enabling/disabling "grow"

    if (grow && vector.length > 300) {
        grow = false;
    }
    else if (!grow && vector.length < 75) {
        grow = true;
    }

    // If mouse is down, change point, else alter the center point depending on grow

    if (mouseDown) {
        point = point + (mousePoint - point) / 10;
    }
    else {
        vector.length += (grow ? 1 : -1);
        vector.angle += 5;
    }
    color.highlight = mouseDown ? point : point + vector;
}

// Reset the center on resize of the view

function onResize(event) {
    point = view.center;
    path.bounds = view.bounds;
    var color = path.fillColor;
    color.origin = point;
    var radius = Math.max(view.size.width, view.size.height) * 0.75;
}