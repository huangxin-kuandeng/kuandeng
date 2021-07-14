// 每一个面板初始化后的存储位置
iD.ui.tabs = {};
// 所有面板（tab）的初始化
iD.ui.NavTab = function(context) {
	var dispatch = d3.dispatch('active', 'default');
	var User = iD.User;
    var keybinding=d3.keybinding('navtab');
    // 初始化的面板列表
    // iD.ui.LeftBarElement.task
    // iD.ui.LeftBarElement.element
    /*
	var data = [
		{	
			name: 'task',
			title: '任务',
			toggle: 'task',
            key:'1'
		},
		{
			name: 'element',
			title: '图层',
			toggle: 'element',
            key:'2'
		}
	];
	*/
	var data = [
		{
			name: 'element',
			title: '属性',
			toggle: 'element',
            key:'2'
		}
	];
	var navTab = function(selection) {
		var wrapper = selection.append('div').attr('class', 'navtab');

		var nav = wrapper.append('ul').attr('class', 'nav');

		var lis = nav.selectAll('li').data(data).enter().append('li')
			.text(function(d) {
				return d.title;
			}).attr('toggle', function(d) {
				return d.toggle;
			}).attr('class', function(d) {
                var selection=this;
                keybinding = keybinding.on(d.key, function(){
                    //dispatch.active(d);
                    dispatch.active.call(selection, d);
                });

				return 'item-' + d.toggle;
			}).style('width', function(){
				return (100 / data.length) + "%";
			});


		var content = wrapper.append('div').attr('class', 'nav-content');

		var items = content.selectAll('.item').data(data).enter().append('div')
			.attr('class', function(d) {
                //self.call(keybinding.on(d.key,alert(d)));

				return 'item item-' + d.toggle;
			});

/*        data.forEach(function(d){
             keybinding = keybinding.on(d.key, function(){
                 dispatch.active(d);
                 dispatch.active.call(this, d);
        });
        })*/

        d3.select(document)
            .call(keybinding);
		dispatch.on('active.navtab', function(d) {
			var self = d3.select(this);
			if (self.classed('active')) {
				return;
			}
			var toggle = self.attr('toggle');
			lis.classed('active', false);
			items.classed('active', false);
			self.classed('active', true);
			items.select(function(d) {
				var that = d3.select(this);
				if (d.toggle === toggle) {
					if (!that.classed('fill')) {
						// if (!that.classed('item-element')) {
							that.classed('fill', true);
						// }
						// 初始化面板
						iD.ui.tabs[toggle] = iD.ui.tabs[toggle] || iD.ui.LeftBarElement[toggle](context);
						that.call(iD.ui.tabs[toggle]);
					}
					return this;
				}
			}).classed('active', true);
		});

		lis.on('click', dispatch.active);

		lis.each(function(d) {
			dispatch.active.call(this, d);
		});

		lis.select(function(d) {
			if (d.toggle === 'task') {
				dispatch.active.call(this, d);
				return;
			}
		});
		
        // 初始化任务列表，否则task_list.js无法通过iD.Task.afterget事件初始化
        // if(data[0] && data[0].toggle != 'task'){
        // 	iD.Task.get();
        // }
	}



	return d3.rebind(navTab, dispatch, 'on', 'active');
}