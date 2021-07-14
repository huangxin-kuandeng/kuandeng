/*
 * @Author: tao.w
 * @Date: 2019-12-12 11:24:28
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:28:12
 * @Description: 
 */
iD.modes.AddRectPG = function (context) {
    var mode = {
        id: 'add-rectPG',
        button: 'rectPG',
        title: '',//t('modes.add_area.title'),
        description: t('modes.add_rectPG.description'),
        key: 'Alt+3',
        enable: true
    };

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_rectPG.tail'))
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function start(loc) {
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        }

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);

        var graph = context.graph(),
            node = iD.Node({
                loc: loc,
                layerId: wayLayer.id,
                identifier: wayLayer.identifier,
                modelName: iD.data.DataType.OBJECT_PG_NODE
            }),
            way = iD.Way({
                layerId: wayLayer.id,
                identifier: wayLayer.identifier,
                modelName: iD.data.DataType.OBJECT_PG
            });

        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, wayLayer));

        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        // add way envent
        context.event.add({ 'type': 'area', 'entity': way });

        context.enter(iD.modes.DrawRectPG(context, way.id, graph));
    }

    function startFromWay(loc, edge) {
        start(loc);
    }

    function startFromNode(node) {
        start(node.loc);
    }
	/*
	function defauteTags(way){
    	var defaultTags = {},
    		modelEntity = way.layerInfo().modelEntity(),
    		gtype = modelEntity.getGeoType();
	    modelEntity.getFields(gtype).filter(function(d){
	    	if(d.defaultValue && !_.isEmpty(d.defaultValue)){
	    		defaultTags[d.fieldName] = d.defaultValue;
	        }
	        return false;
	    });
	    return defaultTags;
    }
	*/

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.OBJECT_PG);
        context.install(behavior);
    };

    mode.exit = function () {
        context.uninstall(behavior);
    };

    return mode;
};
