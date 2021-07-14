/**
 * 灯杆/灯头关系，R_LAMPPOST_LREF
 */
iD.operations.LamppostLREFCreate = function(selectedIDs, context, isReplace) {
	var isReplace = !(!isReplace);
	
    var operation = function(){
    	var graph = context.graph();
    	var poles = [], lampHolders = [], relation_ids = [];
    	selectedIDs.forEach(function(nid){
    		let entity = graph.entity(nid);
    		if(entity.tags.TYPE == 1){
    			poles.push(entity);
    		}else if(entity.tags.TYPE == 2){
    			lampHolders.push(entity);
    		}
    		var rel = graph.parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF)[0];
    		rel && relation_ids.push(rel.id);
    	});
    	if(!poles.length || !lampHolders.length){
    		Dialog.alert('至少要选择一个灯杆和一个灯头');
    		return ;
    	}
    	if(_.uniq(relation_ids).length > 1){
    		Dialog.alert('选择的点已经有灯杆/灯头关系');
    		return ;
    	}
    	
    	let allEntities = poles.concat(lampHolders);
    	
    	let members = [];
		for(let entity of allEntities){
			members.push( {
                'id': entity.id,
                'modelName': entity.modelName,
                'role': iD.data.RoleType.LAMPPOST_ID,
                'type': iD.data.GeomType.NODE
            });
		}
    	if(!relation_ids.length){
			// 关系，layerId、modelName、members
			var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_LAMPPOST_LREF);
			let relation = iD.Relation({
				modelName: iD.data.DataType.R_LAMPPOST_LREF,
                members: members,
                identifier:currentLayer.identifier,
	            layerId: currentLayer.id,
	            tags: iD.util.getDefauteTags(iD.data.DataType.R_LAMPPOST_LREF, currentLayer)
			});
			
			context[isReplace ? 'replace': 'perform'](
				iD.actions.AddEntity(relation),
				t('operations.lamppost_lref_create.title')
			);
    	}else {
    		let relation = graph.entity(relation_ids[0]);
    		let bfMlength = relation.members.length;
    		for(let i = 0; i<members.length; i++){
    			let m = members[i];
    			if(!relation.memberById(m.id)){
    				relation = relation.addMember(members[i]);
    			}
    		}
    		if(bfMlength == relation.members.length){
    			Dialog.alert('没有待追加的点');
    			return ;
    		}
    		context[isReplace ? 'replace': 'perform'](
				iD.actions.EditRelation(context, [relation]),
				t('operations.lamppost_lref_create.title')
			);
    	}
    	
    	context.enter(iD.modes.Browse(context));
    };

    operation.available = function(){
        if(selectedIDs.length < 2) return false;
        var layerids = [];
        var graph = context.graph();
        var holder;
        for(var i=0;i<selectedIDs.length;i++) {
            var entity=graph.entity(selectedIDs[i]);
            var layer = iD.Layers.getLayer(entity.layerId);
            if (layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
                layerids.push(layer.id)
            } else {
                return false;
            }
            if(entity.modelName != iD.data.DataType.LAMPPOST){
                return false;
            }
            // 灯杆和灯头
            if(!_.include([1, 2], Number(entity.tags.TYPE))){
            	return false;
            }
            // 一个灯杆与多个灯头
            if(entity.tags.TYPE == 1){
            	if(holder){
            		return false;
            	}
            	holder = entity;
            }
            /*
            var rel = graph.parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF)[0];
            if(rel) return false;
            */
        }
        return layer.editable && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.lamppost_lref_create.description');
    };
    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.lamppost_lref_create.title');
    return operation;
}