iD.svg.RoadCross = function(projection, context) {
    function markerPath(selection, klass) {
        if (klass === 'shadow' || klass === 'stroke') {
        	selection
	            .attr('class', klass)
	            .attr('transform', 'translate(-35, -50)')
	            // 五角星
	            .attr('d', 'M 35,37.5 L 37.9,46.1 L 46.9,46.1 L 39.7,51.5 L 42.3,60.1 L 35,55 L 27.7,60.1 L 30.3,51.5 L 23.1,46.1 L 32.1,46.1 z');
	            
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
            		if (d.isRoadCross()) return context.imagePath('roadcross.png');
            	});
        }
        
    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function drawRoadCross(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-roadcross').selectAll('g.point');
//      groups.html('');
        
        groups = groups.filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function(d) { return 'node point crosspoint ' + d.id; })
            .order();
		
		
        group.append('path')
            .call(markerPath, 'shadow');

        group.append('path')
            .call(markerPath, 'stroke');
		/**
		group.append('image')
            .call(markerPath, 'image');*/
		
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
    }
	
	drawRoadCross.available = function (points) {
		return true;
		/*
		var layerInfo = points[0] && points[0].layerInfo();
		if (layerInfo && layerInfo.getSubLayerByType) {
			var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
			return sublayer && sublayer.display;
		}
		return false;
		*/
	}

    drawRoadCross.roadcross = function(entities, limit) {
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isRoadCross && entity.isRoadCross()) {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
		if (this.available(points)) return points;
        return [];
    };

    return drawRoadCross;
};
