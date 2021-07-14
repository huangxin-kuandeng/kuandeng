/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:04:03
 * @Description: 
 */
/**
 * 创建 收费站
 */
iD.operations.dividerTollgate = function(selectedIDs, context) {
    var relationName = iD.data.DataType.TOLLGATE;
    var wayModelName = iD.data.DataType.DIVIDER;
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
                role: iD.data.RoleType.DIVIDER_ID
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
            actions.push(t('operations.divider_tollgate.title'));
            context.perform.apply(context, actions);
        }
        context.buriedStatistics().merge(1,ways[0].modelName,1000);
        context.enter(iD.modes.Browse(context));
    };

    operation.available = function() {
        if (selectedIDs.length < 2) return false;

        var graph = context.graph(),
            layer;

        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == wayModelName) {
                ways.push(entity);
            }
        }

        var dividers = iD.util.getSameDirectionDivider(context,ways);
        // console.log('dividers:', dividers.length)
        if (dividers.length != ways.length) {
            return false;
        }
        for (var i = 0; i < ways.length; i++) {
            var entity = ways[i];
            if (entity.modelName == wayModelName) {
                var rels = graph.parentRelations(entity, relationName);
                if(rels && rels.length) return false;
                
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
        return t('operations.divider_tollgate.description');
    };

    operation.id = 'bridge-point';
    operation.keys = ['none'];
    operation.title = t('operations.divider_tollgate.title');

    return operation;
};