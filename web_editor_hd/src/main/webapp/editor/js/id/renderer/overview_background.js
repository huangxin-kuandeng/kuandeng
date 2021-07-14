iD.OverviewBackground = function(context, projection, tilelayer) {
    var dispatch = d3.dispatch('overview_change'),
        baseLayer = iD.TileLayer(context).projection(projection);
    
    var source;
    if (tilelayer) {
    	source = iD.BackgroundSource(tilelayer);
    } else {
    	source = iD.BackgroundSource({
    			'url': '',
    	        'zooms': [0, 20]
    	});
    }
    
    function background(selection) {
    	
        var base = selection.selectAll('.overview-background-layer').data([0]);
        base.enter().insert('div', '.overview-layer-data')
        	.attr('class', 'overview-layer-layer overview-background-layer')
        	.attr('style', 'z-Index: 100');
        base.call(baseLayer);
        base.exit().remove();
        
    }
    
    background.dimensions = function(_) {
        baseLayer.dimensions(_);
    };
    
    background.baseLayerSource = function(d) {
        if (!arguments.length) return baseLayer.source();
        baseLayer.source(d);
        dispatch.overview_change();
        return background;
    };

    background.init = function(){
        background.baseLayerSource(source);
    }

    background.init();
    
    return d3.rebind(background, dispatch, 'on');
};
