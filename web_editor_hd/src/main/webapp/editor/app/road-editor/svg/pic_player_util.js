/*
 * @Author: tao.w
 * @Date: 2019-08-29 22:43:12
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-21 14:14:39
 * @Description: 
 */
iD.picUtil = {
	player: null, // pic-player对象
	context: null
};

iD.picUtil.colorRGBA = function (r, g, b, alpha){
	alpha = alpha == null ? 0.4 : alpha;
	return iD.util.colorRGBA(r, g, b, alpha);
};

/**
 * 获取DIVIDER、DIVIDER_NODE对应的值，融合库与编辑库不一样
 */
iD.picUtil.getModelNameParam = function(){
	var modelNameParam = {
    	DIVIDER: iD.data.DataType.DIVIDER,
    	DIVIDER_NODE: iD.data.DataType.DIVIDER_NODE,
    	OBJECT_PT: iD.data.DataType.OBJECT_PT,
    	OBJECT_PG: iD.data.DataType.OBJECT_PG,
    	PAVEMENT_DISTRESS: iD.data.DataType.PAVEMENT_DISTRESS,
    	OBJECT_PG_NODE: iD.data.DataType.OBJECT_PG_NODE,
    	PAVEMENT_DISTRESS_NODE: iD.data.DataType.PAVEMENT_DISTRESS_NODE,
    	PAVEMENT_DISTRESS_PL_NODE: iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE,
    	OBJECT_PL: iD.data.DataType.OBJECT_PL,
    	OBJECT_PL_NODE: iD.data.DataType.OBJECT_PL_NODE,
    	BARRIER_GEOMETRY: iD.data.DataType.BARRIER_GEOMETRY,
    	BARRIER_GEOMETRY_NODE: iD.data.DataType.BARRIER_GEOMETRY_NODE,
    	TRAFFICSIGN: iD.data.DataType.TRAFFICSIGN,
    	TRAFFICSIGN_NODE: iD.data.DataType.TRAFFICSIGN_NODE,
    	BRIDGE: iD.data.DataType.BRIDGE,
    	BRIDGE_NODE: iD.data.DataType.BRIDGE_NODE,
    	LIMITHEIGHT: iD.data.DataType.LIMITHEIGHT,
    	TRAFFICLIGHT: iD.data.DataType.TRAFFICLIGHT,
    	TRAFFICLIGHT_NODE: iD.data.DataType.TRAFFICLIGHT_NODE,
    	LAMPPOST: iD.data.DataType.LAMPPOST,
    	CHECK_TAG: iD.data.DataType.CHECK_TAG,
    	IMAGE_TAG: iD.data.DataType.IMAGE_TAG,
    	ROAD_ATTRIBUTE: iD.data.DataType.ROAD_ATTRIBUTE,
    	ANALYSIS_TAG: iD.data.DataType.ANALYSIS_TAG,
    	QUESTION_TAG: iD.data.DataType.QUESTION_TAG,
    	AUTO_NETWORK_TAG: iD.data.DataType.AUTO_NETWORK_TAG,
    	QUALITY_TAG: iD.data.DataType.QUALITY_TAG,
    	PICK_MARK_TAG: iD.data.DataType.PICK_MARK_TAG
    };

    return modelNameParam;
};

/**
 * 拖动元素和对应轨迹点高程匹配是否大于3， 大于3米不让拖动。  返回true为可以拖动
 * @param entity
 * @returns {boolean}
 */
iD.picUtil.canNotDrag  = function(entity){
	if(!iD.util.currentTrackPointDis.length){
		return true;
	}
    let dist = iD.util.pt2LineDist(iD.util.currentTrackPointDis,entity.loc);
	let index = this.player.selectPicIndex+dist.i-1;
	if(index < 0){
		index = 0;
	}
	let node = this.player.allNodes[index];
	if(!node || !entity){
		return false;
	}

	return Math.abs(node.loc[2]-entity.loc[2])<3;
}

/**
 * 需要在 zrender.addShape之前调用
 * 根据entity属性更改zrender绘制的图形的style（颜色等）
 * @param {ZRenderShape} shape
 * @param {String} entityid
 */
iD.picUtil.updateZrenderStyleByEntity = function(shape, entityid){
	var self = this;
	var param = iD.picUtil.getEntityToShapStyle(entityid, shape && {
		shape: shape.shape,
		style: shape.style
	});
    if(shape.style){
        _.extend(shape.style, param.style)
    }else{
        shape.style = param.style;
    }
    if(param.shape && shape.shape){
    	_.extend(shape.shape, param.shape);
    }
    if(shape.attr && param.position){
    	shape.attr('position', param.position);
    }
    
    var graph = self.context.graph();
    var player = self.player;
    var isDashed = player.getDrawTool().isDashedLineMode();
    var eid = shape._entityid || entityid;
    if(!eid || !isDashed) return ;
    var node = graph.hasEntity(eid);
	// 虚线模式渲染时，之前的节点是终点/起点的情况，终点-中间点 隐藏中间点，起点-中间点 正常渲染
    if(!node || node.modelName != iD.data.DataType.DIVIDER_NODE) return ;
    // 起终点以外的点都当作中间点逻辑处理
    if(node.tags.DASHTYPE == '1' || node.tags.DASHTYPE == '2') return ;
    var way = graph.parentWays(node)[0];
    var index = way.nodes.indexOf(node.id);
    var flag = false;
    for(var i = index - 1; i >= 0; i--){
    	var pnode = graph.entity(way.nodes[i]);
    	if(pnode.tags.DASHTYPE == '2' || pnode.tags.DASHTYPE == '1'){
    		// 终点后的 中间点/实线/强制打断点 隐藏
    		flag = pnode.tags.DASHTYPE == '2';
    		break;
    	}
    }
    if(flag){
    	shape.invisible = true;
//  	console.log('隐藏中间点', entityid);
    }
}

/**
 * 根据entityid 设置样式
 * @param {String} entityid
 * @param {Object} param shape的style、shape
 */
