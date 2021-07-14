iD.modes.PicPlay = function(context, selectedIDs, mouse) {

	var mode = {
			button: 'pic_play',
			id: 'pic_play',
			title: 'Pic',
			description: 'Pic'
		},
		sidebar;

	var behaviors = [
		iD.behavior.Hover(context)
		.on('hover', context.ui().sidebar.hover),
		iD.behavior.Select(context),
		//iD.behavior.Lasso(context),
		//iD.modes.DragNode(context).behavior
	];

	var dvrDataMgr = iD.svg.Pic.dataMgr;

	mode.enter = function() {
		context.transportation.set();
		context.temp().rawposition = 0;

		dvrDataMgr.selectedIDs(selectedIDs || []);
		dvrDataMgr.mousePos(mouse || null);

		behaviors.forEach(function(behavior) {
			context.install(behavior);
		});

		// Get focus on the body.
		if (document.activeElement && document.activeElement.blur) {
			document.activeElement.blur();
		}

		context.container()
			.classed('mode-browse', true);
	};

	mode.exit = function() {

		//dvrDataMgr.selectedIDs([]);
		dvrDataMgr.mousePos(null);

		context.container()
			.classed('mode-browse', false);

		behaviors.forEach(function(behavior) {
			context.uninstall(behavior);
		});
	};
	return mode;
};