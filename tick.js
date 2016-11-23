"use strict";

let Tick = function() {
	this.initialize();
}

Tick.prototype.initialize = function() {
	this.tree		= null;
	this.openNodes	= [];
	this.nodeCount	= 0;
	this.debug		= null;
	this.target		= null;
	this.blackboard	= null;
}

Tick.prototype.enterNode = function(node) {
	this.nodeCount++;
	this.openNodes.push(node);

	// TODO: call debug
}

Tick.prototype.openNode = function(node) {
	// TODO: call debug
}

Tick.prototype.tickNode = function(node) {
	// TODO: call debug
}

Tick.prototype.closeNode = function(node) {
	// TODO: call debug
	this.openNodes.pop();
}

Tick.prototype.exitNode = function(node) {
	// TODO: call debug
}

module.exports = Tick;
