/*
 * 复制道路属性按钮操作
 */
iD.operations.CloneTags = function(selectedIDs, context) {
    var isEditable = function(_){
        var editable = true;
        for (var i = 0; i < _.length; i++) {
            var entity = context.graph().entity(_[i]),
                modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            editable = modelConfig.editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
            if(!editable) return false;
        }
        return editable;
    }

    var operation = function(){
        //console.log('hello');
		context.storage('s_map_editor_copy_wayId', selectedIDs[0]);
        context.enter(iD.modes.Browse(context));

	};

	operation.available = function() { 
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var entity = context.entity(selectedIDs[0]);
        if(entity.modelName!=iD.data.DataType.ROAD) return false;
        // var editable = iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
        var editable = isEditable(selectedIDs);
		var layer = iD.Layers.getLayer(entity.layerId), graph = context.graph();
		if (layer && !layer.isRoad() || selectedIDs.length !== 1) return false;
		var legal = true;
		selectedIDs.forEach(function (id) {
			!(context.entity(id).geometry(graph) === 'line') && (legal = false);
		});
		return editable && legal && !operation.disabled();
	};

    operation.disabled = function() {
//      return !this.available();
        return false;
    };

    operation.tooltip = function() {
        return t('operations.clone_tags.description.road');
    };

    operation.id = 'clone_tags-road';
    operation.keys = [t('operations.clone_tags.key')];
    operation.title = t('operations.clone_tags.title');

    return operation;
} 