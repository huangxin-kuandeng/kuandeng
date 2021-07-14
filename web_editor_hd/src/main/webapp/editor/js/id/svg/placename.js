/**
 * Created by  on 2015/8/20.
 */
iD.svg.PlaceName = function(projection, context) {
    function markerPath(selection, klass) {
        if (klass === 'shadow' || klass === 'stroke') {
            selection
                .attr('class', klass)
                .attr('transform', 'translate(-14, -30)')
                .attr('d', 'M8.80238396875 7.22626859375c0-3.610090369315548 3.29837171875-6.8804230625 7.2661135625-6.8804230625 3.9678378125 0 7.18440896875 3.0803755 7.18440896875 6.8804230625 0 3.2657538125-2.3784194375 5.99423990625-5.56525075 6.69840246875l-1.7124709375 16.55664659375-1.71729965625-16.6038785625C11.16826790625 13.10778490625 8.80238396875 10.42601915625 8.80238396875 7.22626859375zM15.9751848125 5.38332609375c0-1.03635334375-0.87716528125-1.87648775-1.9591836875-1.87648775-1.08227421875 0-1.95947146875 0.840134375-1.95947146875 1.87648775s0.87716528125 1.87648775 1.95947146875 1.87648775C15.09801953125 7.25981384375 15.9751848125 6.41967946875 15.9751848125 5.38332609375z');

            selection.each(function(entity) {
                if (klass !== 'stroke'){
                    return ;
                }
                
                var colortype = entity.tags && entity.tags.colortype || 1;
                var color = "#ff0000";
                switch (colortype){
                    case 1:
                        color = "#ff0000";
                        break;
                    case 2:
                        color = "#00ff00";
                        break;
                    case 3:
                        color = "#0000ff";
                        break;
                }
                
                this.style.fill = color;
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

    function drawPlaceName(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-placename').selectAll('g.point')
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
            var modelConfig = iD.Layers.getLayer(d.layerId, d.modelName);
            return modelConfig && !modelConfig.display;
        });
        groups.exit()
            .remove();
    }

    drawPlaceName.available = function (points) {
        /*
        var layerInfo = points[0] && points[0].layerInfo();
        if (layerInfo) {
            var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
            return sublayer && sublayer.display;
        }
        return false;*/
        return true;
    }

    drawPlaceName.placename = function(entities, limit) {
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isPlaceName && entity.isPlaceName()) {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
        if (this.available(points)) return points;
        return [];
    };

    return  drawPlaceName;
};
