
iD.svg.PicDraw = {};
iD.svg.PicDrawUtil = {};

/**
 * 视频点击，绘制线类型的后续操作，验证线段格式
 * @param {Shape} shape
 * @param {Object} drawStatus
 * @param {Boolean} isDbclick
 * @param {Object} opts
 * 		isContinue: 是否为跨帧绘制逻辑
 * 
 * @return 线段格式是否正确
 */
iD.svg.PicDrawUtil.clickAddLineAfter = function(shape, drawStatus, isDbclick, opts){
	var player = opts.player;
	var drawTool = player.getDrawTool();
	if(!opts) opts = {
		isContinue: false,
		redraw: false
	};
    var flag = true;
    if(isDbclick && drawTool.clearWrongShapeAndEntity.isWrong(shape, 'polyline')){
        flag = false;
        drawTool.clearWrongShapeAndEntity(shape);
    }else if(opts.isContinue){
        if(opts.redraw || (drawStatus.__lastDrawIndex != null && drawStatus.__lastDrawIndex != player.selectPicIndex)){
            // 跨帧绘制车道线，如果超过反投范围，shape不会渲染到视频上
            // 并且shape是上一帧上的位置，需要重新反投获取最新的shape；
             var dids = _.compact([shape._entityid].concat(_.pluck(shape._nodeList || [], '_entityid')))
             dids = _.uniq(dids);
             drawTool.resetPointToPicPlayer(dids);
             var newShape = drawTool.ZEUtil.getShapesByEid(shape._entityid)[0];
             if(newShape){
                drawStatus.shape && drawTool._zrender.remove(drawStatus.shape);
                /*
            	if(drawStatus.shape){
            		[drawStatus.shape]
            			.concat(drawStatus.shape._nodeList || [])
            			.forEach(s => drawTool._zrender.remove(s));
            	}
            	*/
        		drawStatus.shape = newShape;
                drawTool._zrender.add(newShape);
             }
            drawTool.clearZRenderHover();
        }
    }
    if(opts.isContinue){
    	if(isDbclick){
    	    drawStatus.__lastDrawIndex = undefined;
    	}else {
    	    drawStatus.__lastDrawIndex = player.selectPicIndex;
    	}
    }
    return flag;
}
/**
 * 视频点击，绘制多边形类型的后续操作，验证多边形格式
 * @param {Shape} shape
 * @param {Object} drawStatus
 * @param {Boolean} isDbclick
 * @param {Object} opts
 * 		isContinue: 是否为跨帧绘制逻辑
 * 
 * @return 多边形格式是否正确
 */
iD.svg.PicDrawUtil.clickAddPolygonAfter = function(shape, drawStatus, isDbclick, opts){
	var player = opts.player;
	var drawTool = player.getDrawTool();
	if(!opts) opts = {
		isContinue: false
	};
	
	var flag = true;
    if(isDbclick && drawTool.clearWrongShapeAndEntity.isWrong(shape, 'polygon')){
        flag = false;
        drawTool.clearWrongShapeAndEntity(shape);
    }else if(opts.isContinue){
    	// 跨帧绘制时，距离上个绘制点过长导致绘制后没有线段的问题；
    	var marker = opts.marker;
        iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);
        drawTool._zrender.add(marker);
        if(drawStatus.__lastDrawIndex != null && drawStatus.__lastDrawIndex != player.selectPicIndex){
            var dids = _.compact([shape._entityid].concat(_.pluck(shape._nodeList || [], '_entityid')))
            dids = _.uniq(dids);
            drawTool.resetPointToPicPlayer(dids);
            var newShape = drawTool.ZEUtil.getShapesByEid(shape._entityid)[0];
            if(newShape){
            	drawStatus.shape && drawTool._zrender.remove(drawStatus.shape);
                drawStatus.shape = newShape;
                drawTool._zrender.add(newShape);
            }
            drawTool.clearZRenderHover();
        }
    }
    if(opts.isContinue){
    	if(isDbclick){
    	    drawStatus.__lastDrawIndex = undefined;
    	}else {
    	    drawStatus.__lastDrawIndex = player.selectPicIndex;
    	}
    }
    return flag;
}
/**
 * 
 * @param {Shape} drawMark
 * @param {Object} geoData
 * @param {Object} opts
 * 		downNodeid: 鼠标绘制位置的其他节点
 * 		isCommonPoint: 是否要创建共点
 * 		nodeModelName: 
 * 		lineModelName: 
 * 		
 * 		
 */
