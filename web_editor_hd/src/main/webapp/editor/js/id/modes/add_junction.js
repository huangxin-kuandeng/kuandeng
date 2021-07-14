/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 16:59:39
 * @Description: 
 */
/**
 * Created by wangtao on 2017/8/30.
 */
iD.modes.AddJunction = function(context) {
    var mode = {
        id: 'add-junction',
        button: 'junction',
        title: t('modes.add_junction.title'),
        description: t('modes.add_junction.description'),
        key: '5'
    };

    var behavior = iD.behavior.Draw(context)
        .tail(t('modes.add_junction.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc) {
    	var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.JUNCTION);
        var layerId = layer.id;
        
        var node = iD.Node({
            members: [],
            identifier:layer.identifier,
            modelName: iD.data.DataType.JUNCTION,
            loc: loc,
            layerId : layerId
        });
        node.setTags(iD.util.getDefauteTags(node, layer));
        // 执行Action，并且history会记录这次动作的记录
        context.perform(
            iD.actions.AddEntity(node),
            t('operations.add.annotation.point'));
		// 选中当前新建的Node
		// 会先退出当前mode，然后进入Select的mode
        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));

        context.event.add({'type' : 'junction', 'entity' : node});
        context.buriedStatistics().merge(0,iD.data.DataType.JUNCTION);
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
        context.buriedStatistics().merge(1,iD.data.DataType.JUNCTION);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
