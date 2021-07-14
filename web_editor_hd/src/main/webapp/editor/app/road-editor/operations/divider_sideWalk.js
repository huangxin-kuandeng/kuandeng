/**
 * 创建 人行道/车道线  关联关系（临时关系，暂时使用TYPE= 1：ChainFurniture，SUBTYPE= 0：未调查，代表side_walk的分类；）
 * 条件：
 * a.一条人行道只可关联一条车道线；
 * b.一条车道线可以与多条人行道进行关联；
 * c.存在关联关系的人行道，不可再次创建关联关系；
 * d.存在关联关系的车道线、人行道，点击任意一个要素对所关联的要素均高亮显示；
 * e.高亮显示功能数据不可编辑的情况下选择任意一条也可显示（例，质检、验收）
 */
iD.operations.dividerSideWalk = function(selectedIDs, context) {
    var sideWalks = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_OPL);
    var way;

    var operation = function() {
    	var actions = [];
    	var members = [{
            id: way.id,
            modelName: way.modelName,
            type: iD.data.GeomType.WAY,
            role: iD.data.RoleType.DIVIDER_ID
        }];
        for (var i =0; i < sideWalks.length; i++) {
            var sideWalk = sideWalks[i];
            members.push({
                id: sideWalk.id,
                modelName: sideWalk.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.OBJECT_PL_ID
            });
        }
        var relation = iD.Relation({
            modelName: iD.data.DataType.R_DIVIDER_OPL,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(iD.data.DataType.R_DIVIDER_OPL, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.dividerSideWalk.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
    };

    operation.available = function() {
        if(selectedIDs.length < 2) return false;
        
        var graph = context.graph(), layer, layer2;
        for (var i =0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.OBJECT_PL && entity.tags.TYPE == '1' && entity.tags.SUBTYPE == '4') {
                sideWalks.push(entity);
                layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else if (entity.modelName == iD.data.DataType.DIVIDER) {
                if(way) return false;
                way = (entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }else {
            	return false;
            }
        }
        if (!way || sideWalks.length < 1) return false;
        
        var isBreak = false;
        var relationTLs = [];
        for (var i =0; i < sideWalks.length; i++) {
            relationTLs = relationTLs.concat(graph.parentRelations(sideWalks[i], iD.data.DataType.R_DIVIDER_OPL));
        }
        var selectWayIds = _.pluck(sideWalks, 'id');
        relationTLs.forEach(function(relation){
        	if(isBreak) return ;
        	for(var m of relation.members){
        		if(selectWayIds.indexOf(m.id) > -1){
        			isBreak = true;
        			break;
        		}
        	}
        });
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
        return t('operations.dividerSideWalk.description');
    };

    operation.id = 'merge';
    operation.keys = [iD.ui.cmd('W')];
    operation.title = t('operations.dividerSideWalk.title');

    return operation;
};