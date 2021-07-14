/*
 * Based on https://github.com/openstreetmap/potlatch2/net/systemeD/potlatch2/tools/Straighten.as
 */

iD.actions.Straighten = function(selectedIDs, projection) {
    var changeIds = [];

    function positionAlongWay(n, s, e) {
        return ((n[0] - s[0]) * (e[0] - s[0]) + (n[1] - s[1]) * (e[1] - s[1]))/
                (Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
    }
    function getTheSameWay(graph,entity1,entity2){
        let wids1 = _.pluck(graph.parentWays(entity1),'id'),
        wids2 = _.pluck(graph.parentWays(entity2),'id'),
        wayId;
        for(let i=0;i<wids1.length;i++){
            if(wids2.includes(wids1[i])){
                wayId = wids1[i];
                break;
            }
        }
        return wayId;
    }
    
    function getHeight(loc,node){
        let cRangeNodes = iD.util.selectNode_Z(loc, 40);
        let tracks = [];
        for(let i = 0; i < cRangeNodes.length; i++) {
            var rangeNodes = cRangeNodes[i];
            var node = iD.util.getNearestNode(loc, rangeNodes.nodes);
            tracks.push({
                node : node,
                cameraHeight : rangeNodes.cameraHeight,
                trackId : rangeNodes.trackId
            });
        }
        // console.log(disArr)
        if (tracks.length == 0) {
            return node.loc[2];
        }
        var nearrestTrack = iD.util.getNearestTracks(loc, tracks);
        return nearrestTrack.node.loc[2] - nearrestTrack.cameraHeight;
    }

    var action = function(graph) {
        changeIds = [];

        let entity1 = graph.entity(selectedIDs[0]),
        entity2 = graph.entity(selectedIDs[1]),
        wayId  = getTheSameWay(graph,entity1,entity2),
   
        way = graph.entity(wayId),
            nodes = graph.childNodes(way),
            index1 = nodes.indexOf(entity1),
            index2 = nodes.indexOf(entity2);
            // start = index1,end = index2
            if(index1>index2){
                [index1,index2] = [index2,index1];
            }
            points = nodes.map(function(n) { return projection(n.loc); }),
            startPoint = points[index1],
            endPoint = points[index2],
            toDelete = [],
            i;

        for (i = index1+1; i < index2; i++) {
            var node = nodes[i],
                point = points[i];

            if (graph.parentWays(node).length > 1 ||
                graph.parentRelations(node).length ||
                node.hasInterestingTags()) {

                let u = positionAlongWay(point, startPoint, endPoint),
                    p0 = startPoint[0] + u * (endPoint[0] - startPoint[0]),
                    p1 = startPoint[1] + u * (endPoint[1] - startPoint[1]),
                    loc = projection.invert([p0, p1]);
                    heigth = getHeight(loc,node);
                    loc.push(heigth);
                graph = graph.replace(graph.entity(node.id)
                    .move(loc));
                changeIds.push(node.id);
            } else {
                // safe to delete
                if (toDelete.indexOf(node) === -1) {
                    toDelete.push(node);
                }
            }
        }

        for (i = 0; i < toDelete.length; i++) {
            graph = iD.actions.DeleteNode(toDelete[i].id)(graph);
        }

        return graph;
    };

    action.changeIds = function(){
        return changeIds;
    }
    
    action.disabled = function(graph) {
        // check way isn't too bendy

        let entity1 = graph.entity(selectedIDs[0]),
        entity2 = graph.entity(selectedIDs[1]),
        wayId  = getTheSameWay(graph,entity1,entity2),
        
        way = graph.entity(wayId),
            nodes = graph.childNodes(way),
            points = nodes.map(function(n) { return projection(n.loc); }),
            index1 = nodes.indexOf(entity1),
            index2 = nodes.indexOf(entity2);
            if(index1>index2){
                [index1,index2] = [index2,index1];
            }
            startPoint = points[index1],
            endPoint = points[index2],
            threshold = 0.2 * Math.sqrt(Math.pow(startPoint[0] - endPoint[0], 2) + Math.pow(startPoint[1] - endPoint[1], 2)),
            i;
            if (threshold === 0) {
                return 'too_bendy';
            }
        for (i = index1+1; i < index2; i++) {
            var point = points[i],
                u = positionAlongWay(point, startPoint, endPoint),
                p0 = startPoint[0] + u * (endPoint[0] - startPoint[0]),
                p1 = startPoint[1] + u * (endPoint[1] - startPoint[1]),
                dist = Math.sqrt(Math.pow(p0 - point[0], 2) + Math.pow(p1 - point[1], 2));

            // to bendy if point is off by 20% of total start/end distance in projected space
            if (isNaN(dist) || dist > threshold) {
                return 'too_bendy';
            }
        }
    };

    return action;
};
