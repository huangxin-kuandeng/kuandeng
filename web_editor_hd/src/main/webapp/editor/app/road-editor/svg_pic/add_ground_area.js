iD.svg.PicDraw = iD.svg.PicDraw || {};
// 地面区域
iD.svg.PicDraw.addGroundArea = function(context, drawTool){
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
			return constant.ADD_GROUND_AREA;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('地面区域')
                .attr('modelName',iD.data.DataType.OBJECT_PG)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){}, 
		/*
		domClickMore: function(){},
		domDblclickMore: function(){},
		*/
		domMousedown: function(evt, clickOffset){
            if(drawStatus.type != constant.ADD_GROUND_AREA) return false;
            context.buriedStatistics().merge(1,iD.data.DataType.OBJECT_PG);
			drawTool.zrenderDrawRectangeOnMap(clickOffset, false);
			return false;
		},
		domMouseup: function(evt, clickOffset, opts){
            if(drawStatus.type != constant.ADD_GROUND_AREA) return false;
            // 地面区域，拖拽过程中更新地图上的矩形，同时反投到视频上
            var entityid = drawTool.zrenderDrawRectangeOnMap(clickOffset, true);
            player.clearFooterButton();
            // 鼠标没有移动；
        	if(iD.picUtil.isPointEqual(opts.downOffset, clickOffset, 5)){
        		if(entityid && context.hasEntity(entityid)){
        			context.pop();
        			// drawTool.resetCanvas();
                }
                return false;
            }
            if(!context.transactionEditor()){
                var way = context.hasEntity(entityid);
                if(!way) return false;
                var firstNode = context.entity(way.first());
                if(!iD.util.justNodeInPlyGonx(firstNode,context)){
                    Dialog.alert('绘制面超出当前可编辑范围');
                    context.pop();
                    // player.resetCanvas();
                    return ;
                }
            }
            drawTool.event.add(entityid);
            context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PG);
			return false;
		},
		zrenderMove: function(evt, moveOffset, opts){
			// zrenderMove在绘制人行横道时，不能阻止后续的move操作
			if(drawStatus.type != constant.ADD_GROUND_AREA) return ;
			
            updateMoveMapEntityByGeometry([
                zrenderNodeStatus.downOffset,
                moveOffset
            ], {
                mouseup: opts.mouseup
            });
            if(opts.mouseup){
        		player.isPlayPic = true;
            }
            return false;
		},
		// 地面区域-节点拖拽，特殊处理
		dragEventMove: function(evt, moveOffset, opts){
			if(drawStatus.type) return ;
			// 是否是地面区域
			if(!iD.picUtil.checkNodeIsGroundArea(zrenderNodeStatus.downEntityid)){
				return ;
			}
            if(opts.isFirst){
                context.perform(iD.actions.Noop(), '');
            }
            updateMoveMapEntityByGeometry([
                zrenderNodeStatus.downOffset,
                moveOffset
            ], {
                moveEntityId: zrenderNodeStatus.downEntityid
            });
		},
		dragEventMoveend: function(evt, moveOffset, opts){
			if(drawStatus.type) return ;
			// 是否是地面区域
			if(!iD.picUtil.checkNodeIsGroundArea(zrenderNodeStatus.downEntityid)){
				return ;
			}
            updateMoveMapEntityByGeometry([
                zrenderNodeStatus.downOffset,
                moveOffset
            ], {
                moveEntityId : zrenderNodeStatus.downEntityid,
                mouseup: true
            });
            player.isPlayPic = true;
            
            zrenderNodeStatus.drawingEntityid = undefined;
            if(!context.transactionEditor()){
                var n = context.hasEntity(zrenderNodeStatus.downEntityid);
                if(!n) return false;
                var way = context.graph().parentWays(n)[0];
                var firstNode = context.entity(way.first());
                if(!iD.util.justNodeInPlyGonx(firstNode,context)){
                    Dialog.alert('拖动超出当前可编辑范围');
                    context.pop();
                    // player.resetCanvas();
                    return ;
                }
            }
            
            drawTool.event.change(zrenderNodeStatus.downEntityid);
		}
	});
    
    /**
     * 地面区域，绘制、拖拽，坐标计算逻辑；
     * zrenderMove时调用的，用于更新地图上的要素
     */
    function updateMoveMapEntityByGeometry(data, opts = {}){
        var allActions = [], isReplaceUpdate = false, updateEntityids = [];
        var moveNodeid = opts.moveEntityId, isMouseUp = opts.mouseup;
        var mRemoves = [], mAdds = [];

        if(drawStatus.type == constant.ADD_GROUND_AREA){
            var entityid = zrenderNodeStatus.drawingEntityid;
            if((isMouseUp && !entityid) || 
                (entityid && !context.hasEntity(entityid))){
                return ;
            }
            var actions = [];
            var rstData;
            if(!entityid){
                var _points = [
                    data[0],
                    data[1]
                ];
                var rectPoints = iD.picUtil.createRectangeBy2Point(_points);

                rstData = createMapEntityByGeometry({
                    geoList: _.map(rectPoints, function(p){
                        return iD.picUtil.pixelToLngLat(p);
                    })
                });
                actions = rstData.actions;
                updateEntityids = rstData.createdEntities;
                entityid = rstData.id;
                isReplaceUpdate = false;
                zrenderNodeStatus.drawingEntityid = entityid;
            }else {
                var boardArea = context.entity(entityid);
                var nodes = context.graph().childNodes(boardArea);

                var _points = [
                    data[0],
                    data[1]
                ];
                // 拖拽点
                var moveGeo = iD.picUtil.pixelToLngLat(data[1]);
//              var newAngle = _getTrackPointsAngle(nodes[0].loc, [moveGeo.lng, moveGeo.lat]);

                var rectPoints = iD.picUtil.createRectangeBy2Point(_points);
                // 计算出矩形四个点的坐标+z
                var lonlatList = iD.picUtil.createRectangleByGeo(_.map(rectPoints, function(p){
                    return iD.picUtil.pixelToLngLat(p);
                }));
                /*
                 lonlatList = _getRotatePolygonGeoList(_.map(lonlatList, function(lonlat){
                 return [lonlat.lng, lonlat.lat, lonlat.elevation];
                 }), newAngle);
                 */
                lonlatList = _.map(lonlatList, function(lonlat){
                    return [lonlat.lng, lonlat.lat, lonlat.elevation];
                });

                if(isMouseUp){
                    // 判断坐标是否在范围内
                    for(var idx in lonlatList){
                        var loc = lonlatList[idx];

                        if(context.transactionEditor() && drawTool.locationOutTaskEditable(loc, {pop: true})){
                            return false;
                        }
                    }

                    for(var nid of boardArea.nodes){
                        var point = drawTool.ZEUtil.getShapesByEid(nid)[0];
                        var xy = [];
                        if(point){
                            xy = iD.picUtil.shapeXY(point);
                            mAdds.push({
                                node: context.entity(nid),
                                xy: xy
                            });
                        }
                    }
                }
                for(var i = 0; i<lonlatList.length; i++){
                    var lonlat = lonlatList[i];
                    if(i == 0){
                        continue ;
                    }else if(i == 2){
                        actions.push( iD.actions.UpdateNode(context, nodes[i].move([moveGeo.lng, moveGeo.lat, moveGeo.elevation])) );
                        continue ;
                    }
//	    			actions.push( iD.actions.UpdateNode(context, nodes[i].move([lonlat.lng, lonlat.lat, lonlat.elevation])) );
                    actions.push( iD.actions.UpdateNode(context, nodes[i].move([lonlat[0], lonlat[1], lonlat[2]])) );
                }
                updateEntityids = _.uniq([boardArea.id].concat(boardArea.nodes));

                isReplaceUpdate = true;
            }
            zrenderNodeStatus.drawingEntityid = entityid;
            if(isMouseUp){
                var _entity = context.entity(entityid);
        		iD.logger.editElement({
                    'tag': "add_ground_area_end",
                    'entityId': _entity.osmId() || '',
                    'modelName': iD.data.DataType.OBJECT_PG,
                    'filter': iD.logger.getFilter(_entity, context)
                });
                for(var item of mAdds){
                    var xy = drawTool.reductionPoint(item.xy);
                    actions.push(iD.picUtil.measureinfoAction(item.node, {
                        trackPointId: player.pic_point.tags.trackPointId,
                        imgOffset: {'x':xy[0], 'y':xy[1]}
                    }));
                }
                for(var node of mRemoves){
                    actions.push(iD.picUtil.measureinfoAction(node, {
                        type: -1
                    }));
                }
            }
            if(actions.length && typeof actions[actions.length - 1] != 'string'){
                actions.push('更改地面区域');
            }
            allActions.push(actions);
        }else if(zrenderNodeStatus.drawingEntityid){
            var actions = [];
            // 拖拽 地面区域 节点
            var nowNode = context.entity(moveNodeid);
            var boardArea = context.entity(zrenderNodeStatus.drawingEntityid);
            var nodes = context.graph().childNodes(boardArea);
            var nowIndex = boardArea.nodes.indexOf(moveNodeid);
            if(nowIndex == -1 || nodes.length != 5){
                return ;
            }
            var crossIndex = _nodesIndex(nowIndex, 2);
            var crossNode = nodes[crossIndex];
            // -1：当前y，对角x
            // +1：当前x，对角y
            var prevIndex = _nodesIndex(nowIndex, -1);
            var prevNode = nodes[prevIndex];
            var nextIndex = _nodesIndex(nowIndex, 1);
            var nextNode = nodes[nextIndex];

            var nowGeo = iD.picUtil.pixelToLngLat(data[1]);
            /*
             let prevLoc = [crossNode.loc[0], nowGeo.lat, prevNode.loc[2]];
             let nowLoc = [nowGeo.lng, nowGeo.lat, nowGeo.elevation];
             let nextLoc = [nowGeo.lng, crossNode.loc[1], nextNode.loc[2]];

             //  		let newAngle = _getTrackPointsAngle(crossNode.loc, [nowGeo.lng, nowGeo.lat]);
             let newAngle = _getTrackPointsAngle(nodes[0].loc, nodes[2].loc);
             let lonlatList = _getRotatePolygonGeoList([crossNode.loc, prevLoc, nowLoc, nextLoc], 0);

             prevNode = prevNode.move(lonlatList[1]);
             nowNode = nowNode.move(nowLoc);
             nextNode = nextNode.move(lonlatList[3]);
             */
            // cross、prev、now、next -> ACDB
            // 使用UTM计算，直接小数参与运算会有精度缺失
            var projection = context.projection;
            var crossLoc = projection(crossNode.loc), oldPrevLoc = projection(prevNode.loc);
            // , nowGeo.elevation];
            var nowLoc = projection([nowGeo.lng, nowGeo.lat])
            // AC延长线与点D的垂足位置：temp
            var temp = [];
            var trst = iD.util.pedal([crossLoc[0], crossLoc[1], oldPrevLoc[0], oldPrevLoc[1]], nowLoc, temp);
            var prevLoc = [temp[0], temp[1]];
            // 点C相对于D的xy
            var prevDiffLoc = [prevLoc[0] - nowLoc[0], prevLoc[1] - nowLoc[1]];
            // 点B相对于A的xy，取反
            var nextLoc = [crossLoc[0] - prevDiffLoc[0], crossLoc[1] - prevDiffLoc[1]];

            crossLoc = crossNode.loc;
            prevLoc = projection.invert(prevLoc);
            prevLoc[2] = prevNode.loc[2];
            nowLoc = projection.invert(nowLoc);
            nowLoc[2] = nowGeo.elevation;
            nextLoc = projection.invert(nextLoc);
            nextLoc[2] = nextNode.loc[2];

            prevNode = prevNode.move(prevLoc);
            nowNode = nowNode.move(nowLoc);
            nextNode = nextNode.move(nextLoc);

            actions.push( iD.actions.UpdateNode(context, prevNode) );
            actions.push( iD.actions.UpdateNode(context, nowNode) );
            actions.push( iD.actions.UpdateNode(context, nextNode) );

            if(isMouseUp){
                var lonlatList = [crossLoc, prevLoc, nowLoc, nextLoc];
                // 判断坐标是否在范围内
                for(var idx in lonlatList){
                    var loc = lonlatList[idx];
                    if(drawTool.locationOutTaskEditable(loc, {pop: true})){
                        return false;
                    }
                }

                for(var nid of boardArea.nodes){
                    var point = drawTool.ZEUtil.getShapesByEid(nid)[0];
                    var xy = [];
                    if(point){
                        xy = iD.picUtil.shapeXY(point);
                        mAdds.push({
                            node: context.entity(nid),
                            xy: xy
                        });
                    }
                }

                for(var item of mAdds){
                    var xy = drawTool.reductionPoint(item.xy);
                    actions.push(iD.picUtil.measureinfoAction(item.node, {
                        trackPointId: player.pic_point.tags.trackPointId,
                        imgOffset: {'x':xy[0], 'y':xy[1]}
                    }));
                }
                for(var node of mRemoves){
                    actions.push(iD.picUtil.measureinfoAction(node, {
                        type: -1
                    }));
                }
                
        		iD.logger.editElement({
                   'tag': "drag_ground_area_end",
                   'modelName': nextNode.modelName,
                   'filter': iD.logger.getFilter(boardArea, context)
                });
            }

            actions.push('更改地面区域');

            updateEntityids = _.uniq([boardArea.id].concat(boardArea.nodes));
            isReplaceUpdate = true;
            allActions.push(actions);

            function _nodesIndex(index, diff){
                var diffend = index + diff;
                if(diffend>=0){
                    return diffend%4
                }else {
                    return 4 + index + diff;
                }
            }
        }

        allActions.length && drawTool._drawActionsPerform(allActions, isReplaceUpdate);
        drawTool.resetPointToPicPlayer(updateEntityids);
    }
    
    function createMapEntityByGeometry(data){
        var createdEntities = [], actions = [], returnParam = {};
        var pgModelEntity = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);
        var nodeModelEntity = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
        if(!pgModelEntity || !nodeModelEntity){
            return ;
        }
        var lonlatList = iD.picUtil.createRectangleByGeo(data.geoList || []);
        var nodeidList = [];
		
		var ntags = {
            TYPE: 3,
			// 地面区域
			SUBTYPE: 1
		};
        var boardArea = iD.Way({
            layerId: pgModelEntity.id,
            identifier:pgModelEntity.identifier,
            modelName: iD.data.DataType.OBJECT_PG,
            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.OBJECT_PG, pgModelEntity), ntags),
            nodes: []
        });
        iD.logger.editElement({
            'tag': "add_ground_area_start",
            'entityId':boardArea.osmId() || '',
            'modelName': boardArea.modelName,
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
        }
        actions.push(iD.actions.AddVertex(boardArea.id, nodeidList[0]));
        actions.push('绘制地面区域');
        
        createdEntities.push(boardArea.id);
        createdEntities.push(...nodeidList);

        returnParam.id = boardArea.id;

        return _.extend(returnParam, {
            createdEntities: createdEntities,
            actions: actions
        });
    }
    
    /*
     * 对角线正北夹角
     */
    function _getTrackPointsAngle(loc1, loc2){
        var defAngle = player.pic_point.tags.azimuth;
        var selectIndex = player.selectPicIndex;
        if(!player.allNodes[selectIndex + 1]){
            return defAngle;
        }
        var xdiff = player.allNodes[selectIndex + 1].loc[0] - player.allNodes[selectIndex].loc[0];
        // var crossTrackGeo = iD.util.clickPosForTrackPoint(loc1);
        // var moveTrackGeo = iD.util.clickPosForTrackPoint(loc2);
        var K = iD.AutoMatch.getParamK(player);
        var crossTrackGeo = iD.util.clickPosForTrackPoint2(player.pic_point, loc1, player.getCameraHeight(), K);
        var moveTrackGeo = iD.util.clickPosForTrackPoint2(player.pic_point, loc2, player.getCameraHeight(), K);
        var newAngle = defAngle;
        if(!_.isEqual(crossTrackGeo, moveTrackGeo)){
            var geo1 = crossTrackGeo, geo2 = moveTrackGeo, tempGeo;
            // 第一个点x最小
            if(geo1[0] > geo2[0]){
                tempGeo = geo1;
                geo1 = geo2;
                geo2 = tempGeo;
            }

            newAngle = iD.util.LineCalCulate().getAngle(geo1[0], geo1[1], geo2[0], geo2[1]);
        }

        return newAngle;
    }

    /**
     * 获取旋转后的多边形坐标
     * @param {Array} nodeLocs
     */
    function _getRotatePolygonGeoList(nodeLocs, newAngle){
        var projection = context.projection;
        var points = nodeLocs.map(function(loc) { return projection(loc); });
        var pivot = zrenderNodeStatus.areaPivot || d3.geom.polygon(points).centroid();
        var geoList = [], graph = context.graph(), angle = newAngle != null ? newAngle : player.pic_point.tags.azimuth;
        // 角度转弧度 π/180×角度
        angle = angle * Math.PI / 180;

        // 线与正北方向的夹角计算
        // iD.util.LineCalCulate().getAngle();

        nodeLocs.forEach(function(loc) {
            var point = projection(loc),
                radial = [0,0];

            radial[0] = point[0] - pivot[0];
            radial[1] = point[1] - pivot[1];

            point = [
                radial[0] * Math.cos(angle) - radial[1] * Math.sin(angle) + pivot[0],
                radial[0] * Math.sin(angle) + radial[1] * Math.cos(angle) + pivot[1]
            ];
            var newLoc = projection.invert(point);
            newLoc[2] = loc[2] || -1;

            geoList.push(newLoc);
        });

        return geoList;
    }
	
	return new drawPlus();
}
