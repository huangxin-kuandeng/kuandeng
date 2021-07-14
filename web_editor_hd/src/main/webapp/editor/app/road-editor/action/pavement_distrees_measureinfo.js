/*
 * @Author: tao.w
 * @Date: 2020-08-03 17:15:38
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-23 18:11:58
 * @Description:  病害量测信息， 这个有问题， 需要轨迹相关信息不应该直接用action执行
 */
iD.actions.PavementDistreesMeasureinfo = function (nodeId, wayNodes) {

    function action(graph) {
        let node = graph.entity(nodeId);
        let track = getTrack(graph, node);
        if(!track) return graph;
        graph = calculationeMeasureinfo(graph, track, node);

        return graph;
    };


    function calculationeMeasureinfo(graph, track, node) {
        let nodes = getNodeSegment(node, track);
        let obj = computedFitPixel(node.loc, nodes, track);
        if (obj) {
            graph = createMeasureinfo(graph, obj.xy,obj.point.id,track.trackId,node);
        } else {
            let relation = graph.parentRelations(node, iD.data.DataType.MEASUREINFO)[0];
            console.log('%c自动计算量测信息  失败 - ' + node.id, 'color: red;');
            if(relation){
                graph =  graph.remove(relation);
            }
        }
        return graph;
    }

    function getNodeSegment(node, track) {
        let rst = pt2TrackDist([track], node.loc);
        let step = 100;
        if (!rst) return [];

        let startIdx = rst.i - step;
        startIdx = startIdx < 0 ? 0 : startIdx;
        let endIdx = rst.i + step;
        let nodes = track.nodes.slice(startIdx, endIdx)
        return nodes;
    }

    /**认为线对象，给定节点前后 5个点肯定会有关系存在， 如果不存在返回null
     * @description: 
     * @param {type} 
     * @return {type} 返回线对象关系
     */
    function getWayMeasureinfo(graph, nodes, idx) {
        let len = 5;
        for (let i = 1; i <= len; i++) {
            let idx1 = i + idx;
            let idx2 = idx - i;
            let node1 = nodes[idx1];
            let node2 = nodes[idx2];

            let mea1 = node1 ? graph.parentRelations(node1, iD.data.DataType.MEASUREINFO)[0] : null;
            let mea2 = node2 ? graph.parentRelations(node2, iD.data.DataType.MEASUREINFO)[0] : null;
            if (mea1) {
                return mea1;
            }
            if (mea2) {
                return mea2;
            }
        }
        return null;
    }

    /**
     * @description: 
     * @param {type} 
     * @return {type} 
     */
    function getTrackById(trackId) {
        let track = null;
        if (!trackId) return track;
        let tracks = iD.svg.Pic.dataMgr.tracks;
        track = tracks.find(d => { return d.trackId == trackId });
        return track;
    }

    function getMeasureinfoTrack(relation) {
        let track = null;
        if (!relation) return track;

        var param = JSON.parse(relation.tags.PARAMETER || '{}');
        let nodes = result = param.Paras && param.Paras.nodes || [];
        if (nodes.length == 0) return track;
        let trackId = nodes[0].trackId;
        track = getTrackById(trackId);
        return track;
    }

    function getNearestTrack(loc) {
        let tracks = iD.svg.Pic.dataMgr.tracks;
        var rst = pt2TrackDist(tracks, loc);
        return rst;
    }


    /**
     * @description: 根据点获取对应的轨迹
     * @param {type} 
     * @return {type} 
     */
    function getTrack(graph, node) {
        let track;
        let relation = graph.parentRelations(node, iD.data.DataType.MEASUREINFO)[0];
        if (relation) {
            track = getMeasureinfoTrack(relation);
            if (track) return track;
        }
        let way = graph.parentWays(node)[0];
        let nodes = graph.childNodes(way);
        let idx = nodes.indexOf(node);
        relation = getWayMeasureinfo(graph,nodes, idx);
        
        if (relation) {
            track = getMeasureinfoTrack(relation);
            // if (track) return track;
        } else {
            let dist = getNearestTrack(node.loc);
            track = dist.track;
        }
        return track;
    }


    function pt2TrackDist(trackList, loc) {
        var minDist = Infinity;
        var trackPoint, track, idx;
        for (let _track of trackList) {
            var rst = iD.util.pt2LineDist2(_.pluck(_track.nodes, 'loc'), loc);
            if (!rst || rst.i == -1) {
                continue;
            }
            if (minDist > rst.dis) {
                minDist = rst.dis;
                trackPoint = _track.nodes[rst.i];
                track = _track;
                idx = rst.i;
            }
        }
        if (!track) {
            return;
        }
        return {
            dis: minDist,
            i: idx,
            trackPoint,
            track
        }
    }



    function createMeasureinfo(graph, xy, trackPointId, trackId,node) {
        // var node = graph.entity(nodeid);
        var measureAction = iD.picUtil.measureinfoAction(node, {
            trackPointId: trackPointId,
            trackId: trackId,
            imgOffset: {
                'x': xy[0],
                'y': xy[1]
            }
        });
        return measureAction(graph);
    }

    // 合适的像素，在图像范围内，Y值最大（靠近相机）
    function computedFitPixel(nodeLoc, trackPointList, track) {
        var result = null;

        var maxY = Infinity;
        var _idx = -1;
        var pixel;

        let K = _.cloneDeep(track.K);

        function loctoPixe(loc, trackPoint, K) {
            let coordinate = iD.util.trackPointToPicPixe(K, trackPoint, loc);
            return coordinate;
        }

        for (let i = 0; i < trackPointList.length; i++) {
            let trackPoint = trackPointList[i];
            let xy = loctoPixe(nodeLoc, trackPoint, K);

            if (xy[2] < 0 || !innerPixel(xy, trackPoint)) {
                continue;
            }
            if (maxY > xy[1]) {
                maxY = xy[1];
                _idx = i;
                pixel = [iD.util.roundNumber(xy[0]), iD.util.roundNumber(xy[1])];
            }
        }

        if (_idx != -1) {
            result = {
                point: trackPointList[_idx],
                xy: pixel
            }
        }
        return result;
    }

    function innerPixel(xy, trackPoint) {
        if (!xy || xy.length < 2) {
            return false;
        }
        let W = trackPoint.tags.picW;
        let H = trackPoint.tags.picH;
        if (xy[0] >= 0 &&
            xy[0] <= W &&
            xy[1] >= 0 &&
            xy[1] <= H) {
            return true;
        }

        return false;
    }

    return action;
};