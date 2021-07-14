/*
 * @Author: tao.w
 * @Date: 2018-06-20 11:48:06
 * @LastEditors: tao.w
 * @LastEditTime: 2018-06-22 16:22:43
 * @Description: 
 */
iD.topo.DividerNode=function(){

    dividerNode = {};

    dividerNode.roadMerge = function (graph, way, wayA, wayB, rel){
        return graph;
    };

    dividerNode.topoSplit = function(graph, entityA, entityB, way){
        return graph;
    };

    dividerNode.breakNode = function (graph, node, wayA, wayB,way,context, fromDA) {
    	// DA自动打断车道线，保留后半段属性；
    	if(fromDA) return graph;
        let nodes = wayB.nodes;
        let defauteTag = iD.util.getDefauteTags(node);
        let _node;
        
        // graph.parentRelations(node).forEach(d => {
        //     if (d.modelName != iD.data.DataType.MEASUREINFO) {
        //         graph = iD.actions.DeleteRelation(d.id)(graph);
        //         // graph = graph.remove(d);
        //     }
        // })

        for(let i=0;i<nodes.length;i++){
            _node = graph.entity(nodes[i]);
            if(_node.id != node.id){
                // _node = _node.mergeTags(defauteTag);
                graph=graph.replace(_node.mergeTags(defauteTag));
            }
        }
        
        return graph;
    };

    dividerNode.autoCompleteNodeTopo = function (graph, nodeID) {
        return graph;
    }

    dividerNode.roadIntersect = function (graph, nodesArr, oldWays) {
        return graph;
    }

    dividerNode.roadCreate = function (graph, nodeId) {
        return graph;
    }


    dividerNode.roadCrossEdit = function (graph, node) {
        return graph;
    }

    dividerNode.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }

    dividerNode.nodeMerge = function (context, graph, nodeA, nodeB) {
        return graph;
    }

    dividerNode.nodeMove = function (context, graph, node) {
        return graph;
    }

    
    return dividerNode;
}