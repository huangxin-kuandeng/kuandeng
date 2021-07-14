/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-03 20:34:47
 * @Description: 
 */
iD.modes.AddLandCoverArea = function(context) {
    var mode = {
        id: 'add-land-cover-area',
        button: 'landCoverArea',
        title: '',//t('modes.add_area.title'),
        description: t('modes.add_land_cover_area.description'),
        key: 'Ctrl+3',
        enable: true
    };

    var constant = iD.data.DataType;
    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_land_cover_area.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc) {
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.LANDCOVERAREA);
        var wayLayerId = wayLayer.id;
        var graph = context.graph(),
            node = iD.Node({loc: loc,
                identifier:wayLayer.identifier,
                layerId: wayLayerId,
                modelName: iD.data.DataType.LANDCOVERAREA
			}),
            way = iD.Way({
                identifier:wayLayer.identifier, 
                layerId: wayLayerId,
            modelName: iD.data.DataType.LANDCOVERAREA
            });
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, wayLayer));
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.event.add({'type': 'area', 'entity': way});
        context.enter(iD.modes.DrawLandCoverArea(context, way.id, graph, "walk-area"));
    }

    function startFromWay(loc, edge, clickWay) {
        start(loc);
    }

    function startFromNode(node) {
        start(node.loc);
    }

    mode.enter = function() {
        context.buriedStatistics().merge(1,iD.data.DataType.LANDCOVERAREA);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
