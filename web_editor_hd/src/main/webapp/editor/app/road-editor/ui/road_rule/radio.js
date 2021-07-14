iD.ui.RoadRule.Radio = function(options) {

	var event = d3.dispatch('change'),
		$radioList, $container;

	var radio = function(selection) {

		$container = selection;

		$radioList = selection.selectAll('label.radio')
			.data(options.options);

		var $newChecks = $radioList.enter()
			.append('label')
			.attr('class', 'radio');

		$newChecks.append('input')
			.attr('type', 'radio')
			.attr('class', 'inp-radio');

		$newChecks.append('span')
			.attr('class', 'label');

		$radioList.selectAll('input.inp-radio')
			.attr('name', function(d) {
				return d.name || options.name;
			})
            .attr('disabled', function(d){
                return d.disabled;
            })
			.attr('value', function(d) {
				return d.value;

			}).on('click', function(d) {

				event.change(d, this);
			}).property('checked', function(d) {
				return !!d.default;
			});

		$radioList.selectAll('span.label').html(function(d) {
			return d.label;
		});
	};


	radio.getVal = function() {

		var val = null;

		$radioList.selectAll('input.inp-radio').each(function(d) {
			if (this.checked) {
				val = d.value;
				return false;
			}
		});

		return val;
	};

	radio.setVal = function(_) {

		$radioList.selectAll('input.inp-radio').each(function(d) {
			this.checked = d.value === _;
		});
	};

	radio.val = function(_) {

		if (!arguments.length) return radio.getVal();

		return radio.setVal(_);
	};

	radio.disable = function(disable) {
		$container.classed('no-pointer-events disabled', !!disable);
	};


	return d3.rebind(radio, event, 'on');
};