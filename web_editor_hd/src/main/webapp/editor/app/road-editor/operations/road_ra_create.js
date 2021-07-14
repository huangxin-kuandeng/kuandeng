/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 17:59:29
 * @Description: 
 */
/**
 * 道路与道路属性变化点建立关系，一条道路一个点建立关系；
 * 一个点只能有一个R_ROAD_RA，道路不限制
 */
iD.operations.roadRoadAttribute = function(selectedIDs, context) {
	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_ROAD_RA);
	var road, roadAttr;
	
    var operation = function(){
    	var graph = context.graph();
    	
    	var members = [{
            'id': roadAttr.id,
            'modelName':roadAttr.modelName,
            'role': iD.data.RoleType.ROAD_ATTRIBUTE_ID,
            'type':iD.data.GeomType.NODE
        },
        {
            'id': road.id,
            'modelName':road.modelName,
            'role': iD.data.RoleType.ROAD_ID,
            'type':iD.data.GeomType.WAY
        }];
        
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_ROAD_RA,
            members: members,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_ROAD_RA, currentLayer),
            layerId: currentLayer.id
        });

        context.perform(
            iD.actions.AddEntity(relation),
            t('operations.road_ra_create.title'));
    	
    	context.enter(iD.modes.Browse(context));
    };

    operation.available = function(){
        if(selectedIDs.length != 2) return false;
        var graph = context.graph();
        for(var i=0;i<selectedIDs.length;i++)
        {
            var entity=graph.entity(selectedIDs[i]);
            if(entity.modelName == iD.data.DataType.ROAD_ATTRIBUTE){
            	if(roadAttr) return false;
            	else if(graph.parentRelations(entity, iD.data.DataType.R_ROAD_RA).length) return false;
            	roadAttr = entity;
            }else if(entity.modelName == iD.data.DataType.ROAD){
            	if(road) return false;
            	road = entity;
            }else {
            	return false;
            }
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(!modelConfig) return false;
            if(!modelConfig.editable) return false;
        }
        return currentLayer.editable && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.road_ra_create.description');
    };
    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.road_ra_create.title');
    return operation;
}