/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 18:07:15
 * @Description: 
 */
/**
 * Created by TildenDing on 2017/12/15.
 * 生成辅助线与车道线参考组
 */
iD.actions.createdividerOPL = function(selectedIDs, context) {

    var action = function(graph) {

       
        var members = [],entity,i=0,len = selectedIDs.length;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(modelConfig && modelConfig.editable && (entity.modelName == iD.data.DataType.DIVIDER || entity.modelName == iD.data.DataType.OBJECT_PL)){
            	if (entity.modelName == iD.data.DataType.DIVIDER) {
            		var role = iD.data.RoleType.DIVIDER_ID
            	} else {
            		var role = iD.data.RoleType.OBJECT_PL_ID
            	}
                members.push( {
                    'id': entity.id,
                    'modelName':entity.modelName,
                    'role': role,
                    'type':iD.data.GeomType.WAY
                });
            }
        }
		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_OPL);
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_OPL,
            identifier:currentLayer.identifier,
            members: members,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_OPL, currentLayer),
            layerId: currentLayer.id
        });

        graph = graph.replace(relation);
        return graph;
    };

    action.disabled = function(graph) {
        var modelConfig, entity, layer,
            disabled = true,
            i=0,len = selectedIDs.length,
            dividierRLine;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            layer = iD.Layers.getLayer(entity.layerId);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(entity.type === iD.data.GeomType.NODE){
                return 'exist_node';
            }
            if(!modelConfig || !modelConfig.editable){
            	disabled = true;
            	break;
            }
            if(entity.modelName == iD.data.DataType.DIVIDER && entity.tags.R_LINE == '1'){
            	if(dividierRLine){
            		disabled = true;
            		break;
            	}
                disabled = false;
                dividierRLine = entity;
                continue;
            }
            if(entity.modelName == iD.data.DataType.OBJECT_PL
            	// 停止让行线
            	&& entity.tags.TYPE == "2" && ["1", "2", "3", 1, 2, 3].includes(entity.tags.SUBTYPE)){
                disabled = false;
                continue;
            }
            disabled = true;
            break;
        }

        if (!layer.isModelEditable(iD.data.DataType.R_DIVIDER_OPL)) {
            disabled = true;
        }

        if(disabled){
            return 'not_eligible';
        }

        for(var sid of selectedIDs){
        	if(sid == dividierRLine.id) continue;
        	// 停止线只能与一个参考线建立关系
        	var relations = graph.parentRelations(graph.entity(sid),iD.data.DataType.R_DIVIDER_OPL);
        	if(relations.length){
        		return 'exist_relation';
        	}
        }
    };
    return action;
};
