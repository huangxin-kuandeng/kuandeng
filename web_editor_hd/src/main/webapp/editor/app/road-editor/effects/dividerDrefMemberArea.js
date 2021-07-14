iD.effects = iD.effects||{};
/**
 * 所有车道组内，车道线根据序号连续性渲染区域面
 * @param {Object} context
 */
iD.effects.DividerDrefMemberArea = function(context) {
	var dividerAreaParamList = [];
    var effect = {
        id: 'dividerdref-memberarea',
        button: 'dividerdref-memberarea',
        title: t('effects.dividerDrefMemberArea.title'),
        iconText: 'DG',
        description: t('effects.dividerDrefMemberArea.description'),
        key: 'Shift+Y',
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this, graph = context.graph();
        	self.enable = open == null ? false : open;
        	dividerAreaParamList.length = 0;
        	if(!self.enable){
        		refreshMap();
        		return ;
        	}
        	
        	var allDrefs = [];
        	context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity])).filter(function(entity){
        		if(entity instanceof iD.Relation && entity.modelName == iD.data.DataType.R_DIVIDER_DREF){
        			allDrefs.push(entity);
        		}
        	});
        	if(!allDrefs.length){
        		return ;
        	}
        	
        	allDrefs.forEach(function(r){
        		var dividers = _.map(_.pluck(r.members, 'id'), context.entity);
        		var numberMap = {};
        		var numberList = dividers.map(function(d){
        			var val = d.tags.DIVIDER_NO;
        			if(val == null || val == ''){
        				return false;
        			}
        			val = Number(val);
        			numberMap[val] = d;
        			return val;
        		}).filter((val)=>{return val !== false});
        		
        		if(numberList.length < 2){
        			return ;
        		}
        		// 根据number顺序，每个间断作为分割条件，生成面 数据
        		var minNum = _.min(numberList), maxNum = _.max(numberList);
        		
        		var begin, end, steps = [], _count = 0;
        		for(var num = minNum; num<=maxNum + 1; num++){
        			let divider = numberMap[num];
        			_count ++ ;
        			if(_count == 1){
        				// 第一条线时，下一个number不连续时不渲染
        				if(!numberMap[num + 1]){
        					continue ;
        				}
        			}
        			// 断开
        			if(!divider){
        				// 有第一个divider，与结束divider
        				if(begin && end && begin.id != end.id){
        					steps.pop();
        					var nodes = getAreaNodes(graph, begin, end, steps);
        					if(nodes.length >= 4){
        						dividerAreaParamList.push({
        							entity: r,
			        				nodes: nodes
        						});
        					}
        					begin = end = null;
        					steps.length = 0;
        				}
        				continue ;
        			}
        			// 只记录第一个
        			if(begin){
        				steps.push(divider);
        			}else {
        				begin = divider;
        			}
        			end = divider;
        		}
        	});
        	
        	// console.log("车道区域数据：", resultList);
        	refreshMap();
        }
    };
    
    /**
     * 生成多边形坐标组
     * @param {Object} graph
     * @param {Object} begin
     * @param {Object} end
     * @param {Array} steps
     */
    function getAreaNodes(graph, begin, end, steps){
    	var nodes = [];
    	nodes.push(...graph.childNodes(begin));
    	var midList = _.clone(steps);
    	for(var d of midList){
    		var e = graph.hasEntity(_.last(d.nodes));
    		if(e) nodes.push(e);
    	}
    	var endNodes = _.clone(graph.childNodes(end));
    	endNodes.reverse();
    	nodes.push(...endNodes);
    	
    	midList.reverse();
    	for(var d of midList){
    		var e = graph.hasEntity(_.first(d.nodes));
    		if(e) nodes.push(e);
    	}
    	nodes.length && nodes.push(nodes[0]);
    	return nodes;
    }
    
    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    
    context.map().on('drawn.effect-dividerDrefMemberArea', function(param){
    	// full 为true时代表拖拽、缩放等操作触发的drawn
    	if(!param.full){
    		return ;
    	}
    	var surface = context.map().surface;
		surface
        	.select('.layer-dref_memberareas')
        	.html('');
    	if(!effect.enable || !dividerAreaParamList.length){
    		return ;
    	}
    	
//  	var path = iD.svg.Path(projection, graph, true);
    	var pathFun = function(item){
    		let polygon = true;
    		let round = iD.svg.Round().stream,
    			projection = context.projection,
	            clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
	            project = projection.stream,
	            path = d3.geo.path()
	                .projection({stream: function(output) { return polygon ? project(round(output)) : project(clip(round(output))); }});
	        
    		let coordinates = _.pluck(item.nodes, 'loc');
    		let geoJson = {
                type: 'Polygon',
                coordinates: [coordinates]
            };
            
            return path(geoJson);
    	};
    	var filter = function(){return true};
    	
        var areas = dividerAreaParamList;
        areas = areas.filter(function(item) {
			return item != null;
		});

        var data = {
            // clip: areas.filter(clip),
            shadow: areas,
            stroke: areas,
            fill: areas
        };

        var areagroup = surface
            .select('.layer-dref_memberareas')
            .selectAll('g.areagroup')
            .data(['fill', 'shadow', 'stroke']);

        areagroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer areagroup area-' + d; });

        var paths = areagroup
            .selectAll('path')
            .filter(filter)
            .data(function(layer) {
            	return data[layer];
            });
		
        paths.enter()
            .append('path')
            .each(function(item) {
            	var entity = item.entity;
                var layer = this.parentNode.__data__;
                // index：0入口，1当前，2出口
                // 样式：0蓝色，1绿色，2红色
                var effectClass = 'effectarea-' + (item.index || 0);
				
				//  + ' ' + entity.id
                this.setAttribute('class', effectClass + ' ' + entity.type + ' area ' + layer);
            });

        paths
            .attr('d', pathFun);

        // Remove exiting areas first, so they aren't included in the `fills`
        // array used for sorting below (https://github.com/openstreetmap/iD/issues/1903).
        paths.exit()
            .remove();
        areagroup.exit()
            .remove();
    	
    });

    return effect;
};
