/**
 * 创建 道路上放结构
 */
iD.operations.roadFacilities = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_ROAD_FACILITIES;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var mList = [];
    var divider;

    var operation = function() {
        var actions = [];
        var members = [{
            id: divider.id,
            modelName: divider.modelName,
            type: iD.data.GeomType.WAY,
            role: iD.data.RoleType.DIVIDER_ID
        }];
        mList.forEach(function(way){
            members.push({
                id: way.id,
                modelName: way.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.ROAD_FACILITIES_ID
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
            actions.push(t('operations.r_road_facilities.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_ROAD_FACILITIES);
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
            }else if (entity.modelName == iD.data.DataType.ROAD_FACILITIES) {
                var rels = graph.parentRelations(entity, relationName);
                if(rels && rels.length) return false;

                mList.push(entity);
                layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
        }
        if (!divider || !mList.length) return false;
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
        return t('operations.r_road_facilities.description');
    };

    operation.id = 'dividerDREF';
    operation.keys = ['none'];
    operation.title = t('operations.r_road_facilities.title');

    return operation;
};