iD.svg.PicDrawUtil.drawLine2Map = function(drawMark, geoData, opts = {}){
	var player = opts.player, context = opts.context;
	var drawTool = player.getDrawTool();
    var result = drawMark;
    var data = geoData;
    if(context.transactionEditor() && iD.picUtil.checkDrawGeoOutEditable(drawTool, result, data)){
    	return false;
    }
    var actions = [];
    // 是否为replace操作
    var isReplaceUpdate = false;
    result.geoType = 2;
    var MODEL_NAME_NODE = opts.nodeModelName;
    var MODEL_NAME_LINE = opts.lineModelName;
    if(!MODEL_NAME_NODE || !MODEL_NAME_LINE) return false;
    
    var nodeLayer = iD.Layers.getCurrentModelEnableLayer(MODEL_NAME_NODE);
    var lineLayer = iD.Layers.getCurrentModelEnableLayer(MODEL_NAME_LINE);
    /*
    var fromNode = opts.downNodeid && context.entity(opts.downNodeid);
    var isFromNode = fromNode
    	&& opts.isCommonPoint
        && fromNode.modelName == MODEL_NAME_NODE
        && iD.util.nodeIsBreakPoint(fromNode, context.graph());
    */
    var fromNode = false;
    var isFromNode = false;

    if(isFromNode && result._entityid){
        var fromNodeWays = context.graph().parentWays(fromNode);
        // 若点击的点已经与当前绘制的way建立了共点，禁止重复
        if(_.pluck(fromNodeWays, 'id').includes(result._entityid)){
            isFromNode = false;
        }
    }
    var node;
    let _layer = iD.Layers.getLayer(nodeLayer.id);
    if(isFromNode){
        node = fromNode;
    }else {
        node = iD.Node({
            modelName: MODEL_NAME_NODE,
            layerId: nodeLayer.id,
            identifier:_layer.identifier,
            // tags: iD.util.getDefauteTags(MODEL_NAME_NODE),
            loc: [data.geometry.lng, data.geometry.lat, data.geometry.elevation]
        });
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
    }
    var way;
    var isCreate = false;
    if(!result._entityid){
        way = iD.Way({
            modelName: MODEL_NAME_LINE,
            identifier:lineLayer.identifier,
            layerId: lineLayer.id,
            // tags: iD.util.getDefauteTags(MODEL_NAME_LINE),
            // way初始化时，节点相同渲染为共点
            nodes: [node.id]
        });
        // result._entity = way;
        way.setTags(_.extend({}, iD.util.getDefauteTags(way, lineLayer), opts.wayTags));
        result._entityid = way.id;
        actions.push(iD.actions.AddEntity(node));
        actions.push(iD.actions.AddEntity(way));
        actions.push(iD.picUtil.measureinfoAction(node, {
            trackPointId: player.pic_point.tags.trackPointId,
            imgOffset: {'x':data.geometry.xy[0], 'y':data.geometry.xy[1]},
            wayid: way.id
        }));
        isCreate = true;
    }else {
        way = context.entity(result._entityid);
        if(!way){
            return ;
        }
        isReplaceUpdate = way.nodes.length == 1;

        actions.push( iD.picUtil.replaceGeometryNode(way, node) );
        actions.push(iD.picUtil.measureinfoAction(node, {
            trackPointId: player.pic_point.tags.trackPointId,
            imgOffset: {'x':data.geometry.xy[0], 'y':data.geometry.xy[1]},
            wayid: way.id
        }));
    }
    actions.push(opts.actionText || "影像绘制。");

    var lastMkr = _.last(result._nodeList);
    if(lastMkr){
        lastMkr._entityid = node.id;
        lastMkr._dividerindex = isCreate ? way.nodes.length - 1 : way.nodes.length;
    }
    return {
        isReplaceUpdate: isReplaceUpdate,
        node,
    	actions: actions
    };
}
/**
 * 
 * @param {Shape} drawMark
 * @param {Object} geoData
 * @param {Object} opts
 * 		actionText: 当前action描述
 * 		modelName: 模型
 */
