# chain
## Description
This is an extended version of [chain](http://paperjs.org/examples/chain/). 

## Reflection
A drawing program that allows you to configure your brush (stroke size, color, etc).

The example currently runs with random color and random stroke width. The example allows you to scale your last stroke up or down using the arrow keys. Since it uses vector graphics this is done losslessly. The strokes are automatically smoothed using path.simplify(), this is done by analyzing its path.segments array. 

A future useful configuration would be adding a GUI that would allow you to change color, size etc directly in the canvas, instead of having to do it in the code. 

## Contribution
Paper.js is distributed under the permissive MIT License Copyright (c) 2011, Juerg Lehni & Jonathan Puckey.
The author of the original example is not provided, the extension is made by Viggo Hasselquist.
