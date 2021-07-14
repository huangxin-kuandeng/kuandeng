/*
 * @Author: tao.w
 * @Date: 2018-06-19 15:02:46
 * @LastEditors: tao.w
 * @LastEditTime: 2018-06-22 17:27:49
 * @Description: 
 */
iD.topo.LaneAttribute = function () {
    var laneAttribute = {};
    laneAttribute.roadMerge = function (graph, way, wayA, wayB, rel, midNode, crossNodeM, crossNodeS, crossNodeE) {
        return graph;
    };

    laneAttribute.break = function (context, graph, way, wayA, wayB, rel, midNode) {
        let m = rel.memberByRole(iD.data.RoleType.DIVIDER_ID);
        let nodeId = rel.memberByRole(iD.data.RoleType.DIVIDER_NODE_ID).id;

        if (wayA.nodes.includes(nodeId)) {
            // m.id = wayA.id;
            // rel = rel.updateMember(m, m.index);
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

    laneAttribute.autoCompleteNodeTopo = function (graph, nodeID) {
        return graph;
    }

    laneAttribute.roadIntersect = function (graph, nodesArr, oldWays) {
        return graph;
    };


    laneAttribute.topoSplit = function (graph, entityA, entityB, wayId) {
        return graph;
    };

    laneAttribute.roadCreate = function (graph, nodeId) {
        return graph;
    }


    laneAttribute.roadCrossEdit = function (graph, node) {
        return graph;
    }

    laneAttribute.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }

    laneAttribute.nodeMerge = function (context, graph, nodeA, nodeB) {
        return graph;
    }

    laneAttribute.nodeMove = function (context, graph, node) {
        return graph;
    }
    return laneAttribute;
}