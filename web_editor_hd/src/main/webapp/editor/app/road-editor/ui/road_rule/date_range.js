iD.ui.RoadRule.DateRange = function(options) {

	var event = d3.dispatch('change'),
		$container,
		$dateList, $addBtn;

	options = _.assign({
		limit: Number.MAX_VALUE
	}, options);

	var dateRange = function(selection) {

		$container = selection;

		$dateList = $container.append('div')
			.attr('class', 'daterange_list');

		$addBtn = $container.append('button')
			.attr('class', 'row-add daterange-add')
			.on('click', dateRange.add);

		$addBtn.append('span')
			.attr('class', 'icon KDSEditor-icon plus');

		$addBtn.append('span').html('添加日期');
	};

	dateRange.add = function() {

		var data = dateRange.getVal();

		data.push({
			start: '1-1',
			end: '12-31'
		});

		$dateList.call(render, data);
	};

	function render($dateList, data) {

		var $dateItems = $dateList.selectAll('div.date_range_item')
			.data(data);

		var $newDateItems = $dateItems.enter()
			.append('div').attr('class', 'date_range_item row_item cf');

		$dateItems.exit().remove();

		$newDateItems.append('label')
			.attr('class', 'start date_point')
			.each(function(d) {

				var datePicker = iD.ui.RoadRule.DatePicker();

				this.__ruleDatePicker = datePicker;

				d3.select(this).call(datePicker);
			});

		$newDateItems.append('label').attr('class', 'date_divider row_divider').html('至');

		$newDateItems.append('label').attr('class', 'end date_point')
			.each(function(d) {

				var datePicker = iD.ui.RoadRule.DatePicker();

				this.__ruleDatePicker = datePicker;

				d3.select(this).call(datePicker);
			});

		$newDateItems.append('button')
			.attr('class', 'remove')
			.on('click', function(d) {
				d3.event.preventDefault();
				d3.event.stopPropagation();

				d3.select(this.parentNode).remove();

				refreshStat();
			})
			.append('span').attr('class', 'icon KDSEditor-icon delete');

		$dateItems.each(function(d) {

			var $rowItem = d3.select(this);

			$rowItem.select('label.start').node().__ruleDatePicker.val(d.start);

			$rowItem.select('label.end').node().__ruleDatePicker.val(d.end);
		});

		refreshStat();
	}

	function refreshStat() {
		var curLen = $dateList.selectAll('div.date_range_item').size();
		$addBtn.classed('hidden', curLen >= options.limit || $dateList.classed('disabled'));
	}

	dateRange.getVal = function() {

		var vals = [];

		$dateList.selectAll('div.date_range_item').each(function() {

			var $itemItem = d3.select(this),
				dVal = {};

			dVal.start = $itemItem.select('label.start').node().__ruleDatePicker.val();
			dVal.end = $itemItem.select('label.end').node().__ruleDatePicker.val();

			vals.push(dVal);
		});

		return vals;
	};

	dateRange.validate = function() {

		var passed = true,
			dVals = [];

		$dateList.selectAll('div.date_range_item').each(function() {

			var $itemItem = d3.select(this),
				dVal = {};

			dVal.start = $itemItem.select('label.start').node().__ruleDatePicker.val();
			dVal.end = $itemItem.select('label.end').node().__ruleDatePicker.val();

			dVal.start = paddDate(dVal.start);
			dVal.end = paddDate(dVal.end);

			dVal.$ele = $itemItem;

			if (dVal.start >= dVal.end) {

				passed = false;

				//console.log(dVal);

				iD.ui.TagEditor.toastr($itemItem, '开始日期需小于结束日期', {
					timeout: 3000,
					placement: 'right',
					delay: 10
				});
			}

			if (passed) {
				dVals.push(dVal);
			}

		});

		if (passed) {

			dVals.sort(function(a, b) {

				var fld = 'start';

				if (a.start === b.start) {
					fld = 'end';
				}

				if (a[fld] === b[fld]) {
					return 0;
				}

				return a[fld] > b[fld] ? 1 : -1;
			});

			//console.log(dVals);

			for (var i = 1, len = dVals.length; i < len; i++) {

				if (dVals[i].start < dVals[i - 1].end) {

					passed = false;

					iD.ui.TagEditor.toastr(dVals[i].$ele, '日期范围有重合', {
						timeout: 3000,
						placement: 'right',
						delay: 10
					});

					break;
				}
			}
		}

		return !passed;
	};

	function paddDate(date) {

		var md = date.split('-');

		return lpadZero(md[0], 2) + '-' + lpadZero(md[1], 2);
	}

	function lpadZero(str, length) {

		str = '' + str;
		while (str.length < length)
			str = '0' + str;

		return str;
	}

	dateRange.setVal = function(data) {
		if (!data) return;
		$dateList.call(render, data);
	};

	dateRange.val = function(_) {

		if (!arguments.length) return dateRange.getVal();

		return dateRange.setVal(_);
	};

	dateRange.disable = function(disable) {
		$container.classed('no-pointer-events disabled', !!disable);
		refreshStat();
	};

	return d3.rebind(dateRange, event, 'on');
};