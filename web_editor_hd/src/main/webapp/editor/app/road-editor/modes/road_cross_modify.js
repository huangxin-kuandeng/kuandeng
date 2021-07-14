/**
 * Created by wt on 2015/9/16.
 */
iD.modes.RoadCrossModify = function(context, selectedIDs) {
    var mode = {
        id: 'RoadCrossModify',
        button: 'RoadCrossModify'
    };

    var keybinding = d3.keybinding('RoadCrossModify'),
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.RoadCrossModify(context,selectedIDs)];
    mode.selectedIDs = function() {
        return selectedIDs;
    };
    mode.setSelectedIDs = function(_) {
        if(_){
            selectedIDs = _;
        }
        return selectedIDs;
    };
    mode.enter = function() {
        keybinding.on('⎋', function() {
            context.enter(iD.modes.Browse(context));
        }, true);
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });
        d3.select(document)
            .call(keybinding);
        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }
        context.map().on('drawn.select', selectElements);
        selectElements();
    };

    mode.exit = function() {
        //if (timeout) window.clearTimeout(timeout);
        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });
        //context.enter(iD.modes.Browse(context));    //修复多次撤销，虽然综合交叉点已经删除，但是一直在综合交叉点模式不能选中道路
        context.surface().selectAll('.selected')
            .classed('selected', false);
        context.map().on('drawn.select', null);
        keybinding.off();
    };

    return mode;
};









