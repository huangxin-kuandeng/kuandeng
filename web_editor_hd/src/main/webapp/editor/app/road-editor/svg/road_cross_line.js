/**
 * Created by  on 2015/9/8.
 * 绘制综合交叉线
 */
iD.svg.RoadCrossLine = function(projection, context) {

    function drawRoadCrossLine(surface,graph, entities, filter) {

        //var data =[];
        var layers = iD.Layers;
        // var currentLayer = layers.getCurrentEnableLayer();
        var currentLayer = layers.getLayer();
        //console.log(entities);

        /*
        //把前端graph里面的综合交叉点数据综合构造成综合交叉线数据
        entities.forEach(function (entity) {
            var memebers = entity.members;
            memebers.forEach(function(member){
                var newWay = iD.Way({
                    _type: 'roadcrossline',
                    layerId : currentLayer.id,
                    nodes : [entity.id,member.id]
                });
                data.push({'geometry':newWay.asGeoJSON(graph)});
            })
        })*/

        //var getPath = iD.svg.GeoJsonPath(projection, graph);
        var getPath = iD.svg.Path(projection, graph);

        /*
        var crossLineInfo = d3.select("#supersurface").selectAll("#roadcrosslineInfo").data([0]);
        var update=crossLineInfo;
        var insert = crossLineInfo.enter();
        //update.text(function(d,i){ return null});
        var wrap = insert.append("div").attr("id","roadcrosslineInfo").attr('class','layer-layer layer-roadcrossline').style({"z-Index":"400"});

        //var wrap = d3.select("#supersurface").append("div").attr('class','layer-layer layer-roadcrossline').attr('style','z-Index: 400');
        var crosssurfaceInfo = wrap.selectAll('svg').data([0]);
       crosssurfaceInfo.enter().append('svg').attr("id","crosssurface").attr('width','930').attr('height','621').attr('data-zoom','19');
    `

        var crosssurface =  d3.select("#crosssurface");
        //var layergroup = crosssurface.select('.layer-roadcrossline');
        var linegroup = crosssurface
            .selectAll('g')
            .data(['shadow', 'casing', 'stroke']);  */


        var layergroup = surface.select('.layer-roadcrossline');
        var linegroup = layergroup
            .selectAll('g')
            .data(['shadow', 'casing', 'stroke']);
        linegroup.enter()
            .append('g')
            .attr('class', function (d) {
                return 'layer roadcrossline-' + d;
            });

        var lines = linegroup
            .selectAll('path')
            .filter(filter)
            .data(function(){
                return entities||[];
            },iD.Entity.key);
        lines.enter()
            .append('path');
        lines.attr('d', getPath).attr('style', function (d) {
                //console.log(d);
                return 'stroke:red;stroke-width:1;stroke-dasharray: 2,2;';
            });
        //console.log(data);
        lines.exit().remove();
    }

    drawRoadCrossLine.available = function (points) {
        var layerInfo = points[0] && iD.Layers.getLayer(points[0].layerId);
        if (layerInfo) {
            var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
            return sublayer && sublayer.display;
        }
        return false;
    }

    drawRoadCrossLine.roadcrossline = function(entities, limit) {
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

    return  drawRoadCrossLine;
};
