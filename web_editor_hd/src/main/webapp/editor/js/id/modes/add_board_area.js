/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-08 14:15:35
 * @Description: 
 */
iD.modes.AddBoardArea = function(context) {
    var mode = {
        id: 'add-board-area',
        button: 'board-area',
        title: '',//t('modes.add_board_area.title'),
        description: t('modes.add_board_area.description'),
        key: 'Alt+5',
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
        .tail(t('modes.add_board_area.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc) {
    	var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.TRAFFICSIGN_NODE);
        var nodeLayerid = nodeLayer.id;
        var pgLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.TRAFFICSIGN);
        var pgLayerid = pgLayer.id;
        var graph = context.graph(),
            node = iD.Node({
            	loc: loc, 
                layerId: nodeLayerid,
                identifier:nodeLayer.identifier,
                modelName: iD.data.DataType.TRAFFICSIGN_NODE
			}),
            way = iD.Way({
                layerId: pgLayerid,
                identifier:nodeLayer.identifier,
            	modelName: iD.data.DataType.TRAFFICSIGN
            });
        way.setTags(iD.util.getDefauteTags(way, pgLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.event.add({'type': 'area', 'entity': way});
        context.enter(iD.modes.DrawBoardArea(context, way.id, graph, "board-area"));
    }

    function startFromWay(loc, edge, clickWay) {
        start(loc);
    }

    function startFromNode(node) {
        start(node.loc);
    }

    mode.enter = function() {
        context.buriedStatistics().merge(1,iD.data.DataType.TRAFFICSIGN);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
