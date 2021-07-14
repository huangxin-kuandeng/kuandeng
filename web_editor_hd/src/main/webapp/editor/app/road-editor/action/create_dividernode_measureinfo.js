/**
 * 车道线量测信息补充（打断、生成起终点）
 * 1、当前点前后两点有量测信息，使用量测轨迹点列表，遍历计算图像围内Y最大值（相机最近）；
 * 2、线段前后没有量测信息时，取最近轨迹点（轨迹方向误差10°，距离15米内）的轨迹反向遍历计算；
 * 3、线段前后只有一个点没有量测信息时，优先使用存在的轨迹取最近点（距离15米内），
 *     否则取其他轨迹最近点（方向误差10°，距离15米内），两个轨迹组成一组轨迹点列表，反向遍历计算；
 * 
 * @param {String} nodeid 需要补充的点
 * @param {Object} wayNodes 线节点列表，用来判断节点顺序；
 */
iD.actions.createDividerNodeMeasureinfo = function(nodeid, wayNodes) {
	var _error = false;
	
	function action(graph){
//		console.group('补充量测信息');
//		console.time('%c总计时：', 'color: red; font-weight: bold;');
		var node = graph.entity(nodeid);
		var ways = graph.parentWays(node);
		var nodes = [];
		if(ways.length == 1){
            let way = ways[0];
            if(!wayNodes){
                wayNodes = way.nodes;
            }
			nodes = getOldWaySegmentNodes(graph, way);
			graph = lineSegment(graph, nodes); 
		}else if(ways.length == 2){
			// 打断操作后，共点
			nodes = getWaysNodes(graph, ways[0], ways[1]);
			graph = lineSegment(graph, nodes);
		}else {
			_error = true;
		}
//		console.timeEnd('%c总计时：', 'color: red; font-weight: bold;');
//		console.groupEnd('补充量测信息');
		return graph;
	};
	
	action.error = function(){
		return _error;
	}
	
	action.getLineSegmentResult = getLineSegmentResult;
	
	// 生成车道线起终点时，依照每个线段进行计算
	function getOldWaySegmentNodes(graph, way){
		var _idx = way.nodes.indexOf(nodeid);
		var nodes = [];
        // 车道线只有两点时
        if(way.nodes.length == 2){
            nodes = graph.childNodes(way);
            return nodes;
        }
        // 当前点是第一个节点时
        if(_idx == 0){
            // 取前两个
            for(var i = 0; i<2; i++){
                if(wayNodes.indexOf(way.nodes[i]) > -1){
                    nodes.push(graph.entity(way.nodes[i]));
                }
            }
            return nodes;
        }
        // 当前点是最后一个节点时
        if(_idx == way.nodes.length - 1){
            // 取最后两个点
            for(var i = _idx -1; i<way.nodes.length; i++){
                if(wayNodes.indexOf(way.nodes[i]) > -1){
                    nodes.push(graph.entity(way.nodes[i]));
                }
            }
            return nodes;
        }
        // 当前点前后都有节点的情况
        // 使用当前节点前后点
		for(var i = _idx - 1; i>=0; i--){
			if(wayNodes.indexOf(way.nodes[i]) > -1){
				nodes.push(graph.entity(way.nodes[i]));
				break;
			}
		}
		for(var i = _idx + 1; i<way.nodes.length; i++){
			if(wayNodes.indexOf(way.nodes[i]) > -1){
				nodes.push(graph.entity(way.nodes[i]));
				break;
			}
        }
//		nodes = _.compact(nodes);
//		if(nodes.length == 1){
//			nodes = [nodes[0], nodes[0]];
//		} 
		return nodes;
	}
	
	function getWaysNodes(graph, way1, way2){
		var nodes = [];
		if(way1.first() == nodeid){
			nodes.push(way1.nodes[1]);
		}else {
			nodes.push(way1.nodes[way1.nodes.length - 2]);
		}
		if(way2.first() == nodeid){
			nodes.push(way2.nodes[1]);
		}else {
			nodes.push(way2.nodes[way2.nodes.length - 2]);
		}
		if(wayNodes){
			let _idx1 = wayNodes.indexOf(nodes[0]);
			let _idx2 = wayNodes.indexOf(nodes[1]);
			if(_idx1 > _idx2){
				nodes.reverse();
			}
		}
		
		return nodes.map(function(id){
			return graph.entity(id);
		});
	}
	
	// 根据前后两点的轨迹点计算
	function getLineSegmentResult(graph, nodes){
//		lineTrackAll(graph);
		let node1 = iD.picUtil.parseMeasureNodes(nodes[0], graph)[0] || {};
		let node2 = iD.picUtil.parseMeasureNodes(nodes[1], graph)[0] || {};
		let trackPoint1 = node1.trackPointId && iD.svg.Pic.dataMgr.pointId2Node(node1.trackPointId);
		let trackPoint2 = node2.trackPointId && iD.svg.Pic.dataMgr.pointId2Node(node2.trackPointId);
		
		let trackPointList = getTrackPoints2Segment(trackPoint1, trackPoint2, nodes);
		
		let result = computedFitPixel(graph, trackPointList);
		// console.log('计算结果：', result);
		return result;
	}
	
	// 根据前后两点的轨迹点计算
	function lineSegment(graph, nodes){
		let result = getLineSegmentResult(graph, nodes);
		if(!result){
			_error = true;
		}else {
			graph = createMeasureinfo(graph, result.xy, result.point);
		}
		return graph;
	}
	
	function getLineAngle(a, b){
		return iD.util.LineCalCulate().getAngle(a[0], a[1], b[0], b[1]);
	}
	
	function getNearestTrackPoint(node, opts = {}){
		var dataMgr = iD.svg.Pic.dataMgr;
		var nodes = opts.nodes;
		var dis = opts.dis || 15;
		// 轨迹与线角度相差不超10°
		var diffAngle = opts.diffAngle || 10;
		var exclude = opts.exclude || [];
		var nowTrack = opts.nowTrack;
		
        var trackList;
        if(nowTrack){
        	trackList = [nowTrack];
        }else {
        	trackList = dataMgr.tracks || [];
	        trackList = trackList.filter(function(track){
	        	return exclude.indexOf(track.trackId) == -1;
	        });
        }
        if(!trackList.length){
        	return ;
        }
        var rst = pt2TrackDist(trackList, node);
        if(!rst){
        	return ;
        }
        var trackPoint = rst.trackPoint;
        var track = rst.track;
        var pindex = track.nodes.indexOf(trackPoint);
        var trackSeg = [];
        if(pindex == track.nodes.length - 1){
        	trackSeg = [track.nodes[pindex - 1], trackPoint];
        }else {
        	trackSeg = [trackPoint, track.nodes[pindex + 1]];
        }
        var pangle = getLineAngle(trackSeg[0].loc, trackSeg[1].loc)%360;
        var wangle = getLineAngle(nodes[0].loc, nodes[1].loc)%360;
        if(!(Math.abs(pangle - wangle) <= diffAngle || 
	        Math.abs(pangle - wangle) >= (360 - diffAngle))
	        || rst.dis > dis){
        	exclude.push(track.trackId);
        	return getNearestTrackPoint(node, {
        		nodes,
        		dis,
        		diffAngle,
        		exclude
        	});
        }
        
        return {
        	track,
        	trackPoint,
        	dis
        }
	}
	
	function pt2TrackDist(trackList, node){
		var minDist = Infinity;
		var trackPoint, track;
		for(let _track of trackList){
			var rst = iD.util.pt2LineDist2(_.pluck(_track.nodes, 'loc'), node.loc);
			if(!rst || rst.i == -1){
				continue ;
			}
			if(minDist > rst.dis){
				minDist = rst.dis;
				trackPoint = _track.nodes[rst.i];
				track = _track;
			}
		}
		if(!track){
			return ;
		}
		return {
			dis: minDist,
			trackPoint,
			track
		}
	}
	
	// 量测信息不完整时，列表为轨迹逆向，越近Y越大
	function getPointListByPoints(trackPoint1, trackPoint2){
		var dataMgr = iD.svg.Pic.dataMgr;
		var pointList = [];
		// 轨迹不同时
		var track1 = dataMgr.trackId2Track(trackPoint1.tags.trackId);
		var track2 = dataMgr.trackId2Track(trackPoint2.tags.trackId);
		var idx1 = track1.nodes.indexOf(trackPoint1);
		var idx2 = track2.nodes.indexOf(trackPoint2);
		if(track1.trackId == track2.trackId){
			pointList = track1.nodes.slice(0, _.max([idx1, idx2]) + 1);
			pointList.reverse();
		}else {
			let points2 = track2.nodes.slice(0, idx2 + 1);
			points2.reverse();
			let points1 = track1.nodes.slice(idx1, track1.nodes.length);
			points1.reverse();
			pointList = points2.concat(points1);
		}
		
		return pointList;
	}
	
	// 获取需要遍历计算的轨迹点列表
	// 没有量测信息、量测信息轨迹不一致，量测信息轨迹一致
	function getTrackPoints2Segment(trackPoint1, trackPoint2, nodes){
		var dataMgr = iD.svg.Pic.dataMgr;
		var pointList = [];
		if(!trackPoint1 && ! trackPoint2){
			// 全部没有量测信息
			let rst1 = getNearestTrackPoint(nodes[0], {
				nodes: nodes
			});
			let rst2 = getNearestTrackPoint(nodes[1], {
				nodes: nodes
			});
			if(rst1 && rst2){
				trackPoint1 = rst1.trackPoint;
				trackPoint2 = rst2.trackPoint;
				pointList = getPointListByPoints(trackPoint1, trackPoint2);
			}
//			console.log('前后两点量测信息全部不存在：', trackPoint1, trackPoint2);
		}else if(!trackPoint1 || !trackPoint2){
			// 某一点没有量测信息，优先考虑同一轨迹，15米范围
			let noNode;
			if(!trackPoint1){
				noNode = nodes[0];
			}else {
				noNode = nodes[1];
			}
			let track = dataMgr.trackId2Track((trackPoint1 || trackPoint2).tags.trackId);
			let rst = getNearestTrackPoint(noNode, {
				nodes: nodes,
				nowTrack: track
			});
			
//			console.log('前后两点量测信息某项不存在：', trackPoint1, trackPoint2, rst && rst.trackPoint);
			if(rst){
				if(!trackPoint1){
					trackPoint1 = rst.trackPoint;
				}else {
					trackPoint2 = rst.trackPoint;
				}
				pointList = getPointListByPoints(trackPoint1, trackPoint2);
			}
		}
		if(pointList.length){
			return pointList;
		}
		if(!trackPoint1 || !trackPoint2){
			return pointList;
		}
		
		// 有量测信息时，默认车道线方向与轨迹方向一致
		if(trackPoint1.tags.trackId != trackPoint2.tags.trackId){
			// 轨迹AB超过2000帧分为两段轨迹，车道线经过AB的情况
			let track1 = dataMgr.trackId2Track(trackPoint1.tags.trackId);
			let track2 = dataMgr.trackId2Track(trackPoint2.tags.trackId);
			let _idx1 = track1.nodes.indexOf(trackPoint1);
			let _idx2 = track2.nodes.indexOf(trackPoint2);
			if(_idx1 >= _idx2){
				// A => B
				pointList.push(
					...track1.nodes.slice(_idx1, track1.nodes.length)
				);
				pointList.push(
					...track2.nodes.slice(0, _idx2 + 1)
				);
			}else {
				// B => A
				pointList.push(
					...track2.nodes.slice(_idx2, track2.nodes.length)
				);
				pointList.push(
					...track1.nodes.slice(0, _idx1 + 1)
				);
			}
		}else if(trackPoint1.tags.trackId == trackPoint2.tags.trackId){
			// 轨迹相同时
			// 轨迹索引之间的轨迹点
			let track = dataMgr.trackId2Track(trackPoint1.tags.trackId);
			let indexRange = [
				track.nodes.indexOf(trackPoint1),
				track.nodes.indexOf(trackPoint2)
			];
			pointList = _.range(
				_.min(indexRange),
				_.max(indexRange) + 1
			).map(function(idx){
				return track.nodes[idx];
			});
		}
		pointList = _.compact(pointList);
		return pointList;
	}
	
	// 根据轨迹所有轨迹点遍历计算
	function lineTrackAll(graph, trackPoints){
		let trackPointList = trackPoints || iD.picUtil.player.allNodes || [];
		let result = computedFitPixel(graph, trackPointList);
		if(!result){
			_error = true;
		}else {
			graph = createMeasureinfo(graph, result.xy, result.point);
		}
		
		return graph;
	}
	
	function createMeasureinfo(graph, xy, trackPoint){
//      console.log('自动计算量测信息：成功  -- ', nodeid, xy);
//      console.log('%c' + trackPoint.tags.trackId + '\t' + trackPoint.id, 'color: blue; font-weight: bold;');
		var node = graph.entity(nodeid);
		var measureAction = iD.picUtil.measureinfoAction(node, {
            trackPointId: trackPoint.id,
            trackId: trackPoint.tags.trackId,
            imgOffset: {
            	'x': xy[0], 
            	'y': xy[1]
        	}
        });
        return measureAction(graph);
	}
	
	// 合适的像素，在图像范围内，Y值最大（靠近相机）
	function computedFitPixel(graph, trackPointList){
		var result;
		var nodeLoc = [];
		if(_.isArray(nodeid)){
			nodeLoc = nodeid;
		}else {
			nodeLoc = graph.entity(nodeid).loc;
		}
//		var nowPoint = iD.picUtil.player.pic_point;
//		if(trackPointList.indexOf(nowPoint) == -1){
//			trackPointList.push(nowPoint);
//		}
		var maxY = -Infinity;
		var _idx = -1;
		var pixel;
		
		for(let i = 0; i<trackPointList.length; i++){
			let trackPoint = trackPointList[i];
			let picData = iD.AutoMatch.locsToPicPlayer([nodeLoc], null, null, trackPoint)[0];
			let xy = picData && picData.coordinates && picData.coordinates[0];
			if(!xy || !innerPixel(xy)){
				continue;
			}
			if(maxY < xy[1]){
				maxY = xy[1];
				_idx = i;
				pixel = [iD.util.roundNumber(xy[0]), iD.util.roundNumber(xy[1])];
			}
		}
		
		if(_idx != -1){
			result = {
				point: trackPointList[_idx],
				xy: pixel
			}
		}else {
			console.log('%c自动计算量测信息  失败 - ' + nodeid, 'color: red;');
		}
		
		return result;
	}
	
	function innerPixel(xy){
		if(!xy || xy.length < 2){
			return false;
		}
		let point = iD.picUtil.player.pic_point;
		let W = point.tags.picW;
		let H = point.tags.picH;
		if(xy[0] >= 0 && 
			xy[0] <= W &&
			xy[1] >= 0 &&
			xy[1] <= H){
			return true;
		}
		
		return false;
	}
	
	return action;
};