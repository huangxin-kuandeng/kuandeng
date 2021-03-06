/**
 * Created by wangtao on 2017/10/13.
 */
;;
(function (iD) {
    iD = iD || {};
    const range = 100;
 
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
            height = trackPoint.tags.picH,
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
                // var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
                var n2 = iD.util.orthophotoCounterInvestment(trackPoint, ePoint.loc);
                // coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);
                coordinate = iD.util.orthophotoCounterInvestment(trackPoint, node.loc);
                arr1.push({
                    'coordinate': [coordinate[0], coordinate[1]],
                    loc: test([coordinate[0], coordinate[1]], pic_player),
                    nodeId: node.id
                })
                if (i == 0) {
                    ePoint = context.entity(nodes[nodes.length - 2]);
                    n2 = iD.util.orthophotoCounterInvestment(trackPoint, ePoint.loc);
                }
                arr.push({
                    index: i,
                    nodeId: node.id,
                    loc: test([coordinate[0], coordinate[1]], pic_player),
                    coordinate: [coordinate[0], coordinate[1]]
                })
            }
            if (_.isEmpty(arr)) continue;

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
            // if (!pGinPic(coordinates, width, height)) continue;
            let type = 'Polygon';
            let firstNode = context.entity(_.first(nodes));
            let lastNode = context
            .entity(_.last(nodes));
            if(firstNode.loc.toString() != lastNode.loc.toString()){
                type = 'LineString';
            }
            if (coordinates.length >= 2) {
                geometrys.push({
                    coordinates,
                    entity: way,
                    pointMappingNode,
                    type: type
                })
            }
        }
        return geometrys;
    }


    iD.OrthoggraphicAutoMatch = {
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
            // ??????????????????????????????
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
                // ?????????????????????id
                if (d && d.acceptids && d.acceptids.length) {
                    picplayer.getDrawTool().resetPointToPicPlayer(d.acceptids);
                } else {
                    self.updatePicCanvas(picplayer);
                }
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
                    // history???change???????????????????????????context.perform???????????????????????????????????????????????????
                    if (!difference && extent) {
                        // merge?????????????????????????????????
                        // save????????????????????????????????????????????????history??????merge
                        _updatePicPlayer();
                        // }else if(difference && difference.length()){
                    }
                });

            // ?????????????????????????????????????????????
            context.ui().layermanager.on('roadEdit.test123', function (layeInfo, display) {
                if (display != null) {
                    // ???????????????display
                    _updatePicPlayer();
                }
            });

            // ??????/????????????
            context.event.on('changeeffect.picplayer', function () {
                _updatePicPlayer();
            })

            context.event.on('entityedite.picplayer', _updatePicPlayer);
            context.event.on('delete.picplayer', (d) => {
                if (!picplayer._zrender) {
                    return;
                }
                self.updatePicCanvas(picplayer);
                picplayer._zrender.painter.clearHover();
            });
            context.event.on('selected.picplayer', (selecteds) => {
                if (!picplayer._zrender) {
                    return;
                }
                if (selecteds.length > 0) {
                    picplayer._zrender.painter.clearHover();
                    this.shapeHover(picplayer, _.pluck(selecteds, 'id'));
                } else {
                    picplayer._zrender.painter.clearHover();
                }
            });

            return true;
        },
        /**
         * ??????????????????????????????????????????????????????????????????
         * @param trackPoint  ?????????
         * @param pic_player
         * @param isMatch
         * @param {Array} acceptids ???????????????entities
         * @returns {Array}
         */
        trackPointToPicPlayer(trackPoint, pic_player, isSolidLine = false, acceptids) {
            if (!trackPoint) return;
            let self = this,
                displayLayerIds = [],
                flag, context = editor.context,
                loc = trackPoint.loc,
                bounds = iD.util.getBounds(loc, range),
                K = self.getParamK(pic_player),
                allEntities = [];

            context.layers().getLayers().forEach(function (lay) {
                lay.display && displayLayerIds.push(lay.id);
            });

            if (!this.isInitEvent) {
                initEvent = this.initEvent(context, pic_player);
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
                    _.include(displayLayerIds, datum.layerId + "") &&
                    // entityVisibleFilter(pic_player, datum) &&
                    datum.modelName ==
                    iD.data.DataType.PAVEMENT_DISTRESS
            });
            var points = allEntities.filter(function (datum) {
                flag = datum instanceof iD.Node;
                 
                if (_.include([
                        iD.data.DataType.CHECK_TAG,
                        iD.data.DataType.IMAGE_TAG,
                        iD.data.DataType.ANALYSIS_TAG,
                        iD.data.DataType.QUESTION_TAG
                    ], datum.modelName)) {
                    if (datum.tags.TASKID == iD.Task.d.tags.taskId) {
                        flag = _.include(displayLayerIds, datum.layerId + "");
                    } else {
                        return false;
                    }
                    return flag;
                }
            });
            var geometrys = [];
            if (ways.length == 0 && points.length == 0) {
                return geometrys;
            }
            if (!trackPoint.tags.R) return;
            geometrys.push(...getShowPolygon(ways, K, trackPoint, pic_player));

            var coordinate, coordinates = [],
                _loc, point, pixel;
            for (let i = 0; i < points.length; i++) {
                point = points[i]
                coordinates = [];
                // ?????????????????????
                pixel = point._record && point._record.mapping[0] && point._record.mapping[0].pixel;
                if(pixel){
                    coordinates.push([pixel.x ,pixel.y, point.loc[2]]);
                    geometrys.push({
                        coordinates,
                        entity: point,
                        type: 'Point'
                    });
                    continue ;
                }
                if (!trackPoint.tags.R) return;
                _loc = point.loc;
                // ??????????????????????????????
                if (_.include([
                        iD.data.DataType.IMAGE_TAG
                    ], point.modelName)) {
                    _loc = _.clone(point.loc);
                    let heightDiff = pic_player.getCameraHeight();
                    if (heightDiff) {
                        _loc[2] = _loc[2] - heightDiff;
                    }
                }
                coordinate = iD.util.orthophotoCounterInvestment(trackPoint, _loc); 
                // if (coordinate[2] > 0) {
                    coordinates.push([coordinate[0], coordinate[1], point.loc[2]]);
                    geometrys.push({
                        coordinates,
                        entity: point,
                        type: 'Point'
                    })
                // }
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
         * player.wayInfo.K?????????????????????????????????????????????????????????cloneDeep????????????
         */
        getParamK(pic_player) {
            var K = _.cloneDeep(pic_player.wayInfo.K);
            return K;
        },
        /**
         * @param {Array} nodes  ??????
         * @param {Object} pic_player 
         * @param {Number} heightDiff ????????????????????????????????????????????????
         * @param {Number|Object} trackNodeIndex ???????????????????????????????????????
         * @param {Array} allNodes ???????????????entity
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
         * ???????????????????????????
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
        if (player.zrenderDividerVisible == null) {
            return true;
        } else {
            let flag = [
                iD.data.DataType.DIVIDER,
                iD.data.DataType.DIVIDER_NODE
            ].includes(entity.modelName);
            if (flag) {
                return player.zrenderDividerVisible;
            }
        }
        return true;
    }

})(iD);