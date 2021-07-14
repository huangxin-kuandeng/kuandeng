iD.ui.StyleSettingList = function(context){
	var layerInfo,
		settings = [
			{key:'display',
				title:'是否标注',
				type:'select',
				values:[{name:true,title:'是'},{name:false,title:'否'}]},
			{key:'fieldKey',
				title:'标注字段',
				type:'select',
				values : []},
			{key:'fontSize',
				title:'标注文字大小',
				type:'select',
				values:[8,9,9.5,10,10.5,11,11.5,12,14,16,18,20,22,24,26]},
			{key:'fill',
				title:'标注文字颜色',
                glass: 'color-picker KDSEditor-input',
				type:'input'}
		];
	var styleSettingList = function(selection){		

		var _modelEntity = layerInfo.modelEntity(),
            _geoType = _modelEntity.getGeoType(),
            _fields = _modelEntity.getFields(_geoType),
            _label = layerInfo.label || {};	

        settings[1].values = _fields;

		var $wrap = selection.selectAll('.KDSEditor-inspector-inner')
					.data([0]);

		$wrap.enter().append('div')
			.attr('class','KDSEditor-inspector-inner');

		var $list = $wrap.selectAll('.tag-list')
					.data([0]);

		$list.enter().append('ul')
                .attr('class', 'tag-list');

        var $items = $list.selectAll('li')
            .data(settings, function(d) { return d.key; });

        var $enter = $items.enter().append('li')
                .attr('class', 'tag-row cf');

        $enter.append('div')
            .attr('class', 'key-wrap')
            .append('label')
            .attr('class', 'key KDSEditor-label');

        var $inputWrapPosition = $enter.append('div')
            .attr('class', 'input-wrap-position');

        $inputWrapPosition.each(function(d){
        	var that = this;
        	if(d.type === 'input'){
        		d3.select(that).append('input')
        			.property('type', 'text')
                    .attr('class', 'value '+ (d.glass ? d.glass : ''))
                    .attr('data-key',function(d){ return d.key;});
                
        	}
        	if(d.type === 'select'){
        		var select = d3.select(that).append('select')
                        .attr('class','value')
                        .attr('data-key',function(d){ return d.key;});

                select.selectAll('option')
                    .data(d.values)
                    .enter()
                    .append('option')
                    .attr('value',function(o){
                    	if(o instanceof Object){
                    		return o.name || o.fieldName;
                    	}
                    	return o;})
                    .text(function(o){ 
                    	if(o instanceof Object){
                    		if(o.title){
                    			return o.title;
                    		}
                    		return o.name || o.fieldName;
                    	}
                    	return o;
                    });
        	}
        });
		//Update
		$items.select('label.key')
                .html(function(d) { return d.title; })
                .attr('title',function(d){return d.title;});

        $items.select('select.value')
        	.each(function(d){
        		var _value = _label[d.key],
        			_that = this;
        		if(typeof _value !== 'undefined'){
        			d3.select(this)
        				.selectAll('option')
        				.each(function(item){
        					if(item instanceof Object){
        						this.selected = (item.name === _value );
        					}else{
        						this.selected = (item === _value );
        					}                			
            			});
        		}        		
        	});

        $items.select('input.value')
        	.each(function(d){
        		var _value = _label[d.key],
        			_that = this;
        		if(typeof _value !== 'undefined'){
        			d3.select(this)
        				.style('background',_value)
                		.style('color','#fff')
        				.value(_value);
        		}
        	});

        $items.exit().remove();

        $wrap.append('button')
        	.attr('class','KDSEditor-fr confirm')
        	.on('click',apply)
        	.append('span')        	
        	.text('应用');

        $items.select('input.color-picker')
            .on('click',function(){
                startColorPicker(this);
            })


       	function apply(){
       		var _labelInfo = {}
       			_value = '';

       		$inputWrapPosition.each(function(d){
       			var _thisObj = d3.select(this);
       			if(d.type === 'input'){
       				_value = _thisObj.select('input.value')
       							.value();
       			}
       			if(d.type === 'select'){
       				_thisObj.select('select.value')
						.selectAll('option')
						.each(function(item){
							if(this.selected){
								if(item instanceof Object){
	        						_value = item.name || item.fieldName;
	        					}else{
	        						_value = item;
	        					} 
							}
        					                			
            			});
       			}
       			_labelInfo[d.key] = _value;
       		});
       		layerInfo.label = _labelInfo;

       		//重新渲染地图
       		context.map().dimensions(context.map().dimensions());
       	}

	};
	styleSettingList.layerInfo = function(_){
        if (!arguments.length) return layerInfo;
        layerInfo = _;
        return styleSettingList;
    };
	return styleSettingList;
};