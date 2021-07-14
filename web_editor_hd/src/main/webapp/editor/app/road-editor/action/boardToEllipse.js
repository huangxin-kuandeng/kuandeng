/**
 * 路牌转圆形路牌
 */
iD.actions.boardToEllipse = function(selectedIDs, context) {
	var EllipseShape = zrender.Ellipse;
	var CircleShape = zrender.Circle;
	return function(graph){
		
		var selectEntity = context.entity(selectedIDs[0]);
		var oldNodes = graph.childNodes(selectEntity);
		if (oldNodes.length != 5) {
			Dialog.alert('请确保转换路牌框为矩形框');
			return graph;
		}

		var measures = getEntitiesMeasureInfo(oldNodes, graph);
		var locs  = _.map(measures, 'pixel');
		var bounds = getBounds(locs);
		var rectCenter = [(bounds[0][0] + bounds[1][0])/2, (bounds[0][1] + bounds[1][1])/2];
		drawPoint(rectCenter, 'rgba(0, 0, 255, 0.8)');
		// var newNodes = _.clone(oldNodes);
		// newNodes.pop();
		// var locs = _.map(oldNodes, 'loc');
		// var newLocs = _.clone(locs);
		// newLocs.pop();
		// var rectCenter = iD.util.getCenterPoint(oldNodes);
		var nodeIds = [];
		var currLayer = iD.Layers.getLayer(selectEntity.layerId);
		var perpendicularPoints = [];
		//获取垂点
		for (let i = 0; i < locs.length; i++) {
			// var A = locs[i];
			// if (i == locs.length - 1) {
			// 	var B = locs[0];
			// } else {
			// 	var B = locs[i+1];
			// }
			//console.log(locs[i])
			// drawPoint(locs[i], 'rgba(0, 0, 255, 0.8)');
			if (i == locs.length - 1) continue;
			let A = locs[i];
			let B = locs[i+1];
			
			let perpendicular = iD.util.perpendicular(rectCenter, A, B);
			perpendicularPoints.push(perpendicular);
			
			// let nodeLocs = iD.util.getSquareBezier(A, B, rectCenter); 
			// for (var j = 0; j < nodeLocs.length; j++) {
			// 	drawPoint(nodeLocs[j], 'rgba(0, 0, 0, 0.8)')
				// var node = iD.Node({
				// 	layerId: currLayer.id,
				// 	loc: nodeLocs[j],
				// 	modelName: iD.data.DataType.TRAFFICSIGN_NODE,
				// 	tags: iD.util.getDefauteTags(iD.data.DataType.TRAFFICSIGN_NODE, currLayer)
				// });
				// graph = graph.replace(node);
				// nodeIds.push(node.id);
			// }
		}
		//获取圆点
		var vertexIndex = 1; 
		for (let i = 0; i < perpendicularPoints.length; i++) {
			let A = perpendicularPoints[i], B;
			if (i == perpendicularPoints.length - 1){
				B = perpendicularPoints[0];
			} else {
				B = perpendicularPoints[i+1];
			}
			// drawPoint(A, 'rgba(0, 0, 0, 0.8)');
			let vertex = locs[vertexIndex];
			if (vertexIndex < locs.length) {
				vertexIndex++;
			} else {
				vertexIndex = 0;
			}
			let nodeLocs = iD.util.getSquareBezier(A, B, vertex, 1.1, 0.2); 
			// let nodeLocs = iD.util.getSquareBezier(B, A, rectCenter); 
// 			let nodeLocs = iD.util.getSquareBezier(rectCenter, A, B); 
			//let nodeLocs = iD.util.getSquareBezier(rectCenter, B, A); 
			for (var j = 0; j < nodeLocs.length; j++) {
				// drawPoint(nodeLocs[j], 'rgba(0, 0, 0, 0.8)')
				// let loc = iD.picUtil.pixelToLngLat(nodeLocs[j]);
				let loc = iD.picUtil.pixelToLngLatByPlane(nodeLocs[j], selectEntity.tags.PLANE, iD.picUtil.player.pic_point);
				// if (i == 0 && j < 4) {
				// 	oldNodes[j].loc = loc;
				// 	graph = graph.replace(oldNodes[j]);
				// 	nodeIds.push(oldNodes[j].id);
				// } else {
					var node = iD.Node({
                        layerId: currLayer.id,
                        identifier:currLayer.identifier,
						// loc: [loc.lng, loc.lat, loc.elevation],
						loc: loc,
						modelName: iD.data.DataType.TRAFFICSIGN_NODE,
						tags: iD.util.getDefauteTags(iD.data.DataType.TRAFFICSIGN_NODE, currLayer)
					});
					graph = graph.replace(node);
					nodeIds.push(node.id);
				// }
				
			}
			
		}

		//selectEntity.nodes = nodeIds;
		// console.log(nodeIds)
		var trafficsign = iD.Way({
            layerId: currLayer.id,
            identifier:currLayer.identifier,
            nodes: nodeIds,
            modelName: iD.data.DataType.TRAFFICSIGN,
            tags: iD.util.getDefauteTags(iD.data.DataType.TRAFFICSIGN, currLayer)
		});
		// console.log(trafficsign.id)
		
		// selectEntity.nodes.forEach(function(nodeId){
		// 	graph = iD.actions.createDividerNodeMeasureinfo(nodeId, selectEntity.nodes)(graph);
		// });
		// graph = graph.replace(selectEntity);
		graph = graph.replace(trafficsign);
		graph = iD.actions.DeleteMultiple(selectedIDs)(graph);
		// oldNodes.pop();
		// oldNodes.forEach(function(node){
		// 	graph = iD.actions.DeleteNode(node.id)(graph);
		// });
		return graph;
	}

	function drawPoint(cenXY, color) {
		var r = '6';
		var options = {
			shape : {
				cx: cenXY[0],
				cy: cenXY[1],
				r: r
			},
			style : {
				fill : color,
				stroke : color,
				lineWidth : 1
			}
		};
		
		var marker = new CircleShape(options);
		iD.picUtil.player._zrender.add(marker);
	}

	function getEntitiesMeasureInfo(nodes, graph) {
        if (nodes) {
            var newTrackPointId, measures = [];
            nodes.forEach(function(n){
                var measureinfo = graph.parentRelations(n, iD.data.DataType.MEASUREINFO);
                if (measureinfo && measureinfo[0]) {
					var PARAMETER = JSON.parse(measureinfo[0].tags.PARAMETER);
					if (!PARAMETER.Paras) return;
                    var node = PARAMETER.Paras.nodes[0],
                        trackPointId = node.trackPointId,
                        trackId = node.trackId,
                        pixel = [node.x, node.y];

                    if (pixel[0] < 0 || pixel[1] < 0) {
                        errorData[n.id] = measureinfo[0];
                    } else {
                        measures.push({
                            n: n.id,
                            measureinfoId: measureinfo[0].id,
                            trackPointId: trackPointId,
                            trackId: trackId,
                            pixel: pixel
                        })
                    }
                    /*if (newTrackPointId != trackPointId) {
                        if (!newTrackPointId) {
                            newTrackPointId = trackPointId;
                        }
                    }*/
                }
            })
            return measures;
        }
	}
	
	function getBounds(path){
        var bounds = [_.clone(path[0]), _.clone(path[1])];
        for(var i=1,l=path.length;i<l;++i){
            bounds[0][0]=Math.min(bounds[0][0],path[i][0]);
            bounds[0][1]=Math.min(bounds[0][1],path[i][1]);
            bounds[1][0]=Math.max(bounds[1][0],path[i][0]);
            bounds[1][1]=Math.max(bounds[1][1],path[i][1]);
        }
        return bounds;
    }
}