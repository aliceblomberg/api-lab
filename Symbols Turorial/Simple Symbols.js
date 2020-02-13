var path = new Path.Circle(new Point(20, 20), 30);
path.fillColor = 'red';
var path = new Path.Circle(new Point(20, 20), 30);
path.fillColor = 'red';

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place three instances of the symbol:
symbol.place(new Point(80, 50));
symbol.place(new Point(150, 50));
symbol.place(new Point(225, 50));

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place an instance of the symbol at the center of the view:
var placed = symbol.place(view.center);

// Select the placed symbol:
placed.selected = true;

// Rotate the placed symbol by 45 degrees:
placed.rotate(45);