/**
 * Created by TildenDing on 2017/12/22.
 */
iD.actions.deleteDividerOPG = function(selectedIDs, context) {


    var action = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [],ids;
        if(entity.modelName == iD.data.DataType.OBJECT_PG){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_OPG));
        }
        ids = _.pluck(relations, 'id');
        graph = iD.actions.DeleteRelation(ids[0])(graph);
        return graph;
    };

    action.disabled = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [];
        if(entity.modelName == iD.data.DataType.OBJECT_PG){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_OPG));
        }

        if(relations.length==0){
            return 'not_eligible';
        }
    };
    return action;
};
