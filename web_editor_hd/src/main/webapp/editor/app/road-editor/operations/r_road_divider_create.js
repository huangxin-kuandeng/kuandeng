/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-05-29 14:27:27
 * @Description: 
 */
 
/**
 * @description: 
 * @param {type} 
 * @return: 
 */ 
iD.operations.rRoadDividerCreate = function(selectedIDs, context) {
    var roads = [], dividers = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_ROAD_DIVIDER);

    var operation = function() {
        var actions = [];
        var members = [];
        for (let j = 0; j < dividers.length; j++) {
            var w = dividers[j]
            members.push({
                id: w.id,
                modelName: w.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.DIVIDER_ID
            });
        }
        for (let i = 0; i < roads.length; i++) {
            let road = roads[i];
            members.push({
                id: road.id,
                modelName: road.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.ROAD_ID
            });
        }
        
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_ROAD_DIVIDER,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_ROAD_DIVIDER, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rRoadDivider.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_ROAD_DIVIDER);
    };

    operation.available = function() {
        if(selectedIDs.length < 2) return false;
        let layerFlag = true;
        
        var graph = context.graph(), layer;
        let roadId = '';
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.ROAD) {
                roads.push(entity);
                roadId = entity.id;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.DIVIDER) {
                dividers.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }else {
            	return false;
            }
            if(!layer.editable){
                layerFlag = false;
            }
        }

        if (roads.length != 1 || dividers.length ==0 || !layerFlag) {
            return false;
        }
        
        let isBreak = false;
        let relationTLs = [];
        for (let i =0; i < dividers.length; i++) {
            relationTLs.push(...graph.parentRelations(dividers[i], iD.data.DataType.R_ROAD_DIVIDER));
        }

        for(let i = 0;i<relationTLs.length;i++){
            let r = relationTLs[i];
            let member = r.memberById(roadId);
            if(member){
                isBreak = true;
                break;
            }
        }
        if(isBreak) return false;
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.rRoadDivider.description');
    };

    operation.id = 'rRoadDivider';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.rRoadDivider.title');

    return operation;
};