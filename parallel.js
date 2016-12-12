"use strict";
let BaseNode = require('./basenode');
let Status = require('./status');

let Parallel = function() {
	this.status = new Array(this.children.length);
	
	this.initialize(arguments);
}

Parallel.prototype = new BaseNode();

Parallel.prototype.tick = function(tick) {
	for (let i = 0; i < this.children.length; i++) {
		if (this.status[i] !== Status.SUCCESS && this.status[i] !== Status.FAILURE) {
			this.status[i] = this.children[i]._execute(tick);
		}
	}

	if (this._nSucc() >= this.children.length) {
		this.status = new Array(this.children.length);
		return Status.SUCCESS;
	} else if (this._nFail() >= this.children.length) {
		this.status = new Array(this.children.length);
		return Status.FAILURE;
	} else {
		return Status.RUNNING;
	}
}

Parallel.prototype._nSucc = function() {
	let nSucc = 0;
	for (let i = 0; i < this.status.length; i++) {
		if (this.status[i] === Status.SUCCESS) {
			nSucc++;
		}
	}

	return nSucc;
}

Parallel.prototype._nFail = function() {
	let nFail = 0;
	for (let i = 0; i < this.status.length; i++) {
		if (this.status[i] === Status.FAILURE) {
			nFail++;
		}
	}

	return nFail;
}

module.exports = Parallel;
