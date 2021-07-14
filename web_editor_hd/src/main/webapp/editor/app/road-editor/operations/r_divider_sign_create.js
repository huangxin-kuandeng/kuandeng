/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 20:35:44
 * @Description: 
 */
 
/**
 * @description: 
 * @param {type} 
 * @return: 
 */ 
iD.operations.rDividerSignCreate = function(selectedIDs, context) {
    var sings = [], dividers = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_SIGN);

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
        for (let i = 0; i < sings.length; i++) {
            let sign = sings[i];
            members.push({
                id: sign.id,
                modelName: sign.modelName,
                type: iD.data.GeomType.WAY,
                role: 'SIGN_ID'
            });
        }
        
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_SIGN,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_SIGN, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rDividerSign.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_SIGN);
    };

    operation.available = function() {
        if(selectedIDs.length < 2) return false;
        let layerFlag = true;
        
        var graph = context.graph(), layer;
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.TRAFFICSIGN) {
                sings.push(entity);
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

        if (dividers.length != 1 || sings.length ==0 || !layerFlag) {
            return false;
        }
        
        let isBreak = false;
        let relationTLs = [];
        for (let i =0; i < sings.length; i++) {
            relationTLs.push(...graph.parentRelations(sings[i], iD.data.DataType.R_DIVIDER_SIGN));
        }
        // let selectOPGIds = _.pluck(sings, 'id');
        // relationTLs.forEach(function(relation){
        //     var members = relation.members;
        //     var selectIds = _.pluck(members, 'id');
        //     for(var id of selectIds){
        //         if(selectOPGIds.incloudes(id)){
        //             isBreak = true;
        //             break;
        //         }
        //     }
        // });
 
        // if(isBreak) return false;
        if(relationTLs.length) return isBreak;
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.rDividerSign.description');
    };

    operation.id = 'rDividerSign';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.rDividerSign.title');

    return operation;
};