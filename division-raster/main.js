//Create a raster item by adding a photo: 
var raster = new Raster ('photo.jpg');
var loaded = false; 

/*When the page is loaded
The function "onResize" is called 
Then the photo is reverted to its normal state */
raster.on('load', function() {
    loaded = true; 
    onResize();
});

//Make the raster invisible: 
raster.visible = false; 

//This code indicates what happens when the pointer is moved
//the fifth line (line 24) indicates the number of pixels 
//that can be targeted at a time 
//so the more the number increases from 20, the more pixels it takes to unravel the photo
var lastPos = view.center; 
function moveHandler(event) {
    if (!loaded)
    return; 
    if (lastPos.getDistance(event.point) < 50)
    return; 
    lastPos = event.point; 

    var size = this.bounds.size.clone(); 
    var isLandscape = size.width > size.height; 

    //If the path is in landscape orientation, we're going to
    //split the path horizontally, otherwise vertical 

    size /= isLandscape ? [2, 1] : [1, 2]; 

    var path = new Path.Rectangle({
        point: this.bounds.topLeft.floor(),
        size: size.ceil(),
        onMouseMove: moveHandler
    }); 
    path.fillColor = raster.getAverageColor(path); 

    var path = new Path.Rectangle({
        point: isLandscape
        ? this.bounds.topCenter.ceil()
        : this.bounds.leftCenter.ceil(),
        size: size.floor(),
        onMouseMove: moveHandler 
    });
    path.fillColor = raster.getAverageColor(path);

    this.remove();
}


function onResize(event) {
    if (!loaded)
    return; 
    project.activeLayer.removeChildren();

    //Transform the raster so that it fills the bounding rectangle 
    //of the view 
    raster.fitBounds(view.bounds, true); 

    //Create a path that fills the view, and fill it with
    //the average color of the raster: 
    new Path.Rectangle ({
        rectangle: view.bounds, 
        fillColor: raster.getAverageColor(view.bounds), 
        onMouseMove : moveHandler
    });
}