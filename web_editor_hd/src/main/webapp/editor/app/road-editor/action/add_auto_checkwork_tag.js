/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:18:36
 * @Description: 
 */
/**
 * 精度质检标记；
 * @param {String} nodeid dividerNodeid
 * @param {Object} opts 额外配置 （tags）
 */
iD.actions.AddAutoCheckWorkTag = function (addLoc, opts = {}) {
	var MODEL_NAME = iD.data.DataType.AUTO_CHECKWORK_TAG;
	var currentLayer = iD.Layers.getCurrentModelEnableLayer(MODEL_NAME);
	var mark_id;

    var action = function (graph) {
    	if(!currentLayer){
    		// 没有编辑状态图层
    		return graph;
    	}
    	var projectId = iD.Task.d.tags.projectId;
    	projectId = projectId != null ? projectId : '';
		var newTags = {
            CREATEBY: iD.User.getInfo().username,
			FUSIONTASKID: iD.Task.d.task_id,
			FLAG: '2',
			PROJECTID: projectId
		};
		Object.assign(newTags, opts.tags || {});
		
        var node = iD.Node({
            identifier:currentLayer.identifier,
        	layerId : currentLayer.id,
            modelName: MODEL_NAME,
            loc: addLoc,
            tags: Object.assign({}, iD.util.getDefauteTags(MODEL_NAME, currentLayer), newTags)
        });
        graph= graph.replace(node);
    	mark_id = node.id;
    	
    	return graph;
    };
    
    action.createdId = function(){
    	return mark_id;
    }

    action.disabled = function () {
    	return false;
    };
    
    return action;
};