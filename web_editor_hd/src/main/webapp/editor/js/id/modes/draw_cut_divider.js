iD.modes.DrawCutDivider = function(context, wayId, baseGraph, affix, linetype) {
    var mode = {
        id: 'draw-cut-divider',
        button: 'cutDivider',
        type:linetype,
        drawroad : linetype
    };
    var event = d3.dispatch('finish');

    var behavior;

    // behavior中的drawCutDivider每次绘制节点后，又会重新enter该mode
    // 导致此函数多次执行，可能是每次绘制的仅仅是一段路，
    mode.enter = function() {
        var way = context.entity(wayId),
            index = (affix === 'prefix') ? 0 : undefined,
            headId = (affix === 'prefix') ? way.first() : way.last();

        behavior = iD.behavior.DrawCutDivider(context, wayId, index, mode, baseGraph)
            .tail(t('modes.draw_divider.tail'));
        /*
        var finish = behavior.finish;
        behavior.finish = function() {
        	var way = context.entity(wayId);
            finish();
            event.finish(way);
            context.event.entityedite({
            	mode: mode,
            	entity: null
            });
        };
        */
        var finishSplitLine = behavior.finishSplitLine;
        behavior.finishSplitLine = function() {
            finishSplitLine();
            context.event.entityedite({
            	mode: mode,
            	entitys: []
            });
        };

        context.install(behavior);
        
    };
    
    function checkWayLength(wayId, behavior){
    	var way = context.entity(wayId);
    	// 实现打断效果，最好只有一段线
    	if(way.nodes && way.nodes.length == 2){
        	behavior.finish();
        	return ;
        }
    }
    

    mode.exit = function() {
        context.uninstall(behavior);
    };

    mode.selectedIDs = function() {
        return [wayId];
    };
    
//  return mode;
    return d3.rebind(mode, event, 'on');
};
