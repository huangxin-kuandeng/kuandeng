iD.ui.LeftBarElement.TaskDetail = function(context) {
	var dispatch = d3.dispatch('back', 'pre', 'next', 'submit', 'start', 'check', 'enter', 'afterStart', 'qcstart', 'afterQCStart');
	var Task = iD.Task;
	var TASK_STATUS = Task.TASK_STATUS;
	var QC_TASK_STATUS = Task.QC_TASK_STATUS;
	var taskDetail = function(selection, data, index) {
		context.enter(iD.modes.Browse(context));
		if (d3.select('.KDSEditor-button-wrap .save.disabled').size() === 0 && data.task_id !== Task.working.task_id) {
            Dialog.confirm('是否保存之前操作? ', function() {
            	context.enter(iD.modes.Save(context, t('save.title'), function() {
					draw(selection, data, index);
            	}, function() {
            		context.history().popAll();
            		draw(selection, data, index);
            	}));
            }, function() {
            	context.history().popAll();
            	draw(selection, data, index);
            });
        } else {
            draw(selection, data, index);
        }
    };

    //需要按亚当ID来更新用户反馈层的取图， 强定制化东西，不合理
    function updataLayerUrl(layerid,data){
        if(data.task_classes =='1' && typeof data.adam_id != 'undefined' && data.adam_id.length > 0){
            var layer = editor.getOverLayerByID(layerid);
            var url =layer.url.split("&dataWhereCondition=adam_id=")[0];
            url +="&dataWhereCondition=adam_id='"+data.adam_id+"'";
            //url +=encodeURIComponent("&dataWhereCondition=adam_id='"+data.task_id+"'");
            layer.setOptions({ editor : editor, url: url });
        }
    }

    function draw(selection, data, index) {
        //只有是类型是用户反馈才会修改图层的加载亚当ID
        updataLayerUrl(iD.refLayer.user_feed_back,data);

    	selection.selectAll('*').remove();
		d3.select('.item.item-task').classed('status-detail', true);
		Task.d = _.extend(data, {
			_index: index
		});
		context.ui().layermanager.update();
		iD.Static.layersInfo.initElements();
		selection.data([data]);
		var header = selection.append('div').attr('class', 'header');
		var back = header.append('span').attr('class', 'back')
			.text('返回列表').on('click', dispatch.back);


		var pre = header.selectAll('pre').data([index - 1]).enter().append('span').attr('class', 'pre')
			.classed('disabled', function(d) {
				return d < 0 ? true : false;
			})
			.text('上一任务').on('click', dispatch.pre);

		var next = header.selectAll('next').data([index + 1]).enter().append('span').attr('class', 'next')
			.classed('disabled', function(d) {
				return d > (Task.tasks.length - 1) ? true : false;
			})
			.text('下一任务').on('click', dispatch.next);

		var role = d3.select('body').attr('role');
		var scroller = selection.append('div').classed('scroller', true);

		var taskAttrWrapper = scroller.append('div').classed('taskattr-wrapper', true).call(iD.ui.LeftBarElement.dropdownMaker(), '任务属性');
		taskAttrWrapper.call(iD.ui.LeftBarElement.TaskAttr(context, dispatch), data, index);

		var buttons = selection.append('div').attr('class', 'button-group').classed(role, true);

		function afterStart() {

            ////开始任务之前对数据正确性进行验证
            //var all = context.intersects(context.map().extent());
            //var errMsg = [];
            //var checkDate = iD.util.dataValidate.checkNodeAndWayValidate(all,context);
            //errMsg = checkDate.errMsg;
            //if(errMsg.length>0){
            //    Dialog.alert(errMsg[0],function(){},"道路结点缺失");
            //    return;
            //}
            //
            //errMsg = iD.util.dataValidate.checkCrossAndWayValidate(checkDate.wayArr,checkDate.roadCrossArr,context);
            //if(errMsg.length>0){
            //    Dialog.alert(errMsg[0],function(){},"拓补关系错误");
            //    return;
            //}

            //console.log(all);
            d3.selectAll('#changeQualityStatus').attr('disabled',null);
			buttons.select('.start').remove();
			// var autoCheck = buttons.append('button').text('自动检查').attr('class', 'check');
            //
			// autoCheck.on('click', dispatch.check);
            //
			// var submit = buttons.append('button').attr('class', 'submit').text('提交作业');
            //
			// submit.on('click', dispatch.submit);
			Task.order();
		}
		function afterQCStart() {
            d3.selectAll('#changeQualityStatus').attr('disabled',null);
			buttons.select('.start').remove();
			var checkPass = buttons.append('button').attr('class', 'pass').attr('result', 1).text('品控合格');
			var checkFail = buttons.append('button').attr('class', 'fail').attr('result', 2).text('品控不合格');

			buttons.selectAll('button').on('click', function() {
				if (document.getElementById('qcBoxDiv')) {
                    Dialog.alert('请先将输入框中内容保存');
					return;
				}

                if(d3.event && d3.event.target.className == "pass" && data._reports_status){
                    Dialog.alert('非误报不允许品控合格');
                    return;
                }

				var result = d3.select(this).attr('result');

				if (d3.selectAll('.KDSEditor-button-wrap .save').classed('disabled')) {
					save();
				} else {
					context.enter(iD.modes.Save(context, t('save.title'), save));
				}

				function save() {
					Task.submit({
						result: result,
						transid: data.trans_id,
						taskid: data.task_id,
						id: data.qc_id
					}, function(data) {
                        if(data.status == "0"){
                            Dialog.alert("任务已提交");
							if(/active/i.test(d3.select(".layer-manager-pane.KDSEditor-pane .dropdown-menu .item-tag i").attr("class")))
							{
								d3.select(".layer-manager-pane.KDSEditor-pane .dropdown-menu .item-tag i").trigger("click")
							}
						}else{
                            Dialog.alert(data.desc);
                        }
						if (data.qc_status == QC_TASK_STATUS.END) {
							Task.removeOne(index);
						}
						dispatch.back();
					});
				}
			});

		}


		dispatch.on('afterStart', afterStart);
		dispatch.on('afterQCStart', afterQCStart);

        //数据未加载完毕不显示开始任务按钮
        var connection = context.connection();
        connection.on('loading.start', function() {
            //start.classed('disabled',true);
            // if (start != undefined) {
            //     start.classed('hidden',true);
            // }
        });

        connection.on('loaded.start', function() {
            // if (start != undefined) {
            //     start.classed('hidden',false);
            // }

        });

        dispatch.start();
        context.editArea(iD.Task.d.range);
        context.map().drawTansactionEntity();

        //加载事务框
        // (data.trans_id && data.trans_id !== '') && context.connection().loadTransactionPologon(data.trans_id,iD.User.getInfo().userid, function() {
    	context.ui().sidebar.update(data);
    	context.ui().layermanager.update();
        context.variable.firstInZoomLevel = context.map().zoom();
    }


	return d3.rebind(taskDetail, dispatch, 'on');
};