/**
 * Created by wangtao on 2017/8/31.
 */
iD.actions.deleteDividerOPL = function(selectedIDs, context) {


    var action = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [],ids;
        if(entity.modelName == iD.data.DataType.OBJECT_PL){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_OPL));
        }
        ids = _.pluck(relations, 'id');
        graph = iD.actions.DeleteRelation(ids[0])(graph);
        return graph;
    };

    action.disabled = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [];
        if(entity.modelName == iD.data.DataType.OBJECT_PL){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_OPL));
        }

        if(relations.length==0){
            return 'not_eligible';
        }
    };
    return action;
};
