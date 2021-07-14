/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:26:03
 * @Description: 
 */
iD.actions.AddMaat = function(returnArr, fromWayId, toWayId, nodeId) {

	return function(graph) {

		var node = graph.entity(nodeId);

		var maatMembers = [{
				'id': fromWayId,
				'role': iD.data.RoleType.FROAD_ID,
				'type': iD.data.GeomType.WAY,
				'modelName': iD.data.DataType.ROAD
			},
			{
				'id': nodeId,
				'role': iD.data.RoleType.ROAD_NODE_ID,
				'type': iD.data.GeomType.NODE,
				'modelName': iD.data.DataType.ROAD_NODE
			},
			{
				'id': toWayId,
				'role': iD.data.RoleType.TROAD_ID,
				'type': iD.data.GeomType.WAY,
				'modelName': iD.data.DataType.ROAD
			}
		];

//		var maatType = node.isRoadCross() ? "CrossMaat" : "NodeMaat";
		var maatType = node.isRoadCross() ? iD.data.DataType.C_NODECONN : iD.data.DataType.NODECONN;

		var layers = iD.Layers,
//			currentLayer = layers.getCurrentEnableLayer();
			currentLayer = layers.getCurrentModelEnableLayer(maatType);
		
		var relation = iD.Relation({
            identifier:currentLayer.identifier,
			tags: iD.util.getDefauteTags(maatType, currentLayer),
			modelName: maatType,
			members: maatMembers,
			layerId: currentLayer.id
		});
		returnArr[0] = relation;

		graph = graph.replace(relation);

		return graph;
	};
};