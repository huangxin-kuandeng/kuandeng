/**
 * 地图多选车道线节点，可建立共点
 * 1、优先保留有DA的点；
 * 2、多个DA使用第一个DA的点；
 * 3、没有DA使用第一个点；
 * 4、合并后保留所有DA信息，更新members；
 * 5、量测信息保留使用的点；
 */
iD.operations.connectDividerNode = function(selectedIDs, context) {
	var dividerNodes = [];

	var operation = function() {
		var relDAs = [], daNodes = [];
		dividerNodes.forEach(function(d){
			let rels = context.graph().parentRelations(d, iD.data.DataType.DIVIDER_ATTRIBUTE);
			if(rels.length){
				relDAs.push(...rels);
				daNodes.push(d);
			}
		});
		var survivor = dividerNodes[0];
		if(daNodes.length){
			survivor = daNodes[0];
		}   
		var actions = [];
		dividerNodes.forEach(function(d){
			if(d.id == survivor.id){
				return ;
			}
			actions.push(iD.actions.ConnectDivider(context, [d.id, survivor.id]));
		});
		
		context.perform(
			...actions,
			t('operations.connect_divider_node.description')
		);
		iD.logger.editElement({
			'tag':'connect_divider_nodes',
			'entityId':survivor.osmId() || '',
			'modelName': survivor.modelName
		});			//点击车道线节点生成共点
		context.enter(iD.modes.Browse(context));
        context.event.entityedite({entitys: []});
	}
	
	operation.available = function(){
		if(selectedIDs.length < 2) return false;
		// 车道线首尾节点
		var nodes = selectedIDs.map(function(id){
			let et = context.entity(id);
			if([
                iD.data.DataType.DIVIDER_NODE,
                iD.data.DataType.HD_LANE_NODE,
                iD.data.DataType.OBJECT_PL_NODE
            ].includes(et.modelName) 
				&& et.isEndpoint(context.graph())){
				return et;
			}
		}).filter(function(d){
			return d;
        });
        if(_.uniq(_.pluck(nodes, 'modelName')).length > 1) return false;
		
		// 有重复way
		var repeatLine = {};
		var isRepeat = false;
		for(let node of nodes){
			if(isRepeat) break;
			let ways = context.graph().parentWays(node);
			for(let way of ways){
				if(repeatLine[way.id]){
					isRepeat = true;
					break;
				}else {
					repeatLine[way.id] = true;
				}
            }
            var layer = iD.Layers.getLayerById(node.layerId);
            if(!layer || !layer.editable || !layer.isModelEditable(node.modelName)){
                return false;
            }
		}
		
		if(isRepeat || nodes.length != selectedIDs.length){
			return false;
		}
		
		dividerNodes = nodes;
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		if(!dividerNodes.length) {
			return true;
		}
		return false;
	}
	
	operation.tooltip = function() {
		return t('operations.connect_divider_node.description');
	}
	
	operation.id = 'merge';
	operation.keys = [iD.ui.cmd('⌘C')];
	operation.title = t('operations.connect_divider_node.title');
	return operation;
}