/**
 * 标记列表筛选
 * @param {Object} context
 */
iD.ui.InspectorTagFilter = function(context) {
	var dispatch = d3.dispatch('change', 'btn_search', 'btn_reset');
    var tagModelName;
    var intercept = 6;
    // 记录查询时间、参数
    var oldFilterTime = 0;
    var oldFilterParam = [];
    var oldFilterResultData;
    var networkFilters = ['TYPE', 'STATE', 'ADCODE'];
    var filterSelection;
    var d3_xhr;
    
    var _eventInit = false;

    function reIntercept() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        intercept = width > 1300 ? 6 : 3;
        intercept = width < 820 ? 1 : intercept;
    }
    
    function tagFilter(selection) {
    	filterSelection = selection;
    	var modelEntity = iD.ModelEntitys[tagModelName];
    	if(!modelEntity) return ;
    	reIntercept();
	    
    	if(!_eventInit){
    		context.event.on('saveend.inspectorTagFilter', function(){
    			if(!iD.Layers.getLayersByModelName(tagModelName).length){
    				return ;
    			}
		    	// 用之前的条件再次搜索
		    	oldFilterResultData = null;
//      		$search.dispatch('click');
    		});
		    _eventInit = true;
    	}
    	
    	// 筛选字段
    	var _writeTags = modelEntity.getFields(modelEntity.getGeoType()).map(function(d){
    		if(networkFilters.indexOf(d.fieldName) > -1){
    			return d;
    		}
    		return null;
    	});
	    _writeTags = _.compact(_writeTags);
	    _writeTags.unshift(...[{
	    	id: -3,
	    	fieldName: 'id',
	    	fieldTitle: 'ID',
	    	fieldInput: {
	    		type: 'text'
	    	},
	    	value: ''
	    }, {
	    	id: -2,
	    	fieldName: 'startCreateTime',
	    	fieldTitle: '起始时间',
	    	fieldInput: {
	    		type: 'text'
	    	},
	    	value: '',
	    	//  HH:mm:ss
	    	placeholder: 'yyyy-MM-dd'
	    }, {
	    	id: -1,
	    	fieldName: 'endCreateTime',
	    	fieldTitle: '结束时间',
	    	fieldInput: {
	    		type: 'text'
	    	},
	    	value: '',
	    	//  HH:mm:ss
	    	placeholder: 'yyyy-MM-dd'
	    }]);
	    
	    var oldParam = {};
	    (oldFilterParam || []).map(function(d){
	    	oldParam[d.k]  = d.v;
	    });
    	
        var $list = filterSelection.selectAll('.tag-list')
            .data([0]);
        $list.enter().append('ul')
            .attr('class', 'tag-list collapse-body');

        var $items = $list.selectAll('li')
            .data(_writeTags, function(d) {
                return d.id;
            });
            
        var $enter = $items.enter().append('li')
            .attr('class', 'tag-row cf')
            .attr('data-fld', function(d) {
                return d.fieldName;
            });

        $enter.append('div')
            .attr('class', 'key-wrap')
            .append('label')
            .attr('class', 'key KDSEditor-label');

        var $inputWrapPosition = $enter.append('div')
            .attr('class', 'input-wrap-position');
		
        $inputWrapPosition.each(function(d) {

            var that = this;
            //针对select类型，输出下拉列表框
            if (d.fieldInput.type === 'select') {

                var select = d3.select(that).append('select')
                    .attr('class', 'value');
                
                var subarr = [];
                
                d.fieldInput.values && d.fieldInput.values.filter(function(e){
            		subarr.push({
            			"name": e.name,
    					"value": e.value  
            		});
                });
                if (subarr.length > 0) {
                	var optionData = _.clone(subarr);
                } else {
                	var optionData = _.clone(d.fieldInput.values);
                }
                //插入空选项
//              optionData.unshift({
//                  name: '==请选择==',
//                  value: '',
//                  values: []
//              });

                var options = select.selectAll('option')
                    .data(optionData)
                    .enter()
                    .append('option')
                    .attr('value', function(o) {
                        return o.value;
                    })
                    .attr('title', function(o) {
                        return o.name;
                    })
                    .attr('label', function(o) {
                        return iD.util.substring(o.name, 8);
                    })
                    .text(function(o) {
                        return iD.util.substring(o.name, 8);
                    });

            } else {
                d3.select(that).append('input')
                    .property('type', 'text')
                    .property('placeholder', function(d){
                    	return d.placeholder || '';
                    })
                    .attr('class', 'value KDSEditor-input')
                    .attr('maxlength', function(item) {
                        return parseInt((item.size || 80), 10);
                    });
            }
        });

        // Update
        $items.order();

        $items.select('label.key')
            .html(function(d) {
                return iD.util.substring(d.fieldTitle, intercept);
            })
            .attr('title', function(d) {
                return d.fieldTitle;
            });

        //附加事件，填充值，必须创建完元素后设置，创建元素时设置值不起作用
        $items.select('input.value')
            .value(function(d) {
                return d.value;
            })
            .property('title', function(d) {
                return d.value;
            })
            .on('change', valueChange)
            .on('blur', valueChange)
	        .each(function(d) {
	            //获得所有options
	            var oldV = oldParam[d.fieldName] || '';
	            this.value = oldV;
	        });

        $items.select('select.value')
            .on('change.tag-filter', valueChange)
	        .each(function(d) {
	            //获得所有options
	            var oldV = oldParam[d.fieldName] || '';
	            d3.select(this).selectAll('option')
	                .each(function(option) {
	                    //如果当前option.value == 当前tag.value则选中
	                    d3.select(this).property('selected', option.value == oldV);
	                });
	        });

        $items.exit().remove();
        
        // buttons
        var $filterButtons = filterSelection.selectAll('.filter-buttons')
            .data([0])
            .enter()
            .append('div')
            .attr('class', 'filter-buttons');
        var $buttons = $filterButtons.selectAll('.btn-group')
        	.data([0]);
        
        $buttons.enter().append('div')
            .attr('class', 'btn-group');
        
        var $search, $clear, $download;
        $search = $buttons.append('button')
        	.attr('class', 'btn btn-default')
        	.text('搜索')
        	.on('click', function(){
        		// 点击搜索按钮时，清空记录的旧数据，重新搜索
        		oldFilterParam = [];
        		oldFilterResultData = null;
        		
        		dispatch.btn_search();
//      		$download.property('disabled', false);
        	});
        $download = $buttons.append('button')
        	.attr('class', 'btn btn-default')
        	.text('下载')
        	.on('click', function(){
				var params = getFilterParamArray();
				if(!params.length){
					Dialog.alert('请先增加筛选条件');
					return ;
				}
				params.unshift(...getFilterDefaultParam());
				// 下载之前可能更改参数，但是未点击搜索
        		$search.dispatch('click');
        		
				Dialog.alert('下载操作成功，请耐心等待');
		    	var modelName = tagModelName;
				var tagsParam = encodeURIComponent(JSON.stringify(params));
				var mergeParam = '?ifSortById=true&tags=' + tagsParam;
                // var dataUrl = iD.config.URL.kts + 'tag/data/app/' + modelName + '/query/' + modelName + '/toEcxel'+ mergeParam;
                var dataUrl = iD.config.URL.kd_tag + 'tag/osm/' + modelName + '/query?';
        		// download ...
        		window.open(dataUrl);
        	});
        $clear = $buttons.append('button')
        	.attr('class', 'btn btn-default')
        	.text('重置')
        	.on('click', function(){
        		filterSelection.selectAll('input,select').each(function(){
        			this.value = '';
        		});
        		oldFilterParam = [];
        		oldFilterResultData = null;
        		
        		dispatch.btn_reset();
        		
//      		$download.property('disabled', true);
        	});
    }
    
    function valueChange(d) {
        var param = getFilterParam();
        dispatch.change(param);
    }
    
    function getFilterParam(){
    	if(!filterSelection || !filterSelection.size()){
    		return {};
    	}
    	var param = {};
    	filterSelection.selectAll('input,select').each(function(d){
	    	if (!d) {
	    		d = this.parentNode.parentNode.__data__;
	    	}
	    	if(this.value != ''){
	    		param[d.fieldName] = this.value;
	    	}
    	});
    	return param;
    }
    
    function getFilterParamArray(){
    	var param = getFilterParam();
    	var result = [];
    	
    	for(var k in param){
    		param[k] != '' && result.push({
    			k: k,
    			op: 'eq',
    			v: param[k]
    		});
    	}
    	
    	return result;
    }
    
    function getFilterDefaultParam(){
    	return [{
    		k: 'TASKID',
    		op: 'eq',
    		v: ''+iD.Task.d.task_id
    	}];
    }
    
    function request(opts = {}) {
    	if(d3_xhr){
    		d3_xhr.abort();
    		d3_xhr = null;
    	}
        var bodyParam;
    	var url = opts.url;
    	if(opts.bodyParam){
    		bodyParam = opts.bodyParam;
    	}
        var callback = opts.callback || _.noop;
        if(_.isObject(bodyParam)){
	        d3_xhr = d3.json(url)
				.header("Content-Type", "application/json;charset=UTF-8")
				.post(JSON.stringify(bodyParam), function(error, data) {
		            callback(data);
				});
        	return ;
        }
        if((opts.type + '').toLowerCase() == 'post'){
	        d3_xhr = d3.json(url)
    			.header("Content-Type", "application/x-www-form-urlencoded")
				.post(_.map(opts.param, function(v, k){
					return k + '=' + (v || '');
				}).join('&'), function(error, data) {
		            callback(data);
				});
        	return ;
        }
        
        d3_xhr = d3.json(url, function(error, data) {
            if (error) {
                Dialog.alert('任务平台服务无响应，请重试');
                return;
            }

            callback(data);
        });
    }
    
    function loadNetworkTag(callback){
    	var bodyParam = getFilterDefaultParam();
    	bodyParam.push(...getFilterParamArray());
    	// 由于不点击搜索按钮时，也会通过地图事件触发重新渲染，防止频繁发送请求
    	// 搜索条件一致，并且存在上一次搜索结果
    	if(oldFilterResultData && oldFilterParam && _.isEqual(bodyParam, oldFilterParam)){
//  		console.log('filter 条件一致');
    		callback && callback(oldFilterResultData);
    		return ;
    	}
    	oldFilterParam = _.clone(bodyParam);
    	var modelName = tagModelName;
        var mergeParam = '?ifSortById=true';
        mergeParam += '&tagsJson=' + encodeURIComponent(JSON.stringify(bodyParam));
        // var dataUrl = iD.config.URL.kds_data + 'data/app/' + modelName + '/query/' + modelName + mergeParam;
        var dataUrl = iD.config.URL.kd_tag + 'tag/osm/' + modelName + '/query?' + mergeParam;
        
        request({
            url: dataUrl,
            type: 'get',
        	// bodyParam: bodyParam,
        	callback: function(data){
        		oldFilterResultData = data;
        		callback && callback(data);
        	}
        });
    }
    
    tagFilter.emptyFilter = function(){
    	return _.isEmpty(getFilterParam());
    }
    
    tagFilter.modelName = function(_){
    	if(!arguments.length) return tagModelName;
    	tagModelName = _;
    	return tagFilter;
    }
    
    tagFilter.show = function(){
    	filterSelection && filterSelection.classed('hidden', false);
    	return tagFilter;
    }
    tagFilter.hide = function(){
    	filterSelection && filterSelection.classed('hidden', true);
    	return tagFilter;
    }
    
    tagFilter.queryEntities = function(){
    	var isFilter = this.isFilterType();
		return new Promise(function(resolve){
	    	if(!isFilter){
		        resolve([]);
		        return ;
	    	}
	    	
	    	loadNetworkTag(function(data){
	    		var result = data && data.result && data.result.node || [];
	    		resolve(result);
	    	});
        });
    }
    
    tagFilter.isFilterType = function(){
		// return tagModelName == iD.data.DataType.AUTO_NETWORK_TAG;
		return false;
    }

    return d3.rebind(tagFilter, dispatch, 'on');
};
