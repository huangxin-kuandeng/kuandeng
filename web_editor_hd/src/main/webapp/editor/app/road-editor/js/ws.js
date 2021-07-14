;;(function() {
	iD.Service = iD.Service || {};
    //
	// var dispatch = d3.dispatch('check');
	// var ws;
	// var WSService = {
	// 	dispatch: dispatch,
	// 	connect: function() {
	// 		var userid = iD.User.getInfo().userid;
	// 		ws = new WebSocket(iD.config.URL.ws_url + '?userID=' + userid);
	// 		ws.onopen = function() {
	// 			ws.onmessage = WSService.execHandler;
	// 		}
	// 	},
	// 	getState: function() {
	// 		return ws.readyState;
	// 	},
	// 	send: function(type, msg) {
	// 		if (ws.readyState === 1) {
	// 			msg = msg + '&_type=' + type;
	// 			ws.send(msg);
	// 		} else {
	// 			throw new Error('socket disconnect');
	// 		}
	// 	},
	// 	execHandler: function(e) {
	// 		try {
	// 			var data = JSON.parse(e.data);
	// 		} catch (e) {
	// 			throw new Error('parse Error');
	// 		}
	// 		var type = data._type;
	// 		dispatch[type](data);
    //
	// 	}
	// };
    //
	// d3.rebind(WSService, dispatch, 'on');
    //
	// iD.Service.WS = WSService;
    //
	// iD.User.on('login.ws', function() {
	// 	WSService.connect();
	// });
})();