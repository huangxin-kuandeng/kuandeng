

/*视频反投函数*/
/*ways-面
K-相机参数
trackPoint*/

import {
    disease_player
} from './disease_player.js';

var projection = {};

projection.getShowWays = function(ways, K, trackPoint) {
	let geometrys = [],
		context = editor.context,
		R = trackPoint.tags.R,
		T = trackPoint.tags.T,
		width = trackPoint.tags.picW,
		height = trackPoint.tags.picH;
	let rect = [
		[0, 0],
		[width, height]
	];
	let lassExtend = iD.util.lassExtend,
		way, nodes, node, coordinate;
	let coordinates = [],
		pointMappingNode = {},
		nodesStroe = [];
	let _stroeNode;
	for (let i = 0, len = ways.length; i < len; i++) {
		way = ways[i];

		nodes = way.nodes;
		coordinates = [];
		pointMappingNode = {};
		nodesStroe = [];

		for (let i = 0, len = nodes.length - 1; i < len; i++) {
			node = context.entity(nodes[i]);
			let ePoint = context.entity(nodes[i + 1]);
			var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
			coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);

			if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
				ePoint = context.entity(nodes[nodes.length - 2]);
				n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
			}

			if (coordinate[2] > 0) {
				nodesStroe.push({
					'coordinate': [coordinate[0], coordinate[1], node.loc[2]],
					nodeId: node.id
				});
			} else if (n2[2] > 0) {

				if (n2[1] > height || n2[1] < 0) {
					point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[1]);
				} else {
					point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[0]);
				}
				
				nodesStroe.push({
					'coordinate': point,
					nodeId: node.id
				});
			} else {
				nodesStroe.push({
					'coordinate': [],
					nodeId: node.id
				});
			}
		}
		let lastNode = context.entity(_.last(nodes));
		coordinate = iD.util.trackPointToPicPixe(K, trackPoint, lastNode.loc);

		if (coordinate[2] > 0) {
			nodesStroe.push({
				'coordinate': [coordinate[0], coordinate[1], lastNode.loc[2]],
				nodeId: lastNode.id
			})
		}

		let _index = 0;
		for (let j = 0; j < nodesStroe.length; j++) {
			_stroeNode = nodesStroe[j];
			if (_stroeNode.coordinate.length == 0) {
				if (coordinates.length > 1) {
					geometrys.push({
						coordinates,
						entity: way,
						pointMappingNode,
						type: 'LineString'
					})
				}
				pointMappingNode = {};
				coordinates = [];
				_index = 0;
			} else {
				coordinates.push(_stroeNode.coordinate);
			   pointMappingNode[_index] = _stroeNode.nodeId;
				_index++;
			}
		}


		if (coordinates.length > 1) {
			geometrys.push({
				coordinates,
				entity: way,
				pointMappingNode,
				type: 'LineString'
			})
		}
	}
	return geometrys;
};

