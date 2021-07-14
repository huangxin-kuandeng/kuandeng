/**
 * Created by wangtao on 2017/8/24.
 * 20180417
 * 双向参考线上最多可以挂两个分组；
 * 单向参考线上最多可以挂一个分组；
 * 普通车道线上最多可以挂一个分组；
 */
iD.operations.dividerDREF = function(selectedIDs, context) {
    var action = iD.actions.dividerDREF(selectedIDs,context);


    var operation = function() {
    	// 点击菜单中的此项后，会实际执行的代码
        var annotation = t('operations.dividerDREF.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
    };

	// 判断该项是否需要出现在菜单中
    operation.available = function() {

        var ways = [];
        var modelConfig;
        var entity;
        selectedIDs.forEach(function (d, i) {
            entity = context.entity(d);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(modelConfig && modelConfig.editable && entity.modelName == iD.data.DataType.DIVIDER){
                ways.push(d);
            }
        });
        // 在出现的菜单项中是否显示该操作
        return ways.length>1 && !operation.disabled();
    };

    operation.disabled = function() {
    	var modelConfig, entity,
    		graph = context.graph(),
            i=0,len = selectedIDs.length,
            rLines = [];
        for(;i<len;i++){
            entity = context.entity(selectedIDs[i]);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
//          if(entity.type === iD.data.GeomType.NODE){
//              return 'exist_node';
//          }
            if(entity.modelName != iD.data.DataType.DIVIDER){
            	return 'exist_othermodel';
            }
            
            if(modelConfig && modelConfig.editable && entity.modelName == iD.data.DataType.DIVIDER && entity.tags.R_LINE == '1'){
                rLines.push(entity.id);
            }
        }
        if(!rLines.length){
            return 'not_eligible';
        }
        /*
        if(rLines.length > 1){
        	return 'not_more_eligible';
        }
        if(rLines.length == len){
        	return 'not_divider';
        }
        
        for(let i in selectedIDs){
        	let relations = graph.parentRelations(graph.entity(selectedIDs[i]),iD.data.DataType.R_DIVIDER_DREF);
        	if(relations.length){
        		return 'exist_relation';
        	}
        }
        */
        /*
        var relations = graph.parentRelations(graph.entity(selectedIDs[0]),iD.data.DataType.R_DIVIDER_DREF);
        for(relaction of relations){
            let isExist = true; //用于判断选择元素已存在关系，默认是已经存在关系
            let members = relaction.members;
            for(member of members){
                if(!selectedIDs.includes(member.id)){
                    isExist = false;
                    break;
                }
            }
            if(isExist){
                return 'exist_relation';
            }
        }
        */
       	
       	var flag = false;
       	for(let i in selectedIDs){
       		if(flag) break;
       		let way = graph.entity(selectedIDs[i]), maxRels = 1;
        	let relations = graph.parentRelations(way, iD.data.DataType.R_DIVIDER_DREF);
        	// 双向参考线最多两个组关系，否则最多一个关系 DIRECTION
        	if(way.tags.R_LINE == "1" && way.tags.DIRECTION == "1"){
        		maxRels = 2;
        	}
        	if(relations.length >= maxRels){
        		flag = true;
        		break;
        	}
        	
        	relations.forEach(function(rel){
        		var mids = _.pluck(rel.members, 'id');
        		var arr1 = mids, arr2 = selectedIDs;
        		if(arr1.length < arr2.length){
        			arr1 = selectedIDs;
        			arr2 = mids;
        		}
        		// members和选中的要素一致
        		if(_.difference(arr1, arr2).length == 0){
        			flag = true;
        		}
        	});
        }
       	if(flag){
       		return 'exist_relation';
       	}
       	
        return false;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.dividerDREF.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
            return t('operations.dividerDREF.description.line');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'dividerDREF';
    operation.keys = [t('operations.dividerDREF.key')];
    operation.title = t('operations.dividerDREF.title');

    return operation;
};
