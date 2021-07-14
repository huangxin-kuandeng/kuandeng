iD.effects = iD.effects||{};
/**
 * 所有线类型，渲染AB方向
 * 来自：iD.svg.Traffic
 * @param {Object} context
 */
iD.effects.wayDirection = function(context) {
	var allWays = [];
    var effect = {
        id: 'way-direction',
        button: 'way-direction',
        title: t('effects.wayDirection.title'),
        iconText: 'WD',
        description: t('effects.wayDirection.description'),
        key: 'Shift+D',
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this, graph = context.graph();
        	self.enable = open == null ? false : open;
        	allWays.length = 0;
        	if(!self.enable){
        		refreshMap();
        		return ;
        	}
        	context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity])).filter(function(entity){
        		if(entity.modelName && entity.geometry(graph) === 'line'){
        			allWays.push(entity);
        		}
        	});
        	refreshMap();
        }
    };
    
    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    
    function markerNodePath(selection, style) {
	    if (style === 'image') {
	        selection
	            .attr('class', style)
	            .attr('x', -12)
	            .attr('y', -12)
	            .attr('width', 25)
	            .attr('height', 25)
	            .attr('xlink:href', function (d) {
	                return d.tags.node === 'first' ? context.imagePath('pointa.png') : context.imagePath('pointb.png');
	            });
	
	    }
    }
    
    function transps() {
		var result = {};
		var graph = context.graph();
		var _allWays = [];
		for(var way of allWays){
			if(!graph.hasEntity(way.id)) continue;
			way = graph.entity(way.id);
			_allWays.push(way);
			var trans = iD.Transportation()
			    .newTransportations(
			    	graph.entity(way.first()),
			    	graph.entity(way.last()),
			    	way.tags.DIRECTION) || {};
			_.extend(result, trans);
		}
		allWays = _allWays;
		return result;
    }
    
    context.map().on('drawn.effect-wayDirection', function(param){
    	// full 为true时代表拖拽、缩放等操作触发的drawn
    	if(!param.full){
    		return ;
    	}
    	var surface = context.map().surface;
		surface
        	.select('.layer-way_direction')
        	.html('');
    	if(!effect.enable || !allWays.length){
    		return ;
    	}
    	var projection = context.projection;
        var groups = surface.select('.layer-way_direction')
            .selectAll('g.traffic_node')
            .data(_.values(transps()), function (d) {
                return d.id;
            });
        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point traffic_node ' + d.id;
            }).sort(function(d1, d2){
            	if(d1.tags.node === d2.tags.node){
            		return 0;
            	}
            	if(d1.tags.node == 'first'){
            		return -1;
            	}
            	if(d1.tags.node == 'last') {
            		return 1;
            	}
            	return 0;
            });

        //group.append('circle').call(markerNodePath, 'shadow');
        //group.append('circle').call(markerNodePath, 'stroke');
        group.append('image').call(markerNodePath, 'image');

        // group.append('use')
        //   .attr('class', 'icon')
        //   .attr('transform', 'translate(-6, -20)')
        //   .attr('clip-path', 'url(#clip-square-12)');

        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        groups.exit().remove();
    });

    return effect;
};
