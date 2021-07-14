/**
 * 复制灯头与灯杆（顶部）之间的位置关系，用于选中下一个灯杆顶部后黏贴对应的灯头；
 */
iD.operations.pastePoleLamp = function(selectedIDs, context) {

	let COPY_PASTE_KEY = 'map_editor_copy_pole_lamp';
	let modelNameParam = iD.picUtil.getModelNameParam();
	// let layer = context.layers().getLayerByName(modelNameParam.LAMPPOST);
	let selectedTopPoleList = [];
    let handle = iD.measureinfo.handle();

    iD.actions.AddEntity = function(entity) {
        return function(graph) {
            return graph.replace(entity);
        };
    }
    var createMeasureinfo = (entity,opt)=>{
        return function(graph) {
            return handle.addEntity(graph, entity, {
                type: 2,
//              method:5,
                data:[opt]
            })
        };
    }
    var operation = function(){
        var graph = context.graph(), lineCal = iD.util.LineCalCulate();
    	let trackNodes = iD.picUtil.player.allNodes, _count = 0;
//  	let baseEntity = selectedTopPole;
    	for(let baseEntity of selectedTopPoleList){
	    	let linePoint = iD.util.pt2LineDist(_.pluck(trackNodes, 'loc'), baseEntity.loc);
	    	// 超出最后一个轨迹点位置
	    	if(linePoint.i >= trackNodes.length - 2){
	    		let temp = [];
	    		let p1 = trackNodes[trackNodes.length - 2], p2 = trackNodes[trackNodes.length - 1];
	    		// 延长线与某一点的垂足位置：temp
	    		let trst = iD.util.pedal([p1.loc[0], p1.loc[1], p2.loc[0], p2.loc[1]], baseEntity.loc, temp);
	    		if(!isNaN(trst)){
	    			linePoint.x = temp[0];
	    			linePoint.y = temp[1];
	//  			console.log('超出最后一个轨迹点，通过射线计算垂点：', temp);
	    		}
	    	}
	    	let lineAngle = lineCal.getAngle(baseEntity.loc[0], baseEntity.loc[1], linePoint.x, linePoint.y);
	    	
	    	let savedList = [];
	    	try{
	    		savedList = JSON.parse(localStorage.getItem(COPY_PASTE_KEY));
	    	}catch(e){
	    		localStorage.removeItem(COPY_PASTE_KEY);
	    	}
	    	
	//  	console.log('杆顶点：', baseEntity.loc);
	    	let actions = [], addedEntities = [];
	    	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.LAMPPOST);

	    	for(let data of savedList){
	    		let angle = lineAngle + data.angleDiff;
	    		if(angle >= 360){
	    			angle -= 360;
	    		}
	//  		console.log('正北夹角：' + angle, '\t与杆顶点距离：' + data.distance + '米', '\t与杆顶点高度差：' + data.zDiff);


	    		let lonlat = lineCal.calculateVerticalP(baseEntity.loc[0], baseEntity.loc[1], data.distance / 1000, angle);
	    		let node = iD.Node({
	                modelName: modelNameParam.LAMPPOST,
                    layerId: currentLayer.id,
                    identifier:currentLayer.identifier,
	                tags: _.extend({}, iD.util.getDefauteTags(modelNameParam.LAMPPOST, currentLayer), {
	                	TYPE: 2
	                }),
	                loc: [lonlat.Longitude, lonlat.Latitude, baseEntity.loc[2] + data.zDiff]
	            });

	    		let opt = {
                    angle:angle,
                    distance :data.distance,
                    type: 'copy'
                }
                actions.push(createMeasureinfo(node,opt));
	            actions.push(iD.actions.AddEntity(node));
	            addedEntities.push(node.id);
	//          console.log('黏贴的灯头：', node.loc);
	    	}

            context[_count === 0 ? 'perform' : 'replace'].apply(context, actions.concat(t('operations.paste_pole_lamp.title')));
            if(actions.length){
            	let relCreate = iD.operations.LamppostLREFCreate([baseEntity.id].concat(addedEntities), context, true);
	    		if(relCreate.available() && !relCreate.disabled()){
	    			relCreate();
	    			context.replace(iD.actions.Noop(), t('operations.paste_pole_lamp.title'));
	    		}
            }
    		/*
    		 * // OBJECT_PT时的灯头/灯杆关系
	    	if(actions.length){
	    		context[_count === 0 ? 'perform' : 'replace'].apply(context, actions.concat(t('operations.paste_pole_lamp.title')));
	    		let relCreate = iD.operations.optOptCreate([baseEntity.id].concat(addedEntities), context, true);
	    		if(relCreate.available() && !relCreate.disabled()){
	    			relCreate();
	    			context.replace(iD.actions.Noop(), t('operations.paste_pole_lamp.title'));
	    		}
	//  		iD.picUtil.createIntersectionDatum(linePoint);
	    	}
	    	*/
    		_count ++;
    	}
    	
    	_count > 0 && context.event.entityedite({
    		entitys: []
    	})
    	context.enter(iD.modes.Browse(context));
    }

    operation.available = function(){
//  	return false;
    	//if(layer.editable) return false;
    	if(selectedIDs.length < 1) return false;
    	if(!localStorage.getItem(COPY_PASTE_KEY)) return false;
    	let trackNodes = iD.picUtil.player && iD.picUtil.player.allNodes;
    	if(!trackNodes || !trackNodes.length){
    		return false;
    	}
    	
        let graph = context.graph(), layerids = [];
        for(let entityid of selectedIDs){
	        let entity = graph.entity(entityid);
	        if(!_.include([iD.data.DataType.LAMPPOST], entity.modelName)){
	            return false;
	        }
            var layer = iD.Layers.getLayer(entity.layerId);
            if (layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
                layerids.push(layer.id)
            } else {
                return false;
            }
	        // 必须是杆顶部
	        if(entity.tags.TYPE != 1){
	        	return  false;
	        }
	       	selectedTopPoleList.push(entity);
        }
       
        return layer.editable && !operation.disabled();
    }
    operation.disabled = function(){
        return false;
    }
    operation.tooltip = function(){
    	return t('operations.paste_pole_lamp.description');
    }
    operation.id = 'paste';
    operation.keys = [iD.ui.cmd('⌘V')];
    operation.title = t('operations.paste_pole_lamp.title');
    return operation;
}