iD.svg.WalkLink = function(projection, context) {

    var highway_stack = {
        motorway: 0,
        motorway_link: 1,
        trunk: 2,
        trunk_link: 3,
        primary: 4,
        primary_link: 5,
        secondary: 6,
        tertiary: 7,
        unclassified: 8,
        residential: 9,
        service: 10,
        footway: 11
    };

    function waystack(a, b) {
        var as = 0, bs = 0;

        if (a.isOneRoadCrossWay()) return 1;
        if (b.isOneRoadCrossWay()) return -1;
		if (b._zleveltype === 'uplink') return 2;
		if (b._zleveltype === 'dnlink') return 3;
        if (a.tags.highway) { as -= highway_stack[a.tags.highway]; }
        if (b.tags.highway) { bs -= highway_stack[b.tags.highway]; }
        return as - bs;
    }
	
	function filterSubLayer (entity) {//子图层不显示, 复杂路口关联线也不显示
		if (entity.isOneRoadCrossWay && entity.isOneRoadCrossWay()) {
			var nodes = entity.nodes, node1 = nodes[0], node = context.graph().entity(node1);
			var layerInfo = node && iD.Layers.getLayer(node.layerId), available = true;
			if (layerInfo) {
				var entType = (node.modelName || node._type), sublayer = layerInfo.getSubLayerByType(entType);
				available = sublayer && sublayer.display;
			}
			return !available;
		} if (entity.isRoadZLevel && entity.isRoadZLevel()) {//设置Zlevel是否可用
			var layerInfo = entity && iD.Layers.getLayer(entity.layerId), available = true;
			if (layerInfo) {
				var entType = (entity.modelName || entity._type), sublayer = layerInfo.getSubLayerByType(entType);
				available = sublayer && sublayer.display;
			}
			if (!available) {
				var zlevel_member = entity.members;
				if (!zlevel_member.length) return;
				var link_up = zlevel_member[0], link_down = zlevel_member[1];
				if (link_up.role === 'link_up') link_up = zlevel_member[0], link_down = zlevel_member[1];
				else link_down = zlevel_member[0], link_up = zlevel_member[1];
				var link_up_way = context.graph().entity(link_up.id), link_down_way = context.graph().entity(link_down.id);
				link_up_way.zlevel && (link_up_way.zlevel = 0); link_down_way.zlevel && (link_down_way.zlevel = 0); 
			}
		} else {
			return false;
		}
	}
    /*
        walklink 也是渲染成线，只是modelName=WalkLink;
    */

    return function drawWalkLink(surface, graph, entities, filter) {
        var ways = [], pathdata = {}, onewaydata = {} ,onewaystopdata = {},
            getPath = iD.svg.Path(projection, graph);

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i],
                outer = iD.geo.simpleMultipolygonOuterMember(entity, graph);
            // if (filterSubLayer(entity)) continue;
			if (outer) {
                ways.push(entity.mergeTags(outer.tags));
            } else if (entity.geometry(graph) === 'line' && entity.modelName==iD.data.DataType.WALKLINK) {
                ways.push(entity);
            }
        }

        ways = ways.filter(getPath);

        pathdata = _.groupBy(ways, function(way) { 
			return way.layer(); 
		});

        var walkDirectionFlag = iD.WalkLinkDirection.getWalkLinkDirection();
        _.forOwn(pathdata, function(v, k) {
            onewaydata[k] = _(v)
                .filter(function(d) { return ((walkDirectionFlag || d.isOneWay() && iD.Layers.getLayer(d.layerId, d.modelName).display)); })
                .map(walkDirectionFlag?iD.svg.OneWalkLinkSegments(projection, graph, 35):iD.svg.OneWaySegments(projection, graph, 35))
                .flatten()
                .valueOf();
            onewaystopdata[k] = _(v)
                .filter(function(d) { return d.isOneStopWay() && iD.Layers.getLayer(d.layerId, d.modelName).display; })
                .map(iD.svg.OneWayStopSegments(projection, graph, 80))
                .flatten()
                .valueOf();    
        });

        var layergroup = surface.selectAll('g.layer-walk').selectAll("g.layer-walklink").data([0])

        layergroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer layer-walklink' ; });


        var linegroup = layergroup
            .selectAll('g.linegroup')
            .data(['shadow', 'casing', 'stroke']);

        linegroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer linegroup line-' + d; });


        var lines = linegroup
            .selectAll('path')
            .filter(filter)
            .data(
                function() { return pathdata[this.parentNode.parentNode.__data__] || []; },
                iD.Entity.key
            );

        // Optimization: call simple TagClasses only on enter selection. This
        // works because iD.Entity.key is defined to include the entity v attribute.
        lines.enter()
            .append('path');
        lines.attr('class', function(d) { 
            	
            	var lay = iD.Layers.getLayer(d.layerId);
            	var styleClass = this.parentNode.__data__;
            	var rod = '';
            	if(styleClass === "stroke"){
            		if(iD.Layers.getLayer(d.layerId).isRoad()){
            			rod = 'road';
                		if(lay.style){
                			d3.select(this).style(_.isFunction(lay.style)?lay.style(d):lay.style);
                		}
                	}else if(iD.Layers.getLayer(d.layerId).isLine()){
                		if(lay.style){
                			d3.select(this).style(_.isFunction(lay.style)?lay.style(d):lay.style);
                		}
                	}
                    lay.onDraw && lay.onDraw.call(this, d3.select(this), d,styleClass);
            	}

            	return 'way line '+ rod +' ' + styleClass + ' ' + d.id; 
            })
            .call(iD.svg.TagClasses());

        lines
            .sort(waystack)
            .attr('d', getPath)
            .call(iD.svg.TagClasses().tags(iD.svg.MultipolygonMemberTags(graph)));

        lines.classed('line-hidden',function(d){
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
        
        lines.exit()
            .remove();


        var onewaygroup = layergroup
            .selectAll('g.onewaygroup')
            .data(['oneway']);

        onewaygroup.enter()
            .append('g')
            .attr('class', 'layer onewaygroup');


        var oneways = onewaygroup
            .selectAll('path')
            .filter(filter)
            .data(
                function() {return onewaydata[this.parentNode.parentNode.__data__] || []; },
                function(d) {return [d.id, d.index]; }
            );

        oneways.enter()
            .append('path')
            .attr('class', 'oneway')
            .attr('marker-mid', 'url(#oneway-marker)');

        oneways
            .attr('d', function(d) { return d.d; });

        oneways.exit()
            .remove();

        // 添加禁行信息
        var onewaygroup = layergroup
            .selectAll('g.onewaygroup-stop')
            .data(['onewaystop']);

        onewaygroup.enter()
            .append('g')
            .attr('class', 'layer onewaygroup-stop');

        var oneways = onewaygroup
            .selectAll('path')
            .filter(filter)
            .data(
                function() { return onewaystopdata[this.parentNode.parentNode.__data__] || []; },
                function(d) { return [d.id, d.index]; }
            );

        oneways.enter()
            .append('path')
            .attr('class', 'oneway')
            .attr('marker-mid', 'url(#oneway-stop)');

        oneways
            .attr('d', function(d) { return d.d; });

        oneways.exit()
            .remove();

        // -------------
        var onewaygroup = layergroup
            .selectAll('g.onewaygroup-secondary')
            .data(['onewaysecondary']);

        onewaygroup.enter()
            .append('g')
            .attr('class', 'layer onewaygroup-secondary');

        var oneways = onewaygroup
            .selectAll('path')
            .filter(filter)
            .data(
                function() { return onewaystopdata[this.parentNode.parentNode.__data__] || []; },
                function(d) { return [d.id, d.index]; }
            );

        oneways.enter()
            .append('path')
            .attr('class', 'oneway')
            .attr('marker-mid', 'url(#oneway-stop-secondary)');

        oneways
            .attr('d', function(d) { return d.d; });

        oneways.exit()
            .remove();

    };
};






