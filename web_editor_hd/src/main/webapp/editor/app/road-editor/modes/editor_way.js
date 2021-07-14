/*
 * @Author: tao.w
 * @Date: 2019-09-26 16:12:55
 * @LastEditors: tao.w
 * @LastEditTime: 2020-10-13 10:25:41
 * @Description: 
 */
/**
 * Created by tao.w on 2016/1/11.
 */
iD.modes.EditorWay = function (context, selectedIDs) {

    var mode = {
        button: 'way_editor',
        id: 'way_editor',
    };

    var keybinding = d3.keybinding('editorway');

    var behaviors = [
        iD.behavior.Hover(context)

        ////iD.behavior.Lasso(context),
        //iD.modes.DragNode(context).behavior
    ];
    var dragbehaviors = iD.modes.DragNode(context).dragWayBehavior;

    mode.selectedIDs = function () {
        return selectedIDs;
    };
    mode.setSelectedIDs = function (_) {
        if (_) {
            selectedIDs = _;
        }
        return selectedIDs;
    };
    function d3_eventCancel() {
        dragbehaviors.node(null);
        d3.event.stopPropagation();
        d3.event.preventDefault();
    }



    mode.enter = function () {
        enter();
    };

    function enter() {
        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }

        context.map().on('drawn.way_editor', selectElements);
        selectElements();
        /*道路点击开启编辑状态*/
        if (selectedIDs.length) {
            let _road = context.hasEntity(selectedIDs[0]);
            iD.logger.editElement({
                'tag': "menu_way_editor",
                'entityId': _road.osmId() || '',
                'modelName': _road.modelName
            });
        }
        function delegate() {
            var target = d3.select(d3.event.target),
                wayID,
                datum = target.datum();
            var dargNode = null;
            if (!datum) {
                return false;
            }
            // var layerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD).id;
            // var roadNodeLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE).id;
            if (datum instanceof iD.Way) {
                let layer = iD.Layers.getLayer(datum.layerId);
                if (!layer.editable) {
                    return false;
                }
                if (datum.id !== selectedIDs[0]) {
                    dargNode = null;
                    d3_eventCancel();
                    return;
                }
                if (datum.isOneRoadCrossWay()) {
                    return false;
                }
                var n1 = context.hasEntity(datum.nodes[0]);
                if (!n1) return false;

                //选择距离当前鼠标点最近的垂直投射距离
                var choice = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection, datum);
                var loc = choice.loc;
                let xyz = iD.util.getPlyZ(context, choice.loc);

                if (xyz != null) {
                    loc[2] = xyz;
                } else {
                    Dialog.alert("当前位置，无法获取高程值！");
                    context.enter(iD.modes.Browse(context))
                    return;
                }

                var node = iD.Node({
                    layerId: datum.layerId,
                    identifier: layer.identifier,
                    loc: loc,
                    modelName: n1.modelName
                });
                node.setTags(iD.util.getDefauteTags(node, layer));
                /*道路添加节点*/
                iD.logger.editElement({
                    'tag': ("add_" + node.modelName),
                    'entityId': node.osmId() || '',
                    'coordinate': node.loc || null,
                    'modelName': node.modelName
                });
                var prev = datum.nodes[choice.index - 1],
                    next = datum.nodes[choice.index];
                dragbehaviors.node(node);
                let actions = [
                    iD.actions.AddMidpoint({ loc: choice.loc, edge: [prev, next] }, node)
                ]
                if ([iD.data.DataType.PAVEMENT_DISTRESS_NODE,iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE].includes(node.modelName)) {
                    actions.push(iD.actions.PavementDistreesMeasureinfo(node.id));
                }
                actions.push(t('operations.add.annotation.vertex'))
                context.perform(
                    ...actions
                );

            } else if (datum instanceof iD.Node) {
                wayID = context.graph().parentWays(datum);
                if (_.indexOf(_.pluck(wayID, 'id'), selectedIDs[0]) == -1 ||
                    datum.modelName === datum.modelName) {
                    dargNode = null;
                    d3_eventCancel();
                } else {
                    dragbehaviors.node(datum);
                }
            }

        }
        context.surface()
            .on('mousedown.way_editor', delegate);
        context.surface()
            .on('click.way_editor', function () {
                var datum = d3.event.target.__data__;
                if (datum == 'undefined' || datum == null) {
                    context.enter(iD.modes.Browse(context));
                }
            })
        context.install(dragbehaviors);
        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });

        keybinding
            .on('⎋', function () {
                context.enter(iD.modes.Browse(context));
            });
        function dele() {
            var wayNodes = _.clone(context.childNodes(context.entity(selectedIDs[0])));
            if (wayNodes.length == 2) return;
            wayNodes.shift();
            wayNodes.pop();
            var node = iD.geo.chooseNode(wayNodes, context.mouse(), context.projection);
            if (context.graph().hasEntity(node.id)) {
                var action = iD.actions.DeleteMultiple([node.id]);
                var annotation = t('operations.delete.annotation.multiple', { n: 1 });
                context.perform(
                    action,
                    annotation);
            }
        }

        keybinding
            .on(iD.ui.cmd('⌦'), dele);
        d3.select(document)
            .call(keybinding);
    }

    mode.exit = function () {
        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });
        context.uninstall(dragbehaviors);
        keybinding.off();
        context.map().on('drawn.way_editor', null);
        context.surface()
            .on('click.way_editor', null)
        var sf = context.surface();
        sf.on('mousedown.way_editor', null)
            .selectAll('.selected')
            .classed('selected', false);

    };
    return mode;
};