iD.picUtil.getEntityToShapStyle = function(entityid, param){
	param = param || {};
	// var self = this;
	// let modelNameParam = self.getModelNameParam();
	let context = this.context;
	let result = {
		style: {},
		shape: {}
	};

	let entity = context.hasEntity(entityid);
	if(!entity){
		return result;
	}
	if(entity.modelName == iD.data.DataType.DIVIDER){
		let type, lineColor;
        let lay = context.layers(entity.layerId);
        if (lay && !lay.useEditColor && lay.defaultColor) {
            type = "-1";
        } else {
            let relation = iD.util.getDividerParentRelation(context.graph(), entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
            type = relation && relation.tags.TYPE;
            type = type == null ? "0" : type+"";
        }

        let dashColor = 'rgba(255, 201, 87, 0.8)';
		let solidColor = 'rgba(0, 187, 255, 0.6)';
		switch (type){
			case "1":
				// 车行道边缘线
				lineColor = 'rgba(255, 192, 203, 0.8)';
				break;
			case "2":
				// 白虚线
				lineColor = dashColor;
				break;
			case "3":
				// 白实线
				lineColor = solidColor;
				break;
			case "4":
				// 公交专用车道线
				lineColor = 'rgba(193, 128, 255, 0.8)';
				break;
			case "5":
				// 道路出入口标线
				lineColor = 'rgba(127, 128, 0, 0.8)';
				break;
			case "9":
				// 黄虚线
				lineColor = dashColor;
				break;
			case "10":
				// 黄实线
				lineColor = solidColor;
				break;
			case "11":
				// 纵向减速标线
				lineColor = 'rgba(33, 128, 192, 0.6)';
				break;
			case "12":
				// 双黄虚线
				lineColor = dashColor;
				break;
			case "13":
				// 双黄实线
				lineColor = solidColor;
				break;
			case "14":
				// 白左实右虚线
			case "15":
				// 黄左实右虚线
			case "16":
				// 白右实左虚线
			case "17":
				// 黄右实左虚线
				lineColor = solidColor;
				break;
			case "19":
				// 路缘石
			case "20":
				// 墙
			case "21":
				// 隧道墙
			case "22":
				// 屏障
			case "23":
				// 隔音屏障
			case "24":
				// 线缆屏障
			case "25":
				// 防护栏
			case "26":
				// 栅栏
			case "31":
				// 其他屏障
				lineColor = 'rgba(128, 0, 0, 0.8)';
				break;
			case "34":
			case "35":
				// 粉色
				lineColor = 'rgba(255, 192, 203, 0.8)';
				break;
			default:
//				let lay = entity.layerInfo();
				lineColor = lay && lay.defaultColor || solidColor;
				break;
		}
		result.style.stroke = lineColor;

	}else if(entity.modelName == iD.data.DataType.DIVIDER_NODE){
		// 0实线-白色，1起点-青蓝色，2终点-深蓝色，3-中间点-白色，4-强制打断点-绿色
		let type = entity.tags.DASHTYPE;

		let colorArr = [
			'rgba(255, 255, 255, 0.4)',
			'rgba(18, 249, 255, 0.8)',
			'rgba(0, 107, 255, 0.8)',
			'rgba(255, 255, 255, 0.4)'
//			'rgba(90, 255, 90, 0.8)'
		];
		let strokeArr = [
			'rgba(0, 0, 0, 1)',
			'rgba(18, 249, 255, 0.4)', 
			'rgba(0, 107, 255, 0.4)',
			'rgba(0, 0, 0, 1)'
//			'rgba(0, 127, 0, 1)'
		];

		let color = colorArr[type] || colorArr[0];
		let stroke = strokeArr[type] || strokeArr[0];

		if(this.isEffectDANode(entity.id)){
			if(result.shape.r){
				result.shape.r *= 1.2;
			}
			color = 'rgba(220, 20, 60, 0.8)';
			stroke = 'rgba(0, 0, 0, 0.8)';
		}else if(this.isEffectLANode(entity.id)){
			var height, width;
			if(result.style.width){
				width = result.style.width *= 1.2;
			}
			if(result.style.height){
				height = result.style.height *= 1.2;
			}
			if(width || height){
				result.position = [-width/2, -height/2];
			}
			color = 'rgba(18, 249, 255, 0.8)';
			stroke = 'rgba(0, 81, 255, 0.8)';
			result.style.lineWidth = 2;
		}else if(this.isEffectMeasureInfoNode(entity.id)){
			var height, width;
			if(result.style.width){
				width = result.style.width *= 1.2;
			}
			if(result.style.height){
				height = result.style.height *= 1.2;
			}
			if(width || height){
				result.position = [-width/2, -height/2];
			}
			color = 'rgb(210,105,30)';
			stroke = 'rgb(210,105,30)';
			result.style.lineWidth = 2;
		}else if(iD.picUtil.isEffectBreakTypeNode(entity.id)){
			color = 'rgba(90, 255, 90, 0.8)';
			stroke = 'rgba(0, 127, 0, 1)';
			if(result.shape.r){
				result.shape.r *= 1.2;
			}
		}else if(iD.picUtil.isEffecFlagTypeNode(entity.id)){
			color = 'rgba(90, 255, 90, 0.8)';
			stroke = 'rgba(0, 127, 0, 1)';
			if(result.shape.r){
				result.shape.r *= 1.2;
			}
		}

		result.style.fill = color;
		result.style.stroke = stroke;
	}else if(entity.modelName == iD.data.DataType.HD_LANE){
		result.style.stroke = 'rgba(255, 0, 0, 0.6)';
    }else if(entity.modelName == iD.data.DataType.HD_LANE_NODE){
		result.style.fill = 'rgba(255, 0, 0, 0.6)';
		result.style.stroke = 'rgba(0, 0, 0, 0.8)';
	}else if(iD.data.DataType.LAMPPOST == entity.modelName){
		// 1灯杆-灰绿色，2灯头-亮绿色
		if(entity.tags.TYPE == 2){
            result.style.stroke = 'rgba(0, 255, 0, 0.8)';
		}else if(entity.tags.TYPE == 1){
            result.style.stroke = 'rgba(114, 226, 114, 0.8)';
		}
	}else if(iD.data.DataType.OBJECT_PT == entity.modelName){
        result.style.stroke = 'rgba(0, 255, 0, 0.8)';
        result.style.fill = 'rgba(0, 255, 0, 0.8)';

    }else if(entity.modelName == iD.data.DataType.OBJECT_PG){
		result.style.fill = 'rgba(220, 20, 60, 0.2)';
        result.style.stroke = 'rgba(220, 20, 60, 0.2)'
	}else if(entity.modelName == iD.data.DataType.TRAFFICSIGN_NODE){
		result.shape.r = 4;
	}else if(entity.modelName == iD.data.DataType.LIMITHEIGHT){
		result.style = {
            fill : 'rgba(0, 255, 0, 0.8)',
            stroke : 'rgba(0, 0, 0, 0)',
            lineWidth: 0
		};
	}else if(entity.modelName == iD.data.DataType.TRAFFICLIGHT){
		//result.style.stroke = 'rgba(0, 255, 0, 0.8)';
        result.style.fill = 'rgba(220, 20, 60, 0.2)';
        result.style.stroke = 'rgba(220, 20, 60, 0.2)';
	}else if(entity.modelName == iD.data.DataType.CHECK_TAG){
		result.style.fill = 'rgba(255, 200, 0, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if(entity.modelName == iD.data.DataType.QUALITY_TAG){
		result.style.fill = 'rgba(255, 200, 0, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if(entity.modelName == iD.data.DataType.IMAGE_TAG){
		result.style.fill = 'rgba(255, 0, 255, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if(entity.modelName == iD.data.DataType.ANALYSIS_TAG){
		result.style.fill = 'rgba(0, 213, 255, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if(entity.modelName == iD.data.DataType.QUESTION_TAG){
		result.style.fill = 'rgba(255, 0, 0, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if(entity.modelName == iD.data.DataType.AUTO_NETWORK_TAG){
		result.style.fill = 'rgba(255, 0, 0, 0.8)';
		if(param.shape && param.shape.r){
			result.shape.r = param.shape.r * 1.5;
			if(result.shape.r > 8){
				result.shape.r = 8;
			}
		}
	}else if([
        iD.data.DataType.SEARCH_POINT,
        iD.data.DataType.PLACENAME
    ].includes(entity._type)){
        var colortype = entity.tags && entity.tags.colortype || 1;
        var color = 'rgba(255, 0, 0, 0.4)';
        switch (colortype){
        	case 1:
        		color = 'rgba(255, 0, 0, 0.4)';
        		break;
        	case 2:
        		color = 'rgba(0, 255, 0, 0.4)';
        		break;
        	case 3:
        		color = 'rgba(0, 0, 255, 0.4)';
        		break;
        }
        result.style.fill = color;
        if(context.variable.hideTrackControlPoint){
            result.ignore = true;
        }
	}else if(entity.modelName == iD.data.DataType.ROAD_ATTRIBUTE){
		result.style.fill = 'rgba(0, 187, 255, 1)';
	}else if(entity.modelName == iD.data.DataType.BARRIER_GEOMETRY){
        var lineColor = 'rgba(0, 0, 255, 0.8)';
        if(entity.tags.TYPE == '1'){
            lineColor = 'rgb(255, 255, 0, 0.8)';
        }
		result.style.stroke = lineColor;
    }else if(entity.modelName == iD.data.DataType.ROAD_FACILITIES){
		result.style.fill = 'rgba(220, 20, 60, 0.2)';
        result.style.stroke = 'rgba(220, 20, 60, 0.2)';
    }
	return result;
}

/**
 * 判断entity是否有指定关系
 * @param {String} entityid
 * @param {String} relName
 */
iD.picUtil.entityHasRelation = function(entityid, relName){
	if(!relName){
		return false;
	}
	var context = this.context, graph = context.graph();
	var entity = context.hasEntity(entityid);
	if(!entity){
		return false;
    }
    var currentTrackId = iD.picUtil.player && iD.picUtil.player.wayInfo.trackId;
        // currentTrackPointId = iD.picUtil.player.getCurrentPic_node();
    var relations = graph.parentRelations(entity, relName)
	if (relName == iD.data.DataType.MEASUREINFO) {
        var measureinfo = relations[0];
        if (measureinfo) {
            var PARAMETER = JSON.parse(measureinfo.tags.PARAMETER),
                trackId = PARAMETER.Paras.nodes[0] ? PARAMETER.Paras.nodes[0].trackId:'';
                // trackPointId = PARAMETER.Paras.nodes[0].trackPointId;
			/*console.log("2===", entity.id);
			 console.log("2===",trackId+" == "+currentTrackId);
			 console.log("2===",trackPointId+" == "+currentTrackPointId);
			 console.log("2===",trackId != currentTrackId || trackPointId != currentTrackPointId);*/
            if (trackId != currentTrackId) {
                return false;
            } else {
                return true;
            }
        }
        return false;
	} else {
        return relations.length > 0;
    }
}

iD.picUtil.isDANode = function(entityid){
	return iD.picUtil.entityHasRelation(entityid, iD.data.DataType.DIVIDER_ATTRIBUTE);
}
iD.picUtil.isLANode = function(entityid){
	return iD.picUtil.entityHasRelation(entityid, iD.data.DataType.LANE_ATTRIBUTE);
}
iD.picUtil.isMeasureInfoNode = function(entityid) {
	var flag = false;
    var entity = this.context.hasEntity(entityid);
    if(!entity){
        return false;
    }
	if (entity.modelName == iD.data.DataType.DIVIDER_NODE) {
		flag = iD.picUtil.entityHasRelation(entityid, iD.data.DataType.MEASUREINFO);
	}
	return flag;
}

iD.picUtil.isEffectDANode = function(entityid){
	var flag = this.context.variable.isDividerAttrHighlight;
	return flag && iD.picUtil.isDANode(entityid);
}
iD.picUtil.isEffectLANode = function(entityid){
    var flag = this.context.variable.isLaneHighlight;
	return flag && iD.picUtil.isLANode(entityid);
}
iD.picUtil.isEffectMeasureInfoNode = function(entityid){
    var flag = this.context.variable.isMeasureInfoHighlight;
    return flag && iD.picUtil.isMeasureInfoNode(entityid);
}
iD.picUtil.isEffectBreakTypeNode = function(entityid){
    var flag = this.context.variable.isBreakNodeHighlight;
    var entity = this.context.hasEntity(entityid);
	return flag && entity && entity.tags.DASHTYPE == '4';
}
iD.picUtil.isEffecFlagTypeNode = function(entityid){
    var flag = this.context.variable.isFlagNodeHighlight;
    var entity = this.context.hasEntity(entityid);
	return flag && entity && entity.tags.FLAG == '2';
}
//判断是否同时含有DA和测量点
iD.picUtil.isEffectDAAndMeasureInfoNode = function(entityid){
	var flag = this.context.variable.isDividerAttrHighlight && this.context.variable.isMeasureInfoHighlight;
	return flag && (iD.picUtil.isDANode(entityid) && iD.picUtil.isMeasureInfoNode(entityid));
}

iD.picUtil.startNodes = [];
iD.picUtil.dashedSolidDivider = function(shape, entityid, isSolidLine) {
    var context = this.context;
    var nodes = [];
    // var entity = context.hasEntity(entityid);
    for (var key in shape._pointMappingNode) {
        nodes.push(shape._pointMappingNode[key]);
    }

	for (var i = 0; i < nodes.length; i++) {
		let startNodeId = nodes[i];

		let node = context.hasEntity(startNodeId);
		if (node.modelName != iD.data.DataType.DIVIDER_NODE) {
			return;
		}
		let rels = context.graph().parentRelations(node, iD.data.DataType.DIVIDER_ATTRIBUTE);
		let relation = rels[0];
		let type, dashtype;
		dashtype =  node.tags.DASHTYPE;//虚线起终点
		type = relation && relation.tags.TYPE;//分割线类型
		if (isSolidLine && type != "1" && type != "3") {
			if (dashtype == "1") {
//				shape.style.lineType = "dashed&solid";
				shape.shape.lineType = "dashed&solid";
				shape.shape.points[i][2] = "start";
				shape.shape.points[i][3] = startNodeId;
			} else if (dashtype == "2") {
//				shape.style.lineType = "dashed&solid";
				shape.shape.lineType = "dashed&solid";
				shape.shape.points[i][2] = "end";
				shape.shape.points[i][3] = startNodeId;
			}else if(dashtype == "3"){
				// 中间点
				shape.shape.lineType = "dashed&solid";
				shape.shape.points[i][2] = "middle";
				shape.shape.points[i][3] = startNodeId;
			}
		}
	}
}

/**
 * 生成前方交汇的 标记点
 * @param {Object} geometry
 */
iD.picUtil.createIntersectionDatum = function(geometry, opts){
	var self = this, context = self.context || editor.context;
    var actions = [];
    opts = opts || {};
    
    var result = '';
    var lng = geometry.lng || geometry.x || geometry[0],
        lat = geometry.lat || geometry.y || geometry[1],
        z = geometry.elevation || geometry.z || geometry[2]
    actions.push(function(graph){
        var node = self.createPoint([lng, lat, z], {
            tags: opts.tags
        });
        result = node.id;
        return iD.actions.AddEntity(node)(graph);
    });
    

    actions.push(t('operations.cancel_draw.annotation'));
    context.perform.apply(window, actions);

    return result;
}
iD.picUtil.createPoint = function(loc, opts){
    //TODO 方法有问题， 没有图层
    // var layerId = opts.layerId;
    // var type = opts.type;
    opts = opts || {};
    var node = iD.Node({
        _type: iD.data.DataType.PLACENAME,
        loc: loc
    });
    node.setTags(Object.assign({
        // name_chn: '',
        name: iD.Entity.id.toOSM(node.id),
        x_coord:loc[0].toString(),
        y_coord:loc[1].toString()
    }, opts.tags));
    return node;
};
// actions ....
iD.picUtil.replaceGeometryNode = function(entity, newNode) {
	var self = this;
    return function (graph) {
        if(entity instanceof iD.Way){
            graph = graph
                .replace(newNode)
                .replace(entity.addNode(newNode.id))
        }
        return graph;
    };
};

iD.picUtil.actionGeometryLineAddNode = function (entity, newNode, index) {
	return function (graph) {
	    if(entity instanceof iD.Way){
	        graph = graph
	            .replace(newNode)
	            .replace(entity.addNode(newNode.id, index))
	    }
	    return graph;
	};
};

/**
 * 将点击帧对应位置的x,y转换为经纬度
 * @param {Object} clickOffset 当前点击的x,y坐标
 */
iD.picUtil.pixelToLngLat = function(clickOffset, trackNode,isDetph = false){
    var player = this.player;
    var selectPicIndex = player.selectPicIndex;
    if(!trackNode){
        trackNode = player.pic_point;
        selectPicIndex = player.allNodes.indexOf(trackNode);
    }
    let K = iD.AutoMatch.getParamK(player);
    
    let xy =  player.reductionPoint(clickOffset, player.pics.select(".item.active"));
    let geometry = null;
    let _isdpeth = d3.select('#picplayer-tools-bar .playerDepth').node()?d3.select('#picplayer-tools-bar .playerDepth').property('checked') : false;
    if(player._depthData && _isdpeth){
        geometry = iD.util.getPixel2DepthCoordinate(trackNode,player._depthData,player.wayInfo.K,xy,15);
        if (geometry) {
            return geometry;
        }else{
            Dialog.alert("深度获取失败");
        }
    }else if(trackNode.tags.picHeight){
        geometry = iD.util.orthophotoSurvey(trackNode,xy);
        if (geometry) {
            return geometry;
        }
    }else if(this.context.inflight){

        // geometry = iD.util.trackGroundPlaneMeasurer(K,trackNode,xy,this.context.trackGround);
        geometry = iD.util.getPixe2Loc(this.context, trackNode, xy, K,player);
        if (geometry) {
            return geometry;
        }
    }else if (player.dataMgr.planes && iD.util.getOffsetCalStatus()) {
        geometry = iD.util.SimpleGroundPlaneMeasurer(selectPicIndex + 1, xy, player.dataMgr.planes, player.allNodes, player.wayInfo.K);
        if (geometry) {
            return geometry;
        }
	}
    let utm  = iD.util.LLtoUTM_(trackNode.loc[0], trackNode.loc[1]);
    var point = iD.util.clickPosForTrackPoint2(trackNode, xy, player.getCameraHeight(), K);
    let z = point[2] - player.getCameraHeight();
    var lonlat =  iD.util.picPixelToLonLat(K, trackNode, utm.zoneNumber, utm.designator, xy, z);
    geometry = {lng:lonlat[0], lat:lonlat[1], elevation:z};
    return  geometry;
}

/**
 * 计算polygon拖拽后在地图上的精确的坐标
 * @param {Array} pixel 像素坐标
 * @param {String} planeStr PLANE属性（纬度, 经度, 高程, p1, p2, p3）
 * @param {Object} trackNode 轨迹点
 */
iD.picUtil.pixelToLngLatByPlane = function(pixel, planeStr, trackNode){
	var player = this.player;
	let K = iD.AutoMatch.getParamK(player);
	trackNode = trackNode || player.pic_point;
	let R = _.cloneDeep(trackNode.tags.R),
		C = _.cloneDeep(trackNode.tags.C),
		T = _.cloneDeep(trackNode.tags.T);
	let plane = planeStr.split(",").map(function(v){
		return Number(v);
	});
	let plane_p = [plane[1], plane[0], plane[2]];
	let plane_n = [plane[3], plane[4], plane[5]];
	
	return iD.util.linePlaneCross(K, R, C, T, pixel, plane_p, plane_n);
}

/**
 * 根据第一帧点击原图上的xy坐标，计算出第二帧上的核线
 * @param {Array} points1  x,y
 * @return 两种核线，1是x=0,x=width情况的坐标，2是y=0,y=height情况的坐标
 */
iD.picUtil.getComputeEpilines = function(points1, opts = {}){
	var player = opts.player || this.player;
	// 两条轨迹的情况
	var pt1 = opts.node1 || player.allNodes[ opts.index1 || player.selectPicIndex ];
	var pt2 = opts.node2 || player.allNodes[ opts.index2 || player.rightPointIndex ];
	var K1 = iD.picUtil.getTrackParamK(pt1.tags.trackId), K2 = iD.picUtil.getTrackParamK(pt2.tags.trackId);
	
	  
	// var device = iD.svg.Pic.dataMgr.cameraParams[0][0];
	// var K = [
	// 	[device.focus, 0, device.principlePoint.x],
     //    [0, device.focus, device.principlePoint.y],
     //    [0,0,1]
	// ];
	var f = iD.util.F_From_KRT(K1, pt1.tags.R, pt1.tags.T, pt2.tags.R, pt2.tags.T, K2);
    var abc = iD.util.computeEpilines([ points1[0], points1[1] ], 1, f);
    
    //移轴公式,坐标原点左移一个图像宽度x'=x+img_width,y'=y
    //ax+by+c=0;
    //ax'+a*img_width+by'+c=0
    //ax'+by'+c+a*img_width=0;
    let a = abc[0], b = abc[1], c = abc[2];
    //

    let x1 = 0;
    let y1 = -(c) / b;
    //
    let x2 = pt1.tags.picW;
    let y2 = -(c + a * pt1.tags.picW) / b;
    return [[
        [x1, y1],
        [x2, y2]
    ]];


	// 直线方程式
	// abc  --> [a, b, c]
	// a*x + b*y + c = 0;
	// x=0 --> y=-c/b
	// y=0 --> x=-c/a
	// x=2 --> y=(-c-2a)/b
	// var a = abc[0], b= abc[1], c= abc[2];
	// var x1 = 0, y1=0;
	// var x2 = pt1.tags.picW;
	// var y2 = pt1.tags.picH;
	
	// var newY1 = (-c-x1*a)/b;
	// var newY2 = (-c-x2*a)/b;
	// var newX1 = (-c-y1*b)/a;
	// var newX2 = (-c-y2*b)/a;
	
	// var result = [
	// 	[x1, newY1],
	// 	[x2, newY2]
	// ];
	// var result2 = [
	// 	[newX1, y1],
	// 	[newX2, y2]
	// ];
	
	// return [
	// 	result,
	// 	result2
	// ];
}

/**
 * 根据轨迹获取相机内参数 K
 * @param {Object} trackid
 */
iD.picUtil.getTrackParamK = function(trackid){
	var player = this.player;
	var track = player.dataMgr.getTrack(trackid);
	return track && _.cloneDeep(track.K);
}

/**
 * 刷新zrender上数据与地图数据的对应关系
 */
iD.picUtil.createZrenderEditorMapping = function(){
    var self = this;
    var pic_player;
	
	function getShapes(key, value){
		var player = pic_player;
		var result = [];
		if(!player || !player._zrender){
			return result;
		}
		var filter;
		if(value instanceof Function){
			filter = value;
		}else {
			filter = (v)=>v==value;
		}
		
		for(let i in player._zrender.storage._roots){
			let item = player._zrender.storage._roots[i];
			if(item[key] != undefined && filter(item[key], item)){
				result.push(item);
			}
		}
		return result;
	}
	
	return {
		getShapesByEid: function(entityid){
			return getShapes("_entityid", entityid);
		},
		getShapesByEids: function(eids){
			return getShapes("_entityid", function(v, item){
				return eids.includes(v);
			});
		},
		getShapeByZid: function(zid){
			var player = pic_player;
			if(!player){
				return ;
            }
            if(player._zrender.storage.get){
                return player._zrender.storage.get(zid);
            }
            return player._zrender.storage._roots.filter(function(d){
                return d.id == zid;
            })[0];
        },
        setPlayer: function(arg){
            pic_player = arg;
        }
	};
}

/**
 * 根据两个坐标生成另外两个坐标，组成矩形
 * @param {Array} points 第一个点和对角的点
 */
iD.picUtil.createRectangeBy2Point = function(points){
	let p1 = points[0];
	let p3 = points[1];
	let p2 = [p1[0], p3[1]];
	let p4 = [p3[0], p1[1]];
	return [p1, p2, p3, p4]
}

iD.picUtil.createRectangleByGeo = function(geoList){
    var lt = geoList[0];
    var rb = geoList[2];
    var rt = _.clone(geoList[1]);
    rt.lng = lt.lng;
    rt.lat = rb.lat;
    var lb = _.clone(geoList[3]);
    lb.lng = rb.lng;
    lb.lat = lt.lat;
//  lonlatList.push(...[lt, rt, rb, lb]);
    return [lt, rt, rb, lb];
}
/**
 * 批量打断
 * 1、地图上选择一条有车道线组的参考线
 * 2、视频上点击“打断车道组”按钮后，视频上地面点击；
 * 3、点击位置换算坐标，坐标与参考线的垂点组成延长线，该组内车道线进行打断操作；
 * @param {Array} point 像素坐标
 */
iD.picUtil.batchBreakDividerDref = function(point){
	var self = this, context = self.context, graph = context.graph();
	var player = self.player;
	if(!player || !player._zrender){
		return ;
	}
	
	var selectedIds = context.selectedIDs();
	if(selectedIds.length != 1){
		Dialog.alert("打断车道组需要选择车道线组中的一条参考线。");
		return ;
	}
	var rline = context.entity(selectedIds[0]);
	var modelNameParam = iD.picUtil.getModelNameParam();
	if(rline.modelName != modelNameParam.DIVIDER || rline.tags.R_LINE != '1'){
		Dialog.alert("打断车道组需要选择车道线组中的一条参考线。");
		return ;
	}
	var relation = graph.parentRelations(rline, iD.data.DataType.R_DIVIDER_DREF)[0];
	if(!relation){
		Dialog.alert("当前参考线没有车道线组。");
		return ;
	}
	
	var lonlat = self.pixelToLngLat(point);
	var clickLoc = [lonlat.lng, lonlat.lat];
	var verLoc = iD.picUtil.pointToLineVerticalLoc(rline, clickLoc);
	if(!verLoc){
		return ;
	}
	/*
	var nearest = self.getNearestDividerDrefRLine([lonlat.lng, lonlat.lat]);
	if(!nearest){
		return ;
	}
	var splitLineIds = _.uniq([nearest.way.id].concat(_.pluck(nearest.relation.members, 'id')));
	var verloc = [nearest.dist.x, nearest.dist.y];
	*/
	var splitLineIds = _.uniq([rline.id].concat(_.pluck(relation.members, 'id')));
	for(let way of _.map(splitLineIds, context.entity)){
		if(!iD.util.entityInPlyGon(way, context)){
			Dialog.alert(t('task_bounds.outside'));
			return;
		}
	}
	
	context.enter(iD.modes.Browse(context));
//	iD.picUtil.createIntersectionDatum(clickLoc);
//	iD.picUtil.createIntersectionDatum(verLoc);
	context.perform(
		iD.actions.SplitDividingLine([
				clickLoc,
				verLoc
			], 
			splitLineIds,
			context, 
			true
		),
		'批量打断车道线'
	);
    iD.logger.editElement({
        'tag':"play_splitDividingLine"
    });			//打断车道线时--埋点
	var oldEntity = context.hasEntity(rline.id);
	if(oldEntity){
		console.log('车道组没有成功打断，点击坐标在参考线 ' + rline.id + ' 范围外');
		context.pop();
		return ;
	}
	context.event.entityedite({
		entitys: []
	});
	
}

/**
 * 点在线上的垂点
 * @param {Object} way
 * @param {Array} lonlats
 */
iD.picUtil.pointToLineVerticalLoc = function(way, lonlats){
	var context = this.context, graph = context.graph();
	var verLoc = [];
	var wayLocs = _.pluck(graph.childNodes(way), 'loc').map(function(loc){
		let utm = iD.util.LLtoUTM_(loc[0], loc[1]);
		return [utm.x, utm.y];
	});
	var clickLocUTM = iD.util.LLtoUTM_(lonlats[0], lonlats[1]);
	clickLocUTM = [clickLocUTM.x, clickLocUTM.y];
	var dist = iD.util.pt2LineDist(wayLocs, clickLocUTM);
	if(dist.i == null){
		return ;
	}
	var node1 = context.entity(way.nodes[dist.i]), node2 = context.entity(way.nodes[dist.i + 1]);
	var utm1 = iD.util.LLtoUTM_(node1.loc[0], node1.loc[1]), nodeLoc2 = iD.util.LLtoUTM_(node2.loc[0], node2.loc[1])
	var nodeLoc1 = [utm1.x, utm1.y], nodeLoc2 = [nodeLoc2.x, nodeLoc2.y];

//	iD.util.pedal([nodeLoc1[0], nodeLoc1[1], nodeLoc2[0], nodeLoc2[1]], clickLocUTM, verLoc);
	verLoc = iD.util.perpendicular(clickLocUTM, nodeLoc1, nodeLoc2);
	if(!verLoc.length){
		return ;
	}
	verLoc = iD.util.UTMtoLL_(verLoc[0], verLoc[1], utm1.zoneNumber, utm1.designator);
	return verLoc;
}
/**
 * 获取当前轨迹点（trackNode）对应的地面高程
 * @param {Object} trackNode
 */
// iD.picUtil.getBottomElevation = function(trackNode){
//     //  - 1.77398086906751
//     var bottom = trackNode.tags.C[2][0] - 1.77398086906751;
//     return bottom;
// }

/**
 * 遍历zrender上的shapeList，获取最近的entity为DIVDIER的shape，再获取其DREF关系中的参考线；
 * @param {Array} lonlat 地理坐标
 * @param {Array} targetShapes 指定的polyline
 */
iD.picUtil.getNearestDividerDrefRLine = function(lonlat, targetShapes){
	var player = this.player, context = this.context, graph = context.graph(), projection = context.projection;
	var pxLonlat = projection(lonlat);
	var result;
	if(!player || !player._zrender){
		return result;
	}
	if(targetShapes && !_.isArray(targetShapes)){
		targetShapes = [targetShapes];
	}
	let shapeList = targetShapes ? targetShapes : player._zrender.storage._roots;
	let nearestWays = [], nearest;

	for(let i = 0; i < shapeList.length; i++){
		let shape = shapeList[i];
		if(shape.type != 'polyline' || !shape._entityid){
			continue ;
		}
		let way = graph.hasEntity(shape._entityid);
		if(!way || way.modelName != iD.data.DataType.DIVIDER){
			continue ;
		}
		let relations = graph.parentRelations(way, iD.data.DataType.R_DIVIDER_DREF);
		if(!relations.length){
			continue ;
		}
		// 需要转为像素进行计算，直接用地理坐标计算结果不正确，不是垂直线交点
		let wayLocs = _.pluck(graph.childNodes(way), 'loc').map(function(loc){
			return projection(loc);
		});
		let dist = iD.util.pt2LineDist(wayLocs, pxLonlat);
		if(!nearest){
			nearest = {
				way: way,
				dist: dist
			};
		}
		if(nearest.dist.dis > dist.dis){
			nearest.dist = dist;
			nearest.way = way;
		}
	}
	if(!nearest){
		return result;
	}
	// 获取最近的DIVIDER的DREF组中的参考线，及交点
	var rel = graph.parentRelations(nearest.way, iD.data.DataType.R_DIVIDER_DREF)[0];
	if(!rel){
		return result;
	}
	nearest = null;
	rel.members.forEach(function(m){
		if(nearest){
			return ;
		}
		let way = graph.hasEntity(m.id);
		if(way && way.tags.R_LINE == '1'){
			let wayLocs = _.pluck(graph.childNodes(way), 'loc').map(function(loc){
				return projection(loc);
			});
			let dist = iD.util.pt2LineDist(wayLocs, pxLonlat);
			let rstLonlat = projection.invert([dist.x, dist.y]);
			nearest = {
				way: way,
				dist: {
					x: rstLonlat[0],
					y: rstLonlat[1]
				},
				relation: rel
			};
		}
	});

	result = nearest;
	return result;
}

/**
 * 判断该Node是否为地面标记
 * @param {String} entityid
 */
iD.picUtil.checkNodeIsGroundArea = function(entityid){
	if(!entityid){
		return false;
	}
	var context = this.context;
	var modelNameParam = iD.picUtil.getModelNameParam();
	var entity = context.hasEntity(entityid);
	if(!entity){
		return false;
	}
	var groundArea;
	if(entity.modelName == modelNameParam.OBJECT_PG_NODE){
		groundArea = context.graph().parentWays(entity)[0];
	}else if(entity.modelName == modelNameParam.OBJECT_PG){
		groundArea = entity;
	}
	if(!groundArea){
		return false;
	}
	// 文字、箭头、数字、符号
//	return groundArea.tags.TYPE == 3 && [1, 2, 3, 4].includes(parseInt(groundArea.tags.SUBTYPE));
    // 除人行横道/倒流带以外都算矩形面
	return groundArea.tags.TYPE == 3 && ![7, 9].includes(parseInt(groundArea.tags.SUBTYPE));
};

/**
 * 判断两个点位置是否一致
 * @param {Array} point1
 * @param {Array} point2
 * @param {Number} extend
 */
iD.picUtil.isPointEqual = function(point1, point2, extend){
	if(!point1 || !point1.length || !point2 || !point2.length) return false;
	extend = Math.abs(extend || 0);
	
	if(Math.abs(point1[0] - point2[0]) <= extend
		&& Math.abs(point1[1] - point2[1]) <= extend){
		return true;
	}
	
	return false;
}

/**
 * 判断entity是否是杆顶部
 * @param {String} entityid
 */
iD.picUtil._entityIsPoleTop = function(entityid){
	var context= this.context, modelNameParam = this.getModelNameParam();
	let entity = context.entity(entityid);
	if(entity.modelName == modelNameParam.LAMPPOST
		&& entity.tags.TYPE == 1){
		return true;
	}
	
	return false;
}

/**
 * 获取空间表达式属性
 * @param {String|Array} entityid entity的id或者loc坐标
 * @param {Number} trackNodeIndex 使用的轨迹点的索引，loc计算时用
 * @param {Boolean} useUTM 是否使用UTM计算法向量，loc计算时用
 * @return PLANE属性（纬度, 经度, 高程, p1, p2, p3）p1-p3法向量
 */
iD.picUtil.getEntityPlaneParam = function(entityid, trackNodeIndex, useUTM = true){
	let context = this.context, player = this.player;
	let result = '', location;
	if(_.isString(entityid)){
		let entity = context.entity(entityid);
		location = entity.loc;
		if(entity.tags.PLANE){
			result = entity.tags.PLANE;
			return result;
		}
	}else if(_.isArray(entityid) && entityid.length > 2){
		location = entityid;
	}else if(entityid instanceof iD.Entity) {
		let entity = entityid;
		if(entity.tags.PLANE){
			result = entity.tags.PLANE;
			return result;
		}
	}else {
		return result;
	}
	trackNodeIndex = trackNodeIndex || player.selectPicIndex;
	
	let parr = iD.util.calculatePlane(player.allNodes, location[0], location[1], trackNodeIndex, useUTM);
	
	return [location[1], location[0], location[2]].concat(parr).join(",");
}

/**
 * 获取空间表达式属性，根据两个坐标
 * @param {Array} locList 两个坐标
 * @param {Number} trackNodeIndex 使用的轨迹点的索引，loc计算时用
 * @return PLANE属性（纬度, 经度, 高程, p1, p2, p3）p1-p3法向量
 */
iD.picUtil.getEntityPlaneParam2 = function(locList, trackNodeIndex){
    let context = this.context, player = this.player;
    let result = '';
    if(!locList || locList.length < 2){
        return result;
    }
    trackNodeIndex = trackNodeIndex || player.selectPicIndex;
    
    let parr = iD.util.calculatePlane2(player.allNodes, locList[0], locList[1], trackNodeIndex);
    
    var location = locList[0];
    
    return [location[1], location[0], location[2]].concat(parr).join(",");
}

/**
 * 根据像素坐标和选中的杆顶点，计算
 * @param {Array} canvasOffset
 */
iD.picUtil.getLampHolderLonlat = function(canvasOffset){
	// 20180110-灯头位置根据选中的杆顶点，计算出法向量后 代入iD.picUtil.pixelToLngLatByPlane计算坐标;
	var context = this.context, player = this.player;
	let selectedids = context.selectedIDs();
	if(!selectedids.length || selectedids.length > 1 || !this._entityIsPoleTop(selectedids[0])){
		Dialog.alert('操作之前需要先选中一个杆顶点');
		return false;
	}
	var trackNodeIndex = player.selectPicIndex;
	if(player.selectPicIndex == player.allNodes.length - 1){
		// TODO 20180110-暂时先写死都-3帧，需要优化；
		trackNodeIndex -= 3;
	}
	if(trackNodeIndex < 0){
		trackNodeIndex = 0;
	}
	
	let paramPLANE = iD.picUtil.getEntityPlaneParam(selectedids[0], trackNodeIndex, true);
	let xy =  player.reductionPoint(canvasOffset, player.pics.select(".item.active"));
	let result = iD.picUtil.pixelToLngLatByPlane(xy, paramPLANE, player.allNodes[trackNodeIndex]);
	// console.group('灯头位置');
	// console.log('使用的轨迹点索引：', trackNodeIndex);
	// console.log('空间表达式：%c' + paramPLANE, 'color: red;');
	// console.log('点击原图坐标：%c'+xy.join(', '), 'color: red;');
	// console.log('计算结果：%c' + result.join(', '), 'font-weight: bold; color: blue;');
	// console.groupEnd('灯头位置');
	
	return {
		loc: result,
		PLANE: paramPLANE
	};
}

/**
 *
 * @param dragStartXY 水平移动起点，图片div相对位置
 * @param dragEndXY  水平移动终点
 * @param entity
 */
iD.picUtil.dargPanning = function(dragStartXY,dragEndXY,entity){
    function horizontalDistance(line,point){
        let locs = line;
        // locs = _.pluck(player.allNodes,"loc");
        let pedalPoint = [];
        // let pt = this.pt2LineDist(locs,point);
        var pt = iD.util.pedal(line,point,pedalPoint);
        // let startIndex = pt.i;
        // if(startIndex == locs.length-1){
        //     startIndex --;
        // }
        // let line = [locs[startIndex],locs[startIndex+1]];

        let line1 = [[locs[0],locs[1]],[locs[2],locs[3]]];
        let distance = iD.util.distanceByLngLat(pedalPoint,point);
        // console.log(distance,iD.util.pt2LineDist(line1,point).dis,pt);
        return distance
    }

    var context = this.context, player = this.player;
    let nodes = context.graph().childNodes(entity);
    let isLeft = true;

    let startOffsetXY = player.leftZoomOffset(dragStartXY);
    let dragEndOffsetXY = player.leftZoomOffset(dragEndXY);

    let geometry = iD.picUtil.pixelToLngLat(startOffsetXY);
    let endLngLat = iD.picUtil.pixelToLngLat(dragEndOffsetXY);

    let rstData = iD.geo.chooseEdge(nodes, context.projection([geometry.lng, geometry.lat]), context.projection);

    let startIndes = rstData.index;
    if(startIndes>=nodes.length-1){
        startIndes --;
	}
	if(dragStartXY[0]<dragEndXY[0]){
    	isLeft = false;
	}

	let startNode = nodes[startIndes];
    let endNode = nodes[startIndes+1];
    let line = [startNode.loc[0],startNode.loc[1],endNode.loc[0],endNode.loc[1]];
    let dist = horizontalDistance(line,[endLngLat.lng,endLngLat.lat])/1000;
    var action = iD.actions.HorizontalMove(context, context.projection,nodes,dist,isLeft);

    context.perform(
        action,
        '水平移动');
    // 判断事务范围
    entity = context.entity(entity.id)
    if(!iD.util.entityInPlyGon(entity, context)){
        Dialog.alert(t('task_bounds.outside'));
        player.clearFooterButton();
    	context.pop();
    }
    // this.horizontalUpdate(nodes,dist,isLeft);
	player.resetCanvas();
}

// iD.picUtil.horizontalUpdate = function (nodes,dist,isLeft) {
//     var newLoc;
//     var oldLoc;
//     var interPoint = [0, 0];
//     var nodeEntity;
//     var adjoinEntity;
//     var lineCal = iD.util.LineCalCulate();
//     let projection = this.context.projection;
//     let graph = this.context.graph();
//     for (var i = 0; i < nodes.length - 1; i++) {
//         nodeEntity = nodes[i]; //graph.entity(nodes[i]);
//         adjoinEntity = nodes[i + 1];//graph.entity(nodes[i + 1]);
//
//         if (0 == i) {
//             newLoc = iD.picUtil.getLnglat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1],dist,isLeft);
//             interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];
//         } else {
//             newLoc = iD.picUtil.getLnglat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1],dist,isLeft);
//             lineCal.getIntersectionPoint(projection, [oldLoc[0].Longitude, oldLoc[0].Latitude],
//                 [oldLoc[1].Longitude, oldLoc[1].Latitude], [newLoc[0].Longitude, newLoc[0].Latitude], [newLoc[1].Longitude, newLoc[1].Latitude], interPoint);
//         }
//
//         nodeEntity.move([interPoint[0], interPoint[1]]);
//         graph = graph.replace(nodeEntity);
//         oldLoc = newLoc;
//     }
//
//     adjoinEntity.move([newLoc[1].Longitude, newLoc[1].Latitude]);
//     graph = graph.replace(adjoinEntity);
//
// };
// iD.picUtil.getLnglat = function(lngA,latA,lngB,latB,dist,isLeft){
//
//     var result = new Array();
//     var lineCal = iD.util.LineCalCulate();
//     var angle = lineCal.getAngle(lngA, latA, lngB, latB);
//
//     if (isLeft) {
//         angle = (angle - 90) + 360;
//     }
//     else{
//         angle = (angle + 90) + 360;
//     }
//     var newPointA = {};
//     var newPointB = {};
//     var pointA = lineCal.calculateVerticalP(lngA, latA, dist, angle);
//     newPointA.Longitude = pointA.Longitude;
//     newPointA.Latitude = pointA.Latitude;
//     result.push(newPointA);
//     var pointB = lineCal.calculateVerticalP(lngB, latB, dist, angle);
//     newPointB.Longitude = pointB.Longitude;
//     newPointB.Latitude = pointB.Latitude;
//     result.push(newPointB);
//     return result;
// }


iD.picUtil.requestIdentifyImage = function(protoSrc, callback){
//	var fromdata = new FormData();  
	var img = new Image();
	var canvas = document.createElement("canvas");
	/*
	var canvas = document.getElementById("__reqest_identify__");
	if(!canvas){
		canvas = document.createElement("canvas");
		canvas.id = "__reqest_identify__";
		document.appendChild(canvas);
	}
	*/
	
	img.onload = function () {
	    canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        dataURL.replace("data:image/png;base64,", "");

		d3.xhr('http://192.168.5.38:30220/lane/single')
		    .post(JSON.stringify(dataURL),function(error, _data) {
		    	if(error){
		    		callback();
		    		return ;
		    	}
		    	callback(_data.response);
		    });
	};
	img.onerror = function () {
	    callback();
	};
	img.setAttribute('crossOrigin', 'anonymous')
	img.src = protoSrc;
}
/**
 * 后差分轨迹点分类：
 * 1、Green
 * 2、Cyan
 * 3、Blue
 * 4、Purple
 * 5、Magenta
 * 6、Red
 * unProcessed、Grey
 * @param {Array} points
 * */
iD.picUtil.trackPointQualityNumber = function(points) {
    var cyanMap = {},
        blueMap = {},
		purpleMap = {},
        magentaMap = {},
		redMap = {},
        otherMap = {},
		points = points || player.allNodes;

        var nodes = points;
        for (let j = 0; j < nodes.length; j++)
        {
            var node = nodes[j],
                tags = node.tags;

            if (tags) {
                if (tags.qualityNum == 1) {
                } else if (tags.qualityNum == 2) {
                    cyanMap[node.id] = true;
                } else if (tags.qualityNum == 3) {
                    blueMap[node.id] = true;
                } else if (tags.qualityNum == 4) {
                    purpleMap[node.id] = true;
                } else if (tags.qualityNum == 5) {
                    magentaMap[node.id] = true;
                } else if (tags.qualityNum == 6) {
                    redMap[node.id] = true;
                } else {
                    otherMap[node.id] = true;
                }
            }
        }
	return {
    	cyanMap: cyanMap,
        blueMap: blueMap,
        purpleMap: purpleMap,
        magentaMap: magentaMap,
        redMap: redMap,
        otherMap: otherMap
	}
}
/**
 * 将轨迹点分类：
 * 1、正常点
 * 2、坏点
 * 3、坏点前10秒的点
 * @param {Array} points
 */
iD.picUtil.trackPointClassification = function(points){
	var context = this.context, player = this.player;
	points = points || player.allNodes;
	var badPoints = [], badMap = {};
    var goodPoints = [], goodMap = {};
    var acceptPoints = [], acceptMap = {};   //坏点前10秒为可接受坏点，需要特殊渲染
    var node ;
    var tempbadPoints = [];
    // var ways =  [];
    var  startNode = points[0];
    var _tempArr= [];   //临时 存储相同类型点数据

    function pushArr(_tempArr,node){
        if(node.tags && node.tags.status.toString() == "3" && node.tags.positionType.toString() == '50'){
            goodPoints.push(_tempArr);
            goodMap[node.id] = true;
        }else{
            tempbadPoints.push(_tempArr);
        }
    }
    function isGoodPoint(node){
        return (node.tags.status.toString() == "3" && node.tags.positionType.toString() == '50');
    }
    //点数据分类为好点和错误点，错误点为临时数组，因为需求需要错误点不同样式渲染
    _tempArr.push(startNode);
    for (let i = 1, l = points.length; i < l; i++) {
        node = points[i];
        if(node.tags && isGoodPoint(node) == isGoodPoint(startNode)){
            _tempArr.push(node);
        }else{
            // ways.push(_tempArr);
            pushArr(_tempArr,startNode);
            _tempArr = [];
            startNode = node;
            _tempArr.push(startNode);
        }
    }
    pushArr(_tempArr,_tempArr[0]);

    var _tempNodes = [];

    for (let i = 0, l = tempbadPoints.length; i < l; i++) {
        _tempNodes = tempbadPoints[i];
        startNode = _tempNodes[0];
        for(let j=0,jl = _tempNodes.length;j<jl;j++){
            node = _tempNodes[j];
            if((node.tags.locTime - startNode.tags.locTime) > 10000){
                badPoints.push(node);
                badMap[node.id] = true;
            }else{
                acceptPoints.push(node);
                acceptMap[node.id] = true;
            }
        }
    }

    return {
        badPoints,
        acceptPoints,
        goodPoints: _.flatten(goodPoints),
        badMap,
        goodMap,
        acceptMap
    };
}

/**
 * iD.measureinfo
 * @param {Object} entity
 * @param {Object} opts
 * 		opts.type：0-普通节点、1-通过前方交会生成节点、2、通过PLANE法向量计算的节点；
 */
iD.picUtil.measureinfoAction = function(entity, opts = {}){
	var player = this.player;
	var sceneModels = iD.util.getSceneModel();
	if(sceneModels.length && sceneModels.indexOf(iD.data.DataType.MEASUREINFO) == -1){
		// 场景中不存在测量信息的模型；
		return ;
	}
	var modelNameParam = this.getModelNameParam();
	var handle = iD.measureinfo.handle();
	var result;
	var typeNum = {
		remove: -1,
		normal: 0,
		forward: 1,
		// plane: 2
		plane: 2
	};
	// opts.type 强制使用该type对应的action
	switch (opts.type == null ? entity.modelName : opts.type){
		case typeNum.remove:
			result = getActionByType(typeNum.remove);
			break;
		case typeNum.normal:
			result = getActionByType(typeNum.normal);
			break;
		case typeNum.forward:
			result = getActionByType(typeNum.forward);
			break;
		case typeNum.plane:
			result = getActionByType(typeNum.plane);
			break;
		// 根据类型判断
		case modelNameParam.DIVIDER_NODE:
		case modelNameParam.OBJECT_PL_NODE:
		case modelNameParam.OBJECT_PG_NODE:
		case modelNameParam.PAVEMENT_DISTRESS_NODE:
		case modelNameParam.PAVEMENT_DISTRESS_PL_NODE:
		case modelNameParam.BARRIER_GEOMETRY_NODE:
		case modelNameParam.OBJECT_PT:
		// case modelNameParam.TRAFFICLIGHT:
			if(entity.modelName == modelNameParam.OBJECT_PT){
				// 控制点
				if(entity.tags.TYPE == 2 && entity.tags.SUBTYPE == 14){
					result = getActionByType(typeNum.forward);
					break;
				}
			}
			result = getActionByType(typeNum.normal);
			break;
		case modelNameParam.LAMPPOST:
			if(entity.modelName == modelNameParam.LAMPPOST){
				// 灯杆
				if(entity.tags.TYPE == 1){
					result = getActionByType(typeNum.forward);
				}else if(entity.tags.TYPE == 2){
					result = getActionByType(typeNum.plane);
				}
				break;
			}
			result = getActionByType(typeNum.forward);
			break;
		// case modelNameParam.TRAFFICLIGHT:
		case modelNameParam.TRAFFICLIGHT_NODE:
			result = getActionByType(typeNum.plane);
			break;
		case modelNameParam.BRIDGE_NODE:
		case modelNameParam.TRAFFICSIGN_NODE:
			result = getActionByType(typeNum.plane);
			break;
		default:
			break;
	}
	
	function getActionByType(type){
		let fun;
		if(type == -1){
			fun = function(graph){
				graph = handle.remove(graph, entity.id)
				return graph;
			}
		}else if(type == 0){
			fun = function(graph){
				graph = handle[methodName(graph, entity)](graph, entity, {
					type: 0,
                    method:1,
					trackPointId: opts.trackPointId,
        			trackId: getTrackId(),
					imgOffset: opts.imgOffset   //{x, y}
				})
				return graph;
			}
		}else if(type == 2){
            fun = function(graph){
                graph = handle[methodName(graph, entity)](graph, entity, {
                    type: 0,
                    method:2,
                    trackPointId: opts.trackPointId,
                    trackId: getTrackId(),
                    imgOffset: opts.imgOffset   //{x, y}
                })
                return graph;
            }
        }else if(type == 1){
			fun = function(graph){
				graph = handle[methodName(graph, entity)](graph, entity, {
					type: 1,
                    method:3,
					points: _.flatten(opts.datas || []),
                	trackId: getTrackId()
				})
				return graph;
			}
		} else if(type == 3){
            fun = function(graph){
            	let way = graph.entity(opts.wayid);
                graph = handle[methodName(graph, entity)](graph, entity, {
                    type: 3,
                    trackPointId: opts.trackPointId,
        			trackId: getTrackId(),
                    imgOffset: opts.imgOffset,   //{x, y}
					pointtype: entity.modelName,
					pointid: way.nodes[0]
                })
                return graph;
            }
        }
		return fun;
	}
	
	function getTrackId(){
		return opts.trackId || player.dataMgr.trackId;
	}
	
	function methodName(graph, entity){
		var relation = graph.parentRelations(entity, iD.data.DataType.MEASUREINFO)[0];
		return relation ? 'updateEntity' : 'addEntity';
	}
	
	return result || function(graph){return graph;};
}

/**
 * 获取/设置 shape 的中心点
 * @param {Object} shape
 * @param {Array} xy
 */
iD.picUtil.shapeXY = function(shape, xy){
    var xk = 'x', yk = 'y', xplus = 0, yplus = 0;
    var xyProtoKey = 'shape';
    if(['circle', 'star'].includes(shape.type)){
        xk = 'cx', yk = 'cy';
        xplus = 0, yplus = 0;
    }else if(['rect', 'rectangle'].includes(shape.type)){
        // 矩形时，xy是左上角
        // 获取/设置时按照中心点计算
        xk = 'x', yk = 'y';
        xplus = shape.shape.width / 2;
        yplus = shape.shape.height / 2;
    }else if(shape.type == 'image'){
        // bottom_center
        xk = 'x', yk = 'y';
        if(shape._type == 'droplet'){
            xplus = shape.style.width / 2;
            yplus = shape.style.height;
        }else {
            xplus = shape.style.width / 2;
            yplus = shape.shape.height / 2;
        }
        xyProtoKey = 'style';
    }

    if(!xy){
        // let xval = shape.shape[xk], yval = shape.shape[yk];
        let xval = shape[xyProtoKey][xk], yval = shape[xyProtoKey][yk];
        return [xval + xplus, yval + yplus];
    }
    // attrKV或setShape，设置shape属性，会自带刷新(.dirty())
    shape.attrKV(xyProtoKey, {
        [xk]: xy[0] - xplus,
        [yk]: xy[1] - yplus,
    });
    if(xyProtoKey != 'shape'){
        shape.dirty(true);
    }
}
/**
 * 刷新shape
 * @param {Object} shape
 * @param {Array} xy
 */
iD.picUtil.modShape = function(shape){
    var player = this.player;
    if(!player || !player._zrender){
        return ;
    }
    
    if(player._zrender.modShape){
        player._zrender.modShape(shape);
        return ;
    }
    iD.picUtil.shapeTransform(shape);
    shape.dirty && shape.dirty(true);
}

/**
 * 设置要素定位，默认基于layer的position偏移量，
 * 要素拖拽之后，可能是在放大后的图片中，position不能直接设置为0
 * @param {Object} shape
 * @param {Array} position
 * @param {Boolean} nolayer 默认false，基于layer设置偏移量
 */
iD.picUtil.shapePosition = function(shape, position, nolayer = false){
    var player = this.player;
    if(!player || !player._zrender){
        return ;
    }
    var pos = position;
    if(!nolayer){
        let layer = player.getZRenderLayer(0);
        let base = layer.position || [0, 0];
        pos = [base[0] + pos[0], base[1] + pos[1]];
    }
    shape.attrKV('position', pos);
//	shape.position = position;
    // 不通过setShape的话，可能会影响高亮层的定位；
    shape.setShape && shape.setShape("position", pos);
//	shape.updateTransform && shape.updateTransform();
    this.modShape(shape);
}
/**
 * 设置要素缩放
 * @param {Object} shape
 * @param {Array} scale
 */
iD.picUtil.shapeScale = function(shape, scale){
    shape.attrKV('scale', scale);
//	shape.scale = scale;
    shape.setShape && shape.setShape("scale", scale);
//	shape.updateTransform && shape.updateTransform();
    this.modShape(shape);
}
/**
 * 刷新transform，invTransform
 * 由于invTransform在缩放过程中与transform不一致，
 * 导致缩放级别为1时，鼠标事件的判断位置不在原本对象上
 * 无法高亮/拖拽等
 * @param {Object} shape
 */
iD.picUtil.shapeTransform = function(shape){
	shape.invTransform = null;
	shape.update && shape.update() || shape.updateTransform && shape.updateTransform();
//  this.modShape(shape);
}

/**
 * 根据xy获取该像素坐标上的zrender要素
 * @param {Number} x
 * @param {Number} y
 * @param {Object} opts  first-获取第一个shape，shapes-排除的shape
 */
iD.picUtil.findMouseShapes = function(x, y, opts = {first: false, shapes: [], type: null}){
	var player = this.player;
	var shapeList = player._zrender.storage.getDisplayList();
	var result = [];
	for(var shape of shapeList){
		if(opts.type != null && shape.type != opts.type) continue;
		if(opts.shapes.includes(shape)) continue;
		
		if((shape.isCover && shape.isCover(x, y)) || (shape.isCoverRect && shape.isCoverRect(x, y))){
			
		}else {
			continue;
		}
		
		result.push(shape);
		if(opts.first) break;
	}
	return result;
}

iD.picUtil.getBoundsByLine = function(locs) {
    var xs = [],
        ys = [],
        path = [],
    	player = this.player;
    for(var i = 0; i < locs.length; i++)
    {
        var loc = locs[i];
        loc = player.leftZoomOffset([loc[0], loc[1]]);//因为图片非等比，所以要转换为原尺寸上的像素 --Tilden
        var lnglat = iD.picUtil.pixelToLngLat(loc);//计算经纬度
        path.push([lnglat.lng, lnglat.lat]);
        xs.push(lnglat.lng);
        ys.push(lnglat.lat);
    }
    var minx = d3.min(xs);
    var miny = d3.min(ys);
    var maxx = d3.max(xs);
    var maxy = d3.max(ys);
    var bounds = [[minx,miny],[maxx,maxy]];

    return {
    	bounds: bounds,
        path: path
    };
}

/**
 * 获取两个线段相交的所有点
 * 来自lineCalCulate.getIntersectLoc
 * @param {Array} nodes1  location [[x, y], [x, y], ...]
 * @param {Array} nodes2  location [[x, y], [x, y], ...]
 */
iD.picUtil.getIntersectCoordinate = function (nodes1, nodes2) {
    var locs = [];
    var interPoint = [0, 0];
    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = nodes1[j], nodes1_next = nodes1[j + 1], pre_arr1 = [ nodes1_pre[0], nodes1_pre[1], nodes1_next[0], nodes1_next[1] ];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = nodes2[k], nodes2_next = nodes2[k + 1], pre_arr2 = [nodes2_pre[0], nodes2_pre[1], nodes2_next[0], nodes2_next[1]];
            // 正常相交
            // var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
            // 射线交点，并且该点在实线上
            var loc = iD.util.extendIntersection(pre_arr1, pre_arr2);
//          if(loc && (iD.util.onLine(pre_arr1, loc) || iD.util.onLine(pre_arr2, loc))){
            if(loc && !isNaN(loc[0]) && !isNaN(loc[0])){
                locs.push(loc);
            }
        }
    }
    return locs;
}

