/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 20:49:11
 * @Description: 
 */
/**
 * 创建 护栏与参考线 关联关系
 */
iD.operations.barrierDivider = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_BARRIER_DIVIDER;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var divider;
    var barrierList = [];

    var operation = function() {
        var actions = [];
        var members = [{
            id: divider.id,
            modelName: divider.modelName,
            type: iD.data.GeomType.WAY,
            role: iD.data.RoleType.DIVIDER_ID
        }];
        barrierList.forEach(function(barrier){
            members.push({
                id: barrier.id,
                modelName: barrier.modelName,
                type: iD.data.GeomType.WAY,
                role: 'BG_ID'
            });
        });
        var relation = iD.Relation({
            modelName: relationName,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(relationName, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.barrier_divider.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_BARRIER_DIVIDER);
    };

    operation.available = function() {
        if (selectedIDs.length < 2) return false;

        var graph = context.graph(),
            layer, layer2;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.DIVIDER) {
                if(divider || entity.tags.R_LINE != '1') return false;

                // var rels = graph.parentRelations(entity, relationName);
                // if(rels && rels.length) return false;
                
                divider = entity;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }else if (entity.modelName == iD.data.DataType.BARRIER_GEOMETRY) {
                var rels = graph.parentRelations(entity, relationName);
                if(rels && rels.length) return false;

                barrierList.push(entity);
                layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
        }
        if (!barrierList.length || !divider) return false;
        if (!layer || !layer.editable
            || !layer2 || !layer2.editable) {
            return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.barrier_divider.description');
    };

    operation.id = 'dividerDREF';
    operation.keys = ['none'];
    operation.title = t('operations.barrier_divider.title');

    return operation;
};