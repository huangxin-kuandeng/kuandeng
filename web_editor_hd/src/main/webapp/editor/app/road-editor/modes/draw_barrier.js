/*
 * @Author: tao.w
 * @Date: 2020-09-14 13:55:47
 * @LastEditors: tao.w
 * @LastEditTime: 2020-09-14 14:37:36
 * @Description: 
 */
iD.modes.DrawBarrier = function(context, wayId, baseGraph, affix, linetype) {
    var mode = {
        button: 'barrier',
        id: 'draw-barrier',
        type:linetype,
        drawroad : linetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            index = (affix === 'prefix') ? 0 : undefined,
            headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = iD.behavior.DrawBarrier(context, wayId, index, mode, baseGraph, linetype)
            .tail(t('modes.draw_barrier.tail'));

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
