iD.svg = {
    RoundProjection: function(projection) {
        return function(d) {
            return iD.geo.roundCoords(projection(d));
        };
    },

    PointTransform: function(projection) {
        return function(entity) {
            // http://jsperf.com/short-array-join
            var pt = projection(entity.loc);
            return 'translate(' + pt[0] + ',' + pt[1] + ')';
        };
    },
    
    PointTransformOffset: function(projection) {
        return function(entity) {
            // http://jsperf.com/short-array-join
            var pt = projection(entity.loc);
            var x = pt[0] + (entity.offset[0] || 0);
            var y = pt[1] + (entity.offset[1] || 0);
            return 'translate(' + pt[0] + ',' + pt[1] + ')';
        };
    },

    Round: function () {
        return d3.geo.transform({
            point: function(x, y) { return this.stream.point(Math.floor(x), Math.floor(y)); }
        });
    },

    Path: function(projection, graph, polygon) {
        var cache = {},
            round = iD.svg.Round().stream,
            clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
            project = projection.stream,
            path = d3.geo.path()
                .projection({stream: function(output) { return polygon ? project(round(output)) : project(clip(round(output))); }});

        return function(entity) {
            if (entity.id in cache) {
                return cache[entity.id];
            } else {
                return cache[entity.id] = path(entity.asGeoJSON(graph)); // jshint ignore:line
            }
        };
    },
    PathDashType: function(projection, graph){
        return function(entity, isDottedSoild) {
            var a,
                b,
                i = 1,
                d='',
                padding = 65,
                // segments = [],
                viewport = iD.geo.Extent(projection.clipExtent()),
                paddedExtent = [
                    [viewport[0][0] - padding, viewport[0][1] - padding],
                    [viewport[1][0] + padding, viewport[1][1] + padding]
                ];
    
            if (entity.type == "Feature") {
                var nodes = entity.properties.nodes;
                entity = entity.properties.entity;
            } else {
                var nodes = graph.childNodes(entity);
            }
            if (entity.tags && entity.tags.DIRECTION === '3') nodes.reverse();
    
            a = projection(nodes[0].loc);
    
            for (; i < nodes.length; i++) {
                b = projection(nodes[i].loc);
                extent = iD.geo.Extent(a).extend(b);
                if( extent.intersects(paddedExtent)){
                    if(d == ''){
                        d+="M"+ a[0] + ',' + a[1];
                    }
                    node = nodes[i];
                    if (node.tags.DASHTYPE == 1 && isDottedSoild) {
                        d+="M"+ b[0] + ',' + b[1];
                    }else{
                        d+="L"+ b[0] + ',' + b[1];
                    }
                }else{
                    if((i+1)<nodes.length){
                        let _t = iD.geo.Extent(b).extend(projection(nodes[i+1].loc));
                        if(_t.intersects(paddedExtent)){
                            d+= 'M' + b[0] + ',' + b[1];
                        }
                    }
                }
                a = b;
            }
    
            return d;
        };
    },
    /**
     * 缩略图用的svg line渲染
     * @param {Function} projection
     * @param {Object} graph
     * @param {Boolean} polygon
     */
    PathThumbnail: function(projection, graph, polygon) {
        var cache = {}, geoCache = {},
            round = iD.svg.Round().stream,
            clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
            project = projection.stream,
            path = d3.geo.path()
                .projection({stream: function(output) { return polygon ? project(round(output)) : project(clip(round(output))); }});
        var angleCache = {}, angleList = [];
        
        var lineCal = iD.util.LineCalCulate(), minAngle = 20;
		
		function getFirstCoords(entity, coords, selectedNode){
			if(_.first(entity.nodes) == selectedNode){
				return coords.slice(0, 2);
			}else if(_.last(entity.nodes) == selectedNode){
				var arr = coords.slice(entity.nodes.length - 2, entity.nodes.length - 1);
				arr.reverse();
				return arr;
			}
			return coords;
		}
		
		/**
		 * @param {Object} entitys 共点的父级way
		 * @param {String} selectedNode 共点id
		 */
        return function(entitys, selectedNode) {
        	if(polygon){
				entitys.forEach(function(entity){
					cache[entity.id] = path(entity.asGeoJSON(graph));
				});
				return cache;
        	}
        	
        	var fentity = entitys[0];
        	if(entitys.length === 1){
        		var geo = fentity.asGeoJSON(graph);
				geoCache[fentity.id] = geo;
				cache[fentity.id] = path(geo);
				return cache;
    		}
        	
        	var baseIndex = 0;
        	entitys.forEach(function(entity){
        		var nodes = graph.childNodes(entity);
        		var angle = lineCal.getAngle(nodes[0].loc[0], nodes[0].loc[1], nodes[1].loc[0], nodes[1].loc[1]);
        		if(angle >= 360) angle = 0;
        		angleCache[entity.id] = angle;
        		angleList.push([entity, angle]);
        	});
        	angleList = angleList.sort(function(d1, d2){
        		return d1[1] - d2[1];
        	});
        	angleList.forEach(function(d, idx){
        		if(d[0].id == fentity.id) baseIndex = idx;
        	});
        	var resultList = {};
          	var count = 1;
        	// 顺时针
        	for(let i = baseIndex; i < angleList.length - 1; i++){
//      		let nowMinAngle = minAngle;
        		let nowMinAngle = minAngle * count;
        		if(nowMinAngle > 360) nowMinAngle = 0;
        		let entity = angleList[i][0];
        		let angle = angleList[i][1];
        		let nextEntity = angleList[i + 1][0];
        		let nextAngle = angleList[i + 1][1];
        		if(nextAngle - angle < nowMinAngle){
        			let newAngle = angle + nowMinAngle;
        			if(newAngle >= 360){
        				newAngle -= 360;
        			}
        			if(i == angleList.length - 2 && baseIndex == 0){
        				// 防止最后一段+20度以后，与当前选择一段靠太近
        				let baseAngle = angleList[baseIndex][1];
        				if(Math.abs(baseAngle - newAngle) < nowMinAngle){
        					let diff = baseAngle - angle;
        					if(diff < 0) diff += 360;
        					newAngle = diff / 2;
        				}
        			}
        			resultList[nextEntity.id] ={
        				entity: nextEntity,
        				angle: nextAngle,
        				newAngle: newAngle
        			};
        			count++;
        		}
        	}
        	count = 1;
        	// 逆时针
    		for(let i = baseIndex; i > 0; i--){
//      		let nowMinAngle = minAngle;
        		let nowMinAngle = minAngle * count;
        		if(nowMinAngle > 360) nowMinAngle = 0;
        		let entity = angleList[i][0];
        		let angle = angleList[i][1];
        		let prevEntity = angleList[i - 1][0];
        		let prevAngle = angleList[i - 1][1];
        		if(angle - prevAngle < nowMinAngle){
        			let newAngle = angle - nowMinAngle;
        			if(newAngle < 0){
        				newAngle += 360;
        			}
        			resultList[prevEntity.id] = {
        				entity: prevEntity,
        				angle: prevAngle,
        				newAngle: newAngle
        			};
        			count++;
        		}
        	}
    		for(let i = 0; i < entitys.length; i++){
    			var entity = entitys[i];
    			var item = resultList[entity.id];
        		var geo = entity.asGeoJSON(graph);
				geo = geoCache[entity.id] || _.clone(geo);
//				var nextEntity = entitys[i + 1];
//				var nextGeo = geoCache[nextEntity.id] || _.clone(nextEntity.asGeoJSON(graph));
				// 只渲染第一段节点
				if(!geoCache[entity.id]){
					geo.coordinates = getFirstCoords(entity, geo.coordinates, selectedNode);
				}
				/*
				if(!geoCache[nextEntity.id]){
					nextGeo.coordinates = getFirstCoords(nextEntity, nextGeo.coordinates, selectedNode);
				}
				if(item){
					let newAngle = item.newAngle;
					let distance = iD.util.distanceByLngLat(nextGeo.coordinates[0], nextGeo.coordinates[1]);
					let lonlat = lineCal.calculateVerticalP(nextGeo.coordinates[0][0], nextGeo.coordinates[0][1], distance / 1000, newAngle);
					nextGeo.coordinates[1] = [lonlat.Longitude, lonlat.Latitude, nextGeo.coordinates[1][2]];
				}
    		    */
				if(item){
					let newAngle = item.newAngle;
					let distance = iD.util.distanceByLngLat(geo.coordinates[0], geo.coordinates[1]);
					let lonlat = lineCal.calculateVerticalP(geo.coordinates[0][0], geo.coordinates[0][1], distance / 1000, newAngle);
					geo.coordinates[1] = [lonlat.Longitude, lonlat.Latitude, geo.coordinates[1][2]];
				}
				
				geoCache[entity.id] = geo;
//				geoCache[nextEntity.id] = nextGeo;
                cache[entity.id] = path(geo); // jshint ignore:line
//              cache[nextEntity.id] = path(nextGeo); // jshint ignore:line
        	}
    		return cache;
    		
    		/*
        	for(let i = 0; i < entitys.length - 1; i++){
        		var entity = entitys[i];
        		var geo = entity.asGeoJSON(graph);
				geo = geoCache[entity.id] || _.clone(geo);
				var nextEntity = entitys[i + 1];
				var nextGeo = geoCache[nextEntity.id] || _.clone(nextEntity.asGeoJSON(graph));
				// 只渲染第一段节点
				if(!geoCache[entity.id]){
					geo.coordinates = getFirstCoords(entity, geo.coordinates, selectedNode);
				}
				if(!geoCache[nextEntity.id]){
					nextGeo.coordinates = getFirstCoords(nextEntity, nextGeo.coordinates, selectedNode);
				}
				// 正北夹角
				var angle = lineCal.getAngle(geo.coordinates[0][0], geo.coordinates[0][1], geo.coordinates[1][0], geo.coordinates[1][1]);
				var nextAngle = lineCal.getAngle(nextGeo.coordinates[0][0], nextGeo.coordinates[0][1], nextGeo.coordinates[1][0], nextGeo.coordinates[1][1]);
				let diffAngle = angle - nextAngle, 
					lessMin = false,
					// 顺时针
					direction = true;
				if(angle >= nextAngle){
					direction = true;
					if(diffAngle < minAngle) lessMin = true;
				}else {
					if(Math.abs(diffAngle) < minAngle){
						lessMin = true;
					}else if(diffAngle < (minAngle - 360)){
						direction = false;
						lessMin = true;
					}
				}
				if(lessMin){
					let newAngle = 0;
					if(diffAngle >= 0){
						newAngle = angle - minAngle;
					}else {
						if(direction){
							newAngle = angle + minAngle;
						}else {
							// 0  ->  350  -> diff: -350
							newAngle = angle - minAngle + 360;
						}
					}
					let distance = iD.util.distanceByLngLat(nextGeo.coordinates[0], nextGeo.coordinates[1]);
					let lonlat = lineCal.calculateVerticalP(nextGeo.coordinates[0][0], nextGeo.coordinates[0][1], distance / 1000, newAngle);
					nextGeo.coordinates[1] = [lonlat.Longitude, lonlat.Latitude, nextGeo.coordinates[1][2]];
				}
				
				geoCache[entity.id] = geo;
				geoCache[nextEntity.id] = nextGeo;
                cache[entity.id] = path(geo); // jshint ignore:line
                cache[nextEntity.id] = path(nextGeo); // jshint ignore:line
        	}
        	*/
        	return cache;
        };
    },
    GeoJsonPath: function(projection,polygon) {
        var cache = {},
            round = iD.svg.Round().stream,
            clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
            project = projection.stream,
            path = d3.geo.path()
                .projection({stream: function(output) { return polygon ? project(round(output)) : project(clip(round(output))); }});

        return function(entity) {
            return path(entity.geometry); // jshint ignore:line
        };
    },
    OneWaySegments: function(projection, graph, dt) {
        return function(entity) {
        	let wayNodes = [];
        	try{
        		wayNodes = graph.childNodes(entity)
        	}catch(e){
        		wayNodes = entity.getNodes && entity.getNodes() || entity.nodes || [];
        	}
            var a,
                b,
                i = 0,
                offset = dt,
                segments = [],
                viewport = iD.geo.Extent(projection.clipExtent()),
                coordinates = wayNodes.map(function(n) {
                    return n.loc;
                });

            //if (entity.tags.oneway === '-1') coordinates.reverse();
            if (entity.tags && entity.tags.DIRECTION === '3') coordinates.reverse();

            d3.geo.stream({
                type: 'LineString',
                coordinates: coordinates
            }, projection.stream({
                lineStart: function() {},
                lineEnd: function() {
                    a = null;
                },
                point: function(x, y) {
                    b = [x, y];

                    if (a) {
                        var extent = iD.geo.Extent(a).extend(b),
                            span = iD.geo.euclideanDistance(a, b) - offset;

                        if (extent.intersects(viewport) && span >= 0) {
                            var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                                dx = dt * Math.cos(angle),
                                dy = dt * Math.sin(angle),
                                p = [a[0] + offset * Math.cos(angle),
                                     a[1] + offset * Math.sin(angle)];

                            var segment = 'M' + a[0] + ',' + a[1] +
                                          'L' + p[0] + ',' + p[1];

                            for (span -= dt; span >= 0; span -= dt) {
                                p[0] += dx;
                                p[1] += dy;
                                segment += 'L' + p[0] + ',' + p[1];
                            }

                            segment += 'L' + b[0] + ',' + b[1];
                            segments.push({id: entity.id, index: i, d: segment});
                        }

                        offset = -span;
                        i++;
                    }

                    a = b;
                }
            }));

            return segments;
        };
    },
    OneWalkLinkSegments: function(projection, graph, dt) {
        return function(entity) {
            var a,
                b,
                i = 0,
                offset = dt,
                segments = [],
                viewport = iD.geo.Extent(projection.clipExtent()),
                coordinates = graph.childNodes(entity).map(function(n) {
                    return n.loc;
                });

            //if (entity.tags.oneway === '-1') coordinates.reverse();
           // if (entity.tags.DIRECTION === '3') coordinates.reverse();

            d3.geo.stream({
                type: 'LineString',
                coordinates: coordinates
            }, projection.stream({
                lineStart: function() {},
                lineEnd: function() {
                    a = null;
                },
                point: function(x, y) {
                    b = [x, y];

                    if (a) {
                        var extent = iD.geo.Extent(a).extend(b),
                            span = iD.geo.euclideanDistance(a, b) - offset;

                        if (extent.intersects(viewport) && span >= 0) {
                            var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                                dx = dt * Math.cos(angle),
                                dy = dt * Math.sin(angle),
                                p = [a[0] + offset * Math.cos(angle),
                                    a[1] + offset * Math.sin(angle)];

                            var segment = 'M' + a[0] + ',' + a[1] +
                                'L' + p[0] + ',' + p[1];

                            for (span -= dt; span >= 0; span -= dt) {
                                p[0] += dx;
                                p[1] += dy;
                                segment += 'L' + p[0] + ',' + p[1];
                            }

                            segment += 'L' + b[0] + ',' + b[1];
                            segments.push({id: entity.id, index: i, d: segment});
                        }

                        offset = -span;
                        i++;
                    }

                    a = b;
                }
            }));

            return segments;
        };
    },
    OneWayTurnguidanceSegments: function(projection, graph, dt, nodeLoc, flag) {
        return function(entity) {
            var a,
                b,
                i = 0,
                offset = dt,
                segments = [],
                viewport = iD.geo.Extent(projection.clipExtent()),
                coordinates = graph.childNodes(entity).map(function(n) {
                    return n.loc;
                });

            //line to point flag =='1'
            if (flag == '1') {
                if (coordinates[0][0] == nodeLoc[0] && coordinates[0][1] == nodeLoc[1]) {
                    coordinates.reverse();
                }
            }
            //point to line flag == '0'
            else if (flag == '0') {
                if (coordinates[coordinates.length - 1][0] == nodeLoc[0] && coordinates[coordinates.length - 1][1] == nodeLoc[1]) {
                    coordinates.reverse();
                }
            }

            d3.geo.stream({
                type: 'LineString',
                coordinates: coordinates
            }, projection.stream({
                lineStart: function() {},
                lineEnd: function() {
                    a = null;
                },
                point: function(x, y) {
                    b = [x, y];

                    if (a) {
                        var extent = iD.geo.Extent(a).extend(b),
                            span = iD.geo.euclideanDistance(a, b) - offset;

                        if (extent.intersects(viewport) && span >= 0) {
                            var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                                dx = dt * Math.cos(angle),
                                dy = dt * Math.sin(angle),
                                p = [a[0] + offset * Math.cos(angle),
                                    a[1] + offset * Math.sin(angle)];

                            var segment = 'M' + a[0] + ',' + a[1] +
                                'L' + p[0] + ',' + p[1];

                            for (span -= dt; span >= 0; span -= dt) {
                                p[0] += dx;
                                p[1] += dy;
                                segment += 'L' + p[0] + ',' + p[1];
                            }

                            segment += 'L' + b[0] + ',' + b[1];
                            segments.push({id: entity.id, index: i, d: segment});
                        }

                        offset = -span;
                        i++;
                    }

                    a = b;
                }
            }));

            return segments;
        };
    },
    OneWayStopSegments: function(projection, graph, dt) {
        return function(entity) {
            var a,
                b,
                i = 0,
                offset = dt,
                segments = [],
                coordinates = graph.childNodes(entity).map(function(n) {
                    return n.loc;
                });

            d3.geo.stream({
                type: 'LineString',
                coordinates: coordinates
            }, projection.stream({
                lineStart: function() {},
                lineEnd: function() {
                    a = null;
                },
                point: function(x, y) {
                    b = [x, y];
                    if (a) {
                        var span = iD.geo.euclideanDistance(a, b) / 2;
                        if (span >= 0 && span >= 25) {
                            a[0] = parseInt(a[0]);b[0] = parseInt(b[0]);
                            a[1] = parseInt(a[1]);b[1] = parseInt(b[1]);
                            var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                                p = [parseInt(a[0] + span * Math.cos(angle)),
                                     parseInt(a[1] + span * Math.sin(angle))];
                            var segment = 'M' + a[0] + ',' + a[1] +
                                          'L' + p[0] + ',' + p[1];
                            segment += 'L' + b[0] + ',' + b[1];
                            segments.push({id: entity.id, index: i, d: segment});
                        }
                        i++;
                    }
                    a = b;
                }
            }));

            return segments;
        };
    },
    MultipolygonMemberTags: function(graph) {
        return function(entity) {
            var tags = entity.tags;
            graph.parentRelations(entity).forEach(function(relation) {
                if (relation.isMultipolygon&&relation.isMultipolygon()) {
                    tags = _.extend({}, relation.tags, tags);
                }
            });
            return tags;
        };
    }
};
