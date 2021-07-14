/**
 * Created by  on 2015/9/30.
 * 综合交叉点的的判断拓展维护
 */

iD.util.roadCrossExtend = {


    //判断一个数组内所有结点都是联通的，如果都是联通的返回true，否则返回false
    isUnicomOfArr: function (nodesArr,context) {
        function isUnicomBetweenTwoNodes(node1,node2,context){
            var flag = false;
            var parentWays1 = context.graph().parentWays(node1);
            var parentWays2 = context.graph().parentWays(node2);
            for(var i = 0;i<parentWays1.length;i++){
                if(parentWays2.indexOf(parentWays1[i])>=0){
                    flag = true;
                    return flag;
                }
            }
            return flag;
        }

        for(var i = 0;i<nodesArr.length;i++){
            var count = 0;
            var node1 = context.graph().entity(nodesArr[i]);
            for(var j = 0;j<nodesArr.length;j++){
                var node2 = context.graph().entity(nodesArr[j]);
                if((nodesArr[i]!=nodesArr[j])&&!isUnicomBetweenTwoNodes(node1,node2,context)){
                    count++;
                }
            }
            if(count==(nodesArr.length-1))return false;
        }
        return true;
    },

    //判断两个结点是否联通，方法为取两个结点的parentWays，如果有共有的道路返回true
    isUnicomBetweenTwoNodes: function (node1,node2,context){
    var flag = false;
    var parentWays1 = context.graph().parentWays(node1);
    var parentWays2 = context.graph().parentWays(node2);
    for(var i = 0;i<parentWays1.length;i++){
        if(parentWays2.indexOf(parentWays1[i])>=0){
            flag = true;
            return flag;
        }
    }
    return flag;
    },

    //返回两个结点之间联通的道路
    unicomWaysBetweenTwoNodes: function (node1,node2,context){
        var ways=[];
        var parentWays1 = context.graph().parentWays(node1);
        var parentWays2 = context.graph().parentWays(node2);
        for(var i = 0;i<parentWays1.length;i++){
            if(parentWays2.indexOf(parentWays1[i])>=0){
                ways.push(parentWays1[i]);
            }
        }
        return ways;
    },

    getNodesOutWayNum:function(nodeIdArr,graph)
    {
        var outWays=[];
        var allWays=[];
        nodeIdArr.forEach(function(nodeId){
            graph.parentWays(graph.entity(nodeId)).forEach(function(way){
                if(-1==allWays.indexOf(way)&&!way.isOneRoadCrossWay())
                {
                    allWays.push(way);
                }
            })
        });
        allWays.forEach(function(way){
            if(-1==nodeIdArr.indexOf(way.first())||-1==nodeIdArr.indexOf(way.last()))
            {
                outWays.push(way);
            }
        });
        return outWays.length;
    }




}