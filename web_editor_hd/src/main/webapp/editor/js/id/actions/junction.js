/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 18:03:53
 * @Description: 
 */
/**
 * Created by wangtao on 2017/8/31.
 */
iD.actions.junction = function(selectedIDs, context) {
    var wayIds;


    var action = function(graph) {

        var  modelConfig;
        var members = [],entity,i=0,len = selectedIDs.length;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(!modelConfig.editable) continue;
            if(entity.modelName == iD.data.DataType.DIVIDER){
                members.push( {
                    'id': entity.id,
                    'modelName':iD.data.DataType.DIVIDER,
                    'role': iD.data.RoleType.DIVIDER_ID,
                    'type':iD.data.GeomType.WAY
                });
            }else if(entity.modelName == iD.data.DataType.JUNCTION){
                members.push( {
                    'id': entity.id,
                    'modelName':iD.data.DataType.JUNCTION,
                    'role': iD.data.RoleType.JUNCTION_ID,
                    'type':iD.data.GeomType.NODE
                });
            }
        }
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_JUNCTION);
        let relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_JUNCTION,
            members: members,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_JUNCTION, currentLayer),
            layerId: currentLayer.id
        })

        graph = graph.replace(relation);
        return graph;
    };

    action.disabled = function(graph) {
        var modelConfig, entity,
            i=0,len = selectedIDs.length,
            ways = [],junction = [];
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(modelConfig && !modelConfig.editable){
                continue
            }
            if(entity.modelName == iD.data.DataType.DIVIDER ){
                ways.push(entity);
            }else if(entity.modelName == iD.data.DataType.JUNCTION){
                junction.push(entity);
            }
        }

        if(ways.length<2){
            return 'not_eligible';
        }else if(junction.length!=1){
            return 'not_eligible_jnuction'
        }
        let rJunction = graph.parentRelations(junction[0],iD.data.DataType.R_DIVIDER_JUNCTION);
        if(rJunction.length){
            return 'not_eligible_R_jnuction'
        }
    };
    return action;
};
