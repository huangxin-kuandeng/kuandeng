/**
 * Created by TildenDing on 2018/1/17.
 * 路口虚拟车道线半自动生成---使用内切圆方式计算
 */
iD.actions.createdividerVirtualLaneCircle = function (selectedIDs, context) {
    var createdIds = [];

    var action = function (graph) {
        let entitys = [], lines = [], ways = [], len = selectedIDs.length, nodes = [],
            currLayer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId);
            // currLayer = context.layers().getCurrentEnableLayer();
        for (let i = 0; i < len; i++) {
            let entity = context.entity(selectedIDs[i]);

            let way = graph.parentWays(entity);
            ways.push(way);
            //let line1 = [x1, y1, x2, y1];
            var nodeIndex = way[0].nodes.indexOf(selectedIDs[i]);
            var nextNodeId = way[0].nodes[nodeIndex + 1];
            var nextNode = null, prevNode;
            if (nextNodeId) {
                entity._isStart = true;
                nextNode = context.entity(nextNodeId);
            }
            var prevNodeId = way[0].nodes[nodeIndex - 1];
            if (prevNodeId) {
                entity._isStart = false;
                prevNode = context.entity(prevNodeId);
            }
            //获取两点车道线，以计算交点
            var line = nextNode ? [nextNode.loc[0], nextNode.loc[1], entity.loc[0], entity.loc[1]] : prevNode ? [prevNode.loc[0], prevNode.loc[1], entity.loc[0], entity.loc[1]] : [];
            lines.push(line);
            entitys.push(entity);
        }
        let A = entitys[0].loc,
            B = entitys[1].loc;
        //计算延长线交点，以组成三角形
        let P = iD.util.extendIntersection(lines[0], lines[1]);

        let locs = iD.util.getSquareBezier(A, B, P);
        nodes.push(entitys[0].id);
        for (var i = 1; i < locs.length; i++) {
            node = iD.Node({
                layerId: currLayer.id,
                loc: locs[i],
                identifier: currLayer.identifier,
                modelName: iD.data.DataType.DIVIDER_NODE,
                tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, currLayer)
            });
            graph = graph.replace(node);
            nodes.push(node.id);
        }
        nodes.push(entitys[1].id);
        var divider = iD.Way({
            layerId: currLayer.id,
            nodes: nodes,
            identifier: currLayer.identifier,
            modelName: iD.data.DataType.DIVIDER,
            tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER, currLayer)
        });

        graph = graph.replace(divider);
        // 量测信息补充
        graph = iD.actions.createVirtualMeasureinfo(divider)(graph);

        createdIds.push(divider.id);
        return graph;
    };

    action.getCreated = function(){
        return createdIds;
    }

    action.disabled = function (graph) {
        var entity,
            disabled = true,
            i = 0, len = selectedIDs.length;
        if (len > 1) {
            var firstWay = null;
            for (; i < len; i++) {
                entity = context.entity(selectedIDs[i]);
                // layer = entity.layerInfo();
                if (entity.modelName === iD.data.DataType.DIVIDER_NODE/* || entity.modelName == iD.data.DataType.FUSION_DIVIDER_NODE*/) {
                    let way = graph.parentWays(entity)[0];
                    if (!firstWay) {
                        firstWay = way;
                    } else if (firstWay.id != way.id) {
                        let index = way.nodes.indexOf(entity.id);
                        if (index == 0 || index == way.nodes.length - 1) {
                            disabled = false;
                        } else {
                            return 'not_node';
                        }
                    } else {
                        return 'not_node';
                    }
                } else {
                    return 'not_node';
                }
                /*if(){
                 disabled = false;
                 break;
                 }*/
            }
        }
        if (disabled) {
            return 'not_eligible';
        }
    };
    return action;
};