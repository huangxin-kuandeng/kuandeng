/**
 * 根据 车道属性变化点（LA）中的车道类型，生成分隔线起终点；
 * LANETYPE：单位cm
 * 3-入口车道，4-出口车道：划200，空300
 */
iD.operations.createSeparationPoints = function(selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer(iD.data.DataType.DIVIDER);
    let modelName = iD.data.DataType.DIVIDER_ATTRIBUTE;
    let projection = context.projection;
    // 出/入口道路分隔线：划3m，空3m
    let seDisArr = [3, 3];
    let loggerType = '';
		// 2-终点、1-起点
//		dashTypeArr = [2, 1];
// 		dashTypeArr = [1, 2];

	function createSeparationPoints(startNode,endNode,dashTypeArr, param = {}){
        let totalDis = iD.util.distanceByLngLat(startNode.loc, endNode.loc);
        // 距离不足
        param.count = param.count || 0;
        param.dist = param.dist || 0;
        // 减去上一线段的最后剩余距离；
        let count = param.count || 0;
        let nowDis = seDisArr[count % 2];
        if(totalDis + param.dist < nowDis) {
        	param.dist += totalDis;
        	return [];
        }
        let angleA = iD.util.LineCalCulate().getAngle(startNode.loc[0], startNode.loc[1], endNode.loc[0], endNode.loc[1]);

        let addedDis = -param.dist, addedNodes = [], layer = iD.Layers.getLayer(startNode.layerId);
        do{
            nowDis = seDisArr[count % 2], dashType = dashTypeArr[count % 2];
            addedDis += nowDis;
            let AB = addedDis, BC, AC;
            BC = Math.sin(angleA * Math.PI / 180) * AB;
            AC = Math.cos(angleA * Math.PI / 180) * AB;

            let newLoc = iD.util.getLngLatByOffsetMeter(startNode.loc, BC, AC);
            let newLonlat = [
                newLoc[0],
                newLoc[1],
                startNode.loc[2]
            ];

            // var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
            let node = iD.Node({
                modelName: iD.data.DataType.DIVIDER_NODE,
                layerId: layer.id,
                identifier:layer.identifier,
                tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, layer), {
                    DASHTYPE: dashType
                }),
                loc: newLonlat
            });
            addedNodes.push(node);

            count ++;
        }while((addedDis + seDisArr[count % 2]) < totalDis);
        
        // 记录最后一段的剩余距离
        param.count = count || 0;
        param.dist = (totalDis - addedDis);
        if(param.dist <= 0) param.dist = 0;
        
        // 平均z值
   		var zDiff = startNode.loc[2] - endNode.loc[2], avgZ = zDiff / (addedNodes.length + 1);
   		var i=0;
   		for(i = 0; i < addedNodes.length; i++){
   			addedNodes[i].loc[2] = startNode.loc[2] - avgZ * (i + 1);
   		}
        return addedNodes;
	}
	
	function isEndsNode(node, wayNodes){
		var index = wayNodes.indexOf(node);
		return index == 0 || index == wayNodes.length - 1;
	}

    var operation = function(){
        if(loggerType){
            iD.logger.editElement({
                'tag': "menu_create_separation_" + loggerType
            });
        }
//     	let graph = context.graph();
// 		let way = context.entity(selectedIDs[0]);
// 		let wayNodes = graph.childNodes(way);
// 		let relation = iD.util.getDividerParentRelation(context.graph(), way, iD.data.DataType.DIVIDER_ATTRIBUTE);
// 		// 方向是否为逆向
// 		let isReverse = _.pluck(relation.members, 'id').indexOf(wayNodes[1].id) > -1;
// 		// 线与正北方向的夹角计算
// 		let lonlat1 = wayNodes[isReverse ? 1 : 0], lonlat2 = wayNodes[isReverse ? 0 : 1];
// 		let totalDis = iD.util.distanceByLngLat(lonlat1.loc, lonlat2.loc);
//
//         let angleA = iD.util.LineCalCulate().getAngle(lonlat1.loc[0], lonlat1.loc[1], lonlat2.loc[0], lonlat2.loc[1]);
// //      console.log('线路与正北方向夹角为：' + angleA, [lonlat1.loc, lonlat2.loc].join(' - '));
//
//         let count = 0;
//         let addedDis = 0;
//         let actions = [], addedNodes = [];
//         do{
//         	let nowDis = seDisArr[count % 2], dashType = dashTypeArr[count % 2];
//         	addedDis += nowDis;
//         	let AB = addedDis, BC, AC;
//         	BC = Math.sin(angleA * Math.PI / 180) * AB;
//         	AC = Math.cos(angleA * Math.PI / 180) * AB;
//         	/*
//         	// 10米=0.000125°
//         	let xDiff = BC * 0.0000125;
//         	let yDiff = AC * 0.0000125;
//         	let newLonlat = [
//         		lonlat1.loc[0] + xDiff,
//         		lonlat1.loc[1] + yDiff,
//         		lonlat1.loc[2]
//         	];
//         	*/
//         	let newLoc = iD.util.getLngLatByOffsetMeter(lonlat1.loc, BC, AC);
//         	let newLonlat = [
//         		newLoc[0],
//         		newLoc[1],
//         		lonlat1.loc[2]
//         	];
//
//         	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
//         	// DASHTYPE：1-起点，2-终点
// 	        let node = iD.Node({
// 				modelName: iD.data.DataType.DIVIDER_NODE,
// 	            layerId: currentLayer.id,
// 	            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, currentLayer), {
// 	            	DASHTYPE: dashType
// 	            }),
// 	            loc: newLonlat
// 			});
// 			addedNodes.push(node);
//
//         	count ++;
//         }while((addedDis + seDisArr[count % 2]) < totalDis);
        let graph = context.graph(),entity = context.entity(selectedIDs[0]);
        let relations,isFirst,wayNodes,startNode,endNode,relation,rol,startIndex,endIndex,actions=[],
            index = 1,
            way = entity,_dashTypeArr = [1,2], // 1-起点、2-终点
            addedNodes = [];
        if(entity instanceof iD.Node){
            relations = graph.parentRelations(entity,modelName);
            way = graph.parentWays(entity)[0];
            index = way.nodes.indexOf(entity.id);
            if(relations.length==1){
                relation = relations[0];
            }else {
                relation = graph.parentRelations(way,modelName)[0];
            }
            let dividerId = relation.memberByRole(iD.data.RoleType.DIVIDER_ID).id;
            if(dividerId != way.id){
                return ;
            }
            _dashTypeArr.reverse();
			// 第一个新点是终点
			var typeArr = _.clone(_dashTypeArr);
            rol = relation.memberByRole(iD.data.RoleType.DIVIDER_NODE_ID);
            wayNodes = graph.childNodes(way);
            isFirst = way.first() == rol.id;
            // 逆向时
            var directionNodes = _.clone(wayNodes);
            if(!isFirst) directionNodes.reverse();
//          startNode = isFirst ? wayNodes[index] : wayNodes[0];
//          endNode = isFirst ? wayNodes[wayNodes.length - 1] : wayNodes[index];
//			startIndex = way.nodes.indexOf(startNode.id);
//			endIndex = way.nodes.indexOf(endNode.id);
			var dirIndex = directionNodes.indexOf(wayNodes[index]);
            startNode = directionNodes[dirIndex];
            endNode = directionNodes[directionNodes.length - 1];
			startIndex = directionNodes.indexOf(startNode);
			endIndex = directionNodes.indexOf(endNode);
            // 从当前 选中的起点开始计算；
            var param = {};
            for(var i = startIndex; i < endIndex; i++){
            	var start = directionNodes[i];
            	var end = directionNodes[i + 1];
            	var newNodes = createSeparationPoints(start, end, typeArr, param);
        		newNodes.length && addedNodes.push(...newNodes);
            }
//          addedNodes.forEach(function(d){
//          	iD.picUtil.createIntersectionDatum(d.loc);
//          });
            // 最后一个新点，若是起点，并且与最后一个点之间少于3m（没有终点），那么删除该起点；
            if(addedNodes.length && _.last(addedNodes).tags.DASHTYPE === 1){
            	addedNodes.pop();
            }
            
            // index = isFirst ? index+1: index-1;
        }else if(entity instanceof iD.Way){
            relation = iD.util.getDividerParentRelation(graph, entity, modelName);
            rol = relation.memberByRole(iD.data.RoleType.DIVIDER_NODE_ID);
            isFirst = entity.first() == rol.id;
            wayNodes = graph.childNodes(entity);
            startNode = wayNodes[isFirst ? 0 : 1];
            endNode = wayNodes[isFirst ? 1 : 0];
            addedNodes = createSeparationPoints(startNode,endNode,_dashTypeArr);
        }

       	if(addedNodes.length){
       		if(entity instanceof iD.Way){
                actions.push(iD.actions.ChangeTags(startNode.id, _.extend({}, startNode.tags, {DASHTYPE: _dashTypeArr[1]})));
                actions.push(iD.actions.ChangeTags(endNode.id, _.extend({}, endNode.tags, {DASHTYPE: _dashTypeArr[addedNodes.length % 2]})));
                actions.push(iD.actions.WayAddNodes(way.id, addedNodes, index));
                // 补充量测信息
                addedNodes.forEach(function(node){
                	actions.push(iD.actions.createDividerNodeMeasureinfo(node.id, way.nodes));
                });
                actions.push("生成分隔线起终点");
            }else{
       		    var arr = [], i = 0;
       		    // 旧点除了首尾都设置 中间点 ，ABCD，AB=10m，BC=2m，C会指定起终点
       		    for(i=startIndex+1;i<endIndex;i++){
//                  actions.push(iD.actions.ChangeTags(wayNodes[i].id, _.extend({}, wayNodes[i].tags, {
                    actions.push(iD.actions.ChangeTags(directionNodes[i].id, _.extend({}, directionNodes[i].tags, {DASHTYPE: 3})));
                }
                for( i = 0; i < addedNodes.length; i++){
                    var obj = _.assign(iD.geo.chooseEdge(wayNodes,projection(addedNodes[i].loc),projection),{node:addedNodes[i]});
                    arr.push(obj)
                    // arr.push(Object.assign({},iD.geo.chooseEdge(wayNodes,projection(addedNodes[i].loc),projection),{node:addedNodes[i]}));
                }

                var groups =_.groupBy(arr,'index');
                var keys = Object.keys(groups);
                var values = Object.values(groups);
                var group, wnode1, wnode2 , deleteNodes = [], minDis = 0.2;
                var insertIndex = 0;
                // let insertIndex = +keys[0];
                actions.push(iD.actions.ChangeTags(wayNodes[index].id, _.extend({}, startNode.tags, {DASHTYPE: _dashTypeArr[1]})));
                // for(i=wayNodes;i<wayNodes.length;i++){
                //
                // }
                for(i=0;i<values.length;i++){
                    group = _.pluck(values[i],'node');
                    actions.push(iD.actions.WayAddNodes(way.id, group, insertIndex+~~keys[i]));
	                // 补充量测信息
	                group.forEach(function(node){
	                	actions.push(iD.actions.createDividerNodeMeasureinfo(node.id, way.nodes));
	                });
	                
                    insertIndex = insertIndex+group.length;
                    wnode1 = wayNodes[keys[i] - 1], wnode2 = wayNodes[keys[i]];
                    if(!wnode1 && !wnode2) continue;
                    // 节点距离限制
                    group.forEach((n, _idx) => {
        				var dis = iD.util.distanceByLngLat(wnode1.loc, n.loc);
        				if(dis <= minDis){
        					deleteNodes.push(wnode1);
        				}
        				if(_idx != group.length - 1 || !wnode2) return ;
        				// 两个端点都需要判断
        				dis = iD.util.distanceByLngLat(wnode2.loc, n.loc);
        				if(dis <= minDis){
        					deleteNodes.push(wnode2);
        				}
                    });
                }
                // 排除两端的端点；
                var deleteIds = _.pluck(deleteNodes.filter(n => !isEndsNode(n, wayNodes)), 'id')
                deleteIds = _.uniq(deleteIds) ;
                actions.push(iD.actions.DeleteMultiple(deleteIds, context));
                actions.push("生成分隔线起终点");
//              console.log(arr);
            }

       	}
		
		actions.length && context.perform.apply(this, actions);
    	context.event.entityedite({
        	entitys: [entity.id]
        });
    };

    operation.available = function(){
    	// 线形作业时，不允许生成起终点
		var isLinear = iD.User.isLinearRole();
		if(isLinear) return false;
        return false;
        if(selectedIDs.length != 1) return false; //单选线
        let entity = context.entity(selectedIDs[0]);
        let graph = context.graph(),relation;
        let layer = iD.Layers.getLayer(entity.layerId);
        if (!layer || !layer.display || !layer.editable){
            return false;
        }
        if(entity instanceof iD.Node){
        	let ways  = graph.parentWays(entity);
            if(ways.length>1 || ways.length==0){
                return false;
            }
        	let relations = graph.parentRelations(ways[0],modelName);

        	if(relations.length>1 || !relations.length || (relations[0].tags.TYPE !='5' && relations[0].tags.TYPE != '33')){
        		return false;
            }
            if(relations[0].tags.TYPE == '5'){
                loggerType = 'traffic_markings';
            }else if (relations[0].tags.TYPE == '33') {
                seDisArr = [1, 1];
                loggerType = 'stop_markings';
            }
            let rol = relations[0].memberByRole(iD.data.RoleType.DIVIDER_NODE_ID),
        	wayNodes = graph.childNodes(ways[0]),
            isFirst = wayNodes[0].id == rol.id,
            index = ways[0].nodes.indexOf(entity.id),
            startNode = wayNodes[index];
            endNode = isFirst ? wayNodes[wayNodes.length-1] : wayNodes[0];
            let totalDis = iD.util.distanceByLngLat(startNode.loc, endNode.loc);
            if(totalDis <= seDisArr[0]){
                return false;
            }
			// relation = iD.util.getDividerParentRelation(graph, ways[0], modelName);
            // if(!relation.length){
        		// return false;
			// }
		}else if(entity instanceof iD.Way){
            if(entity.modelName != iD.data.DataType.DIVIDER) return false;
            relation = iD.util.getDividerParentRelation(graph, entity, modelName);
            if(entity.nodes.length != 2 || !relation || (relation.tags.TYPE !='5' && relation.tags.TYPE != '33')){
                return false;
            }
            if (relation.tags.TYPE == '33') {
                seDisArr = [1, 1]
            }
            let nodes = context.graph().childNodes(entity);
            let totalDis = iD.util.distanceByLngLat(nodes[0].loc, nodes[1].loc);
            if(totalDis <= seDisArr[0]){
                return false;
            }
		}else {
			return false;
		}
        return true;
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.dividerSeparation.title');
    };
    operation.id = 'continue';
    operation.keys = [iD.ui.cmd('R')];
    operation.title = t('operations.dividerSeparation.title');
    return operation;
}