/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 18:08:11
 * @Description: 
 */
/**
 * Created by TildenDing on 2017/12/22.
 * 生成面对象与车道线参考组
 */
iD.actions.createdividerOPG = function(selectedIDs, context) {

    var action = function(graph) {

        var members = [],entity,i=0,len = selectedIDs.length;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(layer && layer.editable && (entity.modelName == iD.data.DataType.DIVIDER || entity.modelName == iD.data.DataType.OBJECT_PG)){
            	if (entity.modelName == iD.data.DataType.DIVIDER) {
            		var role = iD.data.RoleType.DIVIDER_ID
            	} else {
            		var role = iD.data.RoleType.OBJECT_PG_ID
            	}
                members.push( {
                    'id': entity.id,
                    'modelName':entity.modelName,
                    'role': role,
                    'type':iD.data.GeomType.WAY
                });
            }
        }
		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_OPG);
        let relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_OPG,
            members: members,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_OPG, currentLayer),
            layerId: currentLayer.id
        });

        graph = graph.replace(relation);
        return graph;
    };

    action.disabled = function(graph) {
        var layer, entity,
            disabled = true,
            i=0,len = selectedIDs.length,
            dividierRLine;
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(entity.type === iD.data.GeomType.NODE){
                return 'exist_node';
            }
            if(!layer || !layer.editable){
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
            if(entity.modelName == iD.data.DataType.OBJECT_PG
            	// 人行横道
            	&& entity.tags.TYPE == "3" && entity.tags.SUBTYPE == "7"){
                disabled = false;
                continue;
            }
            disabled = true;
            break;
        }
        if(disabled){
            return 'not_eligible';
        }
        
        for(var sid of selectedIDs){
        	if(sid == dividierRLine.id) continue;
        	// 人行横道只能与一个参考线建立关系
        	var relations = graph.parentRelations(graph.entity(sid),iD.data.DataType.R_DIVIDER_OPG);
        	if(relations.length){
        		return 'exist_relation';
        	}
        }
    };
    return action;
};
