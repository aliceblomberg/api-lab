//create random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//the amount of points in the path:
var points = 50;

//the distance between the points
var length = 15;

//creates an instance of Path(an object)
var path = new Path({
    strokeColor: getRandomColor(),
    strokeWidth: 40,
    strokeCap: "round"
});

//sets starting point to center divided by 10
var start = view.center / [10, 1];
for (var i = 0; i < points; i++)
    path.add(start + new Point(i * length, 0));

function onMouseMove (event) {
    path.firstSegment.point = event.point;
    for (var i = 0; i < points - 1; i++) {
        var segment = path.segments[i];
        var nextSegment = segment.next;
        var vector = segment.point - nextSegment.point;
        vector.length = length;
        nextSegment.point = segment.point - vector;
    }
    path.smooth({ type: "continuous" });
}  

//changes color when mouse is down using event
function onMouseDown(event) {
    path.fullySelected = false;
    path.closed = false;
    path.strokeColor = getRandomColor();
}