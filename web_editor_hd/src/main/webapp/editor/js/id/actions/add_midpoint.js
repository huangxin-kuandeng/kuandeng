iD.actions.AddMidpoint = function(midpoint, node) {
    return function(graph) {
        graph = graph.replace(node.move(midpoint.loc));

        var parents = _.intersection(
            graph.parentWays(graph.entity(midpoint.edge[0])),
            graph.parentWays(graph.entity(midpoint.edge[1])));

        parents.forEach(function(way) {
            for (var i = 0; i < way.nodes.length - 1; i++) {
                if (iD.geo.edgeEqual([way.nodes[i], way.nodes[i + 1]], midpoint.edge)) {

                    way.tags =iD.util.tagExtend.updateTaskTag(way);
                    graph = graph.replace(way);
                    graph = graph.replace(way.addNode(node.id, i + 1));

                    // Add only one midpoint on doubled-back segments,
                    // turning them into self-intersections.
                    return;
                }
            }
        });

        return graph;
    };
};