/**
 * 点在线上的垂点
 * @param {Object} way
 * @param {Array} lonlats
 */
iD.picUtil.pt2LineVerticalCoordinate = function(lineLocs, point, opts = {useUTM: false}){
	var context = this.context, graph = context.graph();
	var verLoc = [];
	var wayLocs = lineLocs;
	
	function toUTM(loc){
		if(opts.useUTM){
			let utm = iD.util.LLtoUTM_(loc[0], loc[1]);
			return [utm.x, utm.y];
		}else {
			return loc;
		}
	}

    function cancelUTM(loc,zoneNumber,designator){
		if(opts.useUTM){
            return iD.util.UTMtoLL_(loc[0], loc[1], zoneNumber,designator);
		}else {
			return loc;
		}
	}
	
	var clickLocUTM = toUTM(point);
	var dist = iD.util.pt2LineDist(lineLocs, clickLocUTM);
	if(dist.i == null){
		return ;
	}
	var node1 = lineLocs[dist.i], node2 = lineLocs[dist.i + 1];
	var nodeLoc1 = toUTM([node1[0], node1[1]]), nodeLoc2 = toUTM([node2[0], node2[1]]);
	// 垂点
	verLoc = iD.util.perpendicular(clickLocUTM, nodeLoc1, nodeLoc2);
	if(!verLoc.length){
		return ;
	}
    var utm = iD.util.LLtoUTM_(point[0], point[1])
    verLoc = cancelUTM(verLoc,utm.zoneNumber,utm.designator);
	if(node1[2] && node2[2]){
		verLoc = iD.util.getBetweenPointLoc(node1, node2, verLoc);
	}
	return verLoc;
}


