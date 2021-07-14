/*
 * @Author: tao.w
 * @Date: 2020-09-17 18:50:29
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-01 19:29:28
 * @Description: 
 */
iD.ui.RoadRule.Weather = function(options) {

	var render = iD.ui.RoadRule.MultiCheck({
		namePre: 'weather',
		options: iD._attributeField.weatherOptions
	});

	var weather = function(selection) {
		let _r = render(selection);
        
        return _r;
	};

    weather.setVal = function(vals) {

		if (!vals) {
			return false;
		}

		render.val(vals);
	};

    weather.getVal = function() {

		var vals = render.val();
        // return vals;
		return _.values(vals).join(',');
	};

    weather.val = function(_) {

		if (!arguments.length) return weather.getVal();

		return weather.setVal(_);
	};

    weather.disable = function(disable) {
		return render.disable(disable);
	};


	return d3.rebind(weather, render, 'on');
};

iD.ui.RoadRule.Weather.weatherOptions = [{
	label: '晴天',
	name: 'sunny',
	value: 'sunny'
}, {
	label: '雨(雪)天',
	name: 'rain',
	value: 'rain'
}, {
	label: '路面结冰',
	name: 'ice',
	value: 'ice'
}, {
	label: '雾天',
	name: 'fog',
	value: 'fog'
}, {
	label: '风',
	name: 'wind',
	value: 'wind'
}];
