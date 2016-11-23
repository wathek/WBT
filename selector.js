"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let Selector = function() {
	this.initialize(arguments);
}

Selector.prototype = new BaseNode();

Selector.prototype.tick = function(tick) {
	for (let i = 0; i < this.children.length; i++) {
		let status = this.children[i]._execute(tick);

		if (status !== Status.FAILURE) {
			return status;
		}
	}

	return Status.FAILURE;
}

module.exports = Selector;
