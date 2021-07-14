/**
 *  2016/1/5.
 */
iD.ui.RoadExpandAnimation = function (context) {
    var roadExpandAnimation = {}, lineCal = iD.util.LineCalCulate();
    var userInputParam, projection = context.projection;
    var graph = context.graph();
    roadExpandAnimation.perform = function (wayIds, _userInputParam) {
        userInputParam = _userInputParam;
        //分别绘制扩展后的左右两边道路
        wayIds.forEach(function (wayId) {
            var survivor = graph.entity(wayId),
                newNodesLoc = [];
            //当扩路长度<=0时，不进行扩路
            if (userInputParam.left && Number(_userInputParam.left) > 0) {
                //newroad("left", survivor, newNodesLoc);
                roadOffset("left", survivor, newNodesLoc);
            }
        });
        wayIds.forEach(function (wayId) {
            var survivor = graph.entity(wayId),
                newNodesLoc = [];
            //当扩路长度<=0时，不进行扩路
            if (userInputParam.right && Number(_userInputParam.right) > 0) {
                //newroad("right", survivor, newNodesLoc);
                roadOffset("right", survivor, newNodesLoc);
            }
        });
    }

    //创建一条新的道路
    function roadOffset(position, survivor, newNodesLoc) {

        var distance ;
        if (position == "left") {
            distance = 3.0;
            if (userInputParam.left != "") {
                distance = parseFloat(userInputParam.left) ;
            }
        }
        else { //if (position == "right") {
            distance = -3.0;
            if (userInputParam.right != "") {
                distance = -parseFloat(userInputParam.right) ;
            }
        }

        var result = iD.util.RoadOffset().roadOffset(graph, survivor, distance) ;
        var pline_cnt = result.length ;
        for (var r=0; r<pline_cnt; r++) {
            var pline = result[r] ;
            draw(pline, position);
        }
    };

    //创建一条新的道路
    function newroad(position, survivor, newNodesLoc) {
        var newLoc;
        var oldLoc;
        var interPoint = [0, 0];
        var nodeEntity;
        var adjoinEntity;
        for (var i = 0; i < survivor.nodes.length - 1; i++) {
            nodeEntity = graph.entity(survivor.nodes[i]);
            adjoinEntity = graph.entity(survivor.nodes[i + 1]);
            if (0 == i) {
                newLoc = getLngLat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1], position);
                interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];
            } else {
                if (nodeEntity.loc[0] == adjoinEntity.loc[0] && adjoinEntity.loc[1] == adjoinEntity.loc[1] && i < survivor.nodes.length - 2) {
                    i++;
                    adjoinEntity = graph.entity(survivor.nodes[i + 1]);
                }
                newLoc = getLngLat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1], position);
                lineCal.getIntersectionPoint(projection, [oldLoc[0].Longitude, oldLoc[0].Latitude],
                    [oldLoc[1].Longitude, oldLoc[1].Latitude], [newLoc[0].Longitude, newLoc[0].Latitude], [newLoc[1].Longitude, newLoc[1].Latitude], interPoint);

            }
            newNodesLoc.push([interPoint[0], interPoint[1]]);
            oldLoc = newLoc;
        }
        newNodesLoc.push([newLoc[1].Longitude, newLoc[1].Latitude])
        draw(newNodesLoc, position);
    };

    function draw(newNodesLoc, position) {
        var style = {"stroke": 'rgb(0, 0, 255)', 'opacity': '0.5', "stroke-width": 2, "stroke-dasharray": "10, 6"};
        var nodes = [], mode = 'distance';
        newNodesLoc.forEach(function (loc) {
            nodes.push(new Marker({loc: loc}));
        })
        var polyline = new Polyline({
            nodes: nodes,
            mode: 'polyline',
            onDraw: function (element) {
                element.style(style);
            }
        });
        context.map().addOverlays(polyline);
        context.event.drawstart({overlay: polyline, mode: mode});
        context.event.drawoverlayers();
        context.event.drawing({overlay: polyline, mode: mode});
        iD.expandRoadAnimation.addExpandRoadObj(polyline);
    }

    //@param position [标注扩展道路的左边or右边]
    //@return 扩路后A,B两点新的坐标(A,B两点相邻)
    function getLngLat(lngA, latA, lngB, latB, position) {
        var result = new Array();
        var angle = lineCal.getAngle(lngA, latA, lngB, latB);
        var distance = 0.003;

        if (position == "left") {
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
        }
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

    return roadExpandAnimation;
};

(function (iD) {
    var expandRoadAnimationObjs = [];
    iD = iD || {};
    iD.expandRoadAnimation = {
        addExpandRoadObj: function (obj) {
            expandRoadAnimationObjs.push(obj);
        },
        resetExpandObjs: function () {
            expandRoadAnimationObjs = [];
        },
        getExpandRoadObj: function () {
            return expandRoadAnimationObjs;
        }
    }
})(iD);