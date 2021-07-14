/*
 * @Author: tao.w
 * @Date: 2020-03-13 15:32:40
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-13 17:29:56
 * @Description: 
 */
iD.modes.AddTextMark = function(context) {
    var mode = {
        id: 'add-text-mark',
        button: 'textmark',
        title:'',// t('modes.add_point.title'),
        description: t('modes.add_text_mark.description'),
        key: 'Alt+1'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_text_mark.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
//  	var currLayer = context.layers().getCurrentEnableLayer();
		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.TEXT_MARK);
    	var layerid =  currentLayer.id;
        var node = iD.Node({
			layerId : layerid,
            loc : loc,
            identifier:currentLayer.identifier,
			modelName: iD.data.DataType.TEXT_MARK,
			tags: iD.util.getDefauteTags(iD.data.DataType.TEXT_MARK, currentLayer)
		});

        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        
        context.buriedStatistics().merge(0,iD.data.DataType.TEXT_MARK);
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
        context.buriedStatistics().merge(1,iD.data.DataType.TEXT_MARK);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
