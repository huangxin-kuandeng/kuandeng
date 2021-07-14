/**
 * Created by  on 2015/11/22.
 */
iD.svg.WalkZlevel = function(projection, context) {

    //获取虚线或实线(原线)绘制路径
    function getAttitudeD () {
        var round = iD.svg.Round().stream,
            clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
            project = projection.stream,
            path = d3.geo.path().projection({stream: function(output) { return  project(clip(round(output)));}}),
            json = {type : 'LineString', coordinates : []};

        return {
            dotted: function(obj) {
                var entity = obj.entity, wyId = obj.wayId;
                try {
                    json.coordinates = [];
                    json.coordinates.push(entity.loc);
                    json.coordinates.push(context.temp().zlevel_locs[entity.id + '-' + wyId]);
                    return path(json);
                }catch(e){}
            }
        }
    };

    //绘制虚线
    function drawDottedLine (surface, path, points, filter) {
        var groups = surface.select('.layer-zlevel-path-point')
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

        surface.selectAll('.layer-zlevel-path-point').remove();
        surface.append('g').attr('class','layer layer-zlevel-path-point');

        var graph = context.graph(), path = getAttitudeD(projection, graph), _points = [];

        for (var i = 0; i < points.length; i++) {
            var entity = points[i];
            if (entity.members.length <= 1) continue;
            var wayId0 = entity.members[0].id, oId0 = entity.id + '-' + wayId0,
                wayId1 = entity.members[1].id, oId1 = entity.id + '-' + wayId1;

            iD.util.storeDottedLoc(entity, context.graph().entity(wayId0), oId0, context.temp().zlevel_locs, context);
            iD.util.storeDottedLoc(entity, context.graph().entity(wayId1), oId1, context.temp().zlevel_locs, context);

            _points.push({id: oId0, entity: entity, wayId: wayId0}); _points.push({id: oId1, entity: entity, wayId: wayId1});
        }
        if (points[0] && iD.Layers.getLayer(points[0].layerId, points[1].modelName).display) drawDottedLine(surface, path, _points, filter);
    }



    function markerPath(selection, klass) {
        var width = 16, height = 16, hw = width / 2, hh = height / 2;
        if (klass === 'shadow' || klass === 'stroke') {

            selection
                .attr('class', klass)
                .attr('transform', 'translate(-' + hw + ', -' + hh + ')')
                .attr('d', "M " + 0 + " "+ 0 +" L" + 0 + " "+ height +" L" + width + " "+ height +" L" + width + " " + 0 +" Z");

            selection.each(function(entity) {
                if (klass === 'stroke') this.style.fill = "#ff0000";
            });
        } else if (klass === 'image') {
            selection
                .attr({
                    x: -hw,
                    y: -hh,
                    width: width,
                    height: height
                })
                .attr('xlink:href', function(d){
                    return context.imagePath('zlevel.png');
                });
        }

    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }


    function drawWalkZlevel(surface, points, filter) {
        points.sort(sortY);

        var layer_walkzlevel= surface.select('.layer-walk').selectAll("g.layer.layer-walkzlevel").data([0]);
        layer_walkzlevel.enter().append("g").attr("class","layer layer-walkzlevel no-pointer-events");
        var groups = layer_walkzlevel.selectAll('g.point')
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

    drawWalkZlevel.available = function (points) {
        /*
         var layerInfo = points[0] && points[0].layerInfo();
         if (layerInfo) {
         var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
         return sublayer && sublayer.display;
         }
         return false;*/
        return true;
    }

    drawWalkZlevel.walkzlevel = function(entities, limit) {
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isWalkZlevel && entity.isWalkZlevel()) {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
        if (this.available(points)) return points;
        return [];
    };

    return  drawWalkZlevel;
};
