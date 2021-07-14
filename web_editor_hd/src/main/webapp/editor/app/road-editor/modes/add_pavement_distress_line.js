/*
 * @Author: tao.w
 * @Date: 2020-04-15 13:10:52
 * @LastEditors: tao.w
 * @LastEditTime: 2021-03-04 17:05:10
 * @Description: 
 */

iD.modes.AddPavementDistreesLine = function (context,opts = null) {
    var mode = {
        id: opts ?opts.id : 'add-pavementDistreesLine',
        button: opts ?opts.button : 'pavementDistreesLine',
        iconText: opts ?opts.iconText : '',
        title: opts ?opts.title :  '',//t('modes.add_line.title'),
        description: opts ?opts.description :  t('modes.add_pavementDistreesLine.description'),
        key: opts ?opts.key : 'Ctrl+Q',
        enable: opts ?opts.enable :  true
    };

    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_pavementDistreesLine.tail'))
        .on('start', start)
        .on('startFromWay', start)
        .on('startFromNode', startFromNode)
        .on('dragend', dragMap);

    function start(loc) {
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            context.enter(iD.modes.Browse(context))
            return;
        }
		
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS);
        var wayLayerId = wayLayer.id;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS_NODE);
        var nodeLayerId = nodeLayer.id;

        var graph = context.graph(),
            node = iD.Node({
                layerId: nodeLayerId,
                loc: loc,
                identifier: nodeLayer.identifier,
                modelName: iD.data.DataType.PAVEMENT_DISTRESS_NODE
            }),
            way = iD.Way({
                identifier: wayLayer.identifier,
                layerId: wayLayerId
            });
        way.modelName = iD.data.DataType.PAVEMENT_DISTRESS;

        let wayTags = iD.util.getDefauteTags(way, wayLayer);
        if(opts && opts.opts){
            Object.assign(wayTags,opts.opts);
        }
        way.setTags(wayTags);
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
		
		iD.logger.editElement({
			'tag': 'add_' + iD.data.DataType.PAVEMENT_DISTRESS + '_start', 
			'entityId':way.osmId() || '',
			'modelName': way.modelName,
			'filter': iD.logger.getFilter(way, context)
		});
		
        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.PavementDistreesMeasureinfo(node.id),
        );

        // add road envent
        context.event.add({ 'type': iD.data.DataType.PAVEMENT_DISTRESS, 'entity': way });
        context.enter(iD.modes.DrawPavementDistrees(context, way.id, graph, ''));
    }

    function startFromNode(node) {
        start(node.loc);
    }

    function dragMap(e) {
        //console.log("context:"+context)
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.PAVEMENT_DISTRESS);
        context.install(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", true);
		
        iD.UserBehavior.logger({
            'filter': 'none',
            'type': 'click',
            'tag': 'click_add_' + iD.data.DataType.PAVEMENT_DISTRESS,
            'desc': '激活'
        });
    };

    mode.exit = function () {
        selectElements(true);
        context.uninstall(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", false);
    };

    return mode;
};


