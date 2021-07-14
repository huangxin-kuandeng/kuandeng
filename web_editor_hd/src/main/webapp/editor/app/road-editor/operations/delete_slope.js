iD.operations.DeleteSlope = function(selectedIDs, context) {




     var operation = function() {
        var annotation,
            nextSelectedID=[];
         var slopesIds=[];
        for(var i=0;i<selectedIDs.length;i++)
        {
            if(context.entity(selectedIDs[i]) instanceof iD.Way &&context.entity(selectedIDs[i]).tags&&context.entity(selectedIDs[i]).modelName==iD.data.DataType.HIGHWAY)
            {

                var slopes=context.entity(selectedIDs[i]).getSlopes(context.graph());

                slopes.forEach(function(slope){
                    slopesIds.push(slope.id);
                })
            }
            if(context.entity(selectedIDs[i]).tags&&context.entity(selectedIDs[i]).modelName==iD.data.DataType.DETAILSLOPE)
            {
                nextSelectedID.push(selectedIDs[i]);
            }

        }
           if (nextSelectedID && context.hasEntity(nextSelectedID)) {
            context.enter(iD.modes.Select(context, [nextSelectedID]));
        } else {
            context.enter(iD.modes.Browse(context));
        }
         if (selectedIDs.length > 0) {
             annotation = t('operations.delete_slope.annotation', {n: slopesIds.length});
         }
        var action = iD.actions.DeleteMultiple(slopesIds);
        context.perform(
            action,
            annotation);
    };

    operation.available = function() {
        //return true;
    	var entity = context.entity(selectedIDs[0]);
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
       if(modelConfig && modelConfig.editable)
       {
           // if(iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false)){
               for(var i=0;i<selectedIDs.length;i++)
               {
                   if(context.entity(selectedIDs[i]).type=="way"&&context.entity(selectedIDs[i]).tags&&context.entity(selectedIDs[i]).modelName==iD.data.DataType.HIGHWAY)
                   {
                       var slopes=context.entity(selectedIDs[i]).getSlopes(context.graph());
                       if(slopes.length>0)
                       {
                           return  !operation.disabled();
                       }
                   }
               }
           // }
       }else{
           return false && !operation.disabled();
       }
    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.delete_slope.' + disable) :
            t('operations.delete_slope.description');
    };
    operation.id = 'delete_slope';
    operation.keys = [];
    operation.title = t('operations.delete_slope.title');
    return operation;
};

