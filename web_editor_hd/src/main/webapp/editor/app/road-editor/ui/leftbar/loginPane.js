/**
 * 用户登录面板
 * @param {Object} context
 */
iD.ui.LoginPane = function(context) {
	var User = iD.User;
	var dispatch = d3.dispatch('dropdown', 'dropdownoff', 'username', 'key');
	var Dropdown = iD.ui.UsernameDropdown(context);


	var loginPane = function(selection) {
		var form = {};

		selection.append('div').attr('class', 'login-logo');
		selection.append('h3').attr('class', 'title').text('  ');
		form.username = selection.append('input')
			.attr('class', 'username')
			.attr('placeholder', '工作账号');
		var dropdown = selection.append('div').classed('dropdown', true).call(Dropdown, dispatch);

		form.password = selection.append('input')
			.attr('class', 'password')
			.attr('type', 'password')
			.attr('placeholder', '密码');

		form.errorInfo = selection.append('div').attr('class', 'error-info');
		form.errorInfo.append('span').attr('class', 'error-logo').text('!');
		form.errorMessage = form.errorInfo.append('span');

		form.submit = selection.append('button')
			.text('登录');

		form.username.on('input', function() {
			var value = this.value;
			var cache = iD.UsernameCache.search(value);
			dispatch.dropdown(cache);
		}).on('focus', function() {
			var value = this.value;
			var cache = iD.UsernameCache.search(value);
			dispatch.dropdown(cache);
		}).on('blur', function() {
			dispatch.dropdownoff();
		}).on('keydown', function() {
			var key = d3.event.keyCode;
			dispatch.key(key);
		});

		form.password.on('keydown', function() {
			if (d3.event.keyCode === 13) {
				var username = form.username.value();
				var password = form.password.value();
				User.login(username, password);
			}
		});

		form.submit.on('click', function() {
			var username = form.username.value();
			var password = form.password.value();
			User.login(username, password);
		});

		dispatch.on('username', function(username) {
			form.username.value(username);
			dispatch.dropdownoff();
		});

		User.on('error.loginpane', function(message) {
			form.errorInfo.classed('show', true);
			form.errorMessage.text(message);
		});
		
		// 判断URL中是否含有task_id字段，如果有的话，自动登录admin，并且任务列表渲染完成后，直接触发选择任务
		var urlTaskid = iD.url.getUrlParam("taskID");
		if(urlTaskid){
			User._urlTaskIsEnter = false;
			setTimeout(function(){
				User.login("admin", "admin");
			}, 500);
		}
	};

	return d3.rebind(loginPane, dispatch, 'on');
};