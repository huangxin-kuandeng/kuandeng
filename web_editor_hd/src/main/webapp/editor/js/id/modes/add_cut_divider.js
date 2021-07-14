/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-08 14:16:48
 * @Description: 
 */
iD.modes.AddCutDivider = function (context) {
    var mode = {
        id: 'add-cut-divider',
        button: 'cutDivider',
        title: '',//t('modes.add_line.title'),
        description: t('modes.cut_divider.description'),
        key: 'Ctrl+E',
        enable: true
    };

    // var annotation = t('modes.add_road.description');
    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.cut-divider', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_divider.tail'))
        .on('start.cut-divider', start)
        // 第一次点击的是线路
        .on('startFromWay.cut-divider', startFromWay)
        // 第一次点击的是节点
        .on('startFromNode.cut-divider', startFromNode);
        
    function enterDrawDividerMode(waydata, graph){
    	var mode = iD.modes.DrawCutDivider(context, waydata.id, graph, '', 'divider');
//  	mode.on("finish.cut-divider", function(){});
    	
    	context.enter(mode);
    }

    function start(loc) {
        // var currLayer = context.layers().getCurrentEnableLayer();
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);
        var wayLayerId = wayLayer.id;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
		var nodeLayerId = nodeLayer.id;
		var graph = context.graph(),
			node = iD.Node({
                layerId: nodeLayerId,
                identifier:nodeLayer.identifier,
				loc: loc,
				modelName: iD.data.DataType.DIVIDER_NODE
			}),
			way = iD.Way({
                layerId: wayLayerId,
                identifier:wayLayer.identifier,
				modelName: iD.data.DataType.DIVIDER
			});
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        way.tags.iscut = true;

//      context.perform( iD.actions.Noop() );
        
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
        
        // add road envent
//      context.event.add({'type': 'road', 'entity': way});
        enterDrawDividerMode(way, graph);
    }

    function startFromWay(loc, edge) {
    	start(loc);
    }

    function startFromNode(node) {
    	start(node.loc);
    }


    mode.enter = function () {
        context.buriedStatistics().merge(1,iD.data.DataType.DIVIDER);
        context.install(behavior);
    };

    mode.exit = function () {
        selectElements(true);
        context.uninstall(behavior);
    };

    return mode;
};
