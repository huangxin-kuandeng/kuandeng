iD.ui.RoadRule.Season = function(options) {

	var render = iD.ui.RoadRule.MultiCheck({
		namePre: 'season',
		options: [{
			label: '春季',
			name: 'spring',
			value: 'spring'
		}, {
			label: '夏季',
			name: 'summer',
			value: 'summer'
		}, {
			label: '秋季',
			name: 'autumn',
			value: 'autumn'
		}, {
			label: '冬季',
			name: 'winter',
			value: 'winter'
		}, {
			label: '干季',
			name: 'dry',
			value: 'dry'
		}, {
			label: '雨季/汛期',
			name: 'rainy',
			value: 'rainy'
		}]
	});

	var season = function(selection) {
		return render(selection);
	};

	season.setVal = function(vals) {

		if (!vals) {
			return false;
		}

		render.val(vals);
	};

	season.getVal = function() {

		var vals = render.val();

		return _.values(vals);
	};

	season.val = function(_) {

		if (!arguments.length) return season.getVal();

		return season.setVal(_);
	};

	season.disable = function(disable) {
		return render.disable(disable);
	};


	return d3.rebind(season, render, 'on');
};