"use strict";

let Blackboard = function() {
	this.initialize();
}

Blackboard.prototype.initialize = function() {
	this._baseMemory = {};
	this._treeMemory = {};
}

Blackboard.prototype._getTreeMemory = function(treeScope) {
	if (!this._treeMemory[treeScope]) {
		this._treeMemory[treeScope] = {
			'nodeMemory'	: {},
			'openNodes'		: [],
		}
	}

	return this._treeMemory[treeScope];
}

Blackboard.prototype._getNodeMemory = function(treeMemory, nodeScope) {
	let memory = treeMemory['nodeMemory'];

	if (!memory[nodeScope]) {
		memory[nodeScope] = {};
	}

	return memory[nodeScope];
}

Blackboard.prototype._getMemory = function(treeScope, nodeScope) {
	let memory = this._baseMemory;

	if (treeScope) {
		memory = this._getTreeMemory(treeScope);

		if (nodeScope) {
			memory = this._getNodeMemory(memory, nodeScope);
		}
	}

	return memory;
}

Blackboard.prototype.set = function(key, value, treeScope, nodeScope) {
	let memory = this._getMemory(treeScope, nodeScope);

	memory[key] = value;
}

Blackboard.prototype.get = function(key, treeScope, nodeScope) {
	let memory = this._getMemory(treeScope, nodeScope);
	return memory[key];
}

module.exports = Blackboard;
