/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:34:15
 * @Description: 
 */
iD.actions.AutoGenerateWay = function(returnArr, fromWayId, toWayId, nodeId) {

	return function(graph) {
			currentLayer = layers.getCurrentModelEnableLayer(maatType);
		
		var relation = iD.Relation({
			// tags: {
			//     'datatype': maatType
			// },
			tags: iD.util.getDefauteTags(maatType, currentLayer),
			modelName: maatType,
            members: maatMembers,
            identifier:currentLayer.identifier,
			layerId: currentLayer.id
		});
		returnArr[0] = relation;

		graph = graph.replace(relation);

		return graph;
	};
};