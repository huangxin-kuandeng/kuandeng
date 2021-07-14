iD.effects = iD.effects||{};

iD.effects.roadHighlight = function(context) {
	var roadHighlightParamList = [];
    var effect = {
        id: 'road-highlight',
        button: 'roadhighlight',
        title: t('effects.roadHighlight.title'),
        iconText: 'RA',
        description: t('effects.roadHighlight.description'),
        key: 'Shift+E',
        // 是否开启的状态
        enable: false,
        apply:function(context, open){
//			道路
        	var nodeName = iD.data.DataType.ROAD;
//      	获取图层
        	var nodes = context.layers().getLayersByModelName(nodeName)[0];
            if(!nodes) return;
        	var self = this;
//      	获取点击的状态(通过判断是否为打开状态来进行渲染)
        	self.enable = open == null ? false : open;
        	
        	var roadObj = {
        		'style':function(entity){
//      			获取所有的graph
	        		var graph = context.graph();
//      			获取对应的关系
	        		var relations = graph.parentRelations(entity, iD.data.DataType.R_ROAD_RA);
	        		var effectColor = null;
	        		
//	        		根据是否存在关系来改变道路的颜色(存在关系为黑色;不存在则为白色)
			        if(self.enable){
			        	if (relations.length > 0) {
			        		effectColor = "#000000";
			        	} else {
			        		effectColor = "#FFFFFF";
			        	}
			        	return {"stroke": effectColor};
			        }else {
			        	return {"stroke": null};
			        }
		        }
		    };
//      	道路的渲染颜色
        	nodes.setOptions(roadObj);
//        	重新渲染地图
       		context.map().dimensions(context.map().dimensions());
        }
    };

    return effect;
};
