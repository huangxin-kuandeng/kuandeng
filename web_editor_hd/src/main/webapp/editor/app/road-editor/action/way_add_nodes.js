/**
 * 为way添加Node
 * @param {Object} wayid
 * @param {Object} nodes
 */
iD.actions.WayAddNodes = function(wayid, _nodes, index) {
    return function(graph) {
    	let way = graph.entity(wayid);
    	for(let node of _nodes){
    		graph = graph.replace(node);
    	}
    	let nodesids = _.pluck(_nodes, 'id');
    	let nodes = _.clone(way.nodes);
    	
    	nodes.splice(index === undefined ? nodes.length : index, 0, ...nodesids);
        return graph.replace(way.update({nodes: nodes}));
    };
};
