var rectangle = new Rectangle(new Point(50, 50), new Point(150, 100));
var radius = new Size(50, 3);
var path = new Path.Rectangle(rectangle, radius);
path.fillColor = 'black';



var myCircle = new Path.Circle(new Point(125, 70), 50);
myCircle.fillColor = 'black';

// Create a decagon shaped path 
var decagon = new Path.RegularPolygon(new Point(200, 70), 10, 50);
decagon.fillColor = '#e9e9ff';
decagon.selected = true;