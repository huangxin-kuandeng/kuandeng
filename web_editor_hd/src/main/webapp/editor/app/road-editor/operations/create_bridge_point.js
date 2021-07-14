/**
 * 根据桥底线和车道线，生成桥的高程点
 */
iD.operations.createBridgePoint = function(selectedIDs, context) {
	//var layer = context.layers().getLayerByName(iD.data.DataType.LIMITHEIGHT);
	var bridgeLines = [], crossDividers = [];
	
    var operation = function(){
    	var graph = context.graph(), actions = [];
    	let dataList = [], bridgeDataList = {}, crossNodeList = [], lineCale = iD.util.LineCalCulate();
    	let blineMapNodes = {};
    	// 交点
    	bridgeLines.forEach(function(bid){
    		let bline = context.entity(bid);
    		crossDividers.forEach(function(did){
    			let divider  = context.entity(did);
    			let intersectLoc = lineCale.getIntersectLoc(bline.nodes, divider.nodes, context.graph());
    			if(intersectLoc && intersectLoc.length){
    				let blineNodes = [];
		    		if(blineMapNodes[bline.id]){
		    			blineNodes = blineMapNodes[bline.id];
		    		}else {
		    			blineNodes = context.graph().childNodes(bline);
		    			blineMapNodes[bline.id] = blineNodes;
		    		}
		    		
		    		for(let resultLoc of intersectLoc){
			    		let result = iD.util.pt2LineDist(_.pluck(blineNodes, 'loc'), resultLoc);
			    		let nodeLoc = [];
			    		if(result.i >= 0 && result.i < blineNodes.length){
			    			let fnode = blineNodes[result.i], tnode = blineNodes[result.i + 1]
			    			nodeLoc = iD.util.getBetweenPointLoc(fnode.loc, tnode.loc, resultLoc);
			    			/*
			    			var diffValZ = tnode.loc[2] - fnode.loc[2];
			    			let newDiffValZ = 0;
			    			// 高度值
			    			if(fnode.loc[0] == tnode.loc[0]){
			    				newDiffValZ = diffValZ * Math.abs(fnode.loc[1] - resultLoc[1]) / Math.abs(fnode.loc[1] - tnode.loc[1]);
			    			}else {
			    				newDiffValZ = diffValZ * Math.abs(fnode.loc[0] - resultLoc[0]) / Math.abs(fnode.loc[0] - tnode.loc[0]);
			    			}
			    			nodeLoc = [resultLoc[0], resultLoc[1], fnode.loc[2] + newDiffValZ];
			    			*/
	//		    			console.log('两点Z值：[' + fnode.loc[2] + ' - ' + tnode.loc[2] + '],\t\t', '交点Z值：' + resultLoc[2]);
			    		}
			    		
	    				dataList.push({
	    					loc: nodeLoc,
	    					bline: bline,
	    					divider: divider,
	    					dnodeLoc: resultLoc
	    				});
		    		}
    			}
    		});
    	});
    	// 创建高程点
    	dataList.forEach(function(d){
    		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.LIMITHEIGHT);
    		let node = iD.Node({
                modelName: iD.data.DataType.LIMITHEIGHT,
                layerId: currentLayer.id,
                identifier:currentLayer.identifier,
                tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.LIMITHEIGHT, currentLayer), {
                	// 限高：桥底线与车道线的高程差
                	HEIHGT: (d.loc[2] - d.dnodeLoc[2]) || 0
                }),
                loc: d.loc
            });
            crossNodeList.push(node);
            actions.push(iD.actions.AddEntity(node));
            
            // 高程点与车道线关系
            let members = [getMembers([node])[0], getMembers([d.divider])[0]];
            var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_LH);
            let relation = iD.Relation({
            	modelName: iD.data.DataType.R_DIVIDER_LH,
                members: members,
                identifier:currentLayer.identifier,
	            layerId: currentLayer.id,
	            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_LH, currentLayer)
            });
            actions.push(iD.actions.AddEntity(relation));
            
            let bline = d.bline;
            if(!bridgeDataList[bline.id]){
				bridgeDataList[bline.id] = [];
			}
			bridgeDataList[bline.id].push(node);
    	});
    	
    	// 高程点与桥底线关系
    	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_BRIDGE_LH);
    	for(let blineid in bridgeDataList){
    		let nodes = bridgeDataList[blineid];
    		if(!nodes || !nodes.length){
    			continue ;
    		}
    		let entity = context.entity(blineid);
    		let members = [getMembers([entity])[0]].concat(getMembers(nodes));
    		let relation = iD.Relation({
            	modelName: iD.data.DataType.R_BRIDGE_LH,
	            members: members,
                layerId: currentLayer.id,
                identifier:currentLayer.identifier,
	            tags: iD.util.getDefauteTags(iD.data.DataType.R_BRIDGE_LH, currentLayer)
            });
            actions.push(iD.actions.AddEntity(relation));
    	}
  	  	context.enter(iD.modes.Browse(context));
  	  	
    	if(actions.length){
			context.perform.apply(context, actions.concat(t('operations.bridge_point.title')));
			
			context.event.entityedite({
				entitys: []
			})
		}
    	context.enter(iD.modes.Select(context, _.pluck(crossNodeList, 'id')));
    };
    
    function getMembers(entitys){
    	let members = [];
    	entitys.forEach(function(entity){
    		let typeName = '';
    		if(entity instanceof iD.Node){
    			typeName = iD.data.GeomType.NODE;
    		}else if(entity instanceof iD.Way){
    			typeName = iD.data.GeomType.WAY;
    		}else if(entity instanceof iD.Relation){
    			typeName = iD.data.GeomType.RELATION;
    		}
	    	members.push({
	            id: entity.id,
	            modelName: entity.modelName,
	            type: typeName,
	            role: iD.data.RoleType[entity.modelName + '_ID'],
	        });
    	});
    	return members;
    }

    operation.available = function(){

        if(selectedIDs.length < 2) return false;
        let graph = context.graph(), layer;
        
        for(var i=0;i<selectedIDs.length;i++)
        {
            var entity=context.graph().entity(selectedIDs[i]);
            if(entity.modelName == iD.data.DataType.BRIDGE){
            	// 如果该桥底线已经生成了高程点，那么不允许生成
                layer = iD.Layers.getLayer(entity.layerId);
            	let rels = graph.parentRelations(entity, iD.data.DataType.R_BRIDGE_LH);
            	if(rels.length){
            		return false;
            	}
            	bridgeLines.push(entity.id);
            }else if(entity.modelName == iD.data.DataType.DIVIDER) {
            	crossDividers.push(entity.id);
            }else {
            	return false;
            }
        }
        if(!layer || !layer.editable) return false;
        if (!layer.isModelEditable(iD.data.DataType.LIMITHEIGHT)) {
            return 'exist_node';
        }
        return bridgeLines.length > 0 && crossDividers.length > 0 && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.bridge_point.description');
    };
    operation.id = 'bridge-point';
    operation.keys = [iD.ui.cmd('B')];
    operation.title = t('operations.bridge_point.title');
    return operation;
}