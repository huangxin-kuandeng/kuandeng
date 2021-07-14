iD.effects = iD.effects||{};
/**
 * 车道线-车道属性变化点，蓝色方块
 * @param {Object} context
 */
iD.effects.laneHighlight = function(context) {
    var effect = {
        id: 'lane-highlight',
        button: 'lanehighlight',
        title: t('effects.laneHighlight.title'),
        iconText: 'LA',
        description: t('effects.laneHighlight.description'),
        key: 'Shift+E',
        // 是否开启的状态
        enable: false,
        apply:function(context, open){
        	var dividerName = iD.data.DataType.DIVIDER;
        	var layers = context.layers().getLayersByModelName(dividerName);
        	var self = this;
        	self.enable = open == null ? false : open;
            context.variable.isLaneHighlight = self.enable;
        	var layer;
        	for(let i=0;i<layers.length;i++){
                layer = layers[i];
                var optionObj = {
                    'style':function(entity){
                    	return {};
                    	
                    	if(entity.modelName != iD.data.DataType.DIVIDER){
                    		return {"stroke": null};
                    	}
                        var graph = context.graph();
                        var relations = graph.parentRelations(entity, iD.data.DataType.LANE_ATTRIBUTE);
                        var effectColor = null;

                        if(self.enable){
                            //laneAttribute存在则为红色,否则为蓝色
                            if (relations.length > 0) {
                                effectColor = "#ff0000";
                            } else {
                                effectColor = "#0000FF";
                            }
                            return {"stroke": effectColor};
                        }else {
                            return {"stroke": null};
                        }
                    }
//                  nodeDomStyle: function(entity, gdom){}
                };
                
            	optionObj.nodeDomStyleMap = layer.nodeDomStyleMap || {};
            	// DA/LA同时显示特效；
            	optionObj.nodeDomStyleMap[iD.data.DataType.LANE_ATTRIBUTE] = function(entity, gdom){
                	if(entity.modelName != iD.data.DataType.DIVIDER_NODE){
                		return ;
                	}
                	var $g = d3.select(gdom);
                	$g.selectAll('rect.lane_attribute').remove();
                	$g.selectAll('*').style('display', null);
                	if(!self.enable){
                		$g.classed('lane_attr', false);
                		domStyleDA($g);
                		return ;
                	}
                	var graph = context.graph();
                    var relations = graph.parentRelations(entity, iD.data.DataType.LANE_ATTRIBUTE);
                	if(!relations.length){
                		$g.classed('lane_attr', false);
                		domStyleDA($g);
                		return ;
                	}
                	
                	$g.classed('lane_attr', true);
                	$g.selectAll('*').each(function(){
                		var $this = d3.select(this);
                		if($this.classed('shadow')) return;
                		if($this.classed('fill')) return;
                		// DA/LA同时渲染；
                		if($this.classed('divider_attribute')) return ;
                		$this.style('display', 'none');
                	});
                	// :first-child
                	$g.insert("rect", ".stroke").classed({
                		"lane_attribute": true
                	}).attr({
                		x: -7,
                		y: -7,
                		width: 14,
                		height: 14
                	}).style({
                		fill: "rgb(0, 248, 255)",
						stroke: "rgb(0, 81, 255)",
						"stroke-width": 1
                	});
            		domShadow($g);
                }
                layer.setOptions(optionObj);
			}
        	
        	function domStyleDA($g){
            	domShadow($g);
        		if(!$g.classed('divider_attr')){
        			return ;
        		}
    			$g.selectAll('*').each(function(){
            		var $this = d3.select(this);
            		if($this.classed('shadow')) return;
            		if($this.classed('fill')) return;
    				if($this.classed('divider_attribute')) return ;
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
	                if(!self.enable && layer.nodeDomStyleMap && layer.nodeDomStyleMap[iD.data.DataType.LANE_ATTRIBUTE]){
	                	delete layer.nodeDomStyleMap[iD.data.DataType.LANE_ATTRIBUTE];
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
