iD.effects = iD.effects||{};
/**
 * 补充车道线特效
 * @param {Object} context
 */
iD.effects.additionalDivider = function(context) {
    var effect = {
        id: 'additional-divider',
        button: 'additional-divider',
        title: t('effects.additionalDivider.title'),
        iconText: 'AD',
        description: t('effects.additionalDivider.description'),
        key: 'Shift+A',
        enable: false,
        apply:function(context, open){

        	var nodeName = iD.data.DataType.DIVIDER;
            // 获取图层
            var nodes = context.layers().getLayersByModelName(nodeName)[0];
            if(!nodes) return;
            var self = this;

            var dividerObj = {
                'style':function(entity){
					//获取所有的graph
                    var graph = context.graph();
					//获取对应的关系
                    var effectColor = null;

					//获取点击的状态(通过判断是否为打开状态来进行渲染)
                    self.enable = open == null ? false : open;

//	        		根据是否存在关系来改变道路的颜色(存在关系为黄色;不存在则为灰色)
                    if(self.enable){
                        if (entity.tags.SOURCE == '4') {
                            effectColor = "#FFFF00";
                        } else {
                            effectColor = "#A9A9A9";
                        }
                        return {"stroke": effectColor};
                    }else {
                        return {"stroke": null};
                    }
                }
            };
//      	道路的渲染颜色
            nodes.setOptions(dividerObj);

        	refreshMap();
        }
    };

    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }

    return effect;
};
