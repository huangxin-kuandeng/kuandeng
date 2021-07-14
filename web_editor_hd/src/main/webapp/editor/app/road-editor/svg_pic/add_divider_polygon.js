iD.svg.PicDraw = iD.svg.PicDraw || {};
// 导流带
iD.svg.PicDraw.addDividerPolygon = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {}, zrenderNodeStatus;
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1, arg2){
			drawStatus = arg1;
			zrenderNodeStatus = arg2;
		},
		// 遍历操作时匹配类型
		check: function(){
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.ADD_DIVIDER_POLYGON;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('导流带')
                .attr('modelName',iD.data.DataType.OBJECT_PG)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){},
		/*
		domClickMore: function(){},
		domDblclickMore: function(){},
		*/
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts){
			var self = this;
            drawTool.zrenderDrawpolyline(clickOffset, false);
            context.buriedStatistics().merge(1,iD.data.DataType.OBJECT_PG);
        	iD.logger.editElement({
                'tag': "add_divider_polygon",
                'modelName': iD.data.DataType.OBJECT_PG
                // 'filter': iD.logger.getFilter(_w, context)
            });
            return false;
		},
		domDblclick: function(evt, clickOffset){
			var self = this;
            var shape = drawTool.zrenderDrawpolyline(clickOffset, true);
            context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PG);
			drawTool._zrender.remove(shape);
            var locs = shape.shape.points;
            createDividerPolygon(locs);
            player.clearFooterButton();
        	return false;
		}
	});
	
    /**
     * 生成导流带
     * @param {Array} locs
     */
    function createDividerPolygon(locs) {
        var intersectLoc = null,
            boundsObj = iD.picUtil.getBoundsByLine(locs),
            path = boundsObj.path,
            bounds = boundsObj.bounds,
            allEntities = context.intersects(bounds);

        var ways = [];
        for(var j = 0; j < allEntities.length; j++) {
            var entity = allEntities[j];
            if (entity.modelName == iD.data.DataType.DIVIDER) {
                ways.push(entity);
            }
        }

        if(ways.length > 1) {
            var graph = context.graph(),
                projection = context.projection,
                intersectWays = [];//判断两条车道线是否与绘制线相交
            var isOutBounds = false;
            var addedEntityIds = [];
            //获取相交线，多组相交线时只留最后一组
            for (var w = 0; w < ways.length; w+=2) {
                var first = ways[w];
                var second = ways[w + 1];
                
                var eP1 = iD.util.getSegmentIntersectLoc(path, _.pluck(graph.childNodes(first), 'loc'));//获取第一条车道线相交点
                if (eP1.length != 0) {
                    intersectWays.push({
                        way: first,
                        intersectLoc: projection(eP1[0])
                    })
                }
                if (second) {
                    var eP2 = iD.util.getSegmentIntersectLoc(path, _.pluck(graph.childNodes(second), 'loc'));//获取第一条车道线相交点
                    if (eP2.length != 0) {
                        intersectWays.push({
                            way: second,
                            intersectLoc: projection(eP2[0])
                        })
                    }
                }
            }

            for (var i = 0; i < intersectWays.length; i++) {
                var obj1 = intersectWays[i];
                var obj2 = intersectWays[i + 1];
                if (obj2) {
                    var first = obj1.way;
                    var second = obj2.way;

                    var sameNodeId = iD.util.hasSameNode(first, second),
                        intersectLoc = null;
                    if (sameNodeId) {
                        var e = graph.entity(sameNodeId);
                        intersectLoc = e.loc;
                    } else {
                        intersectLoc = iD.util.getIntersectLocByNodes(first.nodes, second.nodes, context.graph())[0];
                    }
                    if (intersectLoc) {
                        var vertex_px = projection(intersectLoc);
                        var endPoint1_px = obj1.intersectLoc;
                        var endPoint2_px = obj2.intersectLoc;

                        var firstNodes = graph.childNodes(first);
                        var secondNodes = graph.childNodes(second);

                        var e1 = iD.geo.chooseEdge(firstNodes, vertex_px, projection);
                        var e2 = iD.geo.chooseEdge(firstNodes, endPoint1_px, projection);
                        var e3 = iD.geo.chooseEdge(secondNodes, endPoint2_px, projection);

                        var f_node_e1 = firstNodes[e1.index - 1];
                        var t_node_e1 = firstNodes[e1.index];
                        var vertexTem = iD.util.getBetweenPointLoc(f_node_e1.loc, t_node_e1.loc, e1.loc);//根据

                        var vertex = {
                            lng: vertexTem[0],
                            lat: vertexTem[1],
                            elevation: vertexTem[2]
                        }

                        var f_node_e2 = firstNodes[e2.index - 1];
                        var t_node_e2 = firstNodes[e2.index];
                        var endPointTem1 = iD.util.getBetweenPointLoc(f_node_e2.loc, t_node_e2.loc, e2.loc);

                        var endPoint1 = {
                            lng: endPointTem1[0],
                            lat: endPointTem1[1],
                            elevation: endPointTem1[2]
                        }

                        var f_node_e3 = secondNodes[e3.index - 1];
                        var t_node_e3 = secondNodes[e3.index];
                        var endPointTem2 = iD.util.getBetweenPointLoc(f_node_e3.loc, t_node_e3.loc, e3.loc);

                        var endPoint2 = {
                            lng: endPointTem2[0],
                            lat: endPointTem2[1],
                            elevation: endPointTem2[2]
                        }

                        // 任意节点超出作业范围
                        let lonlatOut = false;
                        if(!context.transactionEditor()){
                            var firstNode = context.entity(first.first());
                            for(let lonlat of [vertex, endPoint1, endPoint2]){
                                if(!iD.util.justNodeInPlyGonx({
                                    loc: [lonlat.lng, lonlat.lat, lonlat.elevation]
                                }, context)){
                                    lonlatOut =  true;
                                    break;
                                }
                            }
                        }
                        if(lonlatOut){
                            isOutBounds = true;
                            continue;
                        }

                        var rstData = createMapEntityByGeometry({
                            geoList: [vertex, endPoint1, endPoint2],
                            nodesList: [
                            	[f_node_e1, t_node_e1],
                            	[f_node_e2, t_node_e2],
                            	[f_node_e3, t_node_e3]
                            ]
                        });

                        var actions = rstData.actions, allActions = [],
                            updateEntityids = rstData.createdEntities,
                            // entityid = rstData.id,
                            isReplaceUpdate = false;
                        // zrenderNodeStatus.drawingEntityid = entityid;
                        allActions.push(actions);
                        allActions.length && drawTool._drawActionsPerform(allActions, isReplaceUpdate);
                        addedEntityIds.push(...updateEntityids);
                    }
                }
            }
            // addedEntityIds
            addedEntityIds.length && drawTool.resetPointToPicPlayer(addedEntityIds);
            if(isOutBounds && !addedEntityIds.length){
                Dialog.alert('导流带超出当前可编辑范围');
            }
        } else {
            Dialog.alert('请相交于两条车道线！');
        }
        if(addedEntityIds.length){
            drawTool.event.add(addedEntityIds[0]);
        }
    }
    
	function createMeasureinfoAction(node, xy, trackPoint){
		return iD.picUtil.measureinfoAction(node, {
            trackPointId: trackPoint.id,
            trackId: trackPoint.tags.trackId,
            imgOffset: {
            	'x': xy[0], 
            	'y': xy[1]
        	}
        });
	}
    
    function createMapEntityByGeometry(data){
        var createdEntities = [], actions = [], returnParam = {};
        var pgModelEntity = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);
        var nodeModelEntity = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
        if(!pgModelEntity || !nodeModelEntity){
            return ;
        }
        var lonlatList = data.geoList;
        var nodesList = data.nodesList;
        var nodeidList = [];
		var ntags = {
            TYPE: 3,
            // 导流带
            SUBTYPE: 9
		}
        var boardArea = iD.Way({
            layerId: pgModelEntity.id,
            identifier:pgModelEntity.identifier,
            modelName: iD.data.DataType.OBJECT_PG,
            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.OBJECT_PG, pgModelEntity), ntags),
            nodes: []
        });
        
        iD.logger.editElement({
            'tag': "add_divider_polygon_end",
            'modelName': iD.data.DataType.OBJECT_PG,
            'type': "dblClick",
            'filter': iD.logger.getFilter(boardArea, context)
        });
        actions.push(iD.actions.AddEntity(boardArea));

        for(var i = 0; i<lonlatList.length; i++){
            var lonlat = lonlatList[i];
            var node = iD.Node({
                modelName: iD.data.DataType.OBJECT_PG_NODE,
                layerId: nodeModelEntity.id,
                identifier:nodeModelEntity.identifier,
                tags: iD.util.getDefauteTags(iD.data.DataType.OBJECT_PG_NODE, nodeModelEntity),
                loc: [lonlat.lng, lonlat.lat, lonlat.elevation]
            });
            actions.push(iD.actions.AddEntity(node));
            actions.push(iD.actions.AddVertex(boardArea.id, node.id));
            nodeidList.push(node.id);
            
            // 量测信息补充
            var measure = iD.actions.createDividerNodeMeasureinfo(node.loc).getLineSegmentResult(context.graph(), nodesList[i]);
            if(measure){
            	actions.push(createMeasureinfoAction(node, measure.xy, measure.point));
            }
        }
        actions.push(iD.actions.AddVertex(boardArea.id, nodeidList[0]));
        actions.push('绘制导流带');
        
        createdEntities.push(boardArea.id);
        createdEntities.push(...nodeidList);

        returnParam.id = boardArea.id;

        return _.extend(returnParam, {
            createdEntities: createdEntities,
            actions: actions
        });
    }
    
	return new drawPlus();
}