/**
 * 获取核线测量工具中十字坐标
 * @param {Object} player
 * @param {Array} clickOffset 左侧点击时的位置，经过leftZoomOffset函数转为1缩略时的坐标
 * @param {HTMLElement} viewDom
 * @param {Number|Object} trackIndex 当前轨迹的索引，或其他轨迹的轨迹点
 */
iD.picUtil.getCrossLinePointsByTrack = function(player, clickOffset, viewDom, trackIndex){
	var trackNodeLocs = iD.util.currentTrackPointDis || [];
	var trackIndex = trackIndex || player.selectPicIndex;
	if(isNaN(trackIndex)){
		var track = player.dataMgr.getTrack(trackIndex.tags.trackId);
		trackNodeLocs = track && _.pluck(track.nodes, 'loc') || [];
	}
	if(!trackNodeLocs.length){
		return false;
	}
	var geometry = iD.picUtil.pixelToLngLat(clickOffset);
	// 与轨迹的垂直交点
	var crossLoc = iD.picUtil.pt2LineVerticalCoordinate(trackNodeLocs, [geometry.lng, geometry.lat], {
		useUTM: true
	});
	if(!crossLoc){
		return false;
	}
	crossLoc[2] -= player.getCameraHeight();
	var clickPoint = iD.AutoMatch.locsToPicPlayer([
		[geometry.lng, geometry.lat, geometry.elevation]
	], player, null, trackIndex)[0];
	var crossPoint = iD.AutoMatch.locsToPicPlayer([
		crossLoc
	], player, null, trackIndex)[0];
	if(!clickPoint || !crossPoint){
		return false;
	}
	clickPoint = clickPoint.coordinates[0];
	crossPoint = crossPoint.coordinates[0];
	
	var width = player.allNodes[0].tags.picW;
	var height = player.allNodes[0].tags.picH;
	/*
	var rectPoints = [
		[0, 0],
		[width, 0],
		[width, height],
		[0, height],
		[0, 0]
	];
	*/
	/*
	var pointList = iD.picUtil.getIntersectCoordinate([
		[0, 0],
		[0, height]
	], [crossPoint, clickPoint]);
	var pointList2 = iD.picUtil.getIntersectCoordinate([
		[width, 0],
		[width, height]
	], [crossPoint, clickPoint]);
	*/
	var p1 = iD.util.extendIntersection([0, 0, 0, height], [crossPoint[0], crossPoint[1], clickPoint[0], clickPoint[1]]);
	var p2 = iD.util.extendIntersection([width, 0, width, height], [crossPoint[0], crossPoint[1], clickPoint[0], clickPoint[1]]);
	
	if(isNaN(p1[0]) || isNaN(p1[1]) || isNaN(p2[0]) || isNaN(p2[1])){
		return false;
	}
	var pointList = [p1, p2];
	pointList[0][2] = 'start';
	pointList[1][2] = 'end';
	pointList[2] = [clickPoint[0], 0, 'start'];
	pointList[3] = [clickPoint[0], height, 'end'];
	
	// 原图坐标 -> 变形后坐标
	for(var i = 0; i<pointList.length; i++){
		var status = pointList[i][2];
		pointList[i] = player.transformPoint(pointList[i], viewDom);
		if(status) pointList[i][2] = status;
	}
	return pointList;
}

