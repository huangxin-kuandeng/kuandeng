iD.modes.DrawArea = function(context, wayId, baseGraph,modetype) {
    var mode = {
        button: 'area',
        id: 'draw-area',
        drawroad : modetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            headId = way.nodes[way.nodes.length - 2],
            tailId = way.first();
		/*
        behavior = iD.behavior.DrawWay(context, wayId, -1, mode, baseGraph)
            .tail(t('modes.draw_area.tail'));
        */
        behavior = iD.behavior.DrawDivider(context, wayId, -1, mode, baseGraph)
            .tail(t('modes.draw_area.tail'));

        var addNode = behavior.addNode;

        behavior.addNode = function(node) {
            if (node.id === headId || node.id === tailId) {
                behavior.finish();
            } else {
                addNode(node);
            }
        };

        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    mode.selectedIDs = function() {
        return [wayId];
    };

    return mode;
};
