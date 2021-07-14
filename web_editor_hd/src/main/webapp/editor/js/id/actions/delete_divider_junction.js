/**
 * Created by wangtao on 2017/8/31.
 */
iD.actions.deleteDividerJunction = function(selectedIDs, context) {


    var action = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [],ids;
        if(entity.modelName == iD.data.DataType.JUNCTION){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_JUNCTION));
        }
        ids = _.pluck(relations, 'id');
        graph = iD.actions.DeleteRelation(ids[0])(graph);
        return graph;
    };

    action.disabled = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [];
        if(entity.modelName == iD.data.DataType.JUNCTION){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_JUNCTION));
        }

        if(relations.length==0){
            return 'not_eligible';
        }
    };
    return action;
};
