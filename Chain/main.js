//create random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//create random number (to use for the stroke width)  
  function getRandomNumber() {
    return Math.random() * 25;
  }
//____________________________________________________________________


//the amount of points in the path:
var points = 50;

//the distance between the points
var length = 1;

//creates an instance of Path(an object)
var path = new Path({
    strokeColor: getRandomColor(),
    strokeWidth: getRandomNumber(),
    strokeCap: "round"
});

//adds points to the path when dragging the mouse (drawing)
tool.onMouseDrag = function(event) {
    path.add(event.point);
}

//changes color when mouse is down 
function onMouseDown(event) {
    if (path) {
    path.selected = false;
	}
     path = new Path({
        strokeColor: getRandomColor(),
        strokeWidth: getRandomNumber(),
        strokeCap: "round",
    });
}

function onMouseUp(event) {
	// When the mouse is released, simplify it:
    path.simplify(100);
}

tool.onKeyDown = function(event) {
  if (event.key == 'up') {
      // Scale the path by 110%:
      path.scale(1.2);

      return false;
  }

  if (event.key == "down") {
     // Scale the path down by 20%:
    path.scale(0.8);

    return false;
  }
}