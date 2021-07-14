iD.effects = iD.effects||{};
/**
 * 车道线-车道分隔线属性变化点，红色圆点
 * @param {Object} context
 */
iD.effects.dividerAttrHighlight = function(context) {
    var effect = {
        id: 'divider-attr-highlight',
        button: 'dividerAttrHighlight',
        title: t('effects.dividerAttrHighlight.title'),
        iconText: 'DA',
        description: t('effects.dividerAttrHighlight.description'),
        key: 'Shift+T',
        // 是否开启的状态
        enable: false,
        apply:function(context, open){
        	var dividerName = iD.data.DataType.DIVIDER;
        	var layers = context.layers().getLayersByModelName(dividerName);
        	var self = this;
        	self.enable = open == null ? false : open;
            context.variable.isDividerAttrHighlight = self.enable;
        	var layer;
        	for(let i=0;i<layers.length;i++){
                layer = layers[i];
                if(!self.enable && layer.nodeDomStyleMap && layer.nodeDomStyleMap[iD.data.DataType.DIVIDER_ATTRIBUTE]){
                	delete layer.nodeDomStyleMap[iD.data.DataType.DIVIDER_ATTRIBUTE];
                }
                var optionObj = {
//                  nodeDomStyle: function(entity, gdom){}
                };
            	optionObj.nodeDomStyleMap = layer.nodeDomStyleMap || {};
            	// DA/LA同时显示特效；
            	optionObj.nodeDomStyleMap[iD.data.DataType.DIVIDER_ATTRIBUTE] = function(entity, gdom){
                	if(entity.modelName != iD.data.DataType.DIVIDER_NODE){
                		return ;
                	}
                	var $g = d3.select(gdom);
                	$g.selectAll('circle.divider_attribute').remove();
                	$g.selectAll('*').style('display', null);
                	if(!self.enable){
                		$g.classed('divider_attr', false);
                		domStyleLA($g);
                		return ;
                	}
                	var graph = context.graph();
                    var relations = graph.parentRelations(entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
                	if(!relations.length){
                		$g.classed('divider_attr', false);
                		domStyleLA($g);
                		return ;
                	}

                	$g.classed('divider_attr', true);
                	$g.selectAll('*').each(function(){
                		var $this = d3.select(this);
                		if($this.classed('shadow')) return;
                		if($this.classed('fill')) return;
                		// DA/LA同时渲染；
                		if($this.classed('lane_attribute')) return ;
                		$this.style('display', 'none');
                	});
                	// :first-child
                    if (iD.picUtil.isEffectDAAndMeasureInfoNode(entity.id)) {
                        $g.insert("rect", ".stroke").classed({
                            "measureinfo": true
                        }).attr({
                            x: -7,
                            y: -7,
                            width: 14,
                            height: 14
                        }).style({
                            fill: "rgb(255, 0, 0)",
                            stroke: "rgb(120, 0, 0)",
                            "stroke-width": 1
                        });
                    } else {
                        $g.insert("circle", ".fill").classed({
                            "divider_attribute": true
                        }).attr({
                            cx: 0,
                            cy: 0,
                            r: 5
                        }).style({
                            fill: "rgb(255, 0, 0)",
                            stroke: "rgb(120, 0, 0)",
                            "stroke-width": 1
                        });
                    }
        			domShadow($g);
                }
                layer.setOptions(optionObj);
			}
        	
        	function domStyleLA($g){
        		domShadow($g);
        		if(!$g.classed('lane_attr')){
        			return ;
        		}
    			$g.selectAll('*').each(function(){
            		var $this = d3.select(this);
            		if($this.classed('shadow')) return;
            		if($this.classed('fill')) return;
    				if($this.classed('lane_attribute')) return ;
            		$this.style('display', 'none');
            	});
        	}
        	
        	function domShadow($g){
        		var r = 7.5;
        		if($g.classed('divider_attr')){
        			r = 8.5;
        		}
        		if($g.classed('lane_attr')){
        			r = 11.5;
        		}
        		r && $g.select('circle.shadow').attr('r', r);
        	}
        	
        	function clearRenderFun(){
        		var layer;
        		for(let i=0;i<layers.length;i++){
	                layer = layers[i];
	                if(!self.enable && layer.nodeDomStyleMap && layer.nodeDomStyleMap[iD.data.DataType.DIVIDER_ATTRIBUTE]){
	                	delete layer.nodeDomStyleMap[iD.data.DataType.DIVIDER_ATTRIBUTE];
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
