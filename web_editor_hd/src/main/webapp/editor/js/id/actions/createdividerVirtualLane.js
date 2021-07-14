/**
 * Created by TildenDing on 2018/1/17.
 * 路口虚拟车道线半自动生成---使用椭圆方式计算
 */
iD.actions.createdividerVirtualLane = function(selectedIDs, context) {
    var wayIds;


    var action = function(graph) {
        let entitys=[], lines=[], ways = [], len = selectedIDs.length;
        var projection = context.projection;
        //选择的节点计算
        for(let i = 0; i < len; i++) {
            //选择的node
            let entity = context.entity(selectedIDs[i]);
            //获取所选点的线
            let way = graph.parentWays(entity);
            ways.push(way);//记录选择点所在的线

            var nodeIndex = way[0].nodes.indexOf(selectedIDs[i]);
            var nextNodeId = way[0].nodes[nodeIndex+1];//获取选中点的下一个node，为空证明选中点为尾节点
            var nextNode = null, prevNode;
            if (nextNodeId) {
                entity._isStart = true;
                nextNode = context.entity(nextNodeId);
            }
            var prevNodeId = way[0].nodes[nodeIndex-1];//获取选中点的上一个node，为空证明选中点为首节点
            if (prevNodeId) {
                entity._isStart = false;
                prevNode = context.entity(prevNodeId);
            }
            //获取两点车道线，以计算交点
            var line = nextNode ?  [entity.loc[0], entity.loc[1], entity.loc[2], nextNode.loc[0], nextNode.loc[1], nextNode.loc[2], "next"] : prevNode ? [entity.loc[0], entity.loc[1], entity.loc[2], prevNode.loc[0], prevNode.loc[1], prevNode.loc[2], "prev"] :[];

            lines.push(line);
            entitys.push(entity);
        }
        var newlines = [], linePointPx = [];
        var linecal = iD.util.LineCalCulate(),
            currLayer = context.layers().getLayer();
            // currLayer = context.layers().getCurrentEnableLayer();
        for (let l = 0; l < lines.length; l++) {
            let x1 = [lines[l][0], lines[l][1], lines[l][2]],//选中点
                x2 = [lines[l][3], lines[l][4], lines[l][5]],
                // angle = parseInt(linecal.getAngle(x1[0], x1[1], x2[0], x2[1])),//计算线与正北的角度
                p_x1 = projection(x1),
                p_x2 = projection(x2);
            var x = p_x2[1] - p_x1[1] + p_x1[0],
                y = p_x1[0] - p_x2[0] + p_x1[1];
            //计算出根据选中点位置得到的偏移位置，并计算经纬度
            var px = [x, y];
            var xy = projection.invert(px);
            var newLine = [x1[0], x1[1], xy[0],xy[1]];
            newlines.push(newLine);
            linePointPx.push(p_x1);
            linePointPx.push(p_x2);
        }
        //判断逆时针，如果为逆时针则返回true， 如果为顺时针则返回false
        // var anticlockwise = action.convertClockwise([linePointPx[1], linePointPx[0], linePointPx[2], linePointPx[3]]);
        // console.log(anticlockwise);
        // var A = linePointPx[0], B = linePointPx[1], C = linePointPx[2], D = linePointPx[3];
        // debugger
        // if ((D[0] > A[0]) && (D[1] > C[1]) && (B[0] < C[0]) && (B[1] < A[1])) {
        //
        // }
        var B = iD.util.extendIntersection(newlines[0], newlines[1]);//两垂线焦点为椭圆中心点
        var startPoint = [lines[0][0], lines[0][1]];//选择点1
        var endPoint = [lines[1][0], lines[1][1]];//选择点2

        var line1Angle = linecal.getAngle(B[0], B[1], startPoint[0], startPoint[1]),//计算选中点到椭圆中心点线与正北的角度
            line2Angle = linecal.getAngle(B[0], B[1], endPoint[0], endPoint[1]);
        var p_b = projection(B);


        var t1 = projection(startPoint);
        var t2 = projection(endPoint);

        var dis1 = iD.util.distanceByPixel(t1, p_b);//计算选中点与椭圆中心点距离
        var dis2 = iD.util.distanceByPixel(t2, p_b);

        var shortAxis = Math.min(dis1, dis2);// - 5;//短轴 上右+垂直 -1
        var majorAxis = Math.max(dis1, dis2);// + 3.5;//长轴 上右+垂直 +2
        var majorAxis_lineAngle = null;//
        if (majorAxis == dis1) {
            majorAxis_lineAngle = line1Angle;
        } else if (majorAxis == dis2) {
            majorAxis_lineAngle = line2Angle;
        }

        obj = {
            center: projection(B),
            shortAxis: shortAxis,
            majorAxis: majorAxis,
            startDu: /*308+*/line1Angle,
            du: /*308+*/line2Angle
        }
        var x = obj.center[0], y = obj.center[1], a = obj.majorAxis,
            b = obj.shortAxis, startDu = obj.startDu, du = obj.du,nodes=[],
            a1 = majorAxis_lineAngle;//360 - 30 - (line1Angle + line2Angle) / 2;//上左+垂直和下右+垂直 +15  上右+垂直+3

        var lnglats = [];
        for (var i = 0; i <= 360; i+=5) {
            hudu = (Math.PI / 180) * (i);

            var x1 = b * Math.sin(hudu) + x,
                y1 = y - (a * Math.cos(hudu));
            //当左侧与垂直al+90
            var newpx = (x1 - x) * Math.cos((a1 + 0) * Math.PI/180) - (y1 - y) * Math.sin((a1 + 0) * Math.PI/180);
            var newpy = (x1 - x) * Math.sin((a1 + 0)* Math.PI/180) + (y1 - y) * Math.cos((a1 + 0) * Math.PI/180);
            let lnglat = projection.invert([newpx + x, newpy + y]);

            lnglat[2] = lines[0][2];
            lnglats.push(lnglat);

        }
        var selectP1 = [lines[0][0], lines[0][1]],//选中点
            selectP2 = [lines[1][0], lines[1][1]];
        var selectP1Dis = iD.util.pt2LineDist2(lnglats, selectP1);
        var selectP2Dis = iD.util.pt2LineDist2(lnglats, selectP2);

        var newNodes = [];

        var _lnglats = _.clone(lnglats);

        var startEntity = entitys[0];
        var endEntity = entitys[1];
        var newLnglatlineAngle = linecal.getAngle(selectP1[0], selectP1[1],selectP2[0], selectP2[1]);
        if (newLnglatlineAngle < 120 || newLnglatlineAngle > 300) {
            var tempangle2 = selectP1Dis.i;
            var tempangle1 = selectP2Dis.i;
            selectP1Dis.i = tempangle1;
            selectP2Dis.i = tempangle2;
            startEntity = entitys[1];
            endEntity = entitys[0];
        }
        var newLnglats = action.getRange360(selectP1Dis.i, selectP2Dis.i, _lnglats);
        newNodes.push(startEntity.id);
        for (var i =0; i < newLnglats.length; i++) {
            var node = iD.Node({
                layerId: currLayer.id,
                loc: newLnglats[i],
                identifier: currLayer.identifier,
                modelName: iD.data.DataType.DIVIDER_NODE,
                tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, currLayer)
            });
            graph = graph.replace(node);
            newNodes.push(node.id);
        }
        newNodes.push(endEntity.id);
        var divider = iD.Way({
            layerId: currLayer.id,
            nodes: newNodes,
            identifier: currLayer.identifier,
            modelName: iD.data.DataType.DIVIDER,
            tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER, currLayer)
        });
        graph = graph.replace(divider);
        return graph;
    };

    action.getRange360 = function(from = 0, to = 0, lnglats = []){
        var ds = lnglats;//_.range(0, 360);
        var result = [];
        // 90 --> 90 = 360 || 180 --> 90 =  180 > 360 > 90 = 270
        if(from >= to){
            result = ds.slice(from + 10, ds.length).concat(ds.slice(0, to))
        }else {
            // 90 --> 270 = 180
            result = ds.slice(from + 10, to);
        }
        return result;
    };

    action.convertClockwise = function(pointList) {
        var maxY = 0;
        var index = 0;

        //找到Y值最大的点及其前一点和后一点
        for (let i = 0; i < pointList.length; i++) {
            let pt = pointList[i];
            if (i == 0) {
                maxY = pt[1];
                index = 0;
                continue;
            }
            if (maxY < pt[1]) {
                maxY = pt[1];
                index = i;
            }
        }

        let front = index == 0 ? pointList.length - 2 : index - 1;
        let middle = index;
        let after = index > pointList.length - 1 ? 0 : index + 1;

        //利用矢量叉积判断是逆时针还是顺时针。设矢量P = ( x1, y1 )，Q = ( x2, y2 )，则矢量叉积定义为由(0,0)、p1、p2和p1+p2
        //所组成的平行四边形的带符号的面积，即：P × Q = x1*y2 - x2*y1，其结果是一个标量。
        //显然有性质 P × Q = - ( Q × P ) 和 P × ( - Q ) = - ( P × Q )。
        //叉积的一个非常重要性质是可以通过它的符号判断两矢量相互之间的顺逆时针关系：
        //若 P × Q > 0 , 则P在Q的顺时针方向。
        //若 P × Q < 0 , 则P在Q的逆时针方向。
        //若 P × Q = 0 , 则P与Q共线，但可能同向也可能反向。
        //解释：
        //a×b=(ay * bz - by * az, az * bx - ax * bz, ax * by - ay * bx) 又因为az bz都为0，所以a×b=（0，0， ax * by - ay * bx）
        //根据右手系（叉乘满足右手系），若 P × Q > 0,ax * by - ay * bx>0,也就是大拇指指向朝上，所以P在Q的顺时针方向，一下同理。
        let frontPt = pointList[front];
        let middlePt = pointList[middle];
        let afterPt = pointList[after];

        return (afterPt[0] - frontPt[0]) * (middlePt[1] - frontPt[1])
            - (middlePt[0] - frontPt[0]) * (afterPt[1] - frontPt[1]) > 0;
    };

    action.disabled = function(graph) {
        var entity,
            disabled = true,
            i=0,len = selectedIDs.length;
        if (len > 1) {
            var firstWay = null;
            for (; i < len; i++) {
                entity = context.entity(selectedIDs[i]);
                // layer = entity.layerInfo();
                if (entity.modelName === iD.data.DataType.DIVIDER_NODE/* || entity.modelName == iD.data.DataType.FUSION_DIVIDER_NODE*/) {
                    let way = graph.parentWays(entity)[0];
                    if (!firstWay) {
                        firstWay = way;
                    } else if (firstWay.id != way.id) {
                        let index = way.nodes.indexOf(entity.id);
                        if (index == 0 || index == way.nodes.length - 1) {
                            disabled = false;
                        } else {
                            return 'not_node';
                        }
                    } else {
                        return 'not_node';
                    }
                }else {
                    return 'not_node';
                }
                /*if(){
                 disabled = false;
                 break;
                 }*/
            }
        }
        if(disabled){
            return 'not_eligible';
        }
    };
    return action;
};
