"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let MemSequence = function() {
	this.initialize(arguments);
}

MemSequence.prototype = new BaseNode();

MemSequence.prototype.open = function(tick) {
	tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
}

MemSequence.prototype.tick = function(tick) {
	let child = tick.blackboard.get('runningChild', tick.tree.id, this.id);

	for (let i = child; i < this.children.length; i++) {
		let status = this.children[i]._execute(tick);

		if (status !== Status.SUCCESS) {
			if (status === Status.RUNNING) {
				tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
			}

			return status;
		}
	}
	
	return Status.SUCCESS;
}

module.exports = MemSequence;
