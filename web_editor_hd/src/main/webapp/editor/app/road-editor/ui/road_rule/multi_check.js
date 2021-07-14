iD.ui.RoadRule.MultiCheck = function(options) {

	var event = d3.dispatch('change'),
		$checkList, $container;

	options = _.assign({
		namePre: 'multicheck'
	}, options);

	var multiCheck = function(selection) {

		$container = selection;

		$checkList = selection.selectAll('label.check')
			.data(options.options);

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
				return options.namePre + '_' + d.name;
			})
			.attr('value', function(d) {
				return d.value;

			}).on('click', function(d) {

				event.change(d, this);
			});

		$checkList.selectAll('span.label').html(function(d) {
			return d.label;
		});
	};

	multiCheck.getVal = function() {

		var vals = {};

		$checkList.selectAll('input.inp-check').each(function(d) {
			if (this.checked) {
				vals[d.name] = d.value;
			}
		});

		return vals;
	};

	multiCheck.setVal = function(vals) {

		if (!vals) {
			return false;
		}

		var isValArr = _.isArray(vals);

		$checkList.selectAll('input.inp-check').each(function(d) {

			if (!isValArr) {
				this.checked = (vals[d.name] === d.value);
				
			} else {
				this.checked = vals.indexOf(d.value) >= 0;

			}
		});
	};

	multiCheck.val = function(_) {

		if (!arguments.length) return multiCheck.getVal();

		return multiCheck.setVal(_);
	};

	multiCheck.disable = function(disable, flag) {
		$container.classed('no-pointer-events disabled', !!disable);
	};

	return d3.rebind(multiCheck, event, 'on');
};