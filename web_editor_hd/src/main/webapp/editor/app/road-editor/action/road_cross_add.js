/**
 * Created by wt on 2015/8/5.
 */
iD.actions.RoadCrossAdd = function (context,selectedIDs, roadCrossNode) {

    var getMembers=function(ids,graph)
    {
        var members=[]
        for (var i = 0, l = ids.length; i < l; i++) {
            // var attrs = elems[i].attributes;
            // members[i] = {
            //     id: attrs.type.value[0] + attrs.ref.value,
            //     type: attrs.type.value,
            //     role: attrs.role.value
            // };
            //var attrs = elems[i].attributes;
            var entity=graph.entity(ids[i]);
            // var key = 'n'
            members.push({
                id: entity.id,
//              modelName: entity.modelName,
                modelName: entity.modelName,
                type: iD.data.GeomType.NODE,
                role: iD.data.RoleType[entity.modelName + '_ID'],
            });
            /*
            members.push({
                id: entity.id,
                type: entity.modelName,
                role: entity.type,
                modelName: entity.modelName
            });
            */
        }
        return members;
    }
    function generatedotway (a, b) {
        var aid = iD.Entity.id.toOSM(a.id) ,
            bid = iD.Entity.id.toOSM(b.id) ,
            newId = iD.Entity.id.fromOSM( 'way', aid + bid, a.identifier  );
            let layer = iD.Layers.getLayer(a.layerId);
        return new iD.Way({
            id: newId,
            nodes: [a.id, b.id],
            identifier:layer.identifier,
            _type: 'roadcrossline',
//          tags: {"datatype":a.modelName},
			tags: {},
            layerId: a.layerId
        });
    }

	var action = function (graph) {
		if(roadCrossNode){
			graph = roadCrossAppend(graph);
		}else {
			graph = roadCrossAdd(graph);
		}
		
		return graph;
	}

	/**
	 * 根据selectids选中的ROAD_NODE，创建新的C_NODE以及Relation
	 * @param {Object} graph
	 */
    function roadCrossAdd(graph) {
		/* 
		if(!available(graph))
        {
            return graph;
        }
        */
       	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.C_NODE);
        var layerId = currentLayer.id;
        var loc=[0,0];
        selectedIDs.forEach(function(id)
        {
            loc[0]+=graph.entity(id).loc[0];
            loc[1]+=graph.entity(id).loc[1];
        })
        loc[0]/=selectedIDs.length;
        loc[1]/=selectedIDs.length;
        var node = iD.Node({
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.Constant.C_NODE, currentLayer),
            modelName: iD.data.Constant.C_NODE,
            loc: loc,
            layerId : layerId
        });
        graph= graph.replace(node);
		/*
        var meshCode=MapSheet.getMeshCode(node,context);
        if(meshCode)
        {
            //node = iD.util.tagExtend.updateNodeMeshTag(node,context);
            node.tags.mesh=meshCode;
        }else{
            Dialog.alert("综合交叉点无法获取图幅号");
            return graph;
        }
        */
        var relMembers = getMembers([node.id].concat(selectedIDs), graph);
//      node.members.forEach(function(member){
        relMembers.forEach(function(member){
        	if(member.id == node.id){
        		return ;
        	}
            graph=graph.replace(generatedotway(node,graph.entity(member.id)));
        })
        crossRoadId=node.id;
        
        var currentLayer2 = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_C_NODE_ROAD_NODE);
        var relation = iD.Relation({
            identifier:currentLayer2.identifier,
			modelName: iD.data.DataType.R_C_NODE_ROAD_NODE,
            members: relMembers,
            layerId: currentLayer2.id,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_C_NODE_ROAD_NODE, currentLayer2)
		});
		graph= graph.replace(relation);
        
        return iD.topo.handle().roadCrossEdit(graph, selectedIDs[0]);
    }
    
    function roadCrossAppend(graph){
    	var node = roadCrossNode;
    	crossRoadId=node.id;
    	
    	var relMembers = getMembers([node.id].concat(selectedIDs), graph);
    	// line ...
    	relMembers.forEach(function(member){
    		if(member.id == node.id){
        		return ;
        	}
            graph=graph.replace(generatedotway(node, graph.entity(member.id)));
       });
    	
    	var relation = graph.parentRelations(node, iD.data.DataType.R_C_NODE_ROAD_NODE)[0];
    	// 没有relation时
    	// 手动在地图上绘制的一个C_NODE，再框选两个及以上 ROAD_NODE
    	if(!relation){
    		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_C_NODE_ROAD_NODE);
    		relation = iD.Relation({
				modelName: iD.data.DataType.R_C_NODE_ROAD_NODE,
                members: relMembers,
                identifier:currentLayer.identifier,
	            layerId: currentLayer.id,
	            tags: iD.util.getDefauteTags(iD.data.DataType.R_C_NODE_ROAD_NODE, currentLayer)
			});
			graph= graph.replace(relation);
    	}else {
    		for(let member of relMembers){
    			if(member.id == node.id){
	        		continue ;
	        	}
                relation.tags = iD.util.tagExtend.updateTaskTag(relation);
    			graph = graph.replace(relation);
    			graph = iD.actions.AddMember(relation.id, member)(graph);
    		}
    	}
    	
    	// console.log('综合交叉点--追加新的NODE：', relation, roadCrossNode, selectedIDs);
    	
    	return iD.topo.handle().roadCrossEdit(graph, selectedIDs[0]);
    }
    
    var crossRoadId;
    action.crossRoadId=function(_)
    {
        if(_)
        {
            crossRoadId=_;
        }else{
            return crossRoadId;
        }
    }
    action.disabled = function (graph) {
        return false;
    };
    action.available=function()
    {
        var meshs=[];

        if(selectedIDs.length>8)
        {
            Dialog.alert('综合交叉点最多只能综合8个节点');
            return false;
        }
        if(iD.util.roadCrossExtend.getNodesOutWayNum(selectedIDs,context.graph())>15)
        {
            Dialog.alert('综合交叉点最多只能关联15条路');
            return false;
        }
        selectedIDs.forEach(function(id)
        {
            if(-1==meshs.indexOf(context.graph().entity(id).tags.mesh))
            {
                meshs.push(context.graph().entity(id).tags.mesh);
            }
        });
        if(meshs.length!==1){
            Dialog.alert("要综合的节点跨图幅,无法创建综合交叉点")
            return false;
        }else{
            return true;
        }


    }
    return action;
}

