/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-26 18:00:00
 * @Description: 
 */

/**
 * @description: 
 * @param {type} 
 * @return: 
 */
iD.operations.rRoadSignCreate = function (selectedIDs, context) {
    var road = null, sign = null;
    const relationModelNmae = iD.data.DataType.R_SIGN_ROAD;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationModelNmae);

    var operation = function () {
        var actions = [];
        var members = [];
        members.push({
            id: sign.id,
            modelName: sign.modelName,
            type: iD.data.GeomType.WAY,
            role: 'SIGN_ID'
        });
        members.push({
            id: road.id,
            modelName: road.modelName,
            type: iD.data.GeomType.WAY,
            role: iD.data.RoleType.ROAD_ID
        });

        var relation = iD.Relation({
            modelName: relationModelNmae,
            members: members,
            layerId: currentLayer.id,
            identifier: currentLayer.identifier,
            tags: iD.util.getDefauteTags(relationModelNmae, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.rRoadsign.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
        road = null, sign = null;
    };

    operation.available = function () {
        if (selectedIDs.length != 2) return false;
        let layerFlag = true;

        var graph = context.graph(), layer;
        let roadId = '';
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.ROAD) {
                road = entity;
                roadId = entity.id;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.TRAFFICSIGN) {
                sign = entity;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
            if (!layer.editable) {
                layerFlag = false;
            }
        }

        if (!road || !sign || !layerFlag) {
            return false;
        }
        let relations = [];
        relations = graph.parentRelations(sign, relationModelNmae);

        if (relations.length > 0) return false;
        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rRoadsign.description');
    };

    operation.id = 'rRoadsign';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.rRoadsign.title');

    return operation;
};