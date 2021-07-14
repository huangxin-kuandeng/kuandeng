/*
 * @Author: tao.w
 * @Date: 2020-09-17 18:50:29
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-02 16:58:33
 * @Description: 
 */
iD.operations.Reverse = function (selectedIDs, context) {
    var entityId = selectedIDs[0];

    var operation = function () {
        context.perform(
            iD.actions.Reverse(entityId),
            t('operations.reverse.annotation'));
            
        // let obj ={
        //     name:'reverse',
        //     target: entity
        // }
        
        // context.event.full_featureEvent(obj);
    };

    operation.available = function () {

        if (selectedIDs.length != 1) return false;
        let entity = context.entity(selectedIDs[0]);
        if (![iD.data.DataType.BARRIER_GEOMETRY,iD.data.DataType.DIVIDER].includes(entity.modelName)) {
            return false;
        }
        if (!iD.Layers.getLayer(entity.layerId, entity.modelName).editable) return false;

        return selectedIDs.length === 1 &&
            context.geometry(entityId) === 'line' &&
            !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.reverse.description');
    };

    operation.id = 'reverse';
    operation.keys = [t('operations.reverse.key')];
    operation.title = t('operations.reverse.title');

    return operation;
};
