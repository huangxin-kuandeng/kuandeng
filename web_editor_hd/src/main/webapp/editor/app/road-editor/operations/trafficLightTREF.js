/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 18:00:17
 * @Description: 
 */
/**
 * 创建交通灯组
 */
iD.operations.trafficLightTREF = function(selectedIDs, context) {
	// var layer = context.layers().getLayerByName(iD.data.DataType.TRAFFICLIGHT);
	var selectedEntities = []

    var operation = function() {
        let members = [];
        selectedEntities.forEach(function(entity){
        	members.push({
        	    id: entity.id,
        	    modelName: entity.modelName,
        	    type: iD.data.GeomType.NODE,
        	    role: iD.data.RoleType.TRAFFICLIGHT_ID
        	});
        });
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_TRAFFICLIGHT_TREF);
        let relation = iD.Relation({
        	modelName: iD.data.DataType.R_TRAFFICLIGHT_TREF,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_TRAFFICLIGHT_TREF, currentLayer)
        });
        
        context.perform(iD.actions.AddEntity(relation), t('operations.trafficLightTREF.title'));
        context.enter(iD.modes.Browse(context));
    };
    
    operation.available = function() {
        return false;
    	// if(!layer.editable) return false;
        if(selectedIDs.length < 2) return false;
        var graph = context.graph(), layerids = [], layer;
        
        var isBreak = false;
        selectedIDs.forEach(function (d, i) {
        	if(isBreak){
        		return ;
        	}
            let entity = context.entity(d);
            layer = iD.Layers.getLayer(entity.layerId);
            if (layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
                layerids.push(layer.id)
            } else {
                return false;
            }
            if(entity.modelName == iD.data.DataType.TRAFFICLIGHT){
            	let rels = graph.parentRelations(entity, iD.data.DataType.R_TRAFFICLIGHT_TREF);
            	if(rels && rels.length){
            		isBreak = true;
            	}
            	selectedEntities.push(entity);
            }else {
            	isBreak = true;
            }
        });
        if(!layer.editable) return false;
        if(!layer.isModelEditable(iD.data.DataType.R_TRAFFICLIGHT_TREF)) {
            return false;
        }
        return !isBreak && !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.trafficLightTREF.description');
    };

    operation.id = 'dividerDREF';
    operation.keys = [iD.ui.cmd('T')];
    operation.title = t('operations.trafficLightTREF.title');

    return operation;
};
