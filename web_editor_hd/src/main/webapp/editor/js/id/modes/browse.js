/**
 * 浏览模式，默认模式
 * @param {Object} context
 */
iD.modes.Browse = function(context) {
    var mode = {
        button: 'browse',
        id: 'browse',
        title: t('modes.browse.title'),
        description: t('modes.browse.description')
    }, sidebar;

    var behaviors = [
        iD.behavior.Hover(context)
            .on('hover', context.ui().sidebar.hover),
        iD.behavior.Select(context),
        iD.behavior.Lasso(context),
        iD.modes.DragNode(context).behavior];

    mode.enter = function() {
        context.transportation.set();
        context.temp().rawposition = 0;

        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });

        // Get focus on the body.
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        if (sidebar) {
            context.ui().sidebar.show(sidebar);
        } else {
            context.ui().sidebar.select(null);
        }
        //取消记录在dom中得选中的路id
        var d3Obj=d3.select("#KDSEditor-sidebar");
        if(d3Obj.size()>0){
            d3Obj.attr("data-multiselectids",null);
            d3Obj.attr("data-filterparam",null);
            d3Obj.attr("data-member-multiselectids",null);
        }
    };

    mode.exit = function() {
        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });

        if (sidebar) {
            context.ui().sidebar.hide(sidebar);
        }
    };

    mode.sidebar = function(_) {
        if (!arguments.length) return sidebar;
        sidebar = _;
        return mode;
    };

    return mode;
};
