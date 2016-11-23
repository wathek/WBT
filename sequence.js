"use strict";
let BaseNode = require('./basenode');
let Status = require('./status');

let Sequence = function() {
	this.initialize(arguments);
}

Sequence.prototype = new BaseNode();

Sequence.prototype.tick = function(tick) {
	for (let i = 0; i < this.children.length; i++) {
		let status = this.children[i]._execute(tick);

		if (status !== Status.SUCCESS) {
			return status;
		}
	}

	return Status.SUCCESS;
}

module.exports = Sequence;
