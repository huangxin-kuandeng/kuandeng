/**
 * Created by wt on 2015/8/5.
 */
iD.actions.RoadCrossModify = function (selectedIDs) {

    function getCrossWayId (graph,entity) {
        var crossWayId;
        graph.parentWays(entity).forEach(function (way) {
            if (way.isOneRoadCrossWay()) crossWayId = way.id;
        });
        return crossWayId;
    }
    
    function roadCrossRelation(graph, id){
    	var entity = graph.hasEntity(id);
    	if(!entity) return ;
    	var rels = graph.parentRelations(entity, iD.data.DataType.R_C_NODE_ROAD_NODE);
    	return rels[0];
    }
    function createRoadCrossRel(graph, members = [], rels = []){
    	if(!members.length) return graph;
    	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_C_NODE_ROAD_NODE);
        var relation = iD.Relation({
            identifier:currentLayer.identifier,
			modelName: iD.data.DataType.R_C_NODE_ROAD_NODE,
            members: members,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_C_NODE_ROAD_NODE, currentLayer)
		});
		rels[0] = relation;
		return graph.replace(relation);
    }

    function addRoadCrossMember(graph,roadCross,node)
    {
        var layers = iD.Layers, layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD);
        var layerId=layer.id;
        var fromId=roadCross.id;
        var toId=node.id;
        var way = new iD.Way({
            id: iD.Entity.id.fromOSM('way', iD.Entity.id.toOSM(fromId) + '_' + iD.Entity.id.toOSM(toId),  layer.identifier),
            nodes: [fromId, toId],
            _type: 'roadcrossline',
            identifier:layer.identifier,
//          tags: {datatype:iD.data.Constant.C_NODE},
            tags: iD.util.getDefauteTags(iD.data.Constant.C_NODE, layer),
            layerId: layerId
        });
        var rel = roadCrossRelation(graph, fromId);
        if(!rel){
        	var rels = [];
        	graph = createRoadCrossRel(graph, {
	            id: toId,
	            modelName: iD.data.DataType.C_NODE,
	            type: iD.data.GeomType.NODE,
	            role: iD.data.RoleType.C_NODE_ID,
	        }, rels);
        	rel = rels[0];
        }
        var member = {
            id: toId,
            modelName: iD.data.DataType.ROAD_NODE,
            type: iD.data.GeomType.NODE,
            role: iD.data.RoleType.ROAD_NODE_ID,
        };
        graph = iD.actions.AddMember(rel.id, member)(graph);
        graph=iD.actions.AddEntity(way)(graph);
        return graph;
    }

    function delRoadCrossMember(graph,roadCross,node)
    {
    	// iD.actions.ChangeMember  ,  iD.actions.DeleteMember
    	var rel = roadCrossRelation(graph, roadCross.id);
    	var members = rel.members || [];
    	if(!members.length) return graph;
    	var index = -1;
        members.forEach(function (mber, idx) { 
        	if(mber.id == node.id){
        		index = idx;
        	}
        });
        if(index == -1) return graph;
        graph = iD.actions.DeleteMember(rel.id, index)(graph);
        graph=iD.actions.DeleteWay(getCrossWayId(graph,node))(graph);
        return graph;
    }
/*    function editRoadCroassLineObject (graph,id, fromId, toId) {
        var cnm1;
        var layers = iD.Layers, layer = layers.getCurrentEnableLayer();
        var layerId=layer.id;
        if (id) {//删除原有关系

        }else{

        }




        return graph;
        //建立新关系

    }*/
    var action = function (graph) {
        var entity = graph.entity(selectedIDs[0]);

            if (entity.isRoadCross) {
                if(selectedIDs.length>1) {
                    var idKey = selectedIDs.length - 1;
                    var diffEntity = graph.entity(selectedIDs[idKey]);//最后一个

                    if(!available(graph,entity,diffEntity))
                    {
                        selectedIDs.pop();
                        return graph;
                    }
                    if (!(idKey === 0 || !diffEntity.isRoadNode)) {
                        var rc = roadCrossRelation(graph, diffEntity.id);
                        if(rc){
                            graph=delRoadCrossMember(graph,entity,diffEntity);
                        }else{
                            graph=addRoadCrossMember(graph,entity,diffEntity);
                        }
                    }
                }
                entity=graph.entity(entity.id);
                var rel = roadCrossRelation(graph, entity.id);
                selectedIDs.pop();
                if(!rel) return graph;
                if(rel.members.length==1) {
                    if(!editprocess) {
                        graph=iD.actions.DeleteNode(entity.id)(graph);
                    }
                }else{
                    graph= iD.topo.handle().roadCrossEdit(graph,entity.id);
                }

            }


        return graph;
    };
    action.disabled = function (graph) {
        return false;
    };
    var editprocess=false;
    action.setEditProcess=function(_)
    {
        editprocess=_;
    }
    var available=function(graph,crossNode,node)
    {
         if(crossNode.tags.mesh==node.tags.mesh)
        {
            return true;
        }else{
            Dialog.alert("要综合的节点跨图幅,无法编辑");
            return false;
        }
    }
    return action;
}

