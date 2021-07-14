/**
 * 虚拟车道线量测信息补充
 * @param {Object} newWay 新建的虚拟车道线
 */
iD.actions.createVirtualMeasureinfo = function(newWay) {
	
	return function(graph){
		// 量测信息
		var handle = iD.measureinfo.handle();
		graph = handle.addEntitys(graph, [
			newWay,
			graph.entity(newWay.nodes[0]),
			graph.entity(newWay.nodes[newWay.nodes.length - 1])
		], {
			type: 7
		});
		return graph;
	}
}