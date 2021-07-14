iD.ui.LeftBarElement.TaskAttr = function(context, dispatch) {
	var Task = iD.Task;
	var TASK_STATUS = Task.TASK_STATUS;
	var form = {};
	var labels = {
		'1': [
			{
				'title': '任务ID',
				'name': 'task_id'
			}
			/*,{
				'title': '任务类型',
				'name': 'task_classes',
				'map': {
					'1': '用户反馈',
					'2': '重点工程'
				}
			}*/
			/*,
			{
				'title': '错误类型',
				'name': 'cli_error'
			},
			{
				'title': '修改方案',
				'name': 'cli_modify'
			},
			{
				'title': '优先级',
				'name': 'basic_priority'
			},
			{
				'title': '调查人',
				'name': 'cli_worker'
			},
			{
				'title': '反馈时间',
				'name': 'cli_time'
			}*/

		],
		'2': [
			{
				'title': '任务ID',
				'name': 'task_id'
			},
			{
				'title': '信息点名称',
				'name': 'vip_name'
			},
			{
				'title': '任务类型',
				'name': 'task_classes',
				'map': {
					'1': '用户反馈',
					'2': '重点工程'
				}
			},
			{
				'title': '优先级',
				'name': 'basic_priority'
			},
			{
				'title': '通车状态',
				'name': ''
			}
		],
		'5': [
			{
				'title': '任务ID',
				'name': 'task_id'
			},
			{
				'title': '任务类型',
				'name': 'task_classes',
				'map': {
					'1': '用户反馈',
					'2': '重点工程',
					'5': '步导任务'
				}
			},
			{
				'title': '错误类型',
				'name': 'cli_error'
			},
			{
				'title': '修改方案',
				'name': 'cli_modify'
			},
			{
				'title': '优先级',
				'name': 'basic_priority'
			},
			{
				'title': '调查人',
				'name': 'cli_worker'
			},
			{
				'title': '反馈时间',
				'name': 'cli_time'
			}

		],
        '7': [
            {
                'title': '任务ID',
                'name': 'task_id'
            },
            {
                'title': '任务类型',
                'name': 'task_classes',
                'map': {
                    '1': '用户反馈',
                    '2': '重点工程',
                    '7': '全量检查'
                }
            },
            {
                'title': '优先级',
                'name': 'basic_priority'
            }
        ]
	};
	var taskAttr = function(selection, data, index) {
		var body = selection.select('.body');
		var lines = body.selectAll('div').data(labels[data['task_classes']]).enter().append('div').attr('class', 'attr clearfix');

		lines.each(function(d, i) {
			var line = d3.select(this);
			var key = line.append('div').text(d.title);
			var value = line.append('div').text(function(d) {
				var name = d.name && data[d.name] ? data[d.name] : '';
				if (d.map && name) {
					name = d.map[name];
				}
				return name;
			});
		});


		iD.Task.current.on('start', function(){

            //定时保存，半个小时保存一次
            function autoSave(){
                var history = context.history();
                if(history.hasChanges()){
                    Dialog.confirm("您已长时间没有保存数据了，是否保存？",function(){
                        context.enter(iD.modes.Save(context, "auto saving"));
                    })
                }
            }
            var autoSaveTime = 0;
               window.clearInterval(autoSaveTime);
            //重复执行某个方法
               autoSaveTime = window.setInterval(autoSave,900000);

			context.enter(iD.modes.Browse(context));
            if(context.variable.firstInZoomLevel<16){
                // editor.setZoom(18);
                // Dialog.alert("任务初始缩放级别小于16，加载数据不完全，不进行数据正确性检查");
            }
			// else{
            //     //开始任务之前对数据正确性进行验证
            //     var all = context.intersects(context.map().extent());
            //     var errMsg = [];
            //     var checkDate = iD.util.dataValidate.checkNodeAndWayValidate(all,context);
            //     errMsg = checkDate.errMsg;
            //     if(errMsg.length>0){
            //         Dialog.alert(errMsg[0],function(){},"道路结点缺失");
            //         //return;
            //     }
            //
            //     errMsg = iD.util.dataValidate.checkCrossAndWayValidate(checkDate.wayArr,checkDate.roadCrossArr,checkDate.walkEnterArr,context);
            //     if(errMsg.length>0){
            //         Dialog.alert(errMsg[0],function(){},"拓补关系错误");
            //         //return;
            //     }
            // }

				if (data.task_status === 5) {
					Task.start(data.task_id, data.trans_id, function() {
						iD.Task.working = data;
						dispatch.afterStart();
						iD.Task.dispatch.start();
					});
				} else {
					iD.Task.working = data;
					dispatch.afterStart();
					iD.Task.dispatch.start();
				}
			// }
			
		});

		iD.Task.current.on('submit', function() {

            if(!iD.Task.working.chk_trans_id)
            {
                Dialog.alert("尚未提交自动检查，不能提交任务");
                return ;
            }
            if(!iD.Check.checkReport(context,"自检错误项尚未修改完成，不能提交任务。")) return ;

			Dialog.confirm('确认提交任务么?',function() {
				if (d3.selectAll('.KDSEditor-button-wrap .save').classed('disabled')) {
					submit();
				} else {
					context.enter(iD.modes.Save(context, t('save.title'), submit));
				}
				
			});

			function submit() {
				Task.submit({
					taskid: data.task_id,
					transid: data.trans_id
				}, function(data) {
                    Dialog.alert(data.desc);
					if (data.task_status == 30) {
						Task.removeOne(0);
						delete Task.d;
						delete Task.working;
						context.map().drawTansactionEntity();
						editor.setZoom(18);
						editor.setCenter([116.3974,39.908288]);
					}
					dispatch.back();
				});
			}
		});
	}

	return taskAttr;
}