/**
 * 创建 交通灯/车道线  关联关系
 * 条件：
 * 1、一个交通等与至少两条车道线，可建；
 * 2、一个带关系交通灯，与多条车道线，其中的车道线有与关系中的member重复的车道线时，禁止；
 */
iD.operations.dividerTrafficLightTREF = function(selectedIDs, context) {
    var selectedLight;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_TL);
    var ways = [];

    var operation = function() {
    	var actions = [];
    	var members = [{
            id: selectedLight.id,
            modelName: selectedLight.modelName,
            type: iD.data.GeomType.WAY,
            role: iD.data.RoleType.TRAFFICLIGHT_ID
        }];
        for (var i =0; i < ways.length; i++) {
            var way = ways[i];
            members.push({
                id: way.id,
                modelName: way.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.DIVIDER_ID
            });
        }
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_TL,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_TL, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.dividerTrafficLightTREF.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_TL);
    };

    operation.available = function() {
        if(selectedIDs.length < 3) return false;
        
        var graph = context.graph(), layer, layer2;
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.TRAFFICLIGHT) {
            	if(selectedLight) return false;
                selectedLight = entity;
                layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.DIVIDER) {
                ways.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }else {
            	return false;
            }
        }
        if (!selectedLight || ways.length < 2) return false;
        
        var isBreak = false;
        var relationTLs = graph.parentRelations(selectedLight, iD.data.DataType.R_DIVIDER_TL);
        var selectWayIds = _.pluck(ways, 'id');
        relationTLs.forEach(function(relation){
        	if(isBreak) return ;
        	for(var m of relation.members){
        		if(selectWayIds.indexOf(m.id) > -1){
        			isBreak = true;
        			break;
        		}
        	}
        });
        if(isBreak) return false;

        var layer3 = iD.Layers.getLayer(currentLayer.id, iD.data.DataType.R_DIVIDER_TL);
        if (!layer || !layer2 || !layer3) {
            return false;
        }
        if (!layer.editable || !layer2.editable || !layer3.editable) {
            return false;
        }
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.dividerTrafficLightTREF.description');
    };

    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('M')];
    operation.title = t('operations.dividerTrafficLightTREF.title');

    return operation;
};