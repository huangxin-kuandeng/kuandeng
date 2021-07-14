/*
 * @Author: tao.w
 * @Date: 2021-04-02 15:33:19
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 20:29:58
 * @Description: 
 */

iD.operations.rRoadCreate = function (selectedIDs, context) {
    let rModelName = iD.data.DataType.R_ROAD;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(rModelName);
    var roads = [];

    var operation = function () {
        var actions = [];
        let members = [];
        for (var i = 0; i < roads.length; i++) {
            var way = roads[i];
            members.push({
                id: way.id,
                modelName: way.modelName,
                type: iD.data.GeomType.WAY,
                role: "ROAD_ID_" + (i + 1)
            });
        }
        
        var relation = iD.Relation({
            modelName: rModelName,
            members: members,
            layerId: currentLayer.id,
            identifier: currentLayer.identifier,
            tags: iD.util.getDefauteTags(rModelName, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rRoad.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));

        context.buriedStatistics().merge(0, rModelName);
        roads.length = 0;
    };

    operation.available = function () {
        if (selectedIDs.length != 2) return false;

        var graph = context.graph(), layer;
        var entity;
        for (var i = 0; i < selectedIDs.length; i++) {
            entity = context.entity(selectedIDs[i]);

            if (entity.modelName == iD.data.DataType.ROAD) {
                roads.push(entity);
            } else {
                return false;
            }
            var relationTLs = graph.parentRelations(entity, rModelName);
            if(relationTLs.length) return false;

            layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!layer || !layer.editable) {
                return false;
            }
        }

        if (roads.length != 2) return false;

        
        // var selectWayIds = _.pluck(roads, 'id');
        // for (let i = 0; i < relationTLs.length; i++) {
        //     for (var m of relation.members) {
        //         if (selectWayIds.indexOf(m.id) > -1) {
        //             return false;
        //         }
        //     }
        // }

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rRoad.description');
    };

    operation.id = 'rRoadCreate';
    operation.keys = [];
    operation.title = t('operations.rRoad.title');

    return operation;
};