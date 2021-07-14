iD.effects = iD.effects||{};
/**
 * 是否显示形点数据
 * 默认为展示，点击按钮后变为不显示
 * @param {Object} context
 */
iD.effects.ShapePoint = function(context) {
    var effect = {
        id: 'shape-point',
        button: 'shapepoint',
        title: t('effects.shapepoint.title'),
        iconText: 'SP',
        description: t('effects.shapepoint.description'),
        key: 'Shift+S',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this;
        	self.enable = open == null ? false : open;

            context.variable.showShapePoint = false;
        	if(self.enable){
        		context.variable.showShapePoint = true;
        	}
        	refreshMap();
        }
    };

    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    return effect;
};
