iD.ui.RoadRule.Holiday = function(options) {

	var render = iD.ui.RoadRule.Radio({
		name: 'rule_holiday',
		options: [{
			label: '未设定',
			value: '0',
			default: true
		}, {
			label: '节假日',
			value: '1'
		}, {
			label: '节假日除外',
			value: '2'
		}]
	});

	var holiday = function(selection) {

		return render(selection);
	};


	holiday.val = function(_) {
		return render.val.apply(render, arguments);
	};

	holiday.disable = function(disable) {
		return render.disable(disable);
	};


	return d3.rebind(holiday, render, 'on');
};