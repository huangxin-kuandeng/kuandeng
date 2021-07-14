/**
 *  三级联动的selects，目前只有modelName为POI，以及fieldName为POI_TYPE时会使用
 * @param {Object} field
 */
iD.ui.TagEditorInput.mulselect = function(field) {

    var event = d3.dispatch('change'),
        selectMuls = [],
        fieldModel;
    
    var mulPoiTypeList;
    var mulSplitReg = /\B(?=(?:\d{2})+\b)/g;

    function func(selection, opts) {
    	fieldModel = opts.fieldModel;
    	mulPoiTypeList = iD.util.getTagMulDatas_POI_TYPE(fieldModel.fieldInput.values || []);

        let $selects = selection.selectAll('select')
            .data([0, 1, 2]);

        $selects.enter().append('select');
        var nowValue = opts.tags[field.key] || fieldModel.value || fieldModel.defaultValue || '';
        
        $selects.each(function(selectIndex){
        	selectMuls[selectIndex] = d3.select(this);
        }).each(function(){
        	refreshSelectOptions(d3.select(this), nowValue);
        });
        
        $selects
        	.on('change', selectMulsChange);
        	//.on('blur', selectMulsChange);
        
        function selectMulsChange(){
        	var $this = d3.select(this);
        	var sidx = $this.datum();
        	var maxIdx = selectMuls.length - 1
        	if(sidx < maxIdx){
        		// 刷新后续选择框，选择框默认会选中第一条option
        		let _count = 0;
        		for(let i = sidx; i<maxIdx; i++){
        			_count ++;
        			refreshSelectOptions(selectMuls[sidx + _count]);
        		}
        		change.call(this);
        	}else if(sidx == maxIdx){
        		// 最后一个
        		change.call(this);
        	}
        }
        
		/*
		var optionData = _.clone(fieldModel.fieldInput.values);
        //插入空选项
        optionData.unshift({
            name: '==请选择==',
            value: ''
        });


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

        select
            .on('blur', change)
            .on('change', change);
        */
    }

    function change(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        if(selectMuls.length >0){
        	t[field.key] = selectMuls[selectMuls.length - 1].value() || undefined;
        }
        event.change(t);
    }
    
    function refreshSelectOptions($select, newValue){
    	let sidx = $select.datum();
    	
    	let optionData = [];
//  	let optionData = [{
//          name: '==请选择==',
//          value: '',
//      }];
        optionData = optionData.concat( _.values(getOptionsBySelectIndex(sidx)) );
        
        // 最后一个select会加上前缀
        let prevVals = [];
        if(sidx == selectMuls.length -1){
	        for(let i=0; i<sidx; i++){
				let prev = selectMuls[i].value();
				prevVals.push(prev);
			}
        }
        // 清空后续
        selectMuls.slice(sidx, selectMuls.length).forEach(function(select){
        	let selectDom = select.node();
        	if(selectDom.options.length){
        		select.html(selectDom.options[0].outerHTML);
        	}
        	select.node().value = '';
        });
    	
    	var $options = $select.selectAll('option')
            .data(optionData);
        $options.enter().append('option')
	        .attr('value', function(o) {
	            return o.value && (prevVals.join('') + o.value) || o.value;
	        })
	        .attr('title', function(o) {
	            return o.name;
	        })
	        .text(function(o) {
	            return o.name;
	        });
        $options.exit().remove();
        
		if(newValue != undefined){
			let nowVals = newValue.split(mulSplitReg);
			// 第一级：01
			// 第二级：    00
			// 第三级：010000
			if(nowVals.length > 0){
				$select.node().value = prevVals.join('') + (nowVals[sidx] || '');
			}
		}else {
			// 默认选择第一个
			//  && newValue == undefined
	        if($options.size() > 1){
	    		$select.node().value =  d3.select($options[0][1]).attr('value');
	        }else {
	        	$select.node().value = '';
	        }
		}
    }
    
    function getOptionsBySelectIndex(index){
    	if(index==0){
    		return mulPoiTypeList;
    	}else {
    		let result = mulPoiTypeList;
    		for(let i=0; i<index; i++){
    			let prev = selectMuls[i].value();
    			result = result[prev] && result[prev].children || [];
    		}
    		return result;
    	}
    }

    func.readOnly = function(readonly) {
    	selectMuls.forEach(function(select, idx){
    		select.call(iD.ui.TagEditor.readOnly, readonly);
    	});
    }

    func.disable = function(disable) {
    	selectMuls.forEach(function(select, idx){
    		select.call(iD.ui.TagEditor.disable, disable);
    	});
    }

    func.tags = function(tags) {
    	var values = (tags[field.key] || '').split(mulSplitReg);
        selectMuls.forEach(function(select, idx){
        	let val = values[idx];
        	if(!val){
        		return ;
        	}
        	if(idx == selectMuls.length - 1){
        		select.value(values.join(''));
        	}else {
        		select.value(val);
        	}
        });
    };

    func.focus = function() {
    	selectMuls.forEach(function(select, idx){
    		select.node().focus();
    	});
    };
    func.change = function() {
    	selectMuls[selectMuls.length - 1].node().change();
    };

    return d3.rebind(func, event, 'on');
};