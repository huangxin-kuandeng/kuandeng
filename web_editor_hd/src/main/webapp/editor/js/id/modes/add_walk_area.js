/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:22:15
 * @Description: 
 */
/**
 * Created by tao.w on 2015/11/16.
 */
iD.modes.AddWalkArea = function (context) {
    var mode = {
        id: 'add-walk-area',
        button: 'walk-area',
        title: t('modes.add_walk_area.title'),
        description: t('modes.add_walk_area.description'),
        key: 'Ctrl+l',
        enable: true
    };

    //var mode = {
    //    id: 'add-walk-area',
    //    button: 'walkarea',
    //    title: t('modes.add_walk_area.description'),
    //    description: t('modes.add_walk_area.description'),
    //    key: 'Ctrl+L',
    //    enable: true
    //};

    var constant = iD.data.DataType;
    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_walk_area.tail'))
        .on('start', start)
        //.on('startFromWay', startFromWay)
        //.on('startFromNode', startFromNode);
        .on('startFromWay', start)
        .on('startFromNode', start);

    function start(loc) {
        // var currLayer = context.layers().getCurrentEnableLayer(),
        var currLayer = context.layers().getLayer(),
             areaLayer = context.layers().getSubLayerByName(constant.WALKAREA);
        var graph = context.graph(),
            node = iD.Node({
                loc: loc,
                identifier:currLayer.identifier,
                layerId: currLayer.id,
                modelName:constant.WALKAREA
            }),
            way = iD.Way({
                identifier:currLayer.identifier, 
                layerId: currLayer.id,tags: {area: ''}});
        way.setTags(iD.util.getDefauteTags(way));
        way.tags.area = '';
        // node.setTags({datatype: constant.WALKAREA});
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));
        
        // add way envent
        context.event.add({'type' : 'area', 'entity' : way});

        context.enter(iD.modes.DrawArea(context, way.id, graph,"walk-area"));

    }


    mode.enter = function () {
        context.buriedStatistics().merge(1,iD.data.DataType.WALKAREA);
        context.install(behavior);
    };

    mode.exit = function () {
        selectElements(true);
        context.uninstall(behavior);
    };

    return mode;
};