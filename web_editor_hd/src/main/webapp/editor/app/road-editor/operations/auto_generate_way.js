/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 16:47:39
 * @Description: 
 */
/**
 * Created by tao.w on 2018/04/26.
 */
iD.operations.AutoGenerateWay = function(selectedIDs, context) {

    var operation = function() {
        var entity1 = context.entity(selectedIDs[0]);
        var w1 = context.graph().parentWays(entity1)[0];
        let layer = iD.Layers.getLayer(w1.layerId);
        var newWay = iD.Way({
            layerId : w1.layerId,
            identifier:layer.identifier,
            nodes : [entity1.id,selectedIDs[1]],
            modelName : w1.modelName,
            tags : iD.util.getDefauteTags(w1.modelName)
        });
        
        context.perform(
            iD.actions.AddEntity(newWay),
        	// 量测信息补充
            iD.actions.createVirtualMeasureinfo(newWay),
            t('operations.auto_generate_way.title')
        );
        context.enter(iD.modes.Browse(context));
        context.event.entityedite({
            entitys: [newWay.id]
        });
    };

    operation.available = function() {
        if(!selectedIDs || selectedIDs.length!=2){
            return false;
        }
        if(iD.Task.d.tags.dbCode != 'fusion') return false;
        if(iD.Task.hideNoMeasureOperate()){
        	return false;
        }
        var entity1 = context.entity(selectedIDs[0]);
        var entity2 = context.entity(selectedIDs[1]);

        if(entity2.modelName != entity1.modelName || !(entity1 instanceof iD.Node)){
            return false
        }

        var w1 = context.graph().parentWays(entity1);
        var w2 = context.graph().parentWays(entity2);

        if(!w1.length || !w2.length){
            return false;
        }
        if(w1[0].modelName != iD.data.DataType.DIVIDER || 
            w2[0].modelName != iD.data.DataType.DIVIDER){
            return false;
        }
        let w1_modelConfig = iD.Layers.getLayer(w1[0].layerId, w1[0].modelName);
        let w2_modelConfig = iD.Layers.getLayer(w2[0].layerId, w2[0].modelName);
        if(!w1_modelConfig.editable) return false;
        if(!w2_modelConfig.editable) return false;
        if(w1[0].layerId != w2[0].layerId){
            return false;
        }
        for(w of w1){
          if(selectedIDs.includes(w.first()) && selectedIDs.includes(w.last())){
              return false
          }
        }
        for(w of w2){
            if(selectedIDs.includes(w.first()) && selectedIDs.includes(w.last())){
                return false
            }
        }
        if([w1[0].first(),w1[0].last()].includes(entity1.id) && [w2[0].first(),w2[0].last()].includes(entity2.id)){
            return true;
        }

    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        return t('operations.auto_generate_way.description');
    };
    operation.id = 'auto_generate_way';
    operation.keys =  [iD.ui.cmd('Q')];
    operation.title = t('operations.auto_generate_way.title');
    return operation;
};

