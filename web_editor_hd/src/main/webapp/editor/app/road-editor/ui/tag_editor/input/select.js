iD.ui.TagEditorInput.select = function(field) {

    var event = d3.dispatch('change'),
        select, allOptionList = [];

    function i(selection, opts, func) {
        select = selection.selectAll('select')
            .data([0]);

        select.enter().append('select');

        var fieldModel = opts.fieldModel;
		
		var optionData = [];
		if(fieldModel.fieldInput == 'radio'){
			let kvs = fieldModel.fieldType && fieldModel.fieldType.fieldTypeValues || [];
			for(let i in kvs){
				optionData.push({
					name: kvs[i].name,
					value: kvs[i].value
				});
			}
		}else {
			optionData = _.clone(fieldModel.fieldInput.values);
		}

        //插入空选项
//      optionData.unshift({
//          name: '==请选择==',
//          value: ''
//      });

        allOptionList = optionData;
        refreshOption(opts.tags || {}, func);
		/*
        var options = select.selectAll('option')
            .data(optionData);

        options.enter()
            .append('option');

        options.attr('value', function(o) {
                return o.value;
            })
            .attr('title', function(o) {
                return o.name;
            })
            .text(function(o) {
                return o.name;
            });
		*/
        select
            .on('blur', change)
            .on('change', change);
        
    }

    function change(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        t[field.key] = select.value() || undefined;
        event.change(t);
    }

    i.readOnly = function(readonly) {
        select.call(iD.ui.TagEditor.readOnly, readonly);
    }

    i.disable = function(disable) {
        select.call(iD.ui.TagEditor.disable, disable);
    }

    i.tags = function(tags) {
        var v = tags[field.key] || '';
        if (v == 'NULL') v = '';
        var tagList = field.fieldModel.fieldInput.values;
        var index = _.findIndex(tagList, { 'value': v});
        var tag = tagList[index];
		var name = tag ? tag.name : '';
		v = tag ? v : '';
        select.value(v);
		select.attr('title', name);
    }

    i.focus = function() {
//      select.node().focus();
        select.trigger('focus');
    }
    i.change = function() {
//      select.node().change();
		select.trigger('change');
    }
    // 刷新option标签是否显示
    i.refreshOption= refreshOption;
    
    function refreshOption(tags, func){
    	var optionList = _.cloneDeep(allOptionList);
    	var fieldModel = field.fieldModel;
    	
    	if(func instanceof Function){
    		optionList = func(optionList, tags) || optionList;
    	}else if(fieldModel.optionFilter instanceof Function){
    		optionList = fieldModel.optionFilter(optionList, tags);
    	}
    	var oldVal = select.value();
    	var newVals = _.pluck(optionList, 'value');
    	var options = select.selectAll('option')
            .data(optionList);
        options.enter()
            .append('option');
        options.attr('value', function(o) {
                return o.value;
            })
            .attr('title', function(o) {
                return o.name;
            })
            .text(function(o) {
                return o.name;
            });
        options.exit().remove();
        
        if(!_.include(newVals, oldVal)){
//      	select.value(newVals[0] || '0');
        	select.value(newVals[0]);
        }
        if(tags[field.key] == undefined){
//      	tags[field.key] = select.value();
        }
    }

    return d3.rebind(i, event, 'on');
};