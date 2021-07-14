iD.svg.Labels = function(projection, context) {
    var path = d3.geo.path().projection(projection);

    var default_size = 12;

    var iconSize = 18;

    var pointOffsets = [
        [15, 0, 'start'], // right
        [10, -11, 'start'], // unused right now
        [-15, -11, 'end']
    ];

    var lineOffsets = [50, 45, 55, 40, 60, 35, 65, 30, 70, 25,
        75, 20, 80, 15, 95, 10, 90, 5, 95];


    function displayName(entity){
        var fieldKey = '';// entity.layerInfo().label && entity.layerInfo().label.fieldKey;
        //判断数据类型，如果数据是道路，并且处于显示道路ID特效

        //判断数据类型，如果数据是结点，并且处于显示结点ID特效
        if(entity instanceof  iD.Node&&(entity.modelName == iD.data.DataType.ROAD_NODE||entity.modelName == iD.data.Constant.C_NODE||entity.modelName == iD.data.DataType.WALKENTER)&&d3.select("#effects-nodeID")[0][0] !=null &&d3.select("#effects-nodeID").classed("active") == true){
            if(context.variable.nodeLabel){
                //return entity.id;
                return (entity.id).slice((entity.id).indexOf("_")+1);
            }
        }


        if(entity instanceof  iD.Way&&!entity.isOneRoadCrossWay()&&d3.select("#effects-roadID")[0][0] !=null &&d3.select("#effects-roadID").classed("active") == true){
            if(context.variable.roadLabel){
                //return entity.id;
                return (entity.id).slice((entity.id).indexOf("_")+1);
            }
            return  entity.tags[fieldKey] || entity.tags.name;
        }

		if(entity instanceof iD.Node && _.include([
			iD.data.DataType.LAMPPOST,
		 	iD.data.DataType.OBJECT_PT,
			iD.data.DataType.TRAFFICLIGHT,
			iD.data.DataType.LIMITHEIGHT
		], entity.modelName)){
			if(_.include([iD.data.DataType.TRAFFICLIGHT, iD.data.DataType.LIMITHEIGHT], entity.modelName)){
				return iD.labels.labelSourceName(entity.modelName);
			}
//			return iD.labels.labelSourceName(entity.modelName, ['TYPE', entity.tags.TYPE], ['SUBTYPE', entity.tags.SUBTYPE]);
			return iD.labels.labelSourceName(entity.modelName, ['TYPE', entity.tags.TYPE]);
		}

        return entity.tags[fieldKey] || entity.tags.name;
    }

    function get(array, prop) {
        return function(d, i) { return array[i][prop]; };
    }

    var textWidthCache = {};

    function textWidth(text, size, elem) {
        var c = textWidthCache[size];
        if (!c) c = textWidthCache[size] = {};

        if (c[text]) {
            return c[text];

        } else if (elem) {
            c[text] = elem.getComputedTextLength();
            return c[text];

        } else {
            var str = encodeURIComponent(text).match(/%[CDEFcdef]/g);
            if (str === null) {
                return size / 3 * 2 * text.length;
            } else {
                return size / 3 * (2 * text.length + str.length);
            }
        }
    }

    function setLabelStyle(d,key){
        var layerInfo = iD.Layers.getLayer(d.layerId);
        var value = layerInfo && layerInfo.label && layerInfo.label[key];
        if(value){
        	return value + (key === 'fontSize' ? 'px' : '');
        }
    }

    function drawLineLabels(group, entities, filter, classes, labels, effectList) {
        var texts = group.selectAll('text.' + classes)
            .filter(filter)
            .data(entities, iD.Entity.key);

        texts.enter()
            .append('text')
            .attr('class', function(d, i) { return classes + ' ' + labels[i].classes + ' ' + d.id; })
            .append('textPath')
            .attr('class', 'textpath');


        texts.selectAll('.textpath')
            .filter(filter)
            .data(entities, iD.Entity.key)
            .attr({
                'startOffset': '50%',
                'xlink:href': function(d) { return '#labelpath-' + d.id; }
            })
            .text(function(d, i){
            	if(effectList[i]){
            		return effectList[i].value;
            	}
            	return displayName.call(this, d);
            });

        texts.classed('linelabel-hidden',function(d){
            var layerInfo = iD.Layers.getLayer(d.layerId);
            return layerInfo && !layerInfo.display || false;
        });
        texts.style('fill',function(d){
            return setLabelStyle(d,'fill');
        });
        texts.style('font-size',function(d){
            return setLabelStyle(d,'fontSize');
        });
        texts.exit().remove();
    }

    function drawLinePaths(group, entities, filter, classes, labels) {
        var halos = group.selectAll('path')
            .filter(filter)
            .data(entities, iD.Entity.key);

        halos.enter()
            .append('path')
            .style('stroke-width', get(labels, 'font-size'))
            .attr('id', function(d) { return 'labelpath-' + d.id; })
            .attr('class', classes);

        halos.attr('d', get(labels, 'lineString'));

        halos.exit().remove();
    }

    function drawPointLabels(group, entities, filter, classes, labels, effectList) {

        var texts = group.selectAll('text.' + classes)
            .filter(filter)
            .data(entities, iD.Entity.key);

        texts.enter()
            .append('text')
            .attr('class', function(d, i) { return classes + ' ' + labels[i].classes + ' ' + d.id; });

        texts.attr('x', get(labels, 'x'))
            .attr('y', get(labels, 'y'))
            .style('text-anchor', get(labels, 'textAnchor'))
            .text(function(d, i){
                let effect = effectList.find(function(ef) {return ef.entity.id == d.id});
            	if(effect){
            		return effect.value;
            	}
            	return displayName(d);
            })
            .each(function(d, i) {
                var text = '';
                let effect = effectList.find(function(ef) {return ef.entity.id == d.id});
            	if(effect){
            		text = effect.value;
            	}else {
            		text = displayName(d);
            	}
            	textWidth(text, labels[i].height, this);
            });

        texts.classed('pointlabel-hidden',function(d){
            var layerInfo = iD.Layers.getLayer(d.layerId);
            return layerInfo && !layerInfo.display || false;
            // return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });


        texts.style('fill',function(d){
            return setLabelStyle(d,'fill');
        });
        texts.style('font-size',function(d){
            return setLabelStyle(d,'fontSize');
        });

        texts.exit().remove();
        return texts;
    }

    function drawAreaLabels(group, entities, filter, classes, labels, effectList) {
        entities = entities.filter(hasText);
        labels = labels.filter(hasText);
        return drawPointLabels(group, entities, filter, classes, labels, effectList);

        function hasText(d, i) {
            return labels[i].hasOwnProperty('x') && labels[i].hasOwnProperty('y');
        }
    }

    function reverse(p) {
        var angle = Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]);
        return !(p[0][0] < p[p.length - 1][0] && angle < Math.PI/2 && angle > - Math.PI/2);
    }

    function lineString(nodes) {
        return 'M' + nodes.join('L');
    }

    function subpath(nodes, from, to) {
        function segmentLength(i) {
            var dx = nodes[i][0] - nodes[i + 1][0];
            var dy = nodes[i][1] - nodes[i + 1][1];
            return Math.sqrt(dx * dx + dy * dy);
        }

        var sofar = 0,
            start, end, i0, i1;
        for (var i = 0; i < nodes.length - 1; i++) {
            var current = segmentLength(i);
            var portion;
            if (!start && sofar + current >= from) {
                portion = (from - sofar) / current;
                start = [
                    nodes[i][0] + portion * (nodes[i + 1][0] - nodes[i][0]),
                    nodes[i][1] + portion * (nodes[i + 1][1] - nodes[i][1])
                ];
                i0 = i + 1;
            }
            if (!end && sofar + current >= to) {
                portion = (to - sofar) / current;
                end = [
                    nodes[i][0] + portion * (nodes[i + 1][0] - nodes[i][0]),
                    nodes[i][1] + portion * (nodes[i + 1][1] - nodes[i][1])
                ];
                i1 = i + 1;
            }
            sofar += current;

        }
        var ret = nodes.slice(i0, i1);
        ret.unshift(start);
        ret.push(end);
        return ret;

    }

    function initLabelStack(){
        var stack = [];
        context.layers().getLayers().forEach(function(item){
            stack.push([item.type,(item.label && item.label.fieldKey) || 'name_chn']);
        });
        return stack;
    }
    
    var rtree = rbush(),
        rectangles = {};

    function labels(surface, graph, entities, filter, dimensions, fullRedraw) {

        var hidePoints = !surface.select('.node.point').node();

        //label_stack = initLabelStack();
        //增加道路首尾结点数组,道路首尾结点的geometry为vertex
        //label_stack.push(["vertex","id"]);
        label_stack = [
			["road", "name_chn"],
			["area", "name_chn"],
//			["point", "name_chn"],
			["point", "TYPE"],
			["vertex", "name_chn"]
		];
        if(context.variable.roadLabel){
            label_stack =[["road", "id"],["area", "name_chn"],["point", "name_chn"],["vertex", "name_chn"]];
        }else if(context.variable.nodeLabel){
            label_stack = [["vertex", "id"],["road", "name_chn"],["area", "name_chn"],["point", "name_chn"]];
        }
        var labelable = [], i, k, entity;
        for (i = 0; i < label_stack.length; i++) labelable.push([]);
		var effect

        if (fullRedraw) {
            rtree.clear();
            rectangles = {};
        } else {
            for (i = 0; i < entities.length; i++) {
                rtree.remove(rectangles[entities[i].id]);
            }
        }

        var effectValList = [];
        // Split entities into groups specified by label_stack
        for (i = 0; i < entities.length; i++) {
            entity = entities[i];
            // name, value
            var labelFilter = iD.labels.effectEntityFilter.get(entity.modelName);

            // //判断是否显示标注
            var layerInfo = iD.Layers.getLayer(entity.layerId);
            if(!labelFilter && layerInfo && layerInfo.label){
            	if(layerInfo.label.displayMap){
            		if(!layerInfo.label.displayMap[entity.modelName]){
            			continue;
            		}
            	}else if(!layerInfo.label.display){
            		continue;
            	}
            }
            var geometry = entity.geometry(graph);
            
        	var obj = labelFilter && labelFilter(entity);
        	if(obj){
        		obj.entity = entity;
        		obj.value = obj.value == null ? '' : obj.value;
        		effectValList.push(obj);
        	}
            

            //增加placename地名信息points
            //if(entity.modelName == iD.data.DataType.PLACENAME){
            //    geometry= 'road';
            //}

            //if(entity.modelName == iD.data.DataType.ROADNODE){
            //    console.log(entity);
            //}
			/*
            if(!(context.variable.nodeLabel||context.variable.roadLabel)&&entity.modelName == iD.data.DataType.ROAD_NODE)
                continue;
            //if (geometry === 'vertex' || geometry === 'relation')
            if ((geometry === 'vertex'&&entity.modelName != iD.data.DataType.ROAD_NODE&&entity.modelName != iD.data.Constant.C_NODE&&entity.modelName != iD.data.DataType.WALKENTER)||geometry === 'relation')
                continue;
            //if (hidePoints && geometry === 'point')
            if (hidePoints && geometry === 'point')
                continue;
            // 几何类型point line area, road?
            if(layerInfo.isRoad()&&entity.modelName != iD.data.DataType.ROAD_NODE&&entity.modelName != iD.data.Constant.C_NODE&&entity.modelName != iD.data.DataType.WALKENTER)
                geometry = 'road';
			*/
			
			let displayNameStr = displayName(entity);
            if (!displayNameStr && !obj)
                continue;
			
			// 判断显示哪些Entity的Label
            for (k = 0; k < label_stack.length; k ++) {
            	if(geometry != label_stack[k][0]){
            		continue ;
            	}
//          	if(filterDisplayEntity() && displayNameStr){
            	if(displayNameStr){
            		labelable[k].push(entity);
            		break;
            	}
            	/*
                if (geometry === label_stack[k][0] && (entity.tags[label_stack[k][1]] != undefined || entity[label_stack[k][1]] != undefined)) {
                	if(!filterDisplayEntity()){
                		continue ;
                	}
                    labelable[k].push(entity);
                    break;
                }
                */
            }
        }
        
        function filterDisplayEntity(){
        	var result = false;
        	if(_.include([
        		iD.data.DataType.LAMPPOST,
          		iD.data.DataType.OBJECT_PT,
				iD.data.DataType.TRAFFICLIGHT,
				iD.data.DataType.LIMITHEIGHT
        	], entity.modelName)){
        		result = true;
        		/*
        		if(entity.tags.TYPE == 2){
        			// 路灯杆
        			if(entity.tags.SUBTYPE == 4){
        				result = true;
        			}
        		}else if(entity.tags.TYPE == 3){
        			// 指示牌
        			if(entity.tags.SUBTYPE == 0){
    					// 渲染一组（4个）点中的第一个点
	    				let relations = graph.parentRelations(entity, iD.data.DataType.R_OPT_OPT);
	    				if(relations[0]){
	    					result = entity.id == relations[0].members[0].id;
	    				}
        			}
        		}
        		*/
        	}
        	return result;
        }

        var positions = {
            point: [],
            line: [],
            area: [],
            vertex:[]
        };

        var labelled = {
            point: [],
            line: [],
            area: [],
            vertex:[]
        };
        
        var effeced = {
            point: [],
            line: [],
            area: [],
            vertex:[]
        };

		var fieldList = [].concat(effectValList);
		for (k = 0; k < labelable.length; k++) {
            for (i = 0; i < labelable[k].length; i ++) {
                entity = labelable[k][i];
                name = displayName(entity);
                if(!name) continue ;
                fieldList.push({
                	entity: entity,
                	name: label_stack[k][1],
                	value: name,
                	isold: true
                });
            }
        }
		
		for(var item of fieldList){
			entity = item.entity;
            var layerInfo = iD.Layers.getLayer(entity.layerId),
                //获得当前图层的字号大小
                font_size = (layerInfo && layerInfo.label && layerInfo.label.fontSize) || default_size,
            	name = item.value,
            	width = name && textWidth(name, font_size),
                p;
            let geoType = entity.geometry(graph);
            if (geoType === 'point'||geoType === 'vertex') {
                p = getPointLabel(entity, width, font_size);
            } else if (geoType === 'line') {
                p = getLineLabel(entity, width, font_size);
            } else if (geoType === 'area') {
                p = getAreaLabel(entity, width, font_size);
            }
            if (p) {
                
                p.classes = geoType + ' tag-' + item.name;
                positions[geoType].push(p);
                labelled[geoType].push(entity);
                // !item.isold && effeced[geoType].push(item);
                effeced[geoType].push(item);

                // labelled.area, filter, 'arealabel', positions.area, effeced.area
            }
		}
		/*
        // Try and find a valid label for labellable entities
        for (k = 0; k < labelable.length; k++) {
            for (i = 0; i < labelable[k].length; i ++) {
                entity = labelable[k][i];
                var layerInfo = entity.layerInfo(),
                	//获得当前图层的字号大小
                	font_size = (layerInfo.label && layerInfo.label.fontSize) || default_size,
                	name = displayName(entity),
                	width = name && textWidth(name, font_size),
                	p;
                if (entity.geometry(graph) === 'point'||entity.geometry(graph) === 'vertex') {
                    p = getPointLabel(entity, width, font_size);
                } else if (entity.geometry(graph) === 'line') {
                    p = getLineLabel(entity, width, font_size);
                } else if (entity.geometry(graph) === 'area') {
                    p = getAreaLabel(entity, width, font_size);
                }
                if (p) {
                    p.classes = entity.geometry(graph) + ' tag-' + label_stack[k][1];
                    positions[entity.geometry(graph)].push(p);
                    labelled[entity.geometry(graph)].push(entity);
                }
            }
        }
        */

        function getPointLabel(entity, width, height) {
            var coord = projection(entity.loc),
                m = 5,  // margin
                offset = pointOffsets[0],
                p = {
                    height: height,
                    width: width,
                    x: coord[0] + offset[0],
                    y: coord[1] + offset[1],
                    textAnchor: offset[2]
                };
            var rect = [p.x - m, p.y - m, p.x + width + m, p.y + height + m];
            if (tryInsert(rect, entity.id))
                return p;
        }


        function getLineLabel(entity, width, height) {
            var nodes = _.pluck(graph.childNodes(entity), 'loc').map(projection),
                length = iD.geo.pathLength(nodes);
            if (length < width + 20) return;

            for (var i = 0; i < lineOffsets.length; i ++) {
                var offset = lineOffsets[i],
                    middle = offset / 100 * length,
                    start = middle - width/2;
                if (start < 0 || start + width > length) continue;
                var sub = subpath(nodes, start, start + width),
                    rev = reverse(sub),
                    rect = [
                        Math.min(sub[0][0], sub[sub.length - 1][0]) - 10,
                        Math.min(sub[0][1], sub[sub.length - 1][1]) - 10,
                        Math.max(sub[0][0], sub[sub.length - 1][0]) + 20,
                        Math.max(sub[0][1], sub[sub.length - 1][1]) + 30
                    ];
                if (rev) sub = sub.reverse();
                if (tryInsert(rect, entity.id)) return {
                    'font-size': height + 2,
                    lineString: lineString(sub),
                    startOffset: offset + '%'
                };
            }
        }

        function getAreaLabel(entity, width, height) {
            var centroid = path.centroid(entity.asGeoJSON(graph, true)),
                extent = entity.extent(graph),
                entitywidth = projection(extent[1])[0] - projection(extent[0])[0],
                rect;

            // if (!centroid || entitywidth < 20) return;
            if (!centroid) return;

            var iconX = centroid[0] - (iconSize/2),
                iconY = centroid[1] - (iconSize/2),
                textOffset = iconSize + 5;

            var p = {
                transform: 'translate(' + iconX + ',' + iconY + ')'
            };

            // if (width && entitywidth >= width + 20) {
            if (width) {
                p.x = centroid[0];
                p.y = centroid[1] + textOffset;
                p.textAnchor = 'middle';
                p.height = height;
                rect = [p.x - width/2, p.y, p.x + width/2, p.y + height + textOffset];
            } else {
                rect = [iconX, iconY, iconX + iconSize, iconY + iconSize];
            }

            if (tryInsert(rect, entity.id)) return p;

        }

        function tryInsert(rect, id) {
            // Check that label is visible
            if (rect[0] < 0 || rect[1] < 0 || rect[2] > dimensions[0] ||
                rect[3] > dimensions[1]) return false;
            var v = rtree.search(rect).length === 0;
            if (v) {
                rect.id = id;
                rtree.insert(rect);
                rectangles[id] = rect;
            }
            return v;
        }

        var label = surface.select('.layer-label'),
            halo = surface.select('.layer-halo');

        // points
        drawPointLabels(label, labelled.point, filter, 'pointlabel', positions.point, effeced.point);
        drawPointLabels(halo, labelled.point, filter, 'pointlabel-halo', positions.point, effeced.point);

        drawPointLabels(label, labelled.vertex, filter, 'vetexlabel', positions.vertex, effeced.vertex);
        drawPointLabels(halo, labelled.vertex, filter, 'vetexlabel-halo', positions.vertex, effeced.vertex);

        // lines
        drawLinePaths(halo, labelled.line, filter, '', positions.line);
        drawLineLabels(label, labelled.line, filter, 'linelabel', positions.line, effeced.line);
        drawLineLabels(halo, labelled.line, filter, 'linelabel-halo', positions.line, effeced.line);

        // areas
        drawAreaLabels(label, labelled.area, filter, 'arealabel', positions.area, effeced.area);
        drawAreaLabels(halo, labelled.area, filter, 'arealabel-halo', positions.area, effeced.area);
    }

    return labels;
};
