/*
 * @Author: tao.w
 * @Date: 2019-10-30 22:06:25
 * @LastEditors: tao.w
 * @LastEditTime: 2021-02-25 17:47:09
 * @Description: 
 */
/*
 * 轨迹图像面板
 */
iD.svg.orthographicMapPlayer = function (context) {
    var player; // 保存new picPlayer()后的对象
    var dispatch = d3.dispatch('ready', 'loadedmetadata', 'close', 'picUpdate', 'referneceUpdate',
        'click2sub_click', 'click2sub_close', 'dividerVisibleChange', 'trackVisibleChange');
    var loading = iD.ui.Loading(context).message("图片初始化中,请稍后").blocking(false);
    var loadImageFirstIndex = 0; //缓存图片点起始位置
    var loadImagelastIndex = 20;//缓存图片点终点位置
    var currentTrackPointDis = 60;//当前帧距离轨迹点集合60米范围内定义
    var imgLoading = true;
    var imageEndLoadTime;
    var imageStartLoadTime;
    var markDrawStatus = {
        drawing: false,
        type: '', // 区分类型
        secType: '', // 次要类型，桥底线、路牌的第一个节点是前方交会，之后会根据第一个点的坐标来计算其他点坐标；
        shape: null,  //主要是用来记录线、面当前元素
        postCall: _.noop //通过前方交会，获取坐标后才会进行绘制；
    };
    /**
     * zrender节点相关参数
     */
    var zrenderNodeStatus = {
        // 节点拖拽的过程中，经过的shape
        dragoverShape: null,
        downOffset: null,
        moveOffset: null,
        // 例如地图上的拉框，保存该面对象的id
        drawingEntityid: null,
        // 绘制车道线/辅助线时，开始绘制的entity
        downEntityid: null,
        // 绘制车道线/辅助线时，开始绘制的shape
        downShape: null
    };
    /**
     * 标记特征点，
     * 保存变量和反投的shape，执行 桥底线 以外的操作时需要清空
     * 绘制桥底线时需要用到
     */
    var markVectorPoint = {
        loc: null,
        shape: null,
        points: null
    };

    const constant = _.clone(iD.Static.playerConstant);
    // style ="width:100%;height:100%"
    require.config({
        packages: [
            {
                name: 'zrender',
                location: './zrender/src',
                main: 'zrender'
            }
        ]
    });

    // 图片类参数，显示的图片使用解析新的picUrl
    const picUrlParam = {
        "0": {
            type: "00",
            seq: "005",
            imageType: "jpg"
        },
        // 识别（车道线）
        "1": {
            type: "04",
            seq: "000",
            imageType: "png"
        },
        // 点云
        "2": {
            type: "99",
            seq: "000",
            imageType: "png"
        },
        // 识别（路面要素）
        "3": {
            type: "09",
            seq: "000",
            imageType: "png"
        },
        // 识别（路牌）
        "4": {
            type: "05",
            seq: "000",
            imageType: "png"
        },
        // 识别（杆状物、路牌）
        "5": {
            type: "06",
            seq: "000",
            imageType: "png"
        },
        // 识别（杆状物、路牌、车道线）
        "6": {
            type: "07",
            seq: "000",
            imageType: "png"
        },
        // 识别（全要素）
        "7": {
            type: "09",
            seq: "001",
            imageType: "png"
        },
        type: "0",
        subType: ""//记录当前选择的批次 Tilden
    };


    // 缩放
    var viewZoomParam = {
        position: [0, 0],
        scale: 1,
        min: 1,
        max: 8
    };
    var MASKRCNN_DATAS = [];

    // 
    var SHAPE_KEEP_HANDLE = iD.picUtil.createZrenderShapeKeepHandle();

    // 核线测量工具

    var drawTool = new iD.svg.PicDrawTool(context, {
        constant: constant,
        markDrawStatus: markDrawStatus,
        zrenderNodeStatus: zrenderNodeStatus,
        viewZoomParam: viewZoomParam,
        isSameCircleSize:true,
        markVectorPoint: markVectorPoint
    });
    var playerFooter = new iD.svg.PlayerFooter(context, {
        constant: constant,
        markDrawStatus: markDrawStatus,
        picUrlParam: picUrlParam
    });
   
    var intersectionList = iD.svg.PlayerIntersectionList(context);

    /*
     * 判断键盘按下事件(keydown)
     * 进行视频界面上一帧与下一帧的切换
     * 增加第二次判断
     */
    var next_throttle = _.throttle(function (self, key) {
        nextShow(self);						//下一帧
        iD.picPlayerLogger.picPlay('play_forward', self.pic_point, key);
    }, 400, {
        leading: false,
        trailing: true
    });

    var pre_throttle = _.throttle(function (self, key) {
        preShow(self);							//上一帧
        iD.picPlayerLogger.picPlay('play_back', self.pic_point, key);
    }, 400, {
        leading: false,
        trailing: true
    });


    // 事件监听列表；
    // 视频操作过程中若地图有其他操作，初始化视频操作
    context.on('enter.pic-player', function () {
        if (!player) return;
        if (context.selectedIDs().length == 0) {
            drawTool.clearZRenderHover();
        }
        // 保证“视频编辑”按钮保持选中状态
        //		var $btn = player.picTools.select('#_pic_edit_');
        //		if($btn.size()){
        //			var active = $btn.classed('active');
        //		}
        if (context.mode().id == 'browse') {
            return
        }
        if (context.mode().id != 'select') {
            // 选中时可能会用到downShape等参数
            drawTool.clearZRenderNodeStatus();
        }
        // 标定控制点保持选中状态
        if (markDrawStatus.type != constant.TOOL_TRACK_CONTROLPOINT) {
            clearFooterButton();
        }
        hideRightPic();
        drawTool.clearLeftZrenderMarker();
        //  	if($btn.size() && active){
        //			$btn.classed('active', true);
        //		}
    });

    // var __pichis_timer, __picupdate_modes = ['browse'];
    context.history().on("change.pic-player", function (difference, extent) {
        // 通过context.perform等方法实际操作过history的记录后，会有一份新的graph，
        // 所以旧的 result._entity 数据需要更新
        if (!difference || !difference.length()) {
            return;
        }
        player._refreshViewTextTag();
        // player.resetCanvas();
    });
    context.history().on('pop.pic-player', function () {
        player.resetCanvas();
    });
    context.event.on('selected.pic-player', function (entities) {
        // 偶现拉框选择后，会触发behavior/select.js中的click事件，导致entities为0
        if (entities.length == 0) {
            drawTool.clearZRenderHover();
        }
        if (entities.length == 1) {
            // 图像标记-点击后定位
            var datum = entities[0];
            if (datum.tags.TASKID == iD.Task.d.task_id && _.include([
                iD.data.DataType.IMAGE_TAG,
                iD.data.DataType.QUESTION_TAG
                //                  iD.data.DataType.ANALYSIS_TAG
            ], datum.modelName)) {
                if (datum.tags.TRACKPOINTID && player && player._zrender) {
                    if (datum.tags.BATCH && picUrlParam.type != '0') {
                        player.setPicBatch(datum.tags.BATCH, false);
                    }
                    // 视频上定位
                    player.locateTrackPointToPlayer(datum.tags.TRACKPOINTID, datum.tags.TRACKID);
                    // 高亮
                    iD.OrthoggraphicAutoMatch.shapeHover(player, [datum.id]);
                }
            }
            iD.logger.editElement({
                'tag': "selected_target",
                'entityId': datum.osmId() || '',
                'modelName': datum.modelName
            });
            if (player.developShow && [
                iD.data.DataType.ANALYSIS_TAG
            ].includes(datum.modelName)) {
                showLeftbar();
            }
        }
        if (!_.include([
            constant.TELEGRAPH_LAMP_HOLDER,
            constant.ADD_TRAFFICLIGHT
        ], markDrawStatus.type)) {
            return;
        }
        if (entities.length == 0 && context.selectedIDs().length == 1) {
            // 灯头时取消选择
            clearFooterButton();
            return;
        }
        if (entities.length == 1) {
            var entity = entities[0];
            if (!iD.picUtil._entityIsPoleTop(entity.id)) {
                clearFooterButton();
            }
        } else {
            clearFooterButton();
        }
    });
    // 右侧图层面板发生改动
    context.ui().layermanager.on('change.pic-player', function (lay) {
        if (!lay) return;
        if (lay && lay.editable != undefined && lay._parentType == 'elements') {
            playerFooter.refreshFooterBtnDisplay(lay);
            clearFooterButton();
        }
    });
    function showLeftbar() {
        iD.ui.LeftBarControl.show && iD.ui.LeftBarControl.show();
    }
 
    function picPlayer() {
        this.canvasClickCheck = true;
        this.wayInfo = null;
        this._locate_point_index = 0;
        this.surface = null;
        // 视图
        this.pics = null;
        // zrender底层
        this.$viewBottom = null;
        // 工具条
        this.picTools = null;
        // 状态栏
        this.statusBar = null;
        // 顶部标题栏
        this.headBar = null;
        //this.directNum = 0;
        this.loadImageLenght = 2;  //一次缓存图片点长度数量
        // loadImageFirstIndex =0; //缓存图片点起始位置
        // loadImagelastIndex =60;//缓存图片点终点位置
        this.picBox = null;
        this.$zoomList = null;
        this.divItem = null;
        // 前方交会第二帧
        //      this.$rightPic = null;
        // 单独的图片右侧显示
        this.$rightBody = null;
        this.playerTimeId = null;
        // this.pic_nodeid = null;
        this.pic_point = null;
        this.classified = null;
        this.picCount = 0;
        this.time = 1;
        this.isNewBatch = false;
        this.allNodes = null;
        this._zrender = null; //图形渲染
        this.dividerCanvasGeometrys = [];//记录车道线canvas数据属性
        this.rightPointIndex = 0; // 右侧图片序号
        this.selectPicIndex = 0;
        this.playStatus = "pause";
        this.direction = null; //播放方向
        this.picMinGroup = null; //图片上方缩略图，用于dot点播放
        this.config = null;
        // this.mapContent = document.getElementById("KDSEditor-content").getBoundingClientRect();
        this.dataMgr = iD.svg.orthographicMapMgr;
        this.dialog = null;
        this.playDirection = "forward";
        this.dot_imgs = [];
        this.dot_img = null; //存储当前自动识别显示的img，因为一个dot有多个img， 每一个img都会有自己的信息， 需要区分
        // 开发功能
        this.developShow = false;
        // 判断是否在拖拽时可播放帧数
        this.isPlayPic = true;
        this._is_play_speedhour = false; // 是否为时速播放（不缓存后续图片）；
        this._inited = false;
        this._show_maskrcnn = false; // 显示maskrcnn识别结果
        this._click2sub_epiline = false; // 主窗口点击，副窗口生成核线
        this._linkage_pcloud = true;
        this.zrenderDividerVisible = true;
        this.zrenderTrackVisible = true;
        this.potreeVisible = false;
    }

    /**
     *
     * @param {Object} surface
     * @param {Object} self
     * @param {Boolean} jumpOne 只前进1帧，默认false，使用player.time，true播放时使用
     */
    function preShow(self, jumpOne = false) {
        // var currentDiv = d3.select("div.carousel-inner div.item.active");
        // if (currentDiv.size() == 0) {
        //     return;
        // }

        // if (self.dataMgr.loadDataStatus == "loading") {
        //     return;
        // }
        if (!self.allNodes || self.allNodes.length == 0 || (self.selectPicIndex == 0)) {
            return;
        }
        var jumpNum = 1;
        if (!jumpOne) {
            jumpNum = parseInt(self.time);
        }
        var newPicIndex = self.selectPicIndex - jumpNum;
        if (newPicIndex < 0) {
            newPicIndex = 0;
        }
        iD.UserJobHeartbeat.setJobStatus();
        var preDiv = self.allNodes[newPicIndex] || null;
        if (preDiv) {
            trackPointId1 = preDiv.tags.trackPointId;
            self._refreshViewTextTag(preDiv);
            if (loadImagelastIndex == self.selectPicIndex && imgLoading) {
                showLoading();
                return;
            }
            self.clearMark();

            self.selectPicIndex = newPicIndex;
            self.pic_point = preDiv;
            imgLoaded();
            self.dot_imgs = [];
            playerFooter.updateTitle(preDiv);
            self.updateImgUrl(self.divItem, preDiv);
            rightPicNext(self);

            self.indexUpdate(); //重新计算取图序列；
            // self.preloadImage(self.allNodes); //图片预加载
            self.preLoadOneImage(self.allNodes, loadImageFirstIndex);

            picUpdate(self);

            var type = iD.UserBehavior.getAction("keyup");
            // iD.picPlayerLogger.picPlay('play_back', self.pic_point, type);
        } else {
            if (self.dataMgr.preEmptyFlag || self.selectPicIndex <= 0) {
                if (self.playerTimeId) {
                    window.clearInterval(self.playerTimeId)
                }
            }
        }
        player.getPlayerFooter().$dom.select(".footer-progress-bar")
            .dispatch("picPlayerEvt", { playerData: { current: self.selectPicIndex } });

        // if (player._linkage_pcloud) {
        //     iD.util.locationPotree(viewer, _pic.pic_point, _pic.wayInfo.K);
        // }
    }


    /**
     * 加载轨迹位置并显示图像，根据self.selectPicIndex参数判断位置，加载下一个位置
     * @param {Element} surface
     * @param {Object} self
     * @param {Boolean} jumpOne 只前进1帧，默认false，使用player.time，true播放时使用
     */
    function nextShow(self, jumpOne = false) {
        //var count_limit = 40;
        // var currentDiv = d3.select("div.carousel-inner div.item.active");
        // if (currentDiv.size() == 0) {
        //     return;
        // }
        if (!self.allNodes || self.allNodes.length == 0 || (self.selectPicIndex == self.allNodes.length)) {
            return;
        }
        var jumpNum = 1;
        if (!jumpOne) {
            jumpNum = parseInt(self.time);
        }
        var newPicIndex = self.selectPicIndex + jumpNum;
        if (newPicIndex > self.allNodes.length - 1) {
            newPicIndex = self.allNodes.length - 1;
        }
        var nextDiv = self.allNodes[newPicIndex] || null;

        iD.UserJobHeartbeat.setJobStatus();
        if (nextDiv) {
            trackPointId1 = nextDiv.tags.trackPointId;
            self._refreshViewTextTag(nextDiv);

            if (loadImageFirstIndex == self.selectPicIndex && imgLoading) {
                showLoading();
                return;
            }
            self.clearMark()
            self.selectPicIndex = newPicIndex;
            self.pic_point = nextDiv;
            self.dot_imgs = [];
            //更新标题
            playerFooter.updateTitle(nextDiv);
            self.updateImgUrl(self.divItem, nextDiv)
            rightPicNext(self);

            imgLoaded();
            self.indexUpdate(); //重新计算取图序列；
            // self.preloadImage(self.allNodes); //图片预加载
            self.preLoadOneImage(self.allNodes, loadImagelastIndex);
            // 渲染图片上的图形信息；
            picUpdate(self);

        }

        if (self.selectPicIndex + 1 == self.picCount && nextDiv == null) {

            if (self.playerTimeId) {
                window.clearInterval(self.playerTimeId)
            }

            //self.allNodes = null;
            //}

        }
        player.getPlayerFooter().$dom.select(".footer-progress-bar")
            .dispatch("picPlayerEvt", { playerData: { current: self.selectPicIndex } });


    }
    // 更新图片上方的图形
    function picUpdate(self) {
        drawTool.clearZRenderHover();
        hideRightPic();

        //刷新当前帧斜面方程
        self.hoverPlay();
        // if(self.playStatus == 'pause'){
        //     self.dataMgr.resetPlanes(self.selectPicIndex);
        //     iD.util.getTrackPointsByDis(self.pic_point, iD.picUtil.player.allNodes, currentTrackPointDis);
        // }


        self.allNodes && dispatch.picUpdate(self.pic_point, self.selectPicIndex);
        // 切换到新的轨迹点后，绘制的数据无法保存
        // 对接坐标反投服务的话，可以在每次切换轨迹点后，获取地图上的entity列表
        // 根据坐标以及trackId计算出像素坐标，再在影像上绘制出来
        // 例如拖拽操作结束后，也会触发container-inner的click事件
        player.canvasClickCheck = true;
        if (!d3.select('.picplayerimg.recognize').classed('hide')) {
            updateRecognizeUrl(self.pic_point);
        }

        // 切换帧也保持道路绘制功能；
        if (!(markDrawStatus.drawing && _.include([
            constant.ADD_DIVIDER,
            constant.ADD_OBJECT_PL,
            constant.ADD_BARRIER_GEOMETRY,
            constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_PAVEMENT_DISTRESS_LINE,
            constant.ADD_PAVEMENT_DISTRESS_LINE2,
            constant.ADD_OBJECT_PG,
            constant.POLYLINE_ADD_NODE,
            constant.DIVIDER_ADD_MIDDLEPOINT,
            constant.ADD_SIDE_WALK
        ], markDrawStatus.type))) {
            //          if (!$("#_pic_edit_").hasClass("active")) {}
            clearFooterButton();
        }

        // iD.util.getTrackPointsByDis(self.pic_point, iD.picUtil.player.allNodes, currentTrackPointDis);
        drawTool.resetCanvas();
    }

    function clearFooterButton() {
        //      d3.selectAll('.btn-group button').classed('active',false);
        d3.selectAll('.btn-group button').classed('active', function () {
            if (this.__active == true) return true;
            return false;
        });
        if (_.include([
            constant.ADD_DIVIDER,
            constant.ADD_OBJECT_PL,
            // constant.ADD_PAVEMENT_DISTRESS_LINE,
            // constant.ADD_PAVEMENT_DISTRESS_LINE2,
            // constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_SIDE_WALK,
            constant.BRIDGE_BOTTOM_LINE,
            constant.ADD_OBJECT_PG
        ], markDrawStatus.type)) {
            drawTool.clearWrongShapeAndEntity(markDrawStatus.shape);
            drawTool.clearTempShape();
            // 面类型绘制过程中，更改的是shape本身，初始化形状；
            if (markDrawStatus.shape && markDrawStatus.shape.type == 'polygon' && markDrawStatus.shape._entityid) {
                var entity = context.hasEntity(markDrawStatus.shape._entityid);
                if (entity) {
                    var eids = [entity.id].concat(_.uniq(entity.nodes));
                    drawTool.resetPointToPicPlayer(eids);
                }
            }
        } else if ([
            constant.ADD_BOARD_POLYGON,
            constant.ADD_BOARD_POLYGON_PLANE,
            constant.ADD_TRAFFICLIGHT
        ].includes(markDrawStatus.type)) {
            // shape上没有绑定entityid，双击结束后才会创建地图要素
            var shape = markDrawStatus.shape;
            if (shape && (!shape._entityid || !context.hasEntity(shape._entityid))) {
                drawTool._zrender.remove(shape);
            }
        }
        markDrawStatus.drawing = false;
        markDrawStatus.type = '';
        markDrawStatus.secType = '';
        markDrawStatus.shape = undefined;
        tempShape = null;
        drawTool.clearVectorPointData();
    }

    function imgLoaded(obj = null) {
        var desc = {};
        if (obj) {
            imageEndLoadTime = new Date();
            desc.taskId = iD.Task.d.task_id;
            desc.projectId = iD.Task.d.tags.projectId;
            desc.imgLoadCount = obj.length;
            desc.startTime = imageStartLoadTime.getTime();
            desc.endTime = imageEndLoadTime.getTime();
            sendPicPlayerImgLoad(JSON.stringify(desc));

            //功能埋点：图片预取结束
            iD.picPlayerLogger.picPreLoadEnd();
        }
        // loading.close();
        imgLoading = false;
    }
    function showLoading() {
        // 时速播放时不缓存
        if (!player || player._is_play_speedhour) {
            return;
        }
        // context.container().call(loading);
    }

    // 更新右侧面板的图片
    function rightPicNext(self) {
        // 前方交汇第二帧跨度
        var nextIndex = self.selectPicIndex - 5;
        let step = d3.select('.intersection-step');
        let _tempIndex = 0;
        if (!step.empty()) {
            _tempIndex = parseInt(step.value());
            nextIndex = self.selectPicIndex - _tempIndex;
        }

        if (nextIndex > self.allNodes.length - 1) {
            nextIndex = self.allNodes.length - 1;
        } else if (nextIndex < 0) {
            nextIndex = 0;
        }
        //      var nextDiv = self.allNodes[self.rightPointIndex + 1] || null;
        var nextDiv = self.allNodes[nextIndex];
        if (nextDiv) {
            self.rightPointIndex = nextIndex;
        }
    }

    /**
     *
     * @param {Boolean} intersectionEnd 是否是前方交会结束时隐藏第二帧
     */
    function hideRightPic(intersectionEnd) {
        player.updateImgUrl(player.divItem, player.pic_point);
        player.mouseZoomChange(viewZoomParam.scale, false, true);
    }

    /**
     * 根据类型，解析新的picUrl参数
     */
    function parseNewPicUrl(node, type = picUrlParam.type) {
        var param = picUrlParam[type];
        var url = node.tags.picUrl;
        if (!param) {
            return url;
        }
		/*
        for(var key in param){
            var value = param[key];
            url = url.replace( new RegExp("(&?" + key + "=)[^&]+", "g"), "$1" + value );
        }
        */
        if (type != '0') {
            var track_image = iD.config.URL.track_image;
            url = track_image + 'image/get?trackPointId=' + node.tags.trackPointId;
            for (var key in param) {
                var value = param[key];
                url += ('&' + key + '=' + value);
            }
            url += '&trackId=' + node.tags.trackId;
        } else {
            for (var key in param) {
                var value = param[key];
                url = url.replace(new RegExp("(&?" + key + "=)[^&]+", "g"), "$1" + value);
            }
        }

        // 无batch参数为最新批次
        if (type != '7' && !player.isNewBatch && picUrlParam.subType != "" && type != "0") {
            url += "&batch=" + picUrlParam.subType;
        }
        return url;
    }
    function updateRecognizeUrl(node, type = '2') {
        var url = parseNewPicUrl(node, type);
        d3.selectAll(".picplayerimg.recognize").attr("src", url);
    }

    function sendPicPlayerImgLoad(desc) {
        if (desc) {
            iD.UserBehavior.logger({
                'filter': 'none',
                'type': 'click',
                'tag': 'player_ImgLoad',
                'desc': desc
            });
        }
    }

    _.assign(picPlayer.prototype, {
        play: function (opts) {
            opts = opts || {};
            /*
             opts.time :倍速，1倍速=1s一帧
             opts.timeList :时速，每线段的距离与时速最接近的ms
             */

            var _action = iD.UserBehavior.getAction('keydown');
            iD.picPlayerLogger.picPlay('play_play', '', _action);
            var self = this;
            if (this.playerTimeId) {
                window.clearTimeout(this.playerTimeId);
                window.clearInterval(this.playerTimeId);
            }
            var playElementSelection = "a.glyphicon.glyphicon-triangle-right";
            var playDirection = self.playDirection;
            if (opts && opts.playDirection) {
                playDirection = opts.playDirection;
            }

            var last_select_index = -1;

            function execInterval() {
                if (self.playStatus == 'pause') {
                    return false;
                }
                // let isLastNode = self.selectPicIndex >= self.allNodes.length - 1;
                // 处于最后点，在播放状态；
                if (last_select_index === self.selectPicIndex && last_select_index == self.allNodes.length - 1) {
                    var isPlaySpeed = self._is_play_speedhour;
                    self.pause();
                    // 切换到下一条轨迹
                    if (self.dataMgr.tracks.length) {
                        self.playToNextTrack(function (track) {
                            if (!track) return;
                            // 保持时速
                            if (isPlaySpeed) {
                                playerFooter.$dom.select('.playSpeedHour select').dispatch('change');
                            } else {
                                self.play();
                            }
                        });
                    }
                    last_select_index = self.selectPicIndex;
                    return false;
                }
                last_select_index = self.selectPicIndex;
                if (playDirection == "backword") {
                    preShow(self);
                    playElementSelection = "a.glyphicon.glyphicon-triangle-left";
                    self.setElementActive(playElementSelection);
                } else {
                    nextShow(self, true);
                    iD.picPlayerLogger.picPlay('play_forward', self.pic_point);
                }
                // if(isLastNode){
                //     self.pause();
                //     return false;
                // }
            }

            var intervalID;
            // playTimeList, playIndexes
            if (opts.timeList && opts.timeList.length) {
                self._is_play_speedhour = true;
                // 根据时间列表播放
                let first_time = opts.timeList[self.selectPicIndex];
                function timeoutFunc() {
                    let flag = execInterval();
                    if (flag == false) {
                        return;
                    }
                    let _node_time = opts.timeList[self.selectPicIndex];
                    intervalID = window.setTimeout(timeoutFunc, _node_time);
                    self.playerTimeId = intervalID;
                }
                intervalID = window.setTimeout(timeoutFunc, first_time);

            } else if (opts.playTimeList && opts.playIndexes
                && opts.playIndexes.length == opts.playIndexes.length) {
                self._is_play_speedhour = true;
                // 根据时间列表+帧列表，跳帧播放
                let _play_count = 0;
                let first_time = opts.playTimeList[_play_count];
                function timeoutFunc() {
                    let _play_node_index = opts.playIndexes[_play_count];
                    // 20190620，播放后不结束，寻找下一条轨迹
                    // 结束
                    // if(isNaN(_play_node_index)){
                    //     self.pause();
                    //     return ;
                    // }
                    if (isNaN(_play_node_index)) {
                        _play_node_index = _.last(opts.playIndexes)
                    }
                    self.selectPicIndex = _play_node_index - 1;
                    if (self.selectPicIndex < 0) {
                        self.selectPicIndex = 0;
                    }
                    if (self.selectPicIndex > self.allNodes.length - 1) {
                        self.selectPicIndex = self.allNodes.length - 1;
                    }
                    let flag = execInterval();
                    if (flag == false) {
                        return;
                    }
                    _play_count++;
                    let _node_time = opts.playTimeList[_play_count];
                    if (isNaN(_node_time)) {
                        _node_time = _.last(opts.playTimeList)
                    }
                    intervalID = window.setTimeout(timeoutFunc, _node_time);
                    self.playerTimeId = intervalID;
                }
                intervalID = window.setTimeout(timeoutFunc, first_time);

            } else {
                self._is_play_speedhour = false;
                // 正常倍速播放
                var play_intervalTime_ms = 1000 / self.time;
                if (opts && opts.time && opts.time >= 0) {
                    play_intervalTime_ms = 1000 / opts.time;
                }
                intervalID = window.setInterval(execInterval, play_intervalTime_ms);

            }

            this.setElementActive(playElementSelection);

            this.playerTimeId = intervalID;
            this.playStatus = "play";
            playerFooter.udpatePlayControl(true);
            return this;
        },
        show: function () {
            this.surface.classed('hide', false);
            return this;
        },
        hide: function () {
            //this.picBox.classed('hidden', true);
            // this.dialog.close();
            // if (this.player) {
            //     this.player.pause();
            // }
            if (player) {
                player.pause();
            }
            this.surface.classed('hide', true);
            return this;
        },
        initDialogEvent: function () {
            var self = this;
            // 拖拽事件
            var surface = self.surface;
            surface.style('left', surface.style('left'));
            surface.style('top', surface.style('top'));
            // var $drag = surface.select('.picplayer-dragable');
            var $drag = self.headBar;
            window.Drag.init($drag.node(), surface.node());

            var $reisze = surface.select('.pic-resize');
            if ($reisze.size()) {
                Drag.Resize.init($reisze.node(), surface.node(), {
                    minWidth: 400,
                    minHeight: 400,
                    onDrag: function (width, height) {
                        self.resizeDomStyle();
                    },
                    onDragEnd: function () {
                        self.triggerResize();
                        // 宽高动画结束后松手，不能执行reset
                        self.resetCanvasTimelimit();
                    }
                });
            }
        },
        hoverPlay: function () {
            if (this.playStatus == 'pause') {
                iD.util.getTrackPointsByDis(this.pic_point, this.allNodes, currentTrackPointDis);
            }
        },
        pause: function () {
            var _action = iD.UserBehavior.getAction('keydown');
            iD.picPlayerLogger.picPlay('play_pause', '', _action);
            if (this.playerTimeId) {
                window.clearInterval(this.playerTimeId)
                // this.dataMgr.resetPlanes(this.selectPicIndex);
            }

            this._is_play_speedhour = false;
            this.playStatus = "pause";
            this.hoverPlay();
            // this.setElementActive("#picplayer-tools-bar a.glyphicon.glyphicon-pause");
            playerFooter.udpatePlayControl(false);
        },
        getPlayStatus: function () {
            return this.playStatus;
        },
        playToNextTrack: function (callback) {
            callback = callback || function () { };
            var self = this;
            var track = self.dataMgr.getNextSameDirectionTrack(self.wayInfo.trackId, self.selectPicIndex);
            if (!track) return callback();
            self._locate_point_index = 0;
            self.selectPicIndex = 0;
            self.switchPlayerTrackId(track.trackId, function () {
                callback(track);
            });
        },

        indexUpdate: function () {
            loadImageFirstIndex = this.selectPicIndex;// - this.loadImageLenght / 2;
            loadImagelastIndex = this.selectPicIndex + this.loadImageLenght / 2;
            loadImagelastIndex = loadImagelastIndex - 1;
            if (loadImageFirstIndex < 0) {
                loadImageFirstIndex = 0;
            }
            if (loadImagelastIndex >= this.picCount) {
                loadImagelastIndex = this.picCount - 1;
            }
        },
        close: function () {
            dispatch.close();
        },
        destory: function () {
            hideRightPic();
            this.clearMark();
            this.clearIntersectionHistory();
            this.destoryPlayer();
            this._click2sub_epiline = false;
            this.picBox && this.picBox.selectAll('*').remove();
            this.picBox && this.picBox.remove();
            this.$zoomList && this.$zoomList.remove();
            this.picBox = null;
            this.classified = null;
            this.wayInfo = null;
            this.picCount = 0;
            this.surface && this.surface.html('');
            this.surface = null;
            this.allNodes = null;
            this.pic_point = null;
            this._zrender = null;
            this.dividerCanvasGeometrys = null;
            this.cacheCanvas = null;
            // zrender底层
            this.$viewBottom && this.$viewBottom.remove();
            this.$viewBottom = null;
            // this.pic_nodeid = null;
            // this.dataMgr = null;
            /*(if (this.keybinding) {
             d3.select(document).call(this.keybinding.off);
             this.keybinding = null;
             };*/
            d3.select(document).on('keydown.pic-player', null);
            d3.select(window).on("resize.pic-player", null);
            this.dialog && this.dialog.close();
            d3.select("#KDSEditor-all-wrap").attr('class', 'layout-10');		//添加className
            d3.select(window).trigger("resize");			//初始化地图的大小
            this._inited = false;
            return this;
        },
        destoryPlayer: function () {
            if (this.playerTimeId) {
                window.clearInterval(this.playerTimeId)
            }
            this.playerTimeId = null;
            return this;
        },

        //初始化一帧图
        preLoadOneImage: function (images, index) {
            // 时速播放时不缓存
            if (!player || player._is_play_speedhour) {
                return;
            }
            var img = new Image();
            img.src = parseNewPicUrl(images[index]);
            if (img.complete) {  // 如果图片已经存在于浏览器缓存，直接调用回调函数
                return; // 直接返回，不用再处理onload事件
            }
            img.onload = function () {
                return;
            }
            img.onerror = function () {
                console.log('视频图片未加载全');
            }
        },
        getNewPicUrl: function (node, type = '0') {
            if (!node || !type) {
                return '';
            }
            return parseNewPicUrl(node, type);
        },
        preloadImage: function (images, f = null) {
            // 时速播放时不缓存
            if (!player || player._is_play_speedhour) {
                return;
            }
            imgLoading = true;
            var loadedimages = 0, iserr = false;
            // var count//,
            // var self = this;
            var loadedCount = 0;
            var postaction = function () { }
            // 初始化加载前30帧
            loadImagelastIndex = loadImagelastIndex == -1 ? 0 : loadImagelastIndex;
            var length = loadImagelastIndex - loadImageFirstIndex + 1;
            // var length = 0;
            // var imgs;
            postaction = f || postaction;
            function imageloadpost() {
                loadedimages++;
                //              if (loadedimages >= length) {
                if (loadedimages == length) {
                    postaction({ 'length': loadedCount });
                    imgLoading = false;
                    if (iserr) console.log('视频图片未加载全');
                    // Dialog.message("图片未加载全");
                }
            }

            for (var i = loadImageFirstIndex; i <= loadImagelastIndex; i++) {
                var img = new Image();
                img.src = parseNewPicUrl(images[i]);
                if (img.complete) {  // 如果图片已经存在于浏览器缓存，直接调用回调函数
                    loadedCount++;
                    imageloadpost();
                    continue; // 直接返回，不用再处理onload事件
                }
                img.onload = function () {
                    loadedCount++;
                    imageloadpost();
                }
                img.onerror = function () {
                    iserr = true;
                    loadedCount++;
                    imageloadpost();
                }
            }
        },
        getCurrentPic_node: function () {
            return this.pic_point.id;
        },
        refreshLeftEpilineCross: function () {
             
        },
        /**
         * 初始化后进入轨迹影像
         * @param {Object} wayInfo
         * @param {Object} nodeid
         */
        renderPicPlayer: function (wayInfo, nodeid) {
            var self = this;
            player.canvasClickCheck = true;
            var isNewRender = true;
            if (self.wayInfo && wayInfo && self.wayInfo.trackId == wayInfo.trackId) {
                isNewRender = false;
            }

            if (this._zrender && (this.pic_point && (wayInfo.nodeId != this.pic_point.id))) {
                this.clearMark();
            }

            var allNodes = [];
            self.wayInfo = null;
            self.dot_imgs = [];
            self.allNodes = [];

            // if(playerTrackCurve){
            //     playerTrackCurve.clearChanged();
            // }
            self.wayInfo = wayInfo;
            var nodes = wayInfo.nodes;// graph.childNodes(wayInfo.way);
            var currentNode = nodes[self._locate_point_index || 0];
            var selectNodeId = currentNode && currentNode.id || wayInfo.nodeId;
            _.forEach(nodes, function (d, i) {
                if (selectNodeId == d.id) {
                    self.selectPicIndex = i;
                    self.pic_point = d;
                }
                allNodes.push(d);
            })

            self.allNodes = allNodes;
            self.picCount = allNodes.length;
            self.indexUpdate();
            showLoading();
            self.updateTrackPoints();
            //更新当前任务批次
            self.updateBatch();
            imageStartLoadTime = new Date();
            iD.picPlayerLogger.picPreLoadStart();
            self.preloadImage(allNodes, imgLoaded)//.done(imgLoaded);
            self.rightPointIndex = self.selectPicIndex;
            self.pic_point && dispatch.picUpdate(self.pic_point, self.selectPicIndex);
            self.clearIntersectionHistory();

            var imgUrl;
            this.divItem = this.pics.selectAll(".item").data([0]);
            // var imgItem;
            this.divItem.enter().append("div").attr("class", "item active");

            this.divItem.classed("zdsb", self.config.picMinGroup).classed("active", true);

            imgUrl = parseNewPicUrl(self.pic_point, "0");
            this.divItem.selectAll(".picplayerimg.main").data([imgUrl]).enter().append('img').classed("picplayerimg main", true);
            this.divItem.selectAll(".picplayerimg.overlap").data([imgUrl]).enter().append('img').classed("picplayerimg overlap", true);
            this.divItem.selectAll(".picplayerimg.recognize").data([imgUrl]).enter().append('img').classed("picplayerimg recognize", true);
            this.divItem.selectAll("img").attr("src", imgUrl);
            this.divItem.selectAll(".picplayerimg.recognize").classed('hide', true);

            self.markMaskrcnnCanvas(this.pics);
            self.markCanvas(this.pics);

            //      	标记问题----1为轨迹-2为图片-3为轨迹与图片
            trackPointId1 = self.pic_point.tags.trackPointId;			//轨迹id
            self._refreshViewTextTag(self.pic_point);
            playerFooter.updateTitle(self.pic_point);
            if (self.playStatus == "play") {
                self.play();
            }


            // ----------//
            self.picTools.select('.footer-progress-range').attr('max', self.picCount - 1);
            self.picTools.select('.footer-progress-number.no-number').attr('max', self.picCount);
            self.picTools.select('.footer-progress-total').text('/' + self.picCount + '帧');
            let newNumberW = self.picCount.toString().length * 8 + 8 + 5;
            self.picTools.select('.footer-progress-number-div').style('width', newNumberW + 'px');

            player.getPlayerFooter().$dom.select(".footer-progress-bar")
                .dispatch("picPlayerEvt", {
                    playerData: {
                        current: self.selectPicIndex,
                        max: self.picCount
                    }
                });
            // ----------//
            hideRightPic();
            self.resizeDomStyle();
            // 切换 任务/轨迹 时，不走初始化
            self.updateImgUrl(this.divItem, self.pic_point);
            rightPicNext(self);
            picUpdate(this);
            playerFooter.refreshFooterBtnDisplay();
            self._locate_point_index = 0;
            showUpdatePicSubPlayer();

            context.event.picplayer_render
                && context.event.picplayer_render(self);
            return this;
        },
        _refreshBatch: function () {
            var self = this;
            var sublist = self.surface.select("#_sublist");
            if (!sublist.size()) return;
            var oldVal = sublist.value(), inOpts = false;
            // var subParams = [], trackBatchs = iD.config.trackBatchMap[getTrackObj().trackId] || [];
            var subParams = [], trackBatchs = [];
            for (var i = 0; i < trackBatchs.length; i++) {
                if (oldVal && trackBatchs[i] == oldVal) {
                    inOpts = true;
                }
                subParams.push({
                    name: trackBatchs[i],
                    value: trackBatchs[i]
                })
            }
            sublist.html('');
            var subOptions = sublist.selectAll("option").data(subParams);
            subOptions.enter().append("option").text(function (d, i) {
                return d.name;
            }).value(function (d, i) {
                this.value = d.value;
                return d.value;
            });
            subOptions.exit().remove();
            // 原图不显示批次;
            if (subParams.length > 1 && picUrlParam.type && picUrlParam.type != 0) {
                if (inOpts) {
                    sublist.value(oldVal);
                    picUrlParam.subType = oldVal;
                } else {
                    sublist.value(subParams[0].value);
                    picUrlParam.subType = subParams[0].value;
                }
                sublist.style("display", "inline-block");
            } else {
                // 0、1个时不显示
                //              sublist.html("");
                sublist.style("display", "none");
                picUrlParam.subType = subParams[0] && subParams[0].value || '';
            }
        },
        setPicBatch: function (batch, trigger) {
            if (!batch) return;
            var self = this;
            var sublist = d3.select("#_sublist");
            if (!_.pluck(sublist.node().options, 'value').includes(batch)) return;
            sublist.value(batch);
            picUrlParam.subType = batch;
            trigger == true && sublist.dispatch('change');
        },
        // 更新左侧面板的图片
        updateImgUrl: function (currentDiv, selectPoint) {
            //更新图片的src
            currentDiv.selectAll(".picplayerimg.main").attr("src", parseNewPicUrl(selectPoint, "0"));
            if (picUrlParam.type != "0") {
                // 更新叠加层
                currentDiv.selectAll(".picplayerimg.overlap").style('display', 'block');
                currentDiv.selectAll(".picplayerimg.overlap").attr("src", parseNewPicUrl(selectPoint));
            } else {
                currentDiv.selectAll(".picplayerimg.overlap").style('display', 'none');
            }
        },
        /**
         * 更改叠加图片的不透明度
         * @param {Number} num
         * @param {Boolean} setNumber
         */
        updateImgOverlapOpacity: function (num, setNumber = false) {
            var self = this;
            var $imgs = self.pics.selectAll(".picplayerimg.recognize, .picplayerimg.overlap");
            var opacity = Number($imgs.style('opacity'));
            if (!isNaN(opacity)) {
                if (setNumber) {
                    opacity = num
                } else {
                    opacity += num
                }
                if (opacity < 0) {
                    opacity = 0
                } else if (opacity > 1) {
                    opacity = 1
                }
                $imgs.style('opacity', opacity)
            }
        },
        getSelectPicIndex: function (selectPoint, allNodes) {
            //返回当前选中点第几个图片
            var picIndex = 0;
            for (var i = 0; i < allNodes.length; i++) {
                if (selectPoint.point_id == allNodes[i].point_id) {
                    picIndex = i;
                    break;
                }
            }
            return picIndex;
        },
        setElementActive: function (eleSelection) {
            var domSelection = d3.select(eleSelection);
            if (domSelection.size() > 0) {
                d3.select(domSelection[0][0].parentNode).selectAll("a").classed("active", false);
                domSelection.classed("active", true);
            }
        },
        init: function (surface, pra_config) {
            var self = this;
            // 切换任务时关闭副窗口

            if (self._inited) {
                return this;
            }
            viewZoomParam.scale = 1;
            if (!self._inited) {
                // 第一次初始化
                // d3.select("#KDSEditor-all-wrap").attr('class', 'layout-6_4');
            }
            var config = {
                directionPlay: false,
                minPic: false
            }
            if (pra_config) {
                _.assign(config, pra_config);
            }
            self.config = config;

            var surface = d3.select("#KDSEditor-picplayer");
            surface.html('');
            this.surface = surface;
            this.show();

            var picplayerDom = surface.append("div").attr("class", "pic-player");
            picplayerDom.append("div").attr("id", "picplayer-head-bar");
            // var picplayerShadow = surface.append("div").attr("class", "pic-player-shadow");
            picplayerDom.append("div").attr("id", "picplayer-view").attr("class", "carousel-inner").style({
                height: (surface.node().offsetHeight - 140) + "px",
                width: '100%'
            });
            picplayerDom.append("div").attr("id", "picplayer-tools-bar");
            picplayerDom.append("div").attr("id", "picplayer-status-bar");
            picplayerDom.append("div").attr("id", "pic-player-rightbox").classed('pic-player-rightbox', true);
            // 右侧工具条
            surface.append('div').attr('class', 'picplayer-rightmenu');
            
            // 轨迹曲线
            // self.trackCurve = surface.append('div').attr('class', 'picplayer-trackcurve');

            self.makeHtml(surface, config);
            // 支持设置大小
            picplayerDom.append('div').attr('class', 'pic-resize')
                .append('div').attr('class', 'img');

            self.initMouseWheelEvent();
            self._inited = true;
            self.initDialogEvent();
            self._inited = true;
            return this;
        },
        /**
         * 重新设置dom、canvas的宽高
         */
        resizeDomStyle: function () {
            var self = this;
            var $view = self.pics || self.surface.select("#picplayer-view");
            var surfaceDom = self.surface.node();
            var topHeight = parseInt(self.headBar.style('height'));
            var bottomHeight = parseInt(self.picTools.style('height')) + parseInt(self.statusBar.style('height'));
            // 按钮超出窗口范围
            var btnListHeight = parseInt(self.picTools.select('div.btn-group').style('height'));
            var progressHeight = parseInt(self.picTools.select('div.footer-progress-bar').style('height'));
            var maxBottomHeight = (btnListHeight + progressHeight + 10);
            if (bottomHeight < maxBottomHeight) {
                bottomHeight = maxBottomHeight;
            }
            $view.style({
                height: (surfaceDom.offsetHeight - bottomHeight - topHeight) + "px",
                width: '100%'
            });
            var viewDom = $view.node();
            var $leftList = self.picBox.selectAll("div.item,#picplayer-mark-canvas");
            //          var $rightList = self.$rightPic.selectAll("div.rigth-pic,div.right-canvas-content");
            var newHeight = viewDom.offsetHeight;
            var newWidth = viewDom.offsetWidth;

            resizeDoms($leftList, false);
            //          resizeDoms($rightList, true);

            var dpr = window.devicePixelRatio || 1;
            if (dpr != 1 && self._zrender) {
                _.each(self._zrender.painter.getLayers(), function (layer) {
                    layer.resize(newWidth, newHeight);
                });
            } else if (self._zrender) {
                self._zrender.resize();
            }

            // var map = context.map();
            // map.zoomOut();
            // map.zoomIn();

            // map.setZoom(z);

            function resizeDoms($list, setCanvas = false) {
                // 尺寸改变之前
                $list.style({
                    left: 0,
                    top: 0
                });
                $list.attr({
                    "d-height": newHeight,
                    "d-width": newWidth
                }).style({
                    height: newHeight + "px",
                    width: newWidth + "px"
                });
                if (!setCanvas) {
                    return;
                }
                $list.selectAll("canvas").style({
                    width: newWidth + "px",
                    height: newHeight + "px"
                }).each(function () {
                    this.width = $list.attr("d-width") || newWidth + 'px';
                    this.height = $list.attr("d-height") || newHeight + 'px';
                });
            }

            // maskrcnn
            self.$viewBottom && self.$viewBottom.size() && resizeDoms(self.$viewBottom, true);
        },
        triggerResize: function () {
            var self = this;
            self.resizeDomStyle();
            if (!self.pics || !self.pics.node()) return;
            // 暂不清楚为何div.item设置的动画效果，会影响到同级元素的zrender的渲染；
            iD.util.whichTransitionEndEvent(self.pics.select('div.item.active').node(), function () {
                self.resetCanvasTimelimit();
            });
        },
        resetCanvasTimelimit: function () { },
        makeHtml: function (surface, config) {
            var self = this;
            self.picBox;
            self.$zoomList;
            /* 图像、canvas视图 */
            self.pics;
            self.picTools;
            //          self.$rightPic;
            self.$rightBody;
            // 防止resize时调用反投频率过快
            var resetCanvasTimelimit = _.throttle(function () {
                drawTool.resetCanvas();
            }, 50, {
                leading: false,
                trailing: true
            });
            self.resetCanvasTimelimit = resetCanvasTimelimit;

            var picModal = self.surface.select("div.pic-player");
            d3.select(window).on("resize.pic-player", function () {
                self.triggerResize();
            });
            self.picBox = picModal;
            var picBody = picModal;

            // 初始化右侧功能菜单
            // 缩放按钮
            var $picTools = self.surface.select(".picplayer-rightmenu");
            $picTools.html('');

            var $zoomList = $picTools.append("div").attr("class", "pic-player-zoom-list");
            $zoomList.selectAll("div").data([
                ["reset"],
                ["scale"]
            ]).enter()
                .append("div").attr("class", function (d, idx) {
                    let str = '';
                    if (idx > 3) {
                        str = 'col2 raw' + (idx - 3);
                    }
                    return "map-control " + str;
                })
                .selectAll("button").data(function (d) { return d; })
                .enter().append("button").attr("class", function (type) {
                    return "btn-zoom-" + type;
                }).html(function (type) {
                    var iconName;
                    if (type == "reset") {
                        iconName = "glyphicon glyphicon-refresh";
                    } else if (type == "scale") {
                        return '<span class="scale-value" style="width: 100%; text-align: center;">' + Number(viewZoomParam.scale).toFixed(1) + '</span>';
                    }  
                    return '<span class="' + iconName + '"></span>';
                }).on("click", function (type) {
                    if (type == "reset") {
                        self.viewScaleReset();
                    } else if (type == 'useless_btn') {
                        var $btns = self.picTools.selectAll('.footer_useless_btn');
                        var $status = self.statusBar.select('#picplayer-status-table');
                        if ($btns.classed('hidden')) {
                            $btns.classed('hidden', false);
                            $status.classed('hidden-visibility', false);
                            self.developShow = true;
                        } else {
                            $btns.classed('hidden', true);
                            $status.classed('hidden-visibility', true);
                            self.developShow = false;
                        }
                        self.triggerResize();
                    } else if (type == 'toggle_subplayer') {
                        togglePicSubPlayer();
                    } else if (type == 'click_epiline') {
                        toggleFuncClickEpiline();
                    }
                }).call(bootstrap.tooltip()
                    .placement('left')
                    .html(true)
                    .title(function (type) {
                        var result = "";
                        if (type == "in") {
                            result = "放大级别";
                        } else if (type == "reset") {
                            result = "重置级别";
                        } else if (type == "out") {
                            result = "缩小级别";
                        } else if (type == "scale") {
                            result = "当前级别";
                        } else if (type == 'useless_btn') {
                            result = "显示/隐藏 开发功能";
                        } else if (type == 'toggle_subplayer') {
                            result = "打开/关闭 第二视频窗口";
                        } else if (type == 'click_epiline') {
                            result = "开启时，主窗口点击，副窗口创建核线";
                        }
                        return result;
                    })
                );
            self.$zoomList = $zoomList;
            self._$zoomScaleNum = $zoomList.select("button.btn-zoom-scale");
            $zoomList.select('button.btn-zoom-click_epiline').classed('active', self._click2sub_epiline);


            var pics = picBody.select("#picplayer-view");
            /* 视图 */
            self.pics = pics;
            /* 工具栏 */
            self.picTools = picBody.select("#picplayer-tools-bar");
            /* 状态栏 */
            self.statusBar = picBody.select("#picplayer-status-bar");
            /* 顶部标题栏 */
            self.headBar = picBody.select('#picplayer-head-bar');
            self.headBar.html('');
            self.headBar.append('div').attr('class', 'picplayer-dragable');

            var markFalse = pics.append("span").attr("class", "markFalse");			//错误标记
            pics.append("span").attr("class", "pic-imagetag-mark");			//图像标记

            var footer = picBody.select("#picplayer-tools-bar");
            footer.classed("zdsb", config.picMinGroup);

            playerFooter.render(footer, self.statusBar, self.headBar);

            context.history().on('undone.pic-player', function (e) {
                // var graph = editor.context.graph(),
                var isClear = false;
                // editor.getHistory() 非常耗时
                if (markDrawStatus.shape && markDrawStatus.shape._entityid) {
                    var way = context.hasEntity(markDrawStatus.shape._entityid);
                    // 车道线点击第三个点撤销后，事件中是撤销完成后的节点个数
                    if (!way || way.nodes.length < 2) {
                        isClear = true;
                    } else if (_.include([
                        constant.ADD_DIVIDER,
                        constant.ADD_OBJECT_PL,
                        // constant.ADD_PAVEMENT_DISTRESS_LINE,
                        // constant.ADD_PAVEMENT_DISTRESS_LINE2,
                        constant.ADD_BARRIER_GEOMETRY
                    ], markDrawStatus.type)) {
                        markDrawStatus.shape.shape.points.pop();
                        iD.picUtil.modShape(markDrawStatus.shape);
                    }
                }

                if (isClear) {
                    markDrawStatus.shape = undefined;
                    markDrawStatus.__lastDrawIndex = undefined;
                    drawTool.clearTempShape();
                }
            });

            // 图片类型
            playerFooter.on('imagetype_change', function (evt, select) {
                var value = select.value;
                picUrlParam.type = value.toString();
                if (value.toString() == "0") {
                    d3.$("#_sublist").style("display", "none");
                    picUrlParam.subType = '';
                } else {
                    self._refreshBatch();
                }

                self.pics.select('.picplayerimg.main').classed('hide', false);
                // var currentDiv = d3.select("div.carousel-inner div.item.active");
                self.updateImgUrl(self.divItem, self.pic_point);
                // 切换 原始图片和识别图片
                rightPicNext(self);
                iD.picPlayerLogger.picPlay(('play_imagetype_' + value), self.pic_point, 'click');
            });
            // 识别批次
            playerFooter.on('imagebatch_change', function (evt, select) {
                var value = select.value;
                picUrlParam.subType = value;//记录当前选择的批次
                var currentDiv = d3.select("div.carousel-inner div.item.active");
                player.updateImgUrl(currentDiv, player.allNodes[player.selectPicIndex]);
                rightPicNext(self);
            });
            // 轨迹切换
            playerFooter.on('track_change', function (evt, select) {
                var trackId = select.value;
                player.switchPlayerTrackId(trackId);
            });

            // 按钮控件
            playerFooter.on('playcontrol_prev', function () {
                preShow(self);
            });
            playerFooter.on('playcontrol_next', function () {
                nextShow(self);
                iD.picPlayerLogger.picPlay('play_forward', self.pic_point);
            });
            playerFooter.on('playcontrol_play', function (playSpeed) {
                self.playDirection = "forward";
                self.play({ time: playSpeed, playDirection: "forward" });
            });
            playerFooter.on('playcontrol_speedchange', function (playSpeed) {
                // 倍率变化时直接播放
                self.time = playSpeed;
                self.play({ time: playSpeed });
                playerFooter.udpatePlayControl(true);
            });
            playerFooter.on('playcontrol_speedhour_change', function (speedHour, options) {
                // 时速变化时直接播放
                // console.log('时速信息：', speedHour + 'km/h', options);
                self.play({
                    playIndexes: options.playIndexes,
                    playTimeList: options.playTimeList
                });
                playerFooter.udpatePlayControl(true);
            });
            playerFooter.on('playcontrol_pause', function () {
                self.pause();
            });

            // 键盘快捷键
            playerFooter.on('keydown', function (key, data) {
                switch (key) {
                    case 'w':
                    case 'arrowup':
                        break;
                    case 's':
                    case 'arrowdown':
                        // keyUpdateDirection(key, true);
                        break;
                    case 'a':
                    case 'arrowleft': {
                        if (player.isPlayPic) {
                            pre_throttle(self, key);
                            d3.select(".compress_original").classed("active", false);
                        }
                    }
                        break;
                    case 'd':
                    case 'arrowright': {
                        if (player.isPlayPic) {
                            next_throttle(self, key);
                            d3.select(".compress_original").classed("active", false);
                        }
                    }
                        break;
                    case 'ctrl+p':
                        if (player.isPlayPic) {
                            keyPause(key);
                        }
                        break;
                    case ' ':
                        if (player.isPlayPic) {
                            keyPause(key);
                        }
                        break;
                    case 'ctrl+,':
                        player.updateImgOverlapOpacity(-0.1);
                        break;
                    case 'ctrl+.':
                        player.updateImgOverlapOpacity(+0.1);
                        break;
                }
            });

            function keyPause(key) {
                var isPaused = true;
                if (self.playStatus == "pause") {
                    isPaused = false;
                }

                player.playDirection = player.playDirection || "forward";
                if (!isPaused) {
                    if (player.playDirection) {
                        var playSpeed = playerFooter.getPlaySpeed();
                        player.play({ time: playSpeed, playDirection: player.playDirection });
                        playerFooter.udpatePlayControl(true);
                    }
                } else {
                    player.pause();//暂停

                    playerFooter.udpatePlayControl(false);
                }
            }

            // 滚动条
            playerFooter.on('progress_mousedown', function () {
                self.pause();//暂停
            });
            playerFooter.on('progress_change', function (evt, data) {
                self.selectPicIndex = data.value - 1;
                // loadImagelastIndex，只是代表当前帧数
                // change可能是从左往右拖拽（没问题）
                // 也可能是从右往左拖拽（loadImagelastIndex-10）以外的位置，就不会更新图片
                //              var currentIndex = parseInt($.trim(progressBar.select('.footer-progress-now').text()));
                var currentIndex = data.oldValue;
                if ((!isNaN(currentIndex) && self.selectPicIndex < currentIndex)
                    || (self.selectPicIndex > (loadImagelastIndex - 10))) {
                    imgLoaded();
                    showLoading();
                }
                self.indexUpdate();
                imageStartLoadTime = new Date();
                iD.picPlayerLogger.picPreLoadStart();
                self.preloadImage(self.allNodes, function (obj = null) {
                    imgLoaded(obj);
                    nextShow(self, true);
                    iD.picPlayerLogger.picPlay('play_forward', self.pic_point);
                    self._zrender && self._zrender.refreshHover();
                })
            });
            // 按钮点击
            playerFooter.on('button_click', function (e, btnText) {
                if (e.target.nodeName.toUpperCase() != 'BUTTON') {
                    return;
                }
                var arr = ["原始", "识别"];
                isGetParameters = false;
                // markDrawStatus.type = '';

                var oldActiveBtn = playerFooter.$buttonList.select('button.active');
                var btnType = d3.select(e.target).datum();
                drawTool.clearLeftZrenderMarker();

                iD.UserBehavior.logger({
                    'filter': 'none',
                    'type': 'click',
                    'tag': 'player_' + btnType
                });

                if (markDrawStatus.type && markDrawStatus.type != btnType) {
                    // 取消按钮选中
                    if (oldActiveBtn.size() && oldActiveBtn.datum()) {
                        drawTool.execPlugin('buttonCancel', {
                            btnType: oldActiveBtn.datum()
                        }, oldActiveBtn.node());
                    }

                    // 例如“绘制车道线”过程中，点击了“绘制辅助线”、“视频操作”
                    clearFooterButton();
                    drawTool.clearZRenderNodeStatus();
                    // 清空move，临时线、地面区域等会用到
                    self._zrender.off('mousemove', drawTool.zrenderMove);
                }
                if (btnType != null) {
                    markDrawStatus.type = btnType;
                } else {
                    markDrawStatus.type = '';
                }

                if (btnText == '清除') {
                    self.clearMark();
                } else if (e.target.textContent == '标记') {
                    self.signMark(e.target);
                }

                if (btnText == '参数获取') {
                    isGetParameters = true;
                }

                var $btn = d3.select(d3.event.target);
                if (/\bactive\b/.test($btn.attr("class"))) {
                    // 取消按钮选中
                    if (oldActiveBtn.size() && oldActiveBtn.datum()) {
                        drawTool.execPlugin('buttonCancel', {
                            btnType: oldActiveBtn.datum()
                        }, oldActiveBtn.node());
                    }

                    clearFooterButton();
                    drawTool.clearZRenderNodeStatus();

                    $btn.classed('active', false);
                    markDrawStatus.drawing = false;
                    markDrawStatus.type = "";
                    markDrawStatus.shape = undefined;
                } else {
                    d3.selectAll('.btn-group button').classed('active', function () {
                        if (this.__active == true) return true;
                        return false;
                    });
                    $btn.classed('active', true);
                    markDrawStatus.drawing = true;
                }

                var $img = self.pics.select('.picplayerimg.main');
                if (btnText == '三维') {
                    if ($img.classed('hide')) {
                        $img.classed('hide', false);
                        $btn.classed('active', false);
                    } else {
                        $img.classed('hide', true);
                        $btn.classed('active', true);
                    }
                }

                if (btnText == '点云') {
                    var recognize = d3.select('.picplayerimg.recognize');
                    var isShow = recognize.classed('hide');
                    recognize.classed('hide', !isShow);
                    $btn.classed('active', isShow);
                    if (isShow) {
                        updateRecognizeUrl(self.pic_point);
                    }
                }

                closeFuncClick2SubEpiline();

                // 点击按钮
                e.btnType = btnType;
                drawTool.execPlugin('buttonClick', e, $btn.classed('active'), $btn.node());
            });
        },
        updateZoomHtml: function ($divSelecter, picUrl) {
            if (!picUrl || picUrl.trim() == "") {
                return;
            }
            $divSelecter.selectAll(".picZoom img").attr("src", picUrl);
        },
        /*
         * 更新识别批次、多轨迹列表
         */
        updateBatch: function () {
            var self = this;
            self._refreshBatch();
            /*
             * 多轨迹数据加载
             * */
            var trackIds = [];
            //          for (var i = 0; i < this.dataMgr.trackIds.length; i++) {
            //              var traceId = this.dataMgr.trackIds[i];
            for (var i = 0; i < this.dataMgr.trackIds.length; i++) {
                var trackId = this.dataMgr.trackIds[i];
                trackIds.push({
                    value: trackId,
                    name: trackId
                });
            }

            var seElement_trackIds = self.surface.select(".pic-current-trackid");
            if (!seElement_trackIds.size()) return;
            seElement_trackIds.html("");
            var options_trackIds = seElement_trackIds.selectAll("option").data(trackIds);
            options_trackIds.enter().append("option").text(function (d) {
                return d.name;
            }).attr("value", function (d) {
                return d.value;
            });
            options_trackIds.exit().remove();
            if (trackIds.length < 2) {
                seElement_trackIds.classed('hidden', true);
            } else {
                seElement_trackIds.classed('hidden', false);
                if (getTrackObj()) {
                    seElement_trackIds.value(getTrackObj().trackId);
                }
            }
        },
        
        

        resetZrenderLayer: function () {
            var self = this;
            drawTool.updateZRenderLayer(0, {
                'zoomable': true,
                'position': [0, 0],
                'scale': [viewZoomParam.min, viewZoomParam.min],
                'minZoom': viewZoomParam.min,
                'maxZoom': viewZoomParam.max
            });
            var layer = self._zrender.painter.getLayer(0);
            layer.__zoom = 1;

            var $view = self.surface.select("#picplayer-view");
            $img = $view.select(".item.active");
            var style = 'transform-origin: 0px 0px 0px; transition: all 0.7s ease-out; transform: translate3d(' +
                0 + 'px, ' + 0 + 'px, 0px) scale3d(' + 1 + ', ' + 1 + ', 1)';
            // $img.attr('style',style);
            $view.select("div.rigth-pic").attr('style', style);
            $view.select(".item.active").attr('style', style);
            viewZoomParam.scale = 1;
            // self._zrender.painter.render();
            self._zrender.painter.refresh();
            self._$zoomScaleNum && self._$zoomScaleNum.select("span.scale-value").text(1);
        },
        /**
        * 缩放级别初始化
        */
        viewScaleReset: function () {
            var self = this;
            if (!self._zrender) return;
            var layer = self._zrender.painter.getLayer(0);
            if (!layer) {
                return;
            }
            layer.position = [0, 0];
            layer.scale = [viewZoomParam.min, viewZoomParam.min];
            layer.__zoom = viewZoomParam.min;
            self._zrender.painter.refresh();
            //循环获取所有shape，重置scale和position属性值，保证缩放时一致性 Tilden
            var shapes = self._zrender.storage._roots;
            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i];
                iD.picUtil.shapeScale(shape, layer.scale);
                iD.picUtil.shapePosition(shape, layer.position, true);
            }
            self.updateViewDomStyle(layer);

            viewZoomParam.position = [layer.position[0], layer.position[1]];
            viewZoomParam.scale = layer.scale[0];
            self._$zoomScaleNum && self._$zoomScaleNum.select("span.scale-value").text(layer.scale[0]);
        },
        updateViewDomStyle: function (layer) {
            var self = this;
            var $img = self.surface.select("#picplayer-view").select(".item.active"),
                width = $img.attr("d-width"),
                height = $img.attr("d-height");
            var pos = [layer.position[0], layer.position[1]];
            var x = parseInt(pos[0]) / layer.scale[0];
            var y = parseInt(pos[1]) / layer.scale[0];
            var x2 = pos[0] + (width * layer.scale[0]);
            var y2 = pos[1] + height * layer.scale[0];
            if (x > 0 || y > 0) {
                if (x > 0) {
                    pos[0] = 0;
                }
                if (y > 0) {
                    pos[1] = 0;
                }
            }
            if (x2 < width || y2 < height) {
                if (x2 < width) {
                    pos[0] = pos[0] + (width - x2);
                }

                if (y2 < height) {
                    pos[1] = pos[1] + (height - y2);
                }
            }
            pos[0] = parseInt(pos[0]);
            pos[1] = parseInt(pos[1]);

            drawTool.updateZRenderLayer(0, {
                'zoomable': true,
                'position': pos,
                'scale': layer.scale,
                'minZoom': viewZoomParam.min,
                'maxZoom': viewZoomParam.max
            });

            var style = 'transform-origin: 0px 0px 0px; transition: all 0.7s ease-out; transform: translate3d(' +
                pos[0] + 'px, ' + pos[1] + 'px, 0px) scale3d(' + layer.scale[0] + ', ' + layer.scale[1] + ', 1)';
            self.surface.select("#picplayer-view").select("div.rigth-pic").attr('style', style);
            $img.attr('style', style);

            self.refreshDrawCanvasMaskrcnn();
        },
        // maskrcnn识别结果图层
        markMaskrcnnCanvas: function ($container) {
            var self = this;
            var elementid = 'picplayer-maskrcnn-canvas';

            if ($container.select('.' + elementid).empty()) {
                self.$viewBottom = $container.append('div').attr('id', elementid)
                    .attr("class", elementid + ' hide')
                    .style("position", "absolute")
                    .style("width", "100%")
                    .style("height", "100%");
                self.$viewBottom.append('canvas');
            }
            // self.hideMaskrcnn();
        },
        maskrcnnIsVisible: function () {
            var self = this;
            return self.$viewBottom && self.$viewBottom.size() && !self.$viewBottom.classed('hide');
        },
        showMaskrcnn: function () {
            
        },
        hideMaskrcnn: function () {
             
        },
        hideDepth: function(){
        },
        showDepth: function(){
        },
        loadMaskrcnnTrackBatch: function (callback) {
            var self = this;
            if (!self.maskrcnnIsVisible()) {
                return;
            }
            var node = self.pic_point;
            var trackId = node.tags.trackId;
            if (!self._maskrcnn_track_batch) {
                self._maskrcnn_track_batch = {};
            }
            var batch = self._maskrcnn_track_batch[trackId];
            if (batch) {
                callback(batch);
                return;
            }
            self._maskrcnn_xhr && self._maskrcnn_xhr.abort();
            let url = iD.config.URL.kts + 'track/getMaskRcnnRecogBatchByTrackId/' + trackId;
            self._maskrcnn_xhr = d3.json(url).get(function (err, data) {
                if (!data || data.code != '0') {
                    callback();
                    return;
                }
                self._maskrcnn_track_batch[trackId] = data.result;
                callback(data.result);
            });
        },
        loadMaskrcnn2Canvas: function (maskrcnnBatch = '') {
            var self = this;
            MASKRCNN_DATAS.length = 0;
            var node = self.pic_point;
            var trackId = node.tags.trackId;
            var trackPointId = node.tags.trackPointId;
            // var obj = picUrlParam[picUrlParam.type];
            var type, seq;
            // if(obj){
            //     type = obj.type;
            //     seq = obj.seq;
            // }else {
            //     return ;
            // }
            type = '05';
            seq = '010';
            var key = [
                trackId,
                trackPointId,
                type,
                seq,
                'json',
                // 识别批次
                // kts/track/getMaskRcnnRecogBatchByTrackId
                maskrcnnBatch
            ].join('-');

            var url = iD.config.URL.track_maskrcnn + 'kv/get/json?key=' + key + '&namespace=recognition_maskrcnn';
            // var url = 'http://192.168.8.16:9527/test/kv/get/json?key=99999_20180811121939973-99999_20180811121942935592-05-010-json-99999_1&namespace=recognition_maskrcnn';

            if (self._maskrcnn_xhr) {
                self._maskrcnn_xhr.abort();
                self._maskrcnn_xhr = null;
            }
            self._maskrcnn_xhr = d3.json(url).get(function (err, data) {
                if (!self.maskrcnnIsVisible()) {
                    return;
                }
                var style = {
                    strokeColor: iD.picUtil.colorRGBA(0, 255, 0, 0.7),
                    lineWidth: 2,
                    color: iD.picUtil.colorRGBA(0, 0, 0, 0)
                };
                let result = data && data.result || [];
                result.forEach(function (d) {
                    if (!d.mask || !d.mask.length) return;
                    if (!_.isEqual(d.mask[0], _.last(d.mask))) {
                        d.mask.push(d.mask[0]);
                    }
                    let list = d.mask.map(function (xy) {
                        return player.transformPoint(xy);
                    });
                    MASKRCNN_DATAS.push(Object.assign({
                        type: "polygon",
                        pointList: list,
                        _param: d
                    }, style));
                });
                self.canvasDrawGeometryMaskrcnn(MASKRCNN_DATAS);
            });
        },
        refreshDrawCanvasMaskrcnn: function () {
            var self = this;
            if (!self.maskrcnnIsVisible()) {
                return;
            }
            self.canvasDrawGeometryMaskrcnn(MASKRCNN_DATAS);
        },
        clearDrawCanvasMaskrcnn: function () {
            var self = this;
            if (!self.$viewBottom || !self.$viewBottom.size()) return;
            var canvasDom = self.$viewBottom.select('canvas').node();
            var ctx = canvasDom.getContext("2d");
            var canvasWidth = canvasDom.width
            var canvasHeight = canvasDom.height;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        },
        canvasDrawGeometryMaskrcnn: function (options) {
            var self = this;
            if (!self.$viewBottom || !self.$viewBottom.size()) return;
            var player = self;
            var canvasDom = self.$viewBottom.select('canvas').node();
            var ctx = canvasDom.getContext("2d");
            if (!options || !options.length) return;
            if (!_.isArray(options)) {
                options = [options];
            }
            var drawGeoDataList = options;
            var canvasWidth = canvasDom.width
            var canvasHeight = canvasDom.height;
            // ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
            // canvasDom.width = canvasWidth;
            // canvasDom.height = canvasHeight;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.save();
            // sx, dx, dy, sy, ox, oy
            var layer = player.getZRenderLayer();
            var scale = 1;
            if (layer) {
                scale = layer.scale[0];
                ctx.transform(
                    scale,
                    0,
                    0,
                    scale,
                    layer.position[0],
                    layer.position[1]
                );
            }

            for (var idx in drawGeoDataList) {
                var style = _.clone(drawGeoDataList[idx], true);
                var styleType = style.type;
                delete style.type;

                if (styleType == "star" || styleType == "point") {
                    style.x = scaleNum(style.x);
                    style.y = scaleNum(style.y);
                    player.createStarOnCtx(ctx, style);
                } else if (styleType == "line" || styleType == "polygon") {
                    ctx.beginPath();
                    if (style.lineJoin) {
                        ctx.lineJoin = style.lineJoin;
                    }
                    if (style.lineWidth) {
                        ctx.lineWidth = scaleWidth(style.lineWidth);
                    }
                    if (style.color) {
                        ctx.fillStyle = style.color;
                    }
                    if (style.strokeColor) {
                        ctx.strokeStyle = style.strokeColor;
                    }
                    var pointList = style.pointList;

                    // s-e  s-e
                    if (style.lineType == "dashed&solid") {
                        for (var i = 0; i < pointList.length; i++) {
                            var point = pointList[i];
                            if (i == 0) {
                                if (point[2] != "end") {
                                    ctx.moveTo(point[0], point[1]);
                                }
                            } else {
                                var lastStep = pointList[i - 1];
                                if (lastStep[2]) {
                                    if (lastStep[2] == "start") {
                                        ctx.lineTo(point[0], point[1]);
                                    } else if (lastStep[2] == "end") {
                                        ctx.moveTo(point[0], point[1]);
                                    }
                                } else {
                                    ctx.lineTo(point[0], point[1]);
                                }
                            }
                        }
                    } else {
                        ctx.moveTo(scaleNum(pointList[0][0]), scaleNum(pointList[0][1]));
                        for (var i = 1; i < pointList.length; i++) {
                            ctx.lineTo(scaleNum(pointList[i][0]), scaleNum(pointList[i][1]));
                        }
                    }

                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            function scaleNum(num) {
                return num;
            }
            function scaleWidth(num) {
                // return num/scale;
                return num;
            }

            ctx.restore();
        },
        //生成标记canvas
        markCanvas: function ($container) {
            var self = this;
            var t = 0;
            var drag_type = false;
            drawTool.initZRender(function (zrender) {
                CircleShape = zrender.Circle;
                PolygonShape = zrender.Polygon;
                PolylineShape = zrender.Polyline;
                StarShape = zrender.Star;
                RectangleShape = zrender.Rect;
                // 初始化zrender
                // var zr = zrender.init(document.getElementById("picplayer-mark-canvas"));
                if (!self._zrender) {
                    self._zrender = zrender.init(document.getElementById("picplayer-mark-canvas"));
                    drawTool._zrender = self._zrender;
                    // 右键菜单；
                    document.getElementById("picplayer-mark-canvas").oncontextmenu = function (evt) {
                        evt.stopPropagation();
                        return false;
                    }

                    drawTool.resetCanvas();
                    drawTool.updateZRenderLayer(0, {
                        'zoomable': true,
                        'minZoom': viewZoomParam.min,
                        'maxZoom': viewZoomParam.max,
                        // canvas可拖拽，下面代码仅仅是禁止了图片的定位，canvas的拖拽没有拦截
                        'panable': true
                    });
                    //范围计算，禁止拖拽图片超出视野范围 modify by Tilden
                    var bboxZrender = function (painterlayer) {
                        self.updateViewDomStyle(painterlayer);

                        //重置渲染所有图层，切记只有这种方式可以！！！
                        self._zrender.painter.refresh();
                        var shapes = self._zrender.storage._roots;
                        for (var i = 0; i < shapes.length; i++) {
                            var shape = shapes[i];
                            iD.picUtil.shapePosition(shape, painterlayer.position, true);
                        }
                    }

                    var isDown = false;
                    var startP = null;
                    //拖拽视频图片功能，modify by Tilden
                    var dragZrender = function (e) {
                        var l = player._zrender.painter,
                            painterlayer = l.getLayer(0);
                        // 必须mousedown，同时可拖拽；
                        if (!painterlayer.panable || !isDown) {
                            isDown = false;
                            startP = null;
                            self._zrender.off('mousemove', dragZrender);
                            self._zrender.off("mouseup", _mouseup);
                            return;
                        }
                        // 拖拽节点、矩形拉框操作会将player.canvasClickCheck设置为false，结束后恢复true；
                        if (player.canvasClickCheck) {
                            var l = player._zrender.painter,
                                painterlayer = l.getLayer(0);
                            if (painterlayer.scale[0] > 1) {
                                var mouseX = e.offsetX - startP[0];
                                var mouseY = e.offsetY - startP[1];
                                painterlayer.position[0] += mouseX;
                                painterlayer.position[1] += mouseY;
                                startP = [e.offsetX, e.offsetY];

                                bboxZrender(painterlayer);
                                if (mouseX || mouseY) {
                                    drag_type = true;
                                }
                            }
                        }
                    }
                    function _mousedown(e) {
                        drawTool.updateZRenderLayer(0, {
                            'panable': player.canvasClickCheck
                        });
                        startP = [e.offsetX, e.offsetY];
                        if (player.canvasClickCheck) {
                            isDown = true;
                            self._zrender.on('mouseup', _mouseup);
                            self._zrender.on('mousemove', dragZrender);
                        }
                    }
                    function _mouseup(e) {
                        drawTool.updateZRenderLayer(0, {
                            'panable': player.canvasClickCheck
                        });
                        startP = null;
                        if (player.canvasClickCheck) {
                            isDown = false;
                            self._zrender.off('mouseup', _mouseup);
                            self._zrender.off('mousemove', dragZrender);
                            if (drag_type) {
                                iD.UserBehavior.logger({
                                    'filter': 'none',
                                    'type': 'drag',
                                    'tag': 'player_image'
                                });
                                drag_type = false;
                            }
                        }
                    }
                    self._zrender.on('mousedown', _mousedown);
                    self._zrender.on('mouseup', _mouseup);
                    //                      #picplayer-mark-canvas
                    d3.select(player._zrender.dom).on("mouseout.pic-player", function (e) {
                        if (isDown) {
                            self._zrender.off('mousemove', dragZrender);
                            self._zrender.off("mouseup", _mouseup);

                            var l = player._zrender.painter,
                                painterlayer = l.getLayer(0);
                            bboxZrender(painterlayer);
                            drawTool.updateZRenderLayer(0, {
                                'panable': false
                            });
                        }
                        isDown = false;
                    })
                    self._zrender.on('mousewheel', function () {
                        var event = window.event;
                        // var $img;
                        var layer = drawTool.getZRenderLayer(0);
                        if (!layer) {
                            return;
                        }
                        var _action = iD.UserBehavior.getAction('zoom');
                        iD.picPlayerLogger.picZoom('player_zoom', self.pic_point, _action);
                        //自定义scale和position Tilden
                        var delta = event.wheelDelta // Webkit
                            || -event.detail; // Firefox
                        //                      var scale = delta > 0 ? 1.1 : 1 / 1.1;
                        var scale = delta > 0 ? 1.1 : 0.9;
                        var mouseX = event.offsetX;
                        var mouseY = event.offsetY;
                        var pos = layer.position;
                        layer.__zoom = layer.__zoom || 1;
                        var newZoom = layer.__zoom;
                        newZoom *= scale;
                        newZoom = Math.max(
                            Math.min(layer.maxZoom, newZoom),
                            layer.minZoom
                        );
                        scale = newZoom / layer.__zoom;
                        layer.__zoom = newZoom;
                        // Keep the mouse center when scaling
                        pos[0] -= (mouseX - pos[0]) * (scale - 1);
                        pos[1] -= (mouseY - pos[1]) * (scale - 1);
                        // 可能会出现 9.xxxxxxxxe-14的情况
                        if ((pos[0] + '').indexOf('e') > -1) {
                            //                          debugger ;
                        }
                        pos[0] = parseInt(pos[0]);
                        pos[1] = parseInt(pos[1]);
                        if (pos[0] == 0 && pos[1] == 0) {
                            scale = layer._zoom = layer.minZoom;
                            layer.scale = [layer.minZoom, layer.minZoom]
                        } else {
                            //                      	layer.scale[0] *= scale;
                            //                      	layer.scale[1] *= scale;
                            layer.scale = [newZoom, newZoom];
                        }
                        if (layer.scale[0] < layer.minZoom) {
                            layer.scale[0] = layer.minZoom;
                        }
                        if (layer.scale[1] < layer.minZoom) {
                            layer.scale[1] = layer.minZoom;
                        }
                        layer.position = pos;
                        //                      self._zrender.painter.refresh();
                        // 缩放时偶尔会position偏移的问题：
                        // 原因是缩放后的position超出width*scale的边界
                        // 需要重新设置position
                        self.updateViewDomStyle(layer);
                        layer = drawTool.getZRenderLayer(0);

                        //循环获取所有shape，重置scale和position属性值，保证缩放时一致性 Tilden
                        var shapes = self._zrender.storage._roots;
                        for (var i = 0; i < shapes.length; i++) {
                            var shape = shapes[i];
                            iD.picUtil.shapeScale(shape, layer.scale);
                            iD.picUtil.shapePosition(shape, layer.position, true);
                        }
                        window.viewZoomParam = viewZoomParam;
                        self.updateViewDomStyle(layer);

                        viewZoomParam.position = [layer.position[0], layer.position[1]];
                        viewZoomParam.scale = layer.scale[0];
                        self._$zoomScaleNum && self._$zoomScaleNum.select("span.scale-value").text(Number(layer.scale[0]).toFixed(2));
                    });
                    self.resetZrenderLayer();
                }

            });
            if (self._zrender) {
                self.resetZrenderLayer();
            }

            var clickTimeout = iD.util.getClickTimeout();
            var lastMousePos;
            // 左侧视图在前方交会点击后；
            if ($container.select('.picplayer-mark-canvas').empty()) {
                $container.append('div').attr('id', 'picplayer-mark-canvas')
                    .attr("class", "picplayer-mark-canvas")
                    .style("position", "absolute")
                    .style("width", "100%")
                    .style("height", "100%")
                    .on('mousedown.tag', function () {
                        lastMousePos = [d3.event.offsetX, d3.event.offsetY];
                        drawTool.domMousedown(d3.event);
                    })
                    .on('mouseup', function () {
                        drawTool.domMouseup(d3.event);
                    })
                    .on('dblclick', function () {
                        clickTimeout.clear();
                        drawTool.domDblclick(d3.event);
                    })
                    .on('click', function () {
                        var upPos = [d3.event.offsetX, d3.event.offsetY];
                        // mousedown -> mousemove -> mouseup 也会触发click事件
                        // 点击与松手位置，超过3像素不认为是click
                        if (iD.geo.euclideanDistance(lastMousePos, upPos) > 3) {
                            return;
                        }
                        if (player._click2sub_epiline) {
                            var point = drawTool.leftZoomOffset(upPos);
                            click2sub_click(point, upPos);
                            return;
                        }
                        var flag = drawTool.domClickBefore(d3.event);
                        if (flag == false) {
                            return;
                        }
                        clickTimeout.set(function (evt) {
                            flag = drawTool.domClick(evt);
                        }, d3.event);
                    });
            }
        },
        /*
        // 生成图片上的图形数据
        drawidentifyData:function(){
            // 不显示识别数据；
            if(!iD.User.authTrailIdentify()){
                return ;
            }

            if(!this.pic_point){
                return;
            }
            var identifyData;
            if(!identifyData){
                return;
            }
            var features = identifyData.features;
            var i=0,len = features.length;
            var feature;
            var shapes = [];
            for(;i<len;i++){
                feature = features[i];
                this._zrender.add(this.createShap(feature.geometry));
            }
        },
        */
        clearIntersectionHistory: function () {

        },
        clearMark: function () {
            if (!this._zrender) return;
            this._zrender.clear();
        },
        signMark: function (btn) {
            var $div = $(".markDelete");
            if ($div.is(":hidden")) {
                var pos = $(btn).position();
                var ppos = $(btn).parent().position();
                $div.css({
                    bottom: 40,
                    left: ppos.left + pos.left,
                    top: "auto"
                }).show();
            } else if ($div.is(":visible")) {
                $div.hide();
            }
        },
        initMouseWheelEvent: function () {
            var self = this;
            var $picView = self.surface.select("#picplayer-view");

            $picView.on("mousewheel.changed", function () {
                var event = _.clone(d3.event, true);
                Object.defineProperty(event, "toElement", { writable: true })
                event.toElement = d3.selectAll('.picplayer-mark-canvas canvas').nodes()[1];
                self._zrender.trigger('mousewheel', event);
                return;
            });

        },
        // 缩放
        mouseZoomChange: function (dirnum, leftZoom, rightZoom) {
            var self = this;
            leftZoom = leftZoom == null ? true : leftZoom;
            rightZoom = rightZoom == null ? true : rightZoom;
            if (!leftZoom && !rightZoom) {
                return;
            }
            var vp = viewZoomParam;
            var $leftRightList = getLeftRightImgCanvasList();
            var $leftList = $leftRightList.$leftList;
            //          var $rightList = $leftRightList.$rightList;
            //          $rightList.attr("d-width", _eachAttrWH("width")).attr("d-height", _eachAttrWH("height"));
            function resetDivListStyle() {
                $leftList.style({
                    position: "",
                    left: 0,
                    top: 0
                });
                //              $rightList.style({
                //                  position: "",
                //                  left: 0,
                //                  top: 0
                //              });
            }

            var splitNum = 1;
            //			viewZoomParam
            if (dirnum == "in") {
                vp.scale = vp.scale + splitNum;
                resetDivListStyle();
            } else if (dirnum == "out") {
                vp.scale = vp.scale - splitNum;
                resetDivListStyle();
            } else if (dirnum == "reset") {
                vp.scale = vp.min;
                resetDivListStyle();
            } else if (typeof dirnum === "number") {
                vp.scale = dirnum;
            }
            if (vp.scale > vp.max) {
                vp.scale = vp.max;
                return;
            } else if (vp.scale < vp.min) {
                return;
                vp.scale = vp.min;
            }

            self._$zoomScaleNum && self._$zoomScaleNum.select("span.scale-value").text(Number(vp.scale).toFixed(2));
        },
        /*
        mouseZoomIn: function(leftZoom, rightZoom){
            this.mouseZoomChange("in", leftZoom, rightZoom);
        },
        mouseZoomOut: function(leftZoom, rightZoom){
            this.mouseZoomChange("out", leftZoom, rightZoom);
        },
        mouseZoomReset: function(leftZoom, rightZoom){
            this.resetZrenderLayer();
            this.mouseZoomChange("reset", leftZoom, rightZoom);
        },
        */
        drawVectorPointShape: function () {
            var self = this;
            // 没有entity，单独反投的点
            // 标记特征点
            if (markVectorPoint.loc && markVectorPoint.loc.length) {
                var result = iD.OrthoggraphicAutoMatch.locsToPicPlayer([markVectorPoint.loc], self)[0];
                if (result) {
                    let shape = drawTool.createStar(drawTool.transformPoint(result.coordinates[0]), {
                        hoverable: false,
                        draggable: false,
                        style: {
                            lineWidth: 3,
                            color: iD.picUtil.colorRGBA(220, 20, 60, 0.8),
                            strokeColor: iD.picUtil.colorRGBA(220, 20, 60, 0.8)
                        }
                    });
                    markVectorPoint.shape = shape;
                    // self._zrender.add(shape);
                    self._zrender.add(shape);
                }
            }
        },
        updateTrackPoints: function () {
            if (this.allNodes[0].tags.qualityNum != undefined) {
                classified = iD.picUtil.trackPointQualityNumber(this.allNodes);
            } else {
                classified = iD.picUtil.trackPointClassification(this.allNodes);
            }
        },
        // 标记轨迹点
        markTrackPointRequest: function () {
            var trackId = player.pic_point.tags.trackId;
            var trackPointId = player.pic_point.tags.trackPointId;
            var task = iD.Task.d;
			var kieVersion = iD.Task.d.tags.kieVersion;

            var param1 = {
				kieVersion: kieVersion,
                trackId: trackId,
                trackPointId: trackPointId
            };
            if (task && task.tags.projectId) {
                param1.projectId = task.tags.projectId;
            }

            d3.json(iD.config.URL.krs + 'image/mark/save?' + iD.util.parseParam2String(param1)).get(function (error, _data) {
                if (error || !_data) {
                    Dialog.alert('轨迹点标记出错', null, null, null, null, {
                        AutoClose: 3
                    });
                    return;
                }
                if (_data.code != '0') {
                    Dialog.alert(_data.message || '轨迹点标记失败', null, null, null, null, {
                        AutoClose: 3
                    });
                    return;
                }

                Dialog.sidebarAlert('轨迹点标记成功');
                clearFooterButton();
            });
        },
        /**
         * 刷新当前轨迹点图片上对应的文本信息
         * @param {Object} node
         */
        _refreshViewTextTag: function (node) {
            var self = player;
            node = node || self.pic_point;
            var delFlagNum = node.tags.delFlag;			//判断是否有过标记
            // 标记问题----1为轨迹-2为图片-3为轨迹与图片
            var $markFalse = self.pics.select(".markFalse");
            if ((delFlagNum == "1") || (delFlagNum == "2") || (delFlagNum == "3")) {
                $markFalse.style("display", "block");
                $markFalse.html(playerFooter.getDelFlagText(delFlagNum));
            } else {
                $markFalse.style("display", "none");
            }
            // 图像标记
            var extent = new iD.geo.Extent(node.loc);
            var entities = context.intersects(extent);
            var tagEntities = [];

            for (var entity of entities) {
                if (entity.modelName == iD.data.DataType.IMAGE_TAG
                    && node.tags.trackId == entity.tags.TRACKID
                    && node.tags.trackPointId == entity.tags.TRACKPOINTID) {
                    tagEntities.push(entity);
                }
            }
            var $imgMark = self.pics.select('.pic-imagetag-mark').style('display', 'none').html('');
            var doms = [];
            for (var entity of tagEntities) {
                doms.push('标' + (entity.tags.BATCH || ' 原图'));
            }
            doms.length && $imgMark.html(_.uniq(doms).reverse().join('<br/>')).style('display', 'block');
        },
        /**
         * 切换显示的轨迹
         * @param {String} trackId 轨迹id
         * @param {Function} 切换完成后回调
         */
        switchPlayerTrackId: function (trackId, callback) {
            var self = this;
            if (!trackId || getTrackObj().trackId == trackId) {
                return;
            }
            if (!_.include(self.dataMgr.trackIds || [], trackId)) {
                Dialog.alert('没有找到轨迹 ' + trackId + '，无法切换轨迹');
                return;
            }
            clearFooterButton();
            drawTool.clearZRenderNodeStatus();
            self.clearMark();
            this.updateTrackPoints();
            drawTool.clearVectorPointData();
            //修改select框默认值
            self.picTools.select('select.pic-current-trackid').value(trackId);

            var oldTrackId = self.wayInfo.trackId;
                //选择轨迹，将视频切换到对应轨迹
                self.dataMgr.redrawPic(trackId, _call);
            function _call(_track) {
                if (!_track) {
                    // 切换失败
                    playerFooter.$dom.select('.pic-current-trackid')
                        .value(oldTrackId);
                    console.log('轨迹切换失败：', oldTrackId, trackId);
                    return;
                }
                iD.picPlayerLogger.picPlay('play_switchTrack', self.pic_point, 'click');
                // this.dataMgr.resetData(trackId);
                callback && callback();
            }
        },
        /**
         * 定位到对应的 轨迹点
         * @param {String} trackPointId 轨迹点
         * @param {String} trackId 轨迹id
         */
        locateTrackPointToPlayer: function (trackPointId, trackId) {
            var self = this;
            if (trackId && !_.include(self.dataMgr.trackIds || [], trackId)) {
                Dialog.alert('轨迹列表中不存在轨迹 ' + trackId);
                return;
            }
            // if(!_.pluck(self.dataMgr.tracks, 'trackId').includes(trackId)){
            //     self.dataMgr.loadTrackData(trackId, function(_track){
            //         self.locateTrackPointToPlayer(trackPointId, _track.trackId);
            //     });
            //     return ;
            // }
            if (trackId && self.dataMgr.tracks && self.dataMgr.tracks.length) {
                var tracks = self.dataMgr.tracks || [];
                var flag = false;
                var track, node;
                for (track of tracks) {
                    if (track.trackId != trackId) continue;
                    for (var i = 0; i < track.nodes.length; i++) {
                        node = track.nodes[i];
                        if (node.tags && node.tags.trackPointId == trackPointId) {
                            self._locate_point_index = i;
                            flag = true;
                            break;
                        }
                    }
                }

                if (!flag) {
                    Dialog.alert('没有找到轨迹点 ' + trackPointId + '，无法定位');
                    return;
                }
            }

            if (trackId && getTrackObj().trackId != trackId) {
                self.switchPlayerTrackId(trackId, function () {
                    self._locate_point_index = 0;
                });
            } else {
                self.locateFrameByTrackPoint(trackPointId);
            }
        },
        /**
         * 根据帧号定位
         * @param {Number} index
         */
        locateFrameByIndex: function (index) {
            var self = this;
            self.isDragPCloud = true;
            if (isNaN(index) || self.selectPicIndex == index || !player._linkage_pcloud) {
                return;
            }
            var $range = self.picTools.select('input.footer-progress-range');
            $range.value(parseInt(index)).trigger('change');
        },
        /**
         * 根据轨迹点定位
         * @param {Number} index
         */
        locateFrameByTrackPoint: function (trackPointId) {
            var self = this, index;
            for (var i = 0; i < self.allNodes.length; i++) {
                var node = self.allNodes[i];
                if (node.tags.trackPointId == trackPointId || 
                    (node.tags.track_point_ids &&node.tags.track_point_ids.indexOf(trackPointId)!=-1)) {
                    index = i;
                    break;
                }
            }
            if (index == null) {
                Dialog.alert('没有找到轨迹点 ' + trackPointId + '，无法定位');
                return;
            }

            self.locateFrameByIndex(index);
        },
        /**
         * 初始化按钮时绑定在onclick上
         */
        _buttonKeepClickEvent: function (btn) {
            if (btn.nodeType != 1) {
                return;
            }
            if (btn.__active) {
                btn.__active = false;
            } else {
                btn.__active = true;
            }
            d3.select(btn).classed('active', btn.__active);
            return btn.__active;
        },
        
        getCameraHeight: function () {
            var self = this;
            var result;
            if (getTrackObj()) {
                result = getTrackObj().cameraHeight;
            }
            if (!result && getTrackObj()) {
                result = getTrackObj().cameraHeight;
            }
            return result;
        },
        //==================================
        resetCanvas: function () {
            return drawTool.resetCanvas();
        },
        getPicUrlParam: function () {
            return picUrlParam;
        },
        _zrenderEntityHover: function () {
            // mkr = this
            return drawTool._zrenderEntityHover.apply(this, _.toArray(arguments));
        },
        reductionPoint: function () {
            return drawTool.reductionPoint.apply(drawTool, _.toArray(arguments));
        },
        leftZoomOffset: function () {
            return drawTool.leftZoomOffset.apply(drawTool, _.toArray(arguments));
        },
        transformPoint: function () {
            return drawTool.transformPoint.apply(drawTool, _.toArray(arguments));
        },
        getZRenderLayer: function () {
            return drawTool.getZRenderLayer.apply(drawTool, _.toArray(arguments));
        },
        resetPointToPicPlayer: function () {
            return drawTool.resetPointToPicPlayer.apply(drawTool, _.toArray(arguments));
        },
        clearFooterButton: clearFooterButton,
        // 取消前方交会
        hideRightPic: hideRightPic,
        //====================================
        getDrawTool: function () {
            return drawTool;
        },
        getPlayerFooter: function () {
            return playerFooter;
        } 
    });

    function getTrackObj() {
        if (!player || !player.dataMgr) {
            return null;
        }
        return player.wayInfo || player.dataMgr.trackObj;
    }

    function getLeftRightImgCanvasList() {
        return {
            $leftList: player.picBox.selectAll("div.item,div#picplayer-mark-canvas")
            //          $rightList: player.$rightPic.selectAll("div.rigth-pic,div.right-canvas-content")
        }
    }

    function togglePicSubPlayer() {
        if (!iD.svg.PicSubPlayer || !player) return;
        if (!iD.svg.PicSubPlayer.isVisible()) {
            iD.svg.PicSubPlayer.show(player.wayInfo, player.selectPicIndex);
        } else {
            closePicSubPlayer();
        }
    }

    function showUpdatePicSubPlayer() {
        if (!iD.svg.PicSubPlayer || !iD.svg.PicSubPlayer.isVisible()) return;
        iD.svg.PicSubPlayer.show(player.wayInfo, player.selectPicIndex);
    }

    // function togglePicTrackCurve(){
    //     if(!playerTrackCurve || !player) return ;
    //     if(!playerTrackCurve.isVisible()){
    //         playerTrackCurve.show();
    //         playerTrackCurve.setNodeIndex(player.selectPicIndex);
    //     }else {
    //         playerTrackCurve.hide();
    //     }
    // }

    // 开启核线功能
    // 主窗口点击（生成点），副窗口生成核线（与点）
    function toggleFuncClickEpiline() {
        if (!player) return;
        var $btn = player.$zoomList.select('button.btn-zoom-click_epiline');
        if ($btn.classed('active')) {
            closeFuncClick2SubEpiline();
        } else {
            $btn.classed('active', true);
            player._click2sub_epiline = true;
        }
    }

    function closeFuncClick2SubEpiline() {
        var $btn = player.$zoomList.select('button.btn-zoom-click_epiline');
        $btn.classed('active', false);
        player._click2sub_epiline = false;
        SHAPE_KEEP_HANDLE.clearAll();

        dispatch.click2sub_close();
    }

    function click2sub_click(clickOffset, mouseOffset) {
        if (!player._click2sub_epiline) return;

        SHAPE_KEEP_HANDLE.filter(function (d) {
            return d.type != 'star';
        });

        let target = player._zrender.findHover(mouseOffset[0], mouseOffset[1]).target;
        let targetXY = clickOffset;
        let entity, targetLoc;
        // 吸附节点
        if (target && target._entityid) {
            let xy = iD.picUtil.shapeXY(target);
            if (!xy || isNaN(xy[0]) || isNaN(xy[1])) {
                targetXY = clickOffset;
            } else {
                targetXY = xy;
            }
            entity = context.hasEntity(target._entityid);
            targetLoc = entity && entity.loc;
        }
        if (!targetLoc) {
            let geometry = iD.picUtil.pixelToLngLat(targetXY);
            if (geometry) {
                targetLoc = [
                    geometry.lng,
                    geometry.lat,
                    geometry.elevation
                ];
            }
        }

        let data = {
            xy: targetXY,
            loc: targetLoc,
            type: 'star',
            options: {
                shape: {
                    r: 10,
                    r0: 0,
                    n: 4
                },
                style: {
                    lineWidth: 1,
                    // fill : "rgba(220, 20, 60, 0.4)",
                    stroke: "rgba(220, 20, 60, 0.8)"
                }
            },
            targetId: target && target.id,
            targetEntityId: target && target._entityid
        };

        SHAPE_KEEP_HANDLE.add(data);
        SHAPE_KEEP_HANDLE.render();
        dispatch.click2sub_click(clickOffset, _.clone(data));
    }

    dispatch.on('picUpdate.pic-player-click2sub', function () {
        if (!player || !player._click2sub_epiline) return;
        var node = player.pic_point;
        if (!node) return;

        SHAPE_KEEP_HANDLE.filter(function (d) {
            return d.trackPointId && d.trackPointId == node.id;
        });
    });

    function closePicSubPlayer() {
        if (!iD.svg.PicSubPlayer || !player) return;
        if (iD.svg.PicSubPlayer.isVisible()) {
            iD.svg.PicSubPlayer.close();
        }
    }

    player = d3.rebind(new picPlayer(), dispatch, 'on');
    drawTool.init(player);
    playerFooter.init(player, drawTool);

    player.ZEUtil = drawTool.ZEUtil;
    SHAPE_KEEP_HANDLE.setPlayer(player);
    // window.drawTool = drawTool;
    //  window.player = player;
    iD.picUtil.player = player;
    iD.picUtil.context = context;
    return player;
};