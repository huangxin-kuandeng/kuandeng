/**
 * 拖拽BARRIER_GEOMETRY_NODE，使整条线的所有节点按照拖拽点距离移动
 */
iD.actions.ExpandBarrierGeometryNode = function(selectedIDs, context) {
    var action = function(graph) {
        var barrierGeometry = context.entity(selectedIDs[0]);
        var protoNodes = context.childNodes(barrierGeometry);
        var sourceNode = context.variable.dragBarrierNode;
        if (!sourceNode.nodeId) return graph;

        var oldLoc = sourceNode.oldLoc;
        var newLoc = sourceNode.newLoc;
        var oldLocUtm = iD.util.LLtoUTM_(oldLoc[0], oldLoc[1]);
        var newLocUtm = iD.util.LLtoUTM_(newLoc[0], newLoc[1]);
        var dis = [newLocUtm.x - oldLocUtm.x, newLocUtm.y - oldLocUtm.y],
            height = newLoc[2] - oldLoc[2];
        // console.log("dis:", dis);
        // console.log("height:", height)
        protoNodes.forEach(n => {
            if (n.id != sourceNode.nodeId) {
                //var loc = iD.util.getLngLatByOffsetMeter(n.loc, dis[0], dis[1]);
                var locUtm = iD.util.LLtoUTM_(n.loc[0], n.loc[1]);
                locUtm.x += dis[0];
                locUtm.y += dis[1];
                var loc = iD.util.UTMtoLL_(locUtm.x, locUtm.y, locUtm.zoneNumber);
                // var loc = protoNodes[0].loc;
                // console.log('old:', n.loc);
                loc[2] = n.loc[2] + height;
                // console.log('new:', loc)
                graph = graph.replace(n.move(loc));
            }
        });
        return graph;
    };

    action.disabled = function(graph) {
        return false;
    };
    return action;
};
