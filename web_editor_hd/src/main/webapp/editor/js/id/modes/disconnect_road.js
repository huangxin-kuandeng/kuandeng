/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:07:03
 * @Description: 
 */
iD.modes.DisconnectRoad = function(context) {
    var mode = {
        id: 'disconnect-road',
        button: 'disconnect',
        title: '',
        description: t('modes.disconnect-road.description'),
        key: '8'
    };

    var origSelectedId = context.selectedIDs();
    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(origSelectedId, context.graph()))
            .classed('selected', flag);
    }
    context.map().on('drawn.select', selectElements);


    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.disconnect-road.tail'))
        .on('startFromWay', startFromWay)
        .on('startFromNode',startFromNode);

    function startFromWay(loc, edge,datum) {
    	// var currLayer = context.layers().getCurrentEnableLayer();
    	var currLayer = context.layers().getLayer(datum.layerId);
		if (currLayer && currLayer.isRoad()) {
            var node = iD.Node({
                identifier:currLayer.identifier,
                layerId: currLayer.id, loc: loc});

            /*if(datum.modelName&&datum.modelName==iD.data.DataType.WALKLINK){
                node = node.mergeTags({datatype: iD.data.DataType.WALKENTER});
            }else{
                node = node.mergeTags({datatype: iD.data.DataType.ROAD_NODE});
            }*/
            //其他道路不能打断
            var graph = context.graph().replace(node.move(loc));
            var newSelectedWay = _.intersection(
                graph.parentWays(graph.entity(edge[0])),
                graph.parentWays(graph.entity(edge[1])));
            var  newSelectedId = newSelectedWay[0].id;
            if(newSelectedId ==origSelectedId){
                var annotation = t('operations.split.annotation.road');
                context.perform(iD.actions.AddMidpoint({ loc: loc, edge: edge }, node), iD.actions.SplitRoad([node.id],context),annotation);
                context.enter(iD.modes.Browse(context));
            }else{
                Dialog.alert("请在选中的道路上进行打断！！");
                //alert("请在选中的道路上进行打断！！");
                selectElements(false);
                context.enter(iD.modes.Browse(context));
            }
	}
    }

    //处理打断点是形状点的case
    function startFromNode(datum){
        // var currLayer = context.layers().getCurrentEnableLayer();
        var currLayer = context.layers().getLayer(datum.layerId);
        if (currLayer && currLayer.isRoad()&&(datum.modelName==iD.data.DataType.WALKLINK||datum.modelName==iD.data.DataType.HIGHWAY)) {
            var parentWays = context.graph().parentWays(datum);
            if(parentWays.length ==1){
                if(parentWays[0].id == origSelectedId){
                    var way = parentWays[0];
                    var index = way.nodes.indexOf(datum.id);    //形状点在道路中的index
                    var node = iD.Node({
                        identifier:currLayer.identifier,
                        layerId: currLayer.id, loc: datum.loc});
                    /*if(datum.modelName&&datum.modelName==iD.data.DataType.WALKLINK){
                        node = node.mergeTags({datatype: iD.data.DataType.WALKENTER});
                    }else if(datum.modelName&&datum.modelName==iD.data.DataType.HIGHWAY){
                        node = node.mergeTags({datatype: iD.data.DataType.ROAD_NODE});
                    }*/
                    var annotation = t('operations.split.annotation.road');
                    //var choice = iD.geo.chooseEdge(context.childNodes(parentWays[0]), context.mouse(), context.projection);
                    var loc = datum.loc;
                    var edge = [way.nodes[index - 1], way.nodes[index]];
                    context.perform(iD.actions.AddMidpoint({ loc: loc, edge: edge }, node),iD.actions.DeleteMultiple([datum.id]), iD.actions.SplitRoad([node.id],context),annotation);
                    context.enter(iD.modes.Browse(context));

                }else{
                    Dialog.alert("请在选中的道路上进行打断！！");
                    selectElements(false);
                    context.enter(iD.modes.Browse(context));
                }
            }
        }
    }

    mode.enter = function() {
        selectElements(true);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
