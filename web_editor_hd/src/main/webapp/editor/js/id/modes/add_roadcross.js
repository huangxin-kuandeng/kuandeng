/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:22:07
 * @Description: 
 */
iD.modes.AddRoadCross = function(context) {
    var mode = {
        id: 'add-roadcross',
        button: 'roadcross',
        title: t('modes.add_roadcross.title'),
        description: t('modes.add_roadcross.description'),
        key: '5'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_roadcross.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
    	var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.C_NODE), layerId = layer.id;
        var node = iD.Node({
        	_type: 'roadcross',
			members: [],
            modelName: iD.data.Constant.C_NODE,
            loc: loc,
            identifier:layer.identifier,
        	layerId : layerId
    	});
        node.setTags(iD.util.getDefauteTags(node, layer));
        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));
        
        context.enter(
                iD.modes.Select(context, [node.id])
                    .suppressMenu(true)
                    .newFeature(true));

        
        context.buriedStatistics().merge(0,iD.data.DataType.C_NODE);
        // add way envent
        context.event.add({'type' : 'roadcross', 'entity' : node});
        
        // editor.addDataLayer时，iD.store.layers上的默认值
//      if (layer.continues) context.enter(iD.modes.AddRoadCross(context));
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
        context.buriedStatistics().merge(1,iD.data.DataType.C_NODE);
    	d3.select('.add-road').classed('active', false);
    	d3.select('.'+this.id).classed('active', true);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
