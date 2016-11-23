"use strict";

let UUID = require('./uuid');
let Tick = require('./tick');

let BehaviorTree = function() {
	this.initialize();
}

BehaviorTree.prototype.initialize = function() {
	this.id		= UUID.create();
	this.root	= null;
}

BehaviorTree.prototype.tick = function(target, blackboard) {
	// Create a Tick Object
	let tick = new Tick();

	tick.target 	= target;
	tick.blackboard	= blackboard;
	tick.tree		= this;

	// Tick Node
	this.root._execute(tick);

	// Close Nodes from last tick, if needed
	let lastOpenNodes = blackboard.get('openNodes', this.id);
	let currOpenNodes = tick.openNodes.slice(0);

	// does not close if it is still open in this tick
	let start = 0;
	for (let i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
		start = i + 1;
		if (lastOpenNodes[i] !== currOpenNodes[i]) {
			break;
		}
	}

	// close the nodes
	for (let i = lastOpenNodes.length - 1; i >= start; i--) {
		lastOpenNodes[i]._close(tick);
	}

	// Populate blackboard
	blackboard.set('openNodes', currOpenNodes, this.id);
	blackboard.set('nodeCount', tick.nodeCount, this.id);
}

module.exports = BehaviorTree
