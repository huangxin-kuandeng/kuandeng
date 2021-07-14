/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-08 14:42:54
 * @Description: 
 */

iD.operations.rPlLaneCreate = function (selectedIDs, context) {
    var _objectPl, _objectLanes = [];

    let relationName = iD.data.DataType.R_PL_LANE;

    var operation = function () {
        if (!_objectLanes.length || !_objectPl) {
            return false;
        }
        var actions = [];
        var members = [];
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
        members.push({
            id: _objectPl.id,
            modelName: _objectPl.modelName,
            type: iD.data.GeomType.WAY,
            role: 'PL_ID'
        });
        for (let i = 0; i < _objectLanes.length; i++) {
            members.push({
                id: _objectLanes[i].id,
                modelName: iD.data.DataType.HD_LANE,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.HD_LANE_ID
            });
        }

        var relation = iD.Relation({
            modelName: relationName,
            members: members,
            layerId: currentLayer.id,
            identifier: currentLayer.identifier,
            tags: iD.util.getDefauteTags(relationName, currentLayer)
        });

        actions.push(iD.actions.AddEntity(relation));

        actions.push(t('operations.rPlLane.title'));
        context.perform.apply(context, actions);

        context.enter(iD.modes.Browse(context));
        _objectLanes.length = 0;
        context.buriedStatistics().merge(0, relationName);
    };

    operation.available = function () {
        if (selectedIDs.length < 2) return false;

        var graph = context.graph(), layer;

        let _r = [];

        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);

            if (entity.modelName == iD.data.DataType.HD_LANE) {
                _objectLanes.push(entity);

                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.OBJECT_PL) {
                if (_objectPl) return false;
                if (entity.modelName == iD.data.DataType.OBJECT_PL && entity.tags.TYPE == '2' && ['1', '2', '3'].includes(entity.tags.SUBTYPE)) {
                    _objectPl = entity;
                }
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
            _r = graph.parentRelations(entity, relationName);
            if (!layer.editable || _r.length) {
                return false;
            }
            _r = [];
        }

        if (!_objectLanes.length || !_objectPl) {
            return false;
        }


        // for (let i = i; i < _objectLanes.length; i++) {
        //     _r = graph.parentRelations(entity, relationName);
        //     if (_r.length > 0) return false;
        // }

        // let relationTLs = [];
        // relationTLs.push(...graph.parentRelations(_objectPl, relationName));


        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rPlLane.description');
    };

    operation.id = 'rPlLaneCreate';
    operation.keys = [];
    operation.title = t('operations.rPlLane.title');

    return operation;
};