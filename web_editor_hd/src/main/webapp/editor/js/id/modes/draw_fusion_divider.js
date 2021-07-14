iD.modes.DrawFusionDivider = function(context, wayId, baseGraph, affix, linetype) {
    var mode = {
        button: 'divider',
        id: 'draw-fusion-divider',
        type:linetype,
        drawroad : linetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            index = (affix === 'prefix') ? 0 : undefined,
            headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = iD.behavior.DrawFusionDivider(context, wayId, index, mode, baseGraph, linetype)
            .tail(t('modes.draw_fusion_divider.tail'));

        var addNode = behavior.addNode;

        behavior.addNode = function(node) {
            if (node.id === headId) {
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
