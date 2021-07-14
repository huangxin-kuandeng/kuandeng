/*
 * @Author: tao.w
 * @Date: 2020-07-21 11:29:59
 * @LastEditors: tao.w
 * @LastEditTime: 2020-07-29 14:17:17
 * @Description: 
 */
// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/DeleteNodeAction.as
iD.actions.DeleteNode = function (nodeId, context) {


    var action = function (graph) {
        var node = graph.entity(nodeId);
        var pWays = graph.parentWays(node);

        var removeParents = [];
        pWays.forEach(function (parent) {
            //设置母库ID
            if (parent.isOneRoadCrossWay()) {
                if (node.isRoadCross()) {
                    graph = iD.actions.DeleteWay(parent.id)(graph);
                }
            } else if (pWays.length == 1 && parent.last() != node.id && parent.first() != node.id) {
                // 形状点
                // 面类型至少三个顶点
                if (parent.isArea && parent.isArea() && parent.nodes.length <= 4) {
                    removeParents.push(parent);
                } else if (parent.nodes.length == 2) {
                    removeParents.push(parent);
                } else {
                    parent = parent.removeNode(node.id);
                    //更新道路形状点删除以后的道路长度
                    parent = iD.util.tagExtend.updateWayLengthTag(graph, parent);
                    parent.tags = iD.util.tagExtend.updateTaskTag(parent);
                    graph = graph.replace(parent);
                }
            } else if (pWays.length == 1 && parent.isArea && parent.isArea()
                && parent.last() == node.id && parent.first() == node.id) {
                // 面类型至少三个顶点
                if (parent.isArea && parent.isArea() && parent.nodes.length <= 4) {
                    removeParents.push(parent);
                } else {
                    graph = graph.replace(parent.removeNode(node.id));
                }
            }
        });

        graph.parentRelations(node)
            .forEach(function (parent) {
                graph = iD.actions.DeleteRelation(parent.id)(graph);
            });

        removeParents
            .forEach(function (parent) {
                graph = iD.actions.DeleteWay(parent.id)(graph);
            });
        return graph.remove(node);
    };

    action.disabled = function () {
        return false;
    };

    return action;
};