projection.getShowPolygon = function(ways, K, trackPoint) {
	let geometrys = [],
		R = trackPoint.R,
		T = trackPoint.T,
		width = disease_player.camera_params.imageWidth,
		height = disease_player.camera_params.imageHeight;
	let rect = [
		[0, 0],
//      	[width, height]
	];
	let lassExtend = iD.util.lassExtend,
		way, nodes, node, coordinate, loc, point;
	let coordinates = [],
		pointMappingNode = {},
		nodesStroe = [];
	let _stroeNode;
	
	nodes = ways._nodes;
	coordinates = [];
	pointMappingNode = {};
	nodesStroe = [];
	var arr = [];

	for (let i = 0, len = nodes.length-1; i < len; i++) {
		node = nodes[i];
		let ePoint = {
				id: 'node_' + i,
				loc: nodes[(i + 1) % nodes.length]
			};
		coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
		var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	   
		if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
			ePoint = {
				id: 'node_' + (nodes.length - 2),
				loc: nodes[nodes.length - 2]
			};
			n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
		}
		if (coordinate[2] > 0) {
			arr.push({
				index: i,
				nodeId: 'node_' + i,
				loc: this.get_test([coordinate[0], coordinate[1]], K),
				lloc:node,
				coordinate: [coordinate[0], coordinate[1]]
			});
		}else if (n2[2] > 0) {
			// let loc = ePoint.loc;

			// arr.forEach(d => {
		
			//     if (d.nodeId == ePoint.id) loc = d.loc;
		
			// })
			var p = iD.util.KRt(K, R, T);
			var x1 = iD.util.UTMProjection(node);
			var x2 = iD.util.UTMProjection(ePoint.loc);
			var px1 = matrix.multiply(p, x1);
			var px2 = matrix.multiply(p, x2);
			if (n2[1] > height) {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[1]);
			} else {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[0]);
			}
			// }
			arr.push({
				index: i,
				nodeId: 'node_' + i,
				lloc:node,
				loc: this.get_test([point[0], point[1]], K),
				coordinate: [point[0], point[1]]
			});
		} else {
			var _t = _.last(arr);
			var endPoint = ePoint;
			if (_t && _t.index != (i - 1)) {
				endPoint = {
					id: 'node_' + i,
					loc: nodes[(i - 1) % nodes.length]
				}
			}
			loc = endPoint.loc; 
			if(_t){
				var _n = nodes[_t.index];
				loc = _t.loc ? [_t.loc.lng, _t.loc.lat, _t.loc.elevation] : _n;
			}
			arr.forEach(d => {
				if (d.nodeId == endPoint.id) loc = [d.loc.lng, d.loc.lat, d.loc.elevation];
			})
			var _p = iD.util.trackPointToPicPixe(K, trackPoint, loc);
			coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
			if (_p[1] > height) {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[1]);
			}else{
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[0]);
			}
			if(_.isEmpty(point)) continue;
			arr.push({
				index: i,
				lloc:node,
				nodeId: 'node_' + i,
				loc: this.get_test([point[0], point[1]], K),
				coordinate: [point[0], point[1]]
			});
		}
	}
//  	if (_.isEmpty(arr)) continue;

	arr.forEach((d, i) => {
		nodesStroe.push({
			coordinate: d.coordinate,
			nodeId: d.nodeId,
		})
	})
	for (let j = 0; j < nodesStroe.length; j++) {
		_stroeNode = nodesStroe[j];
		coordinates.push(_stroeNode.coordinate);
		pointMappingNode[j] = _stroeNode.nodeId;
	}
//  	if (!pGinPic(coordinates, width, height)) continue;
	if (coordinates.length >= 2) {
		geometrys.push({
			coordinates,
			entity: ways,
			pointMappingNode,
			type: 'Polygon'
		})
	}
	return geometrys;
};

/*player.pic_point --  当前轨迹点*/
projection.get_test = function(xy, K) {
	let player = disease_player.track_list[disease_player.current_num - 1],
		cameraHeight = disease_player.camera_params.cameraHeight,
		pic_point = {
			loc: [ player.x, player.y ]
		};
	// let plane = player.dataMZgr.planes && player.dataMgr.planes.get(player.wayInfo.trackId);
	let geometry = null;
	let utm = LLtoUTM(pic_point.loc[0], pic_point.loc[1]);
	let z = player.z - cameraHeight;
	var lonlat = iD.util.picPixelToLonLat(_.clone(K), player, utm.zoneNumber, utm.designator, xy, z);
	geometry = {
		lng: lonlat[0],
		lat: lonlat[1],
		elevation: z
	};
	return geometry;
};

/*相机参数--整理*/
projection.cameraParams = function(time,type=false){
	var params = [
		[disease_player.camera_params.focusX, 0, disease_player.camera_params.principlePointX],
		[0, disease_player.camera_params.focusX, disease_player.camera_params.principlePointY],
		[0, 0, 1]
	];
	return params;
};

export {
    projection
};





