iD.svg.SpeedCamera = function(projection, context) {
    
	//获取虚线或实线(原线)绘制路径
	function getAttitudeD (){
		var round = iD.svg.Round().stream,
			clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
			project = projection.stream,
			path = d3.geo.path().projection({stream: function(output) { return  project(clip(round(output)));}}),
			json = {type : 'LineString', coordinates : []};

		return {
			dotted: function(entity) {
				try {
					json.coordinates = [];
					json.coordinates.push(entity.loc);
					json.coordinates.push(context.temp().camaera_locs[entity.id]);
					return path(json);
				}catch(e){}
			}
		}
	};
	
	//绘制虚线
	function drawDottedLine (surface, path, points, filter) {
		var groups = surface.select('.layer-point-path-point')
			.selectAll('g.dotted-line') 
			.filter(filter)
			.data(points, function(d) { return d.id; });

		var group = groups.enter()
				.append('g')
				.attr('class', function(d) { return 'path dotted ' + d.id; });

		group.append('path').attr('d', path.dotted).style({'stroke': '#333333', 'stroke-width': '2', 'stroke-dasharray': '5, 5'});

		groups.exit().remove();
	}
	
	function drawLinkLine (surface, points, filter) {
		
		surface.selectAll('.layer-point-path-point').remove();
		surface.append('g').attr('class','layer layer-point-path-point');

		var graph = context.graph(), path = getAttitudeD(projection, graph), _points = []; 
		
		for (var i = 0; i < points.length; i++) {
            var entity = points[i];
			if (entity.members.length) {
				_points.push(entity);
				iD.util.storeDottedLoc(entity, context.graph().entity(entity.members[0].id), entity.id, context.temp().camaera_locs, context);
			}
		}
		if (points[0] && iD.Layers.getLayer(points[0].layerId, points[0].modelName).display) drawDottedLine(surface, path, _points, filter);
	}
	
	
	function markerPath(selection, klass) {
        if (klass === 'shadow' || klass === 'stroke') {
			var width = 24, height = 24;
        	selection
	            .attr('class', klass)
	            .attr('transform', 'translate(-11, -11)')
	            .attr('d', "M " + 0 + " "+ 0 +" L" + 0 + " "+ height +" L" + width + " "+ height +" L" + width + " " + 0 +" Z");
	            
	        selection.each(function(entity) {
	        	if (klass === 'stroke') this.style.fill = "#ff0000";
	        });
        } else if (klass === 'image') {
        	selection
	            .attr({
	            	x: -12,
	            	y: -12,
	            	width: 25,
	            	height: 25
	            })
	            .attr('xlink:href', function(d){
            		return context.imagePath('speedcamera.png');
            	});
        }
        
    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function drawSpeedCamera(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-speedcamera').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node point crosspoint ' + d.id; })
            .order();
		
        group.append('path')
            .call(markerPath, 'shadow');

        group.append('path')
            .call(markerPath, 'stroke');
		
		group.append('image')
            .call(markerPath, 'image');
		
        group.append('use')
            .attr('class', 'KDSEditor-icon')
            .attr('transform', 'translate(-6, -20)')
            .attr('clip-path', 'url(#clip-square-12)');

        groups.attr('transform', iD.svg.PointTransform(projection))
            .call(iD.svg.TagClasses());

        // Selecting the following implicitly
        // sets the data (point entity) on the element
        groups.select('.shadow');
        groups.select('.stroke');
        groups.select('.KDSEditor-icon')
            .attr('xlink:href', function(entity) {
                var preset = context.presets().match(entity, context.graph());
                return preset.icon ? '#maki-' + preset.icon + '-12' : '';
            });
        groups.classed('point-hidden',function(d){
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
        groups.exit()
            .remove();
			
			
		drawLinkLine (surface, points, filter);
    }
	
	drawSpeedCamera.available = function (points) {
		var layerInfo = points[0] && iD.Layers.getLayer(points[0].layerId);
		if (layerInfo) {
			var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
			return sublayer && sublayer.display;
		}
		return false;
	}

    drawSpeedCamera.speedcamera = function(entities, limit) {
        var graph = context.graph(),
            points = [];
			
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			if (entity.isSpeedcamera && entity.isSpeedcamera()) {
				points.push(entity);
				if (limit && points.length >= limit) break;
			}
		}
		if (this.available(points)) return points;
		
        return [];
    };
	
    return drawSpeedCamera;
};
