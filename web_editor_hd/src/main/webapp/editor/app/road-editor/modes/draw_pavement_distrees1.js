/*
 * @Author: tao.w
 * @Date: 2020-04-15 14:43:38
 * @LastEditors: tao.w
 * @LastEditTime: 2020-10-12 20:08:06
 * @Description: 绘制裂缝
 */
iD.modes.DrawPavementDistrees1 = function(context, wayId, baseGraph, affix,linetype) {
    var mode = {
        button: 'pavementDistrees1',
        id: 'draw-pavementDistrees1',
        type:linetype,
        drawroad : linetype
    };

    var behavior;

    mode.enter = function() {
        var way = context.entity(wayId),
        index = (affix === 'prefix') ? 0 : undefined,
        headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = iD.behavior.DrawPavementDistress1(context, wayId, index, mode, baseGraph,linetype)
            .tail(t('modes.draw_pavementDistrees1.tail'));

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
