// +----------------------------------------------------------------------
// | Map Editor JavaScript API
// +----------------------------------------------------------------------
// | Copyright (c) 2014 http://amap.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed AutoNavi amap
// +----------------------------------------------------------------------
// | Author: webapi 
// +----------------------------------------------------------------------
/**
 +------------------------------------------------------------------------------
 * 类: iD.ui.toolbar.Toolbar
 * 多边形选择
 +------------------------------------------------------------------------------
 */
iD.ui.toolbar.Toolbar = function(context) {

    var toolbar = [//iD.modes.toolbar.Polygon(context),
                   iD.modes.toolbar.Distance(context)];
    var keybinding = d3.keybinding('distance');
    return function(selection) {

        var button = selection.selectAll('button')
            .data(toolbar)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) {
                keybinding.on(d.key, function() {
                context.enter(iD.modes.Browse(context));
                //d3.select(this).classed("active",true);
                //context.install(behavior);
                context.enter(d);
            });

                return d.id;
            })
//          .attr('style', function(d) { if (d.id === 'toolbar-distance') return ';border-radius: 0px 0 0 4px;'; else return '';})//为配合样式做的处理
            .on('click.toolbar', function(d) { 
                   if (d.id === context.mode().id) {
                       context.enter(iD.modes.Browse(context));
                   } else {
                       context.enter(iD.modes.Browse(context));
                       context.enter(d);

                   }

 
             })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(function(d) {
                    return iD.ui.tooltipHtml(d.title, d.key);
                }));

        button.append('span')
            .attr('class', function(d) { return d.id + ' icon'; });

        context.on('enter.toolbar', function(entered) { 
            button.classed('active', function(mode) {  return entered.button === mode.button; });
            context.container().classed('mode-' + entered.id, true);
        });

        context.on('exit.toolbar', function(exited) { 
            context.container().classed('mode-' + exited.id, false);
        });    

        context.map().on('move.toolbar', function(){});

        d3.select(document)
            .call(keybinding);
    };
};
