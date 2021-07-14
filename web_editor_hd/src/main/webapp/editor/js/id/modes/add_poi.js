/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:21:24
 * @Description: 
 */
iD.modes.AddPoi = function(context) {
    var mode = {
        id: 'add-poi',
        button: 'poi',
        title:'',// t('modes.add_point.title'),
        description: t('modes.add_poi.description'),
        key: 'Alt+1'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_poi.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
//  	var currLayer = context.layers().getCurrentEnableLayer();
    	var layer =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.POI);
    	var layerid =  layer.id;
        var node = iD.Node({
			layerId : layerid,
            loc : loc,
            identifier:layer.identifier,
			modelName: iD.data.DataType.POI,
			tags: iD.util.getDefauteTags(iD.data.DataType.POI, layer)
		});

        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        
        context.buriedStatistics().merge(0,iD.data.DataType.POI);
        // add node envent
        context.event.add({'type' : node.type, 'entity' : node});

//      if (currLayer.continues) context.enter(iD.modes.AddPoint(context));
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
        context.buriedStatistics().merge(1,iD.data.DataType.POI);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
