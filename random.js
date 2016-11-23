"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let Random = function() {
	this.initialize(arguments);
}

Random.prototype = new BaseNode();

Random.prototype.open = function(tick) {
	let i = Math.floor(Math.random() * this.children.length);
	tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
}

Random.prototype.tick = function(tick) {
	if (this.children.length == 0)
		return Status.ERROR;

	let i = tick.blackboard.get('runningChild', tick.tree.id, this.id);
	let status = this.children[i]._execute(tick);

	if (status !== Status.FAILURE) {
		return status;
	}

	return Status.FAILURE;
}

module.exports = Random;
