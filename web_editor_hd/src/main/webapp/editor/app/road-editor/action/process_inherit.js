
iD.actions.ProcessInherit = function(changes) {
    return function(graph) {
        for (var type in changes) {
            if(type=="deleted"){
                continue;
            }
            var entities = changes[type];
            for (var i = 0;i < entities.length;i++) {
                if(entities[i].type === 'node'||entities[i].type ==='way') {
                    if (entities[i].new_id_inherit) {
                        entities[i].new_id_inherit = _.unique(entities[i].new_id_inherit.split(","));
                    }
                    graph=graph.replace(entities[i]);

                }
            }
        }
        return graph;
    };

};
