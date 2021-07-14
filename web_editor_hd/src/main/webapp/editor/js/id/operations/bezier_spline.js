/*
 * @Author: tao.w
 * @Date: 2018-10-17 18:03:20
 * @LastEditors: tao.w
 * @LastEditTime: 2018-10-17 18:47:09
 * @Description: 
 */
iD.operations.BezierSpline = function(selectedIDs, context) {
    // var entityId = selectedIDs[0],
    var action = iD.actions.BezierSpline(selectedIDs, context.projection,context);

    function operation() {
        var annotation = t('operations.bezierSpline.annotation');
        context.perform(action, annotation);
        context.event.entityedite({})
    }

    operation.available = function() {
        if(selectedIDs.length !=2) {
            return false;
        }
        
        let entity1 = context.entity(selectedIDs[0]);
        let entity2 = context.entity(selectedIDs[1]);
        var layer = iD.Layers.getLayer(entity1.layerId, entity1.modelName);
        if(!layer) return false;
        if(entity1.layerId != entity2.layerId || 
            !layer.editable){
                return false;
            }
        let wids1 = _.pluck(context.graph().parentWays(entity1),'id');
        let wids2 = _.pluck(context.graph().parentWays(entity2),'id');
        let wayID;
        for(let i=0;i<wids1.length;i++){
            if(wids2.includes(wids1[i])){
                wayID = wids1[i];
                break;
            }
        }

        return wayID;
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.bezierSpline.' + disable) :
            t('operations.bezierSpline.description');
    };

    operation.id = 'bezierSpline';
    operation.keys = [t('operations.bezierSpline.key')];
    operation.title = t('operations.bezierSpline.title');

    return operation;
};
