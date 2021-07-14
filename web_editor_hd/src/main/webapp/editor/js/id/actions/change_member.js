iD.actions.ChangeMember = function(relationId, member, memberIndex) {
    return function(graph) {
        let relation = graph.entity(relationId);
        relation.tags = iD.util.tagExtend.updateTaskTag(relation);
        graph = graph.replace(relation);
        return graph.replace(relation.updateMember(member, memberIndex));
    };
};