/**
 * 坐标绘制到地图上时，判断是否超出边界
 * @param {Object} drawTool
 * @param {Object} drawMark
 * @param {Object} geoData
 */
iD.picUtil.checkDrawGeoOutEditable = function(drawTool, drawMark, geoData){
    var drawMarkList, dataGeoList;
    if(_.isArray(drawMark)){
        drawMarkList = drawMark;
        dataGeoList = geoData;
    }else {
        drawMarkList = drawMark && [drawMark] || [];
        dataGeoList = [geoData];
    }
    var hasOut = false;
    // 判断坐标是否在范围内
    for(var idx in dataGeoList){
        var data = dataGeoList[idx];
        var loc;
        if(_.isArray(data)){
        	loc = data;
        }else if(data.location){
        	loc = data.location;
        }else if(data.geometry){
        	var geo = data.geometry || data;
        	loc = [geo.lng, geo.lat, geo.elevation];
        }else {
            hasOut = true;
        	break;
        }
        if(drawTool.locationOutTaskEditable(loc)){
            hasOut = true;
            break;
        }
    }
    if(hasOut){
    	// 超出边界则将图形移出渲染队列，防止后续 add 时渲染；
    	(drawMarkList || []).forEach(shape => {
    		shape.ignore = true;
    		drawTool._zrender.remove(shape);
    		if(shape._nodeList && shape._nodeList.length){
    			shape._nodeList.forEach(node => {
    				node.ignore = true;
    				drawTool._zrender.remove(node);
    			});
    		}
    	});
    	return true;
    }
    return false;
}

