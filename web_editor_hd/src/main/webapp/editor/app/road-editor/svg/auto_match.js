/**
 * Created by wangtao on 2017/10/13.
 */
;;
(function (iD) {
    iD = iD || {};
    const range = 100;
    let renderFilterLine;

    function splitWay(way, point) {
        // let newWay = Object.assign({},way);
        let layer = iD.Layers.getLayer(way.layerId);
        let newWay = iD.Way({
            id: way.id,
            modelName: way.modelName,
            identifier: layer.identifier,
            tags: way.tags,
            nodes: way.nodes,
            layerId: way.layerId
        })

        let _nodes = way.nodes.slice();
        let context = editor.context;

        // let startNode = context.entity(way.nodes[0]);
        let tempNode;
        let dist;

        //TODO 反向处理， 这里应该还需要考虑轨迹播放的方向， 暂时不处理
        if (way.tags.DIRECTION === '3') {
            _nodes = _nodes.slice().reverse();
        }
        if (way && way.nodes.length < 2) {
            return way;
        }
        let startIndex = getPoint(context, point, way);
        let i = startIndex + 1,
            len = _nodes.length;
        // let startPoint = context.entity(way.nodes[startIndex]);
        let positionLoc = context.entity(way.nodes[i]).loc;
        //TODO 需要考虑线节点个数于距离限制的位置情况去优化
        for (; i < len; i++) {
            tempNode = context.entity(way.nodes[i]);
            dist = iD.geo.sphericalDistance(positionLoc, tempNode.loc);
            if (dist > range) {
                break;
            }
        }
        for (; startIndex > 0; startIndex--) {
            tempNode = context.entity(way.nodes[startIndex]);
            dist = iD.geo.sphericalDistance(positionLoc, tempNode.loc);
            if (dist > range) {
                break;
            }
        }
        if (startIndex > 1) {
            startIndex--;
        }
        var newNode = _nodes.slice(startIndex, i + 2);
        newWay.nodes = newNode;
        return newWay;
    }

    function getPoint(context, point, way) {
        let nodes = context.graph().childNodes(way);
        //反向处理， 这里应该还需要考虑轨迹播放的方向， 暂时不处理
        if (way.tags.DIRECTION === '3') {
            nodes = nodes.slice().reverse();
        }

        let index = iD.util.pt2LineDist(_.pluck(nodes, 'loc'), point.loc).i;
        // nodes.length = 0;
        // if(index){
        //     return index-1;
        // }else{
        return index;
        // }
    }

    function renderFilter(player, way, context) {
        if (way instanceof iD.Way && !way.isArea() && !way.isClosed() && context.variable.renderFilter) {
            if (!renderFilterLine.filter(way, player.wayInfo, player.pic_point)) {
                return false;
            }
        }


        return true;
    }

    function heightFilter(bounds, player, way,context) {
        // let points = intersects(bounds, player.wayInfo).filter((track) => {
        //     return track && track.loc;
        // });
        // let dis ;
        let diff = 4;
        // let modelNames = [iD.data.DataType.DIVIDER,iD.data.DataType.OBJECT_PL,iD.data.DataType.OBJECT_PG];
        let modelNames = [iD.data.DataType.DIVIDER,iD.data.DataType.OBJECT_PG];
        if(!modelNames.includes(way.modelName)){
            return true;
        }
        let loc = player.pic_point.loc;
        let nodes = context.graph().childNodes(way);
        let locs = _.pluck(nodes,'loc');
        let dist = iD.util.pt2LineDist2(locs,loc);
        let disLoc ;
        if(dist.i){
            disLoc= locs[dist.i];
        }else{
            disLoc= locs[0];
        }
        let dis =  Math.abs(loc[2] - disLoc[2]);
        if(dis > diff){
            return false;
        }
        return true;
    }
    function filterWay(_ways, point) {
        let //context = editor.context,n2,dist,
            isPolygon, ways = [],
            polygons = [];
        for (way of _ways) {
            // n2 = context.entity(way.last());
            // dist = iD.geo.sphericalDistance(point.loc,n2.loc);
            //          if(splitWay.nodes<2){
            if (way.nodes.length < 2) {
                console.warn('错误数据:', way);
                continue;
            }
            isPolygon = _.include([
                iD.data.DataType.TRAFFICSIGN,
                iD.data.DataType.OBJECT_PG,
                iD.data.DataType.PAVEMENT_DISTRESS,
                // iD.data.DataType.PAVEMENT_DISTRESS_PL,
                iD.data.DataType.ROAD_FACILITIES,
                iD.data.DataType.TRAFFICLIGHT
            ], way.modelName);
            if (isPolygon) {
                polygons.push(way);
            } else /* if(dist>range)*/ {

                ways.push(splitWay(way, point));
            }
            // else{
            //     ways.push(way);
            // }
        }
        return {
            ways,
            polygons
        };
    }


    function pGinPic(coordinates, width, height) {
        let flag = false;
        let coord;
        for (var i = 0; i < coordinates.length; i++) {
            coord = coordinates[i];
            if (coord[0] > 0 && coord[1] < width && coord[1] > 0 && coord[1] < height) {
                flag = true;
            }
        }
        return flag;
    }

    function intersects(extent, nodes) {
        let restArr = [];

        for (var i = 0, len = nodes.length; i < len; i++) {
            let node = nodes[i]
            if (iD.util.isInsideRect(extent, node.loc)) {
                restArr.push(node);
            }
        }
        return restArr;
    }


    //         left  mid  right
    //    top  1001  1000  1010
    //    mid  0001  0000  0010
    // bottom  0101  0100  0110

    function bitCode(p, bbox) {
        var code = 0;

        if (p[0] < bbox[0]) code |= 1; // left
        else if (p[0] > bbox[2]) code |= 2; // right

        if (p[1] < bbox[1]) code |= 4; // bottom
        else if (p[1] > bbox[3]) code |= 8; // top

        return code;
    }

    function intersect(a, b, edge, bbox) {
        return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : // top
            edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : // bottom
                edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : // right
                    edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : // left
                        null;
    }

    function polygonclip(points, bbox) {

        var result = [],
            edge, prev, prevInside, i, p, inside;

        // clip against each side of the clip rectangle
        for (edge = 1; edge <= 8; edge *= 2) {
            result = [];
            prev = points[points.length - 1];
            prevInside = !(bitCode(prev, bbox) & edge);

            for (i = 0; i < points.length; i++) {
                p = points[i];
                inside = !(bitCode(p, bbox) & edge);

                // if segment goes through the clip window, add an intersection
                if (inside !== prevInside) result.push(intersect(prev, p, edge, bbox));

                if (inside) result.push(p); // add a point if it's inside

                prev = p;
                prevInside = inside;
            }

            points = result;

            if (!points.length) break;
        }

        return result;
    }

    function test(xy, player) {
        let K = iD.AutoMatch.getParamK(player);
        // let plane = player.dataMZgr.planes && player.dataMgr.planes.get(player.wayInfo.trackId);
        let geometry = null;
        if (player.dataMgr.planes && iD.Task.d.tags.usePos == 'true') {
            geometry = iD.util.SimpleGroundPlaneMeasurer(player.selectPicIndex + 1, xy, player.dataMgr.planes, player.allNodes, player.wayInfo.K);
            if (geometry) {
                return geometry;
            }
        }
        let utm = iD.util.LLtoUTM_(player.pic_point.loc[0], player.pic_point.loc[1]);
        var point = iD.util.clickPosForTrackPoint2(player.pic_point, xy, player.getCameraHeight(), K);
        let z = point[2] - player.getCameraHeight();
        var lonlat = iD.util.picPixelToLonLat(K, player.pic_point, utm.zoneNumber, utm.designator, xy, z);
        geometry = {
            lng: lonlat[0],
            lat: lonlat[1],
            elevation: z
        };
        return geometry;
    }

    function getShowPolygon(ways, K, trackPoint, pic_player) {
        let geometrys = [],
            context = editor.context,
            R = trackPoint.tags.R,
            C = trackPoint.tags.C,
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
            var arr = [];
            var arr1 = [];
            for (let i = 0, len = nodes.length - 1; i < len; i++) {
                node = context.entity(nodes[i]);
                let ePoint = context.entity(nodes[(i + 1) % nodes.length]);
                var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
                coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);
                arr1.push({
                    'coordinate': [coordinate[0], coordinate[1]],
                    loc: test([coordinate[0], coordinate[1]], pic_player),
                    nodeId: node.id
                })
                if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
                    ePoint = context.entity(nodes[nodes.length - 2]);
                    n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
                }

                if (coordinate[2] > 0) {
                    arr.push({
                        index: i,
                        nodeId: node.id,
                        loc: test([coordinate[0], coordinate[1]], pic_player),
                        coordinate: [coordinate[0], coordinate[1]]
                    });
                } else if (n2[2] > 0) {

                    // let loc = ePoint.loc;
                    // arr.forEach(d => {
                    //     if (d.nodeId == ePoint.id) loc = d.loc;
                    // })
                    var p = iD.util.KRt(K, R, T);
                    var x1 = iD.util.UTMProjection(node.loc);
                    var x2 = iD.util.UTMProjection(ePoint.loc);

                    var px1 = matrix.multiply(p, x1);
                    var px2 = matrix.multiply(p, x2);
                    if (n2[1] > height) {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[1]);
                    } else {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[0]);
                    }
                    // }

                    arr.push({
                        index: i,
                        nodeId: node.id,
                        loc: test([point[0], point[1]], pic_player),
                        coordinate: [point[0], point[1]]
                    });

                } else {
                    var _t = _.last(arr);
                    var endPoint = ePoint;
                    if (_t && _t.index != (i - 1)) {
                        endPoint = context.entity(nodes[(i - 1) % nodes.length]);
                    }
                    loc = endPoint.loc;
                    if (_t) {
                        var _n = context.entity(nodes[_t.index]);
                        loc = _t.loc ? [_t.loc.lng, _t.loc.lat, _t.loc.elevation] : _n.loc;
                    }
                    arr.forEach(d => {
                        if (d.nodeId == endPoint.id) loc = [d.loc.lng, d.loc.lat, d.loc.elevation];
                    })

                    var _p = iD.util.trackPointToPicPixe(K, trackPoint, loc);
                    coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);

                    if (_p[1] > height) {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, loc)[1]);
                    } else {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, loc)[0]);
                    }

                    if (_.isEmpty(point)) continue;
                    arr.push({
                        index: i,
                        nodeId: node.id,
                        loc: test([point[0], point[1]], pic_player),
                        coordinate: [point[0], point[1]]
                    });
                }
            }
            if (_.isEmpty(arr)) continue;
            // var locs = _.pluck(arr, 'coordinate');
            // var locs = _.pluck(arr1, 'coordinate');
            // console.log(locs);
            // var temp = polygonclip(locs, _.flatten(rect));

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
            if (!pGinPic(coordinates, width, height)) continue;

            if (coordinates.length >= 2) {
                geometrys.push({
                    coordinates,
                    entity: way,
                    pointMappingNode,
                    type: 'Polygon'
                })
            }
        }
        return geometrys;
    }
    /**
     * 获取投影显示线型数据
     * @param ways 线数组
     * @param K K矩阵
     */
    function getShowWays(ways, K, trackPoint) {
        let geometrys = [],
            context = editor.context,
            R = trackPoint.tags.R,
            C = trackPoint.tags.C,
            T = trackPoint.tags.T,
            width = trackPoint.tags.picW,
            height = trackPoint.tags.picH;
        // let self = iD.AutoMatch;
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


                if (coordinate[2] > 0) {
                    nodesStroe.push({
                        'coordinate': [coordinate[0], coordinate[1], node.loc[2]],
                        nodeId: node.id
                    });
                } else if (n2[2] > 0) {
                    if (!lassExtend.isLineInRect(rect, [coordinate[0], coordinate[1], n2[0], n2[1]])) {
                        nodesStroe.push({
                            'coordinate': [],
                            nodeId: node.id
                        });
                        continue;
                    }
                    if (n2[1] > height || n2[1] < 0) {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[1]);
                    } else {
                        point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[0]);
                    }
                    // point = iD.util.getScreenLineSegment(K, R, T, width, height, node.loc, ePoint.loc)[0];
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
    }
    iD.AutoMatch = {
        // trackPointUTMZone: 50,
        isInitEvent: false,
        player() { },
        updatePicCanvas(picplayer) {
            picplayer.getDrawTool().resetCanvas();
        },
        shapeHover(picplayer, selecteds) {
            if (_.isEmpty(selecteds)) {
                return;
            }

            let selectId = selecteds[0].id;

            let zrender = picplayer._zrender;
            let shapeList = picplayer.ZEUtil.getShapesByEids(selecteds);
            for (let sp of shapeList) {
                picplayer._zrenderEntityHover.call(sp);
            }
            // 不渲染时高亮有问题；
            for (let sp of shapeList) {
                if (!sp.ignore) {
                    continue;
                }
                if (sp.update) {
                    sp.update();
                    sp.dirty(true);
                }
            }
            //          shapeList.length && picplayer._zrenderEntityHover.call(shapeList[0]);
        },
        initEvent(context, picplayer) {
            var self = this;
            var changeStatus = '000';
            self.isInitEvent = true;


            function hisHasChanged() {
                var changed = context.changes();
                var status = [
                    changed.created.length,
                    changed.modified.length,
                    changed.deleted.length
                ].join('');
                var flag = status !== changeStatus;
                changeStatus = status;
                return flag;
            }

            var _updatePicPlayer = (d) => {
                if (!picplayer._zrender) {
                    return;
                }
                picplayer._zrender.painter.clearHover();
                // 指定反投的要素id
                if (d && d.acceptids && d.acceptids.length) {
                    picplayer.getDrawTool().resetPointToPicPlayer(d.acceptids);
                } else {
                    self.updatePicCanvas(picplayer);
                }
                updateSubPicCanvas();

                self.shapeHover(picplayer, context.selectedIDs());
            }
            var _doneFun = function () {
                picplayer.hideRightPic();
                _updatePicPlayer.call(this);
            }
            // var context = editor.context;
            context.history().on('undone.automatch', _doneFun)
                .on('redone.automatch', _doneFun)
                .on('change.automatch', function (difference, extent) {
                    // history的change事件，与视频绘制后context.perform冲突，可能导致绘制反投多次的问题；
                    if (!difference && extent) {
                        // merge操作，第二个参数为范围
                        // save后重新加载、恢复历史记录都会触发history中的merge
                        _updatePicPlayer();
                        // }else if(difference && difference.length()){
                    } else if (hisHasChanged()) {
                        updateSubPicCanvas();
                    }
                });

            // 图层显示状态更改、编辑状态更改
            context.ui().layermanager.on('roadEdit.test123', function (layeInfo, display) {
                if (display != null) {
                    // 显示状态有display
                    _updatePicPlayer();
                }
            });

            // 显示/取消特效
            context.event.on('changeeffect.picplayer', function () {
                _updatePicPlayer();
            })

            context.event.on('entityedite.picplayer', _updatePicPlayer);
            context.event.on('delete.picplayer', (d) => {
                if (!picplayer._zrender) {
                    return;
                }
                self.updatePicCanvas(picplayer);
                updateSubPicCanvas();
                picplayer._zrender.painter.clearHover();
                clearSubHover();
            });
            context.event.on('selected.picplayer', (selecteds) => {
                if (!picplayer._zrender) {
                    return;
                }
                if (selecteds.length > 0) {
                    picplayer._zrender.painter.clearHover();
                    clearSubHover();
                    this.shapeHover(picplayer, _.pluck(selecteds, 'id'));
                    if (iD.picUtil.subPlayer) {
                        this.shapeHover(iD.picUtil.subPlayer, _.pluck(selecteds, 'id'));
                    }
                } else {
                    picplayer._zrender.painter.clearHover();
                    clearSubHover();
                }
            });

            function clearSubHover() {
                if (iD.picUtil.subPlayer) {
                    iD.picUtil.subPlayer._zrender.painter.clearHover();
                }
            }

            function updateSubPicCanvas() {
                if (iD.picUtil.subPlayer && iD.picUtil.subPlayer.surfaceVisible()) {
                    self.updatePicCanvas(iD.picUtil.subPlayer);
                }
            }

            return true;
        },
        /**
         * 根据轨迹点和范围生成对应当前轨迹点的反投数据
         * @param trackPoint  轨迹点
         * @param pic_player
         * @param isMatch
         * @param {Array} acceptids 指定解析的entities
         * @returns {Array}
         */
        trackPointToPicPlayer(trackPoint, pic_player, isSolidLine = false, acceptids) {
            if (!trackPoint) return;
            let self = this,
				displayModels = [],
                displayLayerIds = [],
                flag, context = editor.context,
                loc = trackPoint.loc,
                bounds = iD.util.getBounds(loc, range),
                K = self.getParamK(pic_player),
                allEntities = [];

            context.layers().getLayers().forEach(function (lay) {
                // lay.display && displayLayerIds.push(lay.id);
				
				for(var name in lay.models){
					var new_id = lay.id + '_' + name,
						model_display = lay.models[name].display;
					model_display && displayModels.push(new_id);
				}
				
            });

            if (!this.isInitEvent) {
                initEvent = this.initEvent(context, pic_player);
                renderFilterLine = iD.util.EntityRenderFilterLine(context);
            }

            if (acceptids && acceptids.length) {
                allEntities = _.map(acceptids, function (eid) {
                    return context.hasEntity(eid);
                });
                allEntities = _.compact(allEntities);
            } else {
                allEntities = context.intersects(bounds);
            }

            var ways = allEntities.filter(function (datum) {
                return datum instanceof iD.Way &&
                    // _.include(displayLayerIds, datum.layerId + "") &&
                    _.include(displayModels, datum.layerId + "_" + datum.modelName) &&
                    entityVisibleFilter(pic_player, datum) &&
                    renderFilter(pic_player, datum, context) &&
                    _.include([
                        iD.data.DataType.DIVIDER,
                        iD.data.DataType.TRAFFICSIGN,
                        iD.data.DataType.OBJECT_PL,
                        iD.data.DataType.OBJECT_PG,
                        iD.data.DataType.PAVEMENT_DISTRESS,
                        iD.data.DataType.PAVEMENT_DISTRESS_PL,
                        iD.data.DataType.BRIDGE,
                        iD.data.DataType.TRAFFICLIGHT,
                        iD.data.DataType.BARRIER_GEOMETRY,
                        iD.data.DataType.ROAD_FACILITIES,
                        iD.data.DataType.HD_LANE
                    ], datum.modelName);
            });

            ways = ways.filter(d => {
                return heightFilter(bounds, pic_player, d,context);
            })

            var points = allEntities.filter(function (datum) {
                flag = datum instanceof iD.Node;
                if (flag) {
                    flag = placeFlag(datum);
                }
                if (_.include([
                    iD.data.DataType.CHECK_TAG,
                    iD.data.DataType.IMAGE_TAG,
                    iD.data.DataType.ANALYSIS_TAG,
                    iD.data.DataType.QUESTION_TAG,
                    iD.data.DataType.AUTO_NETWORK_TAG,
                    iD.data.DataType.QUALITY_TAG
                ], datum.modelName)) {
                    let taskID = datum.tags.TASKID;
                    if (datum.modelName === iD.data.DataType.QUALITY_TAG) {
                        taskID = datum.tags.TASK_ID;
                    }
                    if (taskID == iD.Task.d.tags.taskId) {
                        // flag = _.include(displayLayerIds, datum.layerId + "");
                        flag = _.include(displayModels, datum.layerId + "_" + datum.modelName);
                    } else {
                        return false;
                    }
                }
                return flag ||
                    (datum instanceof iD.Node &&
                        // _.include(displayLayerIds, datum.layerId + "") &&
                        _.include(displayModels, datum.layerId + "_" + datum.modelName) &&
                        entityVisibleFilter(pic_player, datum) &&
                        _.include([
                            iD.data.DataType.OBJECT_PT,
                            iD.data.DataType.LAMPPOST,
                            iD.data.DataType.LIMITHEIGHT,
                            // iD.data.DataType.TRAFFICLIGHT,
                            iD.data.DataType.ROAD_ATTRIBUTE
                        ], datum.modelName));
            });

            function placeFlag(datum) {
                if (datum._type == iD.data.DataType.SEARCH_POINT) {
                    return true;
                }
                if (datum._type == iD.data.DataType.PLACENAME) {
                    // 标定-只显示当前帧
                    if (datum._record && iD.User.isTrackControlPointRole()) {
                        let trackId = datum._record.trackId;
                        let trackPointId = datum._record.trackPointId;
                        let point = pic_player.pic_point;
                        return point.tags.trackId == trackId
                            && point.tags.trackPointId == trackPointId;
                    } else {
                        return true;
                    }
                }
                return false;
            }

            var wayObj = filterWay(ways, trackPoint);

            // this.trackPointUTMZone = iD.util.LLtoUTM_(loc[0],loc[1]).zoneNumber;

            var geometrys = [];
            if (ways.length == 0 && points.length == 0) {
                return geometrys;
            }
            if (!trackPoint.tags.R) return;
            geometrys.push(...getShowWays(wayObj.ways, K, trackPoint));
            geometrys.push(...getShowPolygon(wayObj.polygons, K, trackPoint, pic_player));
            var coordinate, coordinates = [],
                _loc, point, pixel;
            for (let i = 0; i < points.length; i++) {
                point = points[i]
                coordinates = [];
                // 控制点特殊处理
                pixel = point._record && point._record.mapping[0] && point._record.mapping[0].pixel;
                if (pixel) {
                    coordinates.push([pixel.x, pixel.y, point.loc[2]]);
                    geometrys.push({
                        coordinates,
                        entity: point,
                        type: 'Point'
                    });
                    continue;
                }
                if (!trackPoint.tags.R) return;
                _loc = point.loc;
                // 轨迹反投结果减去车高
                if (_.include([
                    iD.data.DataType.IMAGE_TAG
                ], point.modelName) && iD.User.isWorkRole()) {
                    _loc = _.clone(point.loc);
                    let heightDiff = pic_player.getCameraHeight();
                    if (heightDiff) {
                        _loc[2] = _loc[2] - heightDiff;
                    }
                }
                coordinate = iD.util.trackPointToPicPixe(K, trackPoint, _loc);
                if (coordinate[2] > 0) {
                    coordinates.push([coordinate[0], coordinate[1], point.loc[2]]);
                    geometrys.push({
                        coordinates,
                        entity: point,
                        type: 'Point'
                    })
                }
            }
            return geometrys;
        },


        createWay() {

        },
        updateShape(xy, entity, shape) {

        },
        reset() {
            // this.trackPointUTMZone = 50;
        },
        /**
         * player.wayInfo.K参数会在某个操作中被更改，所以需要通过cloneDeep的方式；
         */
        getParamK(pic_player) {
            var K = _.cloneDeep(pic_player.wayInfo.K);
            return K;
        },
        /**
         * @param {Array} nodes  坐标
         * @param {Object} pic_player 
         * @param {Number} heightDiff 车高，有值则会将坐标高度减去车高
         * @param {Number|Object} trackNodeIndex 反投轨迹点的索引，或轨迹点
         * @param {Array} allNodes 坐标对应的entity
         */
        locsToPicPlayer(nodes, pic_player, heightDiff, trackNodeIndex, allNodes) {
            var geometrys = [];
            if (trackNodeIndex != null && isNaN(trackNodeIndex)) {
                if (!trackNodeIndex || !trackNodeIndex.loc) {
                    trackPoint = pic_player.allNodes[pic_player.selectPicIndex];
                } else {
                    trackPoint = trackNodeIndex;
                }
                var K = iD.picUtil.getTrackParamK(trackPoint.tags.trackId);
            } else {
                var trackPoint = pic_player.allNodes[trackNodeIndex != null ? trackNodeIndex : pic_player.selectPicIndex];
                var K = this.getParamK(pic_player);
            }
            var coordinates, coordinate;
            for (let i = 0; i < nodes.length; i++) {
                coordinates = [];
                var node = nodes[i];
                if (!trackPoint.tags.R) return;
                //              var _loc = _.clone(nodes[i].loc);
                var _loc = _.clone(node);
                if (heightDiff) {
                    _loc[2] = _loc[2] - heightDiff;
                }
                coordinate = iD.util.trackPointToPicPixe(K, trackPoint, _loc);
                if (coordinate[2] > 0) {
                    coordinates.push([coordinate[0], coordinate[1], _loc[2]]);
                    geometrys.push({
                        coordinates,
                        entity: allNodes && allNodes[i],
                        type: 'Point',
                        _index: i
                    })
                }
            }
            return geometrys;
        },
        /**
         * 反投范围内的轨迹点
         */
        calcTrackPointsToPicPlayer(pic_player) {
            var trackPoint = pic_player.allNodes[pic_player.selectPicIndex];
            var loc = trackPoint.loc;
            var bounds = iD.util.getBounds(loc, range);
            // var allNodes = intersects(bounds, pic_player.allNodes).filter(function (entity) {
            //     return entity && entity.loc;
            // });
            var allNodes = _.flatten(_.pluck(pic_player.dataMgr.tracks, 'nodes'));
            allNodes = intersects(bounds, allNodes).filter(function (entity) {
                return entity && entity.loc;
            });
            var results = this.locsToPicPlayer(_.pluck(allNodes, 'loc'), pic_player, pic_player.getCameraHeight(), null, allNodes);
            results.forEach(function (d) {
                let node = allNodes[d._index];
                if (node) {
                    d.trackPointId = node.id;
                    d.trackId = node.tags.trackId;
                }
            });
            return results;
        },
        lightEntitys() { }
    }

    function entityVisibleFilter(player, entity) {

        {
            let flag = [
                iD.data.DataType.DIVIDER,
                iD.data.DataType.DIVIDER_NODE
            ].includes(entity.modelName);
            if (flag) {
                return _.isBoolean(player.zrenderDividerVisible) ? player.zrenderDividerVisible : true;
            }
        }
        {
            let plFlag = [
                iD.data.DataType.OBJECT_PL,
                iD.data.DataType.OBJECT_PL_NODE
            ].includes(entity.modelName);
            if (plFlag) {
                return _.isBoolean(player.zrenderObjectPLVisible) ? player.zrenderObjectPLVisible : true;
            }
        }
        return true;
    }

})(iD);