iD.operations.WayMerge = function(selectedIDs, context) {
    var join = iD.actions.WayJoin(selectedIDs),
        merge = iD.actions.WayMerge(selectedIDs),
        mergePolygon = iD.actions.MergePolygon(selectedIDs);

    var operation = function() {
        var annotation = t('operations.merge.annotation', {n: selectedIDs.length}),
            action;

        context.mode().setSelectedIDs([]);
        if (!join.disabled(context.graph())) {
        	// 非ROAD
            action = join;
        } else if (!merge.disabled(context.graph())) {
            action = merge;
        } else if(!mergePolygon.disabled(context.graph())) {
            action = mergePolygon;
        }
        if(!action){
            return false;
        }
        var survivor = context.entity(selectedIDs[0]);
        //点击合并线
		iD.logger.editElement({
			'tag':'waymerge',
			'entityId':survivor.osmId() || '',
			'modelName': survivor.modelName
		});
        
		
        var survivor_2 = context.entity(selectedIDs[1]);
		var mid = mergeid([
			survivor, survivor_2
		]);
		
        // context.mode().setSelectedIDs([mid]);
        context.enter(iD.modes.Select(context, [mid]));
        context.perform(action, annotation);
        
        context.event.entityedite({entitys: []});
        // context.enter(iD.modes.Select(context, selectedIDs.filter(function(id) { return context.hasEntity(id); }))
        //     .suppressMenu(true));
        context.enter(iD.modes.Browse(context));
        return true;
    };

    function mergeid(lines) {
        var start = lines[0],
            end = lines[1];
        if (start.nodes[0] == end.nodes[0] || start.nodes[0] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[0];
        } else if (start.nodes[start.nodes.length - 1] == end.nodes[0] || start.nodes[start.nodes.length - 1] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[start.nodes.length - 1];
        }
    }

    operation.available = function() {
        if(selectedIDs.length != 2){
            return false;
        }
        for(let i=0,len=selectedIDs.length;i<len;i++){
            var entity = context.entity(selectedIDs[i]);
        	// 编辑范围判断
        	if(!iD.util.entityInPlyGon(entity, context)){
				return false;
			}
            // var editable = iD.Static.layersInfo.isEditable(entity.modelName?entity.modelName:false);
            var editable = iD.Layers.getLayer(entity.layerId, entity.modelName).editable;
            if (!editable || (entity.modelName == iD.data.DataType.ROAD || entity.type === 'node' || entity.isArea())) {
                return false;
            }
        }
        // var way = context.entity(selectedIDs[0]);
        // if(way.modelName == iD.data.DataType.ROAD){
        //     return false;
        // }
        return true && !operation.disabled();
    };

    operation.disabled = function() {
        return join.disabled(context.graph()) &&
            merge.disabled(context.graph()) &&
            mergePolygon.disabled(context.graph());
    };

    operation.tooltip = function() {
        var j = join.disabled(context.graph()),
            m = merge.disabled(context.graph()),
            p = mergePolygon.disabled(context.graph());

        if (j === 'restriction' && m && p)
            return t('operations.merge.restriction', {relation: context.presets().item('type/restriction').name()});

        if (p === 'incomplete_relation' && j && m)
            return t('operations.merge.incomplete_relation');

        if (j && m && p)
            return t('operations.merge.' + j);

        return t('operations.merge.description');
    };

    operation.id = 'merge';
    operation.keys = [t('operations.merge.key')];
    operation.title = t('operations.merge.title');

    return operation;
};
