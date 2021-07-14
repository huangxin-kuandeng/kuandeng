/**
 * Created by wangtao on 2017/8/18.
 */

iD.actions.ConnectDivider = function(context,nodeIds) {
    return function(graph) {
        var survivor = graph.entity(_.last(nodeIds));

        for (var i = 0; i < nodeIds.length - 1; i++) {
            var node = graph.entity(nodeIds[i]);

            /* eslint-disable no-loop-func */
            graph.parentWays(node).forEach(function(parent) {
                if (!parent.areAdjacent(node.id, survivor.id)) {
                    parent.tags = iD.util.tagExtend.updateTaskTag(parent);
                    graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                }
            });

            graph.parentRelations(node).forEach(function(parent) {
            	if(parent.modelName == iD.data.DataType.MEASUREINFO){
            		// 共点量测信息只保留目标节点
            		return ;
            	}
                parent.tags = iD.util.tagExtend.updateTaskTag(parent);
                graph = graph.replace(parent.replaceMember(node, survivor));
            });
            /* eslint-enable no-loop-func */

            survivor = survivor.mergeTags(node.tags);
            graph = iD.actions.DeleteNode(node.id)(graph);
            
            graph = iD.topo.handle().nodeMerge(context, graph, node, survivor);
        }

        graph = graph.replace(survivor);

        return graph;
    }
};