/**
 * 判断当前图形是否在地图上处于选中状态
 * @param {Object} shape
 */
iD.picUtil.shapeInSelected = function(shape){
	var context = this.context;
	if(shape && shape._entityid && context.selectedIDs().indexOf(shape._entityid) > -1){
		return true;
	}
	return false;
}

/**
 * 获取量测信息参数
 * @param {Object} node
 * @param {Object} graph
 */
iD.picUtil.parseMeasureNodes = function(node, graph){
	var result = [];
	if(!node){
		return result;
	}
	var context = this.context;
	graph = graph || context.graph();
	var measureRel;
	if(node.modelName == iD.data.DataType.MEASUREINFO){
		measureRel = node;
	}else {
		measureRel = graph.parentRelations(node, iD.data.DataType.MEASUREINFO)[0];
	}
	if(!measureRel){
		return result;
	}
	var param = JSON.parse(measureRel.tags.PARAMETER || '{}');
	result = param.Paras && param.Paras.nodes || [];
	return result;
}

/**
 * 地面区域旋转后更新MEASUREINFO记录
 * 平行/旋转操作
 * 在量测信息轨迹点：更新量测信息；
 * 不在量测信息轨迹点：删除量测信息（信息错误）；
 * 
 * 拖拽操作-pic_draw_tool.js
 */
