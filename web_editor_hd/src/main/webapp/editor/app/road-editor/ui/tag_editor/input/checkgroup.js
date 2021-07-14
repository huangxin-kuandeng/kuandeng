iD.ui.TagEditorInput.checkgroup = function(field) {
    var event = d3.dispatch('change'),
        values = [],
        texts = [],
        value, box, text, label, d_value;

    //console.log(field);

    if (field.fieldType &&
        field.fieldType.fieldTypeValues) {

        var fVals = field.fieldType.fieldTypeValues;
		
		d_value = field.value.split(',');
        values = _.pluck(fVals, 'value');
        texts = _.pluck(fVals, 'name');
    }

    var checkgroup = function(selection) {

        selection.classed('checkselect', 'true');

        label = selection.selectAll('.preset-input-wrap')
            .data([0]);
		
		for (let k=0; k<values.length; k++){
			let v_value = values[k];
			let v_text = texts[k];
			let v_index = d_value.indexOf(v_value);
			let checkeds = (v_index > -1) ? true : false;
			
			var enter = label.enter().append('label')
			    .attr('class', 'preset-input-wrap');
			
			var check_box = enter.append('input')
			    //.property('indeterminate', field.type === 'check')
			    .attr('type', 'checkbox')
			    .attr('value', v_value)
			    .attr('class', 'preset-input-' + field.fieldName);
			check_box[0][0].checked = checkeds;
			
			enter.append('span')
			    .text(v_text)
			    .attr('class', 'value');
			
			box = label.select('input')
			    .on('click', function() {
			        var t = '';
					
					var field_class = '.preset-input-' + field.fieldName,
						field_dom = d3.selectAll(field_class);
					var field_checked = field_dom[0].filter(function(d){
						return d.checked == true;
					})
					var field_values = field_checked.map(function(c){
					    return c.value;
					})
			        t = field_values.join(',');
			        event.change(t);
			        // d3.event.stopPropagation();
			    });
			
			text = label.select('span.value');
		}
		
    };

    checkgroup.tags = function(tags) {
        value = tags[field.fieldName];

        box.property('indeterminate', !value);

        box.property('checked', value === 'yes' || value === '1');
        text.text(texts[values.indexOf(value)]);
        label.classed('set', !!value);
    };

    checkgroup.focus = function() {
        box.node().focus();
    };

    checkgroup.change = function(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        //t[field.fieldName] = values[(values.indexOf(value) + 1) % values.length];
        event.change(t);
    };

    checkgroup.readOnly = function(readonly) {
        box.call(iD.ui.TagEditor.readOnly, readonly);
        label.call(iD.ui.TagEditor.readOnly, readonly);
    }

    checkgroup.disable = function(disable) {
        box.call(iD.ui.TagEditor.disable, disable);
        label.call(iD.ui.TagEditor.disable, disable);
    }


    return d3.rebind(checkgroup, event, 'on');
};