iD.ui.RoadRule.WeekDay = function(options) {

    var event = d3.dispatch('change');

	var weekDay = function(selection) {
		
		var weekDayOpts = [
			{
				label: '周一',
				name: 'mon',
				value: '1'
			}, {
				label: '周二',
				name: 'tue',
				value: '2'
			}, {
				label: '周三',
				name: 'wed',
				value: '3'
			}, {
				label: '周四',
				name: 'the',
				value: '4'
			}, {
				label: '周五',
				name: 'fri',
				value: '5'
			}, {
				label: '周六',
				name: 'sat',
				value: '6'
			}, {
				label: '周日',
				name: 'sun',
				value: '7'
			},{
				label: '全选',
				name: 'all',
				value: '8'
			}];

		$container = selection;

		$checkList = selection.selectAll('label.check')
			.data(weekDayOpts);

		var $newChecks = $checkList.enter()
			.append('label')
			.attr('class', 'check');

		$newChecks.append('input')
			.attr('type', 'checkbox')
			.attr('class', 'inp-check');

		$newChecks.append('span')
			.attr('class', 'label');

		$checkList.selectAll('input.inp-check')
			.attr('name', function(d) {
				return 'weekday_' + d.name;
			})
			.attr('value', function(d) {
				return d.value;

			}).on('change', function(d) {

				if (d.name === "all") {

					if (this.checked) {
						weekDay.checkAll();
					} else {
						weekDay.uncheckAll();
					}

				} else {
					weekDay.refreshStat();
				}

				event.change(d, this);
			});

		$checkList.selectAll('span.label').html(function(d) {
			return d.label;
		});
	};

	weekDay.checkAll = function() {
		$checkList.selectAll('input.inp-check').property('checked', true);
		weekDay.refreshStat();
	};

	weekDay.uncheckAll = function() {
		$checkList.selectAll('input.inp-check').property('checked', false);
		weekDay.refreshStat();
	};

	weekDay.refreshStat = function() {

		var unCheckVals = [],
			checkVals = [],
			$allChecks = $checkList.selectAll('input.inp-check');

		$allChecks.each(function(d) {

			if (!this.checked) {
				unCheckVals.push(d.value);
			} else {
				checkVals.push(d.value);
			}
		});

		if (checkVals.indexOf("8") >= 0 ||

			(unCheckVals.length === 1 && unCheckVals[0] === "8")) {

			$allChecks.property('checked', true);
			unCheckVals.length = 0;

		}

		$allChecks.each(function(d) {

			if (d.value == "8") {
				return;
			}

			d3.select(this).property('disabled', unCheckVals.length === 0);
		});
	};

	weekDay.getVal = function() {

		weekDay.refreshStat();

		var vals = [],
			$allChecks = $checkList.selectAll('input.inp-check');

		$allChecks.each(function(d) {
			if (this.checked) {
				vals.push(d.value);
			}
		});

		if (vals.indexOf("8") >= 0) {

			vals = vals.filter(function(v) {
				return v != "8";
			});

		}

		return vals;
	};

	weekDay.setVal = function(vals) {

		if (!vals) {
			return false;
		}

		if (vals.length == 1 && vals[0] == "8") {
			//vals = vals.concat([0]);
		}

		$checkList.selectAll('input.inp-check').each(function(d) {

			if (vals.indexOf(d.value) >= 0) {
				this.checked = true;
			}
		});

		weekDay.refreshStat();
	};

	weekDay.val = function(_) {

		if (!arguments.length) return weekDay.getVal();

		return weekDay.setVal(_);
	};

	weekDay.disable = function(disable) {
		$container.classed('no-pointer-events disabled', !!disable);
	};

	return d3.rebind(weekDay, event, 'on');
};