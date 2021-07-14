/**
 * Created by wt on 2015/7/30.
 */
iD.actions.ExpandDividerNode = function (nodeId, projection, context) {
    var topoEntity = iD.TopoEntity();
    var lineCal = iD.util.LineCalCulate();
    var userInputParam = {'offset': '', 'originalNodes': ''};
    // 作为旋转方向的标准
    var angleBaseLine;
    
    var newNodes = [], array = [];
    var originalNodes = [];
    //分别绘制扩展后的左右两边道路
    var action = function (graph) {
        newNodes = [];
        // context.map()
        //     .on('close_expand_before.expandDividerNode', resetWay);
        var node = graph.entity(nodeId);
        var way = graph.parentWays(node)[0];
        originalNodes = _.map(way.nodes, context.entity , context);
        var _nodes;
        if (way.tags.DIRECTION == "3") {
            _nodes = way.nodes.slice().reverse();
        } else {
            _nodes = way.nodes;
        }
        // originalNodes.forEach(function (node) {
        //     var survivor = graph.entity(node),
                var rawNodes = [],
                newNodes = [],
                newNode
            //当扩路长度<=0时，不进行扩路
            if(userInputParam.offset){
                graph = newOffsetNode( way, newNodes, newNode);
            }
        // });
        return graph;

        function resetWay() {
            for (let i = 0; i < originalNodes.length; i++) {
                graph = graph.replace(originalNodes[i]);
            }
        }

        function newOffsetNode(survivor, newNodes, newNode) {
            var newLoc;
            var oldLoc;
            var interPoint = [0, 0];
            var nodeEntity;
            var adjoinEntity;
            var newNodeEntitys = [];
            var isArea = false;
            var wayNodes = _.map(_nodes, context.entity , context);
            var survivorNodes = [];

            wayNodes.forEach(function(node){
                if ([1, 2].includes(node.tags.DASHTYPE)) {
                    survivorNodes.push(node.id);
                } else if (["1", "2"].includes(node.tags.DASHTYPE)) {
                    survivorNodes.push(node.id);
                }
            })
            var index = _.indexOf(survivorNodes, node.id);

            for (var i = index+1; i < survivorNodes.length - 1; i++) {
               /* if (i != index) {
                    originalNodes.push(survivorNodes[i]);
                    continue;
                }*/
                nodeEntity = graph.entity(survivorNodes[i]);
                adjoinEntity = graph.entity(survivorNodes[i + 1]);
                adjoinLoc = adjoinEntity.loc
                if (newLoc) adjoinLoc = newLoc;
                if(nodeEntity.loc[0] == adjoinLoc[0] && nodeEntity.loc[1]== adjoinLoc[1]){
                    continue;
                }
                if (i != index+1) {
                    var _newLoc = getLngLat(adjoinLoc[0], adjoinLoc[1], nodeEntity.loc[0], nodeEntity.loc[1]);
                    var h = adjoinEntity.loc[2] || -1;
                    newLoc = [_newLoc[1].Longitude, _newLoc[1].Latitude, h];
                } else {
                    var _newLoc = getLngLat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinLoc[0], adjoinLoc[1]);
                    var h = nodeEntity.loc[2] || -1;
                    newLoc = [_newLoc[0].Longitude, _newLoc[0].Latitude, h];
                }

                if (userInputParam.offset > 0) {
                    newLoc = iD.util.getBetweenPointLoc(nodeEntity.loc, adjoinEntity.loc, newLoc);
                } else {
                    var proEntity = graph.entity(survivorNodes[i - 1]);
                    newLoc = iD.util.getBetweenPointLoc(proEntity.loc, nodeEntity.loc, newLoc);
                }

                // console.log(newLoc[1]+", "+newLoc[0]+",  "+h);

                newNodes.push({
                    loc: newLoc,
                    index: i
                });
                oldLoc = newLoc;
            }
            var actions = [];
            var startNodeId = survivorNodes[index];//选择执行点
            var startNode = graph.entity(startNodeId);
            var endNodeId = survivor.nodes[survivor.nodes.length-1];//线最终点
            var endNode = graph.entity(endNodeId);

            for (let i = 0; i < newNodes.length; i++) {
                // actions.push(iD.actions.MoveNode(survivorNodes[newNodes[i].index], newNodes[i].loc));
                // actions.push(iD.actions.createDividerNodeMeasureinfo(survivorNodes[newNodes[i].index], way.nodes));
                let enId = survivorNodes[newNodes[i].index];
                let en = graph.entity(enId);
                let start_dis = iD.util.distanceByLngLat(startNode.loc, en.loc);
                let end_dis = iD.util.distanceByLngLat(endNode.loc, en.loc);
                if (end_dis > 0.12 && start_dis > 0.12) {//判断距离如果超出起点、终点则不执行
                    graph = iD.actions.MoveNode(survivorNodes[newNodes[i].index], newNodes[i].loc)(graph);
                    graph = iD.actions.createDividerNodeMeasureinfo(survivorNodes[newNodes[i].index], [survivor.nodes[0], endNodeId])(graph);
                }
            }
            return graph;
        };

        function callback() {
            context.enter(iD.modes.Browse(context));
        };


        //@param position [标注扩展道路的左边or右边]
        //@return 扩路后A,B两点新的坐标(A,B两点相邻)
        function getLngLat(lngA, latA, lngB, latB) {
            var result = new Array();
            var angle = 0;
            /*if(angleBaseLine && angleBaseLine.length == 2){
            	let locA = angleBaseLine[0];
            	let locB = angleBaseLine[1];
            	angle = lineCal.getAngle(locA[0], locA[1], locB[0], locB[1]);
            }else {*/
            	angle = lineCal.getAngle(lngA, latA, lngB, latB);
            //}
            var distance = userInputParam.offset / 100000;

            /*if (position == "left") {
                angle = (angle - 90) + 360;
                if (userInputParam.left != "") {
                    distance = userInputParam.left / 1000;
                }
            }
            else if (position == "right") {
                angle = (angle + 90) + 360;
                if (userInputParam.right != "") {
                    distance = userInputParam.right / 1000;
                }
            }*/
            var newPointA = {};
            var newPointB = {};
            var pointA = lineCal.calculateVerticalP(lngA, latA, distance, angle);
            newPointA.Longitude = pointA.Longitude;
            newPointA.Latitude = pointA.Latitude;
            result.push(newPointA);
            var pointB = lineCal.calculateVerticalP(lngB, latB, distance, angle);
            newPointB.Longitude = pointB.Longitude;
            newPointB.Latitude = pointB.Latitude;
            result.push(newPointB);
            return result;
        };


    };
    action.setUserInputParam = function (_) {

        userInputParam = _;
    };
    
    action.setAngleBaseLine = function(locs){
    	if(locs && locs.length == 2){
    		angleBaseLine = locs;
    	}else {
    		angleBaseLine = null;
    	}
    }

    action.disabled = function () {
        return false;
    };

    return action;
}