/*
 * @Author: tao.w
 * @Date: 2018-06-19 15:02:46
 * @LastEditors: tao.w
 * @LastEditTime: 2018-06-19 15:32:32
 * @Description: 
 */
iD.topo.RDividerDref = function () {
    var rDividerDref = {};
    rDividerDref.roadMerge = function (graph, way, wayA, wayB, rel,midNode, crossNodeM, crossNodeS, crossNodeE) {
        return graph;
    };

    rDividerDref.break = function (context,graph, way, wayA, wayB, rel) {
        graph = graph.remove(rel);
        return graph;
    }

    rDividerDref.autoCompleteNodeTopo = function (graph, nodeID) {
        return graph;
    }

    rDividerDref.roadIntersect = function (graph, nodesArr, oldWays) {
        return graph;
    };


    rDividerDref.topoSplit = function (graph, entityA, entityB, wayId) {
        return graph;
    };

    rDividerDref.roadCreate = function (graph, nodeId) {
        return graph;
    }


    rDividerDref.roadCrossEdit = function (graph, node) {
        return graph;
    }

    rDividerDref.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }

    rDividerDref.nodeMerge = function (context,graph, nodeA, nodeB) {
        return graph;
    }

    rDividerDref.nodeMove=function(context,graph,node){
        return graph;
    }
    return rDividerDref;
}