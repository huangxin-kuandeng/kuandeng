/*
 * @Author: tao.w
 * @Date: 2021-04-02 15:33:19
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-27 18:19:27
 * @Description: 
 */

iD.operations.rTsLaneCreate2 = function (selectedIDs, context) {
    var selectedPG;
    let rModelName = iD.data.DataType.R_SIGN_LANE;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(rModelName);
    var ways = [];

    var operation = function () {
        var actions = [];
        var members = [{
            id: selectedPG.id,
            modelName: selectedPG.modelName,
            type: iD.data.GeomType.WAY,
            role: "SIGN_ID"
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
        relation.tags.TYPE = '2'
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rTsLane2.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));

        context.buriedStatistics().merge(0, rModelName);
        ways.length = 0;
    };

    operation.available = function () {
        if (selectedIDs.length == 1) return false;

        var graph = context.graph(), layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);

            if (entity.modelName == iD.data.DataType.TRAFFICSIGN) {
                if (selectedPG) return false;
                selectedPG = entity;
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

        if (!selectedPG || ways.length == 0) return false;


        var isBreak = false;
        var relationTLs = graph.parentRelations(selectedPG, rModelName);
        // var selectWayIds = _.pluck(ways, 'id');
        relationTLs.forEach(function (relation) {
            if (isBreak) return;
            if(relation.tags.TYPE == '2'){
                isBreak = true;
                return ;
            }
            // for (var m of relation.members) {
            //     if (selectWayIds.indexOf(m.id) > -1) {
            //         isBreak = true;
            //         break;
            //     }
            // }
        });
        if (isBreak) return false;

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rTsLane2.description');
    };

    operation.id = 'rTsLaneCreate2';
    operation.keys = [];
    operation.title = t('operations.rTsLane2.title');

    return operation;
};