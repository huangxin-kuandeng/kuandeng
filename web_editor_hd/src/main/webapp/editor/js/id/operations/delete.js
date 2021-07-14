/**
 * 选中entity后出现的菜单中的删除按钮
 * @param {Object} selectedIDs
 * @param {Object} context
 */
iD.operations.Delete = function (selectedIDs, context) {
    var action = iD.actions.DeleteMultiple(selectedIDs, context);
    var unDeleteModels = [
        iD.data.DataType.AUTO_NETWORK_TAG,
        iD.data.DataType.HD_LANE
    ];

    //判断删除道路的首尾结点是不是删除以后综合交叉点内部综合结点的连通性
    function isUnicomInnerMember(nodeID, way, context) {
        var crossNodeAId = iD.TopoEntity().isInCrossNode(context.graph(), nodeID);
        let topoEntity = iD.TopoEntity();
        let members = topoEntity.getCrossNodeMembers(context.graph(), crossNodeAId);
        //      var members = context.graph().entity(crossNodeAId).members;
        var nodesArr = [];
        members.forEach(function (member) {
            nodesArr.push(member.id);
        })
        if (!(nodesArr.indexOf(way.first()) > -1 && nodesArr.indexOf(way.last()) > -1)) {
            return true;
        }
        var index = nodesArr.indexOf(nodeID);
        nodesArr.splice(index, 1);
        var node1 = context.graph().entity(nodeID);
        //如果剩余的结点是连通的的情况下，判断删除的结点与其他结点除了待删除的道路是否还有其他联通的
        if (iD.util.roadCrossExtend.isUnicomOfArr(nodesArr, context)) {
            for (var j = 0; j < nodesArr.length; j++) {
                var ways = iD.util.roadCrossExtend.unicomWaysBetweenTwoNodes(node1, context.graph().entity(nodesArr[j]), context);
                //只有一条连通道路，并且这条路不是被删除的道路
                if (ways.length == 1 && ways[0] != way) {
                    return true;
                } else if (ways.length > 1) {
                    return true;
                }
            }
        }

        return false;
    }

    function isDeleteWay(way) {
        let firstnodeid = way.first();
        let lastnodeid = way.last();
        var num1 = iD.TopoEntity().getRoadIsInCrossParentWaysNum(context.graph().entity(firstnodeid), context.graph());
        var num = iD.TopoEntity().getRoadIsInCrossParentWaysNum(context.graph().entity(lastnodeid), context.graph());

        if (0 != num1) {
            if (!isUnicomInnerMember(firstnodeid, way, context)) {
                Dialog.alert('删除道路导致被综合的结点间道路不连通，不能执行该编辑');
                return false;
            }
            if (num1 == 2) {
                Dialog.alert(iD.alert.tip.operation_create_fake_node_in_crossnode, function () {
                    context.enter(iD.modes.Select(context, [firstnodeid]).suppressMenu(true));
                });
                return false;
            }
        }
        if (0 != num) {
            if (!isUnicomInnerMember(lastnodeid, way, context)) {
                Dialog.alert('删除道路导致被综合的结点间道路不连通，不能执行该编辑');
                return false;
            }

            if (num == 2) {
                Dialog.alert(iD.alert.tip.operation_create_fake_node_in_crossnode, function () {
                    context.enter(iD.modes.Select(context, [lastnodeid]).suppressMenu(true));
                });
                return false;
            }
        }
        return true;
    };



    var operation = function () {
        // 框选要素后，再次框选取消选择，没有要素时快捷键Delete删除会进入
        if (!selectedIDs || !selectedIDs.length) return;
        var annotation;
        let extraActions = [];
        for (var i = 0; i < selectedIDs.length; i++) {
            if (context.entity(selectedIDs[i]) instanceof iD.Way)//
            {
                if (!isDeleteWay(context.entity(selectedIDs[i]))) {
                    return;
                }
            }
            let node = context.entity(selectedIDs[i]);
            let _modelName = node.modelName || '';
            iD.logger.editElement({
                'tag': 'menu_delete',
                'entityId': node.osmId() || '',
                'modelName': _modelName,
                'filter': iD.logger.getFilter(node, context)
            }); //点击删除操作时增加埋点
        }
        if (selectedIDs.length > 1) {
            annotation = t('operations.delete.annotation.multiple', { n: selectedIDs.length });

        } else {
            var id = selectedIDs[0],
                geometry = context.geometry(id);

            annotation = t('operations.delete.annotation.' + geometry);
        }
        context.enter(iD.modes.Browse(context));

        context.event['before_delete'] && context.event['before_delete']({ selectedIDs });

        let en = context.entity(selectedIDs[0]);
        let _name = en.modelName;
        if (en instanceof iD.Node) {
            let _ways = context.graph().parentWays(en);
            if (_ways.length > 0) {
                _name = _ways[0].modelName;
            }
        }
        context.buriedStatistics().merge(1, _name, 1000);
        context.perform(
            action,
            annotation);
        if (extraActions.length) {
            context.replace.apply(context, extraActions.concat(annotation));
        }
        context.event['delete'] && context.event['delete']({ selectedIDs });
    };


    operation.available = function () {
        // 组网标记禁止删除；
        var isBreak = false;
        var dataType = iD.data.DataType;
        for (var sid of selectedIDs) {
            var entity = context.hasEntity(sid);
            if (entity && unDeleteModels.includes(entity.modelName)) {
                isBreak = true;
                break;
            }
        }
        if (isBreak) return false;

        //return true;
        var flag = true;
        // 只有前方交会点时，可以删除前方交会
        var onlyPlaceName = true;
        if (!(iD.Task.working && iD.Task.working.task_id == iD.Task.d.task_id)) return false;

        for (let eid of selectedIDs) {
            var entity = context.entity(eid);
            if (onlyPlaceName && entity.isPlaceName && entity.isPlaceName()) {
                continue;
            }
            onlyPlaceName = false;

            context.graph().parentWays(entity).forEach(function (way) {
                if (!way.modelName) {//过滤modelname不存在的数据
                    return;
                } else {
                    // 路牌、交通灯，不限制起点/终点删除
                    if ([
                        dataType.TRAFFICSIGN,
                        dataType.TRAFFICLIGHT
                    ].includes(way.modelName)) {
                        return flag = true;
                    }
                    //判断起终点是否与选中点ID相同，相同则不弹出删除按钮
                    if (way.first() == entity.id || way.last() == entity.id) {
                        return flag = false;
                    }
                }
            });
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!modelConfig || !modelConfig.editable) {
                flag = false;
            }
            // 
            if (entity && entity.modelName == dataType.QUALITY_TAG
                && (!iD.User.isEditCheckSystemAndRole())) {
                flag = false;
            }
            if (!flag) {
                break;
            }
        }

        //     	return flag && !operation.disabled();
        return onlyPlaceName || flag;
    };

    operation.disabled = function () {
        return action.disabled(context.graph());
    };

    operation.tooltip = function () {
        var disable = operation.disabled();
        return disable ?
            t('operations.delete.' + disable) :
            t('operations.delete.description');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('⌘⌫'), iD.ui.cmd('⌘⌦'), iD.ui.cmd('⌦')];
    operation.title = t('operations.delete.title');

    return operation;
};




iD.overoperations.Delete = function (selected, context) {

    var operation = function () {
        if (selected.vertices == 'v') {
            var parent = context.map().getOverlays(selected.parent);
            if (parent.length == 1) {
                parent = parent[0];
                var nodes = parent.nodes;
                if (nodes.length == 2 || (nodes.length === 4 && parent.type === 'polygon'))
                    context.map().removeOverlays(parent);
                else {
                    if (parent.type === 'polygon' && (parent.first() == selected || parent.last() == selected)) {
                        nodes.splice(0, 1);
                        nodes.splice(nodes.length - 1, 1);
                        nodes.push(nodes[0]);
                    } else {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id == selected.id) {
                                nodes.splice(i, 1);
                                continue;
                            }
                        }
                    }
                }
            }
            context.map().drawOverlayers();
        } else {
            context.map().removeOverlays(selected);
            context.map().drawOverlayers();
        }
    };

    operation.available = function () {
        if (!selected.editable) return false;
        return (selected.vertices == 'm') ? false : true;
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        var disable = operation.disabled();
        return disable ?
            t('operations.delete.' + disable) :
            t('operations.delete.description');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('⌘⌫'), iD.ui.cmd('⌘⌦')];
    operation.title = t('operations.delete.title');


    return operation;
};