iD.picUtil.updateGroundAreaMeasure = function (entityid, annotation, isReplace = true){
	var player = this.player;
	var context = this.context;
	var way = context.hasEntity(entityid);
	if(!player || !player.pic_point || !way || !iD.picUtil.checkNodeIsGroundArea(way.id)){
		return ;
	}
	
	var measureNode = iD.picUtil.parseMeasureNodes(context.entity(way.first()))[0];
	if(!measureNode){
		return ;
	}
	var trackPointId = measureNode.trackPointId;
	var actions = [];
	annotation = annotation || '更改形状';
	
	if(trackPointId != player.pic_point.id){
		for(let i = 0; i < way.nodes.length - 1; i++){
			let node = context.entity(way.nodes[i]);
			actions.push(iD.picUtil.measureinfoAction(node, {
	            type: -1
	        }));
		}
	}else {
		var mAdds = [];
		// 量测信息错误、没有反投像素坐标、或像素坐标为负数，清空
		var noMeasure = false;
		var picH = player.pic_point.tags.picH;
		var picW = player.pic_point.tags.picW;
		for(var nid of way.nodes){
			let node = context.entity(nid);
	    	let point = player.ZEUtil.getShapesByEid(nid)[0];
	    	let xy = [];
	    	if(point){
                xy = player.reductionPoint([point.shape.cx, point.shape.cy]);
	    	}else {
	    		let picData = iD.AutoMatch.locsToPicPlayer([node.loc], player)[0];
	    		if(!picData || !picData.coordinates || !picData.coordinates[0]){
	    			noMeasure = true;
	    			break;
	    		}
	    		xy = picData.coordinates[0].map(function(v){
	    			return parseInt(v);
	    		});
	    	}
	    	if(isNaN(xy[0]) || !_inRange(xy[0], 0, picW) 
	    		|| isNaN(xy[1]) || !_inRange(xy[1], 0, picH)){
	    		noMeasure = true;
	    		break;
	    	}
	    	
	    	mAdds.push({
	    		node: node,
	    		xy: xy
	    	});
		}
		if(noMeasure){
			mAdds.length = 0;
			for(var nid of way.nodes){
				let node = context.entity(nid);
				actions.push(iD.picUtil.measureinfoAction(node, {
		            type: -1
		        }));
			}
		}else {
			for(let item of mAdds){
				// let xy = player.reductionPoint(item.xy);
				let xy = item.xy;
				actions.push(iD.picUtil.measureinfoAction(item.node, {
		            trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
		            imgOffset: {'x':xy[0], 'y':xy[1]}
		        }));
			}
		}
	}
	
    function _inRange(a, b, c){
    	return a >= b && a <= c;
    }
    
	if(isReplace){
		context.replace.apply(context, actions.concat(annotation));
	}else {
		context.perform.apply(context, actions.concat(annotation));
	}
}

