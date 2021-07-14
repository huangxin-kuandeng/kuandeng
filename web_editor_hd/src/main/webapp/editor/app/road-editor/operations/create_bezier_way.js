/*
 * @Author: tao.w
 * @Date: 2020-02-05 19:05:36
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-19 15:28:38
 * @Description: 
 */

iD.operations.CreateBezierWay = function (selectedIDs, context) {

    var operation = function () {
        var entity1 = context.entity(selectedIDs[0]);
        var entity2 = context.entity(selectedIDs[1]);
        let loc1 = entity1.loc;
        let loc2 = entity2.loc;
        let x = (loc1[0] + loc2[0])/2;
        let y = (loc1[1] + loc2[1])/2;
        let z = (loc1[2] + loc2[2])/2;
        let newLoc = [x, y, z];
        let currentLayer = iD.Layers.getLayer(entity2.layerId);
        let way = new iD.Way({
            nodes: [...selectedIDs],
            tags: {},
            identifier:currentLayer.identifier,
            modelName:iD.data.DataType.DIVIDER,
            layerId: entity2.layerId
        });
        var layer = iD.Layers.getLayer(entity1.layerId);
        way.setTags(iD.util.getDefauteTags(way, layer));
        let node = new iD.Node({
            loc:newLoc,
            tags: {},
            identifier:currentLayer.identifier,
            modelName:iD.data.DataType.DEFAULT,
            layerId: entity2.layerId
        });
        let actions = [
            iD.actions.AddEntity(way),
            iD.actions.AddEntity(node),
            '新增临时数据'
        ]
        context.perform.apply(this, actions);
        // context.perform(action, annotation);
        context.enter(iD.modes.EditorBezier(context, entity1,entity2,node,way));
    };

    operation.available = function () {
        if (!selectedIDs || selectedIDs.length != 2) {
            return false;
        }
        var entity1 = context.entity(selectedIDs[0]);
        var entity2 = context.entity(selectedIDs[1]);
        var layer1 = iD.Layers.getLayer(entity1.layerId, entity1.modelName);
        var layer2 = iD.Layers.getLayer(entity2.layerId, entity2.modelName);
        if (!layer1 || !layer2) return false;
        if(entity1.modelName != iD.data.DataType.DIVIDER_NODE || entity2.modelName != iD.data.DataType.DIVIDER_NODE) return false;
        if (!layer1.editable || !layer2.editable) return false;
        if (layer1.editable && layer2.editable) {
            if (entity1.type == "node" && entity2.type == 'node') {
                return true && !operation.disabled();
            }
        }
        return false && !operation.disabled();
    };
    operation.disabled = function () {
        return false;
    };
    operation.tooltip = function () {
        var disable = operation.disabled();
        return disable ?
            t('operations.way_bezier_create.' + disable) :
            t('operations.way_bezier_create.description');
    };
    operation.id = 'way_bezier_create';
    operation.keys = [iD.ui.cmd('Q')];
    operation.title = t('operations.way_bezier_create.title');
    return operation;
};

