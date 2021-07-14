/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-08 18:14:20
 * @Description: 
 */
iD.modes.AddObjectPt = function(context) {
    var mode = {
        id: 'add-objectPt',
        button: 'objectPt',
        title:'',// t('modes.add_point.title'),
        description: t('modes.add_objectPt.description'),
        key: 'Ctrl+1'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_objectPt.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
        let z = iD.util.aboveGroundMeasure(context,loc, iD.Mapping.aboveGround.OBJECT_PT);

        if(z != null){
            loc[2] = z;
        }else{
            Dialog.alert("未找到对应位置的高程，请重新选择");
            return;
        }
        var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PT);
        if(!layer) return ;
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
            t('modes.add_objectPt.annotation'));

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
