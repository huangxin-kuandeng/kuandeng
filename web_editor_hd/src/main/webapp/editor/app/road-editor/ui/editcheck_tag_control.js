iD.ui.EditCheckTagControl = function(context) {
    var panel = null;
    var taskid;

    function showPanel() {
    	/*
    	var layer = iD.Layers.getCurrentEnableLayer();
    	if(!layer || !iD.Task.tasks || !iD.Task.tasks.length){
    		Dialog.alert("没有选中任务或没有编辑状态的图层，无法生成坐标点；");
    		return ;
    	}
    	*/
        if (!panel) {
            panel = new iD.ui.EditCheckTagPanel(context, context.container());
        }
        if(taskid && iD.Task.d.task_id != taskid){
        	// 不是一个任务时，清空列表
        	panel.clearTabs();
        }
        taskid = iD.Task.d.task_id;
        panel.show();
    }

    var buttons = [{
        id: 'editcheck-tag-control',
        title: '质检表格',
        action: showPanel,
        key: 'Ctrl+E'
    }];

    return function(selection) {
        var button = selection.selectAll('button')
            .data(buttons)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) {
                return d.id;
            })
            .on('click.control', function(d) {
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(function(d) {
                    return iD.ui.tooltipHtml(d.title, d.key);
                }));

        button.append('span')
        	.attr('class', 'text-fill')
        	.text(function(d) {
            	var str = d.title;
        		for(var key in d.style){
        			this.style[key] = d.style[key];
        		}
            	return str.substring(0, d.titleNum || 4);
            });

        var keybinding = d3.keybinding('EditCheckTagControl');

        buttons.forEach(function(b) {
            keybinding.on(b.key, function() {

                d3.event.stopPropagation();
                d3.event.preventDefault();

                b.action();
            });
        });

        d3.select(document)
            .call(keybinding);
    };
};