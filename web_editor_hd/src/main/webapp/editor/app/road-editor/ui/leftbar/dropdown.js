iD.ui.UserDropdown = function(context) {
	var User = iD.User;
	var UserDropdown = function(selection) {
		var user = User.getInfo();
		if (!user.username) {
			console.error('not login');
			return;
		}
		var button = selection.append('div')
			.attr('class', 'dropdown');
		
		button.append('span').text(user.truename).attr('class', 'name');

		button.append('span')
			.attr('class', 'caret');

		button.on('click', function() {
			selection.classed('open', !selection.classed('open'));
		})

		var ul = selection.append('ul').attr('class', 'dropdown-menu');
			
		var contents = [
			//删除功能重复
			/*{
				title: '切换账号',
				cb: function() {
					User.logout(function() {
						location.reload();
					});
				}
			},*/
			{
				title: user.username || "无用户名"
			},
			{
				title: '退出登录',
				cb: function() {
					User.logout(function() {
						location.reload();
					})
				}
			}
		];
		var lis = ul.selectAll('li').data(contents).enter().append('li')
			.text(function (d){
				return d.title;
			});

		lis.on('click', function(d) {
			d.cb && d.cb();
		})
	}
	return UserDropdown;
}
