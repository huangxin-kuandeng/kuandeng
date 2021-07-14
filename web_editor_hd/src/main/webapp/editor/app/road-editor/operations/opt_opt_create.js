/**
 * 为灯杆、灯头类型的OBJECT_PT建立R_OPT_OPT的Relation
 */
iD.operations.optOptCreate = function(selectedIDs, context, isReplace) {
	var /*layer,*/ isReplace = !(!isReplace);
	/*if(window._isInstance){
		layer = context.layers().getLayerByName(iD.data.DataType.FUSION_OBJECT_PT);
	}else {*/
		//layer = context.layers().getLayerByName(iD.data.DataType.OBJECT_PT);
	// }
	
    var operation = function(){
    	var graph = context.graph();
    	var poles = [], lampHolders = [], relation_ids = [];
    	// var pole_subtypes = [];
    	selectedIDs.forEach(function(nid){
    		let entity = graph.entity(nid);
    		if(_.include([4, 13], Number(entity.tags.SUBTYPE))){
    			poles.push(entity);
//  			pole_subtypes.push(entity.tags.SUBTYPE);
    		}else if(entity.tags.SUBTYPE == 12){
    			lampHolders.push(entity);
    		}
    		/*
    		else if(entity.tags.SUBTYPE == 4){
    			poles.push(entity);
    		}
    		*/
    		var rel = graph.parentRelations(entity, iD.data.DataType.R_OPT_OPT)[0];
    		rel && relation_ids.push(rel.id);
    	});
    	if(!poles.length || !lampHolders.length){
    		Dialog.alert('至少要选择一个灯杆和一个灯头');
    		return ;
    	}
    	/*
    	if(!poles.length || _.uniq(pole_subtypes).length != 2){
    		Dialog.alert('至少要选中一个路灯杆和一个杆顶点');
    		return ;
    	}
    	*/
    	if(_.uniq(relation_ids).length > 1){
    		Dialog.alert('选择的点已经有灯杆关系');
    		return ;
    	}
    	
    	let allEntities = poles.concat(lampHolders);
    	/*
    	for(let et of allEntities){
    		let rels = graph.parentRelations(et, iD.data.DataType.R_OPT_OPT);
    		if(rels && rels.length){
    			Dialog.alert('不能重复创建灯杆关系');
    			return ;
    		}
    	}
    	*/
    	
    	let members = [];
		for(let entity of allEntities){
			members.push( {
                'id': entity.id,
                'modelName': entity.modelName,
                'role': iD.data.RoleType.OBJECT_PT_ID,
                'type': iD.data.GeomType.NODE
            });
		}
    	if(!relation_ids.length){
			// 关系，layerId、modelName、members
			var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_OPT_OPT);
			let relation = iD.Relation({
				modelName: iD.data.DataType.R_OPT_OPT,
                members: members,
                identifier:currentLayer.identifier,
	            layerId: currentLayer.id,
	            tags: iD.util.getDefauteTags(iD.data.DataType.R_OPT_OPT, currentLayer)
			});
			
			context[isReplace ? 'replace': 'perform'](
				iD.actions.AddEntity(relation),
				t('operations.opt_opt_create.title')
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
				t('operations.opt_opt_create.title')
			);
    	}
    	
    	context.enter(iD.modes.Browse(context));
    };

    operation.available = function(){
    	 return false;
    	// if(!layer.editable) return false;
        if(selectedIDs.length < 2) return false;
        var layerids = [];
        for(var i=0;i<selectedIDs.length;i++)
        {
            var entity=context.graph().entity(selectedIDs[i]);
            var layer = iD.Layers.getLayer(entity.layerId);
            if (layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
                layerids.push(layer.id)
            } else {
                return false;
            }
            if(!_.include([iD.data.DataType.OBJECT_PT/*, iD.data.DataType.FUSION_OBJECT_PT*/], entity.modelName)){
                return false;
            }
            // 灯杆和灯头
            if(entity.tags.TYPE != 2 || !_.include([4, 12, 13], Number(entity.tags.SUBTYPE))){
            	return false;
            }
            
        }
        return layer.editable && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.opt_opt_create.description');
    };
    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.opt_opt_create.title');
    return operation;
}