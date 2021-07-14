/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:35:33
 * @Description: 
 */
iD.modes.AddLine = function(context) {
    var mode = {
        id: 'add-line',
        button: 'line',
        title:'',// t('modes.add_line.title'),
        description: t('modes.add_line.description'),
        key: 'Ctrl+Q',
        enable: true
    };

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_line.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);
    
    function start(loc) {
    	// var currLayer = context.layers().getCurrentEnableLayer();
    	var currLayer = context.layers().getLayer();
        var graph = context.graph(),
            node = iD.Node({layerId: currLayer.id,
                identifier:currLayer.identifier,
                 loc: loc}),
            way = iD.Way({
                identifier:currLayer.identifier,
                layerId: currLayer.id});
        	// node.tags.datatype = "";
        	// way.tags.datatype = "";
        	
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
       
        // add way envent
        context.event.add({'type' : 'line', 'entity' : way});

        context.enter(iD.modes.DrawLine(context, way.id, graph));
    }

    function startFromWay(loc, edge) {
    	// var currLayer = context.layers().getCurrentEnableLayer();
    	var currLayer = context.layers().getLayer();
        var graph = context.graph(),
        node = iD.Node({
            identifier:currLayer.identifier,
            layerId: currLayer.id, loc: loc}),
        way = iD.Way({
            identifier:currLayer.identifier,
            layerId: currLayer.id});
        // node.tags.datatype = "";
        // way.tags.datatype = "";
        
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddMidpoint({ loc: loc, edge: edge }, node));

        context.enter(iD.modes.DrawLine(context, way.id, graph));
    }

    function startFromNode(node) {
    	// var currLayer = context.layers().getCurrentEnableLayer();
    	var currLayer = context.layers().getLayer();
        var way = iD.Way({
            identifier:currLayer.identifier, 
            layerId: currLayer.id});
        	// way.tags.datatype = "";
        context.perform(
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
        
        context.enter(iD.modes.DrawLine(context, way.id, context.graph()));
    }

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
