/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:03:58
 * @Description: 
 */
iD.modes.AddSpeedCamera = function(context) {
    var mode = {
        id: 'add-speedcamera',
        button: 'speedcamera',
        title: t('modes.add_speedcamera.title'),
        description: t('modes.add_speedcamera.description'),
        key: '6'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_speedcamera.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
    	// var layer = iD.Layers.getCurrentEnableLayer(), layerId = layer.id;
    	var layer = iD.Layers.getLayer(), layerId = layer.id;
        var node = iD.Node({
        	_type: 'speedcamera',
			members: [],
            modelName: 'SpeedCamera',
            loc: loc,
            identifier:layer.identifier,
        	layerId : layerId
    	});
        
        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));
        
        context.enter(
                iD.modes.Select(context, [node.id])
                    .suppressMenu(true)
                    .newFeature(true));

        // add way envent
        context.event.add({'type' : 'speedcamera', 'entity' : node});
        
        if (layer.continues) context.enter(iD.modes.AddSpeedCamera(context));
    }

    function addWay(loc) {
        add(loc);
    }

    function addNode(node) {
        add(node.loc);
    }

    function cancel() {
        context.enter(iD.modes.Browse(context));
    }

    mode.enter = function() {
    	d3.select('.add-road').classed('active', false);
    	d3.select('.'+this.id).classed('active', true);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
