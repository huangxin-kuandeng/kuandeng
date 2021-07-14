/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 20:46:06
 * @Description: 
 */
 
iD.operations.rTlStoplineCreate = function (selectedIDs, context) {
    var _trafficlight, _objectPl;

    var operation = function () {
        if (!_trafficlight || !_objectPl) {
            return false;
        }
        var actions = [];
        var members = [];
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_TL_STOPLINE);
        members.push({
            id: _objectPl.id,
            modelName: _objectPl.modelName,
            type: iD.data.GeomType.WAY,
            role: 'STOPLINE_ID'
        });
        members.push({
            id: _trafficlight.id,
            modelName: _trafficlight.modelName,
            type: iD.data.GeomType.WAY,
            role: 'TL_ID'
        });

        var relation = iD.Relation({
            modelName: iD.data.DataType.R_TL_STOPLINE,
            members: members,
            layerId: currentLayer.id,
            identifier: currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_TL_STOPLINE, currentLayer)
        });

        actions.push(iD.actions.AddEntity(relation));

        actions.push(t('operations.rTlStopline.title'));
        context.perform.apply(context, actions);

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_TL_STOPLINE);
    };

    operation.available = function () {
        if (selectedIDs.length != 2) return false;
        let layerFlag = true;

        var graph = context.graph(), layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.TRAFFICLIGHT) {
                _trafficlight = entity;
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.OBJECT_PL) {
                if (entity.modelName == iD.data.DataType.OBJECT_PL && entity.tags.TYPE == '2' && ['1', '2', '3'].includes(entity.tags.SUBTYPE)) {
                    _objectPl = entity;
                }
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
            if (!layer.editable) {
                layerFlag = false;
            }
        }

        if (!layerFlag || !_trafficlight || !_objectPl) {
            return false;
        }

        let relationTLs = [];
        relationTLs.push(...graph.parentRelations(_trafficlight, iD.data.DataType.R_TL_STOPLINE));

        for (let i = 0; i < relationTLs.length; i++) {
            let relation = relationTLs[i];
            let m1 = relation.memberById(_trafficlight.id);
            let m2 = relation.memberById(_objectPl.id);
            if (m1 && m2) return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rTlStopline.description');
    };

    operation.id = 'rTlStopline';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.rTlStopline.title');

    return operation;
};