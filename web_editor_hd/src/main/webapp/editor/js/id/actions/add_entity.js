iD.actions.AddEntity = function(entity) {
    return function(graph) {
        return graph.replace(entity);
    };
};
