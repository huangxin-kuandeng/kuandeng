/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:23:28
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-13 17:39:31
 * @Description: 
 */
iD.modes.DrawObjectPG = function(context, wayId, baseGraph,modetype) {
    var mode = {
        button: 'objectPg',
        id: 'draw-object-pg',
        drawroad : modetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            headId = way.nodes[way.nodes.length - 2],
            tailId = way.first();

        behavior = iD.behavior.DrawObjectPG(context, wayId, -1, mode, baseGraph)
            .tail(t('modes.draw_object_pg.tail'));

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
