/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-19 15:35:55
 * @Description: 
 */
 
/**
 * @description: 
 * @param {type} 
 * @return: 
 */ 
iD.operations.rDividerOplCreate = function(selectedIDs, context) {
    var opls = [], dividers = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_OPL);

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
        for (let i = 0; i < opls.length; i++) {
            let opl = opls[i];
            members.push({
                id: opl.id,
                modelName: opl.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.OBJECT_PL_ID
            });
        }
        
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_OPL,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_OPL, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rDividerOpl.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_OPL);
    };

    operation.available = function() {
        if(selectedIDs.length < 2) return false;
        let layerFlag = true;
        
        var graph = context.graph(), layer;
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.OBJECT_PL) {
                opls.push(entity);
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

        if (dividers.length !=1 || opls.length == 0 || !layerFlag) {
            return false;
        }
        
        // let isBreak = false;
        let relationTLs = [];
        for (let i =0; i < opls.length; i++) {
            relationTLs.push(...graph.parentRelations(opls[i], iD.data.DataType.R_DIVIDER_OPL));
        }
        // let selectOPLIds = _.pluck(opls, 'id');
        // relationTLs.forEach(function(relation){
        //     var members = relation.members;
        //     var selectIds = _.pluck(members, 'id');
        //     for(var id of selectIds){
        //         if(selectOPLIds.incloudes(id)){
        //             isBreak = true;
        //             break;
        //         }
        //     }
        // });
 
        if(relationTLs.length) return false;

        // var layer3 = iD.Layers.getLayer(currentLayer.id, iD.data.DataType.R_DIVIDER_OPL);
        // if (!layer || !layer2 || !layer3) {
        //     return false;
        // }
        // if (!layer.editable || !layer2.editable || !layer3.editable) {
        //     return false;
        // }
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.rDividerOpl.description');
    };

    operation.id = 'rDividerOpl';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.rDividerOpl.title');

    return operation;
};