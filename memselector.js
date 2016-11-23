"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let MemSelector = function() {
	this.initialize(arguments);
}

MemSelector.prototype = new BaseNode();

MemSelector.prototype.open = function(tick) {
	tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
}

MemSelector.prototype.tick = function(tick) {
	let child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
	for (let i = child; i < this.children.length; i++) {
		let status = this.children[i]._execute(tick);
	
		if (status !== Status.FAILURE) {
			if (status === Status.RUNNING) {
				tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
			}

			return status;
		}
	}

	return Status.FAILURE;
}

module.exports = MemSelector;
