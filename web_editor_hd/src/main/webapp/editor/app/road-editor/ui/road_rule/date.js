iD.ui.RoadRule.DatePicker = function(options) {

	var event = d3.dispatch('change'),
		$month, $day;

	var datePicker = function(selection) {

		$month = selection.append('select')
			.attr('class', 'month_sel')
			.on('change', monthChange);

		selection.append('span').html('月');

		selection.append('span').attr('class', 'monthday_divider').html('-');

		$day = selection.append('select')
			.attr('class', 'day_sel');

		selection.append('span').html('日');

		$month.selectAll('option')
			.data(d3.range(1, 13)).enter().append('option')
			.attr('value', function(d) {
				return d;
			})
			.text(function(d) {
				return d;
			});

		monthChange();
	};

	function setDayOption(days) {

		var options = $day.selectAll('option')
			.data(d3.range(1, days + 1));

		options.enter().append('option');

		options.exit().remove();

		options.attr('value', function(d) {
				return d;
			})
			.text(function(d) {
				return d;
			});
	}

	var daysOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	function monthChange() {
		var monthSel = $month.property('value') || 1;

		monthSel = parseInt(monthSel, 10);

		setDayOption(daysOfMonth[(monthSel - 1) % 12]);
	}

	datePicker.getVal = function() {

		return $month.property('value') + '-' +
			$day.property('value');
	};

	datePicker.setVal = function(_) {

		var md = _.split('-');

		$month.property('value', md[0]);
		$day.property('value', md[1]);
	};

	function lpadSpace(str, length) {

		str = '' + str;
		while (str.length < length)
			str = ' ' + str;

		return str;
	}

	datePicker.val = function(_) {

		if (!arguments.length) return datePicker.getVal();

		return datePicker.setVal(_);
	};

	return d3.rebind(datePicker, event, 'on');
};