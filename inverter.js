"use strict";

let BaseNode = require('./basenode');
let Status = require('./status');

let Inverter = function() {
	this.initialize(arguments);
}

Inverter.prototype = new BaseNode();

Inverter.prototype.tick = function(tick) {
	let child = this.children[0];

	if (!child) {
		return Status.ERROR;
	}

	let status = child._execute(tick);

	if (status === Status.SUCCESS) {
		status = Status.FAILURE;
	} else if (status === Status.FAILURE) {
		status = Status.SUCCESS;
	}

	return status;
}

module.exports = Inverter;
