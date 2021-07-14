/*
 * @Author: tao.w
 * @Date: 2018-06-19 15:02:41
 * @LastEditors: tao.w
 * @LastEditTime: 2018-06-22 17:27:53
 * @Description: 
 */
iD.topo.DividerAttribute = function () {
    var dividerAttribute = {};
    dividerAttribute.roadMerge = function (graph, way, wayA, wayB, rel, midNode, crossNodeM, crossNodeS, crossNodeE) {
        return graph;
    };

    dividerAttribute.break = function (context, graph, way, wayA, wayB, rel, midNode) {
        let m = rel.memberByRole(iD.data.RoleType.DIVIDER_ID);
        let nodeId = rel.memberByRole(iD.data.RoleType.DIVIDER_NODE_ID).id;

        if (wayA.nodes.includes(nodeId)) {
            // m.id = wayA.id;
            //  rel = rel.updateMember(m, m.index);
            if (nodeId == midNode.id) {
                rel = rel.replaceMember(way, wayB);
            } else {
                rel = rel.replaceMember(way, wayA);
            }
            rel.tags = iD.util.tagExtend.updateTaskTag(rel);
            graph = graph.replace(rel);
        } else {
            // m.id = wayB.id;
            graph = iD.actions.DeleteRelation(rel.id)(graph);
        }

        return graph;
    }

    dividerAttribute.autoCompleteNodeTopo = function (graph, nodeID) {
        return graph;
    }

    dividerAttribute.roadIntersect = function (graph, nodesArr, oldWays) {
        return graph;
    };

    dividerAttribute.topoSplit = function (graph, entityA, entityB, wayId) {
        return graph;
    };

    dividerAttribute.roadCreate = function (graph, nodeId) {
        return graph;
    }


    dividerAttribute.roadCrossEdit = function (graph, node) {
        return graph;
    }

    dividerAttribute.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }

    dividerAttribute.nodeMerge = function (context, graph, nodeA, nodeB) {
        return graph;
    }

    dividerAttribute.nodeMove = function (context, graph, node) {
        return graph;
    }

    return dividerAttribute;
}