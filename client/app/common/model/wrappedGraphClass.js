/* * * * * GRAPH CLASS * * * * */

// input is parsed graph JSON
var WrappedGraph = function(graphObj) {
	this.graph = graphObj;
};


/* * * * * GRAPH OPERATIONS * * * * */

/* * * * * Add/Remove Node * * * * */

/**
 * deleteNode
 * stores the upstream and downstream arrays from the node to be
 * deleted, unlinks that node from its upstream and downstream
 * nodes, and deletes the node from the graph object. Then, the
 * upstream and downstream nodes are linked.
 * @param  {int} nodeId [a nodeId correspond to a key in the graph object]
 * @return {undefined}  [used to mutate the graph obj; no return value.]
 */
WrappedGraph.prototype.deleteNode = function(nodeId) {
	// store upstream and downstream arrays
	var upstream = this.graph[nodeId].upstream || [];
	var downstream = this.graph[nodeId].downstream || [];
	// break links to nodeId
	upstream.forEach(function(upNodeId) {
		unlinkNodes(upNodeId, nodeId);
	});
	downstream.forEach(function(downNodeId) {
		unlinkNodes(nodeId, downNodeId);
	});
	// remove node from graph object
	delete this.graph[nodeId];
	// create links between upstream and downstream nodes
	upstream.forEach(function(upNodeId) {
		downstream.forEach(function(downNodeId) {
			linkNodes(upNodeId, downNodeId);
		});
	});
};

// Note: createNode has yet to be written; waiting for node class def.

/* * * * * Add/Remove link * * * * */

/**
 * linkNodes
 * links one upstream node to a downstream node by adding each node's
 * id to the other's correspondin array.
 * @param  {int}  upNodeId  [a nodeId correspond to a key in the graph object]
 * @param  {int} downNodeId [a nodeId correspond to a key in the graph object]
 * @return {undefined}      [used to mutate the graph obj; no return value.]
 */
WrappedGraph.prototype.linkNodes = function(upNodeId, downNodeId) {
	// adds appropriate nodeIds to upstream and downstream arrays
	this.graph[upNodeId].downstream.push(downNodeId);
	this.graph[downNodeId].upstream.push(upNodeId);
	// do transitive reduction
	transitiveReduction(downNodeId, upNodeId);
};

/**
 * unlinkNodes
 * removes the node references linking two nodes from each node's
 * corresponding array.
 * @param  {int} upNodeId   [upstream node's id]
 * @param  {int} downNodeId [downstream node's id]
 * @return {undefined]}     [used to mutate the graph obj; no return value.]
 */
WrappedGraph.prototype.unlinkNodes = function(upNodeId, downNodeId) {
	// remove downNodeId from upNodeId's downstream array
	this.graph[upNodeId].downstream.forEach(function(nodeId, i, arr) {
		if (nodeId === downNodeId) {
			arr.splice(i,1);
		}
	});
	// remove upNodeId from downNodeId's upstream array
	this.graph[downNodeId].upstream.forEach(function(nodeId, i, arr) {
		if (nodeId === upNodeId) {
			arr.splice(i,1);
		}
	});
};


/* * * * * Transitive Reduction * * * * *
Given a particular node and a new dependency (new upstream node)
*/

WrappedGraph.prototype.gatherUpstreamNodeRefs = function(nodeId) {
	// catalog object w/ all upstream nodeIds as keys
	var catalog = {};
	// recurse up to entry node and add nodeIds to catalog
	(function recurse(nodeId) {
		this.graph[nodeId].upstream && this.graph[nodeId].upstream.forEach(function(upNodeId) {
			catalog[upNodeId] = true;
			recurse(upNodeId);
		});
	})(nodeId);

	return catalog;
};

WrappedGraph.prototype.purgeUplinksFromANode = function(nodeId, catalogObj)
	// iterate through nodeIds in upstream array for node with nodeId
	this.graph[nodeId].upstream && this.graph[nodeId].upstream.forEach(function(upNodeId) {
		// if uplinkNodeId is in catalogObj
		if (catalogObj.hasOwnProperty(upNodeId)) {
			unlinkNodes(upNodeId, nodeId);
		}
	});
};

WrappedGraph.prototype.purgeUplinksBelowANode = function(nodeId, catalogObj)
	// iterate through nodeIds in downstream array for node with nodeId
	this.graph[nodeId].downstream && this.graph[nodeId].downstream.forEach(function(downNodeId) {
		// purgeUplinksFromANode for each nodeId in upstream array of node
		purgeUplinksFromANode(downNodeId, catalogObj);
		// recursive call for each downstream nodeId
		purgeUplinksBelowANode(downNodeId, catalogObj);
	});
};

WrappedGraph.prototype.transitiveReduction = function(nodeId, newUpNodeId) {
	// gather all upstream nodeIds
	var catalog = gatherUpstreamNodeRefs(newUpNodeId);
	// remove all uplinks from node at nodeId
	purgeUplinksFromANode(nodeId, catalog);
	// add newUpNodeId to catalog
	catalog[newUpNodeId] = true;
	// remove nodeId from all downstream nodes
	purgeUplinksBelowANode(nodeId, catalog);
};

/* * * * * * * * * * * * * * * * * * */