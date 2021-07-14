/*
 * @Author: tao.w
 * @Date: 2020-09-01 15:45:19
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-08 19:33:00
 * @Description: 
 */

iD.modes.AddBarrier = function (context) {
    var mode = {
        id: 'add-barrier',
        button: 'barrier',
        title: '',//t('modes.add_line.title'),
        description: t('modes.add_barrier.description'),
        key: 'Ctrl+Q',
        enable: true
    };

    var highLightIds = context.selectedIDs();
    let dataType = iD.data.DataType;

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_barrier.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc) {
        let type = Number(context.variable.aboveGround.attr.TYPE);
		if(!type){
            Dialog.alert("未选择数据类型，请重新选择");
            return;
		}
        let mtype = iD.Mapping.aboveGround.BARRIER_GEOMETRY[type];
        let z = iD.util.aboveGroundMeasure(context,loc,mtype);

        if(z != null){
            loc[2] = z;
        }else{
            Dialog.alert("未找到对应位置的高程，请重新选择");
            return;
        }

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY);
		var nodeLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY_NODE);
        var wayLayerId = wayLayer.id;
		var nodeLayerId = nodeLayer.id;
        var graph = context.graph(),
            node = iD.Node({
                identifier:nodeLayer.identifier, 
                layerId: nodeLayerId, loc: loc,modelName:dataType.BARRIER_GEOMETRY_NODE}),
            way = iD.Way({
                identifier:wayLayer.identifier, 
                layerId: wayLayerId});
        way.modelName = dataType.BARRIER_GEOMETRY;
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        // way.tags.isnewway = 'true';
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));
        // add road envent
        context.event.add({'type': 'road', 'entity': way});
        context.enter(iD.modes.DrawBarrier(context, way.id, graph, '', 'barrier'));
		//道路第一次点击地图生成start
        iD.logger.editElement({
            'tag': 'add_'+way.modelName+'_start',
            'entityId': way.osmId(),
            'modelName': way.modelName
        });
    }

    function startFromWay(loc, edge) {
        let type = Number(context.variable.aboveGround.attr.TYPE);
		if(!type){
            Dialog.alert("未选择数据类型，请重新选择");
            return;
		}
        let mtype = iD.Mapping.aboveGround.BARRIER_GEOMETRY[type];
        let z = iD.util.aboveGroundMeasure(context,loc,mtype);

        if(z != null){
            loc[2] = z;
        }else{
            Dialog.alert("未找到对应位置的高程，请重新选择");
            return;
        }
        
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY);
		var nodeLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY_NODE);
        var wayLayerId = wayLayer.id;
		var nodeLayerId = nodeLayer.id;
        var graph = context.graph(),
            node = iD.Node({
                layerId: nodeLayerId,
                loc: loc,
                identifier:nodeLayer.identifier,
                modelName:dataType.BARRIER_GEOMETRY_NODE
            }),
            way = iD.Way({
                identifier:wayLayer.identifier,
                layerId: wayLayerId});
        way.modelName = dataType.BARRIER_GEOMETRY;

        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        // way.tags.isnewway = 'true';
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id));

        context.enter(iD.modes.DrawBarrier(context, way.id, graph, '', 'road'));
    }

    function startFromNode(node) {
        start(node.loc);
    	// var wayLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY);
		// var nodeLayer = iD.Layers.getCurrentModelEnableLayer(dataType.BARRIER_GEOMETRY_NODE);
        // var wayLayerId = wayLayer.id;
		// var nodeLayerId = nodeLayer.id;
        // var way = iD.Way({
        //     identifier:wayLayer.identifier, 
        //     layerId: wayLayerId});
        // way.modelName = dataType.ROAD;
        // way.setTags(iD.util.getDefauteTags(way, wayLayer));

        // // way.tags.isnewway = 'true';

        // var args = [];
        // var isBreakPoint = true;
        // var newWayFirstNode = node;
        // context.perform(iD.actions.Noop(), t('modes.add_road.description'));
        // if (node.modelName == dataType.BARRIER_GEOMETRY_NODE) {
        //     var graph = context.graph();
        //     var parentWays = graph.parentWays(node);
        //     parentWays.forEach(function (way) {
        //         if(way.first() != node.id && way.last() != node.id){
        //             isBreakPoint = false;
        //         }
        //     });
        // }
        // if(!isBreakPoint || node.modelName != dataType.BARRIER_GEOMETRY_NODE){
        //     newWayFirstNode = iD.Node({
        //         identifier:nodeLayer.identifier, 
        //         layerId: nodeLayerId,
        //         loc: node.loc,
        //         modelName: dataType.BARRIER_GEOMETRY_NODE
        //     });
        //     newWayFirstNode.setTags(iD.util.getDefauteTags(newWayFirstNode, nodeLayer));
        //     args.push(iD.actions.AddEntity(newWayFirstNode));

        // }
        // // if(isBreakPoint){
        // //     args.push(iD.actions.SplitRoad([node.id], context));
        // // }
        // args.push(...[iD.actions.AddEntity(way),
        //     iD.actions.AddVertex(way.id, newWayFirstNode.id)]);
        // context.replace.apply(this, args);
        // context.enter(iD.modes.DrawLine(context, way.id, graph, '', 'road'));

    }

    mode.enter = function () {
        context.buriedStatistics().merge(1,dataType.BARRIER_GEOMETRY);
        context.install(behavior);
        var panel = iD.ui.modelNamePlane(context,{attr:['TYPE'],modelName:dataType.BARRIER_GEOMETRY});
        panel.show()
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", true);
		//点击-在地图上添加道路按钮-激活状态-操作时增加埋点
		iD.UserBehavior.logger({
            'filter': 'none',
            'type': 'click',
            'tag': 'click_add_road',
            'desc': '激活'
        });
    };

    mode.exit = function () {
        selectElements(true);
        context.uninstall(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", false);
    };

    return mode;
};
