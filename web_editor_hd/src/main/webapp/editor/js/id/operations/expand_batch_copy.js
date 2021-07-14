/*
 * @Author: tao.w
 * @Date: 2019-08-30 17:04:00
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-14 10:30:48
 * @Description: 批量平移
 */

iD.operations.ExpandBatchCopy = function (selectedIDs, context) {
    let selectEntitys = [];
    let expandEntitys = []; //[{delta:{l,h},entitys:[]},{delta:{l,h},entitys:[]}]
    var delta = {
        horizontal: 0,
        height: 0
    };
    let mapping = [],
        referenceLine = [];
    if (!selectedIDs || !selectedIDs.length) return;
    // var layerNode, layerWay;
    var roadExpandTip;
    var wayModelName = iD.data.DataType.BARRIER_GEOMETRY;
    var nodeModelName = iD.data.DataType.BARRIER_GEOMETRY_NODE;
    let orginalNodes = [];

    const selectModelName = [
        iD.data.DataType.TRAFFICSIGN,
        iD.data.DataType.TRAFFICLIGHT,
        iD.data.DataType.ROAD_FACILITIES,
        iD.data.DataType.OBJECT_PL,
        iD.data.DataType.OBJECT_PG,
        iD.data.DataType.DIVIDER,
        iD.data.DataType.BARRIER_GEOMETRY
    ];
    var selectFilterIds = [];
    var protoNodes = [];
    var createdCopyEntity = [];
    var currentPoints = {};

    function reset() {

    }

    function getRectangle() {
        let _extent = iD.geo.Extent();
        let locs = [];
        for (let i = 0; i < selectEntitys.length; i++) {
            let _locs = _.pluck(context.graph().childNodes(selectEntitys[i]),'loc');
            locs.push(..._locs);
            // let ext = selectEntitys[i].extent(context.graph());
            // _extent = _extent.extend(ext);
        }
        // return _extent.polygon();
        let rect =  iD.util.getRotaingCalipersRectLocs(locs).map(function(d){
            return [d.x, d.y, d.z];
        });
        return rect;
    }

    function initMapping() {
        let _ids2NewNode = {};
        let way, nodes, actions = [],
            newWay;
        // let actions = [];
        for (let i = 0; i < selectEntitys.length; i++) {
            way = selectEntitys[i];
            nodes = context.graph().childNodes(way);
            let newIds = [];
            orginalNodes = orginalNodes.concat(nodes);
            let lay1 = iD.Layers.getLayer(way.layerId);
            nodes.forEach(node => {
                let nodeId = _ids2NewNode[node.id];
                if(!nodeId){
                    let n = iD.Node({
                        layerId: node.layerId,
                        identifier: lay1.identifier,
                        modelName: node.modelName,
                        loc: _.clone(node.loc),
                        tags: nodes.tags
                    });
                    nodeId = n.id;
                    n.mergeTags(iD.util.tagExtend.updateTaskTag(n))
                    _ids2NewNode[node.id] = nodeId;
                    actions.push(iD.actions.AddEntity(n));
                }
               
                newIds.push(nodeId);
            })
            newWay = iD.Way({
                modelName: way.modelName,
                layerId: way.layerId,
                identifier:lay1.identifier,
                nodes: newIds,
                tags: way.tags
            });
            newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
            actions.push(iD.actions.AddEntity(newWay));
        }
        mapping.push({
            i: 1,
            nodeMapping: _ids2NewNode
        });
        // actions.push('批量平移');
        return actions;
    }


    var operation = function () {
        return false;
        var selectType = false;
        let polygon = getRectangle();
        referenceLine = [polygon[0], polygon[1]];
        // selectFilterIds.forEach(function (d, i) {
        //     var index = i;
        //     var enterEntity = context.hasEntity(d);
        //     var selectIsAreaNode = enterEntity.type == iD.data.GeomType.NODE;
        //     var selectEntity = enterEntity;
        //     var selectIsArea = enterEntity.isArea && enterEntity.isArea() || context.graph().parentWays(enterEntity).filter(function (et) {
        //         return et.isArea();
        //     }).length > 0;
        //     if (selectIsAreaNode) {
        //         selectEntity = context.graph().parentWays(enterEntity)[0];
        //         if (!selectEntity) return;
        //     }

        //     for (let s = 0; s < selectEntity.nodes.length; s++) {
        //         let nodeId = selectEntity.nodes[s];
        //         if (!currentPoints[nodeId]) {
        //             currentPoints[nodeId] = 0;
        //         }
        //         currentPoints[nodeId]++;
        //     }

        //     selectType = true;
        //     action[index] = getExpandAction(selectEntity.id, selectIsArea, selectIsAreaNode);
        //     protoNodes[index] = context.childNodes(selectEntity);
        //     createdCopyEntity[index] = [];
        // })

        // if (!selectType) {
        //     return
        // }

        roadExpandTip = iD.ui.BatchOffsetTip(context, {
            value: 30,
            step: 1,
            min: 0,
            title: '批量复制',
            actionCreateType: true,
            actionCreateNew: true,
            actionOffsetLeft: true,
            actionOffsetRight: true,
            enterEntity: selectedIDs,
            height: 300
        });

        annotation = t('operations.expand.batch-copy');

        roadExpandTip
            .perform(d3.select('body'), expandRoad, setActions);

    };

    function getExpandAction(ids, selectIsArea, selectIsAreaNode) {
        var locs = [];
        var et = context.entity(ids);
        if (et.nodes && selectIsArea) {
            locs = [
                context.entity(et.nodes[0]).loc,
                context.entity(et.nodes[1]).loc
            ];
        }
        if (selectIsAreaNode) {
            // 偏移整体面
            // ids = selectEntity.id;
        }
        return iD.actions.ExpandRoad([ids], context.projection, context)
            .graphReplace(false)
            .setAngleBaseLine(selectIsArea ? locs : null)
            .setModelName(wayModelName, nodeModelName);
    }

    // 生成次数不为1时,重新变化当前action
    var setActions = function (num) {
        return;
        var createNum = num - 0;
        var selectedLength = selectFilterIds.length;
        for (let n = 0; n < createNum; n++) {
            selectFilterIds.forEach(function (d, i) {

                var createIndex = selectedLength * n + i;

                var enterEntity = context.hasEntity(d);
                var selectIsAreaNode = enterEntity.type == iD.data.GeomType.NODE;
                var selectEntity = enterEntity;
                var selectIsArea = enterEntity.isArea && enterEntity.isArea() || context.graph().parentWays(enterEntity).filter(function (et) {
                    return et.isArea();
                }).length > 0;

                if (selectIsAreaNode) {
                    selectEntity = context.graph().parentWays(enterEntity)[0];
                    if (!selectEntity) return;
                }
                action[createIndex] = getExpandAction(selectEntity.id, selectIsArea, selectIsAreaNode);
                protoNodes[createIndex] = context.childNodes(selectEntity);
                createdCopyEntity[createIndex] = [];
            })
        }
        createdEntity = [];
    }

    //执行道路扩展算法
    var expandRoad = function (userInputParam) {

        // var isCreate = userInputParam.createOffsetNumber;
        // var isCreateNum = isCreate - 0;
        // var createdEntityAction = {};
        // var selectedLength = selectFilterIds.length;
        // action = [];
        // protoNodes = {};
        var setzone = iD.Task.d.tags.utm.zone;
        if (userInputParam.right != '') {
            delta.horizontal -= userInputParam.right;
        } else if (userInputParam.left != '') {
            delta.horizontal += userInputParam.left;
        }
        var locs = referenceLine.map(d => {
            let u = iD.util.LLtoUTM_(...d);
            return [u.x, u.y];
        })
        let actions = [];
        var deltaX = 0;
        var deltaY = 0;
        
        if(delta.horizontal !=0 ){
            locs = iD.util.RoadOffset().plineOffset(locs, delta.horizontal, 1).flat();
            let ll = iD.util.UTMtoLL_(locs[1][0], locs[1][1], setzone);
            deltaX = ll[0] - referenceLine[1][0];
            deltaY = ll[1] - referenceLine[1][1];
        }
        if (!mapping.length) {
            actions = initMapping();
        }
        

        for (let i = 0; i < mapping.length; i++) {
            let _obj = mapping[i];
            let _nodeMapping = _obj.nodeMapping;
            for (let j = 0; j < orginalNodes.length; j++) {
                let _n = orginalNodes[j];
                let loc = [_n.loc[0] + deltaX, _n.loc[1] + deltaY, _n.loc[2]];
                actions.push(iD.actions.MoveNode(_nodeMapping[_n.id], loc));
            }
        }


        // for (let i = 0; i < selectEntitys.length; i++) {
        //     way = selectEntitys[i];
        //     nodes = context.graph().childNodes(way);
        //     let locs = _.pluck(nodes, 'loc').map(d=>{
        //         let u = iD.util.LLtoUTM_(...d);
        //         return [u.x,u.y,d[2]];
        //     })
        //     let newLocs = iD.util.RoadOffset().plineOffset(locs, delta.horizontal)[0];
        //     newLocs = newLocs.map(d=>{
        //         let u =  iD.util.UTMtoLL_(d[0],d[1],50);
        //         return [...u,d[2]] 
        //     })
        //     for (let j = 0; j < nodes.length; j++) {
        //         let _n = nodes[j];
        //         actions.push(iD.actions.MoveNode(_n.id, newLocs[j]));
        //     }

        // }
        actions.push('一次偏移')
        context.perform.apply(this, actions);
    };

    operation.available = function () {
        // return false;
        selectEntitys = [];
        if (!selectedIDs.length || selectedIDs.length < 2) {
            return false;
        }
        selectFilterIds = [];
        selectedIDs.forEach(function (d, i) {
            let enterEntity = context.hasEntity(d);
            let entityModelName = enterEntity.modelName;

            if (selectModelName.includes(entityModelName)) {
                selectFilterIds.push(d);
                selectEntitys.push(enterEntity);
            }
        })
        // if (!selectFilterIds.length || selectFilterIds.length < 2) {
        //     return false;
        // }
        return !operation.disabled();
    };
    operation.disabled = function () {
        return false;
    };
    operation.tooltip = function () {
        return t('operations.expand.title-batch-copy');
    };

    operation.id = 'expand';
    operation.keys = [iD.ui.cmd('K')];
    operation.title = t('operations.expand.title-batch-copy');

    return operation;
}