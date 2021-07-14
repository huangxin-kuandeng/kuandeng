/*
 * @Author: tao.w
 * @Date: 2019-08-30 17:04:00
 * @LastEditors: tao.w
 * @LastEditTime: 2021-06-22 15:12:00
 * @Description: 
 */
/**
 * 移动整体BARRIER坐标
 */
iD.operations.ExpandBarrierGeometry = function(selectedIDs, context) {
    var enterEntity = context.hasEntity(selectedIDs[0]);
    if(!enterEntity) return ;
    // var layerNode, layerWay;
    var wayModelName = iD.data.DataType.BARRIER_GEOMETRY;
    var nodeModelName = iD.data.DataType.BARRIER_GEOMETRY_NODE;
    var selectIsArea = enterEntity.isArea && enterEntity.isArea() || context.graph().parentWays(enterEntity).filter(function(et){
        return et.isArea();
    }).length > 0;
    var selectIsAreaNode = enterEntity.type == iD.data.GeomType.NODE;
    var roadExpandTip;

    var isFirstConfirm = true;
    var action;
    var annotation;
    var selectEntity;
    var protoNodes;
    var createdEntity;
    var operation = function() {
        var enterIsDivider = enterEntity.modelName == iD.data.DataType.DIVIDER;
        roadExpandTip = iD.ui.BarrierOffsetTip(context, {
            value: 30,
            step: 1,
            min: 0,
            title: selectIsArea ? '偏移' : t('operations.expand.offset-barrier'),
            actionCreateType: !selectIsArea,
            actionCreateNew: !selectIsArea,
            actionOffsetLeft: !selectIsArea,
            actionOffsetRight: !selectIsArea,
            enterEntity: enterEntity,
            height: selectIsArea ? 200 : 
                enterIsDivider ? 300 : 
                0
        });

        action = getExpandAction(selectedIDs);

        annotation = t('operations.expand.offset-kerb');
        isFirstConfirm = true;
        protoNodes = context.childNodes(selectEntity);
        //弹出框：用户输入左右两边需要扩展的长度
        var modelMap = {};
        modelMap[wayModelName] = iD.ModelEntitys[wayModelName];
        if(enterIsDivider){
            modelMap[iD.data.DataType.OBJECT_PL] = iD.ModelEntitys[iD.data.DataType.OBJECT_PL];
        }
        roadExpandTip
            .modelEntityMap(modelMap)
            .setDefaultType(selectEntity.modelName == wayModelName ? selectEntity.tags.TYPE : null)
            .perform(d3.select('body'), expandRoad);

        roadExpandTip.on('close.expand_kerb', function(){

        });
        var entity = context.entity(selectedIDs[0]);
        context.buriedStatistics().merge(1,entity.modelName);
    };

    function getExpandAction(ids){
        var locs = [];
        var et = context.entity(ids[0]);
        if(et.nodes && selectIsArea){
            locs = [
                context.entity(et.nodes[0]).loc,
                context.entity(et.nodes[1]).loc
            ];
        }
        if(selectIsAreaNode){
            // 偏移整体面
            ids = [selectEntity.id];
        }
        return iD.actions.ExpandRoad(ids, context.projection, context)
            .graphReplace(false)
            .setAngleBaseLine(selectIsArea ? locs : null)
            .setModelName(wayModelName, nodeModelName);
    }

    //执行道路扩展算法
    var expandRoad = function(userInputParam) {
        var isCreate = userInputParam.createOffsetObject;
        var actions = []; 
        var entityWayModelName = wayModelName;
        var entityNodeModelName = nodeModelName;
        if(userInputParam.createNewModelName){
            entityWayModelName = userInputParam.createNewModelName;
        }
        // OBJECT_PL
        if(entityWayModelName != wayModelName){
            entityNodeModelName = entityWayModelName + '_NODE';
        }
        
        // 面类型根据选择节点统一高度
        if(selectIsAreaNode){
            enterEntity = context.entity(enterEntity.id);
            selectEntity.nodes.forEach(function(nid){
                if(nid == enterEntity.id) return ;
                let node = context.entity(nid);
                if(node.loc[2] === enterEntity.loc[2]) return ;
                let newLoc = [
                    node.loc[0],
                    node.loc[1],
                    enterEntity.loc[2]
                ];
                actions.push(iD.actions.MoveNode(nid, newLoc));
            });
        }

        // 选择车道线时，可以复制出BARRIER、OBJECT_PL
        var isDivider = (selectEntity.modelName == iD.data.DataType.DIVIDER && selectEntity.modelName == entityWayModelName);
        // var isDivider = selectEntity.modelName == iD.data.DataType.DIVIDER;
        var createdEntityChanged = isCreate && createdEntity && createdEntity.modelName != entityWayModelName;
        if((!isCreate && createdEntity) || createdEntityChanged){
            let removeId = createdEntity.id;
            actions = [(function(graph){
                return iD.actions.DeleteWay(removeId)(graph);
            })];
            createdEntity = null;
        }
        if(!isCreate && !createdEntity){
            createdEntity = null;
            protoNodes = context.childNodes(selectEntity);
            action = getExpandAction([selectEntity.id]);
            actions.push(action);
        }else if(isCreate && !createdEntity){
            let way = selectEntity;
            let wayLayerId;
            let nodeLayerId;
            if(isDivider){
                // wayLayerId = layerWay.id;
                // nodeLayerId = layerNode.id;
                let lay1 = iD.Layers.getCurrentModelEnableLayer(entityWayModelName);
                let lay2 = iD.Layers.getCurrentModelEnableLayer(entityNodeModelName);
                if(!lay1 || !lay2) {
                    Dialog.alert(entityWayModelName + '所属图层不可编辑');
                    return ;
                }
                wayLayerId = lay1.id;
                nodeLayerId = lay2.id;
            }
            if(createdEntityChanged){
                protoNodes = context.childNodes(selectEntity);
                action = getExpandAction([selectEntity.id]);
            }
            var obj = action(context.graph());
            actions.push(function(graph){
                let newNodes = [];
                let newNodeIds = [];

                protoNodes.forEach(function(node){
                    let lid = nodeLayerId || node.layerId;
                    let layer = iD.Layers.getLayer(lid);
                    let n = iD.Node({
                        layerId: lid,
                        identifier:layer.identifier,
                        modelName: entityNodeModelName,
                        loc: _.clone(node.loc)
                    });
                    if(isDivider){
                        n.setTags(_.clone(node.tags));
                    }else {
                        n.setTags(iD.util.getDefauteTags(n, entityNodeModelName));
                    }
                    newNodes.push(n);

                    newNodeIds.push(n.id);
                    graph = graph.replace(n);
                });
                let lId = wayLayerId || way.layerId;
                let layer = iD.Layers.getLayer(lId);
                createdEntity = iD.Way({
                    layerId: lId,
                    identifier:layer.identifier,
                    modelName: entityWayModelName,
                    nodes: newNodeIds
                });
                if(isDivider){
                    createdEntity.setTags(_.clone(way.tags));
                }else {
                    createdEntity.setTags(iD.util.getDefauteTags(createdEntity, entityWayModelName));
                }
                graph = graph.replace(createdEntity);
                protoNodes = newNodes;

                if(userInputParam.newTags){
                    graph = iD.actions.ChangeTags(createdEntity.id, userInputParam.newTags)(graph);
                    createdEntity = graph.entity(createdEntity.id);
                }
                return graph;
            });
            actions.push(action);
        }else {
            actions.push(action);
        }
        
        // 新BARRIER设置TYPE
        if(userInputParam.newTags && isCreate && createdEntity){
            actions.push(iD.actions.ChangeTags(createdEntity.id, userInputParam.newTags));
        }

        actions.forEach(function(d){
            d.setUserInputParam && d.setUserInputParam(userInputParam);
        });
        // setAngleBaseLine();
        // if (!userInputParam.originalRoadTag) {
        //     context.enter(iD.modes.Browse(context));
        // }
        // var oldAnnotation = context.history().undoAnnotation();
        // if(!isFirstConfirm && oldAnnotation == annotation){
        //     context.undo()
        // }
        context.perform(...actions, function(graph){
            var actionResult = action.getResult();
            if(!actionResult || !actionResult.all.length) return graph;
            let way = actionResult.all[0];
            let nodes = actionResult.nodes[way.id];
            // 激光线不更新量测信息；
            nodes.forEach(function(d, i){
                graph = iD.actions.MoveNode(protoNodes[i].id, d.loc)(graph);
            });
            return graph;
        }, annotation);

        context.event.entityedite({
            entitys: createdEntity ? [createdEntity.id] : [selectEntity.id]
        });

        if(isFirstConfirm){
            isFirstConfirm = false;
        }
        if(isCreate && createdEntity){
            action = getExpandAction([createdEntity.id]);
        }
    };

    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        var entity = context.entity(selectedIDs[0]);
        if (![
            wayModelName,
            iD.data.DataType.DIVIDER,
            iD.data.DataType.OBJECT_PL,
            iD.data.DataType.ROAD_FACILITIES_NODE
        ].includes(entity.modelName)) {
            return false;
        }
        if(!entity.layerId) return false;
        let layer = iD.Layers.getLayerById(entity.layerId);
		let modelConfig = (layer && layer.models) ? layer.models[entity.modelName] : null;
        if(!modelConfig || !modelConfig.editable) return false;
        if(!selectIsArea){
            var layer1 = iD.Layers.getCurrentModelEnableLayer(wayModelName);
            var layer2 = iD.Layers.getCurrentModelEnableLayer(nodeModelName);
            if(!layer1 || !layer2){
                return false;
            }
        }else {
            var layer1 = iD.Layers.getCurrentModelEnableLayer(entity.modelName);
            if(!layer1){
                return false;
            }
        }

        layerWay = layer1;
        layerNode = layer2;
        if(selectIsAreaNode){
            selectEntity = context.graph().parentWays(enterEntity)[0];
        }else {
            selectEntity = entity;
        }

        return !operation.disabled();
    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        return t('operations.expand.title-offset-barrier');
    };

    operation.id = 'expand';
    operation.keys = [iD.ui.cmd('K')];
    operation.title =t('operations.expand.title-offset-barrier');

    return operation;
}