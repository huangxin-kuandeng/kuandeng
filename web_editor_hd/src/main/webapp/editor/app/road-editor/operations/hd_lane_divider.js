/*
 * @Author: huangxin
 * @Date: 2021-01-27 14:42:00
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 21:19:37
 * @Description: 
 */
/**
 * 创建 中心线与参考线 关联关系
 */
iD.operations.hdLaneDivider = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_Lane_Divider;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var divider;
    var laneList = [];
	var dividerList = [];

    var operation = function() {
        var actions = [];
        var members = [];
        laneList.forEach(function(barrier){
            members.push({
                id: barrier.id,
                modelName: barrier.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.HD_LANE_ID
            });
        });
        dividerList.forEach(function(divider){
            members.push({
                id: divider.id,
                modelName: divider.modelName,
                type: iD.data.GeomType.WAY,
                role: iD.data.RoleType.DIVIDER_ID
            });
        });
        var relation = iD.Relation({
            modelName: relationName,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: iD.util.getDefauteTags(relationName, currentLayer)
        });
        actions.push(iD.actions.AddEntity(relation));

        if (actions.length) {
            actions.push(t('operations.hdLane_divider.title'));
            context.perform.apply(context, actions);
        }

        context.enter(iD.modes.Browse(context));
		
		context.buriedStatistics().merge(0, iD.data.DataType.HD_LANE);
    };

    operation.available = function() {
        if (selectedIDs.length != 3) return false;
		
		
        var graph = context.graph(),
             layer, layer2;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.DIVIDER) {
				
				dividerList.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
				
            }else if (entity.modelName == iD.data.DataType.HD_LANE) {
				
                var rels = graph.parentRelations(entity, relationName);
                if(rels && rels.length) return false;
				
                laneList.push(entity);
				layer2 = iD.Layers.getLayer(entity.layerId, entity.modelName);
				
            } else {
                return false;
            }
        }
        if (dividerList.length != 2 && laneList.length != 1) return false;
		
		if (!layer || !layer.editable
		    || !layer2 || !layer2.editable) {
		    return false;
		}
		
		
		// var dividerNodes1 = graph.childNodes( dividerList[0] ),
		// 	dividerNodes2 = graph.childNodes( dividerList[1] ),
		// 	laneNodes = graph.childNodes( laneList[0] ),
		// 	newDividerNodes = [ 
		// 		dividerNodes1[0],
		// 		dividerNodes2[dividerNodes2.length-1]
		// 	];
		
		// var intersectLocs1 = iD.util.getSegmentIntersectNodesLoc(  dividerNodes1, laneNodes ),
		// 	intersectLocs2 = iD.util.getSegmentIntersectNodesLoc(  dividerNodes2, laneNodes ),
		// 	intersectLocs3 = iD.util.getSegmentIntersectNodesLoc(  dividerNodes1, dividerNodes2 ),
		// 	intersectLocs4 = iD.util.getSegmentIntersectNodesLoc(  newDividerNodes, laneNodes );
		
		// if( intersectLocs1.length || intersectLocs2.length || intersectLocs3.length ) return false;
		// if( !intersectLocs4.length ) return false;
		
        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.hdLane_divider.description');
    };

    operation.id = 'dividerDREF';
    operation.keys = ['none'];
    operation.title = t('operations.hdLane_divider.title');

    return operation;
};