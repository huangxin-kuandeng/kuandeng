/**
 * Created by  on 2015/11/16.
 * 步导的拓展函数
 */

iD.util.walkExtend = function () {

    var walkExtendCal = {};



    //计算坐标点周围distance距离内，没有关联的道路线
    //返回为空数组，证明周围一定距离内没有其他的步导点
    walkExtendCal.getHighWaysWithFilterBBox = function (context, distance, node) {
        loc=node.loc;
        var dis = distance * 0.00001, highwaysArr = [];
        var loc1 = [loc[0] - dis, loc[1] - dis];   //左下角
        var loc2 = [loc[0] + dis, loc[1] + dis];   //右上角
        var bbox = [loc1, loc2];
        var all = context.intersects(bbox);
        all.forEach(function (entity) {
            if (entity instanceof iD.Way && entity.modelName == iD.data.DataType.HIGHWAY) {

                if(!(dis<iD.util.slopExtend.getDisBetPointAndWay(node,entity,context.graph())))
                {
                    highwaysArr.push(entity);
                }
            }
        });

        // console.log('highwaysArr',highwaysArr);
        return highwaysArr;
    }

    //根据道路关联的步导点，实现步导点的联动操作
    walkExtendCal.jointOperationForWEnters = function(context,wEnterAndRoadObj,way){
        for(var key in wEnterAndRoadObj){
            var oldway = wEnterAndRoadObj[key].oldway;
            if(oldway.id == way.id){
                var walkEnter = wEnterAndRoadObj[key].walkEnter;
                var fNode = wEnterAndRoadObj[key].fNode;
                var tNode = wEnterAndRoadObj[key].tNode;
                var ratio = wEnterAndRoadObj[key].ratio;
                var newfNode = context.entity(fNode.id);
                var newtNode = context.entity(tNode.id);
                //只有步导点投影映射在道路上的线段有变化时才联动步导点
                if(!(fNode.loc ==newfNode.loc &&tNode.loc == newtNode.loc)){
                    var loc1 = newfNode.loc,loc2 = newtNode.loc,P12= [loc2[0]-loc1[0],loc2[1]-loc1[1]];
                    var Pt = [loc1[0]+ratio*P12[0],loc1[1]+ratio*P12[1]];
                    context.replace(
                        iD.actions.MoveNode(walkEnter.id, Pt),
                        "联动步导点");
                }
            }

        }
    }

    //计算道路wayA附近distance距离的范围内,除了wayB关联的步导点关系之外是否还有其他的步导点
    //返回为空数组，证明周围一定距离内没有其他的步导点
    walkExtendCal.getWalkEntersWithFilterBBox = function (context, distance, wayA, wayB, graph) {
        if (graph) {
            var tmpGraph = graph;
        }
        else {
            var tmpGraph = context.graph();
        }
        var nodes = wayA.nodes;
        var extend, maxLat = -Infinity, minLat = Infinity, maxLon = -Infinity, minLon = Infinity;
        nodes.forEach(function (nodeId) {
            var node = tmpGraph.entity(nodeId);
            var loc = node.loc;
            if (loc[0] > maxLon) {
                maxLon = loc[0];
            }
            if (loc[0] < minLon) {
                minLon = loc[0];
            }
            if (loc[1] > maxLat) {
                maxLat = loc[1];
            }
            if (loc[1] < minLat) {
                minLat = loc[1]
            }
        })
        //0.1m = 0.037秒，1度= 3600‘    1度 =1*10e5m
        var dis = parseInt(distance) * 0.00001;
        extend = [[minLon - dis, minLat - dis], [maxLon + dis, maxLat + dis]];
        var all = context.intersects(extend);
        var walkEnterIDsArr = [];
        all.forEach(function (entity) {
            if (entity instanceof iD.Node && entity.modelName == iD.data.DataType.WALKENTER) {
                var shortestDis = iD.util.slopExtend.getDisBetPointAndWay(entity, wayA, tmpGraph);
                if (shortestDis < distance)walkEnterIDsArr.push(entity.id);
            }
        })

        if (wayB && walkEnterIDsArr.length > 0) {
            var relations = tmpGraph.parentRelations(wayB);
            relations.forEach(function (rel) {
                if (rel.modelName == iD.data.DataType.RELWKETROAD) {
                    var nodeId = rel.memberByRole(iD.data.RoleType.WALKENTER).id;
                    if (walkEnterIDsArr.indexOf(nodeId) > -1) {
                        walkEnterIDsArr.splice(walkEnterIDsArr.indexOf(nodeId), 1);
                    }
                }
            })
        }

        return walkEnterIDsArr;
    }

    //传入道路数组，获得道路所有关联的步导点构成的对象,每个value值为比率/线段起始末尾结点/步导点
    walkExtendCal.getObjForWEnterAndRoad = function (ways, graph) {
        var wEnterAndRoadObj = new Object();
        ways.forEach(function (way) {
            var relations = graph.parentRelations(way);
            relations.forEach(function (rel) {
                if (rel.modelName == iD.data.DataType.RELWKETROAD) {
                    var walkEnterID = rel.memberByRole(iD.data.RoleType.WALKENTER).id;
                    wEnterAndRoadObj[walkEnterID] = getObjForConnectWEnter(graph.entity(walkEnterID), way, graph);
                }
            })
        })
        return wEnterAndRoadObj;
    };

    //计算步导点实体到道路的最短距离，记录一个对象，内部为在道路上比率/线段起始末尾结点id/步导点id
    var getObjForConnectWEnter = function (entity, way, graph) {
        var nodesArr = way.nodes;
        var i, min = Infinity, ratio, distance;
        var connectedWEnterObj = new Object();     //建立一个对象存放步导联动所需参数
        if (nodesArr.length > 1) {
            for (i = 0; i < nodesArr.length - 1; i++) {
                var loc1 = graph.entity(nodesArr[i]).loc;
                var loc2 = graph.entity(nodesArr[i + 1]).loc;
                distance = getDisBetPointAndSeg(entity.loc, loc1, loc2)[0];
                ratio = getDisBetPointAndSeg(entity.loc, loc1, loc2)[1];
                if (distance < min) {
                    //connectedWEnterObj = {
                    //    ratio:ratio,
                    //    fNodeID:nodesArr[i],
                    //    tNodeID:nodesArr[i+1],
                    //    walkEnterID:entity.id
                    //}
                    min = distance;
                    connectedWEnterObj = {
                        ratio: ratio,
                        fNode: graph.entity(nodesArr[i]),
                        tNode: graph.entity(nodesArr[i + 1]),
                        walkEnter: entity,
                        oldway: way
                    }
                }
            }
        }
        return connectedWEnterObj;
    }

    //计算点到线段的投影比例尺
    //params：loc:P0点的经纬度坐标数组
    //        loc1:P1点线段的经纬度坐标数组
    //        loc2:P2点线段的经纬度坐标数组
    //返回值：[distance,t]
    //test loc: [0,1]  loc1[-1,0]  loc2 [1,0]
    var getDisBetPointAndSeg = function (loc, loc1, loc2) {
        var distance = 0;
        var P10 = [loc[0] - loc1[0], loc[1] - loc1[1]], P12 = [loc2[0] - loc1[0], loc2[1] - loc1[1]];     //点到线段一段的矢量P01，线段矢量表示P12
        //var SegLength = Math.sqrt((loc2[0]-loc1[0])*(loc2[0]-loc1[0])+(loc2[1]-loc1[1])*(loc2[1]-loc1[1]));  //线段长度
        //t 为到线段的投影向量与原来线段的比值，如果0<t<1,最短距离，为垂足距离;t<=0,最短距离为P01的距离长；t>=1最短距离为P02模长
        var t = (P10[0] * P12[0] + P10[1] * P12[1]) / (P12[0] * P12[0] + P12[1] * P12[1]);
        //var t =   ((loc1[0]-loc[0])*(loc2[0]-loc1[0])+(loc1[1]-loc[1])*(loc2[1]-loc1[1]))/((loc2[0]-loc1[0])*(loc2[0]-loc1[0])+(loc2[1]-loc1[1])*(loc2[1]-loc1[1]));
        if (t > 0 && t < 1) {
            var Pt = [loc1[0] + t * P12[0], loc1[1] + t * P12[1]];
            var Pt0 = [Pt[0] - loc[0], Pt[1] - loc[1]];
            distance = Math.sqrt(Pt0[0] * Pt0[0] + Pt0[1] * Pt0[1])
        } else if (t <= 0) {
            distance = Math.sqrt(P10[0] * P10[0] + P10[1] * P10[1]);
        } else if (t >= 1) {
            var P20 = [loc[0] - loc2[0], loc[1] - loc2[1]];
            distance = Math.sqrt(P20[0] * P20[0] + P20[1] * P20[1]);
        }
        return [distance, t];
        //return t;
    }

    return walkExtendCal;

}

