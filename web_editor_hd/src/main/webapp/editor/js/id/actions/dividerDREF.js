/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 18:04:26
 * @Description: 
 */
/**
 * Created by wangtao on 2017/8/24.
 * 生成车道线参考组
 */
iD.actions.dividerDREF = function(selectedIDs, context) {
    var wayIds;


    var action = function(graph) {

        var modelConfig;
        var members = [],entity,i=0,len = selectedIDs.length;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(modelConfig && modelConfig.editable && entity.modelName == iD.data.DataType.DIVIDER){
                members.push( {
                    'id': entity.id,
                    'modelName':iD.data.DataType.DIVIDER,
                    'role': iD.data.RoleType.DIVIDER_ID,
                    'type':iD.data.GeomType.WAY
                });
            }
        }
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_DREF);
        let relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_DREF,
            members: members,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_DREF, currentLayer),
            layerId: currentLayer.id
        })

		//点击生成车道分割线分组操作时增加埋点
		iD.logger.editElement({
            'tag': 'create_'+relation.modelName,
            'entityId': relation.osmId() || '',
            'modelName': relation.modelName,
            'filter': iD.logger.getFilter(relation, context)
        });
        graph = graph.replace(relation);
        return graph;
    };
    
    return action;
};
