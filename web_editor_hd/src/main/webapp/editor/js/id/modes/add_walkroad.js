/**
 * Created by wt on 2015/11/12.
 */
iD.modes.AddWalkroad = function (context) {
    var mode = {
        id: 'add-walkroad',
        button: 'walkroad',
        title: t('modes.add_walkroad.description'),
        description: t('modes.add_walkroad.description'),
        key: 'Ctrl+W',
        enable: true
    };
    var constant = iD.data.DataType;
    var newWayId;
    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_line.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc, flag, originalNode) {
        // var currLayer = context.layers().getCurrentEnableLayer();
        var currLayer = context.layers().getLayer();
        var graph = context.graph(),
            node = iD.Node({
                identifier:currLayer.identifier,
                layerId: currLayer.id, 
                loc: loc}),
            way = iD.Way({
                identifier:currLayer.identifier,
                layerId: currLayer.id});
        way.setTags(iD.util.getDefauteTags(way));
        way.tags.isnewwalklink = 'true';
        // node.setTags({datatype: constant.WALKENTER});
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
        // add road event
        context.event.add({'type': 'road', 'entity': way});
        newWayId = way.id;
        context.enter(iD.modes.DrawLine(context, way.id, graph, '', 'walkroad'));
    }

    function startFromWay(loc, edge, originalEntity) {
        // var currLayer = context.layers().getCurrentEnableLayer();
        var currLayer = context.layers().getLayer();
        var graph = context.graph(),
            node = iD.Node({
                identifier:currLayer.identifier,
                layerId: currLayer.id, loc: loc}),
            way = iD.Way({
                identifier:currLayer.identifier,
                layerId: currLayer.id});
        way.setTags(iD.util.getDefauteTags(way));
        way.tags.isnewwalklink = 'true';
        // node.setTags({datatype: constant.WALKENTER});
        var args = [iD.actions.AddMidpoint({loc: loc, edge: edge}, node),
            iD.util.SplitRoadRule([node.id], context, iD.walkRoadFlag.WALKROAD, originalEntity),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id)];
        context.perform.apply(this, args)
        newWayId = way.id;
        context.enter(iD.modes.DrawLine(context, way.id, graph, '', 'walkroad'));
    }

    function startFromNode(node) {
        if (node.modelName == iD.data.DataType.ROADNODE || node.modelName == iD.data.DataType.HIGHWAY) {
            start(node.loc, constant.HIGHWAY, node);
        }
        else {
            // var currLayer = context.layers().getCurrentEnableLayer();
            var currLayer = context.layers().getLayer();
            var way = iD.Way({
                identifier:currLayer.identifier, 
                layerId: currLayer.id});
            way.setTags(iD.util.getDefauteTags(way));
            way.tags.isnewwalklink = 'true';
            //    node.setTags({datatype: constant.WALKENTER});
            var args = [iD.util.SplitRoadRule([node.id], context, iD.walkRoadFlag.WALKROAD, node),
                iD.actions.AddEntity(way),
                iD.actions.AddVertex(way.id, node.id)]
            context.perform(iD.actions.Noop(), t('modes.add_walkroad.description'));
            if (node.tags/* && node.tags['datatype'] == constant.WALKENTER*/) {
                args.splice(0, 1);
            }
            else if (node.tags /*&& (node.tags['datatype'] == constant.WALKLINK)*/) {
                var newNode = iD.Node({
                    layerId: node.layerId,
                    identifier:currLayer.identifier,
                    loc: node.loc/*,
                    tags: {datatype: iD.data.DataType.WALKENTER}*/
                });
                context.replace(iD.actions.AddEntity(newNode), t('modes.add_walkroad.description'));
                var graph = context.graph();
                var parentWays = graph.parentWays(node);
                parentWays.forEach(function (way) {
                    var nodesArr = way.nodes;
                    nodesArr.forEach(function (wayNode) {
                        if (wayNode == node.id) {
                            way = way.removeNode(node.id);
                            context.replace(iD.actions.AddEntity(way), t('modes.add_walkroad.description'));
                        }
                    });
                });
                var sIndex = parentWays[0].id;
                var entityWay = context.graph().entity(sIndex);
                context.replace(iD.actions.DeleteNode(node.id), t('modes.add_walkroad.description'));
                var choice = iD.geo.chooseEdge(context.childNodes(entityWay), context.mouse(), context.projection),
                    edge = [entityWay.nodes[choice.index - 1], entityWay.nodes[choice.index]];
                args = [iD.actions.AddMidpoint({loc: newNode.loc, edge: edge}, newNode),
                    iD.util.SplitRoadRule([newNode.id], context, iD.walkRoadFlag.WALKROAD, node),
                    iD.actions.AddEntity(way),
                    iD.actions.AddVertex(way.id, newNode.id)]
            }
            context.perform.apply(this, args);
            newWayId = way.id;
            context.enter(iD.modes.DrawLine(context, way.id, context.graph(), '', 'walkroad'));
        }
    }


    mode.enter = function () {
        var roadcross = d3.select('g.layer.layer-roadcross')
        roadcross.classed("no-pointer-events", true);
        var placename = d3.select('g.layer.layer-placename')
        placename.classed("no-pointer-events", true);
        context.install(behavior);
    };

    mode.exit = function () {

        context.uninstall(behavior);
        var roadcross = d3.select('g.layer.layer-roadcross');
        roadcross.classed("no-pointer-events", false);
        var placename = d3.select('g.layer.layer-placename')
        placename.classed("no-pointer-events", false);
        selectElements(true);
    };

    return mode;
};
