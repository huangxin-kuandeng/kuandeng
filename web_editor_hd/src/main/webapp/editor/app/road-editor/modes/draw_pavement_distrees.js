/*
 * @Author: tao.w
 * @Date: 2020-04-15 14:43:38
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-22 10:40:59
 * @Description: 
 */
iD.modes.DrawPavementDistrees = function(context, wayId, baseGraph, affix,linetype) {
    var mode = {
        button: 'pavementDistrees',
        id: 'draw-pavementDistrees',
        type:linetype,
        drawroad : linetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            headId = way.nodes[way.nodes.length - 2],
            tailId = way.first();

        behavior = iD.behavior.DrawPavementDistress(context, wayId,  -1, mode, baseGraph)
            .tail(t('modes.draw_pavementDistrees.tail'));

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
