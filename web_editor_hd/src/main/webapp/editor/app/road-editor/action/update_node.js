/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-28 10:25:46
 * @Description: 
 */

iD.actions.UpdateNode = function(context,nodeId) {
    return function(graph) {
    	var node;
    	if(typeof nodeId === "string"){
    		node = graph.entity(nodeId);
    	}else{
    		node = nodeId;
    		nodeId = node.id;
    	}
//      if(node.isRoadNode()||node.isWalkEnter()){
        node = iD.util.tagExtend.updateNodeMeshTag(node,context);
    	node.tags = iD.util.tagExtend.updateTaskTag(node);
        graph=graph.replace(node);
        graph.parentRelations(graph.entity(nodeId)).forEach(function(rel)
        {
            if(rel.tags&&rel.modelName==iD.data.Constant.C_NODE)
            {
                graph=iD.actions.ChangeNodeMember(rel.id,rel.members)(graph);
            }
        })

        graph.parentWays(graph.entity(nodeId)).forEach(function(way)
        {
           way.tags = iD.util.tagExtend.updateTaskTag(way);
           if([iD.data.DataType.PAVEMENT_DISTRESS,iD.data.DataType.PAVEMENT_DISTRESS_PL].includes(way.modelName)){
               way = iD.util.tagExtend._updatePavement(graph,way);
           }
           graph=graph.replace(way);

        })
//      }
        graph=iD.topo.handle().nodeMove(context,graph,graph.entity(node.id));
        return graph;
    };

};
