iD.svg.Traffic = function(projection, context) {
    
	//[1]Arrow
	var longid  = 1 , darwMinZoom = 17;
    
    function markerPath(selection, style) {

    	if(style === "shadow" || style === "stroke") {
        	
        } else {
        	selection
        		.attr('class', style)
                .attr('x', -6)
                .attr('y', -8)
                .attr('width', 45)
                .attr('height', 35)
                .attr('xlink:href', function(d){ 
                	if(d.tags.status === 1) return  context.imagePath('greenArrow.png')
                	if(d.tags.status === 2) return  context.imagePath('yellowArrow.png')
                	if(d.tags.status === 3) return  context.imagePath('redArrow.png')
                });
        }
        
        
        selection.each(function(entity) {
           
          	if (style === 'stroke') {
          		if (entity.tags.status === 1) this.style.fill = "#0f0";
          		else if (entity.tags.status === 2) this.style.fill = "#FFD82F";
          		else if (entity.tags.status === 3) this.style.fill = "#f00";
          	}

            var size = 11, coord = iD.geo.angleCoords(entity.angle,size); 
        	this.setAttribute('transform', 'translate('+ coord[0] + ', ' + coord[1] + ') rotate(' + entity.angle+ ')');
        });
    }

    function markerRulePath(selection, style) {
        
    	if(style === "stroke" || style === "shadow") {
            selection
                .attr('class', style)
                .attr('transform', 'translate(-23, -35)')
                .attr('r', '7')
                .attr('cx', '40')
                .attr('cy', '-1.8')

        } else if(style === "icon") {
            selection
                .attr('class', 'KDSEditor-icon')
                .attr('transform', 'translate(40, 0)')
                .attr('clip-path', 'url(#clip-square-20)');
        } else if(style === "image") {
            selection
                .attr('class', style)
                .attr('x', -4)
                .attr('y', -4)
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href',  context.imagePath('clock.png'));
        }

        selection.each(function(entity) {
           if (style === 'stroke') this.style.fill = "#FFD82F";
           var size = 11, coord = iD.geo.angleCoords(entity.angle,size); 
           if(style === "icon" || style === "image") {
        	   var x = coord[0], y = coord[1]; 
               coord[0] += 1 * 30 * Math.cos((Math.PI/180) * entity.angle) + x;
               coord[1] += 1 * 30 * Math.sin((Math.PI/180) * entity.angle) + y;
           }
           this.setAttribute('transform', 'translate(' + coord[0] + ', ' + coord[1] + ') rotate(' + entity.angle + ')');
        });
    }
    
    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function transpsData(editor){

         if(context.selectedIDs().length != 1 || !context.transportation.is(context.selectedIDs()[0])) return ;

         var graph = context.graph();
         var way = context.hasEntity(context.selectedIDs()[0]);
         if(!(way instanceof iD.Way)) return [];
         
         var anode = graph.entity(way.first()),
             bnode = graph.entity(way.last()), nodeId2crossId = {};
		 
		 filterNodeCross([anode, bnode], nodeId2crossId);
		 
         var a = nodeId2crossId[anode.id],
             b = nodeId2crossId[bnode.id],
             transps = {}, 
             filter = {};

         if (a && a !== '0' && a === b) return;
         
         var ans = (function(d){
               if(d == 1) {
                 return [anode,bnode];
               } else if (d == 2) {
                 return [bnode];
               } else if (d == 3) {
                 return [anode];
               } else if (d == 4) {
                 return [];
               }
               return [];
         })(way.tags.direction);
		 
         _(ans).each(function(an){
              newTransps(transps, an, way, editor, filter, nodeId2crossId);
         });

      	 filter = {};

        return transps;
    }
	
	function filterNodeCross (ans, nodeId2crossId) {
		_(ans).each(function(an){
			var parentWays = context.graph().parentWays(an);
			_(parentWays).each(function (pway) {
				if (pway.isOneRoadCrossWay()) {
					nodeId2crossId[an.id] = pway.nodes[0];
				}
			});
		});
	}
	
	function newTransps(transps, an, fromWay, editor, filter, nodeId2crossId) {
		var graph = context.graph(), 
        next, nodes, tags,  acs_entity, bcs_entity,
        anid = iD.Entity.id.toOSM(an.id), an_cross_node_id = nodeId2crossId[an.id];

		var parentWays = graph.parentWays(an);
		_(parentWays).each(function(toWay){
        	   	nodes = toWay.nodes, fnode = iD.Entity.id.toOSM(toWay.first()), tnode = iD.Entity.id.toOSM(toWay.last()),
              len = nodes.length, 
        			tags = toWay.tags;
					
				acs_entity = graph.entity(nodes[0]), bcs_entity = graph.entity(nodes[len - 1]);
				filterNodeCross([acs_entity, bcs_entity], nodeId2crossId);
				var acs = nodeId2crossId[acs_entity.id], bcs = nodeId2crossId[bcs_entity.id];

        			if (acs && acs !== '' &&
                  acs !== '0' && 
                  acs === bcs) {
           	 			if (fnode === anid) next = graph.entity(nodes[len - 1]);
           	 			else if (tnode === anid) next = graph.entity(nodes[0]);

           	 			if (!filter[next.id]) {
           	 				filter[next.id] = true;
           	 				newTransps(transps, next, fromWay, editor, filter, nodeId2crossId);
           	 			}

         	 			  return;
         	 		}


			if (toWay.id !== fromWay.id && !toWay.isOneRoadCrossWay() && tags.direction !== undefined) {
          	     	 	var bn, dt = 25;
          	     	 	if (tags.direction === '1') {
            	 	 			if (fnode === anid) {
            	     	 			bn = graph.entity(nodes[1]);
            	     	 		}else if (tnode === anid) {
            	     	 			bn = graph.entity(nodes[len - 2]);
            	     	 		} else return;
          	     	 	} else if (tags.direction === '2') {
            	     	 		if (fnode === anid) {
            	         			bn = graph.entity(nodes[1]);
            	     	 		} else return;
          	     	 	} else if (tags.direction === '3') {
            	     	 		if (tnode === anid) {
            	     	 			bn = graph.entity(nodes[len - 2]);
            	     	 		} else return;
          	     	 	} else if (tags.direction === '4') {
          	     	 	   	return;
          	     	 	} else {
          	     	 	  	return;
          	     	 	}

        	         	var a = context.projection(an.loc), 
        	             	b = context.projection(bn.loc);
        	         	var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
        	             	p = [parseInt(a[0] + dt * Math.cos(angle)),
        	                 	parseInt(a[1] + dt * Math.sin(angle))],
        	             	loc = context.projection.invert(p);
        	
        	         	id = [an.id, bn.id].sort().join('-') + (longid ++);
					
                    var parentRelations = context.graph().parentRelations(fromWay), pRelations = [], mRelations = [], crossOrmaat = false;
					parentRelations.forEach(function(relation){
//						crossOrmaat = (relation.modelName === iD.data.Constant.CROSSMAAT || relation.modelName === iD.data.Constant.NODEMAAT);
						crossOrmaat = (relation.modelName === iD.data.DataType.C_NODECONN || relation.modelName === iD.data.DataType.NODECONN);
						if (crossOrmaat) {
							if (an_cross_node_id) (relation.members[1].id === nodeId2crossId[an.id]) && mRelations.push(relation);
							else mRelations.push(relation);
						}
					});
					mRelations.forEach(function(mRelation){
						var rules = context.graph().parentRelations(mRelation), r;
						rules.forEach(function(rule){
							r = _.clone(rule);
							r = iD.util.merge({members: mRelation.members}, r);
							pRelations.push(r);
						});
					});
					
                    var transportation = iD.Transportation();
                    var status = transportation.transpToRelations(toWay.id, pRelations);

                    transps[id] = iD.Transportation({
                        type: 'transportation',
                        id: id ,
                        loc: loc,
                        edge: [an.id, bn.id],
                        tags : { status : status },
                        fromwayId: fromWay.id,
                        towayId: toWay.id,
                        nodeId: an_cross_node_id ? an_cross_node_id : an.id,
                        angle: angle * (180 / Math.PI)
                    });

        	        editor && (transps[id].editor = true);
    	         	    
                    var ancs = nodeId2crossId[an.id];

        	         	if (ancs && ancs !== '0' && ancs !== '') {
        	         	   	if (fnode === anid) {
        		         		  next = graph.entity(nodes[len - 1]);
        	     	 		} else if (tnode === anid) {
        	     	 			  next = graph.entity(nodes[0]);
        	     	 		}
        	     	 		if (!filter[next.id] && ancs === nodeId2crossId[next.id]) {
        	     	 			  filter[next.id] = true;
        	     	 			  newTransps(transps, next, fromWay, editor, filter, nodeId2crossId);
        	     	 		}
    	         	}
	        }
		});
	}
	
	//绘制闹钟
    function drawTrafficArrowRule(surface, points, filter) {
        var groups = surface.select('.layer-traffic').selectAll('g.point')
            .filter(filter)
            .data(_.values(transpsData(true)), function(d) { return d.id; });

        var group = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node point ' + d.id; })
            .order();

        group.append('circle').call(markerRulePath, 'shadow');
        group.append('circle').call(markerRulePath, 'stroke');
        group.append('image').call(markerRulePath, 'image');
        group.append('use').call(markerRulePath, 'icon');
        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());
    }

    function drawTrafficArrow(surface, points, filter) {
        points.sort(sortY);
        // 交通规则相关数据
        var groups = surface.select('.layer-traffic')
            .selectAll('g.point')
            .data(_.values(transpsData()), function(d) { return d.id; });
        
        var group = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node point ' + d.id; })
            .order();

        group.append('path').call(markerPath, 'shadow');
        group.append('path').call(markerPath, 'stroke');
        group.append('image').call(markerPath,'image');
        group.append('use')
            .attr('class', 'KDSEditor-icon')
            .attr('transform', 'translate(-6, -20)')
            .attr('clip-path', 'url(#clip-square-12)');
        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());
        
        drawTrafficArrowRule(surface, points, filter);

        //groups.exit().remove();
    }

    
    //[2]Node
    function markerNodePath(selection, style) {
        if(style === "shadow" || style === "stroke" ) {
            selection
                .attr('class', style)
                .attr('r', '10')
                .attr('cx','0')
                .attr('cy','0')
                .attr('fill','white')
                .attr('fill-opacity','1')
                .attr('stroke','#00d8ff')
                .attr('stroke-opacity','1')
                .attr('stroke-width','3')
                .attr('stroke-linecap','round')
                .attr('stroke-linejoin','round')
                .attr('stroke-dasharray','none')
                .attr('pointer-events','visiblePainted')
                .attr('cursor','inherit');

        } else if(style === 'image') {
             selection
                .attr('class', style)
                .attr('x', -12)
                .attr('y', -12)
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href', function(d){
                      return d.tags.node === 'first' ? context.imagePath('pointa.png') : context.imagePath('pointb.png');
                });
        } else if( style === "turn" ) {
            selection
                .attr('r', '10')
                .attr('cx', function(d){ return d.tags.node === 'first' ? 40 : -40; })
                .attr('cy', function(d){ return d.tags.node === 'first' ? 30 : -30; })
                .attr('fill', 'red')
                .attr('opacity', function(d){ return d.relation == 1 ? 1 : 0; });
        }
        
        selection.each(function(entity) {
        	if (style === 'stroke') {
        		if (entity.tags && entity.tags.node === 'first') this.style.fill = "#f00";
        		if (entity.tags && entity.tags.node === 'last') this.style.fill = "#0f0";
        	}
        });
    }

    function transps(){
         if(context.selectedIDs().length !== 1 || !context.transportation.is(context.selectedIDs()[0])) return ;
         var way = context.hasEntity(context.selectedIDs()[0]);
         if(!( way instanceof iD.Way ) ) return [];
         return iD.Transportation()
                  .newTransportations(context.graph().entity(way.first()),
                                      context.graph().entity(way.last()),
                                      way.tags.direction);
    }

    function drawTrafficNode(surface, points, filter) { 
        points.sort(sortY);

        var groups = surface.select('.layer-traffic')
           .selectAll('g.point')
           .data(_.values(transps()), function(d) { return d.id; });

        var group = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node point ' + d.id; })
            .order();

        group.append('circle').call(markerNodePath, 'shadow');
        group.append('circle').call(markerNodePath, 'stroke');
        group.append('image').call(markerNodePath, 'image');
        group.append('use')
            .attr('class', 'icon')
            .attr('transform', 'translate(-6, -20)')
            .attr('clip-path', 'url(#clip-square-12)');
        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        groups.exit().remove();
    }

    //
    function drawTraffic(surface, points, filter) {
    	drawTrafficNode(surface, points, filter);
    	drawTrafficArrow(surface, points, filter);
    }
    
    drawTraffic.traffic = function(entities, limit) {
    	var points = [];
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity._type === 'trafficnode' || entity._type === 'trafficarrow') {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
        return points;
    }

    return drawTraffic;
};
