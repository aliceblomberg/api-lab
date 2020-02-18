//Set up the values of the shapes size
var values = {
    paths: 30,
    minPoints: 5, 
    maxPoints: 10,
    minRadius: 20,
    maxRadius: 80
};

//Set up style of the shapes
var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

//create a function that shows the style of the shapes: ( measurements and colors) 
createPaths();

function createPaths() {
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    for (var i = 0; i < values.paths; i++) {
        var radius = values.minRadius + Math.random() * radiusDelta;
        var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
        var path = createBlob(view.size * points.random(), radius, points);
        var lightness = (Math.random() - 0,5) * 0.4 + 0.4;
        var hue = Math.random() * 360;
        path.fillColor = {hue: hue, saturation: 1, lightness: lightness };
        path.StrokeColor = 'black' ;
    };
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0,5),
            angle: (360 / points) * i 
        });
        path.add(center + delta);
    }
    path.smooth();
    return path;
}

// Handle mouse events
// Make a decision when the mouse is down on the shape (click on the shape)
// if the mouse is down you can change the location of the stroke and segment
var segment, path;
var movePath = false;
function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult)
    return;

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

    if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            path.smooth();
        }
    }
    movePath = hitResult.type == 'fill';
    if (movePath)
    project.activeLayer.addChild(hitResult.item);
}

// activate the events to be able to select the shape that you want and to drag it where you want
function onMouseMove(event) {
    project.activeLayer.selected = false;
    if (event.item)
    event.item.selected = true;
}

function onMouseDrag(event) {
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}