/*
 * @Author: tao.w
 * @Date: 2020-09-17 18:50:29
 * @LastEditors: tao.w
 * @LastEditTime: 2020-10-23 17:44:05
 * @Description: 
 */
/*
* 粘贴道路属性按钮操作
*/
iD.operations.PasteTags = function(selectedIDs, context) {
    
    var operation = function(){
		context.container().call(iD.ui.TagsClone(context,iD.data.DataType.ROAD).selectedIDs(selectedIDs));
	};
 
    var isEditable = function(_){
        var editable = true;
        for (var i = 0; i < _.length; i++) {
            var entity = context.graph().entity(_[i]);
            editable = iD.Layers.getLayer(entity.layerId, entity.modelName).editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
            if(!editable) return false;
        }
        return editable;
    }
	operation.available = function() {
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var entity = context.entity(selectedIDs[0]);
        if(entity.modelName!=iD.data.DataType.ROAD) return false;
        // var editable = iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
		var layer = iD.Layers.getLayer(entity.layerId), graph = context.graph();
		if (layer && !layer.isRoad() || !localStorage.getItem('s_map_editor_copy_wayId')) return false;
		var legal = true;
		selectedIDs.forEach(function (id) {
			!(context.entity(id).geometry(graph) === 'line') && (legal = false);
		});
		return isEditable(selectedIDs) && legal && !operation.disabled();
	};

    operation.disabled = function() {
//      return !this.available();
        return false;
    };

    operation.tooltip = function() {
        return t('operations.paste_tags.description.road');
    };

    operation.id = 'paste_tags-road';
    operation.keys = [t('operations.paste_tags.key')];
    operation.title = t('operations.paste_tags.title');

    return operation;
} 