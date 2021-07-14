iD.effects = iD.effects||{};
/**
 * 为当前选中的DIVIDER，与DREF关系中的下一个DIVIDER组成一个表示车道的面
 * R_DIVIDER_DREF的Relation
 * tags中的DIVIDER_NO表示序号
 * @param {Object} context
 */
iD.effects.DividerArea = function(context) {
	var dividerAreaParamList = [];
    var effect = {
        id: 'divider-area',
        button: 'dividerarea',
        title: t('effects.dividerArea.title'),
        iconText: 'LG',
        description: t('effects.dividerArea.description'),
        key: 'Shift+T',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this;
        	self.enable = open == null ? false : open;
        	dividerAreaParamList.length = 0;
        	
        	var graph = context.graph();
        	var selectedids = selectedids || context.selectedIDs();
        	if(!self.enable || selectedids.length != 1){
        		refreshMap();
        		return ;
        	}
        	var divider = context.entity(selectedids[0]);
        	if(divider.modelName != iD.data.DataType.DIVIDER){
        		refreshMap();
        		return ;
        	}
        	var divdierNo = parseInt(divider.tags.DIVIDER_NO);
        	if(isNaN(divdierNo) || divdierNo < 0){
        		refreshMap();
        		return ;
        	}
        	
        	var dividerRelations = graph.parentRelations(divider, iD.data.DataType.R_DIVIDER_DREF);
        	// 没有dref的关系
        	// 必须是参考线
        	if(dividerRelations.length == 0 || divider.tags.R_LINE != "1"){
        		refreshMap();
        		return ;
        	}
        	// 相邻的前后参考线
        	var entityList = getDirectionDividers(divider);
        	// console.log("当前选中的参考线及相邻参考线: ", _.clone(entityList));
        	
        	var getDrefRLine = getDrefRelationsRLineFunc();
        	// 获取当前DREF组中所有车道的关联的参考线
        	for(let idx in dividerRelations){
        		let rel = dividerRelations[idx];
        		let rlineMap = {};
        		// 可能有这种情况, {|}是参考线
				// || |  |{|}
				// ||{|}				------当前选中的参考线
				// || |  |{|}
        		// 若DREF组中某个DIVIDER起点关联的车道有R_LINE为1的情况，也要加入渲染
        		
				// DREF组内每条DIVIDER前后相交的参考线车道
        		for(let i in rel.members){
        			let dv = context.hasEntity(rel.members[i].id);
	        		if(!dv || dv.id == divider.id){
    					continue ;
    				}
	        		// 获取相邻的普通divider
	        		let dvList = getDirectionDividers(dv, divider.tags.DIRECTION, false);
	        		if(dvList[0] && dvList[0].length){
	        			for(let j in dvList[0]){
	        				let dvitem = dvList[0][j];
	        				let itemRLines = getDrefRLine(dvitem);
	        				itemRLines.length && entityList[0].push( ...itemRLines );
	        			}
	        		}
	        		if(dvList[2] && dvList[2].length){
	        			for(let j in dvList[2]){
	        				let dvitem = dvList[2][j];
	        				let itemRLines = getDrefRLine(dvitem);
	        				itemRLines.length && entityList[2].push( ...itemRLines );
	        			}
	        		}
        		}
        	}
        	// console.log("当前选中的参考线遍历每一项相邻参考线: ", entityList);
        	
        	var resultList = [];
        	for(let idx in entityList){
        		let entityArr = entityList[idx];
        		for(let arrIdx in entityArr){
        			let entity = entityArr[arrIdx];
	        		if(!entity){
	        			continue ;
	        		}
	        		let entityNo = parseInt(entity.tags.DIVIDER_NO);
	        		if(isNaN(entityNo) || entityNo < 0){
	        			continue ;
	        		}
	        		// 一个参考线只会有一个DREF组的关系
	        		let relations = graph.parentRelations(entity, iD.data.DataType.R_DIVIDER_DREF);
	        		relations = [relations[0]];
	        		// 找到序号比当前entity大一的entity
	        		// let nextEntity;
	        		let noMaxEntity;
	        		for(let i in relations){
	        			let rel = relations[i];
	        			for(let j in rel.members){
	        				let dv = rel.members[j];
	        				dv = context.hasEntity(dv.id);
	        				if(!dv || dv.id == entity.id){
	        					continue ;
	        				}
	        				let dvNo = parseInt(dv.tags.DIVIDER_NO);
	        				if(isNaN(dvNo) || dvNo < 0){
	        					continue ;
	        				}
	        				// DIVIDER_NO字段最大的entity
	        				if(!noMaxEntity){
	        					noMaxEntity = dv;
	        				}
	        				let maxNo = parseInt(noMaxEntity.tags.DIVIDER_NO);
	        				if(dvNo >= maxNo){
	        					noMaxEntity = dv;
	        				}
	        			}
	        		}
	        		if(!noMaxEntity){
	        			continue ;
	        		}
	        		let isForward = entity.tags.DIRECTION != "3";
	        		let param = {
	        			forward: isForward,
	        			index: idx,
	        			entity: entity,
	        			nextEntity: noMaxEntity,
	        			nodes: []
	        		};
	        		
        			if(isForward){
        				param.nodes.push( ...graph.childNodes(entity) );
        			}else {
        				param.nodes.push( ..._.clone(graph.childNodes(entity)).reverse() );
        			}
        			let rel = relations[0];
        			if(rel && rel.members.length > 2){
        				let dvs = [];
        				for(let midx in rel.members){
        					let dv = rel.members[midx];
        					dv = context.hasEntity( dv.id );
        					if(!dv){
        						continue ;
        					}
        					if(dv.id == entity.id){
        						continue ;
        					}else if(dv.id == noMaxEntity.id){
        						continue ;
        					}else if(isNaN( parseInt(dv.tags.DIVIDER_NO) )){
        						continue ;
        					}
        					dvs.push(dv);
        				}
        				// 需要排序
        				// 升序
        				dvs.sort(function(dv1, dv2){
        					return parseInt(dv1.tags.DIVIDER_NO) - parseInt(dv2.tags.DIVIDER_NO);
        				});
        				
        				// dvs.reverse();
        				// push终点
        				for(let dvidx in dvs){
        					let dv = dvs[dvidx];
        					let lastNode = context.hasEntity(dv.nodes[isForward ? dv.nodes.length - 1 : 0]);
        					lastNode && param.nodes.push(lastNode);
        				}
        				
        				// 边框
        				if(isForward){
        					// graph.childNodes有缓存，需要将结果clone一份后再反转
        					param.nodes.push( ..._.clone(graph.childNodes(noMaxEntity)).reverse() );
        				}else {
        					param.nodes.push( ...graph.childNodes(noMaxEntity) );
        				}
        				
        				// 反方向，push起点
        				dvs.reverse();
        				for(let dvidx in dvs){
        					let dv = dvs[dvidx];
        					let lastNode = context.hasEntity(dv.nodes[isForward ? 0 : dv.nodes.length - 1]);
        					lastNode && param.nodes.push(lastNode);
        				}
        			}else {
        				if(isForward){
        					// graph.childNodes有缓存，需要将结果clone一份后再反转
        					param.nodes.push( ..._.clone(graph.childNodes(noMaxEntity)).reverse() );
        				}else {
        					param.nodes.push( ...graph.childNodes(noMaxEntity) );
        				}
        			}
	        		param.nodes.push(param.nodes[0]);
	        		
	        		resultList.push(param);
        		}
        		
        		// resultList[idx] = param;
        	}
        	
        	var resultMap = {};
        	resultList = resultList.filter(function(item){
        		let flag = resultMap[item.entity.id] == undefined;
        		resultMap[item.entity.id] = true;
        		return flag;
        	});
        	
        	// console.log("车道区域数据：", resultList);
        	
        	dividerAreaParamList = resultList;
        	refreshMap();
        }
    };
    
    /**
     * 创建一个根据divider获取其DREF的relations，并遍历出其中的参考线的函数
     * 有缓存，不会重复获取
     */
    function getDrefRelationsRLineFunc(){
    	var cache = {};
    	
    	return function(entity){
    		var result = [];
    		var graph = context.graph();
    		var relations = graph.parentRelations(entity, iD.data.DataType.R_DIVIDER_DREF);
    		for(let i in relations){
    			let rel = relations[i];
    			for(let j in rel.members){
    				let dv = context.hasEntity( rel.members[j].id );
    				if(!dv){
    					continue;
    				}
    				if(dv.tags.R_LINE == '1' && cache[dv.id] == undefined){
    					result.push(dv);
    					cache[dv.id] = true;
    				}
    			}
    		}
    		
    		return result;
    	}
    }
    
    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    
    /**
     * 获取当前DIVIDER的前后两个车道（R_LINE为1）
     * @param {Object} entity
     * @param {String} directionParam 指定方向
     * @param {Boolean} isRLine 是否只获取参考线，true为是，false为获取普通DIVIDER
     * @return 入口车道，当前车道，出口车道
     */
    function getDirectionDividers(entity, directionParam, isRLine){
    	isRLine = isRLine == null ? true : isRLine;
    	var entityList = [[], [entity], []];
    	
    	var dirParam = getDirectionNodeParam(entity, directionParam);
    	var prevNode = dirParam.firstNode, nextNode = dirParam.lastNode;
    	var isForward = dirParam.isForward;
    	if(!prevNode || !nextNode){
    		return entityList;
    	}
    	var graph = context.graph();
    	var prevEntities = graph.parentWays( context.entity(prevNode) );
    	var nextEntities = graph.parentWays( context.entity(nextNode) );
    	// 进入车道组，当前车道的起点是上个车道的终点
    	entityList[0] = prevEntities.filter(function(d){
    		let flag = d.id != entity.id;
    		// && d.nodes[d.nodes.length - 1] == prevNode;
    		if(flag){
    			let param = getDirectionNodeParam(d);
    			flag = param.lastNode == prevNode;
    		}
    		if(isRLine && flag){
    			flag = d.tags.R_LINE == "1";
    		}
    		return flag;
    	});
    	// 退出车道组，当前车道的终点是下个车道的起点
    	entityList[2] = nextEntities.filter(function(d){
    		let flag = d.id != entity.id 
			//  && d.nodes[0] == nextNode;
    		if(flag){
    			let param = getDirectionNodeParam(d);
    			flag = param.firstNode == nextNode;
    		}
    		if(isRLine && flag){
    			flag = d.tags.R_LINE == "1";
    		}
    		return flag;
    	});
    	
    	return entityList;
    }
    
    function getDirectionNodeParam(entity, directionParam){
    	let firstNode, lastNode, isForward;
    	switch(directionParam || entity.tags.DIRECTION){
    		case "":
    		case "1":
    		case "2":
    			// 正向
    			firstNode = entity.nodes[0];
    			lastNode = entity.nodes[entity.nodes.length - 1];
    			isForward = true;
    			break;
    		case "3":
    			// 逆向
    			firstNode = entity.nodes[entity.nodes.length - 1];
    			lastNode = entity.nodes[0];
    			isForward = false;
    			break;
    	}
    	
    	return {firstNode, lastNode, isForward};
    }
    
    
    // 宣州divider后
    context.event.on('selected.effect-dividerArea', function(selectedEntities){
    	/*
    	if(!entities || !entities.length){
    		effect.enable && effect.apply.call(effect, context, effect.enable);
    		return ;
    	}
    	if(!effect.enable){
    		return ;
    	}
    	*/
    	
    	effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });
    
    context.map().on('drawn.effect-dividerArea', function(param){
    	// full 为true时代表拖拽、缩放等操作触发的drawn
    	if(!param.full){
    		return ;
    	}
    	var surface = context.map().surface;
		surface
        	.select('.layer-divider_effectareas')
        	.html('');
    	if(!effect.enable){
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
		/*
        areas = d3.values(areas).filter(function hasPath(a) {return path(a.entity); });
        areas.sort(function areaSort(a, b) { return b.area - a.area; });
        areas = _.pluck(areas, 'entity');
		*/

        var data = {
            // clip: areas.filter(clip),
            shadow: areas,
            stroke: areas,
            fill: areas
        };
		/*
        var clipPaths = surface.selectAll('defs').selectAll('.clipPath')
           .filter(filter)
           .data(data.clip, iD.Entity.key);

        clipPaths.enter()
           .append('clipPath')
           .attr('class', 'clipPath')
           .attr('id', function(entity) { return entity.id + '-clippath'; })
           .append('path');

        clipPaths.selectAll('path')
           .attr('d', path);

        clipPaths.exit()
           .remove();
		*/

        var areagroup = surface
            .select('.layer-divider_effectareas')
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
            // , iD.Entity.key
            // data的第二个参数，可以去除重复
            
        // var fills = areagroup.selectAll('.area-fill path.area')[0];
		
        paths.enter()
            .append('path')
            .each(function(item) {
            	var entity = item.entity;
                var layer = this.parentNode.__data__;
                // index：0入口，1当前，2出口
                // 样式：0蓝色，1绿色，2红色
                var effectClass = 'effectarea-' + item.index;
				
				//  + ' ' + entity.id
                this.setAttribute('class', effectClass + ' ' + entity.type + ' area ' + layer);
				/*
                if (layer === 'fill' && clip(entity)) {
                    this.setAttribute('clip-path', 'url(#' + entity.id + '-clippath)');
                }

                if (layer === 'fill') {
                    setPattern.apply(this, arguments);
                }
                */
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
