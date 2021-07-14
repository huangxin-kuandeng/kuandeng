iD.ui.RoadRule.Select = function(options) {

	var event = d3.dispatch('change'),
		$select;

	options = _.assign({
		namePre: 'sel'
	}, options);

	var select = function(selection) {




        // if(d3.select("body").attr("role") =="check"
        //     ||(d3.select("body").attr("role") =="work" &&!iD.Static.layersInfo.isEditable(iD.data.DataType.HIGHWAY))){
		if(d3.select("body").attr("role") =="check"
            ||(d3.select("body").attr("role") =="work" && false)){
            $select = selection.append('select')
                .attr('class', 'select')
                .attr('name', function() {
                    return options.namePre + '_' + options.name;
                })
                .attr('disabled',true)
                .on('change', function() {

                    event.change(d3.select(this).property('value'), this);
                });
        }else{
            $select = selection.append('select')
                .attr('class', 'select')
                .attr('name', function() {
                    return options.namePre + '_' + options.name;
                })
                .on('change', function() {

                    event.change(d3.select(this).property('value'), this);
                });
        }

		$select.selectAll('option')
			.data(options.options)
			.enter()
			.append('option')
			.attr('value', function(d) {
				return d.value;
			})
			.text(function(d) {
				return d.label;
			});
	};

	select.getVal = function() {

		return $select.property('value');
	};

	select.setVal = function(_) {

		$select.property('value', _);
	};

	select.val = function(_) {

		if (!arguments.length) return select.getVal();

		return select.setVal(_);
	};

	return d3.rebind(select, event, 'on');
};