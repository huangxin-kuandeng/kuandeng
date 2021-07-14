iD.svg.PlayerFooter = function(context, _opts){
	const constant = _opts.constant;
    const markDrawStatus = _opts.markDrawStatus;
    const zrenderNodeStatus = _opts.zrenderNodeStatus;
    const picUrlParam = _opts.picUrlParam;
    const epilineTool = _opts.epilineTool;
    const isSubPlayer = _opts.hasOwnProperty('isSubPlayer') ? _opts.isSubPlayer : false;
    
    const drawLineTypeArr = ['虚线模式','普通模式'];
    const nonBrowseMode = [
    	'交通灯', '灯头', '打断车道组',
    	'质检标记点', '图像标记点', '分析标记点'
    ];
    
    // 视频常量中用到的数据类型
    const CONSTANT_DATATYPE = {
        [constant.ADD_DIVIDER]: [
            iD.data.DataType.DIVIDER,
            iD.data.DataType.DIVIDER_NODE
        ],
        [constant.ADD_OBJECT_PL]: [
            iD.data.DataType.OBJECT_PL,
            iD.data.DataType.OBJECT_PL_NODE
        ],
        [constant.ADD_BARRIER_GEOMETRY]: [
            iD.data.DataType.BARRIER_GEOMETRY,
            iD.data.DataType.BARRIER_GEOMETRY_NODE
        ],
        [constant.ADD_SIDE_WALK]: [
            iD.data.DataType.OBJECT_PL,
            iD.data.DataType.OBJECT_PL_NODE
        ],
        [constant.ADD_OBJECT_PG]: [
            iD.data.DataType.OBJECT_PG,
            iD.data.DataType.OBJECT_PG_NODE
        ],
        [constant.POLYLINE_ADD_NODE]: [
            iD.data.DataType.DIVIDER,
            iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.OBJECT_PL,
            iD.data.DataType.OBJECT_PL_NODE,
            iD.data.DataType.OBJECT_PG,
            iD.data.DataType.OBJECT_PG_NODE
        ],
        [constant.DIVIDER_ADD_MIDDLEPOINT]: [
            iD.data.DataType.DIVIDER,
            iD.data.DataType.DIVIDER_NODE
        ],
        [constant.TELEGRAPH_POLE]: [
            iD.data.DataType.LAMPPOST
        ],
        [constant.TELEGRAPH_LAMP_HOLDER]: [
            iD.data.DataType.LAMPPOST
        ],
        [constant.ADD_BOARD]: [
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.TRAFFICSIGN_NODE
        ],
        [constant.ADD_BOARD_POLYGON]: [
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.TRAFFICSIGN_NODE
        ],
        [constant.ADD_BOARD_POLYGON_PLANE]: [
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.TRAFFICSIGN_NODE
        ],
        [constant.SPLIT_BOARD_LINE]: [
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.TRAFFICSIGN_NODE
        ],
        [constant.ADD_GROUND_AREA]: [
            iD.data.DataType.OBJECT_PG,
            iD.data.DataType.OBJECT_PG_NODE
        ],
        [constant.ADD_PAVEMENT_DISTRESS]: [
            iD.data.DataType.PAVEMENT_DISTRESS,
            iD.data.DataType.PAVEMENT_DISTRESS_NODE
        ],
        [constant.ADD_PAVEMENT_DISTRESS_LINE]: [
            iD.data.DataType.PAVEMENT_DISTRESS,
            iD.data.DataType.PAVEMENT_DISTRESS_NODE
        ],
        [constant.ADD_PAVEMENT_DISTRESS_LINE2]: [
            iD.data.DataType.PAVEMENT_DISTRESS,
            iD.data.DataType.PAVEMENT_DISTRESS_NODE
        ],
        [constant.BATCH_BREAK_DREF]: [
            iD.data.DataType.DIVIDER,
            iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.R_DIVIDER_DREF
        ],
        [constant.BRIDGE_BOTTOM_LINE]: [
            iD.data.DataType.BRIDGE,
            iD.data.DataType.BRIDGE_NODE
        ],
        [constant.ADD_TRAFFICLIGHT]: [
            iD.data.DataType.TRAFFICLIGHT,
            iD.data.DataType.TRAFFICLIGHT_NODE
        ],
        [constant.ADD_CHECK_TAG_POINT]: [
            iD.data.DataType.QUALITY_TAG
        ],
        [constant.ADD_PICK_MARK_TAG_POINT]: [
            iD.data.DataType.PICK_MARK_TAG
        ],
        // [constant.MOVE_LINE]: [
        //     iD.data.DataType.DIVIDER
        // ],
        [constant.ADD_IMAGE_TAG_POINT]: [
            iD.data.DataType.IMAGE_TAG
        ],
        [constant.ADD_ANALYSIS_TAG_POINT]: [
            iD.data.DataType.ANALYSIS_TAG
        ],
        [constant.ADD_CONTROL_POINT]: [
            iD.data.DataType.OBJECT_PT
        ],
        [constant.ADD_OBJECT_PT]: [
            iD.data.DataType.OBJECT_PT
        ],
        [constant.ADD_OUTLINE_OBJECT_PT]:[
            iD.data.DataType.OBJECT_PT
        ],
        [constant.ADD_ROAD_ATTRIBUTE]: [
            iD.data.DataType.ROAD_ATTRIBUTE
        ],
        [constant.ADD_QUESTION_TAG_POINT]: [
            iD.data.DataType.QUESTION_TAG
        ],
        [constant.ADD_DIVIDER_POLYGON]: [
            // iD.data.DataType.DIVIDER,
            iD.data.DataType.OBJECT_PG,
            iD.data.DataType.OBJECT_PG_NODE
        ]
    };
//  记录错误类型
    const delFlag = {
        '1':'轨迹存在错误!',
        '2':'图片存在错误!',
        '3':'轨迹与图片存在错误!',
    };
    var dispatch = d3.dispatch(
    	'progress_change', 'progress_mousedown', 
        'playcontrol_next', 'playcontrol_prev', 'playcontrol_play', 'playcontrol_pause', 
        'playcontrol_speedchange',  //'playcontrol_speedhour_change', 
    	'keydown',
    	'button_click',
    	'imagetype_change', 'imagebatch_change', 'track_change'
	);
    
    var select_speed = 1;//播放速度列表，默认1倍速
    var select_speed_hour = 0; // 播放时速
    var select_speed_hourstatus = {}; // 播放时速相关参数
    
    var player, drawTool;
    
	function PlayerFooter(){
		this.$dom;
		this.$status;
		this.$buttonList;
	}
	_.assign(PlayerFooter.prototype, {
		init: function(arg1, arg2){
			player = arg1;
			drawTool = arg2;
			select_speed = player.time;
		},
		render: function($root, $statusBar, $headBar){
			var self = this;
			this.$dom = $root;
            this.$status = $statusBar;
            this.$head = $headBar;
			
            this.renderMark();
            this.renderPlayProgress();
            
            var $control = this.$dom.append('div').classed('footer-controller', true);
            this.renderPlayControl($control);
			this.renderButtonList($control);
			/*
			function updateSceneBtns() {
				self.$dom.selectAll('button').each(function(btnType){
					if(!btnType) return ;
					var useModels = CONSTANT_DATATYPE[btnType] || [];
					var ishide = false;
					if(useModels && useModels.length){
						ishide = !iD.util.modelSceneEditable(useModels, context);
					}
					// 开发功能用hidden的class控制显示/隐藏
					if(ishide){
						d3.select(this).style('display', 'none');
					}else {
						d3.select(this).style('display', 'inline-block');
					}
				});
			}
			updateSceneBtns();
			context.event.on('change_scene.pic-player', function() {
				updateSceneBtns();
			});
			*/
		},
		renderMark: function(){
			var self = this;
			var footer = this.$dom;
			/* 选择标记错误类型 */
            var markDelete = footer.append("div").attr("class", "markDelete");
            var markDeleteModel = `
				<div class="div1header">
		            <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
		              	<span aria-hidden="true">&times;</span>
		            </button>
					<h4>错误标记</h4>
				</div>
				<div class="div1body">
					<p><input type="radio" id="contrail" name="false" value="1" /><label for="contrail">轨迹存在错误。</label></p>
					<p><input type="radio" id="image" name="false" checked="checked" value="2" /><label for="image">图片存在错误。</label></p>
					<p><input type="radio" id="all" name="false" value="3" /><label for="all">图片与轨迹存在错误。</label></p>
				</div>
				<div class="div1footer">
					<button type="button" class="btn btn-info confirm" >确认</button>
					<button type="button" class="btn btn-info cancel" >取消</button>
				</div>
			`
            markDelete.html(markDeleteModel);
            var $markDelete = $(markDelete.node())
            $markDelete.find(".div1header .close").on("click", function () {						//关闭按钮
                $markDelete.hide();
            });
            $markDelete.find(".div1footer button.cancel").on("click", function () {					//取消按钮
                $markDelete.hide();
            });

            $markDelete.find(".div1footer button.confirm").on("click", function () {					//确认按钮
//				错误类型
                var valueDelete = $('.markDelete .div1body input:radio:checked').val();
                var task = iD.Task.d;
				var kieVersion = iD.Task.d.tags.kieVersion;
                let url = iD.config.URL.krs + 'track/mark?kieVersion='+kieVersion+'&trackPointId='+trackPointId1+'&delFlag='+valueDelete;
                if(task && task.tags.projectId){
                    url += '&projectId=' + task.tags.projectId;
                }
                $.ajax({
                    url: url,// 请求的Url
                    type: 'get',
                    async: false,
                    dataType: "json",
                    success:function(data){
//			        	编辑成功后显示出来
                        $(markFalse.node()).show()
                            .text(delFlag[valueDelete]);
                        for(var i=0; i<player.allNodes.length; i++){
                            if(trackPointId1 == player.allNodes[i].tags.trackPointId){
                                player.allNodes[i].tags.delFlag = valueDelete;
                            }
                        }
                    }
                })
                $markDelete.hide();
            });
            
		},
		renderPlayProgress: function(){
			var self = this;
			var footer = this.$dom;
			var totalCount = player.allNodes && player.allNodes.length || player.picCount;
            /* 增加图片播放器的进度条 */
            var progressBar = footer.append('div').attr('class', 'footer-progress-bar');
            var progressRangeDiv = progressBar.append('div').attr('class', 'footer-progress-range-div');
            var progressRange = progressRangeDiv.append('input')
                .attr('type', 'range')
                .attr('class', 'footer-progress-range')
                .attr('value', 0)
                .attr('min', 0)
                .attr('max', totalCount - 1)
                .attr('step', 1);
            var progressNumberDiv = progressBar.append('div').attr('class', 'footer-progress-number-div');
            var progressNumber = progressNumberDiv.append('input')
                .attr('type', 'number')
                .attr('class', 'footer-progress-number no-number')
                .attr('value', 1)
                .attr('min', 1)
                .attr('max', totalCount)
                .attr('step', 1)
                .attr('title', 1);
            var progressRangeTip = progressRangeDiv.append('span').attr('class', 'footer-progress-range-tip');

            progressNumber.on('keydown.pic-progress', function(){
                var evt = d3.event;
                if(_.include([38, 40], evt.keyCode)){
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                    return false;
                }
            }).on('keyup.pic-progress', function(){
                var evt = d3.event;
                if(evt.keyCode != 13){
                    return false;
                }
                if(this.value != '' && !isNaN(this.value) && this.value != this.__triggerValue){
                    progressRange.value(parseInt(this.value) - 1).trigger('change');
                    this.__triggerValue = this.value;
                }
                return false;
            }).on('change.pic-progress', function(){
                // 直接按回车时会直接触发change事件
                // 与keyup按回车时冲突，导致有时输入100并按回车，最终结果被触发了两次，变成101
                if(this.value != '' && !isNaN(this.value)){
                    progressRange.value(parseInt(this.value) - 1).trigger('change');
                    this.__triggerValue = this.value;
                }
                return false;
            });

            progressBar.append('span').attr('class', 'footer-progress-total').text('/' + totalCount + '帧');

            var newNumberW = totalCount.toString().length * 8 + 8 + 5;
            progressNumberDiv.style('width', newNumberW + 'px');

            progressBar.on('picPlayerEvt', function (data, idx, group) {
                var event = d3.event;
                var playerData = event.detail[0].playerData;
                // if (playerData.max) {
                //     playerData.max = +playerData.max;
                //     progressRange.attr('max', playerData.max - 1);
                //     progressNumber.attr('max', playerData.max);
                //     progressBar.select('.footer-progress-total').text('/' + playerData.max + '帧');
                //
                //     var newNumberW = playerData.max.toString().length * 8 + 8 + 5;
                //     progressNumberDiv.style('width', newNumberW + 'px');
                // }
                // if (playerData.current || 0 === playerData.current) {
                    progressRange.node().value = playerData.current;
                    let per = playerData.current / parseFloat(progressRange.attr('max'));
                    let indx = playerData.current + 1;
                    progressRange.style('background-image', '-webkit-gradient(linear, 0 0, 100% 0, from(#4a7fec), color-stop(' + Math.max((per - 0.001), 0) + ', #4a7fec), color-stop(' + Math.max((per - 0.0009), 0) + ', #ffffff), to(#ffffff))');
                    progressNumber.value(indx);
                    progressNumber.attr('title', indx)
                // }
            });
            progressRange.on('mousedown', function (data, idx, group) {
                var event = d3.event;
                dispatch.progress_mousedown(event);
                self.udpatePlayControl(false);
                var per = parseFloat(+progressRange.node().value) / parseFloat(progressRange.attr('max'));
                progressRangeTip.text((+progressRange.node().value + 1) + '帧').style('left', (per * 100) + "%").style('display', 'inline-block');
            });
            progressRange.on('mouseup', function (data, idx, group) {
                var event = d3.event;
                progressRangeTip.style('display', 'none');
            });
            progressRange.on('input', function (data, idx, group) {
                var event = d3.event;
                var per = parseFloat(this.value) / parseFloat(this.getAttribute('max'));
                progressRange.attr('style', 'background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#4a7fec), color-stop(' + Math.max((per - 0.001), 0) + ', #4a7fec), color-stop(' + Math.max((per - 0.0009), 0) + ', #ffffff), to(#ffffff))');
                progressRangeTip.text((+progressRange.node().value + 1) + '帧').style('left', (per * 100) + "%");
            });
            // 输入框获取焦点时按方向键，会导致值改变触发相关事件
            progressRange.on('keydown', function () {
                d3.event.preventDefault();
                d3.event.stopPropagation();
                this.blur && this.blur();
                return false;
            });
            progressRange.on('change', function (data, idx, group) {
            	dispatch.progress_change(d3.event, {
            		value: parseInt(this.value),
            		oldValue: parseInt($.trim(progressNumber.value()))
            	});
            });
		},
		renderPlayControl: function(footer){
			var self = this;
			var $playBtn;
            //增加播放倍数
            // var playSpeed = [0.2, 0.5, 1, 1.5, 2, 4];
            var playSpeed = [1, 2, 4, 8];
            var seElement = footer.append("div").classed("playSpeed", true).append("select").on("change", function () {
            	this.blur && this.blur();
                select_speed = +this.value || 1;
                d3.select(".compress_original").classed("active", false);
                dispatch.playcontrol_speedchange(select_speed);
            });
            var options = seElement.selectAll("option").data(playSpeed);
            options.enter().append("option").text(function (d, i) {
                return d + "x"
            }).value(function (d, i) {
                return d
            });
            //默认选中1倍速
            options.filter(function (d, i) {
                return d == player.time || i == 0;
            }).attr("selected", "selected");

            // 时速选项
            // var playSpeedHour = ['时速', 60, 80, 100, 120];
            // var seElement = footer.append("div").classed("playSpeedHour", true).append("select").on("change", function() {
            //     d3.select(".compress_original").classed("active", false);
            //     this.blur && this.blur();
                
            //     if(isNaN(this.value)){
            //         dispatch.playcontrol_pause();
            //         self.udpatePlayControl(false);
            //         return ;
            //     }
            //     player._is_play_speedhour = true;

            //     select_speed_hour = +this.value;
            //     let playHourStatus = computeTrackSpeedInfo(player, select_speed_hour);
            //     select_speed_hourstatus = playHourStatus;
            //     dispatch.playcontrol_speedhour_change(select_speed_hour, playHourStatus);
            // });
            // var options = seElement.selectAll("option").data(playSpeedHour);
            // options.enter().append("option").text(function(d, i) {
            //     return isNaN(d) ? (d + '') : (d + 'km/h');
            // }).value(function(d, i) {
            //     return d
            // });
            
            
            var playerSpan = footer.append("div")
                .attr('class', 'play-controller');
            playerSpan.append("a").attr({ "class": "glyphicon glyphicon-backward playericon", "title": "上一帧" }).style("display", "inline-block").on("click", function () {
            	dispatch.playcontrol_prev();
                d3.select(".compress_original").classed("active", false);
            });
            $playBtn = playerSpan.append("a")
            	.attr({ "class": "glyphicon playcontrol-play glyphicon-triangle-right playericon", "title": "播放" })
            	.style("display", "inline-block").on("click", function () {
                if ($playBtn.attr('title') === "播放") {
                    select_speed = select_speed || 1;
                    dispatch.playcontrol_play(select_speed);
                    self.udpatePlayControl(true);
                } else {
                    dispatch.playcontrol_pause();
                    self.udpatePlayControl(false);
                }
            });
            playerSpan.append("a").attr({ "class": "glyphicon glyphicon-forward playericon", "title": "下一帧" }).style("display", "inline-block").on("click", function () {
            	dispatch.playcontrol_next();
                d3.select(".compress_original").classed("active", false);
            });
		},
		/**
		 * 更新播放按图标
		 * @param {Boolean} isPlay
		 */
		udpatePlayControl: function(isPlay){
			var self = this;
			var $playBtn = self.$dom.select('a.glyphicon.playcontrol-play');
			$playBtn.classed({
				"glyphicon-triangle-right": false,
				"glyphicon-pause": false
			});
			// 播放状态，按钮为暂停
			if(isPlay){
				$playBtn.classed('glyphicon-pause', true);
				$playBtn.attr('title', '暂停');
			}else {
				$playBtn.classed('glyphicon-triangle-right', true);
				$playBtn.attr('title', '播放');
			}
		},
		renderButtonList: function(footer){
            // if(isSubPlayer){
            //     return false;
            // }
            var self = this;
            var markSpan = footer.append("div")
                .attr('class', 'btn-group')
                .attr('role','group')
                .attr('data-toggle','buttons')
                .on('click',function(e){
                	e = e || d3.event;
	                var btnText = e.target.textContent;
	                if(e.target.childNodes && e.target.childNodes.length){
	                    btnText = e.target.childNodes[0].textContent;
	                }
                    dispatch.button_click(e || d3.event, btnText);
                    
                    if(isSubPlayer){
                        return ;
                    }
                	// 实线模式/虚线模式
                	if(drawLineTypeArr.includes(btnText)){
	                    var index = drawLineTypeArr.lastIndexOf(btnText) +1;
	                    d3.select(e.target).text(drawLineTypeArr[index%2]);
	                    drawTool.setSolidLineRender(!!(index%2));
	                }
                	/*
	                if(_.include([
	                    constant.ADD_CHECK_TAG_POINT,
	                    constant.ADD_IMAGE_TAG_POINT,
	                    constant.ADD_ANALYSIS_TAG_POINT
	                ], markDrawStatus.type)){
	                	return ;
	                }
	                */
	                // 非浏览、选择时点击按钮，可能会发生地图有绘制状态，点击视频按钮后没有取消的情况
	                // history记录会不准；
	                if(!_.include(['browse', 'select'], context.mode().id)){
	                    context.enter(iD.modes.Browse(context));
	                }else if(!nonBrowseMode.includes(btnText) && context.mode().id == 'select'){
	                // 按钮取消选中状态
	                    // context.mode().closeRadialMenu();
	                    context.enter(iD.modes.Browse(context));
	                }
                });
            
			self.$buttonList = markSpan;

            self.refreshFooterBtnDisplay();
            if(isSubPlayer){
                return ;
            }
            //绑定键盘
            self.appplyNewKeybinding(surface);

			/*
            // 跳转到识别批次对比系统
            if(systemType == "6"){
                var $linkCompare = $('#KDSEditor-content #_link_compare_recog');
                if(!$linkCompare.length){
                    $linkCompare = $('<button>').attr('id', '_link_compare_recog')
                        .text('进入批次对比')
                        .appendTo('#KDSEditor-content');
                }
                $linkCompare.click(function(){
                    var trackid = player.dataMgr.trackId || '';
                    var frameindex = player.selectPicIndex || 0;
                    frameindex ++;
//          		var currentLayer = iD.Layers.getCurrentEnableLayer();
                    var param = iD.util.parseParam2String({
                        taskID: iD.Task.d.tags.taskId,
                        trackID: trackid,
                        frame: frameindex
                    });
                    var sublist = d3.select('#_sublist');
                    if(picUrlParam.subType != '0' && sublist.size()){
                        param += '&batch=' + sublist.value();
                    }
                    var prev = iD.config.URL.compareRecog.indexOf('?') == -1 ? '?' : '&';
                    window.open(iD.config.URL.compareRecog + prev + param);
                });
            }
            */
        },
        refreshFooterBtnDisplay: function (nowLay){
            // if(isSubPlayer) return false;
            var self = this;
			var elementLayers = editor.context.layers().getLayers() || [];
            var $buttonList = self.$buttonList;
            var drawPlugins = drawTool.getDrawPlugins();
            var pluginMap = {};
            _.each(drawPlugins, function(d){
                if(!d.getId) return ;
                pluginMap[d.getId()] = d;
            });
			
            var elementLayers1 = _.values(iD.Static.layersInfo.getElements()) || [];
            
            $buttonList.html('');
            
            var defaultKey =  'default';
            // 根据layer中的models.picdatas判断是否显示按钮；
            var allPicDatas = [], editDatas = [], uneditDatas = [], deleteDatas = [], afterDefaults = [];
            elementLayers.forEach(function(layer){
                // modelName的editable为false
                var uneditModelDatas = [], deleteModelDatas = [];
                // 最终编辑状态图层的编辑按钮
                var editModelDatas = [];
                // if(layer && layer.picdatas && layer.picdatas.length){
                if(layer && layer.models && !_.isEmpty(layer.models)){
                    let datas = layer.picdatas || [];
                    allPicDatas.push(...datas);
                    let dindex = datas.indexOf(defaultKey);
                    if(dindex > -1){
                        afterDefaults.push(...datas.slice(dindex + 1));
                    }
                    // var dlayer = iD.Layers.getLayerById(layer.id);
                    // var modelStatus = dlayer && dlayer.models && dlayer.models.datas;
                    var modelStatus = layer && layer.models;
                    // model没有editable状态，或不存在；
                    // if(modelStatus && layer.editable == true){
                    // if(modelStatus && layer.editable != null){
                    if(modelStatus && layer.display){
						
						_.each(CONSTANT_DATATYPE, function(models, pname){
							
							if(!models || !models.length) return ;
                            // if(pname == constant.POLYLINE_ADD_NODE){
                            //     let b = true;
                            //     for(let mname of models){
                            //         // 添加节点，DIVIDER、OBJECT_PL任意可编辑都可添加节点
                            //         // if(dlayer.isModelEditable(mname)){
                            //         if(layer.isModelEditable(mname)){
                            //             b = false;
                            //             break;
                            //         }
                            //     }
                            //     if(b) uneditModelDatas.push(pname);
                            // }else {
                                let mdelete = false, munedit = false, medit = false;
                                for(let mname of models){
                                    let status = modelStatus[mname];
									// model中有一个editor为true的,则为可编辑
                                    if(status && !status.editlock && status.editable) {
                                        medit = true;
                                        break;
                                    }
                                }
                                if(medit){
                                    editModelDatas.push(pname);
                                }
                            // }
							
						});
						
                    }
                    // if(layer.editable != null){
                    //     if(layer.display && layer.editable){
                    //         editModelDatas = _.difference(datas, uneditModelDatas, deleteModelDatas);
                    //     }else {
                    //         uneditModelDatas.push(...datas);
                    //     }
                    // }else if(layer.editable == undefined){
                    //     uneditModelDatas.push(...datas);
                    // }
                    editDatas.push(...editModelDatas);
                    // uneditDatas.push(...uneditModelDatas);
                    // // 存在undefined模型配置
                    // deleteDatas.push(...deleteModelDatas);
                }
            });
            // default比较特殊，多个图层都可能配置default
            // 根据default分割配置，default之前提前渲染，之后的之后渲染
            // 多个default之间只保留最后一个default
            var tempDatas = [], dcount = 0, tcount = 0;
            _.each(allPicDatas, function(v){
                if(v == defaultKey) dcount ++;
            });
            _.each(allPicDatas, function(v){
                if(v == defaultKey && tcount < dcount - 1){
                    tcount++;
                    return ;
                }
                tempDatas.push(v);
            });
            if(editDatas.length){
                allPicDatas = _.difference(tempDatas, editDatas).concat(editDatas);
            }else {
                allPicDatas = tempDatas;
            }
			allPicDatas.push(...[
				defaultKey,
				constant.INTERSECTION,
				constant.TOOL_EPLILINE_CROSS,
			]);
            allPicDatas = _.uniq(allPicDatas);
            // editDatas = _.uniq(editDatas);
            // uneditDatas = _.uniq(uneditDatas);
            // uneditDatas = _.difference(_.uniq(uneditDatas), editDatas);
            // deleteDatas = _.uniq(deleteDatas);
            // deleteDatas = _.difference(_.uniq(deleteDatas), uneditDatas, editDatas);

            var keepDatas = [];
            // if(iD.User.isTrackStandardRole()){}
            keepDatas.push(...[
                constant.INTERSECTION, 
                // 201811113 所有用户都可以查看标定面板
                constant.TOOL_EPLILINE_CROSS
            ]);

            // if(iD.Task.hideNoMeasureOperate()){
                // deleteDatas.push(constant.BATCH_BREAK_DREF);
            // }
            if(allPicDatas.length){
                _.each(allPicDatas, function(btnType){
                    if(!btnType) return ;
                    var d = pluginMap[btnType];
                    if(!d) return ;
                    d.renderBtn($buttonList);
                });
                
                $buttonList.selectAll('button').each(function(btnType){
                    if(_.include(keepDatas, btnType) || d3.select(this).classed('footer_useless_btn')){
                        return ;
                    }
					
                    this.classList.add('hide');
                    if(_.include(allPicDatas, btnType)){
                        this.classList.remove('hide');
                        return ;
                    }
                });
            }else {
                // 没有任何配置图层
                var _def_plugins = [
                    defaultKey,
                    iD.Static.playerConstant.INTERSECTION
                ];
                if(iD.User.isTrackControlPointRole()){
                    _def_plugins.push(constant.TOOL_TRACK_CONTROLPOINT);
                }
                _def_plugins.forEach(function(keyName){
                    var d = pluginMap[keyName];
                    d && d.renderBtn($buttonList);
                });
            }
            
            if(pluginMap[defaultKey]){
                // 刷新轨迹列表、批次列表
                player.updateBatch();
            }
            
            // 无用的按钮，通过右侧工具按钮空值显示/隐藏
            var uselessClass = 'footer_useless_btn';
            // 隐藏开发功能
            if(!player.developShow){
                $buttonList.selectAll("button,select").each(function(){
                    var $this = d3.select(this);
                    if($this.classed(uselessClass)){
                        $this.classed('hidden', true);
                    }
                });
            }

            player._inited && player.triggerResize();
        },
        appplyNewKeybinding: function (surface) {
            var self = this;

//          第一次判断键盘事件及相对应触发的函数
            function switchKey(key) {
                key = key.toLowerCase();
                var data = {
                	returnValue: null
                };
                dispatch.keydown(key, data);
                return data.returnValue;
            }
            d3.select(document).on('keydown.pic-player', () => {
                var event = d3.event || window.event;
                if (event.target.tagName === 'INPUT') {
                    return;
                }

                var key = event.key;
                var ctrl = event.ctrlKey ? 'ctrl+' : '';
                var shift = event.shiftKey ? 'shift+' : '';
                var alt = event.altKey ? 'alt+' : '';
                var meta = event.metaKey ? 'meta+' : ''; //win键
                key = ctrl + shift + alt + meta + key
                if (switchKey(key)) {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                }
            });
            //true 在捕获阶段响应事件
        },
        // 
        /**
         * 更新标题、状态信息
         * @param {Object} node
         */
        updateTitle: function (node) {
            var self = this;
//          var title = "轨迹点ID:" + entity.tags.trackPointId + "   拍摄时间:" + d.toLocaleString() + "  第" + index_pointId + "帧  " + "图片数：" + self.picCount;
            node = node || player.allNodes[player.selectPicIndex];
            var data = [node];
            /*
             * B L H：纬度、经度、高程
             */
			// table table-bordered table-hover
            var tableTempl = (result, isHidden)=>`
            <table id="picplayer-status-table" class="${isHidden ? 'hidden-visibility' : ''} ">
                <thead>
	                <tr>
		                <th>roll</th>
		                <th>pitch</th>
		                <th>azimuth</th>
		                <th>B</th>
		                <th>L</th>
		                <th>H</th>
		                <th>UTM-X</th>
		                <th>UTM-Y</th>
		                <th>rollSigma</th>
		                <th>pitchSigma</th>
		                <th>azimuthSigma</th>
		                <th>latitudeSigma</th>
		                <th>longitudeSigma</th>
		                <th>heightSigma</th>
		                <th>车高</th>
	                </tr>
                </thead>
                <tbody>
                 ${result.map(d => `
                    <tr>
	                    <td>${d.tags.roll}</td>
	                    <td>${d.tags.pitch}</td>
	                    <td>${d.tags.azimuth}</td>
	                    <td>${d.tags.y}</td>
	                    <td>${d.tags.x}</td>
	                    <td>${d.tags.z}</td>
	                    <td>${iD.util.LLtoUTM_(d.tags.x, d.tags.y).x}</td>
	                    <td>${iD.util.LLtoUTM_(d.tags.x, d.tags.y).y}</td>
	                    <td>${d.tags.rollSigma}</td>
	                    <td>${d.tags.pitchSigma}</td>
	                    <td>${d.tags.azimuthSigma}</td>
	                    <td>${d.tags.latitudeSigma}</td>
	                    <td>${d.tags.longitudeSigma}</td>
	                    <td>${d.tags.heightSigma}</td>
	                    <td>${player.getCameraHeight()}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
	        `;
            var $statusBar = self.$status;
            var $table = $statusBar.select('#picplayer-status-table');
            var table =tableTempl(data, $table.size() ? $table.classed('hidden-visibility') : true);
            $statusBar.html(table);
            
            var date = new Date(+node.tags.locTime);
            var title = "<b>ID：</b>" + node.tags.trackPointId + "&nbsp;<b>时间：</b>" + date.toLocaleString();
            // var trackIds = node.tags.trackId || '';
            
            var $headBar = self.$head;
            // var $track = $headBar.select('.picplayer-title-track');
            var $title = $headBar.select('.picplayer-title');
            // if(!$track.size()){
            //     $track = $headBar
            //         .append('div')
            //         .attr('class', 'picplayer-title-track')
            // }
            if(!$title.size()){
                $title = $headBar
                    .append('div')
                    .attr('class', 'picplayer-title')
            }
            // $track.html('<b>轨迹ID：</b>' + trackIds);
            $title.html(title);
        },
	    //==============================
	    getDelFlagText: function(v){
	    	return delFlag[v] || '';
	    },
	    getPlaySpeed: function(){
	    	return select_speed || 1;
	    },
        // getPlaySpeedHourStatus: function(){
        //     return select_speed_hourstatus;
        // },
        getPlayconstantDatatype: function(){
            return CONSTANT_DATATYPE;
        }
	});
	
	var playerFooter = new PlayerFooter();
	playerFooter.event = dispatch;
	return d3.rebind(playerFooter, dispatch, 'on');
}

// function computeTrackSpeedInfo(player, speedHour){
//     let meterPer = ((speedHour * 1000) / (1 * 60 * 60)).toFixed(2) * 1.00;
//     let trackNodes = player.wayInfo.nodes || [];
//     let distance = 0;
//     let disList = [];
//     let timeList = [];
//     trackNodes.forEach(function(node, i){
//         let nextNode = trackNodes[i+1];
//         if(!nextNode) return ;
//         let dis = (iD.util.distanceByLngLat(node.loc, nextNode.loc) || 0);
//         dis = dis.toFixed(2) * 1.00;
//         disList.push(dis);

//         // 30m/1000ms，距离5m则33*5=165ms
//         timeList.push(parseInt(1000 / meterPer * dis));
//         distance += dis;
//     });
//     distance = distance.toFixed(2) * 1.00;

//     // 从开始播放的点计算，抽稀后索引
//     let startNodeIndex = player.selectPicIndex;
//     let playIndexes = [];
//     let playTimeList = [];
//     let play_fps = 8;
//     let play_time = 1000 / play_fps;
//     let play_meter_fps = meterPer * (play_time / 1000);
    
//     let _temp_dis = 0;
//     let _temp_time = 0;
//     let _temp_flag = false;
//     // console.log('compute start ... ', startNodeIndex, disList.length);
//     for(let i = startNodeIndex; i < disList.length; i++){
//         let dis = disList[i];
//         let time = timeList[i];
//         _temp_dis += dis;
//         _temp_time += time;
//         _temp_flag = false;

//         if(_temp_dis > 0 && _temp_dis >= play_meter_fps){
//             let s_idx = i;
//             let s_time = _temp_time;
//             // 判断最近距离
//             let p_dis = _temp_dis - dis;
//             // 当前间距比上段间距更大
//             if(Math.abs(play_meter_fps - _temp_dis) 
//                 > Math.abs(play_meter_fps - p_dis)){
//                     s_idx = i - 1;
//                     s_time = _temp_time - time;
//                     _temp_flag = true;
//             }

//             playIndexes.push(s_idx);
//             playTimeList.push(s_time);
//             _temp_dis = 0;
//             _temp_time = 0;
//         }else if(i == disList.length - 1){
//             // console.log('index last ... ');
//             // 最后一帧添加
//             let s_idx = trackNodes.length - 1;
//             let last_idx = playIndexes[playIndexes.length - 1];
//             let times = [];
//             // 最后几帧开始播放可能为null
//             if(last_idx == null){
//                 times = [play_time];
//             }else if(_temp_flag){
//                 times = timeList.slice(last_idx + 1, s_idx);
//             }else {
//                 times = timeList.slice(last_idx, s_idx);
//             }
//             let s_time = 0;
//             times.forEach((v)=>s_time+=v);

//             playIndexes.push(s_idx);
//             playTimeList.push(s_time);
//         }
//     }

//     return {
//         distance,
//         meterPer,
//         // disList,
//         timeList,
//         playIndexes,
//         playTimeList
//     };
// }