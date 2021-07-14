
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
 * 类: iD.behavior.LassoZoom
 * 用于拉框放大的鼠标事件行为(control)
 * iD.ui.LassoZoom-->iD.modes.LassoZoom-->iD.behavior.LassoZoom
 +------------------------------------------------------------------------------
 */
iD.behavior.LassoZoom = function(context) {
    var type = arguments[1];
    var behavior = function(selection) {

        var mouse = null,
            lasso;

        function mousedown() {

            mouse = context.mouse();
            lasso = null;

            selection
                .on('mousemove.lasso', mousemove)
                .on('mouseup.lasso', mouseup)
                .on('mousedown.lasso',mouseup);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            
        }

        function mousemove() {
            if (!lasso) {
                lasso = iD.ui.Lasso(context).a(mouse);
                context.surface().call(lasso);
            }

            lasso.b(context.mouse());
        }

        function normalize(a, b) {
            return [
                [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
                [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
        }

        function mouseup() {

            selection
                .on('mousemove.lasso', null)
                .on('mouseup.lasso', null);
                

            if((context.mouse().join(",") == mouse.join(",")))
            {
                 context.enter(iD.modes.Browse(context));
                 return;
            }

            if (!lasso) return;

            var extent = iD.geo.Extent(
                normalize(context.projection.invert(lasso.a()),
                context.projection.invert(lasso.b())));

            lasso.close();

            if(type)
            {
                var size = context.map().dimensions();
                var dx = lasso.b()[0] - lasso.a()[0],
                    dy = lasso.b()[1] - lasso.a()[1];
                var ratio = Math.min(size[0] / Math.abs(dx), size[1] / Math.abs(dy));
                    ratio = Math.floor(ratio);
                
                var targetZoomLv = Math.round(context.map().zoom() + (Math.log(1 / ratio) / Math.log(2)));
               
                // shrinkage map zoom
                context.map().centerZoom(extent.center(), targetZoomLv);
            }else{

                // enlarge map zoom
                context.map().centerZoom(extent.center(), context.map().extentZoom(extent));
            }
            
            // set map to browse mode
            context.enter(iD.modes.Browse(context));
        }

        selection
            .on('mousedown.lasso', mousedown);
    };

    behavior.off = function(selection) {
        selection.on('mousedown.lasso', null);
    };

    return behavior;
};
