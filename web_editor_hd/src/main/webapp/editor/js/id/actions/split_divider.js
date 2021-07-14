/**
 * 车道线打断
 * @param {String} nodeId
 * @param {Object} context 
 * @param {Boolean} fromDA 添加DA打断
 */
iD.actions.SplitDivider = function (nodeId,context, fromDA) {
    var wayIds;

    //way为断点所在的道路entity
    function split(graph, way, newWayId) {
        let layer = iD.Layers.getLayer(way.layerId);
        var wayB = iD.Way({
            id: newWayId,
            identifier:layer.identifier,
            layerId : way.layerId, //设置分隔后新线的图层信息
            modelName: way.modelName,
            tags: iD.util.getDefauteTags(way)
        });
        wayB = wayB.mergeTags(iD.util.tagExtend.updateTaskTag(way));
        
        var nodesA, nodesB;
        var idx = _.indexOf(way.nodes, nodeId, 1); //返回断点在道路中所有点数组中的下标
        nodesA = way.nodes.slice(0, idx + 1);
        nodesB = way.nodes.slice(idx); //此处返回的A与B共享相同的断点，改点id此处相同
        var newWay = iD.Way({
            layerId : way.layerId,
            identifier:layer.identifier,
            nodes : nodesA,
            modelName: way.modelName,
            tags: iD.util.getDefauteTags(way)
        });
        newWay = newWay.mergeTags(iD.util.tagExtend.updateTaskTag(way));
        // newWay = newWay.update({ id: newWayId });

        graph = graph.replace(newWay);

        wayB.modelName = way.modelName;
        wayB = wayB.update({ nodes: nodesB });
        graph = graph.replace(wayB);
        
        // 通过添加DA的方式打断,保留后段的DA/LA
        // if(fromDA){
        // 	var lastWay;
        // 	if(way.tags.DIRECTION == '3'){
        // 		lastWay = newWay;
        // 	}else {
        // 		lastWay = wayB;
        // 	}
        wayB.nodes.forEach(function(nid){
            var rels = [];
            rels.push(...graph.parentRelations(graph.entity(nid), iD.data.DataType.DIVIDER_ATTRIBUTE));
            rels.push(...graph.parentRelations(graph.entity(nid), iD.data.DataType.LANE_ATTRIBUTE));
            rels.forEach(r => {
                r = r.replaceMember(way, wayB);
                graph = graph.replace(r);
            });
        });
        
            newWay.nodes.forEach(function(nid){
        		var rels = [];
        		rels.push(...graph.parentRelations(graph.entity(nid), iD.data.DataType.DIVIDER_ATTRIBUTE));
        		rels.push(...graph.parentRelations(graph.entity(nid), iD.data.DataType.LANE_ATTRIBUTE));
        		rels.forEach(r => {
        			r = r.replaceMember(way, newWay);
        			graph = graph.replace(r);
        		});
            });
            
            
        // }

        // 地图打断车道线,删除后段的DA/LA
        //拓补维护
        var selectNode = graph.entity(nodeId);
        var measureRelation = graph.parentRelations(selectNode, iD.data.DataType.MEASUREINFO)[0];
        var handle = iD.topo.handle();
        if(way.tags.DIRECTION == '3'){
            wayB = wayB.mergeTags(iD.util.tagExtend.updateTaskTag(way));
            graph = graph.replace(wayB);
            graph = handle.break(context, graph, way,wayB, newWay, selectNode, fromDA);
        }else {
            newWay = newWay.mergeTags(iD.util.tagExtend.updateTaskTag(way));
            graph = graph.replace(newWay);
            graph = handle.break(context, graph, way, newWay, wayB, selectNode, fromDA);
        }
        
        // update node
        selectNode = selectNode.mergeTags(iD.util.tagExtend.updateTaskTag(selectNode));
        graph = graph.replace(selectNode);
        if(measureRelation){
        	graph = graph.replace(measureRelation);
        }
        
        return graph;
    }

    var action = function (graph) {
        var candidates = action.ways(graph);    //返回打断点所在道路
        for (var i = 0; i < candidates.length; i++) {
            graph = split(graph, candidates[i]);
            graph = iD.actions.DeleteWay(candidates[i].id)(graph);
        }

        //分割导航线，操作后更新点的modelName
        var nodee = graph.entity(nodeId);
        graph = graph.replace(nodee);

        return graph;
    };

    action.ways = function (graph) {
        //node为打断点entity，parents为打断点所在的道路
        var node = graph.entity(nodeId),
            parents = graph.parentWays(node),
            hasLines = _.any(parents, function (parent) { return parent.geometry(graph) === 'line'; });

        return parents.filter(function (parent) {
            if (wayIds && wayIds.indexOf(parent.id) === -1)
                return false;

            if (!wayIds && hasLines && parent.geometry(graph) !== 'line')
                return false;

            if (parent.isClosed()) {
                return true;
            }

            for (var i = 1; i < parent.nodes.length - 1; i++) {
                if (parent.nodes[i] === nodeId) {
                    return true;
                }
            }

            return false;
        });
    };

    action.disabled = function (graph) {
        var candidates = action.ways(graph);
        if (candidates.length === 0 || (wayIds && wayIds.length !== candidates.length))
            return 'not_eligible';
    };

    action.cpContext = function (context) {
        action.context = context;
    }

    return action;
};
