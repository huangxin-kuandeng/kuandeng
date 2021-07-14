/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:21:33
 * @Description: 
 */
iD.modes.AddPoint = function(context) {
    var mode = {
        id: 'add-point',
        button: 'point',
        title:'',// t('modes.add_point.title'),
        description: t('modes.add_point.description'),
        key: 'Alt+1'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_point.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
    	var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PT);
    	var layerid =  layer.id;
        var node = iD.Node({
			layerId : layerid,
            loc : loc,
            identifier:layer.identifier,
			modelName: iD.data.DataType.OBJECT_PT,
			tags: iD.util.getDefauteTags(iD.data.DataType.OBJECT_PT, layer)
		});

        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        
        context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PT);
        // add node envent
        context.event.add({'type' : node.type, 'entity' : node});

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
        context.buriedStatistics().merge(1,iD.data.DataType.OBJECT_PT);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
