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
 * 类: iD.ui.LassoZoom
 * 鼠标工具拉框放大显示(view)
 * iD.ui.LassoZoom-->iD.modes.LassoZoom-->iD.behavior.LassoZoom
 +------------------------------------------------------------------------------
 */
iD.ui.LassoZoom = function(context) {

    var tools = [iD.modes.LassoZoom(context), 
                 iD.modes.LassoZoom(context, true)];
     
    return function(selection) {

        var button = selection.selectAll('button')
            .data(tools)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { if (d.id === 'lasso-zoomOut') this.style.borderRadius = 0; return d.id; })
            .on('click.lassozoom', function(d) { 

                   if (d.id === context.mode().id) {
                       // set browse mode
                       context.enter(iD.modes.Browse(context));
                   } else {
                       // set lassozomm mode
                       context.enter(d);
                   }
                  
                   // set mouse style
                   //context.container().classed('lasso', true);
             })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(function(d) {
                    return iD.ui.tooltipHtml(d.title, d.key);
                }));

        button.append('span')
            .attr('class', function(d) { return d.id + ' icon' });

        context.on('enter.lasso_zoom', function(entered) { 
            button.classed('active', function(mode) {  return entered.button === mode.button; });
            context.container().classed('mode-' + entered.id, true);
        });

        context.on('exit.lasso_zoom', function(exited) {
             context.container().classed('mode-' + exited.id, false);
        });    


    };
};
