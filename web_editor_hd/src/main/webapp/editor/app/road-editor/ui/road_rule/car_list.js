iD.ui.RoadRule.CarList = function(options) {

	var event = d3.dispatch('change'),
		$checkList, $container;

    var allCar = "0";
	// var carOptions = iD.ui.RoadRule.CarList.carOptions,
	var carOptions = iD._attributeField.carOptions,
	currentLayer = options.currentLayer;

	var carList = function(selection) {

		$container = selection;

		$checkList = selection.selectAll('label.check')
			.data(carOptions);

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
				return 'car_' + d.id;
			})
			.attr('value', function(d) {
				return d.id;

			}).on('change', function(d) {

				if (d.id === allCar) {

					if (this.checked) {
						carList.checkAll();
					} else {
						carList.uncheckAll();
					}

				} else {
					carList.refreshStat();
				}

				event.change(d, this);
			})
			.property('disabled', function(d) {
				return !currentLayer || !currentLayer.editable || d.readOnly == '1';
			});

		$checkList.selectAll('span.label').html(function(d) {
			return d.name;
		});
	};

	carList.checkAll = function() {
		$checkList.selectAll('input.inp-check:not([value="13"]):not([value="14"])').property('checked', true);
		carList.refreshStat();
	};

	carList.uncheckAll = function() {
		$checkList.selectAll('input.inp-check:not([value="13"]):not([value="14"])').property('checked', false);
		carList.refreshStat();
	};

	carList.refreshStat = function() {

		var unCheckVals = [],
			checkVals = [],
			$allChecks = $checkList.selectAll('input.inp-check:not([value="13"]):not([value="14"])');

		$allChecks.each(function(d) {

			if (!this.checked) {
				unCheckVals.push(d.id);
			} else {
				checkVals.push(d.id);
			}
		});

		if (checkVals.indexOf(allCar) >= 0 ||

			(unCheckVals.length === 1 && unCheckVals[0] === allCar)) {

			$allChecks.property('checked', true);
			unCheckVals.length = 0;

		}

		$allChecks.each(function(d) {

			if (!iD.User.isWorkRole()) {
				if (d3.select(this).property('disabled')) return;
			}

			if (d.id === allCar) {
				return;
			}

			d3.select(this).property('disabled', unCheckVals.length === 0);
		});
	};

	carList.getVal = function() {

		carList.refreshStat();

		var vals = [],
			$allChecks = $checkList.selectAll('input.inp-check');

		$allChecks.each(function(d) {
			if (this.checked) {
				vals.push(d.id);
			}
		});

		if (vals.indexOf(allCar) >= 0) {

			vals = vals.filter(function(v) {
				return [allCar,'13','14'].includes(v);
			});

		}

		return vals;
	};

	carList.setVal = function(vals) {

		if (!vals) {
			return false;
		}

		if (vals.length == 1 && vals[0] == allCar) {
			//vals = vals.concat([0]);
		}

		$checkList.selectAll('input.inp-check').each(function(d) {

			if (vals.indexOf(d.id) >= 0) {
				this.checked = true;
			}
		});

		carList.refreshStat();
	};

	carList.val = function(_) {

		if (!arguments.length) return carList.getVal();

		return carList.setVal(_);
	};

	carList.disable = function(disable) {
		$container.classed('no-pointer-events disabled', !!disable);
	};


	return d3.rebind(carList, event, 'on');
};



// iD.ui.RoadRule.CarList.carOptions = [{
// 	id: 0,
// 	label: '????????????'
// }, {
// 	id: 1,
// 	label: '?????????'
// }, {
// 	id: 2,
// 	label: '?????????'
// }, {
// 	id: 3,
// 	label: '?????????/??????'
// }, {
// 	id: 4,
// 	label: '??????/??????'
// }, {
// 	id: 5,
// 	label: '???/??????'
// }, {
// 	id: 6,
// 	label: '????????????'
// }, {
// 	id: 7,
// 	label: '????????????'
// }, {
// 	id: 8,
// 	label: '?????????'
// }, {
// 	id: 9,
// 	label: '?????????'
// }, {
// 	id: 10,
// 	label: '?????????/?????????'
// }, {
// 	id: 11,
// 	label: '????????????4????????????'
// }, {
// 	id: 12,
// 	label: '?????????????????????'
// }, {
// 	id: 13,
// 	label: '??????'
// }, {
// 	id: 14,
// 	label: '14?????????'
// }];