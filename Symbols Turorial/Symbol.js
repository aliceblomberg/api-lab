var path = new Path(new Point(20, 20), new Point(50, 50));
path.style = {
	strokeColor: 'red',
	strokeWidth: 10,
	strokeCap: 'round'
};

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place 30 instances of the symbol in the project in random
// positions in the view:
for (var i = 0; i < 30; i++) {
	var position = view.size * Point.random();
	var placed = symbol.place(position);
}

function onFrame(event) {
	// Each frame, rotate the definition
	// of the symbol by 1 degree:
	symbol.definition.rotate(1);
	
	// Add 0.2 degrees to the stroke color's hue:
	symbol.definition.strokeColor.hue += 0.2;
}