/**
 * Created by  on 2015/11/8.
 */
iD.svg.DetailSlope = function(projection, context) {
    function markerPath(selection, klass) {
        if (klass === 'shadow' || klass === 'stroke') {
            selection
                .attr('class', klass)
                .attr('transform', 'translate(-8, -23)')
                .attr('d', 'M 14,6 L 8,6 L 8,0 L 6,0 L 6,6 L 0,6 L 0,8 L 6,8 L 6,14 L 8,14 L 8,8 L 14,8 z');

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
                    if (d.isPlaceName()) return context.imagePath('roadcross.png');
                });
        }

    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function drawDetailSlope(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-detailslope').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        //surface.select('.layer-detailslope').classed('no-pointer-events');

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


        /*
         group.append('use')
         .attr('class', 'KDSEditor-icon')
         .attr('transform', 'translate(0, 0)')
         .attr('clip-path', 'url(#clip-square-12)');
         */

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

    drawDetailSlope.available = function (points) {
        /*
         var layerInfo = points[0] && points[0].layerInfo();
         if (layerInfo) {
         var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
         return sublayer && sublayer.display;
         }
         return false;*/
        return true;
    }

    drawDetailSlope.detailslope = function(entities, limit) {
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isDetailSlope && entity.isDetailSlope()) {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
        if (this.available(points)) return points;
        return [];
    };

    return  drawDetailSlope;
};
