iD.actions.ChangeNodeMember = function(entityId, scmember) {
    return function(graph) {
        var entity = graph.entity(entityId);
        entity.tags =iD.util.tagExtend.updateTaskTag(entity);
        graph = graph.replace(entity);
        graph=graph.replace(entity.updateMember(scmember));
        entity = graph.entity(entityId);
        if(entity.modelName==iD.data.Constant.C_NODE&&entity.members)
        {
            var loc=[0,0];
            entity.members.forEach(function(member)
            {
                loc[0]+=graph.entity(member.id).loc[0];
                loc[1]+=graph.entity(member.id).loc[1];
            })
            loc[0]/=entity.members.length;
            loc[1]/=entity.members.length;
            entity.loc=loc;
            graph=graph.replace(entity);
        }
        return graph;
    };
};
