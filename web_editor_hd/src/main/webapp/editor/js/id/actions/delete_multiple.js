/*
 * @Author: tao.w
 * @Date: 2018-12-17 11:35:51
 * @LastEditors: tao.w
 * @LastEditTime: 2019-11-07 19:38:41
 * @Description: 
 */
/**
 * 菜单中删除按钮对应的action
 * @param {Object} ids
 * @param {Object} context
 */
iD.actions.DeleteMultiple = function(ids, context) {
    var actions = {
        way: iD.actions.DeleteWay,
        node: iD.actions.DeleteNode,
        relation: iD.actions.DeleteRelation
    };

    var action = function(graph) {
        ids.forEach(function(id) {
            if (graph.hasEntity(id)) { // It may have been deleted aready.
                graph = actions[graph.entity(id).type](id, context)(graph);
            }
        });

        return graph;
    };

    action.disabled = function(graph) {
    	let ftype;
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i], disabled;
            let entity = graph.hasEntity(id);
            if (entity) {
            	if(!ftype){
            		ftype = entity.type;
            	}
            	if(ftype != entity.type){
            		return "multi_type";
            	}
            	disabled = actions[graph.entity(id).type](id).disabled(graph);
            	if (disabled) return disabled;
            } else {
            	if (i === ids.length - 1) return false;
            }
        }
    };

    return action;
};
