// Disconect the ways at the given node.
//
// Optionally, disconnect only the given ways.
//
// For testing convenience, accepts an ID to assign to the (first) new node.
// Normally, this will be undefined and the way will automatically
// be assigned a new ID.
//
// This is the inverse of `iD.actions.Connect`.
//
// Reference:
//   https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/UnjoinNodeAction.as
//   https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/actions/UnGlueAction.java
// newNodeId
iD.actions.Disconnect = function(nodeId, newNodeId) {
    var wayIds,splitObj;

    function createrDividerAttribute(wayId, nodeId,tags) {
        var dividerAttributeMember = [
            {
                'id': wayId,
                'modelName':iD.data.DataType.DIVIDER,
                'role': iD.data.RoleType.DIVIDER_ID,
                'type':iD.data.GeomType.WAY
            }, {
                'id': nodeId,
                'modelName':iD.data.DataType.DIVIDER_NODE,
                'role': iD.data.RoleType.DIVIDER_NODE_ID,
                'type':iD.data.GeomType.NODE
            }];
        let layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_ATTRIBUTE);
        var dividerAttributeRelations = iD.Relation({
            modelName:iD.data.DataType.DIVIDER_ATTRIBUTE,
            identifier:layer.identifier,
            members: dividerAttributeMember,
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_ATTRIBUTE).id
        });
        dividerAttributeRelations.setTags(tags);
        return dividerAttributeRelations;
    }

    function extentRelation(graph,pWayId,wayId,nodeId){
        var pWay  =  graph.entity(pWayId);
        var relations = graph.parentRelations(pWay,iD.data.DataType.DIVIDER_ATTRIBUTE);
        var wayMember,nodeMember,_tempRealtion,relation;
        let direction = pWay.tags && pWay.tags.DIRECTION;

        for(var i = 0,len = relations.length;i<len;i++){
            _tempRealtion = relations[i];
            wayMember = _tempRealtion.memberByIdAndRole(pWayId,iD.data.RoleType.DIVIDER_ID);
            nodeMember = _tempRealtion.memberByRole(iD.data.RoleType.DIVIDER_NODE_ID);
            if(wayMember &&
                ((nodeMember.id == pWay.first() && direction !='3')
                || (nodeMember.id == pWay.last() && direction =='3')
                || (pWay.nodes.includes(nodeMember.id)
                    && nodeMember.id != pWay.first())
                    && nodeMember.id != pWay.last())){
                relation = _tempRealtion;
                break;
            }
        }
        if(relation){
            graph = graph.replace(createrDividerAttribute(wayId,nodeId,Object.assign({},relation.tags)));
        }
        return graph;
    }
    //nodeId为打断点
    var action = function(graph) {
        var node = graph.entity(nodeId),
            connections = action.connections(graph);        //examples: index: 0     wayID: "w_-1"
        var pWays = graph.parentWays(node); //  所有包含打断点的父道路
        var ways = [];
        var relation;
        splitObj = {ways:ways};
        for(var i = 1; i < pWays.length; i++){
        	if(pWays[i].isOneRoadCrossWay()){
        		continue;
        	}else{
        		//设置母库ID为空
        		var xWay = graph.entity(pWays[i].id);
                	// xWay = xWay.mergeTags({src_id: ''});
                	graph = graph.replace(xWay);
                    ways.push(pWays[i].id);
        	}
        }
        
        for(var i in pWays){
        	var pway = pWays[i];
        	var tempNodeIndex = -1;
        	var pwayNodes = pway.nodes || [];
        	
        	for(var j in pwayNodes){
        		var idstr = pwayNodes[j];
        		// /^n_-/.test(idstr)
        		if(idstr === nodeId){
        			tempNodeIndex = parseInt(j);
        			break;
        		}
        	}
        	if(tempNodeIndex == -1){
        		continue ;
        	}
        	
        	var nodes1 = pwayNodes.slice(0, tempNodeIndex + 1);
        	var nodes2 = pwayNodes.slice(tempNodeIndex);
        	let lay = iD.Layers.getCurrentModelEnableLayer(pway.modelName);
        	var way1 = iD.Way({
        	    layerId: lay.id,
                nodes: nodes1,
                identifier: lay.identifier,
        	    modelName: pway.modelName,
        	    tags: pway.tags || {}
        	});

        	var way2 = iD.Way({
        	    layerId: lay.id,
                nodes: nodes2,
                identifier: lay.identifier,
        	    modelName: pway.modelName,
        	    tags: pway.tags || {}
        	});
            way1.tags = iD.util.tagExtend.updateTaskTag(way1);
            way2.tags = iD.util.tagExtend.updateTaskTag(way2);
            let direction = pway.tags && pway.tags.DIRECTION;


        	graph = way1.nodes.length>=2? graph.replace(way1) : graph;
        	graph = way2.nodes.length>=2? graph.replace(way2): graph;

            graph =  extentRelation(graph,pway.id,way1.id,direction == '3' ? way1.last() : way1.first());
            graph = extentRelation(graph,pway.id,way2.id,direction == '3' ? way2.last() : way2.first());
        }
        graph = iD.actions.DeleteWay(pWays[0].id)(graph);
        //graph.remove(pWays[0]);
        //因为道路打断点打断以后属于不同的道路，所以对道路打断点在不同道路中赋予不同id
        /*
        connections.forEach(function(connection) {
            var way = graph.entity(connection.wayID),
                newNode = iD.Node({id: newNodeId, loc: node.loc, tags: node.tags});
            newNode.layerId = way.layerId; //设置图层属性

            if(way.layerInfo().isRoad()){
            	newNode.modelName = "RoadNode";
            }
            
            graph = graph.replace(newNode);
            if (connection.index === 0 && way.isArea()) {
                // replace shared node with shared node..
                graph = graph.replace(way.replaceNode(way.nodes[0], newNode.id));
            } else {
                // replace shared node with multiple new nodes..
                graph = graph.replace(way.updateNode(newNode.id, connection.index));
            }
        });
         */
        return graph;
    };

    action.connections = function(graph) {
        var candidates = [],
            keeping = false,
            parentWays = graph.parentWays(graph.entity(nodeId));
        //parentWays为所有包含道路打断点的道路
        /*
        for(var k=1;k<parentWays.length;k++){
            var way = parentWays[k];
            if (wayIds && wayIds.indexOf(way.id) === -1) {
                keeping = true;
                return;
            }
            if (way.isArea() && (way.nodes[0] === nodeId)) {
                candidates.push({wayID: way.id, index: 0});
            } else {
                way.nodes.forEach(function(waynode, index) {
                    if (waynode === nodeId) {
                        candidates.push({wayID: way.id, index: index});
                    }
                })
            }
        };*/
        parentWays.forEach(function(way) {
            if (wayIds && wayIds.indexOf(way.id) === -1) {
                keeping = true;
                return;
            }
            if (way.isArea() && (way.nodes[0] === nodeId)) {
                candidates.push({wayID: way.id, index: 0});
            } else {
                way.nodes.forEach(function(waynode, index) {
                    if (waynode === nodeId) {
                        candidates.push({wayID: way.id, index: index});
                    }
                });
            }
        });


        return keeping ? candidates : candidates.slice(1);
    };
    action.getSplitObj = function(){
        return splitObj;
    }
    action.disabled = function(graph) {
//        var connections = action.connections(graph);
//        if (connections.length === 0 || (wayIds && wayIds.length !== connections.length))
//            return 'not_connected';
    };

    action.limitWays = function(_) {
        if (!arguments.length) return wayIds;
        wayIds = _;
        return action;
    };

    return action;
};