iD.svg.PicDrawUtil.drawPoint2Map = function(drawMark, geoData, opts = {}){
	var player = opts.player, context = opts.context;
	var drawTool = player.getDrawTool();
    var result = drawMark;
    var data = geoData;
    if(iD.picUtil.checkDrawGeoOutEditable(drawTool, result, data)){
    	return false;
    }
    var MODEL_NAME = opts.modelName;
    var actions = [];
    // 是否为replace操作
    var isReplaceUpdate = false;
    var actions = [], createdEntities = [];
    var modelEntity = iD.Layers.getCurrentModelEnableLayer(MODEL_NAME);
    if(!modelEntity){
        return ;
    }
    var location = data.geometry && [data.geometry.lng, data.geometry.lat, data.geometry.elevation] || data.location;
    var node = iD.Node({
        modelName: MODEL_NAME,
        identifier:modelEntity.identifier,
        layerId: modelEntity.id,
        loc: location
    });
	node.setTags(_.extend({}, iD.util.getDefauteTags(node, modelEntity), data.tags));
	
    if(result){
    	result.geoType = 1;
    	result._entityid = node.id;
    }
    
    actions.push(iD.actions.AddEntity(node));
    if(opts.measureType == 0){
    	// 普通点击
    	var xy = drawTool.reductionPoint(geoData.clickOffset);
        actions.push(iD.picUtil.measureinfoAction(node, {
            type: 0,
            trackPointId: player.pic_point.tags.trackPointId,
            imgOffset: {'x': xy[0], 'y': xy[1]}
        }));
    }else if(opts.measureType == 2){
    	// 通过PLANE计算
    	var xy = drawTool.reductionPoint(geoData.clickOffset);
    	actions.push(iD.picUtil.measureinfoAction(node, {
    	    trackPointId: player.pic_point.tags.trackPointId,
    	    imgOffset: {'x': xy[0], 'y': xy[1]}
    	}));
    }else if(opts.measureType == 1){
    	// 前方交会
	    actions.push(iD.picUtil.measureinfoAction(node, {
	    	type: 1,
	        datas: player.getIntersectionData().canvasList
	    }));
    }
    actions.push(opts.actionText || "绘制点");
    createdEntities.push(node.id);
    return {
    	isReplaceUpdate: isReplaceUpdate,
    	actions: actions,
    	createIds: createdEntities
    };
}

/**
 * 绘制多边形，点击一次绘制一个节点
 * @param {Shape} drawMark
 * @param {Object} geoData
 * @param {Object} opts
 * 		actionText: 当前action描述
 * 		modelName: 模型
 */
iD.svg.PicDrawUtil.drawPolygon2Map = function(drawMark, geoData, opts = {}){
	var player = opts.player, context = opts.context;
	var boardArea = opts.boardArea;
	var drawTool = player.getDrawTool();
    if(iD.picUtil.checkDrawGeoOutEditable(drawTool, drawMark, geoData)){
    	return false;
    }
    var WAY_MODEL_NAME = opts.wayModelName;
    var NODE_MODEL_NAME = opts.nodeModelName;
    var wayModelEntity = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
    var nodeModelEntity = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
    if(!wayModelEntity || !nodeModelEntity){
        return ;
    }
    // 是否为replace操作
    var isReplaceUpdate = false;
    var boardNodeCount = 0;
	var actions = [];
    var result = drawMark;
    var data = geoData;
	var location = data.geometry && [data.geometry.lng, data.geometry.lat, data.geometry.elevation] || data.location;
	
	result.geoType = 3;
    var modelEntity = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
    if(!modelEntity){
        return ;
    }
    var node = iD.Node({
        modelName: NODE_MODEL_NAME,
        layerId: modelEntity.id,
        identifier:modelEntity.identifier,
        loc: location
    });
    node.setTags(iD.util.getDefauteTags(node, modelEntity));
    // idx == 0  判断时，dataGeoList是多个坐标，drawMarkList是多个节点，将所有点生成entity
    // 一次一个点时，result是面本身，使用 !result._entity 条件；并且不能用 boardNodeCount-2 判断索引；
    if(!result._entityid){
        boardNodeCount = 2;
        var areaLayer = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
        boardArea = iD.Way({
            identifier:areaLayer.identifier,
            layerId: areaLayer.id,
            modelName: WAY_MODEL_NAME,
            nodes: []
        });
        boardArea.setTags(_.extend({}, iD.util.getDefauteTags(boardArea, areaLayer), opts.wayTags));
        actions.push(...[
            iD.actions.AddEntity(boardArea),
            iD.actions.AddEntity(node),
            iD.actions.AddVertex(boardArea.id, node.id),
            iD.actions.AddVertex(boardArea.id, node.id)
        ]);
        // result._entity = boardArea;
        result._entityid = boardArea.id;
    }else {
        boardNodeCount = 1;
        boardArea = context.entity(result._entityid);

        // 由于还未执行actions，第一次进入这里时
        // 点击第二个点，面的nodes [A, A]，执行action后 [A, B, A]
        // 点击第三个点，面的nodes [A, B, A]，执行action后 [A, B, C, A]
//                  isReplaceUpdate = boardArea.nodes.length == 2;
        isReplaceUpdate = boardArea.nodes.length <= 3;
        actions.push(...[
            iD.actions.AddEntity(node),
            iD.actions.AddVertex(boardArea.id, node.id, boardArea.nodes.length - 1)
        ]);
    }
    
	var xy = drawTool.reductionPoint(data.clickOffset);
    actions.push(iD.picUtil.measureinfoAction(node, {
        trackPointId: player.pic_point.tags.trackPointId,
        imgOffset: {'x': xy[0], 'y': xy[1]},
        wayid: boardArea.id
    }));
    actions.push(opts.actionText || "绘制面");

    result._entityid = boardArea.id;
    // 在entity中的index
    var lastMkr = result._nodeList && result._nodeList[result._nodeList.length - 1];
    if(boardNodeCount == 2){
        result._nodeList[0]._entityid = node.id;
        result._nodeList[0]._dividerindex = 0;
    }else if(lastMkr) {
        lastMkr._entityid = node.id;
        lastMkr._dividerindex = boardArea.nodes.length - 1;
    }
    // 多组actions执行时，不可能为replace
    return {
    	isReplaceUpdate: isReplaceUpdate,
    	actions: actions,
    	boardArea: boardArea
    };
}
/**
 * 绘制多边形，一次绘制所有节点
 * @param {Array<Shape>} drawMark 所有节点
 * @param {Array<Object>} geoData
 * @param {Object} opts
 * 		actionText: 当前action描述
 * 		modelName: 模型
 */
