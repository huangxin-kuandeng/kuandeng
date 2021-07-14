iD.actions.HorizontalMove = function (context, projection,nodes,dist,isLeft) {
    // var lineCal = iD.util.LineCalCulate();
    var handle = iD.measureinfo.handle();
    function getLnglat(lngA,latA,lngB,latB,dist,isLeft){

        var result = new Array();
        var lineCal = iD.util.LineCalCulate();
        var angle = lineCal.getAngle(lngA, latA, lngB, latB);

        if (isLeft) {
            angle = (angle - 90) + 360;
        }
        else{
            angle = (angle + 90) + 360;
        }
        var newPointA = {};
        var newPointB = {};
        var pointA = lineCal.calculateVerticalP(lngA, latA, dist, angle);
        newPointA.Longitude = pointA.Longitude;
        newPointA.Latitude = pointA.Latitude;
        result.push(newPointA);
        var pointB = lineCal.calculateVerticalP(lngB, latB, dist, angle);
        newPointB.Longitude = pointB.Longitude;
        newPointB.Latitude = pointB.Latitude;
        result.push(newPointB);
        return result;
    }

    var action = function (graph) {
        var newLoc;
        var oldLoc;
        var interPoint = [0, 0];
        var nodeEntity;
        var adjoinEntity;
        var lineCal = iD.util.LineCalCulate();
        for (var i = 0; i < nodes.length - 1; i++) {
            nodeEntity = nodes[i];
            adjoinEntity = nodes[i + 1];

            if (0 == i) {
                newLoc = getLnglat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1],dist,isLeft);
                interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];
            } else {
                newLoc = getLnglat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1],dist,isLeft);
                lineCal.getIntersectionPoint(projection, [oldLoc[0].Longitude, oldLoc[0].Latitude],
                    [oldLoc[1].Longitude, oldLoc[1].Latitude], [newLoc[0].Longitude, newLoc[0].Latitude], [newLoc[1].Longitude, newLoc[1].Latitude], interPoint);
            }

            graph = iD.actions.MoveNode(nodeEntity.id, [interPoint[0], interPoint[1],nodeEntity.loc[2]])(graph);
            if(i == 0 && handle){
                graph = handle.addEntity(graph, nodeEntity, {
                    type: 6,
//                  method:6,
                    data:[{
                        type: 'pan'
                    }]
                })
            }
            // graph = graph.replace(nodeEntity);
            oldLoc = newLoc;
        }

        // adjoinEntity.move([newLoc[1].Longitude, newLoc[1].Latitude]);
        // graph = graph.replace(adjoinEntity);
        graph = iD.actions.MoveNode(adjoinEntity.id,[newLoc[1].Longitude, newLoc[1].Latitude,adjoinEntity.loc[2]])(graph);
        return graph;

    };

    action.disabled = function () {
        return false;
    };

    return action;
}