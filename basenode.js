"use strict";

let UUID = require('./uuid');
let Status = require('./status');

let BaseNode = function() {
	this.initialize();
}

BaseNode.prototype.initialize = function(children) {
	this.id		= UUID.create();

	this.children = [];
	if (children) {
		for (let i = 0; i < children.length; i++) {
			this.children.push(children[i]);
		}
	}
}

BaseNode.prototype._execute = function(tick) {
	// Enter
	this._enter(tick);

	/// Open
	if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
		this._open(tick);
	}

	// Tick
	let status = this._tick(tick);

	// Close
	if (status !== Status.RUNNING) {
		this._close(tick);
	}

	// Exit
	this._exit(tick);

	return status;
}

BaseNode.prototype._enter = function(tick) {
	tick.enterNode(this);
	this.enter(tick);
}

BaseNode.prototype._open = function(tick) {
	tick.openNode(this);
	tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
	this.open(tick);
}

BaseNode.prototype._tick = function(tick) {
	tick.tickNode(this);
	return this.tick(tick);
}

BaseNode.prototype._close = function(tick) {
	tick.closeNode(this);
	tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
	this.close(tick);
}

BaseNode.prototype._exit = function(tick) {
	tick.exitNode(this);
	this.exit(tick);
}

BaseNode.prototype.enter	= function(tick) {}
BaseNode.prototype.open		= function(tick) {}
BaseNode.prototype.tick		= function(tick) {}
BaseNode.prototype.close	= function(tick) {}
BaseNode.prototype.exit		= function(tick) {}

module.exports = BaseNode;
