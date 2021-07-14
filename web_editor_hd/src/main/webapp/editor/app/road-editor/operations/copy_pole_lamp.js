/**
 * 复制灯头与灯杆之间的位置关系，用于选中下一个灯杆后黏贴对应的灯头；
 * 选择灯杆、出现复制灯头功能
 */
iD.operations.copyPoleLamp = function(selectedIDs, context) {
	var COPY_PASTE_KEY = 'map_editor_copy_pole_lamp';
	//	let selectedLamp = [];
	var selectedTopPole, selectedRelation;

	var operation = function() {
		var graph = context.graph(),
			lineCal = iD.util.LineCalCulate(),
			baseEntity = selectedTopPole;
		var trackNodes = iD.picUtil.player.allNodes;
		var linePoint = iD.util.pt2LineDist(_.pluck(trackNodes, 'loc'), baseEntity.loc);
		var lineAngle = lineCal.getAngle(baseEntity.loc[0], baseEntity.loc[1], linePoint.x, linePoint.y);
		//  	var lampArr = selectedLamp;
		var lampArr = _.compact(_.map(selectedRelation.members, function(m) {
			var entity = graph.entity(m.id);
			if(entity.tags.TYPE == 2) {
				return entity;
			}
		}));
		// 角度、距离、z差值
		var savedList = [];
		for(let lamp of lampArr) {
			let lampAngle = lineCal.getAngle(baseEntity.loc[0], baseEntity.loc[1], lamp.loc[0], lamp.loc[1]);

			let angleDiff = lampAngle - lineAngle;
			let distance = iD.util.distanceByLngLat(baseEntity.loc, lamp.loc);
			let zDiff = lamp.loc[2] - baseEntity.loc[2];

			savedList.push({
				angleDiff: angleDiff,
				lampId: lamp.id,
				poleId: baseEntity.id,
				distance: distance,
				zDiff: zDiff,
				//  			tags: {
				//  				PLANE: lamp.tags.PLANE
				//  			}
			});
		}

		savedList.length && localStorage.setItem(COPY_PASTE_KEY, JSON.stringify(savedList));
		//  	console.log('复制灯头位置信息：', savedList);

		context.enter(iD.modes.Browse(context));
	}
	/*
	operation.available = function() {
		if(selectedIDs.length != 1) return false;
		
		var trackNodes = iD.picUtil.player && iD.picUtil.player.allNodes;
		if(!trackNodes || !trackNodes.length) {
			return false;
		}
		var graph = context.graph(),
			layerids = [];

		var entity = graph.entity(selectedIDs[0]);
		var layer = entity.layerInfo();
		if(layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
			layerids.push(layer.id)
		} else {
			return false;
		}
		if(!_.include([iD.data.DataType.LAMPPOST], entity.modelName)) {
			return false;
		}
		var relations = context.graph().parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF);
		if(!relations.length) {
			return false;
		}
		selectedRelation = relations[0];
		// 灯杆/杆顶部
		if(entity.tags.TYPE == 1) {
			selectedTopPole = entity;
		}

		return layer.editable && !operation.disabled();
	}
	*/
	operation.available = function(){
		if(selectedIDs.length != 1) return false;
		if(!iD.picUtil.player || !iD.picUtil.player.allNodes || !iD.picUtil.player.allNodes.length){
			return false;
		}
		var graph = context.graph();
		var entity = context.entity(selectedIDs[0]);
		var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
		if(!modelConfig || !modelConfig.editable){
			return false;
		}
		if(entity.modelName != iD.data.DataType.LAMPPOST || entity.tags.TYPE != 1){
			return false;
		}
		var relations = graph.parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF);
		if(!relations.length)  return false;
		selectedRelation = relations[0];
		selectedTopPole = entity;
		
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		if(!selectedTopPole || !selectedRelation) {
			return true;
		}
		return false;
	}
	operation.tooltip = function() {
		if(!selectedTopPole) {
			return t('operations.copy_pole_lamp.noTopPole');
		}
		return t('operations.copy_pole_lamp.description');
	}
	operation.id = 'copy';
	operation.keys = [iD.ui.cmd('⌘C')];
	operation.title = t('operations.copy_pole_lamp.title');
	return operation;
}