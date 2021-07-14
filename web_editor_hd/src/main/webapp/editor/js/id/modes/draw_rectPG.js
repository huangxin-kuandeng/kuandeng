/*
 * @Author: tao.w
 * @Date: 2019-11-06 14:50:23
 * @LastEditors: tao.w
 * @LastEditTime: 2019-11-07 14:28:34
 * @Description: 
 */
iD.modes.DrawRectPG = function(context, wayId, baseGraph,modetype) {
    var mode = {
        button: 'rectPG',
        id: 'draw-rectPG',
        drawroad : modetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            headId = way.nodes[way.nodes.length - 2],
            tailId = way.first();

        behavior = iD.behavior.DrawRectPG(context, wayId, -1, mode, baseGraph)
            .tail(t('modes.draw_rectPG.tail'));

        var addNode = behavior.addNode;

        behavior.addNode = function(node) {
            if (way.nodes.length == 5) {
                behavior.finish(false);
            } else if ((node.id === headId || node.id === tailId) && way.nodes.length == 5) {

                behavior.finish(false);
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