iD.svg.PicDrawUtil.drawFullPolygon2Map = function(drawMark, geoData, opts = {}){
	var player = opts.player, context = opts.context;
	var boardArea = opts.boardArea;
	var drawTool = player.getDrawTool();
    if(iD.picUtil.checkDrawGeoOutEditable(drawTool, drawMark, geoData)){
    	return false;
    }
    var WAY_MODEL_NAME = opts.wayModelName;
    var NODE_MODEL_NAME = opts.nodeModelName;
    var wayModelEntity = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
    var nodeModelEntity = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
    if(!wayModelEntity || !nodeModelEntity){
        return ;
    }
    
    var drawMarkList, dataGeoList;
    if(_.isArray(drawMark)){
        drawMarkList = drawMark;
        dataGeoList = geoData;
    }else {
        drawMarkList = [drawMark];
        dataGeoList = [geoData];
    }
    
    var boardArea = iD.Way({
        layerId: wayModelEntity.id,
        identifier:wayModelEntity.identifier,
        modelName: WAY_MODEL_NAME,
        nodes: []
    });
    boardArea.setTags(_.extend({}, iD.util.getDefauteTags(boardArea, wayModelEntity), opts.wayTags));
    var allActions = [
    	[iD.actions.AddEntity(boardArea)]
    ];
    
    var boardNodeCount = 0;
    for(var idx in drawMarkList){
        var result = drawMarkList[idx];
        var data = dataGeoList[idx];
        var actions = [];
        result.geoType = 3;
        
        var node = iD.Node({
            modelName: NODE_MODEL_NAME,
            layerId: nodeModelEntity.id,
            identifier:nodeModelEntity.identifier,
            loc: [data.geometry.lng, data.geometry.lat, data.geometry.elevation]
        });
        node.setTags(iD.util.getDefauteTags(node, nodeModelEntity));
        
        if(idx == 0){
            boardNodeCount += 2;
            actions.push(...[
                iD.actions.AddEntity(node),
                iD.actions.AddVertex(boardArea.id, node.id),
                iD.actions.AddVertex(boardArea.id, node.id)
            ]);
        }else {
            boardNodeCount += 1;
            actions.push(...[
                iD.actions.AddEntity(node),
                iD.actions.AddVertex(boardArea.id, node.id, idx)
            ]);
        }
		var xy = drawTool.reductionPoint(data.clickOffset);
        actions.push(iD.picUtil.measureinfoAction(node, {
            trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
            imgOffset: {'x': xy[0], 'y': xy[1]},
            wayid: boardArea.id
        }));
        actions.push(opts.actionText || "绘制面");

        result._entityid = node.id;
        // 在entity中的index
        result._dividerindex = boardNodeCount - 2;

        if(result._shape && !result._shape._entityid){
            var zrenderPolygon = result._shape;
            zrenderPolygon._entityid = boardArea.id;
        }
        
        allActions.push(actions);
   }
    // 多组actions执行时，不可能为replace
    return {
    	allActions: allActions,
    	boardArea: boardArea
    };
}
