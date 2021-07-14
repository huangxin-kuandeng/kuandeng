iD.ui.LeftBarUserPane = function (context) {
	var User = iD.User;
	var leftBarUserPane = function (selection) {
		var userPane = selection.append('div').attr('id', 'user');
		/*
		var header = userPane.append('div').attr('class', 'header');
		header.append('div').attr('class', 'logo');
		var info = header.append('div').attr('class', 'info');
		*/


		var body = userPane.append('div').attr('class', 'body');
		body.call(iD.ui.LoginPane(context));

		
		User.on('login.leftbaruserpane', function(data) {
			body.remove();
			// info.call(iD.ui.UserDropdown(context));
		});
		
	}
	return leftBarUserPane;
}

