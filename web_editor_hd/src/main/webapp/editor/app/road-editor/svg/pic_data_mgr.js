/*
 * @Author: tao.w
 * @Date: 2019-08-28 15:06:39
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-21 14:07:51
 * @Description: 
 */
iD.svg.Pic.dataMgr = (function () {
    var mgrEvent = d3.dispatch('loading', 'loaded');
    var loading, loadingContainer;
    var isLoading = true;

    function showLoading() {
        if (isLoading) {
            loading && loadingContainer.call(loading);
            isLoading = false;
        }
    }

    function hideLoading() {
        loading && loading.close();
    }

    // 页面第一次初始化时，使用URL初始化
    var _init_byurl = true;
    var _init_byurl_param;

    function DataMgr() {

        this.tracks = [];
        this.pic = null;
        this.context = null;
        this.potree = null;
        this.planes = null;
        this.trackGround = null;
        this.planeFrames = null;
        this._record = null;
        this.posArr = []; //记录刷过pos轨迹ID

        this.identifyData = {};
    }
    DataMgr.prototype.getInitUrlParam = function () {
        return _init_byurl_param;
    }

    _.assign(DataMgr.prototype, {

        initPic: function (context) {

            if (_.isNull(this.pic)) {
                this.pic = iD.svg.Pic(context.projection, context);
            }

            if (_.isNull(this.potree)) {
                this.potree = new iD.svg.Potree(context, context.container(), this, false);
                window.potreePlayer = this.potree;
                context.potreePlayer = this.potree;
            }

            let surface = context.surface();
            let args = [surface];

            this.pic.apply(surface, args);
        },
        setContext: function (context) {
            if (this.context === context) {
                return;
            }
            loading = iD.ui.Loading(context).message("资料加载中,请稍后").blocking(false);
            loadingContainer = context.container();

            this.context = context;
            iD.picUtil.context = context;

            this.initPic(context);

            var self = this;

            context.ui().layermanager.on('pic', function (taskObj, display) {
                // 不能进入轨迹面板
                if (!iD.User.authTrail() || !iD.User.authTrailPicture()) {
                    return;
                }

                let _t = self.pic.getPicPlayer();
                if (!display) {
                    self.clearData(null);
                    d3.select('.pic_cursor').remove();
                    if (_t && _t.wayInfo)
                        self._record = {
                            index: _t.selectPicIndex,
                            track: _t.wayInfo
                        }
                    return;

                } else if (taskObj) {
                    var _trackIds = [];
                    //TODO Tilden 临时写死，后台暂未支持
                    if (typeof (taskObj.tags.trackIds) == 'string') {
                        _trackIds = taskObj.tags.trackIds.split(",");
                    } else {
                        _trackIds = taskObj.tags.trackIds;
                    }
                    if (_.isEqual(_trackIds, self.trackIds) && self._record) {
                        _t._locate_point_index = self._record.index;
                        loadTrackEvent(self._record.track);
                        self._record = null;
                    } else {
                        self.trackIds = _trackIds; //记录轨迹编号数组，在pic_player里遍历
                        self.tracks = [];
                        self.planes = null;
                        self.trackGround = null;
                        self.loadTrackData(self.trackIds, loadTrackEvent);
                    }

                    function loadTrackEvent(_track) {
                        _init_byurl_param = _init_byurl && iD.util.isInitTrackPointByUrl(self.tracks);
                        // 第一次初始化时，使用URL中指定轨迹的轨迹点
                        if (_init_byurl_param) {
                            _track = _init_byurl_param.track;
                        }
                        _init_byurl = false;

                        self.redrawPic(_track.trackId);
                        _init_byurl_param = null;
                    }


                }
            })

            // add 监听左侧编辑状态，移动dvr到道路曾前面，防止绘制道路与dvr轨迹线冲突
            context.ui().layermanager.on('change.pic', function (layerInfo, flag) {

                if (!layerInfo || layerInfo.type != "pic") {
                    return;
                }
                if (layerInfo.editable) {
                    self.movePicLayerToFirst && self.movePicLayerToFirst();
                } else {
                    self.movePicLayerAfterDvr && self.movePicLayerAfterDvr()
                }
            });

        },
        // resetPlanes: function (index) {
        //     if (this.planes) {
        //         this.planes.pix_y_planes.clear();
        //         this.planes = null;
        //     }
        //     if (!this.planeFrames || !this.planeFrames.size) {
        //         this.planes = null;
        //         return;
        //     }

        //     let nodes = this.trackObj.nodes, map = new Map(),
        //         cameraParams = this.trackObj.cameraParams,
        //         k = [[cameraParams.focusX, 0, cameraParams.principlePointX],
        //         [0, cameraParams.focusX, cameraParams.principlePointY],
        //         [0, 0, 1]];
        //     let pf = this.planeFrames.get(this.trackId);
        //     if (!pf) {
        //         this.planes = null;
        //         return;
        //     }
        //     let plane = {
        //         frameId: index + 1,
        //         pix_y_planes: new Map()
        //     }
        //     iD.util.processGroundPlaneFrame(plane, k, nodes, pf);
        //     this.planes = plane;
        // },

        // 加载轨迹rpa偏移量
        // loadTrackExtend: function (dynamicURL, dynamicCal) {
        //     return new Promise((resolve) => {
        //         if (!dynamicCal) {
        //             resolve();
        //             return;
        //         }
        //         d3.json(dynamicURL).get((error, data) => {
        //             if (!data || !data.result) {
        //                 resolve();
        //                 return;
        //             }
        //             let result = {};
        //             _.each(data.result, function (d) {
        //                 result[d.trackId] = d;
        //             });
        //             resolve(result);
        //         });
        //     });
        // },

        /**
         * 加载轨迹xyz偏移量
         * 刷新轨迹偏移量信息
         */
        updateTrackPosData: function (param, offsetCal = true) {
            var self = this;
            var extendAll = {};

            function loadPointExtend() {
                return new Promise((resolve) => {
                    d3.json(iD.config.URL.krs + 'track/point/extend')
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .post(_.map(param, function (v, k) {
                            return k + '=' + (v || '');
                        }).join('&'), function (error, data) {

                            if (!data || !data.result) {
                                resolve();
                                return;
                            }
                            for (let trackId in data.result) {
                                let datas = data.result[trackId] || [];
                                if (!datas.length) continue;
                                if (!extendAll[trackId]) extendAll[trackId] = {};
                                for (let d of datas) {
                                    extendAll[trackId][d.trackPointId] = d;
                                }
                            }
                            resolve();
                        });
                });
            }

            return new Promise((resolve) => {
                // 加载全部偏移量并且重新计算RTC
                // 时候后续节点补充前面无偏移量的节点
                loadPointExtend().then(() => {
                    resolve(extendAll);
                });
            });
        },
        /**
         * 刷新轨迹RTC信息
         */
        updateTrackRTC: function (extendAll, offsetCal, dynamicCal) {
            var self = this;
            var utmXY = false;

            self.tracks.forEach(function (track) {
                let trackDynamic = {
                    roll: track.rollDelta || 0,
                    pitch: track.pitchDelta || 0,
                    azimuth: track.azimuthDelta || 0
                };
                let trackOffset = extendAll[track.trackId] || {};
                let lastOffset;
                // 防止后面节点没有偏移
                let lastIndex;
                let indexParam;
                // var count = 0;

                for (let i = track.nodes.length - 1; i >= 0; i--) {
                    let node = track.nodes[i];
                    let offset = trackOffset[node.id];
                    let param = {
                        x: 0,
                        y: 0,
                        z: 0,
                        roll: 0,
                        pitch: 0,
                        azimuth: 0
                    };
                    if (dynamicCal && trackDynamic) {
                        // param = Object.assign(param, trackDynamic);
                        //激光pos
                        if (offset) {
                            param.roll += offset.rollDelta || 0;
                            param.pitch += offset.pitchDelta || 0;
                            param.azimuth += offset.azimuthDelta || 0;
                        }
                    }
                    if (offsetCal) {
                        if (offset) {
                            offset = {
                                x: offset.xDelta || 0,
                                y: offset.yDelta || 0,
                                z: offset.zDelta || 0
                            }

                            param = Object.assign(param, offset);

                            if (lastIndex == null) {
                                lastIndex = i;
                                indexParam = param;
                            }
                            // updatePos(node, offset, track);
                            // lastNode = node;
                            lastOffset = offset;
                        } else {
                            // count ++;
                            if (lastOffset) {
                                param = Object.assign(param, lastOffset);
                                // updatePos(node, lastOffset, track);
                            }
                        }
                    }
                    updateNode(track, node, param, trackDynamic);
                }

                if (indexParam && lastIndex < track.nodes.length - 1) {
                    track.nodes.slice(lastIndex + 1).forEach((node) => {
                        updateNode(track, node, indexParam, trackDynamic);
                    });
                }
            });

            function updateNode(track, node, cal, trackDynamic) {
                let first = track.nodes[0];
                var obj = pos2RTC({
                    // dynamicCal
                    roll: cal.roll || 0,
                    pitch: cal.pitch || 0,
                    azimuth: cal.azimuth || 0,
                    // offsetCal
                    x: cal.x || 0,
                    y: cal.y || 0,
                    z: cal.z || 0
                }, node, first, trackDynamic);
                if (!obj) {
                    console.error(node.id + ' RTC计算失败');
                    return;
                }

                node.tags.R = obj.R;
                node.tags.C = obj.C;
                node.tags.T = obj.T;
            }

            function pos2RTC(opts, node, firstNode, trackDynamic) {
                // Object.assign，属性值null、undefined，也会覆盖
                opts = objAssign({
                    x: 0,
                    y: 0,
                    z: 0,
                    roll: 0,
                    pitch: 0,
                    azimuth: 0
                }, opts);

                addNum(node.tags, {
                    roll: opts.roll,
                    pitch: opts.pitch,
                    azimuth: opts.azimuth
                });
                addUtmXYZ(node, {
                    x: opts.x,
                    y: opts.y,
                    z: opts.z
                });

                var param = {
                    x: node.tags.x,
                    y: node.tags.y,
                    roll: node.tags.roll,
                    pitch: node.tags.pitch,
                    azimuth: node.tags.azimuth
                };

                return iD.util.pos2CameraRTC(param, firstNode && firstNode.tags || {}, node.tags.z, trackDynamic);
            }

            // Object.assign，属性值null、undefined，也会覆盖
            function objAssign(a, b) {
                for (let key in b) {
                    if (b[key] != null) {
                        a[key] = b[key];
                    }
                }
                return a;
            }

            function addNum(tags, opts) {
                for (let key in opts) {
                    if (!tags.hasOwnProperty(key)) continue;
                    let val = opts[key];
                    if (!Boolean(val) || isNaN(val)) continue;
                    tags[key] += val;
                }
            }

            function addUtmXYZ(node, opts) {
                var locChanged = false;
                if (opts.x || opts.y) {
                    // 经纬度是UTM偏移量
                    if (utmXY) {
                        var utm = iD.util.LLtoUTM_(node.tags.x, node.tags.y);
                        addNum(utm, {
                            x: opts.x,
                            y: opts.y
                        });
                        var lonlat = iD.util.UTMtoLL_(utm.x, utm.y, utm.zoneNumber);
                        node.tags.x = lonlat[0];
                        node.tags.y = lonlat[1];
                    } else {
                        addNum(node.tags, {
                            x: opts.x,
                            y: opts.y
                        });
                    }
                    locChanged = true;
                }
                if (opts.z) {
                    addNum(node.tags, {
                        z: opts.z
                    });
                    locChanged = true;
                }
                if (locChanged) {
                    node.loc = [
                        node.tags.x,
                        node.tags.y,
                        node.tags.z
                    ];
                }
            }

            return new Promise((resolve) => {
                resolve();
            });
        },
        /**
         * 绘制多轨迹
         * @param {currentId} 当前展示轨迹ID
         * @param {callback} 回调
         * */
        redrawPic: async function (currentId, callback) {
            callback = callback || function () {};
            var self = this;
            //因为记录tracks是异步过程，需要等全部数据返回存储后再绘制
            var tracks = self.tracks;
            var index = _.pluck(tracks, 'trackId').indexOf(currentId);

            var _track = tracks[index];
            if (!_track) {
                Dialog.alert("选择轨迹不在数据集中，请重新选择！");
                return;
            }
            //在执行绘制前，需要先获取当前轨迹的车高及相机内参后在做渲染
            self.trackObj = _track;
            if (_track.trackId != self.trackId || !self.trackId) {
                self.trackId = _track.trackId;
            }

            //加载视频
            self.pic && self.pic.redrawPic(_track, index, true);

            iD.Task.d.tags._trackTime = _track.nodes[0].tags.locTime;
            let isStaticLidarIndex = false;
            if (iD.Task && iD.Task.d && iD.Task.d.tags && iD.Task.d.tags.branchDataType == '1') {
                isStaticLidarIndex = true;
            }
            let keys = iD.Task.d.tags.pointCloudKeys || false;


            if (isStaticLidarIndex) {
                self.potree && self.potree.updateTrack(currentId)
            } else if (iD.Task.d && keys) {

                let lidars = iD.Task.d.tags.pointCloudKeys.split(',');
                let lidar_flag = lidars.filter(d => {
                    return d.indexOf(currentId) != -1;
                });
                if (lidar_flag.length) {
                    self.potree && self.potree.updateTrack(currentId);
                } else if (self.potree) {
                    self.potree.reset();
                    self.potree.hide();
                }
            } else {
                if (self.potree) {
                    self.potree.reset();
                    self.potree.hide();
                }
            }

            // self.pic && self.pic.clearCanvas();
            // self.pic && self.pic.resetSize();
            callback && callback(_track);
        },
        /**
         * 设置副窗口轨迹
         * @param trackObj 当前轨迹
         * @param tI 当前轨迹在数据集中索引
         * */
        redrawPicSub: function (subPlayer, trackId, callback) {
            var self = this;
            var context = self.context;
            //因为记录tracks是异步过程，需要等全部数据返回存储后再绘制
            var tracks = self.tracks;
            var index = _.pluck(tracks, 'trackId').indexOf(trackId);
            var trackObj = tracks[index];
            if (!trackObj) {
                Dialog.alert("选择轨迹不在数据集中，请重新选择！");
                return;
            }
            self.subTrackObj = trackObj;
            self.subTrackId = trackObj.trackId;

            subPlayer.init(context.container());
            subPlayer.renderPicPlayer(trackObj, trackObj.nodes[0].id).show();

            callback && callback(trackObj);
        },
        clearData: function (_) {

            this.selectedIDs(null);
            if (this.renderDvrSurface) {
                this.renderDvrSurface({
                    trigger: 'data.renew'
                });
            }

        },
        selectedIDs: function (ids) {

            if (!arguments.length) return this._selectedIDs;

            this._selectedIDs = ids;
        },
        mousePos: function (mouse) {

            if (!arguments.length) return this._mousePos;

            this._mousePos = mouse;
        },

        // simpleTaskCoords: function (coordstr) {
        //     //@coords 字符串 POINT (x y)
        //     var locArray = /(POINT\s*)\((.*)(\))/.exec(coordstr);
        //     if (locArray) {
        //         var coords = locArray[2].split(" ");
        //     } else {

        //     }
        //     var newCoords = []


        //     newCoords.push(parseFloat(coords[0]).toFixed(6), parseFloat(coords[1]).toFixed(6));
        //     return newCoords;

        // },
        trackId2Track: function (trackId) {
            if (!this.tracks.length) return false;
            for (let i = 0; i < this.tracks.length; i++) {
                if (trackId == this.tracks[i].trackId) {
                    return this.tracks[i];
                }
            }
            return false;
        },
        pointId2Track: function (pointId) {
            if (!this.tracks.length) return;
            let nodes, node;
            for (let i = 0; i < this.tracks.length; i++) {
                nodes = this.tracks[i].nodes;
                for (let j = 0; j < nodes.length; j++) {
                    node = nodes[j];
                    if (pointId == node.id) {
                        return this.tracks[i];
                    }
                }
            }
            return [];
        },
        pointId2Node: function (pointId, trackId) {
            if (!this.tracks.length) return;
            let nodes, node;
            for (let i = 0; i < this.tracks.length; i++) {
                if (trackId && trackId != this.tracks[i].id) {
                    continue;
                }
                nodes = this.tracks[i].nodes;
                for (let j = 0; j < nodes.length; j++) {
                    node = nodes[j];
                    if (pointId == node.id) {
                        return node;
                    }
                }
            }
            return;
        },
        getTrack: function (trackid) {
            var tracks = this.tracks || [];
            var track;
            for (let d of tracks) {
                if (d && d.trackId == trackid) {
                    track = d;
                    break;
                }
            }
            return track;
        },
        // loadTaskId: function (id = '') {
        //     return new Promise((resolve) => {

        //         if (iD.Task.d && iD.Task.d.tags.multiTrackFusionTaskId) {
        //             resolve(iD.Task.d.tags.multiTrackFusionTaskId);
        //             return;
        //         }

        //         // if (iD.Task.d && iD.Task.d.task_id == id && iD.Task.d.tags.fusionTaskId) {
        //         //     resolve(iD.Task.d.tags.fusionTaskId);
        //         //     return;
        //         // }
        //         let url = iD.config.URL.kts + 'task/findTopology?bussCode=linearFusion&taskId=' + id;
        //         d3.json(url)
        //             .get(function (error, data) {
        //                 if (error || !data.result) {
        //                     resolve('');
        //                     return;
        //                 }
        //                 let task = data.result.find(d => {
        //                     return d.bussCodes.includes('linearFusion')
        //                 })
        //                 resolve(task && task.id || '');
        //             });
        //     });
        // },
        buildTaskData: function (result, trackId) {
            if (!result || result.length == 0) {
                return [];
            }
            var self = this;
            var tList = result;

            if (!tList || !tList.length) {
                return [];
            }


            var traceList = [];

            let  f = '/';
            for (var i = 0, len = tList.length; i < len; i++) {

                var tmpTrace = tList[i];
                tmpTrace.trackId = trackId; 
                // tmpTrace.picUrl =  iD.config.URL.hbase_plys + 'hbase-support/image/track/query?namespace=image_material&trackPointId=' + tmpTrace.trackPointId + '&type=005&imageType=jpg&trackId=' + tmpTrace.trackId;
                // tmpTrace.picUrl =  iD.util.stringSwitch(tmpTrace.picUrl);
                if (!tmpTrace.picH) {
                    tmpTrace.picH = 2048;
                }
                if (!tmpTrace.picW) {
                    tmpTrace.picW = 2448;
                }
                // let _projId = tmpTrace.videoFile.split('_')[0] || '';
                // let _dirName = tmpTrace.videoFile.split('.mp4')[0] || '';
                
                // let url =  iD.config.URL.video_file + _projId + "/" + _dirName + "/" + tmpTrace.videoFile + '/index.m3u8';
                let url =  iD.config.URL.video_file_mp4  + tmpTrace.videoFile;

                // tmpTrace.videoFile = 'http://10.11.5.88:9999/hls/tmp/nfs-test/track0/204418964_20190815112225968.mp4/index.m3u8';

                // http://10.11.5.88:9999/hls/production/track_video_compress/1000003/1000003_20180701085031863/1000003_20180701085031863.mp4/index.m3u8

                // tmpTrace.videoFrameIndex = i;
                tmpTrace.videoFile = url;
                // tmpTrace.videoFrameIndex = tmpTrace.videoFrameIndex;
                
                var node = {
                    id: tmpTrace.trackPointId,
                    loc: [tmpTrace.x, tmpTrace.y, tmpTrace.z],
                    tags: tmpTrace
                }
                traceList.push(node);
            }
            return traceList;
        },
        loadTrackData: function (loadTrackId, callback) {
            var self = this;
            var taskObj = iD.Task.d;
            callback = callback || function () {};

            if (!taskObj || !loadTrackId || !loadTrackId.length) {
                callback(null);
                return;
            }
            var loadTrackIds = _.isArray(loadTrackId) ? loadTrackId : [loadTrackId];

            self.tracks = self.tracks || [];
            // false时表示第一次加载轨迹（切换任务）
            var loadNewTrack = self.tracks.length > 0;

            var nowTracks = _.pluck(self.tracks, 'trackId');
            // 未加载
            var requestTracks = _.difference(loadTrackIds, nowTracks);
            if (!requestTracks.length) {
                self.promiseComplete(self.tracks[0], callback);
                return;
            }

            showLoading();
            // 验证多轨迹车道线使用轨迹
            self.promiseUsedTracks = async function (param) {
                var url = iD.config.URL.hbase_plys + 'hbase-support/text/laser_middle_result/multi_tracks_lane_line_summary/query?key=' + iD.Task.d.tags.multiTrackLaneTaskId;
                url = iD.util.stringSwitch(url);
                return new Promise((resolve, reject) => {
                    d3.json(url).get(function (error, data) {
                        resolve(data);

                    });
                })
            }
            // 加载轨迹点列表
            self.promiseTaskData = async function (param, res) {
                var usedTracks = res.usedTracks;
                return new Promise((resolve, reject) => {
                    var noHeight = false;

                    mgrEvent.loading();
                    var noHeight = false;

                    d3.json(iD.config.URL.krs + 'v3/track/get/tracks/byTrackIds')
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .post(_.map(param, function (v, k) {
                            return k + '=' + (v || '');
                        }).join('&'), async function (error, result) {
                            mgrEvent.loaded();
                            if (!result || !result.result) {
                                if (!loadNewTrack) {
                                    // 不存在轨迹时隐藏视频界面，并初始化地图大小。  
                                    changePicPlayerDisplay(false);
                                }
                                Dialog.alert("轨迹加载失败<br/>" + (result && result.message || ""));
                                resolve(null);
                                return;
                            }
                            let trackObj, trackPoints, K;

                            var currentTrackIds = _.map(result.result, 'trackId');
                            if (usedTracks && usedTracks.length != 0) {
                                self.differenceTrackIds = _.difference(currentTrackIds, usedTracks);
                            } else {
                                self.differenceTrackIds = [];
                            }
                            if (self.differenceTrackIds.length) {
                                Dialog.alert('轨迹无效的记录：' + self.differenceTrackIds.length + '条');
                                console.log('轨迹无效的记录: ' + self.differenceTrackIds.join(','));
                            }

                            for (var i = 0; i < result.result.length; i++) {
                                let track = result.result[i];
                                trackPoints = self.buildTaskData(track.pointList, track.trackId);
                                cameraParams = track.cameraParams;
                                cameraHeight = track.cameraHeight;
                                if (!trackPoints || !trackPoints.length) {
                                    continue;
                                }
                                K = [
                                    [cameraParams.focusX, 0, cameraParams.principlePointX],
                                    [0, cameraParams.focusX, cameraParams.principlePointY],
                                    [0, 0, 1]
                                ]

                                trackObj = {
                                    nodeId: trackPoints[0].id,
                                    nodes: trackPoints,
                                    K,
                                    trackLocTime: trackPoints[0].tags.locTime,
                                    cameraParams: track.cameraParams,
                                    cameraHeight: track.cameraHeight,
                                    deviceId: track.deviceId,
                                    trackId: track.trackId,
                                    rollDelta: track.rollDelta,
                                    pitchDelta: track.pitchDelta,
                                    azimuthDelta: track.azimuthDelta
                                }
                                var s = d3.$("#KDSEditor-bar button.save");
                                if (!trackObj.cameraHeight) {
                                    trackObj.cameraHeight = 1.77;
                                    noHeight = true;
                                } else {
                                    s.style("visibility", "visible");
                                }
                                if (!_.include(self.differenceTrackIds, track.trackId)) { //轨迹无效的记录
                                    self.tracks.push(trackObj);
                                }
                            }
                            // 图像标记系统-可以保存图像标记数据；
                            // if (!loadNewTrack && noHeight && window._systemType != 6 && window._systemType != 7) {
                            //     Dialog.alert("获取车辆高度失败，将禁止保存数据！<br/>");
                            //     s.style("visibility", "hidden");
                            // }
                            // if (!trackObj.cameraHeight) {
                            //     trackObj.cameraHeight = 1.77;
                            //     noHeight = true;
                            // } 

                            // 图像标记系统-可以保存图像标记数据；
                            var s = d3.$("#KDSEditor-bar button.save");
                            if (!loadNewTrack && noHeight && window._systemType != 6 && window._systemType != 7) {
                                Dialog.alert("获取车辆高度失败，将禁止保存数据！<br/>");
                                s.style("visibility", "hidden");
                            }
                            if (iD.Task.isLocalTaskSys()) {
                                s.style("visibility", "hidden");
                            }

                            resolve(self.tracks[0]);
                        });
                });
            }
            // 轨迹斜面方程
            self.promisePlane = function (param, trackPos) {

                function getPfs(data) {
                    let planeFrame, pfs;
                    pfs = new Map();
                    if (!data) return pfs;

                    for (taskId in data) {
                        planeFrame = data[taskId];
                        _.forEach(planeFrame, function (d) {
                            if (d.groundHeights) {
                                d.groundHeights = JSON.parse(d.groundHeights);
                                d.frameId = d.groundHeights.frameId;
                            }
                        });
                        pfs.set(taskId, planeFrame);
                    }
                    return pfs;
                }
                return new Promise((resolve) => {
                    if (trackPos) {
                        resolve(getPfs(trackPos));
                    } else {
                        d3.json(iD.config.URL.krs + 'track/point/extend')
                            .header("Content-Type", "application/x-www-form-urlencoded")
                            .post(_.map(param, function (v, k) {
                                return k + '=' + (v || '');
                            }).join('&'), function (error, result) {
                                if (!result || !result.result) {
                                    resolve(null);
                                    return;
                                }
                                resolve(getPfs(result.result));
                            });
                    }
                });
            }

            let kieGroup = _.groupBy(iD.Task.d._taskTrack, 'kieVersion');

            function getTrackPromise(res) {

                var arr = [];

                if (Object.keys(kieGroup).length > 0) {
                    _.forEach(kieGroup, (v, idx) => {
                        let _trackIds = _.pluck(v, 'trackId').join(',');
                        let option1 = {
                            callback: "{callback}",
                            kieVersion: idx,
                            showTrackExtend: true,
                            trackIds: _trackIds
                        };
                        if (range) {
                            option1.polygonWkt = range;
                        }
                        arr.push(self.promiseTaskData(option1, res))
                    })
                } else {
                    var kieVersion = iD.Task.d.tags.kieVersion;
                    var option1 = {
                        callback: "{callback}",
                        kieVersion: kieVersion,
                        showTrackExtend: true,
                        trackIds: requestTracks.join(',')
                    };
                    if (range) {
                        option1.polygonWkt = range;
                    }
                    arr.push(self.promiseTaskData(option1, res))
                }
                return arr;
            }

            function getTrackPosData(offsetCal, taskId, dataVersion = null) {
                var arr = [];

                if (Object.keys(kieGroup).length  > 0) {
                    _.forEach(kieGroup, (v, idx) => {
                        let _trackIds = _.pluck(v, 'trackId').join(',');

                        let option1 = {
                            kieVersion: idx,
                            fusionTaskId: taskId,
                            trackIds: _trackIds
                        };
                        if (range) {
                            option1.polygonWkt = range;
                        }
                        if (dataVersion) {
                            option1.ver = dataVersion;
                        }

                        arr.push(self.updateTrackPosData(option1, offsetCal))
                    })
                } else {
                    var kieVersion = iD.Task.d.tags.kieVersion;
                    var option1 = {
                        kieVersion: kieVersion,
                        fusionTaskId: taskId,
                        trackIds: requestTracks.join(',')
                    };
                    if (range) {
                        option1.polygonWkt = range;
                    }
                    if (dataVersion) {
                        option1.ver = dataVersion;
                    }
                    arr.push(self.updateTrackPosData(option1, offsetCal))
                }
                return arr;
            }


            let range = null;
            if (iD.Task.d.tags.range) {
                range = iD.Task.d.tags.materialRange ? iD.Task.d.tags.materialRange : iD.Task.d.tags.range;
                // param1.polygonWkt = _rang;
                // param2.polygonWkt = _rang;
            }

            var posParam = iD.Task.getPosParam();


            var task = taskObj;
            var taskId = task.task_id || '';
            // var param2 = {
            //     kieVersion: kieVersion,
            //     trackIds: requestTracks.join(',')
            // }

            var dataVersion = null;
            if (task && task.layers.length) {
                dataVersion = task.layers[0].dataVersion;
            }

            self.promiseUsedTracks().then(function (res) {
                let promiseTaskDatas = getTrackPromise(res);
                Promise.all(promiseTaskDatas).then(function (args) {
                    if (!self.tracks.length) {
                        callback(null);
                        return;
                    }
                    let _taskId = (iD.Task.d.tags.multiTrackFusionTaskId || (task && task.task_id || ''));
                    let promisePosDatas = getTrackPosData(posParam.offsetCal, _taskId, dataVersion);
                    Promise.all(promisePosDatas).then(function (datas) {
                        let trackPos = {};
                        datas.forEach(d=>{
                            _.assign(trackPos,d);
                        })
                    // self.updateTrackPosData(param2, posParam.offsetCal).then(function (trackPos) {
                        self.updateTrackRTC(trackPos, posParam.offsetCal, posParam.dynamicCal).then(function () {
                            // Promise.all([self.promisePlane(param2, trackPos)]).then(args => {
                                // extendPlaneFrames(args[0]);
                                self.promiseComplete(self.tracks[0], callback);
                            // }).catch((error) => {
                            //     console.error(error);
                            // });
                        });
                    });
                });
            })

            function extendPlaneFrames(d) {
                if (!d) return;
                if (!self.planeFrames) {
                    self.planeFrames = d;
                    return;
                }
                for (let k of d.keys()) {
                    if (!self.planeFrames.get(k)) {
                        self.planeFrames.set(k, d.get(k));
                    }
                }
            }
            self.promiseComplete = function (_track, callback) {
                hideLoading();

                if (!loadNewTrack && (!_track || !_track.nodes.length)) {
                    self.clearData(null);
                    // 不存在轨迹时隐藏视频界面，并初始化地图大小。
                    changePicPlayerDisplay(false);
                    return;
                }
                if (_track.nodes.length) {
                    self.pic.setTracks(_.clone(self.tracks));
                    callback(_track);

                    if (!loadNewTrack) {
                        changePicPlayerDisplay(true);
                        self.pic.resetSize();
                    }
                } else {
                    callback(null);
                }
            }
        },


        /**
         * 获取指定轨迹同方向轨迹列表；
         * @param {String} trackId
         */
        getSameDirectionTracks: function (trackId, trackIndex = 0, opts) {
            var self = this;
            opts = opts || {};
            // 最大距离10m
            var distance = opts.distance || 10;
            var tracks = self.tracks || [];
            var trackObj = self.getTrack(trackId);
            var lineCal = iD.util.LineCalCulate();
            // 同方向最近轨迹
            var angleDiff = 10;
            // var range = 15;
            var nowNode = trackObj.nodes[trackIndex];
            var sameTracks = [];
            var nd = iD.util.getAngleNodes(trackObj.nodes, trackIndex);
            var nowAngle = lineCal.getAngle(
                nd[0].loc[0], nd[0].loc[1],
                nd[1].loc[0], nd[1].loc[1]
            );

            tracks.forEach(function (d) {
                let nodes = d.nodes;
                let angleNodes;
                let dist;
                if (d.trackId == trackId) {
                    return;
                }

                if (nodes.length <= 2) {
                    let line = _.pluck(nodes, 'loc');
                    dist = iD.util.pt2LineDist2(line, nowNode.loc);
                    if (dist.i == -1) {
                        return;
                    }
                    if (dist.dis > distance) {
                        return;
                    }
                    angleNodes = nodes;
                } else {
                    let line = _.pluck(nodes, 'loc');
                    dist = iD.util.pt2LineDist2(line, nowNode.loc);
                    if (dist.i == -1) {
                        return;
                    }
                    if (dist.dis > distance) {
                        return;
                    }
                    angleNodes = iD.util.getAngleNodes(nodes, dist.i);
                }
                if (!angleNodes || angleNodes.length < 2) return;

                let angle = lineCal.getAngle(
                    angleNodes[0].loc[0], angleNodes[0].loc[1],
                    angleNodes[1].loc[0], angleNodes[1].loc[1]
                );
                // console.log(d.trackId, nowAngle, angle, '角度差：' + Math.abs(angle - nowAngle));
                // if(Math.abs(angle - nowAngle) > angleDiff){
                //     return ;
                // }
                if (!iD.util.angleInDiff(nowAngle, angle, angleDiff)) {
                    return;
                }
                sameTracks.push(d);
            });

            return [trackObj].concat(sameTracks);
        },
        /**
         * 刷新RTC信息
         * @param {Object} track 原始轨迹
         * @param {Object} cal 刷新参数
         * @param {Object} trackOffset 原始轨迹偏移量xyz，来自曲线
         */
        getUpdateRTCTrack: function (track, cal, trackOffset) {
            cal = cal || {};
            var self = this;
            var utmXY = true;
            // 保证原始轨迹为准，重新刷新POS
            if (track.__pos_change) {
                track = self.getTrack(track.trackId);
            }

            // 多次clone，30ms以内
            track = _.clone(track);
            // track.nodes = _.clone(track.nodes);
            track.__pos_change = true;
            track.nodes = track.nodes.map(function (node) {
                var result = _.clone(node);
                result.tags = _.clone(node.tags);
                result.loc = _.clone(node.loc);
                result.tags.R = _.clone(node.tags.R);
                result.tags.T = _.clone(node.tags.T);
                result.tags.C = _.clone(node.tags.C);
                if (trackOffset && trackOffset[node.id]) {
                    let offset = trackOffset[node.id];
                    addUtmXYZ(result, {
                        x: offset.x,
                        y: offset.y,
                        z: offset.z
                    });
                }
                // result.__pos_change = true;
                return result;
            });
            let trackDynamic = {
                roll: track.rollDelta || 0,
                pitch: track.pitchDelta || 0,
                azimuth: track.azimuthDelta || 0
            };
            var first = track.nodes[0];
            track.nodes.forEach(function (node) {
                var obj = pos2RTC({
                    // dynamicCal
                    roll: cal.roll,
                    pitch: cal.pitch,
                    azimuth: cal.azimuth,
                    // offsetCal
                    x: cal.x || 0,
                    y: cal.y || 0,
                    z: cal.z || 0
                }, node, first, trackDynamic);
                if (!obj) return;

                node.tags.R = obj.R;
                node.tags.C = obj.C;
                node.tags.T = obj.T;
            });

            function pos2RTC(opts, node, firstNode, trackDynamic) {
                // Object.assign，属性值null、undefined，也会覆盖
                opts = objAssign({
                    x: 0,
                    y: 0,
                    z: 0,
                    roll: 0,
                    pitch: 0,
                    azimuth: 0
                }, opts);

                addNum(node.tags, {
                    roll: opts.roll,
                    pitch: opts.pitch,
                    azimuth: opts.azimuth
                });

                addUtmXYZ(node, {
                    x: opts.x,
                    y: opts.y,
                    z: opts.z
                });

                var param = {
                    x: node.tags.x,
                    y: node.tags.y,
                    roll: node.tags.roll,
                    pitch: node.tags.pitch,
                    azimuth: node.tags.azimuth
                };

                return iD.util.pos2CameraRTC(param, firstNode && firstNode.tags || {}, node.tags.z, trackDynamic);
            }

            // Object.assign，属性值null、undefined，也会覆盖
            function objAssign(a, b) {
                for (let key in b) {
                    if (b[key] != null) {
                        a[key] = b[key];
                    }
                }
                return a;
            }

            function addNum(tags, opts) {
                for (let key in opts) {
                    if (!tags.hasOwnProperty(key)) continue;
                    let val = opts[key];
                    if (!Boolean(val) || isNaN(val)) continue;
                    tags[key] += val;
                }
            }

            function addUtmXYZ(node, opts) {
                var locChanged = false;
                if (opts.x || opts.y) {
                    // 经纬度是UTM偏移量
                    if (utmXY) {
                        var utm = iD.util.LLtoUTM_(node.tags.x, node.tags.y);
                        addNum(utm, {
                            x: opts.x,
                            y: opts.y
                        });
                        var lonlat = iD.util.UTMtoLL_(utm.x, utm.y, utm.zoneNumber);
                        node.tags.x = lonlat[0];
                        node.tags.y = lonlat[1];
                    } else {
                        addNum(node.tags, {
                            x: opts.x,
                            y: opts.y
                        });
                    }
                    locChanged = true;
                }
                if (opts.z) {
                    addNum(node.tags, {
                        z: opts.z
                    });
                    locChanged = true;
                }
                if (locChanged) {
                    node.loc = [
                        node.tags.x,
                        node.tags.y,
                        node.tags.z
                    ];
                }
            }

            return track;
        },
        /**
         * 获取轨迹同方向连续轨迹；
         * @param {String} trackId
         */
        getNextSameDirectionTrack: function (trackId, trackIndex = 0, opts) {
            var self = this;
            opts = opts || {};
            // 最大距离10m
            var distance = opts.distance || 10;
            var tracks = self.tracks || [];
            var trackObj = self.getTrack(trackId);
            var lineCal = iD.util.LineCalCulate();
            // 同方向最近轨迹
            var angleDiff = opts.angle || 10;
            // var range = 15;
            var nowNode = trackObj.nodes[trackIndex];
            var sameTracks = [];
            var nd = iD.util.getAngleNodes(trackObj.nodes, trackIndex);
            var nowAngle = lineCal.getAngle(
                nd[0].loc[0], nd[0].loc[1],
                nd[1].loc[0], nd[1].loc[1]
            );
            // var minTrackId;
            // var minNode;
            // var minDis = Infinity;
            tracks.forEach(function (d) {
                let nodes = [d.nodes[0], d.nodes[1]];
                let angleNodes;
                let dis;
                if (d.trackId == trackId) {
                    return;
                }

                dis = iD.util.distanceByLngLat(nodes[0].loc, nowNode.loc);
                if (dis > distance) {
                    return;
                }
                angleNodes = nodes;

                if (!angleNodes || angleNodes.length < 2) return;

                let angle = lineCal.getAngle(
                    angleNodes[0].loc[0], angleNodes[0].loc[1],
                    angleNodes[1].loc[0], angleNodes[1].loc[1]
                );
                if (!iD.util.angleInDiff(nowAngle, angle, angleDiff)) {
                    return;
                }
                sameTracks.push({
                    dis: dis,
                    track: d
                });
            });

            if (!sameTracks.length) return null;
            var nearTracks = sameTracks.sort(function (d1, d2) {
                return d1.dis - d2.dis;
            }).map(function (d) {
                return d.track;
            });
            // 同一车次的轨迹
            var type = trackObj.trackId.split('_')[0];
            var typeTracks = nearTracks.filter(function (d) {
                return d.trackId.split('_')[0] == type;
            });
            return typeTracks[0] || nearTracks[0];
        },
        /*
         * 通过设备ID，获取设备信息
         */
        getDeviceInfo: function (deviceId) {
            return new Promise((resolve) => {
                var url = iD.config.URL.krms + 'calibrated/survey/device/' + deviceId;
                d3.json(url).get(function (err, data) {
                    if (data && data.result) {
                        resolve(data.result.surveyDevice || {});
                    } else {
                        resolve();
                    }
                });
            });
        }
    });

    let picDataMgr = new DataMgr();

    function changePicPlayerDisplay(show) {
        var classList = ['layout-5_5', 'layout-6_4', 'layout-7_3'];
        var classedList = [false, false, false];
        var $allWrap = d3.select('#KDSEditor-all-wrap');
        if (show) {
            for (var i = 0; i < classList.length; i++) {
                var name = classList[i];
                if ($allWrap.classed(name)) {
                    classedList[i] = true;
                    break;
                }
            }
            if (!_.compact(classedList).length) {
                classedList[1] = true;
            }
            $allWrap.classed(_.zipObject(classList, classedList));
            d3.select('#KDSEditor-picplayer').style('display', 'block');
            $('#KDSEditor-content #_link_compare_recog').show();
            d3.select('.pic-player-shadow').style('display', 'none');
            // 图层列表中的轨迹项
            d3.select('div.background-container .item-pic').classed('hide', false);

            d3.select(window).trigger("resize");
            // 地图上的事务层在相同center时redraw不会重新刷新；
            // 需要移动一下才可以通过redraw重新刷新
            // (picDataMgr.context || editor.context).map().pan([1, 0]);
        } else {
            $allWrap.classed(_.zipObject(classList, classedList))
            d3.select('#KDSEditor-picplayer').style('display', 'none');
            $('#KDSEditor-content #_link_compare_recog').hide();
            d3.select('.pic-player-shadow').style('display', 'none');
            d3.select('div.background-container .item-pic').classed('hide', true);

            d3.select(window).trigger('resize');
        }
    }

    return d3.rebind(picDataMgr, mgrEvent, 'on');
})();