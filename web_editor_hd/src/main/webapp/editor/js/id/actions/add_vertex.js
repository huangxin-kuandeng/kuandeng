// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/AddNodeToWayAction.as
iD.actions.AddVertex = function(wayId, nodeId, index) {
    return function(graph) {
        let way = graph.entity(wayId);
        way.tags =iD.util.tagExtend.updateTaskTag(way);
        graph = graph.replace(way);
        return graph.replace(way.addNode(nodeId, index));
    };
};
