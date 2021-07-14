/*
 * @Author: tao.w
 * @Date: 2019-10-24 20:29:32
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-13 20:37:52
 * @Description: 
 */
/**
 * Created by wangtao on 2017/11/3.
 */
iD.ui.TaskList = function (context) {
    var $buttonList;
    var loading = iD.ui.Loading(context).message("任务装载中").blocking(false);
    function updateTaskLayer() {
        let resources = iD.Static.layersInfo.getResourceElements().resource.children;
        for (resource of resources) {
            if (resource.unique === 'background') {
                context.background().layerVisible(resource.type, resource.display);
            }
        }
    }
    async function layerChange() {
        // 质检表格
        d3.select('div.editcheck-tag-panel').classed('hidden', true);
        // 更新右侧图层列表、加载批次、版本信息
        await context.ui().layermanager.initialization();
        // 根据批次初始化Layer列表
        iD.Static.layersInfo.initElements();
        // 根据Layer列表渲染右侧list
        context.ui().layermanager.redrawLayerList();
        // 创建DataLayer图层
        await iD.config.resetDataLayer();
        // 事件
        context.ui().layermanager.update();
        // 更新picplayer
        iD.User.dispatch.dvr();

        iD.ui(context).reportform.showBtn();
        iD.ui(context).markupform.showBtn();
        // iD.ui(context).accuracyform.showBtn();
        // context.ui().reportform.showBtn();
        context.ui().accuracyform.showBtn();
        context.ui().topoRefresh.showBtn();
        // context.container().call(iD.ui.Restore(context));
        updateTaskLayer();
    }
    function update(data, $button) {
        // var lis = d3.select('.task-list .dropdown-menu').selectAll('li').data(data).enter().append('li')
        //     .text(function (d){
        //         return d.task_id;
        //     });
        d3.select('.task-list .dropdown-menu .task-table').selectAll('tr').remove();
        // 审核/质检/验收员 可领取30个任务
        // 作业员只能领取3个任务
        var maxL = -1;
        if (iD.User.isWorkRole()) {
            maxL = 3;
        } else if (iD.User.isCheckRole() || iD.User.isVerifyRole() || iD.User.isAuditRole()) {
            maxL = 30;
        }
        if (maxL > 0 && data && data.length >= maxL) {
            $button.select('.task-receive').property('disabled', 'disabled');
        }
        var trs = d3.select('.task-list .dropdown-menu .task-table').selectAll('tr').data(data).enter().append('tr');
        trs = renderTrs(trs);

        var task_id = iD.url.getUrlParam("taskID");
        if (iD.Task.isLocalTaskSys()) {
            task_id = task_id || -1;
        }
        // 只有第一次会进入指定的task_id
        if (!iD.User._urlTaskIsEnter) {
            trs.each(function (d) {
                var $tr = d3.select(this);
                if (d && task_id && d.task_id == task_id) {
                    $tr.trigger("click");
                    iD.User._urlTaskIsEnter = true;
                    $button.classed('open', false);
                }
                return false;
            });
        }

        trs.on('mouseenter', function (d) {
            let _this = this;
            SUBLIST_TIMER && clearTimeout(SUBLIST_TIMER);
            SUBLIST_TIMER = setTimeout(function () {
                showSubTaskList(d, _this);
            }, 200);
        });

        trs.on('mouseleave', function (d) {
            let _this = this;
            SUBLIST_TIMER && clearTimeout(SUBLIST_TIMER);
            SUBLIST_TIMER = setTimeout(function () {
                hideSubTaskList();
            }, 100);
        });

        let container = context.container();
        if (!container || !container.size()) { return; }
        let $sublist = container.select('#task_list_sub');
        if (!$sublist || !$sublist.size()) {
            // $sublist
            $sublist = container.append('div').attr('id', 'task_list_sub');
        }
        $sublist.on('mouseenter', function () {
            SUBLIST_TIMER && clearTimeout(SUBLIST_TIMER);
            SUBLIST_TIMER = null;
        });
        $sublist.on('mouseleave', function () {
            SUBLIST_TIMER && clearTimeout(SUBLIST_TIMER);
            SUBLIST_TIMER = setTimeout(function () {
                hideSubTaskList();
            }, 100);
        });
    }
    function hasSubList(d) {
        // let fusionKey = 'fusion';
        let fusionKey = 'linearFusion';
        if (!d || !d.bussCodes || !d.bussCodes.includes(fusionKey)) {
            return false;
        }
        return true;
    }

    var SUBLIST_TIMER;
    // 子任务菜单
    function showSubTaskList(d, tr) {
        if (!hasSubList(d)) {
            hideSubTaskList();
            return;
        }
        let rect = tr.getBoundingClientRect();
        let container = context.container();
        let $sublist = container.select('#task_list_sub');
        $sublist
            .style('top', rect.top + 'px')
            .style('left', (rect.left + rect.width) + 'px');

        $sublist.html('').classed('hide', false);
        $sublist.append('div').attr('class', 'loading').text('加载中');
        iD.Task.querySubTaskList(d, function (tasks) {
            if (!tasks.length) {
                $sublist.select('.loading').text('无查询结果');
                return;
            }
            $sublist.select('.loading').remove();
            renderSubList(tasks);
        });
    }

    function hideSubTaskList() {
        iD.Task.querySubTaskList(null);

        let container = context.container();
        let $sublist = container.select('#task_list_sub');
        $sublist.html('').classed('hide', true);
    }

    function renderSubList(tasks) {
        let container = context.container();
        let $sublist = container.select('#task_list_sub');
        let $table = $sublist.append('table').attr('class', 'task-table');
        let subTrs = $table.selectAll('tr').data(tasks).enter().append('tr');
        renderTrs(subTrs, true);
    }

    function loadTaskData(taskObj) {
        // let url = iD.config.URL.haydn + '/haydn/task/query';
        // let url = iD.config.URL.kts_muses + 'muses/task/query';
        let url = iD.config.URL.kts_muses +'muses/task/'+ taskObj.task_id + '/query?includeAllInFusionProject=true';
        // http://192.168.137.1:8080/muses/task/605397417/
        let taskInfo = {}, dataKeys = iD.Constant.DataKeys;
        if (!taskObj || !taskObj.tags || !iD.Constant.DataKeys || !taskObj.tags.projectId) {
            return taskInfo;
        }

        let projectId = taskObj.tags.projectId;
        if (taskObj.tags.hasOwnProperty('sourceProjectId')) {
            projectId = taskObj.tags.sourceProjectId; 
        }

        let isPavementDisease = (taskObj.tags.processDefinitionKey == 'PavementDisease' || taskObj.tags.branchDataType == '3');
        if (isPavementDisease && (taskObj.tags.trackIds.split(',').length == 1)) {
            context.measuringTrack = taskObj.tags.trackIds;
        }
        let param = {
            'projectId': projectId,
            'includeTrack': true,
            'includeData': true
            // 'taskFrameId': taskObj.tags.taskFrameId
        }

        return new Promise(function (resolve) {
            d3.json(url)
                .header("Content-Type", "application/json;charset=UTF-8")
                .get( function (error, result) {
                    let data = result.result.result;
                    if (!data || !data.length || error) {
                        resolve(taskInfo);
                        return;
                    }
                    let isPavement = false;
                    let trackId;
                    if (isPavementDisease) {
                        isPavement = true;

                        if (taskObj.tags.auxTrackIds) {
                            taskObj.tags.trackIds = taskObj.tags.trackIds + ',' + taskObj.tags.auxTrackIds;
                        }

                        trackId = taskObj.tags.trackIds;
                    }
                    dataKeys.forEach(dataKey => {
                        let datas = data.filter(d => {
                            return d.type == dataKey.linkName;
                        })
                        if (!datas.length) return false;
                        let keys = [];
                        for (let i = 0; i < datas.length; i++) {
                            let d = datas[i];
                            if (isPavement && (dataKey.linkName == 'orthophoto_tile' || dataKey.linkName == 'camera_height_calc') && !d.trackIds.includes(trackId)) {
                                continue;
                            }

                            if (dataKey.type == 'task') {
                                keys.push(d.id);
                            } else {
                                keys.push(..._.pluck(d.datas, 'dataKey'));

                            }
                        }
                        // datas.forEach(d=>{
                        //     if(isPavement && (dataKey.linkName == 'orthophoto_tile'  || dataKey.linkName == 'camera_height_calc')){

                        //     }
                        //     if( dataKey.type == 'task'){
                        //         keys.push(d.id);
                        //     }else{
                        //         keys.push(..._.pluck(d.datas,'dataKey'));

                        //     }
                        // })
                        taskInfo[dataKey.name] = keys.join(',') || '';
                    })

                    resolve(taskInfo);
                });
        });
    }

    /**
     * 当前任务的接边keys
     * @param {Number} projectid 
     * @param {Array} frameIds 
     */
    function loadEdgeLayers(task) {
        
        // let url = iD.config.URL.kts + 'project/findById?id=' + projectid;
        return new Promise(function (resolve) {

            
            let versions = [];
            // 全要素编译相关角色加载辅框key；
            // if (!iD.User.isTotalFactorCompileRole()) {
            //     resolve(versions);
            //     return;
            // }
            let frameIds = task.tags.subTaskFrameIds;
            if (typeof frameIds == 'string') {
                frameIds = frameIds.split(',');
            }
            if ( !frameIds || !frameIds.length) {
                resolve(versions);
                return;
            }
             
            var taskFrames = task.tags.taskFrames;
            if (!taskFrames) {
                resolve(versions);
                return;
            }
            try {
                taskFrames = JSON.parse(taskFrames)
            } catch (err) {
                console.log('解析taskFrames失败');
                resolve(versions);
                return;
            }
            if (!taskFrames.length) {
                resolve(versions);
                return;
            }
            frameIds.forEach(function (fid) {
                let frame = taskFrames.filter(d => d.taskFrameId == fid)[0];
                if (!frame || !frame.layers || !frame.layers.length) return;
                let obj = frame.layers.filter(d => d.layer == 'lane')[0];
                if (!obj || !obj.key) return;
                let taskkey = obj.key;
                let sps = taskkey.split('_');
                let num = obj.dataVersion || sps[sps.length - 1];
                num = isNaN(num) ? '' : Number(num);
                let tid = obj.taskId || sps[sps.length - 2] || '';
                versions.push({
                    taskId: tid,
                    dataVersion: num,
                    layer: 'lane',
                    taskKey: taskkey
                });
            });
            resolve(versions);

            // d3.json(url)
            //     .get(function (error, data) {
            //         if (error || !data.result) {
            //             resolve(versions);
            //             return;
            //         }
            //         var taskFrames = _.find(data.result.tags, { k: 'taskFrames' });
            //         if (!taskFrames) {
            //             resolve(versions);
            //             return;
            //         }
            //         try {
            //             taskFrames = JSON.parse(taskFrames.v)
            //         } catch (err) {
            //             console.log('解析taskFrames失败');
            //             resolve(versions);
            //             return;
            //         }
            //         if (!taskFrames.length) {
            //             resolve(versions);
            //             return;
            //         }
            //         frameIds.forEach(function (fid) {
            //             let frame = taskFrames.filter(d => d.taskFrameId == fid)[0];
            //             if (!frame || !frame.layers || !frame.layers.length) return;
            //             let obj = frame.layers.filter(d => d.layer == 'lane')[0];
            //             if (!obj || !obj.key) return;
            //             let taskkey = obj.key;
            //             let sps = taskkey.split('_');
            //             let num = obj.dataVersion || sps[sps.length - 1];
            //             num = isNaN(num) ? '' : Number(num);
            //             let tid = obj.taskId || sps[sps.length - 2] || '';
            //             versions.push({
            //                 taskId: tid,
            //                 dataVersion: num,
            //                 layer: 'lane',
            //                 taskKey: taskkey
            //             });
            //         });
            //         resolve(versions);
            //     });
        });
    }

    function renderTrs(trs, isSubList = false) {
        var $button = $buttonList;
		var workTypes = {
			'0': '自动驾驶工艺',
			'1': '公路资产工艺'
		}
        trs.each(function (d, i) {
            var tr = d3.select(this);
            if (!isSubList && hasSubList(d)) {
                tr.classed('to-sublist', true)
            }
            // tr.append('td').text('').classed('icon', true);
			var workType = workTypes[d.tags.workType] || '';
            tr.append('td')
                .attr('title', workType)
                .text(workType);
				
            tr.append('td')
                .attr('title', d.task_id)
                .text(d.task_id);
            let typeName = '';
            switch (d.protoData.taskDefinitionKey) {
                case "ManualEdit":
                    typeName = '编辑';
                    break;
                case "ManualEditAutoCheckHandle":
                    typeName = '检查';
                    break;
                case "FusionHandle":
                    typeName = '融合';
                    break;
                case "FusionHandleAutoCheckHandle":
                    typeName = '检查';
                    break;
                case "ManualCheckEdit":
                    typeName = '质检';
                    break;
                case "sdEdit":
                    typeName = '传统';
                    break;
                case "RecHandle":
                    typeName = '识别';
                    break;
                case "SelectHandle":
                    typeName = '图像选取';
                    break;
            }
            if (typeName) {
                typeName = '[' + typeName + '] '
            }

            tr.append('td')
                .attr('title', typeName + d.cli_desc)
                .text(typeName + d.cli_desc);

            if (isSubList) {
                var checkRes = '无标记', checkColro = '';
                if (d.marking) {
                    checkRes = '已标记';
                    checkColro = '#008000';
                }
                var $td = tr.append('td')
                    .attr('class', 'task_checkstatus')
                    .attr("title", checkRes)
                    .style('padding', '5px 5px')
                    .style('text-align', 'center')
                    .style('color', '#000')
                    .text(checkRes);
                if (checkColro) {
                    $td.style('background-color', checkColro);
                }
            }
            if (iD.User.isWorkRole() || iD.User.isLineWorkRole() || iD.User.isQualityAssessorRole()) {
                var checkRes = "可作业", checkColro = "#008000", fcolor = '#000';
                if (iD.User.isQualityAssessorRole()) {
                    checkRes = '未检查';
                    checkColro = '';
                }
                if (isSubList) {
                    checkRes = '未检查';
                    checkColro = '';
                }
                if (d.tags.checkStatus && (d.tags.checkStatus == "1" || d.tags.checkStatus == "0")) {
                    tr.attr('class', 'disabled')
                        .style('color', '#808080')
                        .style('cursor', 'not-allowed')

                    checkRes = ["等待中", "检查中"][d.tags.checkStatus] || '';
                    // checkRes = "检查中";
                    checkColro = "#FFFF00";
                } else if (d.tags.checkStatus && d.tags.checkStatus == "2") {
                    checkRes = "检查完成";
                    checkColro = "#ff0000";
                } else if (d.tags.checkStatus && d.tags.checkStatus == "3") {
                    checkRes = "检查异常";
                    checkColro = "#0000FF";
                    fcolor = '#fff';
                } else if (d.tags.checkStatus && d.tags.checkStatus == "4") {
                    checkRes = "进行中";
                    checkColro = "#FFFF00";
                    fcolor = '#000';
                } else if (d.tags.checkStatus && (d.tags.checkStatus == "100" || d.tags.checkStatus == "5")) {
                    checkRes = "可作业";
                    checkColro = "#008000";
                    fcolor = '#000';
                } else if (d.tags.checkStatus && d.tags.checkStatus == "6") {
                    checkRes = "处理异常";
                    checkColro = "#0000FF";
                    fcolor = '#fff';
				}

                tr.append('td')
                    .attr('class', 'task_checkstatus')
                    .attr("title", checkRes)
                    .style('background-color', checkColro)
                    .style('padding', '5px 5px')
                    .style('text-align', 'center')
                    .style('color', fcolor)
                    .text(checkRes);
            }
        });
        trs.on('click', function (d, i) {
            context.container().call(loading);
            enterTask(d, i);
            // _enterTask(d,i);
            // _.debounce(function(d, i){
            //     enterTask(d, i);
            // }, 250,{ 'maxWait': 2000 });
            // _.debounce(function (d,i) {
            //     enterTask(d, i);
            // },200, {
            //     leading: true,
            //     trailing: false
            // })
        });

        return trs;
    }
    let _enterTask = _.debounce(function (d, i) {
        enterTask(d, i);
    }, 250, { 'maxWait': 2000 });

    function enterTask(d, i) {
        if ((iD.Task.d && d.task_id == iD.Task.d.task_id)) {
            loading && loading.close();
            return;
        }

        //如果合标面板存在，在切换任务时隐藏
        var $markupDialog = d3.select('.markupDialog');
        if ($markupDialog.node()) {
            $markupDialog.style('display', 'none');
        }

        if (context.variable.signpostTagEditor) {
            context.variable.signpostTagEditor.messageTrafficSigns = [];
            context.variable.signpostTagEditor.traffciSignClass = {};
            context.variable.signpostTagEditor.fields = {};
            context.variable.signpostTagEditor.addFeatures = [];
            context.variable.signpostTagEditor.modifiedFeatures = [];
            context.variable.signpostTagEditor.removeFeatures = [];
            context.variable.signpostTagEditor.pbRoot = null;
            context.variable.signpostTagEditor.signpostDialog && context.variable.signpostTagEditor.signpostDialog.close();
            context.variable.signpostTagEditor.signpostDialog = null;

        }
        //context.event.taskChage(d, function() {
        Promise.all([
            loadTaskData(d),
            loadEdgeLayers(d)
        ]).then(function (args) {
            let taskData = args[0];
            let edgeLayers = args[1];
            context.inflight = {};
            context.aboveGrounds = {};
            context.catchAboveGround = {
                id: '',
                aboveGround: null
            };
            toTask(taskData, edgeLayers || []);
            // context.ply = null;
            loading && loading.close();
        });
        //});

        function toTask(taskData, edgeLayers) {

            for (let o in taskData) {
                if (!Object.prototype.hasOwnProperty.call(d.tags, o)) {
                    d.tags[o] = taskData[o];
                } else if (taskData[o] != '' && taskData[o]) {
                    d.tags[o] = taskData[o];
                }
            }

            // Object.assign(d.tags,taskData);
            d.edgeLayers = edgeLayers;

            if (d.tags.checkStatus
                // 等待中，检查中
                && (d.tags.checkStatus == '0' || d.tags.checkStatus == '1')) {
                return;
            }
            iD.UserJobHeartbeat.start();

            //------------------------------------------//
            let history = context.history();
            if (history.hasChanges()) {
                // 是否清空
                if (window.confirm(t("save.clear_sure"))) {
                    // 切换任务时可能有选中的数据
                    if (iD.Task.d) {
                        iD.logger.editElement({
                            'tag': 'task_clear_sure',
                            'type': '',
                            'msg': '清空数据',
                            'taskId': iD.Task.d.tags.taskID,
                            'projectId': iD.Task.d.tags.projectId,
                            'task_type': iD.Task.d.protoData.taskDefinitionKey
                        });
                    }
                    context.enter(iD.modes.Browse(context));
                    context.flush();
                } else {
                    // 手动保存
                    return;
                }
            } else {
                context.enter(iD.modes.Browse(context));
                context.flush();
            }
            if (iD.Task.d) {
                iD.UserBehavior.logger({
                    type: 'click',
                    tag: 'task_switch',
                    task: d,
                    projectId: d.tags.projectId,
                    task_type: d.protoData.taskDefinitionKey,
                    task_last_type: d.tags.lastActivityId,
                    task_buss_codes: d.bussCodes,
                    filter: 'none',
                    action: iD.UserBehavior.getAction('', { type: 'click' })
                }, true);
            }
            iD.UserJobHeartbeat.switchTaskRequest(iD.Task.d, d);
            // 切换任务之前，若是有选中状态 的要素，切换后会报错；
            //      	context.enter(iD.modes.Browse(context));

            iD.Task.d = _.extend(d, {
                _index: i == null ? -1 : i
            });

            iD.Task.working = d;
            context.editArea(iD.Task.d.range);
            context.map().drawTansactionEntity();
            context.ui().sidebar.update(d);
            context.ui().markupform.reset();
            context.variable.firstInZoomLevel = context.map().zoom();

            // iD.BuriedStatistics().init();
            context.buriedStatistics().init();
            iD.UserBehavior.logger({
                type: 'click',
                tag: 'task_start',
                task: d,
                projectId: d.tags.projectId,
                task_type: d.protoData.taskDefinitionKey,
                task_last_type: d.tags.lastActivityId,
                task_buss_codes: d.bussCodes,
                filter: 'none',
                action: iD.UserBehavior.getAction('', { type: 'click' })
            }, true);

            $buttonList.select('button.nowtask').text(d.task_id);
            $buttonList.classed('open', false);

            if (context.variable.autoSaveTime) {
                window.clearInterval(context.variable.autoSaveTime);
            }
            context.localStorageClean();
            context.ply = null;
            context.measuringTrack = null;
            layerChange();

            context.variable.isOpenSaveDialog = false;
            context.variable.autoSaveTime = window.setInterval(context.autoSave, 900000);
            // 场景
            iD.util.taskUpdateScene(context);
            getTrackWhiteListStatus();

            if (iD.Task.isLocalTaskSys()) {
                // 允许范围外编辑
                context.transactionEditor(true);
                var s = d3.$("#KDSEditor-bar button.save");
                s.size() && s.style("visibility", "hidden");
                return;
            }
            iD.Task.dispatch.start(d);
        }
    }

    //切换任务时，查找当前任务下所有轨迹白名单状态
    function getTrackWhiteListStatus() {
        //http://192.168.2.105:33300/kts/task/queryTaskWhiteList/200005436
        context.variable.trackWhiteListStatus = {};
        if (iD.Task.isSdTask()) {
            return;
        }
        d3.json(iD.config.URL.kts + 'task/queryTaskWhiteList/' + iD.Task.d.task_id)
            .get(function (error, data) {
                if (error || !data || data.code != '0') {
                    Dialog.alert('请求轨迹白名单失败！');
                    return;
                }
                if (!data.result || !data.result.length) {
                    Dialog.alert('该任务查询轨迹白名单为空！');
                    return;
                }
                for (var i in data.result) {
                    var d = data.result[i];
                    context.variable.trackWhiteListStatus[d.trackId] = d.inWhiteList == "true" ? true : false;
                }
            });
    }

    function taskList(selection, contents) {
        var tag;

        // var tooltip = bootstrap.tooltip()
        //     .placement('bottom')
        //     .html(true)
        //     .title(function (d) {
        //         return iD.ui.tooltipHtml(d.annotation() ?
        //             t(d.id + '.tooltip', {action: d.annotation()}) :
        //             t(d.id + '.nothing'), d.cmd);
        //     });
        //
        // var buttons = selection.selectAll('button')
        //     .enter().append('button')
        //     .attr('class', 'KDSEditor-col6 disabled')
        //     .on('click', function (d) {
        //
        //     })
        //     .call(tooltip);
        //
        // buttons.append('div').classed('for-border', true).append('span')
        //     .attr('class', function (d) {
        //         return 'KDSEditor-icon ' + d.id;
        //     });

        // Single button
        // <div class="btn-group">
        //     <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //     Action <span class="caret"></span>
        //     </button>
        //     <ul class="dropdown-menu">
        //     <li><a href="#">Action</a></li>
        //     <li><a href="#">Another action</a></li>
        // <li><a href="#">Something else here</a></li>
        // <li role="separator" class="divider"></li>
        //     <li><a href="#">Separated link</a></li>
        // </ul>
        // </div>
        var button = selection.append('div')
            .attr('class', 'btn-group task-list');
        $buttonList = button;

        button.append('button')
            .attr('class', 'btn btn-default nowtask dropdown-toggle')
            .attr('data-toggle', 'dropdown')
            .attr('aria-expanded', 'false');

        button.select('button.nowtask').append('span').text('任务列表').attr('class', 'caret');

        button.append('button')
            .attr('class', 'btn btn-default task-receive')
            .text('领取')
            .style("width", '25%');
        button.append('button')
            .attr('class', 'btn btn-default task-refresh')
            .text('刷新')
            .style("width", '25%');
        if (iD.User.isTrackStandardRole() || iD.util.isLocateTrackPointUrl()) {
            button.select('button.task-receive').property('disabled', 'disabled');
        }

        button.select('button.nowtask').on('click', function () {
            selection.select('.btn-group').classed('open', !selection.select('.btn-group').classed('open'));
        });
        // 领取任务
        button.select('button.task-receive').on('click', function () {
            iD.UserBehavior.logger({
                type: 'click',
                tag: 'task_getlist'
            });
            iD.UserBehavior.logger({
                tag: 'task_getlist_start'
            });
            d3.json(iD.config.URL.kts + 'task/claim?user=' + iD.User.getInfo().username)
                .get(function (error, data) {

                    if (error || (data && data.code != '0')) {
                        iD.UserBehavior.logger({
                            tag: 'task_getlist_end',
                            status: data.code,
                            value: []
                        })
                        Dialog.alert(data && data.message || '领取任务失败。');
                        return;
                    }
                    //				window.location.reload();
                    iD.Task.refreshTaskData(function (tasks) {
                        iD.UserBehavior.logger({
                            tag: 'task_getlist_end',
                            status: '0',
                            value: tasks
                        })
                        update(tasks, button);
                        Dialog.sidebarAlert('领取任务成功。');
                    });
                });
        });
        // 刷新
        button.select('button.task-refresh').on('click', function () {
            // debugger
            iD.UserBehavior.logger({
                tag: 'task_refresh_start'
            })
            iD.Task.refreshTaskData(function (tasks) {
                iD.UserBehavior.logger({
                    tag: 'task_refresh_end',
                    status: '0',
                    value: tasks
                })
                update(tasks, button);
            });
        });

        var ul = button.append('ul')
            .attr('class', 'dropdown-menu')
            .attr('role', "menu")

        var table = ul.append('table').attr('class', 'task-table');
        // var tbody = table.append('tbody');

        iD.Task.on('afterget.task_list', function (data) {
            /*if(data[0]){
                data[0].tags.sceneCode = iD.data.sceneCode.HD_DATA_LO;
            }
            if(data[2]){
                data[2].tags.sceneCode = iD.data.sceneCode.HD_DATA_LO;
            }*/
            update(data, button);
        });

        // 加载任务列表；
        iD.Task.get();
    };

    taskList.enter = function (taskid) {
        var trs = d3.select('.task-list .dropdown-menu .task-table').selectAll('tr');
        var flag = false;
        trs.each(function (d) {
            if (flag) return false;
            var $tr = d3.select(this);
            if (d && taskid && d.task_id == taskid) {
                $tr.trigger("click");
                flag = true;
            }
        });
        return flag;
    }

    taskList.enterByTask = function (taskObj) {
        enterTask(taskObj);
        return;
    }

    return taskList;
}