iD.effects = iD.effects||{};
/**
 * 测量信息高亮显示，绿色方块
 * @param {Object} context
 */
iD.effects.measureInfoHighlight = function(context) {
    var effect = {
        id: 'measureInfo-highlight',
        button: 'measureInfohighlight',
        title: t('effects.measureInfoHighlight.title'),
        iconText: 'MI',
        description: t('effects.measureInfoHighlight.description'),
        key: 'Shift+M',
        // 是否开启的状态
        enable: false,
        apply:function(context, open){
        	var dividerName = iD.data.DataType.DIVIDER,
				layers = context.layers().getLayersByModelName(dividerName),
				self = this;
        	self.enable = open == null ? false : open;
            context.variable.isMeasureInfoHighlight = self.enable;
        	var layer;
        	for(let i=0;i<layers.length;i++){
                layer = layers[i];
                if(!self.enable && layer.nodeDomStyleMap && layer.nodeDomStyleMap[iD.data.DataType.MEASUREINFO]){
                    delete layer.nodeDomStyleMap[iD.data.DataType.MEASUREINFO];
                }
                var optionObj = {
                    'style':function(entity){
                    	return {};
                    }
                };
                
            	optionObj.nodeDomStyleMap = layer.nodeDomStyleMap || {};
            	// DA/Measureinfo同时显示特效；
            	optionObj.nodeDomStyleMap[iD.data.DataType.MEASUREINFO] = function(entity, gdom){
                    if(entity.modelName != iD.data.DataType.DIVIDER_NODE){
                        return ;
                	}
                    var graph = context.graph(),
                        currentTrackId = iD.picUtil.player && iD.picUtil.player.wayInfo.trackId;
                        // currentTrackPointId = iD.picUtil.player.getCurrentPic_node();

                    var $g = d3.select(gdom);
                    $g.selectAll('rect.measureinfo').remove();
                    $g.selectAll('*').style('display', null);
                    if(!self.enable){
                        $g.classed('_measureinfo', false);
                        domStyleDA($g);
                        return ;
                    }

                    var relations = graph.parentRelations(entity, iD.data.DataType.MEASUREINFO);
                    if (!relations.length) {
                        $g.classed('_measureinfo', false);
                        domStyleDA($g);
                        return;
                    }

                    var measureinfo = relations[0],
                    	PARAMETER = JSON.parse(measureinfo.tags.PARAMETER),
                        trackId = PARAMETER.Paras.nodes[0] ? PARAMETER.Paras.nodes[0].trackId :'';
                        // trackPointId = PARAMETER.Paras.nodes[0].trackPointId;

                	if (trackId != currentTrackId) {
                        $g.selectAll('rect.measureinfo').remove();
                        $g.selectAll('*').style('display', null);
                        $g.classed('_measureinfo', false);
                        domStyleDA($g);
                		return;
					}

                	$g.classed('v', true);
                	$g.selectAll('*').each(function(){
                		var $this = d3.select(this);
                		if($this.classed('shadow')) return;
                		if($this.classed('fill')) return;
                		// DA/LA同时渲染；
                		if($this.classed('divider_attribute')) return ;
                		$this.style('display', 'none');
                	});
                    var fill = "rgb(210,105,30)",
						stroke = "rgb(210,105,30)";
                	if (iD.picUtil.isEffectDAAndMeasureInfoNode(entity.id)) {
                        fill = "rgb(255, 0, 0)";
						stroke = "rgb(120, 0, 0)";
					}
                	// :first-child
                	$g.insert("rect", ".stroke").classed({
                		"measureinfo": true
                	}).attr({
                		x: -7,
                		y: -7,
                		width: 14,
                		height: 14
                	}).style({
                		fill: fill,
						stroke: stroke,
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
        		if($g.classed('_measureinfo')){
        			r = 11.5;
        		}
        		r && $g.select('circle.shadow').attr('r', r);
        	}
        	
        	function clearRenderFun(){
        		var layer;
        		for(let i=0;i<layers.length;i++){
	                layer = layers[i];
	                if(!self.enable && layer.nodeDomStyleMap && layer.nodeDomStyleMap[iD.data.DataType.MEASUREINFO]){
	                	delete layer.nodeDomStyleMap[iD.data.DataType.MEASUREINFO];
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
