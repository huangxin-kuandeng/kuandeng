iD.ui.UsernameDropdown = function(context) {
	var User = iD.User;
	var Dropdown = function(selection, dispatch) {
		var currentActive = 0;
		var length = 0;
		var items;
		dispatch.on('dropdown', function(data) {
			selection.selectAll('div').remove();
			selection.classed('show', true);

			var content = selection.selectAll('div.dropdown-item').data(data);
			items = content.enter().append('div').classed('dropdown-item', true).text(function(d) {
				return d;
			}).classed('active', function(d, i) {
				return i === 0;
			});
			length = items[0].length;
			items.on('mouseenter', function(d, i) {
				items.classed('active', false);
				d3.select(this).classed('active', true);
				currentActive = i;
			}).on('mousedown', function(d) {
				dispatch.username(d);
			});
			content.exit().remove();
		});

		dispatch.on('dropdownoff', function() {
			selection.classed('show', false);
			selection.selectAll('div').remove();
		});

		dispatch.on('key', function(key) {
			switch (key) {
				case 13:
					var username = d3.select(items[0][currentActive]).data()[0];
					dispatch.username(username);
					break;
				case 38:
					currentActive--;
					if (currentActive < 0) {
						currentActive = length - 1;
					}
					items.classed('active', false);
					d3.select(items[0][currentActive]).classed('active', true);
					break;
				case 40:
					currentActive++;
					if (currentActive >= length) {
						currentActive = 0;
					}
					items.classed('active', false);
					d3.select(items[0][currentActive]).classed('active', true);
					break;
				default:
					break;
			}
		});
	}

	return Dropdown;
}
