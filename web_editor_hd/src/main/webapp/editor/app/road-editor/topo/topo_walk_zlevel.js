/**
 * Created by wt on 2015/11/16.
 * 计算道路walkzlevel
 */
iD.topo.WalkZlevel = function () {

    var topoWalkZlevel = {};
    topoWalkZlevel.roadMerge = function (graph, way, wayA, wayB, rel, midNode, crossNodeM, crossNodeS, crossNodeE) {

        var members=rel.members;
        members.forEach(function(member){
            if(member.id==wayA.id||member.id==wayB.id)
            {
                member.id=way.id;
                rel = rel.updateMember(member, member.index);
            }
        })
        return graph.replace(rel);
    };
    /*道路打断的crosssaat维护 */
    topoWalkZlevel.break = function (context,graph, way, wayA, wayB, rel) {
        return graph;
    };


    //自动补全一个结点的saat拓补关系
    topoWalkZlevel.autoCompleteNodeTopo = function (graph, nodeID) {
        return graph;
    }

    topoWalkZlevel.roadIntersect = function (graph, nodesArr, oldWays) {
        return graph;
    };

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的crosssaat维护*/
    topoWalkZlevel.topoSplit = function (graph, entityA, entityB, wayId) {
        return graph;
    }

    topoWalkZlevel.roadCreate = function(graph,nodeId){
        return graph;
    }

    topoWalkZlevel.roadCrossEdit=function(graph,node)
    {
        return graph;
    }

    topoWalkZlevel.crossNodeMerge=function(graph,crossNodeA,crossNodeB)
    {
        return graph;
    }

    topoWalkZlevel.nodeMerge=function(context,graph,nodeA,nodeB)
    {
        return graph;
        var that=this;
        graph.parentWays(nodeA).forEach(function(way){
            graph=that.roadModify(graph,way);
        });
        return graph;
    }
    topoWalkZlevel.nodeMove=function(context,graph,node)
    {
        var that=this;
        graph.parentWays(node).forEach(function(way){
            graph=that.roadModify(graph,way);
        });
        return graph;
    }
    /*道路修行walkzlevel维护*/
    topoWalkZlevel.roadModify = function (graph, way) {
        var zlevels=way.getWalkZlevel(graph);
        zlevels.forEach(function(zlevel){
            var members=zlevel.members;
            if(2==members.length)
            {
                var firstWay=graph.entity(members[0].id);
                var secondWay=graph.entity(members[1].id);
                var lineCalute=iD.util.LineCalCulate()
                var locs=lineCalute.getIntersectLoc(firstWay.getNodes(),secondWay.getNodes(),graph);
                if(locs.length>0)
                {
                    graph=graph.replace(zlevel.move(locs));
                }else{
                    graph=graph.remove(zlevel);
                }
            }
        });
        return graph;
    };
    return topoWalkZlevel;
}
