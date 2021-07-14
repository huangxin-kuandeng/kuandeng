/**
 * Created by wt on 2015/8/10.
 */
iD.modes.AddIsland = function (context, highLightIds) {
    var mode = {
        id: 'add-island',
        button: 'island',
        title: '',
        description: t('modes.add_island.description'),
        key: 'Ctrl+M',
        enable: true
    };

    function selectElements() {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', true);
    }

    var behavior = iD.behavior.drawIsland(context);

    mode.enter = function () {
        //取消所有高亮
        var sf = context.surface();
        sf.on('dblclick.select', null)
            .selectAll('.selected')
            .classed('selected', false);
        context.map().on('drawn.select', null);
        context.install(behavior);
    };

    mode.exit = function () {
        //结束时高亮
        if (typeof highLightIds != 'undefined' && highLightIds != '') {
            context.map().on('drawn.select', selectElements);
            selectElements();
        }
        context.uninstall(behavior);
    };

    return mode;
};
