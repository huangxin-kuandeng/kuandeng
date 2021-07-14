iD.ui.RoadRule.TimePicker = function(options) {

	var event = d3.dispatch('change'),
		$hour, $minute;

	var timePicker = function(selection) {

		$hour = selection.append('select').attr('class', 'hour');

		selection.append('span').attr('class', 'hourmin_divider').html(':');

		$minute = selection.append('select').attr('class', 'minute');

		$hour.selectAll('option')
			.data(d3.range(0, 25)).enter().append('option')
			.attr('value', function(d) {
				return lpadZero(d, 2);
			})
			.text(function(d) {
				return lpadZero(d, 2);
			});

		$minute.selectAll('option')
			.data(d3.range(0, 60)).enter().append('option')
			.attr('value', function(d) {
				return lpadZero(d, 2);
			})
			.text(function(d) {
				return lpadZero(d, 2);
			});
	};

	function lpadZero(str, length) {

		str = '' + str;
		while (str.length < length)
			str = '0' + str;

		return str;
	}

	timePicker.getVal = function() {

		return $hour.property('value') + ':' +
			$minute.property('value');
	};

	timePicker.setVal = function(_) {

		var hm = _.split(':');

		$hour.property('value', hm[0]);
		$minute.property('value', hm[1]);
	};

	timePicker.val = function(_) {

		if (!arguments.length) return timePicker.getVal();

		return timePicker.setVal(_);
	};

	return d3.rebind(timePicker, event, 'on');
};