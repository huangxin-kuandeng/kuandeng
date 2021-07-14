/*
 * @Author: tao.w
 * @Date: 2019-07-26 11:23:08
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:27:57
 * @Description: 
 */
iD.modes.AddObjectPl = function (context) {
    var mode = {
        id: 'add-ObjectPl',
        button: 'objectPl',
        title: '',//t('modes.add_line.title'),
        description: t('modes.add-ObjectPl.description'),
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
        .tail(t('modes.add_divider.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode)
        .on('dragend', dragMap);

    function start(loc) {
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            return;
        }

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL);
        var wayLayerId = wayLayer.id;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL_NODE);
        var nodeLayerId = nodeLayer.id;
        var graph = context.graph(),
            node = iD.Node({
                layerId: nodeLayerId,
                identifier: nodeLayer.identifier,
                loc: loc, modelName: iD.data.DataType.OBJECT_PL_NODE
            }),
            way = iD.Way({
                identifier: nodeLayer.identifier,
                layerId: wayLayerId
            });
        way.modelName = iD.data.DataType.OBJECT_PL;
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        // way.tags.isnewway = 'true';
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id)
        );

        // add road envent
        context.event.add({ 'type': 'road', 'entity': way });
        context.enter(iD.modes.DrawObjectPl(context, way.id, graph, '', 'objectPl'));
    }

    function startFromWay(loc, edge) {
        start(loc);
    }

    function startFromNode(node) {
        start(node.loc);
    }
    function dragMap(e) {
        //console.log("context:"+context)
        //console.log("palyer:"+iD.picUtil.player.allNodes)
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.OBJECT_PL);
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
