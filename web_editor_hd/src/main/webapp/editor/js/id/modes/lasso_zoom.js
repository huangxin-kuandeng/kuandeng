
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
 * 类: iD.modes.LassoZoom
 * 拉框放大模式(mode)
 * iD.ui.LassoZoom-->iD.modes.LassoZoom-->iD.behavior.LassoZoom
 +------------------------------------------------------------------------------
 */
iD.modes.LassoZoom = function(context) {
    var type = arguments[1];
    var mode = {
        id: !type ? 'lasso-zoom' : 'lasso-zoomOut',
        button: !type ? 'lasso-zoom' : 'lasso-zoomOut',
        title: !type ? '拉框放大' : '拉框缩小',
        description: !type ? '拉框放大' : '拉框缩小',
        key: 'none',
        enable : true
    };

    var keybinding = d3.keybinding('lasso-zoom');
    var behavior = iD.behavior.LassoZoom(context,type);

    mode.enter = function() {
        context.install(behavior);
         // set map browse mode 
         keybinding.on('⎋', function() {
            context.enter(iD.modes.Browse(context));
         });
        d3.select(document)
                    .call(keybinding);
    };

    mode.exit = function() {
        context.uninstall(behavior);
        keybinding.off();
    };

    return mode;
};
