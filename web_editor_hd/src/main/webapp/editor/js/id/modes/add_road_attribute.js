/*
 * @Author: tao.w
 * @Date: 2018-12-17 11:23:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:28:24
 * @Description: 
 */
/**
 * Created by wangtao on 2017/8/28.
 */
iD.modes.AddRoadAttribute = function (context) {
    var mode = {
        id: 'add-road-attribute',
        button: 'roadAttribute',
        title: t('modes.add_road_attribute.title'),
        description: t('modes.add_road_attribute.description'),
        key: 'Ctrl+B',
        enable: true
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_road_attribute.tail'))
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);


    function add(loc, datum) {
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            return;
        }

        var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_ATTRIBUTE);
        var layerId = layer.id;
        var node = iD.Node({
            modelName: iD.data.DataType.ROAD_ATTRIBUTE,
            identifier: layer.identifier,
            loc: loc,
            layerId: layerId
        });
        node.setTags(iD.util.getDefauteTags(node, layer));

        context.perform(
            iD.actions.AddEntity(node),
            t('modes.add_road_attribute.annotation'));

        context.buriedStatistics().merge(0, iD.data.DataType.ROAD_ATTRIBUTE);

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        context.event.add({ 'type': 'ROAD_ATTRIBUTE', 'entity': node });
        if (layer.continues) context.enter(iD.modes.Browse(context));
    }

    function addWay(loc, datum) {
        add(loc, datum);
    }

    function addNode(d) {

        var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_ATTRIBUTE);
        var layerId = layer.id;
        var node = iD.Node({
            modelName: iD.data.DataType.ROAD_ATTRIBUTE,
            identifier: layer.identifier,
            loc: d.loc,
            layerId: layerId
        });
        node.setTags(iD.util.getDefauteTags(node, layer));

        context.perform(
            iD.actions.AddEntity(node),
            t('modes.add_road_attribute.annotation'));

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        context.event.add({ 'type': 'ROAD_ATTRIBUTE', 'entity': node });
        if (layer.continues) context.enter(iD.modes.Browse(context));
    }

    function cancel() {
        context.enter(iD.modes.Browse(context));
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.ROAD_ATTRIBUTE);
        //d3.select('.add-road').classed('active', false);
        //d3.select('.'+this.id).classed('active', true);
        context.install(behavior);
    };

    mode.exit = function () {
        context.uninstall(behavior);
    };

    return mode;
};

