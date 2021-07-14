/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:37
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-27 14:20:24
 * @Description: 
 */
iD.svg.Vertices = function(projection, context) {
    var radiuses = {
        //       z16-, z17, z18+, tagged
        shadow: [6,    7.5,   7.5,  11.5],
        stroke: [2.5,  3.0,   3.0,  7],
        // stroke: [2.5,  3.5,   3.5,  7],
        fill:   [1,    1.5,   1.5,  1.5]
    };

    var hover;

    function siblingAndChildVertices(ids, graph, extent) {
        var vertices = {};

        function addChildVertices(entity) {
            var i;
            if (entity.type === 'way') {
                for (i = 0; i < entity.nodes.length; i++) {
                    addChildVertices(graph.entity(entity.nodes[i]));
                }
            } else if (entity.type === 'relation') {
                for (i = 0; i < entity.members.length; i++) {
                    var member = context.hasEntity(entity.members[i].id);
                    if (member) {
                        addChildVertices(member);
                    }
                }
            } else if (entity.intersects(extent, graph)) {
            	// 在视野范围内
                vertices[entity.id] = entity;
            }
        }

        ids.forEach(function(id) {
            var entity = context.hasEntity(id);
            if (entity && entity.type === 'node'&&entity.geometry(graph) == 'vertex') {
/*                if((entity.isRoadCross && entity.isRoadCross()))
                {
                    return;
                }*/
                vertices[entity.id] = entity;
                context.graph().parentWays(entity).forEach(function(entity) {
                    addChildVertices(entity);
                });
            } else if (entity) {
                addChildVertices(entity);
            }
        });

        return vertices;
    }

    function draw(selection, vertices, klass, graph, zoom, execEffect=true) {
        var icons = {},
            z;

        if (zoom < 17) {
            z = 0;
        } else if (zoom < 18) {
            z = 1;
        } else {
            z = 2;
        }
        var vs=[];
        
     
        vertices.forEach(function(entity){
 
           	if(entity.modelName){
           		vs.push(entity);
          	}
        })
        vertices=vs;
        var groups = selection.data(vertices, function(entity) {
            return iD.Entity.key(entity);
        });

        function icon(entity) {
            if (entity.id in icons) return icons[entity.id];
            icons[entity.id] =
                entity.hasInterestingTags() &&
                context.presets().match(entity, graph).icon;
            return icons[entity.id];
        }

        function styleCircle(d) {
            
            var lay = iD.Layers.getLayer(d.layerId);
            if(lay && _.isFunction(lay.nodestyle)){
	           	s = lay.nodestyle(d);
	       	}else{
	           	s = lay && lay.nodestyle || null;
	       	}
            d3.select(this).style(s);
        }

        function classCircle(klass) {
            return function(d) {
              
                this.setAttribute('class', 'node vertex ' + klass + ' ' + d.id);

            };
        }
		
		// 点样式
        function setAttributes(selection) {
        	// ['shadow','stroke','fill']
        	// 普通点的样式
            ['shadow','stroke', 'fill'].forEach(function(klass) {
                var rads = radiuses[klass];
                selection.selectAll('.' + klass)
                    .each(function(entity) {
                        var i = z && icon(entity),
                            c = i ? 0.5 : 0,
                            r = rads[i ? 3 : z];
                        this.setAttribute('cx', c);
                        this.setAttribute('cy', -c);
                        if(entity.modelName === "RoadNode"
                            || entity.modelName === iD.data.DataType.DIVIDER_NODE
                            || entity.modelName === iD.data.DataType.BARRIER_GEOMETRY_NODE
                            || entity.modelName === iD.data.DataType.ROAD_NODE
                            || entity.modelName === iD.data.DataType.OBJECT_PL_NODE
                            || entity.modelName === iD.data.DataType.BRIDGE_NODE
                            || entity.modelName === iD.data.DataType.HD_LANE_NODE
                        ){
                        	this.setAttribute('r', r);
                        }else{
                        	//普通点
                        	var xr = 0;
                        	switch(klass)
                        	{
                        		case 'stroke':
                        			xr = 2.75;
                        			break;
                        		case 'shadow':
                        			xr = 6.6;
                        			break;
                        		case 'fill':
                        			break;
                        			
                        	}
                        	this.setAttribute('r', xr);
                        }
                        if (i && klass === 'fill') {
                            this.setAttribute('visibility', 'hidden');
                        } else {
                            this.removeAttribute('visibility');
                        }
                    });
            });

            selection.selectAll('use')
                .each(function() {
                    if (z) {
                        this.removeAttribute('visibility');
                    } else {
                        this.setAttribute('visibility', 'hidden');
                    }
                });
        }
        
        function updateDomStyle(selection){
            if(!execEffect) return ;
            selection.each(function(entity) {
            	var lay = iD.Layers.getLayer(entity.layerId);
	            // DA/LA同时显示 特效；
	            if(lay && !_.isEmpty(lay.nodeDomStyleMap)){
	            	_.values(lay.nodeDomStyleMap).forEach((fun) => {
	            		if(!_.isFunction(fun)) return ;
	            		fun(entity, this);
	            	});
	            }
            	// nodeDomStyle
	            if(lay && _.isFunction(lay.nodeDomStyle)){
		           	lay.nodeDomStyle(entity, this);
	           	}
            });
        }
        
        // 点的svg
       	function isShared(entity,self){
           	let g = d3.select(self);
           	let parentWays = graph.parentWays(entity);
           	// 判断其他路线上是否同时使用该点（是否是共用点）
           	// 例如交叉路，路口的点是共用的
            if(!graph.isShared(entity)){
				// 多个点时判断是否为独立点
                if([
                	iD.data.DataType.DIVIDER_NODE,
                	iD.data.DataType.ROAD_NODE, 
                	iD.data.DataType.OBJECT_PL_NODE, 
                	iD.data.DataType.BRIDGE_NODE,
                	iD.data.DataType.BARRIER_GEOMETRY_NODE,
                	iD.data.DataType.HD_LANE_NODE
                ].includes(entity.modelName)
                    && self.childNodes.length
                    && [parentWays[0].first(),parentWays[0].last()].includes(entity.id)){
                    //self.childNodes[1].style.fill = "#FF0000";
                    if ( self.childNodes.length === 3 ){
                        self.childNodes[1].style.fill= "#FF0000";
                        self.childNodes[1].setAttribute('d-fill',"#FF0000");
                    }
                    // 独立节点样式
                    if(g.selectAll('rect')[0].length == 0) {
                        g.append('rect')
                            .attr('x', '-3')
                            .attr('y', '-3')
                            .attr('width', '6')
                            .attr('height', '6')
                            .style('fill', '#ff0000')
                            .style('stroke', '#ff0000')
                        g.append('circle')
                            .attr('class', 'node vertex fill ' + entity.id)
                            .attr('x', '0')
                            .attr('y', '0')
                            .attr('r', '1.5')
                            .style('fill', '#000')
                    }

                }
            }else{

                    if (parentWays.length == 2 && [
                        iD.data.DataType.DIVIDER_NODE,  
                        iD.data.DataType.ROAD_NODE, 
                        iD.data.DataType.OBJECT_PL_NODE, 
                        iD.data.DataType.BARRIER_GEOMETRY_NODE, 
                        iD.data.DataType.BRIDGE_NODE,
                        iD.data.DataType.HD_LANE_NODE
                    ].includes(entity.modelName)) {
                        if (parentWays.length == 2) {
//                  if (parentWays.length >= 2 &&
//                      [iD.data.DataType.DIVIDER_NODE,iD.data.DataType.ROAD_NODE].includes(entity.modelName)) {
//                      if (parentWays.length >= 2) {
                        	// 共用节点样式
                        	// 没有设置共用点的样式时，添加样式
                            if( g.selectAll('rect')[0].length == 0 ) {

                                g.append('rect')
                                    .attr('x', '-4')
                                    .attr('y', '-4')
                                    .attr('width', '8')
                                    .attr('height', '8')
                                    .style('fill', '#FFFFFF')
//                                  .style('stroke', '#f6634f')
                                    .style('stroke', '#666')
                                    .attr('transform', 'rotate(45,0,0)');
                                g.append('circle')
                                    .attr('class', 'node vertex fill ' + entity.id)
                                    .attr('x', '0')
                                    .attr('y', '0')
                                    .attr('r', '1.5')
                                    .style('fill', '#000');
                            }else if(g.node() && g.node().childNodes.length == 5) {
                            	
                            	// 已经是共用点，需要改变样式
                            	var $rect = g.select("rect");
                            	var $circle = d3.select(g.node().lastChild);
                            	$rect.attr('x', '-4')
                                    .attr('y', '-4')
                                    .attr('width', '8')
                                    .attr('height', '8')
                                    .style('fill', '#FFFFFF')
//                                  .style('stroke', '#f6634f')
                                    .style('stroke', '#666')
                                    .attr('transform', 'rotate(45,0,0)');
                                $circle.attr('x', '0')
                                    .attr('y', '0')
                                    .attr('r', '1.5')
                                    .style('fill', '#000');
                            }
                        }
                    }/*else if ( parentWays.length > 2 && entity.tags.datatype == iD.data.DataType.ROAD_NODE ){
                    	// entity.tags.datatype == iD.data.DataType.ROADNODE
                        if(g.selectAll('circle')[0].length == 3) {
                            g.append('circle')
                                .attr('class', 'node vertex stroke ' + entity.id)
                                .attr('x', '0')
                                .attr('y', '0')
                                .attr('r', '5')
                                .style('fill', '#999999')
                                .style('stroke','#999999')
                        }
                    }*/
                }
                return graph.isShared(entity); 
        }
       	
       	// 虚线起终点类型
       	var classTagName = ["DASHTYPE"];
        var enter = groups.enter()
            .append('g')
            .attr('class', function(d) { 
            	var tagClass = '';
            	if(classTagName.length){
            		for(var i in classTagName){
            			var tagName = classTagName[i];
            			var value = d.tags && d.tags[tagName];
            			if(value != null && value != ""){
            				tagClass += " tag-" + tagName.toLowerCase() + "-" + value;
            			}
            		}
            	}
            	
            	return 'node vertex ' + klass + ' ' + d.id + tagClass;
            })
            

        enter.append('circle')
            .each(classCircle('shadow'));

        enter.append('circle')
            .each(classCircle('stroke'));


        // Vertices with icons get a `use`.
        enter.filter(function(d) { return  })
            .append('use')
            .attr('transform', 'translate(-6, -6)')
            .attr('clip-path', 'url(#clip-square-12)')
            .attr('xlink:href', function(d) { return '#maki-' + icon(d) + '-12'; });

        // Vertices with tags get a fill.
        enter.filter(function(d) {  return !icon(d) && d.isInterestingTags(); })
            .append('circle')
            .each(classCircle('fill'));

        groups
        	// g元素，容器元素，属性会被所有的子元素继承
        	// 将loc坐标转为位置 
            .attr('transform', iD.svg.PointTransform(projection))
            .classed('shared', function(entity) {
            	// 判断是否为共用点，并且设置独立点svg内容、样式
                return isShared(entity,this);
            	
            })
            .call(setAttributes);

        groups.classed('vertex-hidden',function(d){
            return false;
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
        
        // 更新dom样式
        groups.call(updateDomStyle);
        
        
        groups.exit()
            .remove();
        
        // 如果是关系面板，selection总是没有node
        // (selection.node() ? selection : d3.select(selection[0].parentNode))
        selection.selectAll('.stroke')
            .each(styleCircle);
    }

    /*
        步导点单独渲染，过滤掉步导点
    */
    function drawVertices(surface, graph, entities, filter, extent, zoom, execEffect) {
    	// 若当前有选中的way，筛选出该way上的节点
        var selected = siblingAndChildVertices(context.selectedIDs(), graph, extent),
            vertices = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            
            if (entity.geometry(graph) !== 'vertex')
            {
                continue;
            }

			let entityIsSelected = entity.id in selected;
            // add isInterestingTags() is roadNode
            if (entityIsSelected ||
                entity.isInterestingTags() ||
                entity.isIntersection(graph)) {
                /*if(entity.isRoadCross && entity.isRoadCross())
                 {
                 console.log(entity);
                 }*/
                if(entityIsSelected){
                    vertices.push(entity);
                }else {
                    // 未处于选中的way中的节点  筛选出共用点、首节点和尾节点
                    let pways = graph.parentWays(entity);
                    if(pways.length == 0){
                        continue ;
                    }
           
                    if(context.variable.isFlagNodeHighlight && entity.tags.FLAG == '2'){
                        vertices.push(entity);
                    }else if (context.variable.showShapePoint) {
                        vertices.push(entity);
		            } else if (context.variable.showObjectPGPoint && entity.modelName == iD.data.DataType.OBJECT_PG_NODE) {//如果是第一个点，在高亮定位目标首点时使用
                        var firstNodeId = pways[0].nodes[0];
                        if (firstNodeId != entity.id) continue;

                        vertices.push(entity);
                    } else if (entity.isEndpoint(graph) || isLAPoint(entity) || isDAPoint(entity) || isBreakType(entity) || isMeasureInfoPoint(entity)) {
                    	// 悬挂点、DA、LA、强只打断点默认显示
                        vertices.push(entity);
                    }
                }
            }
        }

        surface.select('.layer-hit').selectAll('g.vertex.vertex-persistent')
            .filter(filter)
            .call(draw, vertices, 'vertex-persistent', graph, zoom, execEffect);

        drawHover(surface, graph, extent, zoom);
    }

    function isMeasureInfoPoint(entity) {
        return context.variable.isMeasureInfoHighlight && context.graph().parentRelations(entity, iD.data.DataType.MEASUREINFO).length > 0;
    }
    
    function isBreakType(entity){
    	return entity.modelName == iD.data.DataType.DIVIDER_NODE && entity.tags.DASHTYPE == '4';
    }

    function isLAPoint(entity) {
        return context.graph().parentRelations(entity, iD.data.DataType.LANE_ATTRIBUTE).length > 0;
    }

    function isDAPoint(entity) {
        return context.graph().parentRelations(entity, iD.data.DataType.DIVIDER_ATTRIBUTE).length > 0;
    }

    function drawHover(surface, graph, extent, zoom) {
        var hovered = hover ? siblingAndChildVertices([hover.id], graph, extent) : {};

        surface.select('.layer-hit').selectAll('g.vertex.vertex-hover')
            .call(draw, d3.values(hovered), 'vertex-hover', graph, zoom);
    }

    drawVertices.drawHover = function(surface, graph, _, extent, zoom) {
        if (hover !== _) {
            hover = _;
            drawHover(surface, graph, extent, zoom);
        }
    };

    return drawVertices;
};
