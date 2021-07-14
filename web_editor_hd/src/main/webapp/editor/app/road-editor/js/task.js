/*
 * @Author: tao.w
 * @Date: 2019-08-26 15:19:12
 * @LastEditors: tao.w
 * @LastEditTime: 2021-06-28 16:43:47
 * @Description: 
 */
;;
(function (iD) {
    iD = iD || {};
    var TASK_STATUS = {
        CREATE: 1,
        ASSIGN: 5,
        EDIT: 10,
        CHECKING: 15,
        CHECKED: 20,
        SUBMITED: 25
    };

    var QC_TASK_STATUS = {
        CREATED: 0,
        UNDISPATCHED: 1,
        DISPATCHED: 5,
        STARTED: 10,
        END: 100
    };

    var defaultStatus = {
        'task': [TASK_STATUS.ASSIGN, TASK_STATUS.EDIT, TASK_STATUS.CHECKING, TASK_STATUS.CHECKED, TASK_STATUS.SUBMITED],
        'qc': [QC_TASK_STATUS.DISPATCHED, QC_TASK_STATUS.STARTED]
    };

    var paramsMap = {
        'task': {
            status: 'taskstatus',
            userid: 'userID',
            taskid: 'taskID',
            transid: 'transID'
        },
        'qc': {
            status: 'qc_status',
            userid: 'qc_userid',
            classes: 'task_classes',
            rate: 'qc_rate',
            taskid: 'task_id',
            transid: 'trans_id',
            id: 'qc_id',
            result: 'qc_result'
        }
    };

    //var baseurl = 'http://100.69.180.43:11080/gts/';

    function musesRequest(url, callback) {
        // 加载任务列表的请求
        var isReset = iD.url.getUrlParam('reset') == 'true';
        var urlTrackIds = iD.url.getUrlParam('trackIds') || '';
        request(url, function (data) {
            let tflag = true;
            if (data.error) {
                tflag = false;
            } else if (data.code != null && data.code != "0") {
                tflag = false;
            } else if (!data.result) {
                tflag = false;
            }
            if (!tflag) {
                callback && callback([]);
                return;
            }

            data.result.taskId = data.result.id;
            // _tids.push(data.result.taskID);
            var d = {
                tags: data.result
            }
            let rst = d;
            if (!d || !rst) return;
            var extendTags = {};
            if (isReset && urlTrackIds) {
                extendTags.trackIds = urlTrackIds;
            }

            if (d.tags.tags && d.tags.tags.hasOwnProperty('multiTrackFusionTaskId')) {
                d.tags.multiTrackFusionTaskId = d.tags.tags.multiTrackFusionTaskId;
            }

            var layers = [];
            let datas = rst.tags.datas || [];
            datas.forEach(function (d) {
                layers.push({
                    taskId: rst.tags.taskId,
                    dataVersion: '',
                    layer: d.dataType,
                    taskKey: d.dataKey,
                })
            })

            var temp = prase2TaskData(d, {
                basicTags: [],
                extendTags: extendTags,
                name: rst.tags.name || "",
                projectId: rst.tags.projectId,
                bussCodes: rst.bussCodes || [],
                layers
            });
            callback && callback([temp]);
        });
    }

    function historyRequest(url, callback) {
        var isReset = iD.url.getUrlParam('reset') == 'true';
        var urlTrackIds = iD.url.getUrlParam('trackIds') || '';
        var task_id = iD.url.getUrlParam("taskID");
        var history = iD.util.urlParamHistory();
        var tasks = [];
        // 加载任务列表的请求
        request(url, function (data) {
            let tflag = true;
            if (data.error) {
                tflag = false;
            } else if (data.code != null && data.code != "0") {
                tflag = false;
            } else if (!data.data) {
                tflag = false;
            }
            if (!tflag) {
                return;
            }
            // 防止多环节的同任务冲突
            if (history && task_id) {
                data.data = data.data.length && data.data.splice(0, 1) || [];
            }
            let _tids = [];
            data.data.forEach(function (d) {
                d.variables = d.variables || [];
                d.tags = {};
                for (var i in d.variables) {
                    var item = d.variables[i];
                    if (item.name) {
                        d.tags[item.name] = item.value || "";
                    }
                }
                d.tags.taskId && _tids.push(d.tags.taskId);
            });
            let _kvUrl = iD.config.URL.kts + 'task/findByIds';
            request({
                url: _kvUrl,
                type: 'post',
                param: {
                    ids: _tids.join(',')
                }
            }, function (res) {
                let kvResult = res.result || {};
                // 	                data.data.forEach(function(d) {
                // 	                	let rst = kvResult[d.tags.taskId];
                // 	                	if(!rst) return ;
                //                 		rst.tags.forEach(function(tag){
                //                 			d.tags[tag.k] = tag.v;
                //                         });
                //                         // 再作业任务，会有编译项目id
                //                         if(d.tags.reEditType == '2' && d.tags.projectId){
                //                             d.tags.compileProjectId = d.tags.projectId;
                //                         }
                //                         d.tags.projectId = rst.projectId;
                // //	                	d.range = d.tags.range || "";
                // //	                	d.bounds = d.tags.bounds || "";

                // 	                	if(isReset && urlTrackIds){
                // 	                		d.tags.trackIds = urlTrackIds;
                // 	                	}
                // 	                	// 融合角色可以没有transId
                // 	                    let bounds =d.tags.bounds || ""
                // 	                    	, range = d.tags.range || '';
                // 	                    if(range){
                // 	                    	range = wkx.Geometry.parse(range).toGeoJSON();
                // 	                    }
                // 	                    if(bounds){
                // 	                        bounds= bounds.split(',');
                // 	                        bounds = [[+bounds[0],+bounds[1]],[+bounds[2],+bounds[3]]];
                // 						}
                // 	                    // 会有多余逗号的问题；
                // 	                    if(d.tags.trackIds){
                // 	                    	d.tags.trackIds = _.compact(_.uniq(d.tags.trackIds.split(','))).join(',');
                // 	                    }
                // 	                    if(d.tags.multiSourceBatchs){
                // 	                    	d.tags.multiSourceBatchs = _.compact(d.tags.multiSourceBatchs.split(',')).join(',');
                // 	                    }
                // 	                    if(d.tags.multiSourceDbCodes){
                // 	                    	d.tags.multiSourceDbCodes = _.compact(d.tags.multiSourceDbCodes.split(',')).join(',');
                // 	                    }
                // 	                    var temp = {
                // 	                    	chk_status: 0,
                // 							task_status: 1,
                // 							range: range,
                // 							bounds: bounds,
                // 	//						task_id:d.id,
                // 							task_id: parseInt(d.tags.taskId),
                // 	//						cli_desc: d.name,
                // 							cli_desc: rst.name || "",
                // 							task_classes:1,
                // 							basic_data_type: "",
                // 	                        tags: d.tags,
                //                             protoData: d,
                //                             bussCodes: rst.bussCodes || d.bussCodes || [],
                //                             // 只有重跑任务才会出现dataVerseion不一致的情况，否则全是同一版本
                //                             // 组网没有重跑的数据可以直接使用任意dataVersion
                //                             layers: rst.layers || []
                // 						};
                //                         tasks.push(temp);
                // 	                });
                data.data.forEach(function (d) {
                    let rst = kvResult[d.tags.taskId];
                    if (!d || !rst) return;
                    var extendTags = {};
                    if (isReset && urlTrackIds) {
                        extendTags.trackIds = urlTrackIds;
                    }
                    var temp = prase2TaskData(d, {
                        basicTags: rst.tags,
                        extendTags: extendTags,
                        name: rst.name || "",
                        featureGroups: rst.featureGroups || [],
                        projectId: rst.projectId,
                        taskType: rst.type,
                        bussCodes: rst.bussCodes || d.bussCodes || [],
                        layers: rst.layers || []
                    });
                    tasks.push(temp);
                });
                /*
                var warning = [];
                var editing = [];
                var normal = [];
                tasks.forEach(function(task) {
                	if (task.chk_status) {
                		warning.push(task);
                	} else if (task.task_status > TASK_STATUS.ASSIGN) {
                		editing.push(task);
                	} else {
                		normal.push(task);
                	}
                });
                */
                callback && callback(tasks);
            });
        });
    }

    var request = function (url, callback, opts = {}) {
        var message = opts.message || '正在发送请求';
        var toLoading = opts.hasOwnProperty('loading') ? opts.loading : true;
        var loading;
        var error2Call = opts.error2Call || false;
        var showError = opts.hasOwnProperty('showError') ? opts.showError : true;

        if (toLoading) {
            loading = iD.ui.Loading(iD.User.context)
                .message(message)
                .blocking(true);
            iD.User.context.container()
                .call(loading);
        }
        var d = url,
            bodyParam;
        if (_.isObject(d)) {
            url = d.url;
            if (d.bodyParam) {
                bodyParam = d.bodyParam;
            }
        }
        if (_.isObject(bodyParam)) {
            return d3.json(url)
                .header("Content-Type", "application/json;charset=UTF-8")
                .post(JSON.stringify(bodyParam), function (error, data) {
                    loading && loading.close();
                    if (error) {
                        showError && Dialog.alert('任务平台服务无响应，请重试');
                        error2Call && callback();
                        return;
                    }
                    callback(data);
                });
        }
        if ((d.type + '').toLowerCase() == 'post') {
            return d3.json(url)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .post(_.map(d.param, function (v, k) {
                    return k + '=' + (v || '');
                }).join('&'), function (error, data) {
                    loading && loading.close();
                    if (error) {
                        showError && Dialog.alert('任务平台服务无响应，请重试');
                        error2Call && callback();
                        return;
                    }
                    callback(data);
                });
        }

        return d3.json(url, function (error, data) {
            loading && loading.close();
            if (error) {
                showError && Dialog.alert('任务平台服务无响应，请重试');
                error2Call && callback();
                return;
            }

            // if (data.status != 0) {
            //    Dialog.alert(data.desc);
            // 	iD.util.cookie.removeItem('token');
            // 	location.reload();
            // 	return;
            // }

            callback(data);
        });
    };

    var makeRequestUrl = function (type, path, params) {
        if (!iD.User.getInfo()) {
            Dialog.alert('not login');
            return;
        }
        var map = paramsMap[type] || 'task';
        var url = iD.config.URL.kts + 'task/queryforTypeAndUser/' + type + '/' + path + '?';
        var arr = [];
        if (!params['userid']) {
            params['userid'] = iD.User.getInfo().userid;
        }
        for (var param in params) {
            var key = map[param];
            if (key) {
                arr.push(key + '=' + params[param]);
            }
        }
        //console.log(url + arr.join('&'));
        return url + arr.join('&');
    }

    var query_mark_xhr;
    var MARK_TASK_LIST = {};

    function querySubTaskList(d, callback) {
        query_mark_xhr && query_mark_xhr.abort();
        query_mark_xhr = null;
        callback = callback || function () {};

        if (!d || !d.bussCodes || !d.bussCodes.includes('fusion')) {
            callback();
            return;
        }
        let taskid = d.task_id;
        if (MARK_TASK_LIST[taskid]) {
            callback(MARK_TASK_LIST[taskid]);
            return;
        }
        query_mark_xhr = getSubTaskIdList(taskid, function (data) {
            if (!data) {
                callback([]);
                return;
            }
            let _tids = data.taskIds;
            let markings = data.markings;
            query_mark_xhr && query_mark_xhr.abort();
            query_mark_xhr = request({
                url: iD.config.URL.kts + 'task/findByIds',
                type: 'post',
                param: {
                    ids: _tids.join(',')
                }
            }, function (res) {
                let kvResult = res.result || {};
                let tasks = [];
                // let result = {};
                _.map(kvResult, function (d, did) {
                    let _d = prase2TaskData(d);
                    if (_d) {
                        _d.fromLinearFusion = true;
                        _d.fromFusionTaskId = taskid;
                        let _idx = _tids.indexOf(did + '')
                        let marking = markings[_idx];
                        _d.marking = marking;
                        // result[did] = _d;
                        tasks.push(_d);
                    }
                });
                MARK_TASK_LIST[taskid] = tasks;
                if (!tasks.length) {
                    callback(tasks);
                    return;
                }
                callback(tasks);
            }, {
                loading: false,
                error2Call: true,
                showError: false
            });
        });
    }

    function getSubTaskList(taskid) {
        return MARK_TASK_LIST[taskid] || [];
    }

    function getSubTaskIdList(taskid, callback) {
        return request(iD.config.URL.kts + 'task/queryTrackMarking?fusionTaskId=' + taskid, function (data) {
            if (!data || data.code != '0') {
                callback && callback();
                return;
            }
            let _tids = _.pluck(data.result || [], 'taskId').map(v => v + '');
            let markings = _.pluck(data.result || [], 'marking');
            callback && callback({
                taskIds: _tids,
                markings: markings
            });
        }, {
            loading: false,
            error2Call: true,
            showError: false
        });
    }

    function prase2TaskData(d, opts) {
        if (!d || !d.tags) return;
        opts = Object.assign({
            basicTags: null,
            extendTags: null,
            taskType: null,
            name: null,
            bussCodes: null,
            layers: null
        }, opts);
        var tagList = opts.basicTags || d.tags || [];
        var newTags = {};
        if (_.isArray(tagList)) {
            tagList.forEach(function (tag) {
                newTags[tag.k] = tag.v;
            });
        } else {
            newTags = _.clone(tagList);
        }
        d.tags = Object.assign(d.tags, newTags);
        opts.extendTags && Object.assign(d.tags, opts.extendTags);

        // 再作业任务，会有编译项目id
        if (d.tags.reEditType == '2' && d.tags.projectId) {
            d.tags.compileProjectId = d.tags.projectId;
        }
        d.tags.projectId = opts.projectId || d.projectId;

        // d.range = d.tags.range || "";
        // d.bounds = d.tags.bounds || "";
        // 使用URL指定轨迹
        var isReset = iD.url.getUrlParam('reset') == 'true';
        var urlTrackIds = iD.url.getUrlParam('trackIds') || '';

        if (isReset && urlTrackIds) {
            d.tags.trackIds = urlTrackIds;
        }
        // 融合角色可以没有transId
        let bounds = d.tags.bounds || "",
            _range = d.tags.range || '';
        // range = 'MULTIPOLYGON(((116.52127634 39.96182243,116.52159925 39.96178566,116.52169019 39.96156869,116.52137928 39.96151762,116.52127634 39.96182243)),((116.52142535 39.96140551,116.52173882 39.96145302,116.52184149 39.96120895,116.52152677 39.96115636,116.52142535 39.96140551)))';
        // range = 'MULTIPOLYGON(((116.34006611 39.82985326,116.34004839 39.8295869,116.34090661 39.82958852,116.34084733 39.8298958,116.34006611 39.82985326)),((116.33935214 39.83055658,116.33926908 39.8299615,116.33996889 39.82994158,116.33996796 39.83055646,116.33935214 39.83055658)))';
        // let _range = d.tags.range;
        // d.tags.range = range;
        // d.tags.materialRange = range;
        // _range = range;

        if (_range) {
            let holes = iD.util.parsePolyStrings(_range);
            _range = wkx.Geometry.parse(_range).toGeoJSON();
            _range.coordinates = holes;
        }
        if (bounds) {
            bounds = bounds.split(',');
            bounds = [
                [+bounds[0], +bounds[1]],
                [+bounds[2], +bounds[3]]
            ];
        }
        // 会有多余逗号的问题；
        if (d.tags.trackIds && typeof (d.tags.trackIds) == 'string') {
            d.tags.trackIds = _.compact(_.uniq(d.tags.trackIds.split(','))).join(',');
        }
        if (iD.Task.isLocalTaskSys()) {
            d.tags.lidarReprojectFlag = urlTrackIds.split(',').map(() => 'true').join(',');
        }
        if (d.tags.multiSourceBatchs) {
            d.tags.multiSourceBatchs = _.compact(d.tags.multiSourceBatchs.split(',')).join(',');
        }
        if (d.tags.multiSourceDbCodes) {
            d.tags.multiSourceDbCodes = _.compact(d.tags.multiSourceDbCodes.split(',')).join(',');
        }
        if (!d.tags.hasOwnProperty('kieVersion')) {
            d.tags.kieVersion = 'empty';
        }
        // d.tags.kieVersion = 'v1.7.0';
        // d.tags.trackIds = "204418964_20190815112225968,204418964_20190815112418435";
        // if( !d.tags.utm || !d.tags.utm.zone ){
        // 	d.tags.utm = {zone: null};
        // }
        if (d.tags.hasOwnProperty('utm')) {
            let tempObj = null;
            try {
                tempObj = JSON.parse(d.tags.utm);
            } catch (e) {
                console.log(e)
            } finally {
                if (!tempObj || !tempObj.zone || isNaN(tempObj.zone)) {
                    d.tags.utm = {
                        zone: null
                    };
                } else {
                    tempObj.zone = Number(tempObj.zone);
                    d.tags.utm = tempObj;
                }
            }
        } else {
            d.tags.utm = {
                zone: null
            };
        }

        var featureGroup = null;
        if (opts.hasOwnProperty('featureGroups') && opts.featureGroups.length) {
            featureGroup = opts.featureGroups.find(feature => {
                return feature.linkId == d.taskDefinitionKey;
            })
        }


        var temp = {
            chk_status: 0,
            task_status: 1,
            range: _range,
            bounds: bounds,
            task_id: parseInt(d.tags.taskId),
            cli_desc: opts.name || d.name || "",
            task_classes: 1,
            featureGroups: opts.featureGroups,
            featureGroup:featureGroup,
            basic_data_type: "",
            tags: d.tags,
            protoData: d,
            taskType: opts.taskType,
            bussCodes: opts.bussCodes || d.bussCodes || [],
            // 只有重跑任务才会出现dataVerseion不一致的情况，否则全是同一版本
            // 组网没有重跑的数据可以直接使用任意dataVersion
            layers: opts.layers || d.layers || []
        };

        return temp;
    }

    var dispatch = d3.dispatch('start', 'afterget', 'restore', 'finish');
    var currentDetail;
    iD.Task = {
        tasks: [],
        dispatch: dispatch,
        _type: 'work',
        TASK_STATUS: TASK_STATUS,
        QC_TASK_STATUS: QC_TASK_STATUS,
        isLocalTaskSys: function () {
            return window._systemType == -1;
        },

        querySubTaskList: querySubTaskList,
        getSubTaskList: getSubTaskList,
        getSubTaskIdList: getSubTaskIdList,
        /**
         * 是否为二维路网任务
         */
        isSdTask: function (task) {
            var d = task || iD.Task.d;
            if (!d) return false;
            return d.tags.isSdTask == 'true';
        },
        clearSubTaskList: function () {
            // 清空子任务缓存
            MARK_TASK_LIST = {};
        },
        setType: function (type) {
            this._type = type;
            //this.baseurl = baseurl + type + '/';
        },
        dbCode: function (batch) {
            var result = '';
            if (batch) {
                // 有batch，没dbCode
                result = iD.config.batchDbCode[batch] || "fusion";
            }
            // 20180328 旧流程数据都是存在fusion中 
            return result || (iD.Task.d && iD.Task.d.tags.dbCode) || "fusion";
        },
        taskId: function (batch) {
            var btaskid = '';
            if (batch) {
                btaskid = batch.split(/[-_]/)[0];
            }
            var taskid = iD.Task.d && (iD.Task.d.task_id || iD.Task.d.tags.taskId);
            return btaskid || taskid || "";
        },
        /**
         * 获取刷pos的参数；
         */
        getPosParam: function () {
            var data = {};
            // 标定(systemType=7)时roll、pitch、azimuth是false，xyz是false
            // 标定(systemType=8)时roll、pitch、azimuth(dynamicCal)是true，xyz(offsetCal)是false
            // 自动化、融合时，roll、pitch、azimuth是true，xyz为getOffsetCalStatus去判断
            if (iD.User.isTrackHeightRole()) {
                data.dynamicCal = true;
                data.offsetCal = false;
            } else if (iD.User.isTrackStandardRole()) {
                data.dynamicCal = false;
                data.offsetCal = false;
            } else {
                data.dynamicCal = true;
                data.offsetCal = iD.util.getOffsetCalStatus();
            }
            return data;
        },
        getOne: function (index) {
            return this.tasks[index];
        },
        removeOne: function (index) {
            this.tasks.splice(index, 1);
        },
        // 批次
        editBatchs: function () {
            return _.difference(iD.config.taskBatch, this.sourceBatchs(), this.compareBatchs(), this.sourceFusionBatchs());
        },
        sourceBatchs: function () {
            var batch = iD.Task.d && iD.Task.d.tags.multiSourceBatchs;
            if (batch) return batch.split(',');
            return [];
        },
        compareBatchs: function () {
            var compareBatch = iD.Task.d && iD.Task.d.tags.compareBatch;
            let comparatives = iD.Task.d && iD.Task.d.tags.comparativeLibrarykeys;
            let batch = '';
            if (comparatives) {
                batch = comparatives;
            }

            if (compareBatch) {
                batch += compareBatch
            }
            return batch.split(',');
        },

        sourceFusionBatchs: function () {
            return iD.Task.d && iD.Task.d.sourceFusionBatchs;
        },
        // 获取任务列表的data
        get: function (status, callback) {
            if (typeof status === 'function') {
                callback = status;
                status = defaultStatus[this._type].join(',')
            }
            var self = this;
            self.getTaskDataList(function (tasks) {
                self.tasks = tasks;
                dispatch.afterget(tasks);
                callback && callback(tasks);
            });
        },
        refreshTaskData: function (callback) {
            var self = this;
            var taskList = [];
            MARK_TASK_LIST = {};
            // 不保留旧任务
            // var oldTask = iD.Task.d;
            // oldTask && taskList.push(oldTask);
            self.getTaskDataList(function (tasks) {
                // taskList.push(...tasks.filter(d => !oldTask || d.task_id != oldTask.task_id));
                taskList = tasks;
                self.tasks = taskList;
                callback && callback(self.tasks);
            });
        },
        getTaskDataList: function (callback) {
            // var self = this;
            // if(iD.User.isTrackControlPointRole()){
            //     callback([]);
            //     return ;
            // }
            var tasks = [];
            if (this.isLocalTaskSys()) {
                let tid = iD.url.getUrlParam('taskID') || -1;
                tasks.push(prase2TaskData({
                    tags: {
                        taskId: tid,
                        projectId: '',
                        currentActivity: '',
                        trackIds: iD.url.getUrlParam('trackIds')
                    }
                }, {
                    name: "ID: " + tid,
                    projectId: '',
                    bussCodes: [],
                    layers: [{
                        dataVersion: 1,
                        layer: "lane",
                        taskId: tid,
                        taskKey: "lane_" + tid + "_1"
                    }]
                }));

                callback && callback(tasks);
                return;
            }
            var username = iD.User.getInfo().username;
            var param = {
                includeProcessVariables: true,
                size: 100,
                sort: "createTime",
                order: "desc",
                assignee: username
            };
            // 使用URL指定轨迹
            var url;
            if (iD.User.isTrackStandardRole()) {
                delete param.assignee;
                var userType = iD.url.getUrlParam("user_type");
                var keyLike = "";
                if (window._systemType == 8) {
                    keyLike = 'SetCameraHeight';
                } else if (window._systemType == 7) {
                    keyLike = "SetTrackParameters";
                } else if (window._systemType == 9) {
                    keyLike = "";
                }
                var userTypeKeyName;
                //	            if (history) {
                //	                userTypeKeyName = "taskAssignee";
                //	            }
                userTypeKeyName = "assignee";
                if (userType == "1") {
                    userTypeKeyName = "assignee";
                } else if (userType == "2") {
                    userTypeKeyName = "involvedUser";
                }
                param[userTypeKeyName] = username;
                if (keyLike) {
                    param.taskDefinitionKey = keyLike;
                }
                //	            if (history) {
                //	                url = iD.config.URL.kts + 'history/historic-task-instances?' + iD.util.parseParam2String(param);
                //	            }
                url = iD.config.URL.kts + 'runtime/tasks?' + iD.util.parseParam2String(param);
            } else {
                url = iD.config.URL.kts + 'runtime/tasks?' + iD.util.parseParam2String(param);
            }

            var history = iD.util.urlParamHistory();
            var task_id = iD.url.getUrlParam("taskID");
            if (history) {
                // 查询某一环节，重跑的话环节可能有多个
                // var url = iD.config.URL.kts+'history/historic-task-instances?includeProcessVariables=true&processBusinessKey=9402
                // 查询整个流程（任务）
                // var url = iD.config.URL.kts+'history/historic-process-instances?includeProcessVariables=true';
                // if(task_id){
                // 	url += '&businessKey=' +task_id;
                // }
                let addr = iD.config.URL.kts_muses + 'muses/task/detail?id=';
                if (task_id) {
                    addr += task_id;
                }
                url = {
                    'url': addr,
                    type: 'get'
                };

                musesRequest(url, function (_tasks) {
                    if (_tasks.length) {
                        callback && callback(_tasks);
                    } else {
                        var url = iD.config.URL.kts + 'history/historic-process-instances?includeProcessVariables=true';
                        if (task_id) {
                            url += '&businessKey=' + task_id;
                        }
                        historyRequest(url, callback);
                    }
                });
            }
            if (iD.util.isLocateTrackPointUrl()) {
                // 不限制用户和流程
                var url = iD.config.URL.kts + 'history/historic-process-instances?includeProcessVariables=true';
                if (task_id) {
                    url += '&businessKey=' + task_id;
                }
            }

            historyRequest(url, callback);
        },

        start: function (task_id, trans_id, callback) {
            if (this._type === 'qc') {
                return;
            }
            console.log('task start');
            var self = this;

            var url = makeRequestUrl(this._type, 'open.do', {
                taskid: task_id,
                transid: trans_id
            });
            request(url, function (data) {
                self.tasks.forEach(function (ele, index) {
                    if (ele.task_id == task_id) {
                        self.tasks[index].task_status = data.task_status;
                    }
                });
                callback && callback(data);
            }, {
                message: '正在开始任务'
            });
        },
        // checkout: function(callback) {
        // 	var _self = this;
        // 	var params = {};
        // 	params.classes = iD.User.getRole().classes;
        // 	var url = makeRequestUrl(this._type, 'get.do', params);
        // 	request(url, function(data) {
        // 		_self.tasks = _self.tasks.concat(data.data || []);
        // 		callback && callback(data);
        // 	}, '正在领取任务');
        // },
        submit: function (params, callback) {
            var self = this;
            var url = makeRequestUrl(this._type, 'submit.do', params);
            request(url, function (data) {
                self.tasks.forEach(function (ele, index) {
                    if (ele.task_id == params.taskid) {
                        self.tasks[index].task_status = TASK_STATUS.SUBMITED;
                    }
                });
                callback && callback(data);
            }, {
                message: '正在提交任务'
            });
        },
        order: function () {
            var currentEditTask = this.working;
            if (!currentEditTask) {
                return;
            }
            var index = _.findIndex(this.tasks, function (task) {
                return task.task_id === currentEditTask.task_id;
            });
            if (index > 0) {
                var temp = this.tasks.splice(index, 1);
                delete temp._index;
                this.d._index = 0;
                this.tasks.unshift(temp[0]);
            }
        }
    }

    // 任务环节
    var TASK_DEFINED = {
        // 线形编辑
        LINEAR_WORK: 'LinearWork',
        LINEAR_CHECK: 'LinearCheck'
    };

    function isTaskDefined(type) {
        if (!iD.Task.d || !iD.Task.d.protoData || !type) return;
        return iD.Task.d.protoData.taskDefinitionKey == type;
    }

    Object.assign(iD.Task, {
        // 任务环节是否为 线形编辑
        definedLinearWork: function () {
            return isTaskDefined(TASK_DEFINED.LINEAR_WORK);
        },
        definedLinearCheck: function () {
            return isTaskDefined(TASK_DEFINED.LINEAR_CHECK);
        },
        //		isHistoryAndAuto: function(){
        // 取消没有测量信息的操作；
        // 地图车道线拖拽、路口虚拟车道线、地图绘制、打断车道组；
        hideNoMeasureOperate: function () {
            if (!iD.Task.d) return true;
            // 自动化时，线形作业环节；
            // 历史任务时，自动化流程；
            return this.definedLinearWork() || (iD.util.urlParamHistory() && iD.Task.d.tags.dbCode == 'auto');
        },
        // 当前整个流程为 线形作业（融合）
        isLinearFusion: function () {
            let d = iD.Task.d;
            let fusionKey = 'linearFusion';
            if (!d || !d.bussCodes || !d.bussCodes.includes(fusionKey)) {
                return false;
            }
            return true;
        },
        isLinearFusionAuto: function () {
            let d = iD.Task.d;
            return d && d.fromLinearFusion;
        }
    });


    Object.defineProperty(iD.Task, 'working', {
        get: function () {
            return currentDetail;
        },
        set: function (value) {
            currentDetail = value;
            try {
                localStorage.setItem('d', JSON.stringify(value));
            } catch (e) {

            }
        }
    });
    iD.User.on('login.task', function () {
        var role = iD.User.getRole().role;
        //var type = role === 'work' ? 'task' : 'qc';
        var type = role === 'check' ? 'qc' : 'task';
        iD.Task.setType(type);
    });

    d3.rebind(iD.Task, dispatch, 'on');

    iD.Task.on("finish.autoCheck", function (task_id) {

        iD.Task.tasks.forEach(function (d) {
            if (d.task_id == task_id)
                d.chk_status = 0;
        });

    });
})(iD);