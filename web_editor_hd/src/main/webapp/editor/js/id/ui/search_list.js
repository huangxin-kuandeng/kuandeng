iD.ui.SearchList = function(context){
	var layerInfo,
		pageIndex = 1,
		pageSize = 10,
		total = 0,
		dataResultsObj = {};

	var searchList = function(selection){

        //绘制列表内容容器
        var listWrap = selection.selectAll('.KDSEditor-inspector-body')
        					.data([0])
        					.enter()
        					.append('div')
        					.attr('class', 'KDSEditor-inspector-body');

        var list = listWrap.append('div')
            .attr('class', 'KDSEditor-feature-list cf');

        var searchHeaderWrap = selection.selectAll('.search-header')
        						.data([0])
        						.enter()
        						.append('div')
            					.attr('class', 'search-header');
        //绘制查询头
        var _modelEntity = layerInfo.modelEntity(),
            _geoType = _modelEntity.getGeoType(),
            _fields = _modelEntity.getFields(_geoType);	

        var conditionWrap = searchHeaderWrap.append('span'),
        	fieldsSelect = conditionWrap.append('select')
        						.attr('class','fields'),
        	fieldsConditionSelect = conditionWrap.append('select')
        						.attr('class','condition');

        var fieldsSelectItems = fieldsSelect.selectAll('option')
            .data(_fields,function(d){ return d.id; });

        var fieldsSelectEnter = fieldsSelectItems.enter()
            .append('option')
            .attr('value',function(d){return d.fieldName;})
            .text(function(d){ return d.fieldTitle === '' ? d.fieldName : d.fieldTitle ;});

        fieldsSelectItems.exit().remove();

        fieldsConditionSelect.selectAll('option')
            .data([{title:'Like',value:0},{title:'Equal',value:1}])
            .enter()
            .append('option')
            .attr('value',function(o){return o.value;})
            .text(function(o){ return o.title ;});

        var input = searchHeaderWrap.append('span')
			.append('input')
            .attr('placeholder', t('inspector.search'))
            .attr('type', 'search')
            .on('keypress', keypress);

        function keypress() {
            if (d3.event.keyCode === 13) {
                searchSubmit();
            }
        }
        //绘制查询结果列表
        function drawList() {    

        	var entities = filterEntity(dataResultsObj.entities);   	

            var noResultsWorldwide = entities.length === 0;

            var resultsIndicator = list.selectAll('.no-results-item')
                .data([0])
                .enter().append('button')
                .attr('class', 'no-results-item');

            resultsIndicator.append('span')
                .attr('class', 'KDSEditor-icon alert');

            resultsIndicator.append('span')
                .attr('class', 'entity-name');

            list.selectAll('.no-results-item .entity-name')
                .text(noResultsWorldwide ? t('geocoder.no_results_worldwide') : t('geocoder.no_results_visible'));

            list.selectAll('.no-results-item')
                .style('display', noResultsWorldwide ? 'block' : 'none');

            list.selectAll('.KDSEditor-feature-list-item')
                .data([-1])
                .remove();

            var items = list.selectAll('.KDSEditor-feature-list-item')
                .data(entities, function(d) { return d.id; });

            var enter = items.enter().append('button')
                .attr('class', 'KDSEditor-feature-list-item')
                .on('click',find);

            var label = enter.append('div')
                .attr('class', 'label');

            label.append('span')
                .attr('class', 'entity-type')
                .text(function(d) { return iD.Entity.id.toOSM(d.id); });

            label.append('span')
                .attr('class', 'entity-name')
                .text(function(d) { return d.tags[getFieldKey().name] || ''; });

            enter.style('opacity', 0)
                .transition()
                .style('opacity', 1)
				.style('position', 'relative')
				.style('border-bottom', '1px solid #ccc')
				.style('border-radius', 0);

            items.order();

            items.exit()
                .remove();
            
          var $header = list.insert('button', '.no-results-item')
          .attr('class', 'KDSEditor-feature-list-item')
          .append('div')
          .attr('class','label');
	      $header.append('span')
	          .attr('class', 'entity-type')
	          .text('编号');
	      $header.append('span')
	          .attr('class', 'entity-name')
	          .text('名称');
			
          $header
				.style('position', 'relative')
				.style('border-bottom', '1px solid #ccc')
				.style('border-radius', 0);			
        }

        //初始化分页
        function initPagination(){
        	var $list = listWrap.selectAll('.pagination')
        		.data([0]);

        	var $enter = $list.enter()
        		.append('div')
        		.attr('class','pagination')
        		.call(bootstrap.pagination()
        				.pageIndex(pageIndex)
        				.pageSize(pageSize)
        				.total(total)
        				.on('change',function(_pageIndex){
        					//开始请求数据
				            searchRequest(_pageIndex,pageSize,function(data){
				            	dataResultsObj  = data;
				            	drawList();
				            });
        				}));
    		$list.exit()
            	.remove();
        }

        //线和面返回结果包含node和way
        //对于这种情况只筛选way
        //这块看着很别扭，可以在优化
        function filterEntity(_){
        	var entities = [];
        	if(_ && _.length > 0){
        		for (var i = 0, l = _.length; i < l; i++) {
        			var currentEntity = _[i];
        			if(layerInfo.type !== 'point'){
        				//挑选way
        				if(currentEntity instanceof iD.Way){
        					entities.push(currentEntity);
        				}
        			}else{
        				entities.push(currentEntity);
        			}
        		};
        	}
        	return entities;
        }

        //定位
        function find(d){
        	var entity = context.graph().hasEntity(d.id);
        	if(d.loc && (d.loc[0]>180 || d.loc[1] > 90)){
            	d.loc[0]/=10000;
            	d.loc[1]/=10000;
            }
        	if(entity && d.entity){
        		context.enter(iD.modes.Select(context, [d.entity.id]));
        	}else{
        		context.loadEntity(d.id,true,layerInfo);
        	}
        }

        //开始查询
        function searchSubmit() {
            d3.event.preventDefault();

            //开始请求数据
            searchRequest(1,pageSize,function(data){
            	dataResultsObj  = data;
            	pageIndex = parseInt(dataResultsObj.pageIndex,10) || pageIndex;
	        	pageSize = parseInt(dataResultsObj.pageSize,10) || pageSize;
	        	total = parseInt(dataResultsObj.count,10) || total;
            	drawList();
            	initPagination();
            });
        }

        function getFieldKey(){
        	return fieldsSelect.selectAll('option')
        						.filter(function(){return this.selected;}).datum();
        }

        //查询
        function searchRequest(pageIndex,pageSize,callback){ 
        	//组合条件查询值
        	var fieldsKey = getFieldKey().columnName,
        		conditionValue = fieldsConditionSelect.selectAll('option')
        						.filter(function(){return this.selected;}).attr('value'),
        		q = input.value()
        				.trim(),
        		filter = '';
console.log(getFieldKey());
        	filter = q.length === 0 ? '' : 'and '+ fieldsKey + (conditionValue === '0' ? " like '%" + q + "%'" : " ='" + q +"'");

        	//模糊匹配
        	if(conditionValue === '0' && q.length==0)
            {
                filter = '';
            }
            //完全匹配
            if(conditionValue === '1' && q.length==0)
            {
                filter = "and ("+fieldsKey+" is null)";
            }
        	console.info(filter);      	
        	context.connection().loadSearchResult(filter,layerInfo,pageIndex,pageSize,callback);
        }
	};
	searchList.layerInfo = function(_){
		if (!arguments.length) return layerInfo;
        layerInfo = _;
        return searchList;
	};
	return searchList;
};