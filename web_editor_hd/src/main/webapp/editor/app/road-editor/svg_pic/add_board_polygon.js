iD.svg.PicDraw = iD.svg.PicDraw || {};
// 路牌（多边形）
iD.svg.PicDraw.addBoardPolygon = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {}, zrenderNodeStatus;
    var secType, markVectorLoc, markVectorPoints;
   
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1, arg2){
			drawStatus = arg1;
			zrenderNodeStatus = arg2;
		},
		// 遍历操作时匹配类型
		check: function(btnType){
			if(btnType) return btnType == this.getId();
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.ADD_BOARD_POLYGON;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .attr('modelName',iD.data.DataType.TRAFFICSIGN)
                .text('路牌(多边形)')
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			secType = undefined;
			markVectorLoc = undefined;
			markVectorPoints = undefined;
		},
		// 路牌-节点拖拽，特殊处理
		dragEventMove: function(evt, moveOffset, opts){
			if(drawStatus.type) return ;
            if(opts.isFirst){
                context.perform(iD.actions.Noop(), '');
			} 
			if (!zrenderNodeStatus.drawingEntityid) return;
			var entity = context.entity(zrenderNodeStatus.drawingEntityid);
			if (entity.modelName != iD.data.DataType.TRAFFICSIGN) {
				return;
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
			// if(!iD.picUtil.checkNodeIsGroundArea(zrenderNodeStatus.downEntityid)){
			// 	return ;
			// }
			if (!zrenderNodeStatus.drawingEntityid) return;
			var entity = context.entity(zrenderNodeStatus.drawingEntityid);
			if (entity.modelName != iD.data.DataType.TRAFFICSIGN) {
				return;
			}
            updateMoveMapEntityByGeometry([
                zrenderNodeStatus.downOffset,
                moveOffset
            ], {
                moveEntityId : zrenderNodeStatus.downEntityid,
                mouseup: true
            });
            player.isPlayPic = true;

            let self = this;
            zrenderNodeStatus.drawingEntityid = undefined;
            if(!context.transactionEditor()){
                var n = context.hasEntity(zrenderNodeStatus.downEntityid);
                if(!n) return false;
                var way = context.graph().parentWays(n)[0];
                let nodes = context.graph().childNodes(way);
                nodes = nodes.reverse();//因为批量路牌截图功能，所以要保证显示框坐标为逆向方式传入，因为坑自动化是逆向坐标传入的。
				
                createSignpostTagEditor(way, nodes);

                var firstNode = context.entity(way.first());
                if(!iD.util.justNodeInPlyGonx(firstNode,context)){
                    Dialog.alert('拖动超出当前可编辑范围');
                    context.pop();
                    // player.resetCanvas();
                    return ;
                }
            }
            
            drawTool.event.change(zrenderNodeStatus.downEntityid);
		},
		/*
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domDblclickMore: function(){},
		*/
		buttonClick: function(evt, active, node){
			secType = active ? constant.MARK_VECTOR_POINT : undefined;
			drawStatus.secType = secType;
		},
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts = {}){
			if(secType) return ;
            
            // iD.logger.editElement({
            //     'tag': 'add_board_polygon',
            //     'modelName': iD.data.DataType.TRAFFICSIGN
            // });
			var self = this;
            if(!markVectorLoc || !markVectorLoc.length){
                Dialog.alert('绘制路牌之前需要获取第一个点的前方交会坐标');
                player.clearFooterButton();
                return false;
            }
            context.buriedStatistics().merge(1,iD.data.DataType.TRAFFICSIGN);
            
            var presult = drawTool.zrenderDrawPolygon(clickOffset, false);
            iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
            return false;
		},
		domClickMore: function(evt, clickOffset, data, point, point2, isMultPoints){
            if(!secType) return false;
            context.buriedStatistics().merge(1,iD.data.DataType.TRAFFICSIGN);
			var self = this;
        	var presult = drawTool.zrenderDrawPolygon(clickOffset, false);
            if(secType == constant.MARK_VECTOR_POINT && data.geometry){
                markVectorLoc = [data.geometry.lng, data.geometry.lat, data.geometry.elevation];
                // 判断坐标是否在范围内
                if(drawTool.locationOutTaskEditable(markVectorLoc)){
                    return false;
                }
                markVectorPoints = [point, point2];

                iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);

                drawStatus.secType = undefined;
                secType = undefined;
                return false;
            }
		},
		domDblclick: function(evt, clickOffset, opts = {}){
			if(secType) return false;
			var self = this;
            context.buriedStatistics().merge(0,iD.data.DataType.TRAFFICSIGN);
	        if(!markVectorLoc || !markVectorLoc.length){
	            Dialog('绘制路牌之前需要获取第一个点的前方交会坐标');
	            player.clearFooterButton();
	            return ;
            }
	        var shape = drawTool.zrenderDrawPolygon(clickOffset, true);
	        let geometryIsNaN = self.drawnAddPolygon(shape);
			
	        player.clearFooterButton();
            self.reset();
			
			if(!geometryIsNaN){
				Dialog.alert('绘制路牌转换经纬度时失败：NaN！');
				context.pop();
				return false;
			}

            let points = shape.shape.points;
            let isShun = iD.util.isCoordShun2(points);//当逆时针绘制牌子时，要将牌子左上角定位开始绘制位置，改为顺时针
            if (!isShun) {
                points = [
                    shape.shape.points[1],
                    shape.shape.points[0],
                    shape.shape.points[3],
                    shape.shape.points[2],
                    shape.shape.points[1]
                ]
            }
            
            iD.util.cutPic(points, shape._entityid, context);

            var entity  = context.hasEntity(shape._entityid);

      
            
            iD.logger.editElement({
               'tag': "add_board_polygon_end",
               'entityId':entity.osmId() || '',
               'modelName': entity.modelName,
               'type': "dblClick"
            });


            let _state = true;
            if(entity && !context.transactionEditor()){
                var locs = _.pluck(context.graph().childNodes(entity),'loc');
                var loc = iD.util.getCenterPoint(locs);
                if(iD.util.pointNotInPlyGonx(loc,context)){
                    Dialog.alert('绘制路牌不属于该任务范围内');
                    context.pop();
                    _state = false;
                    // player.resetCanvas();
                }
            }
            
            if(entity && _state){
                let state = iD.util.getNodesClockWise(player.allNodes,context.childNodes(entity));
                if(state === 1 ){
                    context.replace(
                        iD.actions.Reverse(entity.id),
                        '路牌逆时针顺序');
                }
            }
            drawTool.event.add(shape._entityid);
        	return false;
		},
        /**
         * 将shape的polygon面绘制到地图上
         */
        drawnAddPolygon: function(shape){
            var self = this;
            var pointList = _.cloneDeep(shape.shape.points);
            pointList = pointList.slice(0, pointList.length-1);
            // console.log('pointList:',pointList)
            var markerList = [], dataList = [];
            for(var point of pointList){
                var marker = drawTool.drawGeometryNodes(shape, {canvasOffset: point}, {
                    draggable: true
                });
//              marker.setStyle("fill", iD.picUtil.colorRGBA(220, 20, 60, 0.6));
                markerList.push(marker);
            }
            var fieldPlane = iD.picUtil.getEntityPlaneParam(markVectorLoc, player.selectPicIndex);
            if(fieldPlane){
                for(var clickPoint of pointList){
                    var xy = drawTool.reductionPoint(clickPoint);
                    var lonlats = iD.picUtil.pixelToLngLatByPlane(xy, fieldPlane);
                    var geometry = {};
                    geometry.lng = lonlats[0];
                    geometry.lat = lonlats[1];
                    geometry.elevation = lonlats[2];
					if( !geometry.lng || !geometry.lat || !geometry.elevation || isNaN(geometry.lng) || isNaN(geometry.lat) || isNaN(geometry.elevation) ){
						console.log(
							'clickPoint：',
							clickPoint,
							'xy：',
							xy,
							'lonlats：',
							lonlats
						)
						return false;
					}
                    dataList.push({geometry, clickOffset: clickPoint});
                }
            }

            drawGeometry2Map(markerList, dataList, {
            	tags: {
            		PLANE: fieldPlane
            	}
            });

            for(var marker of markerList){
                iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);
                drawTool._zrender.add(marker);
            }

            drawTool.clearWrongShapeAndEntity(shape);
			return true;
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

        if(zrenderNodeStatus.drawingEntityid){
            var actions = [];
            // 拖拽 路牌 节点
            var nowNode = context.entity(moveNodeid);
            var boardArea = context.entity(zrenderNodeStatus.drawingEntityid);
            var nodes = context.graph().childNodes(boardArea);
            var nowIndex = boardArea.nodes.indexOf(moveNodeid);
            if(nowIndex == -1 || nodes.length != 5){
                return ;
            }
            var crossIndex = _nodesIndex(nowIndex, 2);
            var crossNode = nodes[crossIndex];
            var prevIndex = _nodesIndex(nowIndex, -1);
            var prevNode = nodes[prevIndex];
            var nextIndex = _nodesIndex(nowIndex, 1);
            var nextNode = nodes[nextIndex];

			// var nowGeo = iD.picUtil.pixelToLngLat(data[1]);
			var planeStr = boardArea.tags.PLANE;
            let plane = planeStr.split(",").map(function(v){
                return Number(v);
            });
			var nowGeo;
            // var fieldPlane = iD.picUtil.getEntityPlaneParam([plane[1],plane[0],plane[2]], player.selectPicIndex);
            
            fieldPlane = boardArea.tags.PLANE;
            // console.log(fieldPlane)
            if(fieldPlane){
                var xy = drawTool.reductionPoint(data[1]);
                var lonlats = iD.picUtil.pixelToLngLatByPlane(xy, fieldPlane);
                nowGeo = lonlats;
			}
			
            var nowUtm = iD.util.LLtoUTM_(nowGeo[0], nowGeo[1]);
			var crossUtm = iD.util.LLtoUTM_(crossNode.loc[0], crossNode.loc[1]);
			var prevUtm = iD.util.LLtoUTM_(prevNode.loc[0], prevNode.loc[1]);
			var nextUtm = iD.util.LLtoUTM_(nextNode.loc[0], nextNode.loc[1]);

            // nowUtm.push(nowGeo[2]);
            // crossUtm.push(crossNode.loc[2]);
            // prevUtm.push(prevNode.loc[2]);
            // nextUtm.push(nextNode.loc[2]);


			var p1 = new THREE.Vector3(crossUtm.x, crossUtm.y, crossNode.loc[2]);
            var p2 = new THREE.Vector3(prevUtm.x, prevUtm.y, prevNode.loc[2]);
			var p3 = new THREE.Vector3(nextUtm.x, nextUtm.y, nextNode.loc[2]);

			var prevLoc = [], nextLoc = [];
			prevLoc = iD.util.pedal3D({x:nowUtm.x, y:nowUtm.y, z:nowGeo[2]},p1, p2);
       		nextLoc = iD.util.pedal3D({x:nowUtm.x, y:nowUtm.y, z:nowGeo[2]},p1, p3);

			crossLoc = [...iD.util.UTMtoLL_(crossUtm.x, crossUtm.y, nowUtm.zoneNumber),crossNode.loc[2]];
			nowLoc = [...iD.util.UTMtoLL_(nowUtm.x, nowUtm.y, nowUtm.zoneNumber),nowGeo[2]];
			prevLoc = [...iD.util.UTMtoLL_(prevLoc[0], prevLoc[1], prevUtm.zoneNumber),prevLoc[2]];
			nextLoc = [...iD.util.UTMtoLL_(nextLoc[0], nextLoc[1], nextUtm.zoneNumber),nextLoc[2]];


            prevNode = prevNode.move(prevLoc);
            nowNode = nowNode.move(nowLoc);
            nextNode = nextNode.move(nextLoc);
        
			
			
			// console.log('nowLoc', nowLoc);
			// console.log('prevLoc', prevLoc);
            // console.log('nextLoc', nextLoc);

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
                    }else if( !loc[0] || !loc[1] || !loc[2] || isNaN(loc[0]) || isNaN(loc[1]) || isNaN(loc[2]) ){
						context.pop();
						updateEntityids = _.uniq([boardArea.id].concat(boardArea.nodes));
						drawTool.resetPointToPicPlayer(updateEntityids);
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
				   'tag': "drag_board_polygon_end",
				   'entityId':boardArea.osmId() || '',
                   'modelName': nextNode.modelName,
                   'filter': iD.logger.getFilter(boardArea, context)
                });
            }

            actions.push('更改路牌');

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

    //修改路牌时，在批量路牌修改时用到
    function createSignpostTagEditor(entity, nodes){
        var locs = _.pluck(nodes, 'loc');

        let player = iD.picUtil.player;
        let picData = iD.AutoMatch.locsToPicPlayer(locs, player, null, player.pic_point.id);
        var arr = _.pluck(_.flatten(picData), 'coordinates');
        for(let i = 0; i < arr.length; i++) {
            arr[i] = arr[i][0];
        }
        arr = arr.reverse();
        iD.util.cutPic(arr, entity.id, context, true, false);
    }
	
	function drawGeometry2Map(drawMark, geoData, opts){
        var result = iD.svg.PicDrawUtil.drawFullPolygon2Map(drawMark, geoData, {
        	player: player,
        	context: context,
        	actionText: '绘制路牌',
        	nodeModelName: iD.data.DataType.TRAFFICSIGN_NODE,
        	wayModelName: iD.data.DataType.TRAFFICSIGN,
        	wayTags: opts.tags
        });
        if(!result) return false;
        var allActions = result.allActions;
        // 执行绘制
        if(allActions.length){
	        // 路牌第一个点是前方交会
	    	var firstid = drawMark[0]._entityid;
	    	var tempActions = [];
	    	tempActions.push(function(graph){
	    		let node = graph.entity(firstid);
	    		let measureinfo = iD.picUtil.measureinfoAction(node, {
	        	    type: 1,
	        	    datas: markVectorPoints || player.getIntersectionData().canvasList
	        	});
	        	return measureinfo(graph);
	    	});
	    	tempActions.push('绘制路牌');
	    	allActions.push(tempActions);
	    	
        	drawTool._drawActionsPerform(allActions, false);
        	return true;
        }
        return false;
    }
	
	return new drawPlus();
}
