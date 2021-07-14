iD.modes.AddArea = function(context) {
    var mode = {
        id: 'add-area',
        button: 'area',
        title: '',//t('modes.add_area.title'),
        description: t('modes.add_area.description'),
        key: 'Alt+3',
        enable: true
    };

    var behavior = iD.behavior.AddWay(context)
            .tail(t('modes.add_area.tail'))
            .on('start', start)
            .on('startFromWay', startFromWay)
            .on('startFromNode', startFromNode);
//  var defaultTags = {area: ''};

    function start(loc) {
//  	var currLayer = context.layers().getCurrentEnableLayer();
//		var layerid = currLayer.id;
		var nodeLayerId =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE).id;
		var nodeLayer =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
		var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER).id;
		var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);

        var graph = context.graph(),
            node = iD.Node({
				loc: loc,
                layerId: nodeLayerId,
                identifier:nodeLayer.identifier,
				modelName: iD.data.DataType.DIVIDER_NODE,
				tags: {}
			}),
            way = iD.Way({
                layerId: wayLayerId,
                identifier:wayLayer.identifier,
            	modelName: iD.data.DataType.DIVIDER,
				tags: {}
            });
//		way.setTags(iD.util.getDefauteTags(way, wayLayer));
		way.tags["isPolygon"] = true;
        
		context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));
        

        // add way envent
        context.event.add({'type' : 'area', 'entity' : way});
        
        context.enter(iD.modes.DrawArea(context, way.id, graph));
    }

    function startFromWay(loc, edge) {
		var nodeLayerId =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE).id;
		var nodeLayer =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
		var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER).id;
		var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);

        var graph = context.graph(),
            node = iD.Node({
				loc: loc,
                layerId: nodeLayerId,
                identifier:nodeLayer.identifier,
				modelName: iD.data.DataType.DIVIDER_NODE,
				tags: {}
			}),
            way = iD.Way({
                layerId: wayLayerId,
                identifier:wayLayer.identifier,
            	modelName: iD.data.DataType.DIVIDER,
				tags: {}
            });
//		way.setTags(defauteTags(way));
		way.tags["isPolygon"] = true;

        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddMidpoint({ loc: loc, edge: edge }, node));

        context.enter(iD.modes.DrawArea(context, way.id, graph));
    }

    function startFromNode(node) {
		var nodeLayerId =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE).id;
		var nodeLayer =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
		var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER).id;
		var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);

        var graph = context.graph(),
            node = iD.Node({
				loc: loc,
                layerId: nodeLayerId,
                identifier:nodeLayer.identifier,
				modelName: iD.data.DataType.DIVIDER_NODE,
				tags: {}
			}),
            way = iD.Way({
                layerId: wayLayerId,
                identifier:wayLayer.identifier,
            	modelName: iD.data.DataType.DIVIDER,
				tags: {}
            });
//		way.setTags(defauteTags(way));
		way.tags["isPolygon"] = true;

        context.perform(
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.enter(iD.modes.DrawArea(context, way.id, graph));
    }
	/*
	function defauteTags(way){
    	var defaultTags = {},
    		modelEntity = way.layerInfo().modelEntity(),
    		gtype = modelEntity.getGeoType();
	    modelEntity.getFields(gtype).filter(function(d){
	    	if(d.defaultValue && !_.isEmpty(d.defaultValue)){
	    		defaultTags[d.fieldName] = d.defaultValue;
	        }
	        return false;
	    });
	    return defaultTags;
    }
	*/

    mode.enter = function() {
        context.buriedStatistics().merge(1,iD.data.DataType.DIVIDER);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
