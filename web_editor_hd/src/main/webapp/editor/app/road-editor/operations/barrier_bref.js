/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 20:48:23
 * @Description: 
 */
/**
 * 创建 护栏形状线分组
 */
iD.operations.barrierBref = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_BARRIER_BREF;
    var wayModelName = iD.data.DataType.BARRIER_GEOMETRY;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var ways = [];

    var operation = function() {
        var actions = [];
        var members = [];
        for (var i = 0; i < ways.length; i++) {
            var way = ways[i];
            members.push({
                id: way.id,
                modelName: way.modelName,
                type: iD.data.GeomType.WAY,
                role: 'BG_ID'
            });
        }
        var relation = iD.Relation({
            modelName: relationName,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(relationName, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.barrier_bref.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_BARRIER_BREF);
    };

    operation.available = function() {
        if (selectedIDs.length < 2) return false;

        var graph = context.graph(),
            layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == wayModelName) {
                var rels = graph.parentRelations(entity, relationName);
                if(rels && rels.length) return false;
                
                ways.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
        }
        if (ways.length < 2) return false;
        if (!layer || !layer.editable) {
            return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.barrier_bref.description');
    };

    operation.id = 'dividerDREF';
    operation.keys = ['none'];
    operation.title = t('operations.barrier_bref.title');

    return operation;
};