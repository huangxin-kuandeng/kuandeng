/*
 * @Author: tao.w
 * @Date: 2020-04-15 14:09:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-10-12 11:08:41
 * @Description: 重度裂缝
 */
iD.modes.AddPavementDistreesLine2 = function (context) {
    var mode = {
        id: 'add-pavementDistreesLine2',
        button: 'pavementDistreesLine2',
        title: '',//t('modes.add_line.title'),
        description: t('modes.add_pavementDistreesLine2.description'),
        key: 'Ctrl+Q',
        enable: true
    };

    var highLightIds = context.selectedIDs();

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', flag);
    }

    context.map().on('drawn.select', selectElements);

    var behavior = iD.behavior.AddWay(context)
        .tail(t('modes.add_pavementDistreesLine2.tail'))
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

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS_PL);
        var wayLayerId = wayLayer.id;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE);
        var nodeLayerId = nodeLayer.id;

        var graph = context.graph(),
            node = iD.Node({
                layerId: nodeLayerId,
                loc: loc,
                identifier: nodeLayer.identifier,
                modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE
            }),
            way = iD.Way({
                identifier: wayLayer.identifier,
                layerId: wayLayerId
            });
        way.modelName = iD.data.DataType.PAVEMENT_DISTRESS_PL;
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        node.setTags(iD.util.getDefauteTags(node, nodeLayer));
        way.mergeTags({ SUBTYPE: "3" });

		iD.logger.editElement({
			'tag': 'add_' + iD.data.DataType.PAVEMENT_DISTRESS_PL + '_start', 
			'entityId':way.osmId() || '',
			'modelName': way.modelName,
			'filter': iD.logger.getFilter(way, context)
		});

        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.PavementDistreesMeasureinfo(node.id),
        );

        // add road envent
        context.event.add({ 'type': iD.data.DataType.PAVEMENT_DISTRESS_PL, 'entity': way });
        context.enter(iD.modes.DrawPavementDistrees1(context, way.id, graph, '', 2));
    }

    function startFromNode(node) {
        start(node.loc);
    }

    function dragMap(e) {
        //console.log("context:"+context)
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1, iD.data.DataType.PAVEMENT_DISTRESS_PL);
        context.install(behavior);
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", true);
		
		iD.UserBehavior.logger({
		    'filter': 'none',
		    'type': 'click',
		    'tag': 'click_add_' + iD.data.DataType.PAVEMENT_DISTRESS_PL,
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


