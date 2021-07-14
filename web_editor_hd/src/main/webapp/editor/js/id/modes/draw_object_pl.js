/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:14:31
 * @LastEditors: tao.w
 * @LastEditTime: 2019-11-04 19:16:34
 * @Description: 
 */
iD.modes.DrawObjectPl = function(context, wayId, baseGraph, affix, linetype) {
    var mode = {
        button: 'objectPl',
        id: 'draw-objectPl',
        type:linetype,
        drawroad : linetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
            index = (affix === 'prefix') ? 0 : undefined,
            headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = iD.behavior.DrawObjectPl(context, wayId, index, mode, baseGraph, linetype)
            .tail(t('modes.draw_objectPl.tail'));

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
