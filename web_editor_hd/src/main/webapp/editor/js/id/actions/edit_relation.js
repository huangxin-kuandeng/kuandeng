/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-07-29 15:12:45
 * @Description: 
 */
iD.actions.EditRelation = function (context, editRelatins, deleteRelations) {

    editRelatins = editRelatins || [];
    deleteRelations = deleteRelations || [];

    var action = function (graph) {
        _.forEach(deleteRelations, function (relationId) {
            var relation = graph.entity(relationId.id);

            graph.parentRelations(relation)
                .forEach(function (parent) {
                parent = parent.removeMembersWithID(relationId);
                    graph = graph.replace(parent);

                    if (parent.isDegenerate()) {
                        graph = iD.actions.DeleteRelation(parent.id)(graph);
                    }
                });
            graph = graph.remove(relation);

        });

        _.forEach(editRelatins, function (editRelatin) {
            editRelatin.tags = iD.util.tagExtend.updateTaskTag(editRelatin);
            graph = graph.replace(editRelatin);
        });
        return graph;
    };

    return action;
};
