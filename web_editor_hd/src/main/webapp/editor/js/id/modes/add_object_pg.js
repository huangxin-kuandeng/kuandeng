/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:04:20
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:27:43
 * @Description: 
 */
iD.modes.AddObjectPG = function (context) {
    var mode = {
        id: 'add-objectPG',
        button: 'objectPG',
        title: '',//t('modes.add_area.title'),
        description: t('modes.add_objectPG.description'),
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
        let xyz = iD.util.getPlyZ(context, loc);
        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            context.enter(iD.modes.Browse(context))
            return;
        }

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);
        var wayLayerId = wayLayer.id;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
        var nodeLayerId = nodeLayer.id;

        var graph = context.graph(),
            node = iD.Node({
                loc: loc,
                layerId: nodeLayerId,
                identifier: nodeLayer.identifier,
                modelName: iD.data.DataType.OBJECT_PG_NODE
            }),
            way = iD.Way({
                identifier: wayLayer.identifier,
                layerId: wayLayerId,
                modelName: iD.data.DataType.OBJECT_PG
            });
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.event.add({ 'type': 'area', 'entity': way });
        context.enter(iD.modes.DrawObjectPG(context, way.id, graph, "object-pg"));
    }

    function startFromWay(loc, edge) {
        start(loc);
    }

    function startFromNode(node) {
        start(node.loc);
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.OBJECT_PG);
        context.install(behavior);
    };

    mode.exit = function () {
        context.uninstall(behavior);
    };

    return mode;
};
