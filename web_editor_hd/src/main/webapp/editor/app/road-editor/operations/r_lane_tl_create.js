/*
 * @Author: tao.w
 * @Date: 2021-04-02 15:33:19
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-09 20:14:49
 * @Description: 
 */

iD.operations.rTlLaneCreate = function (selectedIDs, context) {
    var selectedLight;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_TL_LANE);
    var ways = [];
    let rModelName = iD.data.DataType.R_TL_LANE;

    var operation = function () {
        var actions = [];
        var members = [{
            id: selectedLight.id,
            modelName: selectedLight.modelName,
            type: iD.data.GeomType.WAY,
            role: "TL_ID"
        }];
        for (var i = 0; i < ways.length; i++) {
            var way = ways[i];
            members.push({
                id: way.id,
                modelName: way.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.HD_LANE_ID
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
            actions.push(t('operations.rTlLane.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));

        context.buriedStatistics().merge(0, rModelName);
        ways.length = 0;
    };

    operation.available = function () {
        if (selectedIDs.length != 2) return false;

        var graph = context.graph(), layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);

            if (entity.modelName == iD.data.DataType.TRAFFICLIGHT) {
                if (selectedLight) return false;
                selectedLight = entity;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.HD_LANE) {
                ways.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }

            if (!layer || !layer.editable) {
                return false;
            }
        }

        if (!selectedLight || ways.length == 0) return false;


        var isBreak = false;
        var relationTLs = graph.parentRelations(selectedLight, rModelName);
        var selectWayIds = _.pluck(ways, 'id');
        relationTLs.forEach(function (relation) {
            if (isBreak) return;
            for (var m of relation.members) {
                if (selectWayIds.indexOf(m.id) > -1) {
                    isBreak = true;
                    break;
                }
            }
        });
        if (isBreak) return false;

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rTlLane.description');
    };

    operation.id = 'rTlLaneCreate';
    operation.keys = [];
    operation.title = t('operations.rTlLane.title');

    return operation;
};