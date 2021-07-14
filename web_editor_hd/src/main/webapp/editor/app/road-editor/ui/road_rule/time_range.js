iD.ui.RoadRule.TimeRange = function(options) {

	var event = d3.dispatch('change'),
		$container,
		$timeList, $addBtn;
    options.btns = options.btns!=undefined ? options.btns : true;
	options = _.assign({
		limit: Number.MAX_VALUE
	}, options);

	var timeRange = function(selection) {

		$container = selection;

		$timeList = $container.append('div')
			.attr('class', 'timerange_list');

		if (options.btns) {
            $addBtn = $container.append('button')
                .attr('class', 'row-add timerange-add')
                .on('click', timeRange.add);

		$addBtn.append('span')
			.attr('class', 'icon KDSEditor-icon plus');

            $addBtn.append('span').html('添加时间段');
        }
	};

	timeRange.add = function() {

		var data = timeRange.getVal();

		data.push({
			start: '00:00',
			end: '24:00'
		});

		$timeList.call(render, data);
		
		options.add && options.add($timeList);
	};

	function render($timeList, data) {

		var $timeItems = $timeList.selectAll('div.time_range_item')
			.data(data);

		$timeItems.exit().remove();

		var $newTimeItems = $timeItems.enter()
			.append('div').attr('class', 'time_range_item row_item cf');

		$newTimeItems.append('label')
			.attr('class', 'start time_point')
			.each(function(d) {

				var timePicker = iD.ui.RoadRule.TimePicker();

				this.__ruleTimePicker = timePicker;

				d3.select(this).call(timePicker);
			});


		$newTimeItems.append('label').attr('class', 'time_divider row_divider').html('至');

		$newTimeItems.append('label')
			.attr('class', 'end time_point')
			.each(function(d) {

				var timePicker = iD.ui.RoadRule.TimePicker();

				this.__ruleTimePicker = timePicker;

				d3.select(this).call(timePicker);
			});

        if (options.btns) {
            $newTimeItems.append('button')
                .attr('class', 'remove')
                .on('click', function (d) {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

					d3.select(this.parentNode).remove();

                    refreshStat();
					
					options.remove && options.remove(d);
                })
                .append('span').attr('class', 'icon KDSEditor-icon delete');
        }

		$timeItems.each(function(d) {

			var $rowItem = d3.select(this);

			$rowItem.select('label.start').node().__ruleTimePicker.val(d.start);

			$rowItem.select('label.end').node().__ruleTimePicker.val(d.end);
		});

		refreshStat();
	}

	function refreshStat() {
		var curLen = $timeList.selectAll('div.time_range_item').size();
        if (options.btns) {
            $addBtn.classed('hidden', curLen >= options.limit || $timeList.classed('disabled'));
        }
	}

	timeRange.getVal = function() {

		var vals = [];

		$timeList.selectAll('div.time_range_item').each(function() {

			var $itemItem = d3.select(this),
				dVal = {};

			dVal.start = $itemItem.select('label.start').node().__ruleTimePicker.val();
			dVal.end = $itemItem.select('label.end').node().__ruleTimePicker.val();

			vals.push(dVal);
		});

		return vals;
	};

	timeRange.validate = function() {

		var passed = true,
			dVals = [];

		$timeList.selectAll('div.time_range_item').each(function() {

			var $itemItem = d3.select(this),
				dVal = {};

			dVal.start = $itemItem.select('label.start').node().__ruleTimePicker.val();
			dVal.end = $itemItem.select('label.end').node().__ruleTimePicker.val();

			dVal.$ele = $itemItem;

			if (dVal.start >= dVal.end) {

				passed = false;

				//console.log(dVal);

				iD.ui.TagEditor.toastr($itemItem, '开始时间需小于结束时间', {
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

					iD.ui.TagEditor.toastr(dVals[i].$ele, '时间范围有重合', {
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


	timeRange.setVal = function(data) {
		if (!data) return;
		$timeList.call(render, data);
	};

	timeRange.val = function(_) {

		if (!arguments.length) return timeRange.getVal();

		return timeRange.setVal(_);
	};

	timeRange.disable = function(disable) {
		$container.classed('no-pointer-events disabled', !!disable);
		refreshStat();
	};


	return d3.rebind(timeRange, event, 'on');
};