/**
 * 级联菜单，tpl中fieldLinkGroup
 * @param {Object} field
 */
iD.ui.TagEditorInput.selectgroup = function(field) {

    var event = d3.dispatch('change'),
        select, $value, $valueWrap, 
        allOptionList = [],
        // id/option
        optionMap = {},
        fieldLinkGroup = [];

    function i(selection, opts) {
        select = selection.selectAll('select')
            .data([0]);
        select.enter().append('select').attr('class', 'tpl_input_selectgroup');
        $valueWrap = selection.selectAll('div.tpl_selectgroup_values')
            .data([0]);
        $value = $valueWrap.enter().append('div').attr('class', 'tpl_selectgroup_values tpl-dropdown')
        	.append('a').attr('class', 'tpl_value');
        
        var fieldModel = opts.fieldModel;
        var fieldTpl = opts.fieldTpl;
        fieldLinkGroup = fieldTpl.fieldLinkGroup || [];
        
		var optionData = _.cloneDeep(fieldModel.fieldInput.values);
		optionData.forEach((d)=>{d.key = field.key});
		optionMap = _.zipObject(_.pluck(optionData, 'id'), optionData);
		allOptionList.push(...optionData);
		
		_.each(fieldTpl.fieldLinkGroup, function(fieldName){
			var fm = opts.fields[fieldName];
			if(!fm || !fm.fieldInput) return ;
			var optionList = _.cloneDeep(fm.fieldInput.values);
			optionList.forEach((d)=>{d.key = fieldName});
			_.extend(optionMap, _.zipObject(_.pluck(optionList, 'id'), optionList));
			allOptionList.push(...optionList);
		});
		
        refreshOption(opts.tags || {});
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
        
        $value.on('click.tpl_selectgroup', function(){
        	if(select.property('readOnly') || select.property('disabled') || select.classed('readonly') || select.classed('disabled')){
        		$valueWrap.classed('open', false);
        		return false;
        	}
        	$valueWrap.classed('open', !$valueWrap.classed('open'));
        	return false;
        });
        $(selection.node()).parent()
        	.off('mouseleave')
        	.on('mouseleave', function(){
	        	$valueWrap.classed('open', false);
	        	return false;
	        });
        
        $valueWrap.selectAll('li').on('click', function(){
        	var d = this.__data__;
        	if(!d) return ;
        	var tags = getTagsById(d.id);
//      	var tags = getLinkTagsById(d.id);
        	console.log('点击菜单', tags);
        	$valueWrap.classed('open', false);
        	$valueWrap.selectAll('.open').classed('open', false);
        	i.tags(tags);
        	i.change();
//      	d3.event.stopImmediatePropagation();
        	d3.event.stopPropagation();
        	return false;
        });
        
        var $jwrap = $($valueWrap.node());
        $jwrap.find('li').off('mouseenter mouseleave').hover(function(){
        	var $this = $(this);
        	$this.addClass('open').find('li').removeClass('open');
        	var $menu = $this.children('ul.tpl-dropdown-menu');
        	var offset = $this.offset();
        	
        	$menu.css({
        		position: 'fixed',
        		left: offset.left + $this.outerWidth(),
        		top: offset.top  - $menu.outerHeight() / 2
        	});
        }, function(){
        	var $this = $(this);
        	$this.removeClass('open').find('li').removeClass('open');
        });
    }

    function change(t) {
    	/*
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        t[field.key] = select.value() || undefined;
        */
        var t = getSelectedTags();
        event.change(t);
    }

    i.readOnly = function(readonly) {
        $valueWrap.classed('open', false);
        select.call(iD.ui.TagEditor.readOnly, readonly);
    }

    i.disable = function(disable) {
        $valueWrap.classed('open', false);
        select.call(iD.ui.TagEditor.disable, disable);
    }

    i.tags = function(tags) {
        $valueWrap.classed('open', false);
    	select.node().value = getOptionValueByTags(tags);
        updateDisplayText();
    }
    
    i.focus = function() {
        $valueWrap.classed('open', false);
        select.trigger('focus');
    }
    i.change = function() {
        $valueWrap.classed('open', false);
		select.trigger('change');
    }
    // 刷新option标签是否显示
    i.refreshOption= refreshOption;
    
    function refreshOption(tags, func){
        $valueWrap.classed('open', false);
        
    	var optionList = _.cloneDeep(allOptionList);
    	var fieldModel = field.fieldModel;
    	
    	if(func instanceof Function){
    		optionList = func(optionList, tags);
    	}else if(fieldModel.optionFilter instanceof Function){
    		optionList = fieldModel.optionFilter(optionList, tags);
    	}
    	var oldVal = select.value();
    	var options = select.selectAll('option')
            .data(optionList);
        options.enter()
            .append('option');
        options.attr('value', function(o) {
//              return o.value;
                return getOptionValueByData(o);
            })
            .attr('title', function(o) {
                return o.name;
            })
            .text(function(o) {
                return o.name;
            });
        options.exit().remove();
        var newVals = _.pluck(select.node().options, 'value');
        
        var menuData = _.groupBy(rootOpts, function(o){
        	return o.parentId || 'delete';
        });
        delete menuData['delete'];
        
//      [field.key].concat(fieldLinkGroup);
        var rootOpts = filterOptionByKey(optionList, field.key);
        var $menuWrap = renderMenu($valueWrap, rootOpts);
        
//      var preFieldName = field.key;
        for(let fieldName of fieldLinkGroup){
        	var subOpts = filterOptionByKey(optionList, fieldName);
        	// preFieldName
        	$menuWrap = renderSubMenu($menuWrap, subOpts);
//      	preFieldName = fieldName;
        }
        
        if(!_.include(newVals, oldVal)){
//      	select.value(newVals[0] || '0');
        	select.node().value = getOptionValueByTags(tags);
        }
        if(tags[field.key] == undefined){
        	_.extend(tags, getSelectedTags());
        }
        updateDisplayText();
    }
    
    function getOptionValueByData(o){
    	var list = getTagDataById(o.id, true);
		var vals = _.map(list, function(d){
			return d.key + d.value;
		});
		return vals.join('');
    }
    
    function getOptionValueByTags(tags){
    	var keyList = [field.key].concat(fieldLinkGroup);
    	var result = '';
		// 级联菜单中最靠后的值优先赋值
		for(var i = 0; i < keyList.length; i++){
			var fieldName = keyList[i];
			if(tags[fieldName] == null || tags[fieldName] == '') continue;
			v = tags[fieldName];
			result += (fieldName + v);
		}
		return result;
    }
    
    function filterOptionByKey(optionList, fieldName){
    	return optionList.filter((o)=>{return o.key == fieldName});
    }
    
    function renderMenu($wrap, dataList){
    	var fieldName = dataList[0].key;
    	var $menuWrap = $wrap.selectAll('ul.tpl-dropdown-menu')
            .data([0]);
        $menuWrap.enter().append('ul').attr('class', 'tpl-dropdown-menu').attr('data-field', fieldName)
        	.selectAll('li').data(dataList).enter()
        	.append('li')
        	.append('span').text(function(d){
        		return d.name;
        	}).attr('title', function(d){
        		return d.name;
        	})
        return $menuWrap;
    }
    function renderSubMenu($wrap, dataList){
    	// parentFieldName
    	var fieldName = dataList[0].key;
    	var menuData = _.groupBy(dataList, function(o){
        	return o.parentId || 'delete';
        });
        delete menuData['delete'];
//  	var $parentWraps = $wrap.selectAll('ul.tpl-dropdown-menu[data-field=' + parentFieldName + ']');
//  	var $menuWrap = $parentWraps.selectAll('ul.tpl-dropdown-menu')
//          .data([0]);
		$wrap.selectAll('li').each(function(){
			var $li = d3.select(this);
			var parent = $li.datum();
			if(!parent){
				return ;
			}
			var sublist = menuData[parent.id];
			if(!sublist || !sublist.length){
				return ;
			}
			$li.classed('tpl-dropdown', true);
			var $menuWrap = $li.selectAll('ul.optiongroup-menu')
	            .data([0]);
	        $menuWrap.enter().append('ul').attr('class', 'tpl-dropdown-menu').attr('data-field', fieldName)
	        	.selectAll('li').data(sublist).enter()
	        	.append('li')
	        	.append('span').text(function(d){
	        		return d.name;
	        	}).attr('title', function(d){
	        		return d.name;
	        	})
		});
		
		var $menuWrap = $wrap.selectAll('ul[data-field=' + fieldName + ']');
        return $menuWrap;
    }
    
    function updateDisplayText(){
        $value.text(getSelectedText());
    }
    
    function getSelectedText(){
    	var defVal = '请选择...';
    	var selected = select.node().selectedOptions;
    	if(!selected || !selected.length){
    		return defVal;
    	}
    	var d = selected[0].__data__;
    	var list = getTagDataById(d.id, true);
    	return _.pluck(list, 'name').join(',') || defVal;
    }
    
    /**
     * 
     * @param {String} id
     * @param {Boolean} reverse 默认false，当前id优先，否则当前id到最后
     */
    function getTagDataById(id, reverse){
    	
    	function _fun(id, _tmpList){
    		var list = _tmpList || [];
    		var d = optionMap[id];
    		if(!d.parentId){
    			list.push(d);
    			return list;
    		}
    		list.push(d);
    		_fun(d.parentId, list) || [];
    		return list;
    	}
    	
    	var result = _fun(id);
    	result.reverse();
    	return result;
    }
    
    /**
     * 获取当前选项的tags
     * @param {Boolean} linked 默认true，使用级联字段组中的字段赋默认值
     */
    function getSelectedTags(linked = true){
    	var selected = select.node().selectedOptions;
    	if(!selected || !selected.length){
    		return {};
    	}
    	var d = selected[0].__data__;
    	if(linked){
    		return getLinkTagsById(d.id);
    	}
    	return getTagsById(d.id);
    }
    
    function getTagsById(id){
    	var d = optionMap[id];
    	if(!d.parentId){
    		return {[d.key] : d.value};
    	}
    	var tags = getTagsById(d.parentId) || {};
    	tags[d.key] = d.value;
    	return tags;
    }
    
    function getLinkTagsById(id){
    	var tags = getTagsById(id);
    	/*
    	var selected = select.node().selectedOptions;
    	if(!selected || !selected.length){
    		return {};
    	}
    	var typestr = selected[0].value;
    	for(let fieldName of fieldLinkGroup){
    		var rst = typestr.match(new RegExp(fieldName + '(-?\\d+)'));
    		var val = rst && rst[1] || '';
    		tags[fieldName] = val;
    	}
    	*/
    	for(let fieldName of fieldLinkGroup){
    		tags[fieldName] = tags[fieldName] || '';
    	}
    	return tags;
    }

    return d3.rebind(i, event, 'on');
};