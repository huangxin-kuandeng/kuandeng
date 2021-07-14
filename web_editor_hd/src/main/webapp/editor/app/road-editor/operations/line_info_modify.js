/**
 *  2015/12/9.
 * 行车引导线路径
 */
iD.operations.LineInfoModify = function(selectedIDs, context) {
    //var action = iD.actions.lineInfoModify(selectedIDs,context);
    var nodeLineInfo = new iD.ui.NodeLineInfo(context, context.container(),selectedIDs);
    var operation = function() {
        //context.enter(
        //    iD.modes.LineInfoPath(context,selectedIDs));

        nodeLineInfo.show();

        //var annotation = t('operations.line_info_modify.annotation');
        // context.perform(action, annotation);
        //context.enter(iD.modes.Browse(context));
    };

    operation.available = function() {
        if(iD.User.isCheckRole() || iD.User.isVerifyRole()) return false;
        //return true;
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        if(selectedIDs.length!=1)   return false;
        var entity = context.entity(selectedIDs[0]),wrongDataFlag = false,graph = context.graph();
        /*if(entity.tags.datatype == iD.data.DataType.ROAD_NODE){
            var saat = context.graph().parentRelations(entity,iD.data.DataType.NODEINFO);
            var maat = context.graph().parentRelations(entity,iD.data.DataType.NODECONN);
            for(var i =0;i<saat.length;i++){
                var tags = saat[i].tags;
                // if (tags.lt_turn_l != '0' || (tags.lt_utrun_l&&tags.lt_utrun_l != '0') || tags.wait_l != '0' || tags.rear_bmp || tags.side_bmp || tags.laneinfo) {
                //     wrongDataFlag = true;
                //     break;
                // }
                if (tags.LT_TURN_L != '0' || (tags.LT_UTRUN_L&&tags.LT_UTRUN_L != '0') || tags.WAIT_L != '0' || tags.LANEINFO) {
                    wrongDataFlag = true;
                    break;
                }
            }
            for(var i = 0;i<maat.length;i++){
                var secondeRels = graph.parentRelations(maat[i]);
                if(secondeRels.length>0){
                    wrongDataFlag = true;
                    break;
                }
            }

            if(!wrongDataFlag){
                return false;
            }
        };*/
        var editable = iD.Static.layersInfo.isEditable(entity.modelName);
        /*if(entity instanceof iD.Node&&(entity.modelName==iD.data.DataType.ROAD_NODE||entity.modelName ==iD.data.DataType.C_NODE))
            return true && !operation.disabled();
        if(!editable)
            return false;*/
        if(editable && entity instanceof iD.Node&&(entity.modelName == iD.data.DataType.ROAD_NODE||entity.modelName ==iD.data.DataType.C_NODE)){
            return true && !operation.disabled();
        }
        return false && !operation.disabled();

    };

    operation.disabled = function() {
//      return false;
        let disabeld = nodeLineInfo.disabled(context.graph());
        return disabeld == "not_eligible" ? "not_eligible"  : !disabeld;
    };

    operation.tooltip = function(){
        var disable = operation.disabled();
        return disable == "not_eligible" ?
            t('operations.line_info_modify.not_eligible') :
            t('operations.line_info_modify.description');
    };

    operation.id = 'line_info_modify';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.line_info_modify.title');

    return operation;
};
