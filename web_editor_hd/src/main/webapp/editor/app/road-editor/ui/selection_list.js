iD.ui.SelectionList = function(context, selectedIDs) {
	function visibleFilter(entity){
		if(!entity) return  false;
		var blanks = context.variable.blankFieldList || [];
		return !blanks.includes(entity.modelName);
	}
	function selectEntity(entity){
		var graph = context.graph();
		if(entity.geometry(graph) != iD.data.GeomType.RELATION){
			context.enter(iD.modes.Select(context, [entity.id], null, true)
				.newFeature(true));
			return ;
		}
		
		var selectid = entity.id;
		var $sidebar = d3.select("#KDSEditor-sidebar");
		if($sidebar.size() && $sidebar.attr("data-multiselectids") && $sidebar.attr("data-member-multiselectids")){
			var rids = $sidebar.attr("data-multiselectids").split(',');
			var mids = $sidebar.attr("data-member-multiselectids").split(',');
			selectid = mids[rids.indexOf(entity.id)];
		}
		
		context.enter(iD.modes.Select(context, [selectid], null, true)
				.newFeature(true));
		// 显示的是关系属性列表，高亮的是成员
		// iD.util.entityRelationFooterHighlightSelector(entity, context, true);
	}

    function selectionList(selection) {
        selection.classed('selection-list-pane', true);

        var header = selection.append('div')
            .attr('class', 'KDSEditor-header KDSEditor-fillL cf');

        header.append('h3')
            .text(t('inspector.multiselect'));

        var listWrap = selection.append('div')
            .attr('class', 'KDSEditor-inspector-body');
        
	    var $filter = listWrap.append('div')
	        .attr('class', 'KDSEditor-feature-filter cf');
	    var listFilter = new ListFilter($filter);
	    
        var $header = listWrap.append('div')
            .attr('class', 'KDSEditor-feature-header cf');
        
        var list = listWrap.append('div')
            .attr('class', 'KDSEditor-feature-list cf');
        
        context.history().on('change.selection-list', drawList);
        drawList();

        function drawList() {
            var entities = selectedIDs
                .map(function(id) { return context.hasEntity(id); })
                .filter(visibleFilter);
            
            var modelNames = _.compact(_.uniq(_.pluck(entities, 'modelName')));
            var onlyRelation = true;
            for(var mname of modelNames){
            	var modelEntity = iD.ModelEntitys[mname];
            	// relation
            	if(modelEntity && modelEntity.type() != 0){
            		onlyRelation = false;
            	}
            }
            listWrap.classed('only-relation', onlyRelation);
            $header.html('');
            $header.append('div').text('类型').attr('class', 'feature-head');
            $header.append('div').text('本身id').attr('class', 'feature-head');
            $header.append('div').text('排序id').attr('class', 'feature-head');
            $header.append('div').text('成员').attr('class', 'feature-head membernum');

            var items = list.selectAll('.KDSEditor-feature-list-item')
                .data(entities, iD.Entity.key);

            var enter = items.enter().append('button')
                .attr('class', 'KDSEditor-feature-list-item')
                .on('click', function(entity) {
                    d3.event._isFromList = true;
                   // addMultiEditorFooter(entity); //都移入到raw_tag_editor里使用--Tilden
                   selectEntity(entity);
                });

            // Enter

            var label = enter.append('div')
                .attr('class', 'label');

            label.append('span')
//              .attr('class', 'KDSEditor-icon KDSEditor-icon-pre-text')
                .append('span').attr('class', 'KDSEditor-icon');

            label.append('span')
                .attr('class', 'entity-type');

            label.append('span')
                .attr('class', 'entity-name');
            
            label.append('span')
                .attr('class', 'entity-membernum');

            // Update

            items.selectAll('.KDSEditor-icon')
            	// KDSEditor-icon-pre-text
                .attr('class', function(entity) { return context.geometry(entity.id) + ' KDSEditor-icon'; });

            items.selectAll('.entity-type')
                .text(function(entity) { 
                    //return context.presets().match(entity, context.graph()).name(); 
//                  return iD.util.displayTypeName(entity,null,context); 
                    return iD.Entity.id.toOSM(entity.id); 
                });

            items.selectAll('.entity-name')
                .text(function(entity) { 
                    return iD.util.displayName(entity, null); 
                });
            
            items.selectAll('.entity-membernum')
                .text(function(entity) { 
                    return entity.members && entity.members.length || 0;
                });

            // Exit

            items.exit()
                .remove();
            
            listFilter.sortSelectionList(items);
            listFilter.on('change', function(param){
            	listFilter.sortSelectionList(items, param);
            });

            function locationEntity(entity) {
                var selExtent = iD.geo.Extent(),
                    map = context.map(),
                    graph = context.graph();
                var oldExtentArea = selExtent.area() || 1;

                selExtent = selExtent.extend(entity.extent(graph));

                map.extent(selExtent);
            }
        /*
             增加 左侧底部增加批量修改属性功能,框选时选中id附加在dom元素div.entity-editor-pane KDSEditor-pane
            附加属性：data-multiselectids
        */
           function addMultiEditorFooter(entity) {


                var data = []
                var d3Obj = d3.select("div.entity-editor-pane.KDSEditor-pane");
                if (d3Obj.size() > 0) {
                    var selectIds = d3Obj.attr("data-multiselectids");
                    if (selectIds) {
                        data.push(selectIds);
                    }
                }
                var parentNode = d3.select("div.KDSEditor-inspector-border.raw-tag-editor.KDSEditor-inspector-inner");
                var multiEditor = parentNode.selectAll("preset-form.form-input-field.checkselect.multiRoadEditor");
                var update = multiEditor.data(data);
                var enter = update.enter();
                var exit = update.exit();


                var preset_footer = enter.append("div").attr('class', 'preset-form form-input-field checkselect').attr('id', 'multiRoadEditor_footer');
                /*var label = preset_footer.append("div").append("label").attr("class", "preset-input-wrap set");
                label.append("input").attr({
                    "type": "checkbox",
                    "id": "multiEditor"
                }).on("change",function(d,i){

                 toogleRoadName_ZHState();
                });
                label.append("span").attr("class", "value").text("批量赋属性");*/
                var roadNav = preset_footer.append("div").attr('class', 'preset-form form-input-field');
                var selectIds = data.length > 0 ? data[0].split(",") : data;
                var index = _.indexOf(selectIds, entity.id);
                var currentRoadIndex = (index || 0) + 1;
                var selectIdsLength = selectIds.length;
                var ul = roadNav.append("nav").append("ul").attr("class", "pagination");
                ul.append("li").append("a").on("click", previousRoad).attr({
                    "aria-label": "Previous",
                    "href": "#"
                }).append("span").attr({
                    "aria-hidden": true
                }).text("«");
                ul.append("li").append("a").attr({
                    "aria-label": "Previous",
                    "href": "#"
                }).append("span").attr({
                    "aria-hidden": true,
                    "id": "currentRoadInfo"
                }).text(currentRoadIndex+"/" + selectIdsLength);
                ul.append("li").append("a").on("click", nextRoad).attr({
                    "aria-label": "Previous",
                    "href": "#"
                }).append("span").attr({
                    "aria-hidden": true
                }).text("»");

               locationEntity(entity);

                function toogleRoadName_ZHState(){
                    
                    /*
                    var d_input=d3.select("div.form-field .form-input-field input.preset-input");
                    if(d_input.size()>0){

                        if(d3.select("#multiEditor")[0][0].checked){
                            d_input.attr().attr("readonly","readonly").classed("disabled",true);
                          
                        }else{
                            d_input.attr().attr("readonly",null).classed("disabled",false);
                        }
                    }
                    */

                    var d_button=d3.select("button.button-input-action.roadname-add.minor");
                    if(d_button.size()>0){

                        if(d3.select("#multiEditor")[0][0].checked){
                            d_button.classed("hide",true);
                          
                        }else{
                            d_button.classed("hide",false);
                        }
                    }
                    
                }
                function previousRoad() {
                    
                    currentRoadIndex = currentRoadIndex - 1;
                    if (currentRoadIndex < 1) {
                        currentRoadIndex = 1;
                        return;
                    }

                    var selectid = selectIds[currentRoadIndex-1];
                    d3.event._multiEditRoadProp = true;

                    d3.select("#multiRoadEditor_footer #currentRoadInfo").text(currentRoadIndex + "/" + selectIdsLength);
                    context.enter(iD.modes.Select(context, [selectid]));
                    // toogleRoadName_ZHState();
                }

                function nextRoad() {
                    
                    currentRoadIndex = currentRoadIndex + 1;
                    if (currentRoadIndex > selectIdsLength) {
                        currentRoadIndex = selectIdsLength;
                        return;
                    }

                    var selectid = selectIds[currentRoadIndex-1];
                    d3.event._multiEditRoadProp = true;

                    d3.select("#multiRoadEditor_footer #currentRoadInfo").text(currentRoadIndex + "/" + selectIdsLength);
                    context.enter(iD.modes.Select(context, [selectid]));
                    // toogleRoadName_ZHState();
                }

                exit.remove()
            }
        }
    }
    
    // 暂只考虑单一类型的情况
    function ListFilter(selection){
    	// 初始化
    	this.$body = selection;
    	this.$sidebar = d3.select("#KDSEditor-sidebar");
    	this.init();
    	this._initFilterEvent();
    	
    	// 有旧参数的情况，返回时
    	var $sidebar = this.$sidebar;
    	if($sidebar.size() && $sidebar.attr("data-filterparam")){
    		var param = $sidebar.attr("data-filterparam").split(',');
    		this.setFilterParam({
    			type: param[0],
    			sort: param[1]
    		}, false);
    	}
    	if($sidebar.size()){
    		$sidebar.attr("data-filterparam", null);
    		$sidebar.attr("data-member-multiselectids", null);
    	}
    	
    	// 绑定事件
    	this.event = d3.dispatch('change');
    	d3.rebind(this, this.event, 'on');
    }
    
    ListFilter.prototype.init = function(){
    	var self = this;
    	var $ul = self.$body.selectAll('ul.feature-filter').data([0]).enter()
    		.append('ul').attr('class', 'feature-filter cf');
    	var $item = $ul.selectAll('li.filter-item').data(['type', 'sort']).enter()
    		.append('li').attr('class', 'filter-item');
    	
    	$item.append('label').attr('class', 'filter-label').text(function(d){
    		if(d == 'type'){
				return '类型:';
			}else if(d == 'sort'){
				return '排序:';
			}
    	});
    	$item.append('select').attr('name', function(d){
    			return d;
    		}).attr('class', 'filter-item').attr('id', function(d){
    			return '_filter_' + d;
    		}).selectAll('option').data(function(d){
    			if(d == 'type'){
    				return self.getOptionsType();
    			}else if(d == 'sort'){
    				return self.getOptionsSort();
    			}
    		}).enter()
    		.append('option').attr('value', function(d) {
                return d.value;
           	}).text(function(d) {
                return d.name;
            });
    }
    
    ListFilter.prototype.getOptionsType = function(){
    	var entityList = selectedIDs
            .map(function(id) { return context.hasEntity(id); })
            .filter(visibleFilter);
        var modelNames = _.compact(_.uniq(_.pluck(entityList, 'modelName')));
    	var dataList = [{
    		name: 'id',
    		value: 'id'
    	}];
        if(modelNames.length > 1){
        	return dataList;
        }
        var modelName = modelNames[0];
        // DA、LA、DREF、RA
        if(_.include([
        	iD.data.DataType.DIVIDER_ATTRIBUTE, 
        	iD.data.DataType.LANE_ATTRIBUTE,
        	iD.data.DataType.R_ROAD_RA
        ], modelName)){
        	dataList.push(...[{
	    		name: '点id',
	    		value: 'nodeid'
	    	}, {
	    		name: '线id',
	    		value: 'wayid'
	    	}]);
        }else if(modelName == iD.data.DataType.R_DIVIDER_DREF){
        	dataList.push(...[{
	    		name: '线id',
	    		value: 'wayid'
	    	}]);
        }
        return dataList;
    }
    
    ListFilter.prototype.getOptionsSort = function(){
    	return [{
    		name: '正序',
    		value: 'asc'
    	}, {
    		name: '倒序',
    		value: 'desc'
    	}];
    }
    
    ListFilter.prototype.getFilterParam = function(){
    	var self = this;
    	var $inputs = self.$body.selectAll('li.filter-item select');
    	var param = {};
		$inputs.each(function(){
			if(this.name){
				param[this.name] = this.value || '';
			}
		});
    	return param;
    }
    
    ListFilter.prototype.setFilterParam = function(param, trigger = false){
    	var self = this;
    	var $inputs = self.$body.selectAll('li.filter-item select');
    	var result = {};
    	param = _.clone(param);
		$inputs.each(function(){
			var newVal = param[this.name];
			// 值要在可选参数内
			var optVals = _.pluck(this.options, 'value') || [];
			if(this.name && newVal != null && this.value != newVal && _.include(optVals, newVal)){
				this.value = newVal;
			}
			result[this.name] = this.value;
		});
		
		trigger && self.event.change(result);
    }
    
    ListFilter.prototype._initFilterEvent = function(){
    	var self = this;
    	var $inputs = self.$body.selectAll('li.filter-item select');
    	
    	$inputs.on('change', selectValueChange);
    	
    	function selectValueChange(){
    		self.event.change(self.getFilterParam());
    	}
    }
    
    ListFilter.prototype.sortSelectionList = function($items, param){
    	var self = this;
    	var $sidebar = self.$sidebar;
    	if(!param){
    		param = self.getFilterParam();
    	}
    	
    	$items.sort(function(d1, d2){
    		var id1 = sortFieldVal(d1), id2 = sortFieldVal(d2);
    		if(!param.sort || id1 == false || id2 == false){
    			return 0;
    		}
			return sortVal(id1, id2);
    	});
    	
    	var memberids = [];
    	var entityids = [];
    	// 第三列显示排序使用的id
    	if(param.type != 'id'){
    		$items.each(function(d){
    			d3.select(this).select('.entity-name').text(sortFieldVal(d));
//  			memberids.push(sortFieldVal(d, false));
				entityids.push(d.id);
    			if(d instanceof iD.Relation){
    				memberids.push(iD.util.entityRelationMainMember(d, context));
    			}
    		});
    	}else {
    		$items.each(function(d){
    			d3.select(this).select('.entity-name').text(iD.Entity.id.toOSM(d.id));
    			entityids.push(d.id);
    			if(d instanceof iD.Relation){
    				memberids.push(iD.util.entityRelationMainMember(d, context));
    			}
    		});
    	}
    	
    	if($sidebar.size()){
    		$sidebar.attr("data-multiselectids", entityids);
    		$sidebar.attr("data-filterparam", [param.type, param.sort]);
    		$sidebar.attr("data-member-multiselectids", memberids.length && memberids || null);
    	}
    	
    	function sortVal(a, b){
    		var result = 0;
    		if(a<b){result = -1}
			else if(a>b){result = 1}
			if(param.sort == 'desc'){
				result = -result;
			}
    		return result;
    	}
    	
    	function sortFieldVal(d, toOSM = true){
    		var result = false;
    		var geoType = '', filterFun = ()=>true;
    		if(_.include([
	        	iD.data.DataType.DIVIDER_ATTRIBUTE, 
	        	iD.data.DataType.LANE_ATTRIBUTE,
	        	iD.data.DataType.R_ROAD_RA
	        ], d.modelName)){
	        	if(param.type == 'nodeid'){
	        		geoType = iD.data.GeomType.NODE;
	        	}else if(param.type == 'wayid'){
	        		geoType = iD.data.GeomType.WAY;
	        	}
	        }else if(d.modelName == iD.data.DataType.R_DIVIDER_DREF){
	        	if(param.type == 'wayid'){
	        		geoType = iD.data.GeomType.WAY;
	        		filterFun = function(entity){
	        			return entity && entity.tags.R_LINE == '1';
	        		}
	        	}
	        }
	        
	        for(let m of d.members || []){
	        	let entity = context.hasEntity(m.id);
	        	if(entity && entity.type == geoType && filterFun(entity)){
	        		result = entity.id;
	        		break;
	        	}
	        }
	        if(!result && param.type == 'id'){
	        	result = d.id;
	        }
    		return typeof result === 'string' ? 
    			toOSM ? Number(iD.Entity.id.toOSM(result)) : result
    			: result;
    	}
    }
    
    return selectionList;
};
