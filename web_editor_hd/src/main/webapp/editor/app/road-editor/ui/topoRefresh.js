/*
 * @Author: tao.w
 * @Date: 2021-04-17 14:58:04
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-01 11:56:06
 * @Description: 
 */
iD.ui.topoRefresh = function (context) {
    let toggleType = false;
    let btns = [
        { 'name': '全要素-拓扑', 'value': '1', 'process': 'SubTotalFactorWork' },
        { 'name': '形状修改', 'value': '2', 'process': 'SubTotalFactorWork' },
        { 'name': '自相交', 'value': '3', 'process': 'SubTotalFactorWork' },
        // { 'name': '直打断', 'value': '5', 'process': 'autoTopologyWork' },
        { 'name': 'barrier打断', 'value': '6', 'process': 'SubTotalFactorWork' },
        { 'name': '应急车道打断', 'value': '7', 'process': 'SubTotalFactorWork' },
        { 'name': '车道组合并', 'value': '8', 'process': 'SubTotalFactorWork' }
        // ,{ 'name': '重新分组', 'value': '4' }
    ];
	let mouseDrawStatus = {
		"3": 0, 
		"6": 1, 
		"7": 2
	};
    let _status = false;
    // let _drawOverlay = null;

    function saveData() {
        return new Promise((resolve, reject) => {
            function save(e) {
                resolve(true);
            }
            function saveError(e) {
                resolve(false);
            }
            context.enter(iD.modes.Save(context, t('save.title'), save, saveError));
        })
    }
    function getIntersectRelation(locs) {
        let ext = iD.geo.Extent();
        locs.forEach(d => {
            ext = ext.extend(d);
        })

        let entities = context.intersects(ext);
        let graph = context.graph();
        let dividers = entities.filter(d => {
            return d.modelName == iD.data.DataType.DIVIDER;
        })
        let _r = null;
        for (let i = 0; i < dividers.length; i++) {
            let divider = dividers[i];
            let nodeLocs = _.pluck(graph.childNodes(divider), 'loc');
            let _locs = iD.util.getSegmentIntersectLoc(nodeLocs, locs);
            if (_locs.length) {
                _r = graph.parentRelations(divider, iD.data.DataType.R_DIVIDER_DREF);
                if (_r.length) return _r[0];
            }
        }
        return false;
    }
    function _save(_tag) {
        let task_id = iD.Task.d.task_id;
        let param = {
            "taskId": "" + task_id,
            "isCheck": false,
            'tags': _tag,
            "activityId": "topo_relation_rebuild"
        };
        request({
            url: iD.config.URL.kts + 'dispatch/job/start',
            bodyParam: param
        }, function (data) {
            // 存在null的情况，除了code有值并且不等于0，都认为成功；
            if (data && data.code != '0') {
                Dialog.alert(data.message || '');
                return;
            }
            goNextTask();
        }, function (xhr) {
            // 超时以外都认为成功
            if (xhr && xhr.errorType != 'timeout') {
                goNextTask();
            }
        });
    }
    //自相交逻辑处理
    function mouseDraw(e) {
        let locs = [];
		
        if ( mouseDrawStatus.hasOwnProperty(_status) && e && e.overlay && e.overlay.mode == 'polyline' && e.overlay.nodes.length >= 2) {
            console.log('mouseDraw', e);
            _drawOverlay = e.overlay;
            locs = _.pluck(_drawOverlay.nodes, 'loc');
            let r = getIntersectRelation(locs);
            context.map().removeOverlays(_drawOverlay);
            if (r) {
                let x1 = locs[0].join(',');
                let x2 = _.last(locs).join(',');
                let id = iD.Entity.id.toOSM(r.id);
                let _o =  {
                    "break_infos": [
                        {
                            "r_div_dref_id": id,
							"break_type": mouseDrawStatus[_status],
                            "poses": [
                                {
                                    "pos1": x1,
                                    "pos2": x2
                                }
                            ]
                        }
                    ]
                }
                let _tag = {
                    "engineCode": "topo_relation_rebuild",
                    "materialCode": "total_factor_compile",
                };
                _tag.service_function = '1';
                _tag.service_param = JSON.stringify(_o);
               
                //  `pos1=${x1}&pos2=${x2}&r_div_dref_id=${id}`;
                _save(_tag);
            } else {
                Dialog.alert('没有车道分组');
            }
        }

        _status = false;
    }

    //自相交逻辑处理
    // function drawing(e) {
    //     if (e && e.overlay && e.overlay.mode == 'polyline' && e.overlay.nodes.length == 2) {
    //         console.log('drawing2', e);
    //         _status = false;
    //     }
    // }

    //重新分组执行操作
    function _selected(ids) {
		
        if (_status == '8' && (ids.length > 1)) {
			var entities = ids.filter(d=>{return d.modelName == "DIVIDER"});
			if(entities.length != 2){
				Dialog.alert('请选择两个临近车道组：当前选择' + entities.length + '个');
				return;
			}
			var id1, id2;
			
			var r1 = context.graph().parentRelations(entities[0], iD.data.DataType.R_DIVIDER_DREF);
			var r2 = context.graph().parentRelations(entities[1], iD.data.DataType.R_DIVIDER_DREF);
			if( r1.length && r2.length && (r1[0].id != r2[0].id) ){
				var start1 = entities[0].nodes[0],
					end1 = entities[0].nodes[ entities[0].nodes.length - 1 ],
					start2 = entities[1].nodes[0],
					end2 = entities[1].nodes[ entities[1].nodes.length - 1 ];
				
				if(start1 == end2){			//r1入口--首端；r2出口--尾端；
					id1 = r1[0].id;
					id2 = r2[0].id;
				}else if(start2 == end1){	//r1出口--尾端；r2入口--首端；
					id1 = r2[0].id;
					id2 = r1[0].id;
				}
			}
			
			if(id1 && id2){
				let from_id = iD.Entity.id.toOSM(id2);
				let to_id = iD.Entity.id.toOSM(id1);
				let _o =  {
					"merge_infos": [
						{
							"from_r_div_dref": from_id,
							"to_r_div_dref": to_id,
						},
					]
				}
				let _tag = {
					"engineCode": "topo_relation_rebuild",
					"materialCode": "total_factor_compile",
				};
				_tag.service_function = '4';
				_tag.service_param = JSON.stringify(_o);
				
				_status = false;
				_save(_tag);
			}else{
				Dialog.alert('请选择两个临近车道组！请查看控制台具体信息！');
				console.log(
					'车道组1：      ', r1,'车道组2：      ', r2
				)
				return;
			}
			
			
        }
		
		return
        if (_status == '4' && (entity && entity.modelName == iD.data.DataType.DIVIDER_NODE)) {
			
        }
		
        _status = false;
        console.log(entity);
    }

    //形状修改
    // async function _reverse(e) {
    //     // if (_status == '2' && e) {
    //     submitSave(_status);
    //     // }
    //     // goNextTask();
    //     consoel.log('reverse', e)
    // }

    async function submitSave(type) {
        if (!['2','5', '4'].includes(type)) return false;
        let _status = true;
        let isSaving = false;
        if (context.history().hasChanges()) {
            isSaving = true;
            _status = await saveData();
        }
        let _tag = {
            "engineCode": "topo_relation_rebuild",
            "materialCode": "total_factor_compile",
        }
        if (type === '2' && isSaving) {
            // "engineCode": "topo_relation_rebuild",
            // "materialCode": "total_factor_compile",

            _tag.service_function = '0';
            _tag.service_param = "";
            _save(_tag);
            return true;
        } else if (type === '4') {

        }else if (type === '5') {
            _tag.service_function = '3';
            _tag.service_param = "";
            _save(_tag);
            return true;
        }


        if (!_status) return false;

    }

    // function enterChange() {
    //     console.log('enterChange');
    //     if (!_status) _status = false;
    // }

    function initEvent() {
        context.event.on('draw', mouseDraw);
        // context.event.on('drawing', drawing);
        context.event.on('selected.topoRefresh', _selected);
        // context.event.on('full_featureEvent.topoRefresh', _reverse);
        // context.on('enter.topoRefresh', enterChange);

        // context.event.draw({overlay : marker, mode : mode});
    }
    var topoRefreshBtn = function () {
        initEvent();
        let $topoRefresh = d3.select('#topoRefresh')
            .on('mouseleave', function (e) {
                toggleType = false;
                toggleBtnClass();
            });
		
		topoRefreshBtn.htmlInit($topoRefresh);

    };
	
	
	topoRefreshBtn.htmlInit = function ($topoRefresh) {
		
		$topoRefresh.html('');
		
		if(!iD.Task.d || !iD.Task.d.tags){
			$topoRefresh.style('display', 'none');
			return;
		}
		
        let currentActivity = iD.Task.d.protoData.taskDefinitionKey || "";
		
		let currentBtns = btns.filter(d=>{ return d.process == currentActivity });
		
		if(!currentBtns.length){
			$topoRefresh.style('display', 'none');
			return;
		}else{
			$topoRefresh.style('display', 'block');
		}
		
		let firstBtn = currentBtns[0];
		let surplusBtn = currentBtns.slice(1);
        var buttons = $topoRefresh.append('button').attr({
				'title': firstBtn.name,
				'name': firstBtn.value,
			})
            .text(firstBtn.name)
            .on('click', function () {
				otherDialog(this.name);
            });

		var ul = $topoRefresh.append('ul')
			.attr('class', 'topo-refresh-menu')

		surplusBtn.forEach(d => {
			ul.append('li').append('button')
				.attr('name', d.value)
				.text(d.name)
				.on('click', function () {
					otherDialog(this.name);
				});
		})

		var $toggle = $topoRefresh.append('span').attr({
				'class': 'refresh-toggle-top'
			})
			.text('‹')
			.on('click', function () {
				toggleType = !toggleType;
				toggleBtnClass();
			})
			.on('mouseenter', function (e) {
				toggleType = true;
				toggleBtnClass();
			});
	}

    topoRefreshBtn.showBtn = function () {
        let $topoRefresh = d3.select('#topoRefresh');
		topoRefreshBtn.htmlInit($topoRefresh);
    }

    /* 切换隐藏显示按钮组的状态 */
    function toggleBtnClass() {
        let _display = toggleType ? 'block' : 'none',
            _class = toggleType ? 'refresh-toggle-bottom' : 'refresh-toggle-top',
            $menu = d3.select('.topo-refresh-menu'),
            $toggle = d3.select('#topoRefresh span');

        $menu.style('display', _display);
        $toggle.attr('class', _class);
    }

    /* 全要素拓扑执行 */
    function showTopoRefreshDialog() {
        if (!iD.Task.d) return;
        var task_id = iD.Task.d.task_id;
        Dialog.confirm(`
			<span>是否调用全要素-拓扑？</span>
		`, function () {
            let param = {
                "taskId": "" + task_id,
                "isCheck": false,
                "activityId": "topoRefresh"
            };
            request({
                url: iD.config.URL.kts + 'dispatch/job/start',
                bodyParam: param
            }, function (data) {
                // 存在null的情况，除了code有值并且不等于0，都认为成功；
                if (data && data.code != '0') {
                    Dialog.alert(data.message || '');
                    return;
                }
                goNextTask();
            }, function (xhr) {
                // 超时以外都认为成功
                if (xhr && xhr.errorType != 'timeout') {
                    goNextTask();
                }
            });
        });
    }

    /* 其他操作 */
    function otherDialog(name) {
        if (!iD.Task.d) return;
        if (!_status) {

        }
        _status = name;

        if ( mouseDrawStatus.hasOwnProperty(name) ) {
            context.enter(iD.modes.toolbar.Polyline(context));
        } else if (name == '2') {
            // submitSave(name);
        } else if (name == '4') {
            // submitSave(name);
        } else if (name == '1') {
			showTopoRefreshDialog();
		}
        submitSave(name);
        console.log(name)
    }

    function goNextTask() {
        var taskid = iD.Task.d.task_id;
        var idx = iD.Task.tasks.indexOf(iD.Task.d);
        // clearView();
        iD.Task.get(function (tasks) {
            if (tasks[idx] && tasks[idx].task_id == taskid) {
                idx++;
            }
            var list = tasks.slice(idx);
            if (list.length == 0) {
                list = tasks;
                if (idx == list.length - 1) {
                    list.pop();
                }
            }
            var nextTask = getEnterTask(list);
            if (nextTask) {
                context.ui().taskList.enter(nextTask.task_id);
            } else {
                // 没有下个检查完成/未检查的任务，刷新页面
                reloadCurrentPage();
            }
        });
    }

    function getEnterTask(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            // 作业员，筛选下一个可作业任务
            if (iD.User.isWorkRole()) {
                if ((task.tags.checkStatus == "2"
                    || task.tags.checkStatus == "100"
                    || !task.tags.checkStatus)
                    && task.task_id != iD.Task.d.task_id) {
                    return task;
                }
            } else {
                // 质检、验收、审核员，直接跳转到下一个任务
                return task;
            }
        }
    }

    function reloadCurrentPage(taskId) {
        var url = window.location.href;
        var param = "";
        if (taskId) {
            param = "&taskID=" + taskId;
        }
        if (iD.url.getUrlParam("taskID")) {
            url = url.replace(/&taskID=(\d+)?&?/, '');
        }
        window.location.href = url.split('#')[0] + param;
    }

    function request(url, callback, errorCallback) {
        var d = url, bodyParam;
        if (_.isObject(d)) {
            url = d.url;
            if (d.bodyParam) {
                bodyParam = d.bodyParam;
            }
        }
        let errorMsg = '任务平台服务无响应，请重试';
        let xhr;
        if (bodyParam) {
            xhr = d3.json(url)
                .header("Content-Type", "application/json;charset=UTF-8")
                .post(JSON.stringify(bodyParam));
            // .post(JSON.stringify(bodyParam), function(error, data) {
            //     if (error) {
            //         if(errorCallback){
            //             errorCallback(error);
            //         }else {
            //             Dialog.alert(errorMsg);
            //         }
            //         return;
            //     }
            //     callback(data);
            // });
        } else if ((d.type + '').toLowerCase() == 'post') {
            xhr = d3.json(url)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .post(_.map(d.param, function (v, k) {
                    return k + '=' + (v || '');
                }).join('&'));
        } else {
            xhr = d3.json(url).get();
            /*
            , function(error, data) {
                if(errorCallback){
                    errorCallback(error);
                }else {
                    Dialog.alert(errorMsg);
                }
                callback(data);
            }
            */
        }


        xhr.on('error', function (xhr, request) {
            // 超时不处理
            if (request && request.errorType == 'timeout') {
                Dialog.alert(errorMsg);
                return;
            }
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                Dialog.alert(errorMsg);
            }
        });
        xhr.on('load', function (data) {
            callback(data);
        });
    }

    return topoRefreshBtn;

};
