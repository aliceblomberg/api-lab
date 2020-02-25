# API Lab - Paper.js

## Description

This project was made as an assignment for the Prototyping course in Interaction Design, where we chose to work with [Paper.js](http://paperjs.org/) to learn about how to use an API/Library.

> Paper.js is an open source vector graphics scripting framework that runs on top of HTML5 Canvas. It is developed by Jürg Lehni & Joonathan Puckey, and distributed under the permissive MIT License. 
>> <cite><a href="http://paperjs.org/about/"> Paper.js About Page</a></cite>


## Purpose/"Why the project is useful"?

1. What is the project exploring?
2. Why is the library interesting for IxD?

* Support for vector mathematics makes for simple creation of smooth graphic animations.

Bad naming practice in examples, making it difficult to work with and understand! 

```javascript
calcBounds: function(b) {
	for (var i = 0; i < this.numSegment; i ++) {
		var tp = this.getSidePoint(i);
		var bLen = b.getBoundOffset(tp);
		var td = tp.getDistance(b.point);
		if (td < bLen) {
			this.boundOffsetBuff[i] -= (bLen  - td) / 2;
		}
	}   
}
```

## Usage ???

Download and load? :'D

## Contributing

This project was made by the group MITOCHONDRIA consisting of; [Alice](https://github.com/aliceblomberg), Aasa, Christian, Vera, Viggo and Sara.

## Examples

[Chain](http://paperjs.org/examples/chain/)

[Meta Balls](http://paperjs.org/examples/meta-balls)

[Nyan Rainbow](http://paperjs.org/examples/nyan-rainbow)

[Rounded Rectangles](http://paperjs.org/examples/rounded-rectangles)

[Radial Rainbows](http://paperjs.org/examples/radial-rainbows)

[Future Splash](http://paperjs.org/examples/future-splash)

[Path Simplification](http://paperjs.org/examples/path-simplification)

[Hit Testing](http://paperjs.org/examples/hit-testing)

[Bouncing Balls](http://paperjs.org/exanples/bouncing-balls)
