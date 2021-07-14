// 首页-任务列表面板
iD.ui.LeftBarElement.task = function(context) {
	var dispatch = d3.dispatch('task', 'refreshTasks');
	var Task = iD.Task;
	var taskDetail = iD.Task.current = iD.ui.LeftBarElement.TaskDetail(context);
	var headData = ['', '任务',''];


	var task = function(selection) {
		// var takeButton = selection.append('div').attr('class', 'take').text('领取任务');
		var info = selection.append('div').classed('empty', true).classed('hide', true);
		info.append('div');
		info.append('div').text('空空如也，快快点击领取任务刷新任务列表吧');
		var table = selection.append('table').attr('class', 'task-table');
		var detailWrapper = selection.append('div').attr('class', 'detail-warpper');
		// var thead = table.append('thead').append('tr');
		// thead.selectAll('th').data(headData).enter().append('th').text(function(d) {
		// 	return d;
		// });
		var tbody = table.append('tbody');
		
		var drawTable = function() {
			tbody.selectAll('tr').remove();
			info.classed('hide', true);
			tasks = Task.tasks;
			table.classed('hide', tasks.length === 0);
			var role = iD.User.getRole().role;
			// takeButton.classed('disabled', tasks.length !== 0);
			
			if (tasks.length > 0) {
				var trs = tbody.selectAll('tr').data(tasks).enter().append('tr');
				var isRed = false;
				trs.each(function(d, i) {
					var tr = d3.select(this);
					if (role === 'work') {
						if (Task.working && Task.working.task_id === d.task_id) {
							tr.classed('working', true);
						} else if (d.chk_status) {
							tr.classed('warning', true);
						} else if (d.task_status > Task.TASK_STATUS.ASSIGN) {
							tr.classed('editing', true);
						}
					}
					
					tr.append('td').text('').classed('icon', true);
					tr.append('td').text(d.task_id);
					tr.append('td').text(d.cli_desc);
					tr.append('td').classed('go-detail', true);

					if (Task.d && i === Task.d._index) {
						trs.classed('active', false);
						tr.classed('active', true);
					}
					if (d.chk_status) {
						isRed = true;
					}
				});
				/*
				trs.on('click', function(data, i) {
					// 从taskDetail，选中任务后再切换，而不是点击tr切换
					Task.d = _.extend(data, {
						_index: i
					});
					trs.classed('active', false);
					d3.select(this).classed('active', true);
					
					// (data.trans_id && data.trans_id !== '') && context.connection().loadTransactionPologon(data.trans_id,iD.User.getInfo().userid);
				});
				*/
				// trs.on('dblclick', function(d, i) {
				// 	selection.classed('status-detail', true);
				// 	detailWrapper.call(taskDetail, d, i)
				// });
				// 每行任务右侧的的按钮
				var $detail = trs.selectAll('.go-detail').on('click', function(d, _, i) {
					d3.event.stopPropagation();
					enterDetail(i);
				});
				

				d3.select('.nav .item-task').classed('red', isRed);
			} else {
				info.classed('hide', false);
			}
			var task_id = iD.url.getUrlParam("taskID");
			
			// 只有第一次会进入指定的task_id
			if(!iD.User._urlTaskIsEnter){
				tbody.selectAll('tr').each(function(d){
					iD.User._urlTaskIsEnter = true;
					var $tr = d3.select(this);
					if(d && task_id && d.task_id == task_id){
						$tr.select("td.go-detail").trigger("click");
					}
					return false;
				});
			}
		}
		
		// 初始化任务列表
		dispatch.on("refreshTasks", function(){
			Task.get(drawTable);
		});
		dispatch.refreshTasks();

		iD.Task.on('restore', function() {
			try {
				iD.Task.working = JSON.parse(localStorage.getItem('d'));
			} catch(e) {
				Dialog.alert('获取缓存失败');
				localStorage.removeItem('d');
				context.history().clearSaved();
				return;
			}
			if (!iD.Task.working) {
				Dialog.alert('获取缓存失败');
				localStorage.removeItem('d');
				context.history().clearSaved();
				return;
			}
			var index = _.findIndex(iD.Task.tasks, function(task) {
				return task.task_id === iD.Task.working.task_id;
			});
			if (index >= 0) {
				enterDetail(index);
			} else {
				// console.log(iD.Task.working);
				Dialog.alert('任务不存在，恢复失败');
				localStorage.removeItem('d');
				context.history().clearSaved();
				delete iD.Task.working;
			}
		});

		// takeButton.on('click', function() {
		// 	Task.checkout(drawTable);
		// });

		taskDetail.on('back', function() {
			context.enter(iD.modes.Browse(context));
			detailWrapper.selectAll('*').remove();
			selection.classed('status-detail', false);
			d3.select('.nav-content .item-element').classed('show', false);
			drawTable();
		});

		taskDetail.on('pre', function(index) {
			if (index < 0 ) {
				return;
			}
			detailWrapper.call(taskDetail, Task.getOne(index), index);
		});

		taskDetail.on('next', function(index) {
			if (index > Task.tasks.length - 1 ) {
				return;
			}
			detailWrapper.call(taskDetail, Task.getOne(index), index);
		});

		function enterDetail(index) {
			d3.select('.nav-content .item-element').classed('show', true);
        	iD.ui().reportform.showBtn();
        	
			detailWrapper.call(taskDetail, iD.Task.tasks[index], index);
		}
	}
	var result = d3.rebind(task, dispatch, 'on', 'refreshTasks');
	return result;
};