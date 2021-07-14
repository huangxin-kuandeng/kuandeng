/**
 * 创建 停止线/车道线  关联关系（OBJECT_PL中TYPE=SYMBOL中的1/2/3）
 * 条件：
 * a.不限制停止线与车道线的关联条件
 * b.已存在关系的停止线和车道线，不可再次创建关联关系；
 */
iD.operations.dividerStopLine = function(selectedIDs, context) {
    var stoplines = [], way = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_OPL);

    var operation = function() {
        var actions = [];
        var members = [];
        for (var j = 0; j < way.length; j++) {
            var w = way[j]
            members.push({
                id: w.id,
                modelName: w.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.DIVIDER_ID
            });
        }
        for (var i = 0; i < stoplines.length; i++) {
            var stopline = stoplines[i];
            members.push({
                id: stopline.id,
                modelName: stopline.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.OBJECT_PL_ID
            });
        }
        
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_OPL,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_OPL, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.dividerStopLine.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_OPL);
    };

    operation.available = function() {
        if(selectedIDs.length < 2) return false;
        
        var graph = context.graph(), layer, layer2;
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.OBJECT_PL && entity.tags.TYPE == '2' && ['1','2','3'].includes(entity.tags.SUBTYPE)) {
                stoplines.push(entity);
                layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.DIVIDER) {
                // if(way) return false;
                way.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }else {
            	return false;
            }
        }
        if ((way.length > 1 && stoplines.length > 1) || (way.length < 1 || stoplines.length < 1)) return false;
        
        var isBreak = false;
        // var relationTLs = graph.parentRelations(way, iD.data.DataType.R_DIVIDER_OPL);
        var relationTLs = [];
        for (var i =0; i < way.length; i++) {
            relationTLs = relationTLs.concat(graph.parentRelations(way[i], iD.data.DataType.R_DIVIDER_OPL));
        }
        var selectStoplineIds = _.pluck(stoplines, 'id');
        relationTLs.forEach(function(relation){
            var members = relation.members;
            var selectIds = _.pluck(members, 'id');
            for(var id of selectIds){
                if(selectStoplineIds.indexOf(id) > -1){
                    isBreak = true;
                    break;
                }
            }
        });
        // var relationTLs = [];
        // for (var i =0; i < stoplines.length; i++) {
        //     relationTLs = relationTLs.concat(graph.parentRelations(stoplines[i], iD.data.DataType.R_DIVIDER_OPL));
        // }
        // var selectWayIds = _.pluck(stoplines, 'id');
        // relationTLs.forEach(function(relation){
        // 	if(isBreak) return ;
        // 	for(var m of relation.members){
        // 		if(selectWayIds.indexOf(m.id) > -1){
        // 			isBreak = true;
        // 			break;
        // 		}
        // 	}
        // });
        if(isBreak) return false;

        var layer3 = iD.Layers.getLayer(currentLayer.id, iD.data.DataType.R_DIVIDER_OPL);
        if (!layer || !layer2 || !layer3) {
            return false;
        }
        if (!layer.editable || !layer2.editable || !layer3.editable) {
            return false;
        }
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.dividerStopLine.description');
    };

    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.dividerStopLine.title');

    return operation;
};