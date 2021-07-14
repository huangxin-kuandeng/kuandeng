iD.ui.LeftBarElement.dropdownMaker = function() {
	var maker  = function(selection, title) {
		selection.classed('dropdown-maker', true);
		var header = selection.append('div').classed('head', true).text(title);
		header.on('click', function() {
			selection.classed('close', !selection.classed('close'));
		});
		selection.append('div').classed('body', true);
	};
	return maker;
}