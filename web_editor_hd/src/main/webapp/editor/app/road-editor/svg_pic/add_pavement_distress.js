/*
 * @Author: tao.w
 * @Date: 2019-11-27 14:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 18:16:26
 * @Description: 
 */

iD.svg.PicDraw = iD.svg.PicDraw || {};
// 病害面
iD.svg.PicDraw.addPavementDistress = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {}, zrenderNodeStatus;
	var boardArea;
	
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
			return constant.ADD_PAVEMENT_DISTRESS;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('病害')
                .attr('modelName',iD.data.DataType.PAVEMENT_DISTRESS)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			boardArea = undefined;
		},
        buttonCancel: function(evt, node){
            var shape = drawStatus.shape;
            if(!shape || !shape._entityid) return ;
            var entity = context.hasEntity(shape._entityid);
            if(!entity || entity.modelName != iD.data.DataType.PAVEMENT_DISTRESS) return ;
            // ABCA，少于三个节点的面会被清空，无效绘制；
            if(entity.nodes.length < 4) return ;
            this.drawEnd(entity);
            context.buriedStatistics().merge(0,iD.data.DataType.PAVEMENT_DISTRESS);
            iD.logger.editElement({
                'tag': "add_pavement_distress_end",
                'entityId': entity.osmId() || '',
                'modelName': entity.modelName,
                'type': "dblClick",
                'filter': iD.logger.getFilter(entity, context)
            });
        },
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
			var presult = drawTool.zrenderDrawPolygon(clickOffset, false);
			self.clickAddPolygon(presult, clickOffset, false);
			context.buriedStatistics().merge(1,iD.data.DataType.PAVEMENT_DISTRESS);
            return false;
        },
        drawEnd:function(entity){
            if(!entity) return ;
            let nodes = context.childNodes(entity);
            let locs = _.pluck(nodes,'loc')
            var polygon = turf.polygon([locs]);
            var area = turf.area(polygon);
            context.replace(iD.actions.ChangeTags(entity.id, {
                AREA: area
            }),'area');
        },
		domDblclick: function(evt, clickOffset){
            var self = this;
			var shape = drawTool.zrenderDrawPolygon(clickOffset, true);
            var isok = self.clickAddPolygon(shape, clickOffset, true);
            if(shape._entityid){
                let entity = context.hasEntity(shape._entityid);
                this.drawEnd(entity);
            }
            context.buriedStatistics().merge(1,iD.data.DataType.PAVEMENT_DISTRESS);
			isok && player.clearFooterButton();
			self.reset();
        	return false;
		},
	    clickAddPolygon: function(shape, clickOffset, isDbclick = false){
            var self = this;
            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var isNew = shape._entityid ? false : true;
            var marker = drawTool.drawGeometryNodes(shape, {canvasOffset:clickOffset}, {
                draggable: true
            });
            drawGeometry2Map(shape, {geometry, clickOffset});
            iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);
            // // 绘制检查，flag=false为绘制失败
            var flag = true;
            // var flag = iD.svg.PicDrawUtil.clickAddPolygonAfter(shape, drawStatus, isDbclick, {
            // 	isContinue: true,
            // 	player: player,
            // 	marker: marker
            // });
            
            if(flag && !context.transactionEditor()){
                var firstNode = editor.getEntity(marker._entityid);
                // 	_type = "";
	            // if(isDbclick){
	            // 	_type = "dblClick";
                // }
                let _n = context.hasEntity(marker._entityid);
                var _w = context.hasEntity(shape._entityid);
                var log_obj;
                if(isNew){
                    log_obj = {
                        'tag': 'add_pavement_distress_start', 
                        'entityId':_w.osmId() || '',
                        'modelName': _w.modelName,
                        'filter': iD.logger.getFilter(_w, context)
                    }
                    iD.logger.editElement(log_obj);
                } 
                log_obj = {
                    'tag': 'add_pavement_distress', 
                    'entityId': _n.osmId() || '',
                    'parentId': _w.osmId() || '',
                    'coordinate': _n.loc || [],
                    'modelName': _n.modelName,
                    'filter': iD.logger.getFilter(_w, context)
                }
                iD.logger.editElement(log_obj);

                if(isDbclick){
                    iD.logger.editElement({
                        'tag': "add_pavement_distress_end",
                        'entityId': _w.osmId() || '',
                        'modelName': _w.modelName,
                        'type': "dblClick",
                        'filter': iD.logger.getFilter(_w, context)
                    });
	              
                }
                
        	 
                if(!iD.util.justNodeInPlyGonx(firstNode,context)){
                    Dialog.alert('面超出当前可编辑范围');
                    context.pop();
                    // player.resetCanvas();
                    var way =  context.hasEntity(shape._entityid)
                    if((way && way.nodes<=2) || !way){
                        drawTool.clearZRenderNodeStatus();
                        drawStatus.shape = null;
                        drawTool.resetCanvas();
                        self.reset();
                    }
                    return ;
                }
            }
            if(isDbclick && flag){
                drawTool.event.add(shape._entityid);
            }
            return flag;
        }
	});
	
	function drawGeometry2Map(drawMark, geoData){
        var result = iD.svg.PicDrawUtil.drawPolygon2Map(drawMark, geoData, {
        	player: player,
        	context: context,
        	actionText: '绘制病害',
        	nodeModelName: iD.data.DataType.PAVEMENT_DISTRESS_NODE,
        	wayModelName: iD.data.DataType.PAVEMENT_DISTRESS,
        	boardArea: boardArea,
        	wayTags: {
                TYPE: 3,
                SUBTYPE: 7
            }
        });
        if(!result) return false;
        var isReplaceUpdate = result.isReplaceUpdate;
        var actions = result.actions;
        boardArea = result.boardArea;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], isReplaceUpdate);
        	return true;
        }
        return false;
    }

	return new drawPlus();
}
