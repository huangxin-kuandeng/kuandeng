/*
 * @Author: tao.w
 * @Date: 2020-03-24 12:48:14
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-01 14:33:11
 * @Description: 
 */
/**
 * Created by tao.w on 2016/1/11.
 */
iD.operations.EditorWay = function(selectedIDs, context) {

    var operation = function() {
        // var roads = [];
        // var details="";
        // selectedIDs.forEach(function (id) {
        //     //console.log(iD.Adas.getAdasRoads());
        //     var entity = context.graph().entity(id);
        //     if(iD.Adas.isWalkRoad(entity)){
        //         roads.push(entity.id);
        //         details=iD.SubWay;
        //     }
        //     if(iD.Adas.isAdasRoad(entity)){
        //         roads.push(entity.id);
        //         details=iD.AdasPassword;
        //     }
        // });

        context.enter(iD.modes.EditorWay(context, selectedIDs));
    };

    operation.available = function() {
        //return true;
        if(!selectedIDs || selectedIDs.length!=1){
            return false;
        }
        var entity = context.entity(selectedIDs[0]);
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        if(!modelConfig || !(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        // var editable = iD.Static.layersInfo.isEditable(entity.modelName);
        if(!modelConfig.editable) return false;
        if(modelConfig.editable)
        {
            if(entity.type== "way"
             && entity.modelName != iD.data.DataType.TRAFFICSIGN
             && entity.modelName != iD.data.DataType.TRAFFICLIGHT)
            {
                return true && !operation.disabled();
            }
        }
        return false && !operation.disabled();
    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.way_editor.' + disable) :
            t('operations.way_editor.description');
    };
    operation.id = 'way_editor';
    operation.keys =  [iD.ui.cmd('Q')];
    operation.title = t('operations.way_editor.title');
    return operation;
};

