var path; 

//This is for the instructional text above the canvas
var textItem = new PointText({
    content: 'Click and drag to draw a line.',
    point: new Point (100, 30),
    fillColor: 'pink',
});

//this event listener listens for the move pressing on the canvas
//it deselects any previously selected path  
function onMouseDown(event) {
    if (path) {
        path.selected = false;
    }

    //Create a new path with the Point object 
    // And changes its stroke color to pink: 
    path = new Path({
        segments: [event.point],
        strokeColor: 'black', 
        //Select the path, so we can see its segment points:
        fullySelected: true
    });
    }

    project.currentStyle = {
        strokeColor: '#000000',
        fillColor: '#ff0000',
        strokeWidth: 3
        
    };

   
    

    //While the user drags the mouse, points are added to the path 
    //at the position of the mouse: 
    function onMouseDrag(event) {
        path.add(event.point);
        
        //Update the content of the text item to show how many 
        //segments it has: 
        textItem.content = 'Segment count: ' + path.segments.length; 
    }

    //When the mouse is released, we simplify the path:
    function onMouseUp(event) {
        var segmentCount = path.segments.length; 

        //When the mouse is released, simplify it:
        //the more the value below is increased
        //the more simplified the segments in the path will be 
        path.simplify(500);

        //The path is selected and highlighted
        // so we can see its segments:
        path.fullySelected = true; 



        //Last is the calculation of the segments in the new path
        //This will be indicated as the  percentage of line segments that were saved
        //and used in the simplification 
        var newSegmentCount = path.segments.length; 
        var difference = segmentCount - newSegmentCount;
        var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100); 
        textItem.content = difference + ' of the ' + segmentCount + 'segments were removed. Saving ' + percentage + '%';

        //path.remove();
    }

   


  
    

    
