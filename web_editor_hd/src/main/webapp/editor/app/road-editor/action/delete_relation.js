/*
 * @Author: tao.w
 * @Date: 2018-12-17 11:23:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-07-29 14:56:53
 * @Description: 
 */
iD.actions.DeleteRelation = function (relationId) {
    var action = function (graph) {
        var relation = graph.entity(relationId);

        graph.parentRelations(relation)
            .forEach(function (parent) {
                graph = iD.actions.DeleteRelation(parent.id)(graph);
            });

        return graph.remove(relation);
    };

    action.disabled = function (graph) {
        if (!graph.entity(relationId).isComplete(graph))
            return 'incomplete_relation';
    };

    return action;
};
