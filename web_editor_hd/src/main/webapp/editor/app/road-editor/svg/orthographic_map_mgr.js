/*
 * @Author: tao.w
 * @Date: 2019-08-28 15:06:39
 * @LastEditors: tao.w
 * @LastEditTime: 2020-07-27 15:14:37
 * @Description: 
 */
iD.svg.orthographicMapMgr = (function () {
    var mgrEvent = d3.dispatch('loading', 'loaded');
    var loading, loadingContainer;
    let _INFO = 'info';
    let _HEIGHT = 'height';

    function showLoading() {
        loading && loadingContainer.call(loading);
    }
    function hideLoading() {
        loading && loading.close();
    }

    var _canvas = document.createElement("canvas");
    _canvas.width = 100;
    _canvas.height = 100;
    var _cxt = _canvas.getContext("2d");

    function canvasResize(__width, __height) {
        _canvas.width = __width;
        _canvas.height = __height;
    }
    function DataMgr() {
        this.tracks = [];
        this.showTrack = null;
        this.pic = null;
        this.orthographicMapData = {};
        this.context = null;
    }

    _.assign(DataMgr.prototype, {

        initPic: function (context) {

            if (_.isNull(this.pic)) {
                this.pic = iD.svg.orthographicMap(context.projection, context);
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

            iD.Task.on('start.orthographicMap', function (task) {
                // 不能进入正射图面板
                if (iD.Task.d && iD.Task.d.tags.processDefinitionKey != 'PavementDisease') {
                    return;
                }

                if (!task) {
                    self.clearData(null);
                    return;
                } else if (task) {

                    self.trackIds = task.tags.trackIds.split(",") || [];
                    self.tracks = [];
                    self.orthographicMapData = {};
                    showLoading();
                    self.loadTrackData(self.trackIds, function (_track) {
                        self.redrawPic(_track.trackId);
                    });
                }
            })
        },

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
                        param = Object.assign(param, trackDynamic);
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
                            lastOffset = offset;
                        } else {
                            if (lastOffset) {
                                param = Object.assign(param, lastOffset);
                            }
                        }
                    }
                    updateNode(track, node, param);
                }

                if (indexParam && lastIndex < track.nodes.length - 1) {
                    track.nodes.slice(lastIndex + 1).forEach((node) => {
                        updateNode(track, node, indexParam);
                    });
                }
            });

            function updateNode(track, node, cal) {
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
                }, node, first);
                if (!obj) {
                    console.error(node.id + ' RTC计算失败');
                    return;
                }

                node.tags.R = obj.R;
                node.tags.C = obj.C;
                node.tags.T = obj.T;
            }

            function pos2RTC(opts, node, firstNode) {
                // Object.assign，属性值null、undefined，也会覆盖
                opts = objAssign({
                    x: 0,
                    y: 0,
                    z: 0,
                    roll: 0,
                    pitch: 0,
                    azimuth: 0
                }, opts);

                // addNum(node.tags, {
                //     roll: opts.roll,
                //     pitch: opts.pitch,
                //     azimuth: opts.azimuth
                // });
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

                return iD.util.pos2CameraRTC(param, firstNode && firstNode.tags || {}, node.tags.z,opts);
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
                        var lonlat = iD.util.UTMtoLL_(utm.x, utm.y,utm.zoneNumber);
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
            callback = callback || function () { };
            var self = this;
            //因为记录tracks是异步过程，需要等全部数据返回存储后再绘制
            var tracks = self.tracks;
            var index = _.pluck(tracks, 'trackId').indexOf(currentId);

            var _track = tracks[index];
            this.showTrack = _track;
            if (!_track) {
                Dialog.alert("选择轨迹不在数据集中，请重新选择！");
                return;
            }
            //在执行绘制前，需要先获取当前轨迹的车高及相机内参后在做渲染
            self.trackObj = _track;
            if (_track.trackId != self.trackId || !self.trackId) {
                self.trackId = _track.trackId;
            }
            let _t = iD.Task.d.tags.orthphotoTaskId;
            self.orthographicData(_t, this.showTrack).then(function (args) {
                self.showTrack = args;
                iD.Task.d.tags._trackTime = self.showTrack.nodes[0].tags.locTime;
                //加载视频
                self.pic && self.pic.redrawPic(args, index, true);
                hideLoading();
                callback && callback(args);
            });




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
        loadTrackImageServ: async function (tracks) {
            var self = this;
            self._image_serv = {};
            var trackIds = _.pluck(tracks, 'trackId');

            return new Promise((resolve) => {
                if (!iD.config.URL.track_location) {
                    resolve();
                    return;
                }
                d3.json(iD.config.URL.track_location + '?trackIds=' + trackIds.join(','))
                    .get(function (error, data) {
                        self._image_serv = data && data.result || {};
                        var hostGY = iD.config.URL.track_image_guiyang_host;
                        var hostBJ = iD.config.URL.track_image_beijing_host;
                        var hostListGY = iD.config.URL.track_image_guiyang_hostlist || [];
                        var hostListBJ = iD.config.URL.track_image_beijing_hostlist || [];
                        _.forEach(self._image_serv, function (url, tid) {
                            let hostList, host;
                            if (url.indexOf('/' + hostGY) != -1) {
                                hostList = hostListGY;
                                host = hostGY;
                            } else if (url.indexOf('/' + hostBJ) != -1) {
                                hostList = hostListBJ;
                                host = hostBJ;
                            } else {
                                return;
                            }
                            if (!hostList || !hostList.length) return;

                            var idx = Math.round(Math.random() * (hostList.length - 1));
                            if (!hostList[idx]) return;

                            url = url.replace('/' + host, '/' + hostList[idx]);
                            self._image_serv[tid] = url;
                        });
                        resolve();
                    });
            });
        },
        buildTaskData: function (result, trackId) {
            if (!result || result.length == 0) {
                return [];
            }
            var self = this;
            var tList = result;

            if (!tList || !tList.length) {
                return [];
            }

            var track_image = self._image_serv[trackId];
            if (track_image && track_image.indexOf('/prd') == -1) {
                track_image += 'prd/';
            }
            track_image = track_image || iD.config.URL.track_image;

            var traceList = [];

            for (var i = 0, len = tList.length; i < len; i++) {

                var tmpTrace = tList[i];
                tmpTrace.trackId = trackId;
                tmpTrace.picUrl = track_image + 'image/get?trackPointId=' + tmpTrace.trackPointId
                    + '&type=00&seq=005&imageType=jpg&trackId=' + tmpTrace.trackId;

                if (!tmpTrace.picH) {
                    tmpTrace.picH = 2048;
                }
                if (!tmpTrace.picW) {
                    tmpTrace.picW = 2448;
                }

                var node = {
                    id: tmpTrace.trackPointId,
                    loc: [tmpTrace.x, tmpTrace.y, tmpTrace.z],
                    tags: tmpTrace
                }
                traceList.push(node);
            }
            return traceList;
        },
        promiseTaskData: async function (param) {
            let self = this;
            return new Promise((resolve, reject) => {
                mgrEvent.loading();

                d3.json(iD.config.URL.krs + 'v3/track/get/tracks/byTrackIds')
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .post(_.map(param, function (v, k) {
                        return k + '=' + (v || '');
                    }).join('&'), async function (error, result) {
                        mgrEvent.loaded();
                        if (!result || !result.result) {
                            Dialog.alert("轨迹加载失败<br/>" + (result && result.message || ""));
                            resolve(null);
                            return;
                        }
                        let trackObj, trackPoints, K;
                        await self.loadTrackImageServ(result.result || []);

                        for (var i = 0; i < result.result.length; i++) {
                            let track = result.result[i];
                            trackPoints = self.buildTaskData(track.pointList, track.trackId);
                            cameraParams = track.cameraParams;
                            cameraHeight = track.cameraHeight;
                            if (!trackPoints || !trackPoints.length) {
                                continue;
                            }
                            K = [[cameraParams.focusX, 0, cameraParams.principlePointX],
                            [0, cameraParams.focusX, cameraParams.principlePointY],
                            [0, 0, 1]]

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
                            }
                            self.tracks.push(trackObj);
                        }

                        if (iD.Task.isLocalTaskSys()) {
                            s.style("visibility", "hidden");
                        }

                        resolve(self.tracks[0]);
                    });
            });
        },
        loadPointInfo: function (id, orthphotoTaskId) {
            let url = iD.config.URL.hbase + "kv/get/file?namespace=road-detection&key=info_" + id + "-" + orthphotoTaskId;
            return new Promise((resolve, reject) => {
                d3.json(url)
                    .get(function (error, data) {
                        if (error || !data) {
                            Dialog.alert(id + '获取正射信息数据失败');
                            resolve(null);
                            return;
                        }
                        resolve({ pointId: id, type: _INFO, data });
                    });
            });
        },
        loadPointHeight: function (id, orthphotoTaskId) {
            let url = iD.config.URL.hbase + "kv/get/file?namespace=road-detection&key=height_" + id + "-" + orthphotoTaskId;
            // url = 'http://192.168.7.22:13920/web_editor_wt2/editor/f.png';
            return new Promise((resolve, reject) => {
                // var _canvas = document.createElement("orthographicCanvas");
                // _canvas.width = 100;
                // _canvas.height = 100;
                // var _cxt = canvas.getContext("2d");
                var img = new Image();

                img.src = url;
                img.error = function () {
                    resolve({ pointId: id, type: _HEIGHT, data: null });
                }
                img.crossOrigin = "Anonymous";
                img.onload = function () {
                    let width = img.width;
                    let height = img.height;
                    canvasResize(width, height);
                    // _canvas.width = img.width;
                    // _canvas.height = 100;
                    //  context.drawImage(img, 0, 0, width, width);
                    _cxt.drawImage(img, 0, 0);
                    let imageData = _cxt.getImageData(0, 0, width, height);
                    resolve({ pointId: id, type: _HEIGHT, data: imageData.data });
                    // console.log(context.getImageData(0, 0, width, heigth))
                }

                // var oReq = new XMLHttpRequest();
                // oReq.open("GET", url, true);
                // oReq.responseType = "arraybuffer";

                // oReq.onload = function (oEvent) {
                //     var arrayBuffer = oReq.response; // Note: not oReq.responseText
                //     buffer = new Uint8Array(arrayBuffer);

                //     for (var i = 0, j; i < buffer.length; i++) {

                //         j = buffer[i];
                //         buffer[i] = ((j & 0xff) << 8) | ((j & 0xff00) >>> 8); // needed to swap bytes for correct unsigned integer values
                //     }

                //     // console.log(buffer);
                //     var uInt8Array = new Uint8Array(arrayBuffer);
                //     var i = uInt8Array.length;
                //     // var binaryString = new Array(i);
                //     // console.log(uInt8Array);
                //     resolve({ pointId: id, type: _HEIGHT, uInt8Array});
                //     // var canvas = document.createElement("canvas");
                //     // canvas.width = 931;
                //     // canvas.height = 552;
                //     // var context = canvas.getContext("2d");
                //     // var img = new Image();

                //     // img.src = "http://192.168.7.22:13920/web_editor_wt2/editor/b.png";
                //     // context.drawImage(img, 0, 0, canvas.width, canvas.height);
                //     // imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                //     // console.log(context.getImageData(0, 0, 931, 552))


                //     // while (i--) {
                //     //     binaryString[i] = String.fromCharCode(uInt8Array[i]);
                //     // }
                //     // console.log(binaryString)
                //     // if (arrayBuffer) {
                //     //     var byteArray = new Uint8Array(arrayBuffer);

                //     //     for (var i = 0; i < byteArray.byteLength; i++) {

                //     //     }
                //     // }
                // };

                // oReq.send(null);
                // d3.xhr(url)
                //     .get(function (error, data) {
                //         if (error || !data) {
                //             Dialog.alert(id + '获取正射高度失败');
                //             resolve(null);
                //             return;
                //         }
                //         resolve({ pointId: id, type: _INFO, data });
                //     });
            });
        },

        orthographicData: async function (orthphotoTaskId, track) {
            let self = this;
            let url = iD.config.URL.hbase + "kv/get/file?namespace=road-detection&key=index-" + orthphotoTaskId;
            return new Promise((resolve, reject) => {
                d3.json(url)
                    .get(function (error, data) {
                        if (error || !data || !data.length) {
                            Dialog.alert('获取正射数据失败');
                            resolve(null);
                            return;
                        }
                        let promiseInfos = [], promiseHeights = [];
                        let result = {};
                        let _track = _.clone(track);
                        let nodes = track.nodes;
                        _track.nodes = _nodes = [];

                        // let track_image = self._image_serv[track.id];
                        // if (track_image && track_image.indexOf('/prd') == -1) {
                        //     track_image += 'prd/';
                        // }
                        // track_image = track_image || iD.config.URL.track_image;
                        // data = data.slice(0,5);
                        data.forEach(d => {
                            promiseInfos.push(self.loadPointInfo(d, orthphotoTaskId));
                            promiseHeights.push(self.loadPointHeight(d, orthphotoTaskId));
                            result[d] = {
                                info: null,
                                height: null,
                            }
                            //cloneDeep
                            let _node = _.clone(nodes.find(n => {
                                return n.id == d;
                            }));
                            let _tags = _.clone(_node.tags);
                            // _tags.picUrl = track_image + 'image/get?trackPointId=' + tmpTrace.trackPointId
                            // + '&type=00&seq=005&imageType=jpg&trackId=' + tmpTrace.trackId;

                            // projection_400942593_20191112134844751682
                            _tags.picUrl = iD.config.URL.hbase + "kv/get/file?namespace=road-detection&key=projection_" + d + "-" + orthphotoTaskId;
                            _node.tags = _tags;
                            _nodes.push(_node);
                        })
                        track.nodeId = track.nodes[0].id;

                        Promise.all(promiseInfos.concat(promiseHeights)).then((args) => {
                            args.forEach(d => {
                                if (d.type == _INFO) {
                                    let n = _track.nodes.find(node => {
                                        return node.id == d.pointId;
                                    })
                                    if (!n) console.log('正射数据匹配info失败:', d.pointId);
                                    Object.assign(n.tags, d.data);
                                    // n.tags.picW = n.tags.rows;
                                    // n.tags.picH = n.tags.cols;
                                    n.tags.picW = n.tags.cols;
                                    n.tags.picH = n.tags.rows;
                                } else if (d.type == _HEIGHT) {
                                    let n = _track.nodes.find(node => {
                                        return node.id == d.pointId;
                                    })
                                    if (!n) console.log('正射数据匹配info失败:', d.pointId);
                                    n.tags.picHeight = d.data;
                                }
                            })
                            resolve(_track);
                        })
                        // Promise.all().then(function (args) {
                        //    console.log(args);
                        //    resolve(true);
                        // });
                    });
            });
        },
        loadTrackData: function (loadTrackId, callback) {
            var self = this;
            var taskObj = iD.Task.d;
            callback = callback || function () { };

            if (!taskObj || !loadTrackId || !loadTrackId.length) {
                callback(null);
                return;
            }
            var requestTracks = _.isArray(loadTrackId) ? loadTrackId : [loadTrackId];

            self.tracks = self.tracks || [];



            // 加载轨迹点列表

            var posParam = iD.Task.getPosParam();
			var kieVersion = iD.Task.d.tags.kieVersion;
            var param1 = {
                callback: "{callback}",
				kieVersion: kieVersion,
				showTrackExtend: true,
                trackIds: requestTracks.join(',')
            };

            var task = taskObj;
            var param2 = {
                trackIds: requestTracks.join(',')
            }
            // if (iD.Task.d.tags.range) {
            //     param1.polygonWkt = iD.Task.d.tags.range;
            //     param2.polygonWkt = iD.Task.d.tags.range;
            // }

            if (task && task.layers.length) {
                var dataVersion = task.layers[0].dataVersion;
                param2.ver = dataVersion;
            }

            self.promiseTaskData(param1).then(function (_track) {
                if (!_track) {
                    callback(null);
                    return;
                }

                self.pic.setTracks(_.clone(self.tracks));
                param2.fusionTaskId = (task && task.tags.fusionTaskId || '');

                self.updateTrackPosData(param2, posParam.offsetCal).then(function (trackPos) {
                    self.updateTrackRTC(trackPos, posParam.offsetCal, posParam.dynamicCal).then(function () {
                        callback(_track);
                    });
                });
            });
        },
    });

    let picDataMgr = new DataMgr();

    return d3.rebind(picDataMgr, mgrEvent, 'on');
})();

