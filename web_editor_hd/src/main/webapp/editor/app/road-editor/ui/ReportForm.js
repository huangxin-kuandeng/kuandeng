/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:36
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-19 11:43:45
 * @Description: 
 */

iD.ui.ReportForm = function (context) {
    context.reportFormMarkers = [];

    // 不同流程节点，可能不存在重跑选项
    var RERUN_CACHE = {};
    var signpostDialog = null;
    var _signpost_track = {};
    
    var _pbRoot;
    if (!_pbRoot) {
        let protoUrl = "./dist/proto/traffic_sign.proto";
        protobuf.load(protoUrl, function (err, root) {
            _pbRoot = root;
        });
    }

    var reportFormTable;
	function postStatus(id,status){
        var url = iD.config.URL.kcs_report+'checkStatus/modify/update';

        d3.json(url)
            .header("Content-Type", "application/json")
            .post(JSON.stringify([{
                id,
                status
            }]), function(error, data) {
            	if(error || (data && data.code !='0')){
                    Dialog.alert('报表提交异常', null, null, null, null, {
                        AutoClose: 3
                    });
				}
            });
	}
    function locationPlayer(entity){
        if(!(entity instanceof iD.Node)){
            return ;
        }
        let graph,relations,parameter,trackPointId,trackId;

        graph= context.graph();
        relations = graph.parentRelations(entity,iD.data.DataType.MEASUREINFO);
        if(!relations.length) return ;
		if(!relations[0].tags.PARAMETER) return ;
        parameter = JSON.parse(relations[0].tags.PARAMETER);
        if(!parameter || !parameter.Paras || !parameter.Paras.nodes){
            return ;
        }
        trackPointId = parameter.Paras.nodes[0].trackPointId;
        if(!trackPointId) return ;
        trackId = parameter.Paras.nodes[0].trackId;
        if(!trackId){
			let trackPoint = iD.svg.Pic.dataMgr.pointId2Track(trackPointId);
			if(trackPoint){
				trackId = trackPoint.trackId;
			}
		}
		if(trackId){
			iD.svg.Pic.dataMgr.pic.getPicPlayer() && iD.svg.Pic.dataMgr.pic.getPicPlayer().locateTrackPointToPlayer(trackPointId,trackId);
		}

    }

    function lightEntity(type = 'n', did, name){
        var lay = getLayerByName(name);
        if(!lay){
            return ;
        }
        var sim = iD.Entity.id.delimiter || "_";
        // var entity = context.hasEntity(type + lay.id + sim + did) || context.hasEntity(type + sim + did);
        var entity = context.hasEntity(type + lay.identifier + sim + did) || context.hasEntity(type + sim + did);
        if(!entity){
        	context.enter(iD.modes.Browse(context));
            return ;
        }
        if(!(entity instanceof iD.Relation)){
            context.map().lightEntity(entity.id);
            locationPlayer(entity);
        }else {
            var mids = [];
            _.each(entity.members || [], function(m){
                let d = context.hasEntity(m.id);
                if(!(d instanceof iD.Relation)){
                	mids.push(d.id)
				}
                if(d instanceof iD.Node){
                    locationPlayer(entity);
                }
            });
            mids.length && context.map().lightEntity(mids);
        }

    }

    function getFormFilterFunc(filterstr){
    	var args = filterstr.split("=");
		var modelName = _.last(args);
		if(!modelName) return ()=>false;
		var prefix = $.trim(args[0]);
		var includeFun = function(str, modelName){
			var mnames = modelName.split(',');
			return mnames.includes(str);
		}

		var result;
		switch (prefix){
			case '!':
				result = (element)=>{
					return !includeFun(element.getAttribute('filter-mname'), modelName);
//					return element.getAttribute('filter-mname') != modelName;
				};
				break;
			default:
				result = (element)=>{
					return includeFun(element.getAttribute('filter-mname'), modelName);
//					return element.getAttribute('filter-mname') == modelName;
				};
				break;
		}
		return result;
    }
    function getFormFilterText(filterstr){
    	var args = filterstr.split("=");
		// var modelName = _.last(args);
		var prefix = $.trim(args[0]);
		var text = '';
		if(prefix == '!'){
			text += '非';
		}
		// iD.data.DataType.DIVIDER
		text += '车道线';
		return text;
    }


    function request(url, callback, errorCallback) {
        var d = url, bodyParam;
        if(_.isObject(d)){
            url = d.url;
            if(d.bodyParam){
                bodyParam = d.bodyParam;
            }
        }
        let errorMsg = '任务平台服务无响应，请重试';
        let xhr;
        if(bodyParam){
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
        }else if((d.type + '').toLowerCase() == 'post'){
            xhr = d3.json(url)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .post(_.map(d.param, function(v, k){
                    return k + '=' + (v || '');
                }).join('&'));
        }else {
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
        

        xhr.on('error', function(xhr, request){
            // 超时不处理
            if(request && request.errorType == 'timeout'){
                Dialog.alert(errorMsg);
                return ;
            }
            if(errorCallback){
                errorCallback(xhr);
            }else {
                Dialog.alert(errorMsg);
            }
        });
        xhr.on('load', function(data){
            callback(data);
        });
    }

    function showReRunDialog(){
        var options = [];
        let processId = iD.Task.d.protoData.id;
        if(RERUN_CACHE[processId]){
            showDialog(RERUN_CACHE[processId]);
        }else {
            request(iD.config.URL.kts + 'form/form-data?taskId=' + processId, function(data){
                let fields = data && data.formProperties || [];
                let scope = _.find(fields, {id: 'runScope'});
                let vals = scope && scope.enumValues || [];
                showDialog(vals);
            });
        }

        function showDialog(vals){
            if(!vals || !vals.length){
                Dialog.alert('当前流程没有重跑选项');
                return ;
            }
            RERUN_CACHE[processId] = vals;
            vals.forEach(function(d){
                options.push({
                    name: d.name,
                    value: d.id
                });
            });
            // RERUN_CACHE
            Dialog.confirm(`
                <span>选择重跑范围</span>
                <select id="_rerun_type" style="padding: 3px 5px;">
                    ${options.map(d => `
                        <option value="${d.value}">${d.name}</option>
                    `).join('')}
                </select>
            `, function(){
                // form/form-data
                let param = {
                    "taskId": "" + processId,
                    "properties": [{
                        "id": "runScope",
                        "value": d3.select('#_rerun_type').value() + ''
                    }, {
                        "id": "passFlag",
                        // false时runScope参数生效，重跑，true为触发下一环节
                        "value": "false"
                    }]
                };
                request({
                    url: iD.config.URL.kts + 'form/form-data',
                    bodyParam: param
                }, function(data){
                    // 存在null的情况，除了code有值并且不等于0，都认为成功；
                    if(data && data.code != '0'){
                        Dialog.alert(data.message || '');
                        return ;
                    }
                    goNextTask();
                }, function(){
                    // 超时以外都认为成功
                    goNextTask();
                });
            });
        }
    }
	
	var reportForm = function (selection) {
        context.variable.signpostTagEditor = iD.ui.SignpostTagEditor(context);
        context.event.on("saveend.reportForm", function(data) {
            _signpost_track = {};
        });
        // 检查按钮，线形作业（融合）的自动化任务使用
        // 评估
        var $btnCheck = d3.select('#_btn_tocheck_');
        $btnCheck.on('click', function(){
            if(!iD.Task.d) return ;
            autoCheckStatus(function(e){
                var checkStatus = e.result.checkStatus;
                if(checkStatus == '0' || checkStatus == '1'){
                    if(iD.User.isQualityAssessorRole()){
                        // 评估员
                        goNextTask();
                    }else {
                        goNextAutoTask();
                    }
                    // Dialog.alert('检查中。');
                }else if(checkStatus == '2'){
                    // 检查完成
                    getForm(false);
                    Dialog.alert('检查完成。');
                }else if(checkStatus == '100'){
                    Dialog.alert('无检查场景');
                }else if(e.result.checkInfo){
                    var msg = e.result.checkInfo;
                    Dialog.alert(msg);
                }
                // getForm(false);
            });
        });
        // 检查全部按钮，线形作业、融合任务检查所有自动化任务
        var $btnCheckAll = d3.select('#_btn_tocheck_all_');
        $btnCheckAll.on('click', function(){
            if(!iD.Task.d) return ;
            linearFusionCheckAllStatus(function(e){
                if (!e || !e.result) {
                    Dialog.alert("检查失败！");
                    return; 
                }
                var checkStatus = e.result.checkStatus;
                if(checkStatus == '0' || checkStatus == '1'){
                    goNextTask();
                    // Dialog.alert('检查中。');
                }else if(checkStatus == '2'){
                    // 检查完成
                    Dialog.alert('检查完成。');
                }else if(checkStatus == '100'){
                    Dialog.alert('无检查场景');
                }else if(e.result.checkInfo){
                    var msg = e.result.checkInfo;
                    Dialog.alert(msg);
                }
            });
        });

        // 重跑按钮，确定后切换下个任务
        var $btnRun = d3.select('#_btn_rerun_');
        $btnRun.on('click', function(){
            if(!iD.Task.d) return ;
            // var options = [{
            //     value: '4',
            //     name: '只跑多融合'
            // }, {
            //     value: '5',
            //     name: '全要素'
            // }];
            linearFusionAutoReportStatus(function(allChecked){
                allChecked && showReRunDialog();
            });
        });
		

		// let ids1;
//		查询框(外套的div)
		var reportform = selection.append('div').attr('id', 'ReportForm');
		var $formHeader = reportform.append('div').attr('class', 'reportform-header');
		var $fmBtn = $formHeader.selectAll('div.fm-btn.mname-filter').data([
			[iD.data.DataType.DIVIDER, iD.data.DataType.DIVIDER_NODE].join(','),
			'!=' + [iD.data.DataType.DIVIDER, iD.data.DataType.DIVIDER_NODE].join(',')
		])
		.enter().append('div')
		.attr('class', 'fm-btn mname-filter')
		.text(function(d){
			return getFormFilterText(d);
		})
		.on('click', function(d){
			var filter = getFormFilterFunc(d);
			$fmBtn.classed('active', false);
			d3.select(this).classed('active', true);
			d3.selectAll("#example3 tbody tr").each(function(){
				if(filter(this)){
					this.style.display = '';
				}else {
					this.style.display = 'none';
				}
			});
		});
		$fmBtn.classed('active', false);

		$formHeader.append('div')
			.attr('class', 'fm-btn')
			.attr('id', '_reportform_close').text('X')
			.on('click', function(){
                removeMarker();
                reportform.style('display', 'none');
                // DIV太多影响性能
                reportform.select('#reportFormTable').html('');
			});

//		列表(内容)
		reportFormTable = reportform.append('div').attr('id', 'reportFormTable');

		// var $button2 = $(".report-button #button2");
		// var $button3 = $(".report-button #button3");
		var $button4 = $(".report-button #button4");//signpost
//----------------------------------------------通过点击的质检------------------------------------------
//		编辑完成时再次执行
        var isExecCheck = false;
		/*$button2.click(function(data){
			if(!iD.Task.d){
				Dialog.alert('未选中任何任务。');
				return ;
            }
            
            var text = userAuthText();
            // 20190529 线形作业（融合）比较特殊，不需要检查
            if(iD.Task.isLinearFusion() && iD.Task.definedLinearWork()){
                context.variable.checkUseHistoryFlag = false;
                isExecCheck = false;
                linearFusionAutoReportStatus(function(allChecked){
                    allChecked && processPassStatus('true', function () {
                        goNextTask();
                    });
                });
            //质量评估员处理检查任务逻辑
            }else if(iD.User.isQualityAssessorRole()){
                // 质检评估
                // 完成之前必须经过检查（空数组或有值，null为未检查）
                // 检查结果不必须经过人工处理
                getForm(false, {
                    handle: function(d){
                        if(!d || d.result == null || iD.Task.d.tags.checkStatus == null){
                            Dialog.alert('当前任务没有经过检查');
                            return ;
                        }
                        Dialog.confirm(`
                            <span>${text}是否通过</span>
                        `, function(){
                            processPassStatus('true', function () {
                                goNextTask();
                            });
                        });
                    }
                });
            //审核员处理检查任务逻辑
            }else if(iD.User.isAuditRole()){

                getForm(false);
                Dialog.confirm(`
                    <span>${text}是否通过</span>
                    <select id="_report_audit_select" value="true" style="padding: 3px 5px;">
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                    <div id="_report_audit_select_keysource_div" style="display: none;">
                        <span>修改数据来源</span>
                        <select id="_report_audit_select_keysource" value="true" style="padding: 3px 5px;">
                            <option value="branch">branch</option>
                            <option value="task">task</option>
                        </select>
                    </div>
                `, function(){
                    var flagSelect = d3.select('#_report_audit_select');
                    var flag = flagSelect.value() == 'true';
                    var param = {};
                    // 不通过时选择数据来源
                    // branch-母库旧数据
                    // task-组网新数据
                    if(!flag){
                        param.keySource = d3.select('#_report_audit_select_keysource').value();
                    }
	                processPassStatus(flagSelect.value(), function(){
                        // reloadCurrentPage();
                        goNextTask();
                    }, {
                    	param: param
                    });
                });
                var flagSelect = d3.select('#_report_audit_select');
                var sourceSelect = d3.select('#_report_audit_select_keysource_div');
                if(flagSelect.size()){
                    flagSelect.on('change', function(){
                        let flag = this.value == 'true';
                        if(!flag){
                            sourceSelect.style('display', 'block');
                        }else {
                            sourceSelect.style('display', 'none');
                        }
                    });
                }
                return ;
            }
            //精度质检用户检查任务逻辑
            else if(iD.User.isPrecisionRole()){
                getForm(false);
            	// 精度质检员，质检完成后直接通过，没有是否选项，不传参；
				processPassStatus(true, function(){
					// reloadCurrentPage();
                    goNextTask();
				}, {
					emptyParam: true
				});
				return ;
            }
            //线性质检、质检、验收员检查任务逻辑
            else if (iD.User.isLineCheckRole() || iD.User.isEditCheckRole() || iD.User.isVerifyRole()) {
                getForm(false);
                Dialog.confirm(`
					<span>${text}是否通过</span>
					<select id="_report_editcheck_select" value="true" style="padding: 3px 5px;">
						<option value="true">是</option>
						<option value="false">否</option>
					</select>
				`, function(){
                    processPassStatus(d3.select('#_report_editcheck_select').value(), function () {
                        // reloadCurrentPage();
                        goNextTask();
                    });
                });
            }
            //线性作业、作业员检查任务逻辑
            else if(iD.User.isLineWorkRole() || iD.User.isWorkRole()) {

                	if (editor.getHistory()) {
                        isExecCheck = true;
                        context.enter(iD.modes.Save(context, "force saving"));
                        context.event.on('saveend.reportform', function(e, data){
                            context.event.on('saveend.reportform', null);
                            if (isExecCheck) {
                                context.variable.checkUseHistoryFlag = true;
                                completeEdit(function(toNext){
                                    if(!toNext){
                                        getForm(false);
                                    }
                                });
                                context.variable.checkUseHistoryFlag = false;
                                isExecCheck = false;
                            }
                        });
                    } else {
                        completeEdit(function(toNext){
                            if(!toNext){
                                getForm(false);
                            }
                        });
                    }
                // });
                return ;
            }

			reportform.style('display', 'none');
		})*/

//		点击按钮--查看质检报告--通过接口获取与之对应的数据
//		触发检查----通过查询任务列表获取相关信息
		// $button3.click(function getstart2(data){
        // 	if(iD.Task.d){
        //         setTimeout(getForm,1000);
        // 	}
		// })
		$button4.click(function getstart2(data){
            var key = iD.Task.d.tags.laserSignElement;
            if (!key) {
                Dialog.alert('工作流未返回激光路牌标识【laser_sign_element】字段！');
                return;
            }
            if (signpostDialog && signpostDialog.isOpen()) {
                // $signPost.classed('hide', true);
                // $signPost.classed('active', false);
                signpostDialog.options.destroyOnClose = false;
                var $signPostAttr = d3.select('.signpost-attribute');
                if ($signPostAttr.node()) {
                    let $attributeDialog = d3.select($signPostAttr.node().parentElement.parentElement);
                    $attributeDialog.style('display', 'none');
                }
                signpostDialog.close();
            } else {
                let width = Number(context.surface().attr('width'));
                let height = Number(context.surface().attr('height')) - 67;
                var ts = _signpost_track[key];
                if (ts) {
                    context.variable.signpostTagEditor.createSignDom(ts.datas, signpostDialog, _signpost_track[key].p);
                    signpostDialog.open();
                    signpostDialog.widget().style({
                        width: width+'px',
                        height: height+'px',
                        top: '60px',
                        left: 0
                    });
                    return;
                }
            
                if (!signpostDialog) {
                    signpostDialog = iD.dialog(null, {
                        width,
                        height,
                        // appendTo: '#id-container',
                        autoOpen: false,
                        resizable: true,
                        closeBtn: true,
                        draggable: false,
                        destroyOnClose: false,
                        position: {
                            at: 'left top',
                            my: 'left top'
                        },
                        beforeClose: function(){
                            d3.select(window).on('keyup.ReportForm', null);
                            var $signPostAttr = d3.select('.signpost-attribute');
                            if ($signPostAttr.node()) {
                                let $attributeDialog = d3.select($signPostAttr.node().parentElement.parentElement);
                                $attributeDialog.style('display', 'none');
                            }
                        }
                    });
            
                    signpostDialog.option('title', 'Signpost');
                    signpostDialog.widget().classed('potree-panel', true);
                }

                //请求PB数据及解析
                //upload=true save
                //text/laser_middle_result/laser_sign_element_pb/query?key=xxx&update=true
                let pbUrl = iD.config.URL.hbase_support + 'text/laser_middle_result/laser_sign_element_pb/query?key=' + key
                var loading = iD.ui.Loading(iD.User.context)
                    .message('正在请求路牌数据，请稍等……')
                    .blocking(true);
                iD.User.context.container().call(loading);
                // let protoUrl = "./dist/proto/traffic_sign.proto";
                //解析PB
                iD.util.parsePBData(pbUrl, _pbRoot, 'kd.mapping.proto.TrafficSigns', function(message, p){
                // iD.util.parsePBData(pbUrl, protoUrl, function(message){
                    loading && loading.close();
                    _signpost_track[key] = {
                        datas: message.trafficSigns,
                        p
                    };
                    context.variable.signpostTagEditor.createSignDom(message.trafficSigns, signpostDialog, p);
                    signpostDialog.open();
                    signpostDialog.widget().style({
                        top: '60px',
                        left: 0
                    });
                    signpostDialog.element.style('padding', 0);
                })
            }
		})
    }
    

    //----------------------------------------------输出错误报表------------------------------------------
//      根据数据来Ajax的get请求获取URL的数据(拼接的URL)
    function getForm(isNext = true, opts){
        // var isChecker = iD.User.isCheckRole();
        // 报表逻辑，filter为true时，过滤掉已修改状态的数据
        var merge = '?filter=false';
        opts = opts || {};
        // var merge = isChecker ? '?filter=true' : '';
//			======生成对应数据的错误报表======
        iD.UserBehavior.logger({
            tag: 'check_get_start'
        });
        $.ajax({
            // url: kcs_edit+'check/report/taskId/'+iD.Task.d.protoData.tags.taskId + merge,
            url: iD.config.URL.kcs_report + 'check/report/taskId/'+iD.Task.d.protoData.tags.taskId + merge,
            type: 'get',
            async: false,
            dataType: "json",
            success:function(data){
                iD.UserBehavior.logger({
                    tag: 'check_get_end',
                    task_id: iD.Task.d.tags.taskId || undefined,
                    // task_type: originalTask.task_type,
                    status: data.code || '0',
                    desc: JSON.stringify({
                        check: data && data.result && data.result.id || '',
                    }),
                });

                if(opts.handle){
                    opts.handle(data);
                    return ;
                }
                
                if(data.code != "0"){											//系统异常时停止
                    $('#ReportForm').fadeIn(500);
                    d3.select('#reportFormTable').html(data.message || "系统异常");
                    //$button3.css('display', 'none');
                    Dialog.alert(data.message);									//输出错误详细信息
                    return false;
                }else if (data.result){											//执行成功时停止
                    if (iD.User.isWorkRole() || iD.User.isLineWorkRole()) {
                        context.variable.checkUselessFlag = checkUseless(data.result)
                        if (isNext && context.variable.checkUselessFlag) {
                            context.variable.checkUseHistoryFlag = false;
                            if (iD.Task.d.tags.checkStatus == "2") {
                                Dialog.confirm(`
                                    <span>自动检查已验证！</br>是否提交人工质检</span>
                                    <select id="_report_editcheck_select" value="true" style="padding: 3px 5px;">
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                `, function () {
                                    var _check_val = d3.select('#_report_editcheck_select').value();
                                    processPassStatus(_check_val, function () {
                                        if (_check_val != "false") {
                                            // reloadCurrentPage();
                                            goNextTask();
                                        }
                                    });
                                });
                            } else if (iD.Task.d.tags.checkStatus == "3" || iD.Task.d.tags.checkStatus == "4") {
                                Dialog.alert("检查异常！请重新提交该任务！");
                            }
                        }
                    }
                    appendForm(data);
                }
            }
        })
    }
    // function completeEdit(callback) {
    //     callback = callback || function(){};
    //     autoCheckStatus(function (e) {
    //         // 获取编辑完成后，下一个未做自动检查的任务并跳转
    //         var checkStatus = e.result.checkStatus;
    //         var flag = false;
    //         if(checkStatus == '0' || checkStatus == '1'){
    //             // 检查中下个任务
    //             goNextTask();
    //             flag = true;
    //             callback(flag);
    //         }else if(checkStatus == '2' || checkStatus == '100'){
    //             flag = false;
    //             // 检查完成，报表信息中没有未处理的数据，直接提交该任务
    //             getForm(false, {
    //                 handle: function(data){
    //                     if(!data || data.code != '0'){
    //                         Dialog.alert(data && data.message || '质检报表查询失败');
    //                         callback(flag);
    //                         return ;
    //                     }
    //                     context.variable.checkUselessFlag = checkUseless(data.result);
    //                     // 全部搁置、误报，检查完成
    //                     if(!context.variable.checkUselessFlag){
    //                         Dialog.alert('存在未修改的检查项'); 
    //                         callback(flag);
    //                         return ;
    //                     }

    //                     processPassStatus(true, function () {
    //                         goNextTask();
    //                         flag = true;
                            
    //                         callback(flag);
    //                     });
    //                 }
    //             });
    //         }else if(e.result.checkInfo){
    //             var msg = e.result.checkInfo;
    //             Dialog.alert(msg);
    //             var $trs = d3.selectAll('#KDSEditor-bar > div > div.KDSEditor-button-wrap.task-list');
    //             var tr = $trs.nodes()[iD.Task.tasks.indexOf(iD.Task.d)];
    //             var $status = tr && d3.select(tr).select('.task_checkstatus');
    //             if($status && $status.size()){
    //                 $status
    //                     .style('background-color', '#0000FF')
    //                     .attr('title', msg)
    //                     .text(msg);
    //             }

    //             callback(flag);
    //         }
            
    //     });
    // }
    function goNextTask() {
        var taskid = iD.Task.d.task_id;
        var idx = iD.Task.tasks.indexOf(iD.Task.d);
        clearView();
        iD.Task.get(function(tasks){
            if(tasks[idx] && tasks[idx].task_id == taskid){
                idx ++;
            }
            var list = tasks.slice(idx);
            if(list.length == 0){
                list = tasks;
                if(idx == list.length - 1){
                    list.pop();
                }
            }
            var nextTask = getEnterTask(list);
            if(nextTask){
                context.ui().taskList.enter(nextTask.task_id);
            }else {
                // 没有下个检查完成/未检查的任务，刷新页面
                reloadCurrentPage();
            }
        });
    }

    function goNextAutoTask() {
        var taskObj = iD.Task.d;
        var taskid = taskObj.task_id;
        var fusionid = taskObj.fromFusionTaskId;
        if(!taskid || !fusionid) return ;
        var fusionTask = _.find(iD.Task.tasks, {task_id: fusionid});
        var fusionIdx = iD.Task.tasks.indexOf(fusionTask);
        var subTasks = iD.Task.getSubTaskList(fusionid);
        var idx = subTasks.indexOf(taskObj);
        clearView();

        iD.Task.querySubTaskList(fusionTask, function(tasks){
            if(tasks[idx] && tasks[idx].task_id == taskid){
                idx ++;
            }
            var list = tasks.slice(idx);
            var isLast = list.length == 0;
            // 自动化任务列表无数据，进入融合任务列表
            if(isLast){
                list = iD.Task.tasks.slice(fusionIdx + 1);
            }
            var nextTask = getEnterTask(list);
            if(nextTask){
                context.ui().taskList.enterByTask(nextTask);
            }else {
                // 没有下个检查完成/未检查的任务，刷新页面
                reloadCurrentPage();
            }
        });
    }

    function clearView(){
        d3.select('#EffectForm').style('display', 'none');
        d3.select('#ReportForm').style('display', 'none');
        context.surface().select('.layer.layer-transaction').html('');
        
        if(iD.picUtil.player){
            iD.picUtil.player.destory();
            iD.picUtil.player.dataMgr.pic.clearDatas();
        }
        editor.removeALLDataLayer();
    }

    function getEnterTask(tasks){
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            // 作业员，筛选下一个可作业任务
            if(iD.User.isWorkRole()){
                if ((task.tags.checkStatus == "2" 
                    || task.tags.checkStatus == "100" 
                    || !task.tags.checkStatus) 
                    && task.task_id != iD.Task.d.task_id) {
                    return task;
                }
            }else {
                // 质检、验收、审核员，直接跳转到下一个任务
                return task;
            }
        }
    }
    // TODO 临时判断，等后台加入搁置、误报判断后再去掉
    // 判断是否是搁置、误报的检查项
    // return true: 返回结果全部是搁置、误报检查项，则忽略，可选择进入人工质检环节
    //false: 返回结果里不全部是搁置、误报检查项，必须修改完成后再进入下一环节
    function checkUseless(result) {
        if (result) {
            var culArr = [];
            for(var i = 0; i < result.checkDataResults.length; i++) {
                var checkData = result.checkDataResults[i];
//              console.log("checkData:"+checkData.status+"===="+i)
                if (checkData.status == 2 || checkData.status == 3) {
                    culArr.push(checkData);
                }
            }
            if (culArr.length == result.checkDataResults.length) {
                return true;
            }
        }else {
            return true;
        }
        return false;
    }

    function removeMarker() {
        if (context.reportFormMarkers) {
            for (var i in context.reportFormMarkers) {
                context.map().removeOverlays(context.reportFormMarkers[i]);
            }
            context.reportFormMarkers = [];
            context.enter(iD.modes.Browse(context));
        }
    }

//		根据数据增添错误报表的内容
    function appendForm(data){
        var effectform = $('#EffectForm');
        effectform.hide();
        var reportform = $('#ReportForm');
        reportFormTable = d3.select('#reportFormTable');
        if( data.result.checkDataResults.length == 0 ){									//没有错误时
            //$button3.css('display', 'none');						//改变按钮隐藏
            reportFormTable.html("没有发现错误");							//改变div的内容(可提交)
            Dialog.alert('报表中没有错误信息');
        }else{															//有错误时
            reportform.fadeIn(500);
//	    		修改中文
            var currentInstance = '';

            var mety = iD.ModelEntitys[currentInstance + "DIVIDER"];
            if(!mety){												//倘若中文不存在,则按原来的内容来显示
                mety = {
                    getChineseName: function(str){
                        return str;
                    },
                    getGeoType: function(){
                        return 0;
                    }
                };
            }
            var iconCheckDisplay = iD.User.isCheckRole() || iD.User.isLineCheckRole() ? "none" : "";
            // 创建一个错误样式表并增添内容
            var datumPanelTmpl = `
			    <div class="table-header">
	                <table>
	                	<thead style="font-weight:bold;">
			                <tr>
				                <th>状态</th>
				                <th>ID</th>
				                <th>检查项编码</th>
				                <th>数据类型 </th>
				                <!--<th>dataType</th>-->
				                <th>描述</th>
			                </tr>
			            </thead>
	                </table>
			    </div>
			    <div class="reportform-table-wrap">
		          	<div id="example3" class="table table-bordered table-hover">
			            <div class="box-body" style="text-align:center;font-size:14px;">
						    <table class="table table-bordered table-hover">
					            <tbody>
			                	${data.result.checkDataResults.map(d => `
					                <tr filter-mname="${d.dataLayer}">
						                <td title="${d.id}" class="td" style="font-weight:normal;">
						                <button class="btn-status iconfont icon-check" data-status="1" title="已修改" style="display:${iconCheckDisplay}"></button>
						                <button class="btn-status iconfont icon-cross ${d.core ? 'disabled' : ''}" data-status="3" title="搁置"></button>
						                <button class="btn-status iconfont icon-error2 ${d.core ? 'disabled' : ''}" data-status="2" title="误报""></button>
						                </td>
						                <td title="${d.id}" class="td" style="font-weight:normal;">${d.id}</td>
						                <td title="${d.checkItemCode}" class="td"style="font-weight:normal;">${d.checkItemCode}</td>
						                <td title="${d.dataLayer}" class="td" style="font-weight:normal;">${d.dataLayer} </td>
						                <!--<th title="${d.dataType}" style="font-weight:normal;">${d.dataType}</th>-->
						                <td title="${d.errorMsg}" class="td" style="font-weight:normal;">${d.errorMsg}</td>
					                </tr>
			                	`).join('')}
					            </tbody>
						    </table>

			  			</div>
		          	</div>
		        </div>
                `;
            //status：0-未修改，1-已修改，2-误报， 3-搁置， 4-非误报
            reportFormTable.html(datumPanelTmpl);					//将生成的内容增添到页面中去
            var tbody = d3.selectAll('#example3 tbody');
            tbody.selectAll('tr').data(data.result.checkDataResults);
            tbody.selectAll('tr').each(function(d){
                var $status = d3.select(this).selectAll('.btn-status[data-status="' + d.status + '"]');
                if($status.size()){
                    $status.classed('active', true);
                }
            });
            // 点击上一任务改变button按钮内容
            $(".pre").on('click', function(data) {
                $button3.css('display', 'block');
                reportform.fadeOut(300);
            })

            // 点击下一任务改变button按钮内容
            $(".next").on('click', function(data) {
                $button3.css('display', 'block');
                reportform.fadeOut(300);
            })

//				错误报表-分别点击执行事件
            var child = $("#example3 tbody tr");
            for (var i = 0; i < child.length; i++) {
                var a = child[i];
                a.index = i;										//给每个className为child的元素添加index属性;
                var checkDataRefs = data.result.checkDataResults[i].checkDataRefs;
                a.dataX = checkDataRefs[0].dataX;
                a.dataY = checkDataRefs[0].dataY;
                a.checkDataRefs = checkDataRefs;
                a.onclick = function (e) {
			        var itemCheck =  data.result.checkDataResults[this.index];
                    d3.selectAll('#example3 tbody tr').classed('active',false);
                    var $this = d3.select(this).classed('active', true);
                    var $target = d3.select(e.target);
                    var $allStatus = $this.selectAll('.btn-status');
                    var targetIsStatus = $target.classed('btn-status');
                    var targetStatus = targetIsStatus && +$target.attr('data-status') || null;

                    if(itemCheck && itemCheck.core && targetIsStatus){
                        // 核心检查项，不能点击误报、搁置
                        // if(targetStatus == 2 || targetStatus == 3){
                        if($target.classed('disabled')){
                            Dialog.alert('核心检查项禁止设置 ' + $target.attr('title'));
                            return ;
                        }
                    }
                    if(targetIsStatus && targetStatus != null){
                        if ($target.classed('active')) {
                            itemCheck.status = 0;
                            $allStatus.classed('active', false);
                        }else {
                            itemCheck.status = targetStatus;
                            $allStatus.classed('active', false);
                            $target.classed('active', true);

                        }
                        postStatus(itemCheck.id, itemCheck.status);
                    }

                    if(!iD.User.authCheckResultHandle()){
                        Dialog.alert(t("permission.checkedit_no_handle"));
                        return ;
                    }
//						reportform.fadeOut(300);
                    var _data = itemCheck;
                    var dataX = this.dataX;					//获取指定要素的X坐标
                    var dataY = this.dataY;					//获取指定要素的Y坐标
                    var dataId = _data.dataId;				//获取指定要素的dataId
                    var dataType = _data.dataType;			//获取指定要素的类型
                    var modelName = _data.dataLayer;
                    // var  ob = [{
                    //     'checkId': _data.id || '',
                    //     'status': _data.status || '0',
                    //     'modelName' : modelName ,
                    //     'action':'click'
                    // }]
                    let loggerOpts = {
                        'type': 'click',
                        'tag': 'check_table_click',
                        'filter': 'none',
                        'checkId': _data.id || '',
                        'status': _data.status || '0',
                        'modelName': modelName || "",
                        'desc': "",
                        'child_event_name': '',
                        'action': 'Click',
                    };
                    iD.UserBehavior.logger(loggerOpts);
                    // iD.logger.editElement('check_table_click',modelName,'', '',null,ob);
                    // getData();
//          			======根据相应数据来获取所对应的坐标，类型等数据======

//		    			根据返回的坐标，类型等属性进行定位与高亮
// 		        		function getData(){
                    if(dataType == "relation"){								//要素类型relation
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        // lightEntity('r', dataId);
                    }else if(dataType == "node"){							//要素类型node
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        lightEntity('n', dataId,modelName);
                    }else{													//要素类型way
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        lightEntity('w', dataId,modelName);
                    }
                    // }
                    removeMarker();
                    for (var i = 0; i < this.checkDataRefs.length; i++) {
                        var marker = new Marker({
                            loc: [this.checkDataRefs[i].dataX, this.checkDataRefs[i].dataY],
                            mode: 'marker',
                            offset:[0,-12.5],
                            'style': {'fill': "#FF8C00"}
                        });//TODO 设置Marker颜色方式 Tilden
                        context.reportFormMarkers.push(marker);
                        context.map().addOverlays(marker);
                    }
                    context.enter(iD.modes.Browse(context));
                }
            }
        }

        var history = iD.util.urlParamHistory();
        if(history){
            reportForm.hideBtn();
        }
    }


    function getLayerByName(name){
		var result;
		var layers = iD.Layers.getLayers();
		for(let lay of layers){
			if(iD.util.getModelNameByItem(lay.models.datas || [], name)){
				result = lay;
				break;
			}
		}
		return result;
	}

//--------------------------------------------------通过任务系统进入的作业系统---------------------------------------------------
	var reportform = $('#ReportForm');
	var LocationTaskID, LocationType, batch, taskId;
	var $button3 = $(".report-button #button3").show();
    var $button2 = $(".report-button #button2");
    var $buttonReRun = $(".report-button #_btn_rerun_").hide();
    var $buttonCheck = $(".report-button #_btn_tocheck_").hide();
    var $buttonCheckAll = $(".report-button #_btn_tocheck_all_").hide();

//	通过地址栏的参数进行变化相关
	LocationType = window._systemType && (window._systemType+'') || "1";
	reportForm.showBtn = function(){
		var history = iD.util.urlParamHistory();
		if(history) return ;

		reportform.fadeOut(300);
		//$button3.hide();
		if(iD.Task.d.protoData.tags.editCheckBatch){
			setTimeout(function(){
				batch = iD.Task.d.protoData.tags.editCheckBatch;
				taskId = iD.Task.d.protoData.tags.taskId;
				$button3.html("查看检查报告").show();
//				进入---编辑系统,且编辑系统---不存在数据时
			},400)
		}else {
			//$button3.hide();
		}

		var text = userAuthText();
		if (iD.User.isAuditRole() || iD.User.isVerifyRole() || iD.User.isEditCheckRole()) {
            $button2.html(text + "完成").show();
		} else if (iD.User.isWorkRole() || iD.User.isQualityAssessorRole()) {
            $button2.html(text + "完成").show();
        } else {
            if (LocationType && (LocationType == "1")) {
                $button2.html("编辑完成").show();
                if (iD.User.authCheckTrigger() || iD.User.authCheckReportForm()) {
                    $button2.html("编辑完成").show();
                }
//			进入融合系统
            } else if (LocationType && (LocationType == "2")) {
                $button2.html("融合完成").show();
//			进入识别系统
            } else if (LocationType && (LocationType == "3")) {
                $button2.html("识别完成").show();
            } else if (LocationType && (LocationType == "5")) {
                $button2.html("质检完成").show();
            }
        }
        var showForm = true;
		
        // 按钮显示状态
        if(iD.Task.isLinearFusion() && iD.Task.definedLinearWork()){
            $button3.hide();
            $buttonReRun.show();
            $buttonCheckAll.show();
        }else {
            $button3.show();
            $buttonReRun.hide();
            $buttonCheckAll.hide();
        }
        if(iD.Task.isLinearFusionAuto()){
            if(iD.Task.d.marking){
                $button2.hide();
                $button3.show();
                $buttonCheck.show();
            }else {
                $button2.hide();
                $button3.hide();
                $buttonCheck.hide();
                showForm = false;
            }
        }else {
            $button2.show();
            // $button3.show();
            $buttonCheck.hide();
        }
        if(iD.User.isQualityAssessorRole()){
            // 评估员
            $button2.show();
            $button3.show();
            $buttonCheck.show();
            showForm = true;
        }
        // showForm && getForm();
	}
	reportForm.hideBtn = function(){
		$button2.hide();
		//$button3.hide();
	}

	function reloadCurrentPage(taskId){
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

	function userAuthText(){
		var result = '';
		if(iD.User.isAuditRole()){
			result = '审核';
		}else if(iD.User.isWorkRole()){
			result = '编辑';
		}else if(iD.User.isVerifyRole()){
            result = '验收';
        }else if(iD.User.isEditCheckRole()){
			result = '质检';
		}else if(iD.User.isLineWorkRole()){
			result = '线形作业';
		}else if(iD.User.isLineCheckRole()){
			result = '线形质检';
		}else if(iD.User.isQualityAssessorRole()){
			result = '评估';
		}
		return result;
	}

    //执行自动检查服务
    // function autoCheckStatus(callback) {
    //     // var posParam = iD.Task.getPosParam();
    //     let taskObj = iD.Task.d;
    //     // let _checkData = {
    //     //     "projectId": taskObj.tags.projectId
    //     // };
    //     iD.UserBehavior.logger({
    //         tag: 'check_start'
    //     });
    //     // var url = iD.config.URL.kcs_edit + 'check/async/tasks/'+taskObj.task_id + "?callback={callback}&" + iD.util.parseParam2String(_checkData)
    //     var url = iD.config.URL.kcs_schedule + 'dispatch/check?taskId='+taskObj.task_id;

    //     // d3.jsonp(url,function(d){
    //     d3.json(url).get(function(error, d){
    //         iD.UserBehavior.logger({
    //             tag: 'check_end',
    //             status: d && d.result && d.result.checkStatus || '0',
    //         });
    //         if(!d || !d.result){
    //             Dialog.alert('检查服务无响应');
    //             return ;
    //         }
    //         let result = d.result[0];
    //         if(!result || !result.inQueue){
    //             Dialog.alert("质检列队添加失败。<br/>" + (result && result.message || ''));
    //             return ;
    //         }
    //         d.result = result;
    //         d.result.checkStatus = '0';

    //         if(d && d.result && d.result.checkStatus){
    //             if(taskObj.tags.checkStatus != d.result.checkStatus){
    //                 taskObj.tags.checkStatus = d.result.checkStatus;
    //             }
    //         }
    //         callback && callback(d);
    //     });
    // }

    //执行线形作业自动检查服务
    function linearFusionCheckAllStatus(callback) {
        // var posParam = iD.Task.getPosParam();
        let taskId = iD.Task.d.task_id;
        iD.Task.getSubTaskIdList(taskId, function(data){
            if(!data){
                Dialog.alert('查询标记自动化任务失败');
                return ;
            }
            let autoIds = _.compact(data.taskIds.filter(function(v, i){
                return data.markings[i] ? v : null;
            }));
            if(!autoIds.length){
                Dialog.alert('没有标记自动化任务');
                return ;
            }

            let _checkData = {
                "autoIds": autoIds
            };
            iD.UserBehavior.logger({
                tag: 'check_start'
            });
            var url = iD.config.URL.kcs_edit + 'check/async/tasks/projectId/'
                + iD.Task.d.tags.projectId 
                + '/fusionId/'+ taskId + '?callback={callback}&' + iD.util.parseParam2String(_checkData)
    
            d3.jsonp(url,function(d){
                iD.UserBehavior.logger({
                    tag: 'check_end',
                    status: d && d.result && d.result.checkStatus || '0',
                });
                callback && callback(d);
            });
        });
    }

    //获取线形作业报表处理状态
    function linearFusionAutoReportStatus(callback) {
        // var posParam = iD.Task.getPosParam();
        let taskId = iD.Task.d.task_id;
        iD.Task.getSubTaskIdList(taskId, function(data){
            if(!data){
                Dialog.alert('查询标记自动化任务失败');
                return ;
            }
            let autoIds = _.compact(data.taskIds.filter(function(v, i){
                return data.markings[i] ? v : null;
            }));
            if(autoIds.length == 0){
                // 没有标记直接通过
                callback && callback(true);
                return ;
            }

            let _checkData = {
                "taskIds": autoIds
            };
            var url = iD.config.URL.kcs_edit + 'check/report/status/byTaskIds?callback={callback}&'
                + iD.util.parseParam2String(_checkData)
    
            d3.jsonp(url,function(d){
                if(!d || d.code != '0' || !d.result){
                    Dialog.alert('获取检查报表处理状态失败！');
                    return ;
                }
                var d = {
                    finish: d.result.errorDataCheckFinished || [],
                    noFinish: d.result.errorDataCheckNoFinshed || []
                };
                if(d.noFinish.length){
                    Dialog.alert('任务中存在未处理的检查项：[' + d.noFinish.join(',') + ']');
                }
                callback && callback(d.noFinish.length == 0);
            });
        });
    }

	/**
	 * 设置当前任务是否通过当前流程
	 * @param {Boolean} isPass
	 * @param {Function} callback
	 * @param {Object} opts
	 */
	function processPassStatus(isPass, callback, opts = {}){
        if(iD.Task.d.tags.checkStatus == '100'){
            let flag = window.confirm('当前流程中无检查场景，未经过自动检查，是否继续？');
            if(!flag) return ;
        }
    	let history = context.history();
    	if(history.hasChanges()){
    		// 是否清空
    		if(window.confirm(t("save.clear_sure"))){
    			context.enter(iD.modes.Browse(context));
    			context.flush();
    		}else {
    			// 手动保存
    			return ;
    		}
    	}
		if(isPass == null){
			return ;
		}
		// 是否通过
		let _checkData = {
			"taskId": "" + iD.Task.d.protoData.id,
			"properties": [{
				"id": "passFlag",
				"value": isPass + ""
			}]
		};
		_checkData.properties.push(..._.compact(_.map(opts.param || {}, function(v, k){
			if(v == null) return ;
			return {id: k, value: v};
		})));
		if(opts.emptyParam){
			// 精度质检员特殊处理；
			_checkData.properties = [];
        }
        iD.UserBehavior.logger({
            tag: 'task_submit_start'
        });
		$.ajax({
	        type : "post",
	        url : iD.config.URL.kts + 'form/form-data',
	        async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_checkData),
	        complete : function(xhr, status) {
                iD.UserBehavior.logger({
                    tag: 'task_submit_end',
                    'status': '0',
                });
	        	callback && callback(xhr, status);
	        }
	   	});
	}

	return reportForm;
}
