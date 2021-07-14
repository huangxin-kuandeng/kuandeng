iD.effects = iD.effects||{};
/**
 * DIVIDER_NODE：自动化标识“人工”，渲染绿色圆点
 * @param {Object} context
 */
iD.effects.flagNodeHighlight = function(context) {
    var effect = {
        id: 'flagnode-highlight',
        button: 'flagnode-highlight',
        title: t('effects.flagNodeHighlight.title'),
        iconText: 'FG',
        description: t('effects.flagNodeHighlight.description'),
        key: 'Shift+F',
        // 是否开启的状态
        enable: false,
        apply:function(context, open){
        	var layerMName = iD.data.DataType.DIVIDER_NODE;
        	var layers = context.layers().getLayersByModelName(layerMName);
        	var self = this;
            self.enable = open == null ? false : open;
            context.variable.isFlagNodeHighlight = self.enable;
        	var layer;
        	for(let i=0;i<layers.length;i++){
                layer = layers[i];
                var optionObj = {};
            	// DA/LA同时显示特效；
            	optionObj.nodeDomStyle = function(entity, gdom){
                	if(entity.modelName != iD.data.DataType.DIVIDER_NODE){
                		return ;
                	}
                	var $g = d3.select(gdom);
                	$g.selectAll('circle.node_breakpoint').remove();
                	$g.selectAll('*').style('display', null);
                	// 强制打断点
                	if(!self.enable){
                		$g.classed('flagnode_highligh', false);
                		return ;
                	}
                	if(entity.tags.FLAG != '2') {
                		$g.classed('flagnode_highligh', false);
                		return ;
                	}
                	$g.classed('flagnode_highligh', true);
                	$g.selectAll('*').each(function(){
                		var $this = d3.select(this);
                		if($this.classed('shadow')) return;
                		if($this.classed('fill')) return;
                		$this.style('display', 'none');
                	});
                	// :first-child
                	$g.insert("circle", ".fill").classed({
                		"node_breakpoint": true
                	}).attr({
                		cx: 0,
                		cy: 0,
                		r: 5
                	}).style({
                		fill: "rgb(90, 253, 90)",
						stroke: "rgb(0, 127, 0)",
						"stroke-width": 1
                	});
                	// hover高亮层
        			$g.select('circle.shadow').attr('r', 8.5);
                }
                layer.setOptions(optionObj);
			}
        	
        	function clearRenderFun(){
        		var layer;
        		for(let i=0;i<layers.length;i++){
	                layer = layers[i];
	                if(!self.enable && layer.nodeDomStyle){
	                	delete layer.nodeDomStyle;
	                }
                }
        	}
        	
        	//重新渲染地图
       		context.map().dimensions(context.map().dimensions());
       		!self.enable && clearRenderFun();
        }
    };

    return effect;
};
