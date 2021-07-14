/**
 * 复制路牌量测信息
 */
iD.operations.pasteBoardPlane = function(selectedIDs, context) {
	var MAX_DISTANCE = 10;
	var COPY_PASTE_KEY = 'map_editor_copy_board_plane';
	//	let selectedLamp = [];
	var selectEntity;

	var operation = function() {
		var copyData;
    	try{
    		copyData = JSON.parse(localStorage.getItem(COPY_PASTE_KEY));
    	}catch(e){
    		localStorage.removeItem(COPY_PASTE_KEY);
    	}
    	if(!copyData){
    		return ;
    	}
    	/*
    	let protoEntity = context.hasEntity(copyData.entityid);
    	if(!protoEntity){
    		Dialog.alert('原始路牌不存在或ID更新');
    		return ;
    	}
    	var protoNode = context.entity(protoEntity.nodes[0]);
    	var node = context.entity(selectEntity.nodes[0]);
    	if(iD.util.distanceByLngLat(protoNode.loc, node.loc) > MAX_DISTANCE){
    		Dialog.alert('路牌距离超出 ' + MAX_DISTANCE + '米');
    		return ;
    	}
    	*/
    	
    	var player = iD.picUtil.player;
    	var trackPointIds = _.pluck(player.wayInfo.nodes, 'id');
    	/*
    	var trackNode = player.dataMgr.pointId2Node(copyData.trackPointId);
		if(!trackNode){
			Dialog.alert('轨迹中不存在轨迹点 ' + copyData.trackPointId);
			return ;
		}
		*/
		// 使用粘贴目标路牌的量测信息轨迹位置
		var measureNode = parseMeasure(context.entity(selectEntity.nodes[0]));
		if(!measureNode){
			Dialog.alert('粘贴的路牌节点没有量测信息，无法定位轨迹点');
			return ;
		}
    	var trackNode = player.dataMgr.pointId2Node(measureNode.trackPointId);
		if(!trackNode){
			Dialog.alert('轨迹中不存在轨迹点 ' + copyData.trackPointId);
			return ;
		}
    	
    	var actions = [];
    	_.map(selectEntity.nodes.slice(0, selectEntity.nodes.length - 1), context.entity).forEach(function(node){
    		let data = parseMeasure(node);
    		if(!data || isNaN(data.x) || isNaN(data.y)){
    			return ;
    		}
//  		let pointId = data.trackPointId;
//  		if(trackPointIds.indexOf(pointId) == -1){
//  			return ;
//  		}
    		// 量测信息中存储的是原图坐标
    		let xy = [data.x, data.y];
			let loc = iD.picUtil.pixelToLngLatByPlane(xy, copyData.PLANE, trackNode);
			
			actions.push(iD.actions.MoveNode(node.id, loc));
	        actions.push(iD.picUtil.measureinfoAction(node, {
	            trackPointId: trackNode.id,
	            trackId: trackNode.tags.trackId,
	            imgOffset: {'x': xy[0], 'y': xy[1]},
	            wayid: selectEntity.id
	        }));
    	});
    	if(actions.length/2 != selectEntity.nodes.length - 1){
    		Dialog.alert('节点缺失量测信息');
    		return ;
    	}
    	
		iD.logger.editElement({
            tag: 'board_plane_paste',
            entityid: selectEntity.id,
            modelName: selectEntity.modelName
        });				//量测信息黏贴时增加埋点操作
        
    	actions.push(iD.actions.ChangeTags(selectEntity.id, {
    		PLANE: copyData.PLANE
    	}));
    	actions.push('更新路牌位置');
    	
		context.enter(iD.modes.Browse(context));
    	context.perform.apply(context, actions);
    	context.event.entityedite({
    		entitys: []
    	})
	}
	
	function parseMeasure(node){
		return iD.picUtil.parseMeasureNodes(node)[0];
	}
	
	operation.available = function(){
		if(selectedIDs.length != 1) return false;
    	if(!localStorage.getItem(COPY_PASTE_KEY)) return false;
		if(!iD.picUtil.player || !iD.picUtil.player.wayInfo){
			return false;
		}
		var graph = context.graph();
		var entity = context.entity(selectedIDs[0]);
		var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
		if(!modelConfig || !modelConfig.editable){
			return false;
		}
		if(entity.modelName != iD.data.DataType.TRAFFICSIGN){
			return false;
		}
		selectEntity = entity;
		
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		if(!selectEntity) {
			return true;
		}
		return false;
	}
	operation.tooltip = function() {
		return t('operations.paste_board_plane.description');
	}
	operation.id = 'paste';
	operation.keys = [iD.ui.cmd('⌘V')];
	operation.title = t('operations.paste_board_plane.title');
	return operation;
}