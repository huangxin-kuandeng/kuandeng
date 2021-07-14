// https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/command/MoveCommand.java
// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MoveNodeAction.as
iD.actions.MoveNode = function(nodeId, loc) {
    return function(graph) {

        graph.parentRelations(graph.entity(nodeId)).forEach(function(rel)
        {
            if(rel.tags&&rel.modelName==iD.data.Constant.C_NODE)
            {
                graph=iD.actions.ChangeNodeMember(rel.id,rel.members)(graph);
            }
        })
        let node = graph.entity(nodeId);
        node = node.mergeTags(iD.util.tagExtend.updateTaskTag(node));
        graph = graph.replace(node);
        graph=graph.replace(node.move(loc));
        return graph;
    };
};
