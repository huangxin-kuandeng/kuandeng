iD.svg.WalkEnter = function(projection, context) {
    var radiuses = {
        //       z16-, z17, z18+, tagged
        shadow: [6,    7.5,   7.5,  11.5],
        stroke: [2.5,  3.5,   3.5,  7],
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
                vertices[entity.id] = entity;
            }
        }

        ids.forEach(function(id) {
            var entity = context.hasEntity(id);
            if (entity && entity.type === 'node') {
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

    function draw(selection, vertices, klass, graph, zoom) {
        var icons = {},
            z;

        if (zoom < 17) {
            z = 0;
        } else if (zoom < 18) {
            z = 1;
        } else {
            z = 2;
        }

        var groups = selection.data(vertices, function(entity) {
               return iD.Entity.key(entity);
//          return entity.modelName != undefined;
        });

        function icon(entity) {
            if (entity.id in icons) return icons[entity.id];
            icons[entity.id] =
                entity.hasInterestingTags() &&
                context.presets().match(entity, graph).icon;
            return icons[entity.id];
        }

        function styleCircle(d) {
            //console.warn("d.layerInfo()",d.layerInfo());
            //console.warn("d",d);
            var lay = iD.Layers.getLayer(d.layerId);
            if(lay.isRoad()){
                rod = 'road';
                if(lay.nodestyle){
                    var s;
                    if(_.isFunction(lay.nodestyle)){
                        s = lay.nodestyle(d);
                    }else{
                        s = lay.nodestyle;
                    }
                    if(s && s.fill == null){
                        s.fill = this.getAttribute('d-fill');
                    }
                    d3.select(this).style(s);
                }
            }
        }

        function classCircle(klass) {
            var rads = radiuses[klass];
            return function(d) {
                // var i = icon(entity),
                //     c = i ? 0.5 : 0,
                //     r = rads[i ? 3 : zoom];
                // this.setAttribute('class', 'node vertex ' + klass + ' ' + entity.id);
                // this.setAttribute('cx', c);
                // this.setAttribute('cy', -c);
                // if (!entity.isInterestingTags()) this.setAttribute('r', r * 1.1);//处理普通中间节点(2)
                // else this.setAttribute('r', r * 1.3);

                this.setAttribute('class', 'node vertex ' + klass + ' ' + d.id);

            };
        }

        function setAttributes(selection) {
            ['shadow','stroke','fill'].forEach(function(klass) {
                var rads = radiuses[klass];
                selection.selectAll('.' + klass)
                    .each(function(entity) {
                        var i = z && icon(entity),
                            c = i ? 0.5 : 0,
                            r = rads[i ? 3 : z];
                        this.setAttribute('cx', c);
                        this.setAttribute('cy', -c);
                        if(entity.modelName === "RoadNode"){
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
       function isShared(entity,self){
           
            if(!graph.isShared(entity)){
                    //非共享节点
                    if(entity.modelName === iD.data.DataType.ROAD_NODE  && self.childNodes.length){
                        //self.childNodes[1].style.fill = "#FF0000";
                        if(self.childNodes.length === 3){
                            self.childNodes[1].style.fill = "#FF0000"
                            self.childNodes[1].setAttribute('d-fill',"#FF0000");
                        };
                    }
                }else{
                    //排除虚拟线(roadcrossline)
                    var haveCrossWay = false, parentWays = graph.parentWays(entity);
                    _(parentWays).each(function(way){
                        if(way.isOneRoadCrossWay()){
                            haveCrossWay = true;
                            return false;
                        }
                    });
                    //如果有且仅有一条虚线，则不改变原来点的颜色
                    //如果不仅包含实线，还包含虚线，则变成灰色的颜色
                    if(parentWays.length === 2 && haveCrossWay){
                        if(self.childNodes[1]){
                            self.childNodes[1].style.fill = "#FF0000";
                            self.childNodes[1].setAttribute('d-fill',"#FF0000");
                        }
                    }else{
                        // 2015-11-12 add 代码与css重复，原有<g class="shared"> 已经控制颜色是灰色，写在style中影响步导单独设置颜色 暂时取消
                        // if(self.childNodes[1]){
                        //     self.childNodes[1].style.fill = "#aaa";
                        //     self.childNodes[1].setAttribute('d-fill',"#aaa");
                        // } 
                    }
                }
                return graph.isShared(entity); 
        }

        var enter = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node vertex ' + klass + ' ' + d.id; })
            //lxj 2015-11-12 add 增加步导端点样式
            .classed("walknode",function(d){
                return d.isWalkEnter();
            })/*.classed("walkRelation",function(d){
               return hasRelWithRoad(d,graph);
            });*/
        //vertices.forEach(function(d){
/*            selection.classed("walkRelation",function(d){
                return true;
            });*/
        //})


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
            .attr('transform', iD.svg.PointTransform(projection))
            .classed('shared', function(entity) {
            	
                return isShared(entity,this);
            	
            })
            .call(setAttributes);

        groups.classed('vertex-hidden',function(d){
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
        
        
        groups.exit()
            .remove();
        
        selection.selectAll('.stroke')
            .each(styleCircle);
    }

    function drawWalkEnter(surface, graph, entities, filter, extent, zoom) {
        var selected = siblingAndChildVertices(context.selectedIDs(), graph, extent),
            vertices = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];

            if (entity.geometry(graph) !== 'vertex'){
                continue;
            }
            if(!entity.modelName){
            	continue ;
            }
            
            //add isInterestingTags() is roadNode
            if ((entity.isWalkEnter && entity.isWalkEnter())||(entity.id in selected &&entity.tags&&iD.data.DataType.WALKLINK==entity.modelName)||
                entity.isIntersection(graph) || (entity.id in selected && entity.isWalkAreaPoint && entity.isWalkAreaPoint())) {

                vertices.push(entity);
            }
        }

        function hasRelWithRoad(entity,graph){
            var relations = graph.parentRelations(entity);
            for(var i = 0;i<relations.length;i++){
                if(relations[i].modelName == iD.data.DataType.RELWKETROAD){
                    return true;
                }
            }
            return false;
        }
       	var layer_walkenter= surface.select('.layer-walk').selectAll("g.layer.layer-walkenter").data([0]);
       	layer_walkenter.enter().append("g").attr("class","layer layer-walkenter");
        surface.select('.layer-walkenter').selectAll('g.vertex.vertex-persistent')
            .filter(filter)
            .call(draw, vertices, 'vertex-persistent', graph, zoom);
        surface.select('.layer-walkenter').selectAll('g.vertex.vertex-persistent')
            .filter(filter).classed("walkRelation",function(d){
                return hasRelWithRoad(d,graph);
            });
        
    }



    return drawWalkEnter;
};
