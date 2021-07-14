/**
 * Created by wangtao on 2017/9/8.
 * 批量打断DIVIDER
 * @param {Array} selectIDs 切割道路
 * @param {Array} breakWayIds 需要被打断的道路，如果null或[]时，遍历地图上所有经过selectIDs[0]的way
 * @param {Object} context
 * @param {Boolean} 是否是pic_player中的操作
 */
iD.actions.SplitDividingLine = function (selectIDs, breakWayIds, context, fromPicPlayer) {


    function getWays(graph, splitway){
    	let ways = [];
    	let extent = context.map().extent().intersection(splitway.extent(graph));
        let entitys = context.intersects(extent);
        ways  = _.uniq(entitys);
    	
        return _.filter(ways,function(d){
            return d
        	    && d.type === iD.data.GeomType.WAY
                && d.id!=splitway.id
                && d.modelName === iD.data.DataType.DIVIDER
        })
    }
    function getWaysFPic(graph){
    	let ways = [];
    	if(breakWayIds && breakWayIds.length){
        	ways = _.map(breakWayIds, function(wid){
        		return context.hasEntity(wid);
        	});
        	ways  = _.uniq(ways);
        }
    	
        return _.filter(ways,function(d){
            return d
        	    && d.type === iD.data.GeomType.WAY
                && d.modelName === iD.data.DataType.DIVIDER
        })
    }

    var action = function (graph) {
        if(fromPicPlayer){
        	graph = splitDividersFPic(graph);
        }else {
        	graph = splitDividers(graph);
        }
        
        return graph;
    };
    
    function splitDividers(graph){
    	if(selectIDs.length !=1){
            return graph;
        }
        let splitWay = graph.entity(selectIDs[0]);
        let ways = getWays(graph, splitWay);
        let splitWayNodes = splitWay.nodes;
        var lineCalute=iD.util.LineCalCulate();
        ways.forEach(way=>{
            let locs=lineCalute.getIntersectLoc(splitWayNodes,way.nodes,graph);
            if(!locs.length) return false;
            graph = splitWayByCrossLocs(graph, way, locs);
            // console.log(locs)
        });
        graph = iD.actions.DeleteWay(splitWay.id)(graph);
        if(!ways.length){
        	context.undo();
        }
        
        selectIDs.length = 0;
        return graph;
    }
    
    
    function splitDividersFPic(graph){
    	if(selectIDs.length < 2){
            return graph;
        }
        let ways = getWaysFPic(graph);
        let splitNodeLocs = selectIDs;
        ways.forEach((way, idx)=>{
            let locs = iD.util.getIntersectLoc(splitNodeLocs, way.nodes, graph);
            if(!locs.length) return false;
            graph = splitWayByCrossLocs(graph, way, locs, idx);
            // console.log(locs)
        });
        if(!ways.length){
        	context.undo();
        }
        
        selectIDs.length = 0;
        return graph;
    }
    
    function splitWayByCrossLocs(graph, way, crossLocs, wayidx){
    	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE);
        crossLocs.forEach(loc=>{
            //TODO 没有做节点距离处理
            // iD.geo.chooseEdge 计算的索引值，经常错误，四个节点的线，在中间打断的话，计算一般是正确的
            // 可能是由于第二个参数不是屏幕坐标导致的
            let choice = iD.geo.chooseEdge(graph.childNodes(way), context.projection(loc), context.projection);
            let edge = [way.nodes[choice.index - 1], way.nodes[choice.index]];
//              let edge = [ way.nodes[choice.index], way.nodes[choice.index + 1] ];
            let node = iD.Node({
                layerId: currentLayer.id,
                identifier: currentLayer.identifier,
                loc: loc,
                tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, currentLayer),
                modelName: iD.data.DataType.DIVIDER_NODE
            });
            node.tags.DASHTYPE = 5;
            graph = iD.actions.AddMidpoint({loc: loc, edge: edge}, node)(graph);
//              graph = iD.actions.Disconnect(node.id, [way.id])(graph);
            graph = iD.actions.Disconnect(node.id, [way.id])(graph);
            
            var player = iD.picUtil.player;
            if(fromPicPlayer && player){
            	graph = iD.actions.createDividerNodeMeasureinfo(node.id, way.nodes)(graph);
            	/*
            	// 视频操作后 breakWayIds 中的第一条是参考线
            	// 批量打断添加测量信息、记录第一个打断的参考线上的点
            	var handle = iD.measureinfo.handle();
            	let picData = iD.AutoMatch.locsToPicPlayer([loc], player)[0];
            	if(picData && wayidx == 0){
            		let xy = picData.coordinates[0];
            		graph = handle.addEntity(graph, node, {
            			type: 4,
//                      method:8,
            			trackPointId: player.pic_point.tags.trackPointId,
            			trackId: player.dataMgr.trackId,
            			imgOffset: {'x': parseInt(xy[0]), 'y': parseInt(xy[1])}   //{x, y}
            		});
            	}
            	*/
            }
          	/*
          	context.replace(
          		iD.actions.AddMidpoint({loc: loc, edge: edge}, node),
          		iD.actions.Disconnect(node.id, [way.id]),
          		t('modes.cut_divider.description')
          	);
          	*/
        });
        
        return graph;
    }

    action.disabled = function (graph) {
        return false;
    };
    return action;
}