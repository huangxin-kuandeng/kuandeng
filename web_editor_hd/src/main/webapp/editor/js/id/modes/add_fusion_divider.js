iD.modes.AddFusionDivider = function (context) {
    var mode = {
        id: 'add-fusion-divider',
        button: 'fusiondivider',
        title: '',//t('modes.add_line.title'),
        description: t('modes.add_fusion_divider.description'),
        key: 'Ctrl+Q',
        enable: true
    };

    // var annotation = t('modes.add_road.description');
    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_fusion_divider.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc) {
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);
		var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
        var wayLayerId = wayLayer.id;
		var nodeLayerId = nodeLayer.id;
        var graph = context.graph(),
            node = iD.Node({
				layerId: nodeLayerId,
                loc: loc,
                identifier:nodeLayer.identifier,
                tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, nodeLayer),
				modelName: iD.data.DataType.DIVIDER_NODE
			}),
            way = iD.Way({
                identifier:nodeLayer.identifier,
                layerId: wayLayerId,modelName:iD.data.DataType.DIVIDER});
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        // node.setTags(iD.util.getDefauteTags(node));

        // way.tags.isnewway = 'true';
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
        // add road envent
        context.event.add({'type': 'road', 'entity': way});
        context.enter(iD.modes.DrawFusionDivider(context, way.id, graph, '', 'fusiondivider'));
    }

    function startFromWay(loc, edge) {
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);
		var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
        var wayLayerId = wayLayer.id;
		var nodeLayerId = nodeLayer.id;
        var graph = context.graph(),
            node = iD.Node({
                layerId: nodeLayerId,
                loc: loc,
                identifier:nodeLayer.identifier,
                modelName: iD.data.DataType.DIVIDER_NODE
            }),
            way = iD.Way({
                identifier:nodeLayer.identifier,
                layerId: wayLayerId});
        way.modelName = iD.data.DataType.DIVIDER;
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        // way.tags.isnewway = 'true';
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));

        context.enter(iD.modes.DrawFusionDivider(context, way.id, graph, '', 'fusiondivider'));
    }

    function startFromNode(node) {
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);
		var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
        var wayLayerId = wayLayer.id;
		var nodeLayerId = nodeLayer.id;
        var way = iD.Way({
            identifier:wayLayer.identifier, 
            layerId: wayLayerId});
        way.modelName = iD.data.DataType.DIVIDER;
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        // way.tags.isnewway = 'true';
        var args = [];
        var isBreakPoint = true;
        var newWayFirstNode = node;
        context.perform(iD.actions.Noop(), t('modes.add_road.description'));
        if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
            var graph = context.graph();
            var parentWays = graph.parentWays(node);
            parentWays.forEach(function (way) {
                 if(way.first() != node.id && way.last() != node.id){
                     isBreakPoint = false;
                 }
            });
        }
        if(!isBreakPoint || node.modelName != iD.data.DataType.DIVIDER_NODE){
            newWayFirstNode = iD.Node({
                layerId: nodeLayerId,
                loc: node.loc,
                modelName: iD.data.DataType.DIVIDER_NODE
            });

            newWayFirstNode.setTags(iD.util.getDefauteTags(newWayFirstNode, nodeLayer));
            args.push(iD.actions.AddEntity(newWayFirstNode));
        }
        args.push(...[iD.actions.AddEntity(way),
                 iD.actions.AddVertex(way.id, newWayFirstNode.id)]);
        context.replace.apply(this, args);
        context.enter(iD.modes.DrawFusionDivider(context, way.id, graph, '', 'fusiondivider'));


        //
        // var args = [iD.actions.SplitDivider([node.id], context),
        //     iD.actions.AddEntity(way),
        //     iD.actions.AddVertex(way.id, node.id)];
        // context.perform(iD.actions.Noop(), t('modes.add_fusion_divider.description'));
        // if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
        //     args.splice(0, 1);
        // } else if (node.tags && node.modelName == iD.data.DataType.FUSION_DIVIDER) {
        //     var newNode = iD.Node({
        //         layerId: node.layerId,
        //         loc: node.loc,
        //         modelName: iD.data.DataType.FUSION_DIVIDER_NODE
        //     });
        //     context.replace(iD.actions.AddEntity(newNode), t('modes.add_fusion_divider.description'));
        //
        //     var graph = context.graph();
        //     var parentWays = graph.parentWays(node);
        //
        //     parentWays.forEach(function (way) {
        //         var nodesArr = way.nodes;
        //         nodesArr.forEach(function (wayNode) {
        //             if (wayNode == node.id) {
        //                 way = way.removeNode(node.id);
        //                 context.replace(iD.actions.AddEntity(way), t('modes.add_fusion_divider.description'));
        //             }
        //         });
        //     });
        //     var sIndex = parentWays[0].id;
        //     var entityWay = context.graph().entity(sIndex);
        //     //parentWays = context.graph().parentWays(node);
        //     context.replace(iD.actions.DeleteNode(node.id), t('modes.add_fusion_divider.description'));
        //
        //
        //     var choice = iD.geo.chooseEdge(context.childNodes(entityWay), context.mouse(), context.projection),
        //         edge = [entityWay.nodes[choice.index - 1], entityWay.nodes[choice.index]];
        //
        //     args = [iD.actions.AddMidpoint({loc: newNode.loc, edge: edge}, newNode),
        //         // iD.actions.SplitDivider([newNode.id], context),
        //         iD.actions.AddEntity(way),
        //         iD.actions.AddVertex(way.id, newNode.id)]
        // }
        //
    }

    // function defauteTags(way) {
    //     var defaultTags = {},
    //         modelEntity = way.layerInfo().modelEntity(),
    //         gtype = modelEntity.getGeoType();
    //     modelEntity.getFields(gtype).filter(function (d) {
    //         // if (d.defaultValue && !_.isEmpty(d.defaultValue)) {
    //             defaultTags[d.fieldName] = d.defaultValue;
    //         // }
    //         return false;
    //     });
    //     return defaultTags;
    // }

    mode.enter = function () {
        context.install(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", true);
    };

    mode.exit = function () {
        selectElements(true);
        context.uninstall(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", false);
    };

    return mode;
};