/**
 * 获取地面区域（矩形）要素的边
 * 以第一个点为左上角
 * @param {Object} way
 */
iD.picUtil.getRectangleBounding = function(way){
	var context = this.context;
	// 非矩形  
	if(!iD.picUtil.checkNodeIsGroundArea(way.id)){
		return ;
	}
	
	var areaNodes = _.clone(context.childNodes(way));
	areaNodes.pop();
	
	// 所有节点都存在xy量测信息
	let hasMeasure = true;
	let LT, LB, RB, RT;
	let measureDatas = [];
	areaNodes.forEach(function(n){
		if(!hasMeasure) return ;
		let mn = iD.picUtil.parseMeasureNodes(n)[0];
		if(!mn || isNaN(mn.x) || isNaN(mn.y)){
			hasMeasure = false;
			return ;
		}
		measureDatas.push({
			xy: [+mn.x, +mn.y],
			node: n
		});
	});
	/*
	let LT = areaNodes[0];
	let LB, RB, RT;
	let sideList = [areaNodes[1], areaNodes[areaNodes.length - 1]];
	let sideMinX = Infinity;
	sideList.forEach(function(n){
		if(!hasMeasure) return ;
		let mn = iD.picUtil.parseMeasureNodes(n)[0] || {};
		let mx = mn && !isNaN(mn.x) && (+mn.x) || null;
		if(mx == null){
			hasMeasure = false;
			LB = null;
			return ;
		}
		if(sideMinX > mx){
			sideMinX = mx;
			LB = n;
		}
	});
	*/
	if(hasMeasure){
		let minYList = [], maxYList = [];
		let _datas = _.clone(measureDatas);
		let minY = Infinity, maxY = -Infinity;
		_datas.forEach(function(d){
			let y = d.xy[1];
			if(minY > y){
				minY = y;
				minYList[0] = d;
			}
			if(maxY < y){
				maxY = y;
				maxYList[0] = d;
			}
		});
		_datas = _.difference(_datas, minYList.concat(maxYList));
		
		minY = Infinity, maxY = -Infinity;
		_datas.forEach(function(d){
			let y = d.xy[1];
			if(minY > y){
				minY = y;
				minYList[1] = d;
			}
			if(maxY < y){
				maxY = y;
				maxYList[1] = d;
			}
		});
		hasMeasure = minYList.length == 2 && maxYList.length == 2;
		if(hasMeasure){
			LT = minYList[0].xy[0] <= minYList[1].xy[0] ? minYList[0] : minYList[1];
			RT = minYList[(minYList.indexOf(LT)+1) % minYList.length];
			LB = maxYList[0].xy[0] <= maxYList[1].xy[0] ? maxYList[0] : maxYList[1];
			RB = maxYList[(maxYList.indexOf(LB)+1) % maxYList.length];
			
			LT = LT.node;
			RT = RT.node;
			LB = LB.node;
			RB = RB.node;
		}
	}
	if(!hasMeasure){
		// 没有量测信息，用距离判断（最长边认为是侧边）；
		LT = areaNodes[0];
		let sideList = [areaNodes[1], areaNodes[areaNodes.length - 1]];
		let sideMaxDis = -Infinity;
		sideList.forEach(function(n){
			let dis = iD.util.distanceByLngLat(LT.loc, n.loc);
			if(sideMaxDis < dis){
				sideMaxDis = dis;
				LB = n;
			}
		});
		RB = areaNodes[2];
		RT = sideList[(sideList.indexOf(LB)+1) % sideList.length];
	}
	
	return {
		left: [LT, LB],
		bottom: [LB, RB],
		right: [RB, RT],
		top: [RT, LT]
//		rect: [LT, LB, RB, RT]
	}
}

/**
 * 获取轨迹点的偏移量；
 * @param {Object} trackObj 轨迹
 * @param {Object} planeFrames dataMgr.planeFrames
 * @param {Boolean} useOffsetCal 查询轨迹时，是否刷新过offset
 */
iD.picUtil.getTrackNodesOffset = function(trackObj, planeFrames, useOffsetCal, useUTM = true){
    if(useOffsetCal == null) {
        // offsetCal=true时，轨迹才会加上xyz偏移量
        var posParam = iD.Task.getPosParam();
        useOffsetCal = posParam.offsetCal;
    }
    var trackNodeDelta = {};
    //TODO 需要改掉
    var trackPlanes = {}; // planeFrames.get(trackObj.trackId) || {};
    trackObj.nodes.forEach(function(d){
        var obj = {
            x: 0,
            y: 0,
            z: d.zDelta || 0
        };
        if(useOffsetCal && trackPlanes[d.id]){
            let plane = trackPlanes[d.id];
            let px = d.tags.x;
            let py = d.tags.y;
            let dx = 0;
            let dy = 0;
            if(!useUTM){
                dx = plane.xDelta;
                dy = plane.yDelta;
                obj.x = dx;
                obj.y = dy;
            }else {
                if(plane.xDelta){
                    px -= plane.xDelta;
                }
                if(plane.yDelta){
                    py -= plane.yDelta;
                }
                if(px != d.tags.x || py != d.tags.y){
                    var putm = iD.util.LLtoUTM_(px, py);
                    var utm = iD.util.LLtoUTM_(d.tags.x, d.tags.y);
                    dx = utm.x - putm.x;
                    dy = utm.y - putm.y;
                    obj.x = dx;
                    obj.y = dy;
                }
            }
        }
        if(''+obj.x+obj.y+obj.z === '000'){
            return ;
        }
        trackNodeDelta[d.id] = obj;
    });

    return trackNodeDelta;
}

/**
 * 根据指定坐标与轨迹垂足，获取轨迹点
 */
iD.picUtil.getPedalNodeByTrack = function(trackNodes, loc){
    let index = - 1;
    let range = 10;
    let result = {
        i: index,
        node: null
    };
    // 1、获取最近点
    let dist = iD.util.pt2LineDist2(
        _.pluck(trackNodes, 'loc'), 
        loc
    );
    if(dist.i == -1){
        return result;
    }
    // 2、前后10个节点范围，判断垂足是否在线段上
    let sidx = dist.i - range, eidx = dist.i + range + 1;
    if(sidx < 0){
        sidx = 0;
    }
    if(eidx > trackNodes.length - 1){
        eidx = trackNodes.length - 1;
    }
    let locUtm = iD.util.LLtoUTM_(loc[0], loc[1])
    for(let i = sidx; i<eidx; i++){
        let now = trackNodes[i];
        let next = trackNodes[i+1];
        let startUtm = iD.util.LLtoUTM_(now.loc[0], now.loc[1]);
        let endUtm = iD.util.LLtoUTM_(next.loc[0], next.loc[1]);
        let PtB = new Array(2);
        let Line = [startUtm.x, startUtm.y, endUtm.x, endUtm.y],
            PtA = [locUtm.x, locUtm.y];
        //计算垂足
        iD.util.pedal(Line, PtA, PtB);
        if(iD.util.onLine(Line, PtB)){
            // 最近点
            let d1 = Math.sqrt(Math.pow(PtB[0] - Line[0], 2) + Math.pow(PtB[1] - Line[1], 2));
            let d2 = Math.sqrt(Math.pow(PtB[0] - Line[2], 2) + Math.pow(PtB[1] - Line[3], 2));
            if(d1 <= d2){
                index = i;
            }else {
                index = i + 1;
            }
            break;
        }
    }
    if(index == -1){
        if(dist.i == 0 || dist.i == trackNodes.length - 1){
            result.i = dist.i;
            result.node = trackNodes[dist.i];
        }
        return result;
    }
    result.i = index;
    result.node = trackNodes[index];
    return result;
}
iD.picUtil.createZrenderShapeKeepHandle = function(){
    // 存储绘制的参数
    // loc|xy（优先xy，其次loc反投）、type、options（创建时opts）、shapeid（创建时添加） 
    // targetId、targetShapeId、trackPointId
    var ZRENDER_SHAPE_RENDER_DATAS = [];
    var player, drawTool;

    function filter(func){
        if(!(func instanceof Function)) return ;
        ZRENDER_SHAPE_RENDER_DATAS = ZRENDER_SHAPE_RENDER_DATAS.filter(function(d){
            let flag = func(d);
            if(!flag){
                remove(d);
            }
            return flag;
        });
    }

    function add(d){
        ZRENDER_SHAPE_RENDER_DATAS.push(d);
        render();
    }

    function remove(d){
        if(!d) return ;
        if(d.shapeid != null){
            let s = player.ZEUtil.getShapeByZid(d.shapeid);
            s && player._zrender.remove(s);
            d.shapeid = null;
        }
    }

    function clearAll(){
        ZRENDER_SHAPE_RENDER_DATAS.forEach(function(d){
            remove(d);
        });
        ZRENDER_SHAPE_RENDER_DATAS.length = 0;
    }

    function render(){
        var trackPoint = player.pic_point;
        ZRENDER_SHAPE_RENDER_DATAS.forEach(function(d){
            remove(d);

            let xy = d.xy;
            if(!d.xy && d.loc && d.loc.length){
                let picData = iD.AutoMatch.locsToPicPlayer([d.loc], null, null, trackPoint)[0];
                xy = picData && picData.coordinates && picData.coordinates[0];
                if(!xy || xy.length < 2) return ;
                xy = player.transformPoint(xy);
                d.newXY = xy;
            }
            
            let shape;
            if(d.renderBefore && d.renderBefore instanceof Function){
                d.renderBefore();
            }
            if(d.type == 'star'){
                shape = drawTool.createStar(xy, _.clone(d.options));
            }else if(d.type == 'polyline'){
                if(!d.pointList || !d.pointList.length) return ;
                shape = drawTool.createPolyline(d.pointList, _.clone(d.options));
            }
            if(shape){
                player._zrender.add(shape);
                d.shapeid = shape.id;
            }
            d.trackPointId = trackPoint.id;
        });
    }

    function find(obj){
        return _.find(ZRENDER_SHAPE_RENDER_DATAS, obj);
    }

    return {
        setPlayer: function(arg){
            player = arg;
            drawTool = player.getDrawTool();
        },
        add,
        clearAll,
        filter,
        render,
        find
    }
}