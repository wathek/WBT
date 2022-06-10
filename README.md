# WBT
Node.js Behavior Tree, this a Node.js library to design a Behavior Tree.

# Example
First let's define some Actions. We start by creating a ``DoRandom`` action and then we will simulate a success action ``SuccessAction`` and a fail action ``FailAction``.

```javascript
// dorandom.js
"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let DoRandom = function(text, time) {
	this.text = text;
  
  // this is to simulate a long time execution task
	this.endTime = time;
	
  this.initialize();
}

DoRandom.prototype = new BaseNode();
DoRandom.prototype.open = function(tick) {
	let startTime = (new Date()).getTime();
  
  // Save the starttime value
	tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
  
  // Check if event variable exists if not set it to 0
	if (tick.blackboard.get('event', tick.tree.id) == undefined) {
		tick.blackboard.set('event', 0, tick.tree.id);
	}

	console.log("Starting " + this.text);
}

DoRandom.prototype.tick = function(tick) {
	let currTime = (new Date()).getTime();
	let startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);

	if (currTime - startTime > this.endTime) {
		console.log("Finished " + this.text);
    
    // Increment event variable when the execution succeed
		let e = tick.blackboard.get('event', tick.tree.id) + 1;
		tick.blackboard.set('event', e, tick.tree.id);

		return Status.SUCCESS;
	}

	return Status.RUNNING;
}

module.exports = DoRandom;
```
```javascript
// successaction.js
"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let SuccessAction = function(text) {
	this.text = text;
	this.initialize(arguments);
}

SuccessAction.prototype = new BaseNode();
SuccessAction.prototype.tick = function(tick) {
	console.info('Success Action : ' + this.text);
  
  // reinitialize event variable
	tick.blackboard.set('event', 0, tick.tree.id);
	return Status.SUCCESS;
}

module.exports = SuccessAction;
```
```javascript
// failaction.js
"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let FailAction = function(text) {
	this.text = text;
	this.initialize();
}

FailAction.prototype = new BaseNode();
FailAction.prototype.tick = function(tick) {
	console.error(this.text);
	return Status.FAILURE;
}

module.exports = FailAction;
```

Now let's create a condition node that check whether the value of the variable ``event`` in blackboard is greater than 5 or not.
```javascript
// iseventreceived.js
"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let IsEventReceived = function() {
	this.initialize();
}

IsEventReceived.prototype = new BaseNode();
IsEventReceived.prototype.tick = function(tick) {
	let e = tick.blackboard.get('event', tick.tree.id);

	if (e && e > 5) {
		console.info("Event Received");
		return Status.SUCCESS;
	}

	console.error("No Event " + e);
	return Status.FAILURE;
}

module.exports = IsEventReceived;
```

And the main file
```javascript
// main.js
"use strict";

let Blackboard = require('./blackboard');
let BehaviorTree = require('./behaviortree');

let Selector = require('./selector');
let Sequence = require('./sequence');
let MemSelector = require('./memselector');
let Random = require('./random');

let IsEventReceived = require('./iseventreceived');
let FailAction = require('./failaction');
let SuccessAction = require('./successaction');
let DoRandom = require('./dorandom');

let blackboard, tree;

blackboard = new Blackboard();
tree = new BehaviorTree();

tree.root = new Selector(
	new Sequence(
		new IsEventReceived(),
		new MemSelector(
			new FailAction("Fail 1"),
			new SuccessAction("Success 1"),
			new FailAction("Fail 2")
		)
	),
	new Random(
		new DoRandom("Random 1", 2000), // Simulate a 2 seconds task
		new DoRandom("Random 2", 500), // Simulate a 0.5 second task
		new DoRandom("Random 3", 4000), // Simulate a 4 seconds task
		new DoRandom("Random 4", 6000) // Simulate a 6 seconds task
	)
);

// Run the Behavior Tree each 300ms (this can be changed to what the designer want)
var intervalID = setInterval(function() {
	tree.tick(null, blackboard);
}, 300);
```

