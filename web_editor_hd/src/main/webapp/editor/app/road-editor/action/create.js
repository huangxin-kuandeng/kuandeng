/**
 * Created by wt on 2015/8/5.
 */
iD.actions.AddRoad = function (wayId) {
    var walkTopo = iD.topo.RelWketRoad();
    var walkUtil = iD.util.walkExtend();
    var action = function (graph) {
        var way=graph.entity(wayId)
        var allNodes = way.nodes;
        var firstNode = way.first();
        var lastNode = way.last();
        for (var i = 1; i < allNodes.length - 1; i++) {
            var node = graph.entity(allNodes[i]);
            if (node.modelName == iD.data.DataType.ROAD_NODE
                /*&& (
                    firstNode == node.id || lastNode == node.id)*/) {
                var parentRelations = graph.parentRelations(node);
                parentRelations.forEach(function (relation) {
                    graph = graph.remove(relation);
                })
            }
        }

        //topo维护
        var handle = iD.topo.handle();
        graph = handle.create(graph, way);
        way = graph.entity(way.id);

        //道路长度属性更新
        way = iD.util.tagExtend.updateWayLengthTag(graph, way);
        graph = graph.replace(way.update({tags: iD.util.tagExtend.updateTaskTag(way)}));
        graph = graph.replace(way);

        //realNode字段更新
        var fNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph, graph.entity(way.first()));
        var tNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph, graph.entity(way.last()));
        graph = graph.replace(fNode);
        graph = graph.replace(tNode);

        // //图幅边框字段更新
        // fNode = iD.util.tagExtend.updateNodeMeshTag(graph.entity(way.first()), editor.context);
        // tNode = iD.util.tagExtend.updateNodeMeshTag(graph.entity(way.last()), editor.context);
        // graph = graph.replace(fNode);
        // graph = graph.replace(tNode);

        //步导关联关系维护
        /*若新生成道路0.1米范围内存在步导点，且该道路为人可走道路（ROAD_LINK::NAVITYPE不等于2/3/6/7），则需要同时建立步导点与车行道路的关联关系（REL_WKET_ROAD）*/
        // var distance = 0.1; //单位米
        // var walkEnterIds = walkUtil.getWalkEntersWithFilterBBox(editor.context, distance, way, way, graph);
        // if (walkEnterIds && walkEnterIds.length >= 1) {
        //     walkEnterIds.forEach(function (walkEnterId) {
        //         graph = walkTopo.createWalkLink(graph, walkEnterId, [way], 1);
        //     })
        // }
        return graph;
    };

    action.disabled = function (graph) {
        return false;
    };
    return action;
}

