/**
 * 打标的模型对应的列表，非选中状态时显示
 * 属性列表key/value(输入框)列表
 * @param {Object} context
 */
iD.ui.RawTagMarkEditor = function(context) {
    var event = d3.dispatch('change'),
        state,
        selectEntityid,
        openMap = {},
        clearHtml = false,
        currentLayer,
        tagModelName,
        modelEntity,
        geoType,
        fields,
        intercept = 6;
    // 筛选数据用
    var tagFilter;
    // 筛选数据后，地图未加载的要素属性
    // {[id]: {loc: [x, y]}}
    // loc: 定位用
    var tagFilterUnloadData = {};
    // 弹窗显示的models
    var dialog_models = [
        iD.data.DataType.AUTO_NETWORK_TAG,
        iD.data.DataType.QUALITY_TAG
    ];

    var itemTitleMap = {
    	[ iD.data.DataType.QUALITY_TAG ]: function(d, id){
    		return ([false, '质检员', '验收员', '质量评估员', '基于资料的打标服务', '基于车道模型的打标服务', '逻辑检查项服务', '后自动化服务', '融合前单轨迹核线检查', '融合后单轨迹核线检查', '多轨迹核线检查', '静态激光点云真值评估'][d.tags.TAG_SOURCE] || '质检') + '标: ' + id;
    	},
    	[ iD.data.DataType.IMAGE_TAG ]: function(d, id){
    		return "图像标: " + id;
    	},
    	[ iD.data.DataType.AUTO_NETWORK_TAG ]: function(d, id){
    		var fields = modelEntity.getFields(modelEntity.getGeoType()) || [];
    		var fieldObj = _.filter(fields, {
    			fieldName: 'TYPE'
    		})[0];
    		if(!fieldObj || !fieldObj.fieldInput){
    			return id;
    		}
    		var value = _.filter(fieldObj.fieldInput.values, {
    			value: d.tags.TYPE || ''
    		})[0];
    		return id + " " +  (value && value.name || "");
    	},
    	[ iD.data.DataType.AUTO_CHECKWORK_TAG ]: function(d, id){
    		return "精度质检标: " + id;
    	},
    	[ iD.data.DataType.COMPILE_CHECK_TAG ]: function(d, id){
    		return "拓扑标: " + id;
    	},
    	[ iD.data.DataType.AUTO_COMPLETECHECK_TAG ]: function(d, id){
    		return "完备检查标: " + id;
    	}
    };
    /**
     * 判断字段是否支持编辑
     * @param {Object} d
     * @param {String} modelName
     */
    function rawEditable(d, modelName){
    	if(modelName == iD.data.DataType.QUALITY_TAG){
    		// 没有质检权限的作业员，允许更改状态；
    		if(d.fieldName == 'STATE'){
    			// 不是质检系统、或者用户没有质检权限，允许更改状态字段
    			if(!iD.User.isEditCheckSystemAndRole()){
    				return true;
    			}
    		}
    	}
    	
    	return currentLayer && currentLayer.editable && d.readOnly != '1';
    }

    function getDialogCheckTagSelected(){
        var $dialog = d3.select('#checktag_dialog_html');
        return $dialog.size() && $dialog.attr('data-id') || '';
    }
    
    function reIntercept() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        intercept = width > 1300 ? 6 : 3;
        intercept = width < 820 ? 1 : intercept;
    }

    function rawTagMarkEditor(selection) {
        modelEntity = iD.ModelEntitys[tagModelName];
        if(!modelEntity){
            selection.selectAll('.tag-list').remove();
            return ;
        }
        geoType = modelEntity.getGeoType();
        reIntercept();
        fields = modelEntity.getFields(geoType);
        if(clearHtml){
        	selection.html('');
        }
        // 渲染列表
        selection.call(renderContent, function(){
	        // 列表定位
	        // 该位置执行selection.select('div.tag-list-raw.selected') 时
	        // .tag-list-raw中的__data__会变为0，不清楚原因
            var selectDom = selection.selectAll('div.tag-list-raw.selected').node();
	        
	        if(selectEntityid && selectDom){
	        	var offsetTop = selectDom.offsetTop - 10;
	        	selection.node().parentNode.scrollTop = offsetTop;
	        }
        });

        d3.select(window).on('resize.rawTagMarkEditor', function() {
            reIntercept();
//          selection && renderContent && selection.call(renderContent);
        });
        
		var isFilterType = tagFilter.isFilterType();
		if(isFilterType){
	        // 搜索按钮
	        tagFilter.on('btn_search.rawTagMarkEditor', function(){
	            reIntercept();
	            selection && renderContent && selection.call(renderContent);
	        });
	        // 清空筛选按钮
	        tagFilter.on('btn_reset.rawTagMarkEditor', function(){
	            reIntercept();
	            selection && renderContent && selection.call(renderContent);
	        });
		}
    }
	var selectGroup;
	//生成级联select对象数组。格式 {Array[parentId] = [sub1, sub2, sub3], ……}
	function selectGroups(writeTags) {
		selectGroup = {};
		//遍历tags中所有的属性项
		writeTags.forEach(function(t){
			//遍历每个属性项中所有满足parentId不为空的进行创建对象数组并赋值
			t.fieldInput.values && t.fieldInput.values.forEach(function(s) {
				if (s.parentId && !selectGroup[s.parentId]) {
					selectGroup[s.parentId] = [];
				}
				if (selectGroup[s.parentId]) {
					selectGroup[s.parentId].push({
            			"name": s.name,
            			"value": s.value            				
            		});
				}
			});
      });
	}
	
	function getWriteReadTags(entityid){
		var entity = context.entity(entityid);
		var tags = entity.tags || {};
        //对entries进行转换
        var _tags = [];
        var parentId = false;
        _(fields).each(function(field) {

            var _name = field.fieldName || '',
                //可能无中文名称，就用name代替
                _title = field.fieldTitle || _name;
            var _value = tags[_name] || '';
            /*
            // 渲染属性列表时不需要默认值判断
            if(_.include(['text'], field.fieldInput)){
            	if(_value == null){
            		_value = field.defaultValue;
            	}
            }else {
                _value = tags[_name] || field.defaultValue;
            }
			*/
            field.title = _title;
            field.value = _value;

            _tags.push(field);
        });
        if(entity.modelName == iD.data.DataType.DEFAULT){
            let _idx = 1;
            _tags = _.map(entity.tags, function(v, k){
                let field = {
                    id: _idx++,
                    fieldName: k,
                    fieldTitle: k,
                    display: '1',
                    readOnly: '1',
                    fieldInput: {
                        type: 'text'
                    }
                };
                field.title = field.fieldTitle;
                field.value = v;
                return field;
            });
        }
        var entries = _tags;

        var _writeTags = _.filter(entries, function(d) {
//              d.readOnly = '0';
//              return true;
				return d.display != '0';
                return d.readOnly == '0'
            }),
            _readonlyTags = _.filter(entries, function(d) {
                return d.readOnly == '1'
            });
        return {
        	write: _writeTags,
        	readonly: _readonlyTags
        }
	}
	
	function _renderRaw($tagListRaw){
		
        var $titleWrap = $tagListRaw.selectAll('div')
        	.data([0]);
        $titleWrap = $titleWrap.enter().append('div').attr('class', 'raw-title-wrap');
        
        var $titleText = $titleWrap.selectAll('span')
        	.data([0]);
        $titleText = $titleText.enter().append('span')
        	.attr('class', 'tagmark-title').attr('title', function(){
    			var d = this.parentNode.parentNode.__data__;
	        	let entity = context.hasEntity(d);
	        	if(!entity){
	        		entity = tagFilterUnloadData[d];
	        	}
	        	let eid = iD.Entity.id.toOSM(entity.id);
//	        	let titleText = (itemTitleMap[tagModelName] || '标记: ') + (entity.tags.NAME || eid);
				let titleFunc = itemTitleMap[tagModelName];
	        	let titleText = titleFunc && titleFunc(entity, eid) || ('标记: ' + eid);
	        	d3.select(this).text(titleText);
	        	return titleText;
	        });
        
        $titleText.on('click.tagmark', function(){
			var d = this.parentNode.parentNode.__data__;
            let entity = context.hasEntity(d);
        	if(entity && entity.modelName == iD.data.DataType.AUTO_NETWORK_TAG){
	        	iD.ui.openTagmarkDialog(context, entity.id, {
	        		title: this.innerText
                });
        	}
            if(entity && entity.modelName == iD.data.DataType.QUALITY_TAG){
                iD.ui.openCheckTagDialog(context, entity.id, {
                    title: this.innerText
                });
                selectedRaw(entity.id);
            }
        	
    		let $parent = d3.select(this.parentNode.parentNode);
            let datum = $parent.datum();
    		// 不存在，不展开
    		if($parent.classed('unload')){
    			$parent.classed('in', false);
    			openMap[datum] = false;
    			return ;
    		}
    		if($parent.classed('in')){
    			$parent.classed('in', false);
    			openMap[datum] = false;
    		}else {
    			$parent.classed('in', true);
    			openMap[datum] = true;
    		}
        });
        
        function selectedRaw(eid){
            var $wrap = d3.select($tagListRaw.node().parentNode);
            var $raw = $wrap.selectAll('div.tag-list-raw').classed('selected', false).filter(function(d){
                return d == eid;
            });
            if($raw.size()){
                $raw.classed('selected', true);
                if(selectEntityid){
                    context.enter(iD.modes.Select(context, [])
                        .suppressMenu(true)
                        .newFeature(false));
                }
            }
        }
    	/*
    	if(!currentLayer || !currentLayer.display){
    		// 不显示时不定位
    		return ;
    	}
    	*/
        let $locate = $titleWrap.selectAll('div')
        	.data([1]);
        $locate = $locate.enter().append('div')
    		.attr('class', 'tagmark-icon-locate')
    		.attr('title', '位置定位')
    		.style('background-image', 'url("' + context.imagePath("cursor-draw2x.png") + '")');
    	$locate.on('click.tagmark', function(d){
    		var d = this.parentNode.parentNode.__data__;
    		let datum = context.hasEntity(d);
    		if(!datum){
    			datum = tagFilterUnloadData[d];
    		}
    		if(!datum){
    			return ;
    		}
    		var player = iD.picUtil.player;
    		if(datum.tags && datum.tags.TRACKPOINTID && player && player._zrender){
    			// 视频上定位
        		player.locateTrackPointToPlayer(datum.tags.TRACKPOINTID, datum.tags.TRACKID);
        	}
    		
    		if(datum.extent){
        		context.extent(datum.extent());
                context.map().zoom(20);
                // 定位时也会选中要素
                if(datum.modelName == iD.data.DataType.QUALITY_TAG){
                    iD.ui.openCheckTagDialog(context, datum.id, {
                        title: this.innerText
                    });
                }
	    		context.enter(iD.modes.Select(context, [datum.id])
		            .suppressMenu(false)
                    .newFeature(false));
    		}else if(datum.loc){
				context.map().centerZoom(datum.loc, 20);
    		}
    	});
	}
	
	function parse2UnloadData(d, entityid){
		if(context.hasEntity(entityid)){
			return ;
		}
		var type = _.find(d.tag, {k: 'TYPE'});
		// 记录地图未加载数据
		tagFilterUnloadData[entityid] = {
			id: entityid,
			loc: [d.lon, d.lat],
			tags: {
				TYPE: type && type.v || ''
			}
		};
	}
	
	/**
	 * 已添加到地图上，但未保存到后台的要素
	 */
	function getCreatedEntityidList(){
    	var idList = context.intersects(iD.geo.Extent(
        	[-Infinity, -Infinity], 
        	[Infinity, Infinity])
        ).map(function(entity){
        	if(entity.modelName == tagModelName){
        		var eid = iD.Entity.id.toOSM(entity.id);
        		if((eid + '').indexOf('-') > -1){
        			return entity.id;
        		}
        	}
        });
        idList = _.compact(idList);
        return idList;
	}
	
	function renderContent($wrap, callback){
		tagFilterUnloadData = {};
		
		var entityidList = [];
		var isFilterType = tagFilter.isFilterType();
		// 不是通过后台筛选出的数据
		if(!isFilterType){
	    	var tagEntityList = context.intersects(iD.geo.Extent(
	        	[-Infinity, -Infinity], 
	        	[Infinity, Infinity])
	        ).map(function(entity){
	        	if(entity.modelName == tagModelName){
	        		return entity;
	        	}
	        });
	        tagEntityList = _.compact(tagEntityList);
	        if(tagEntityList.length){
	        	currentLayer = iD.Layers.getLayer(tagEntityList[0].layerId, tagEntityList[0].modelName);
            }
            tagEntityList.sort(function(a, b){
                return iD.Entity.id.toOSM(a.id)*1 - iD.Entity.id.toOSM(b.id)*1;
            });
            var createdList = [];
            var markList = [];
            tagEntityList.forEach(function(d){
				if (d.tags.STATE == '4' && iD.User.isWorkRole()) {
					return;
				}
                if(iD.Entity.id.toOSM(d.id) < 0){
                    createdList.push(d.id);
                }else {
                    markList.push(d.id);
                }
            });
            // kd_tag标记id变为uuid格式，不能排序
            createdList.sort(function(a, b){
                return iD.Entity.id.toOSM(a)*1 - iD.Entity.id.toOSM(b)*1;
            });
	        // entityidList = _.pluck(tagEntityList, 'id');
	        entityidList = createdList.concat(markList);

	        $wrap.call(content, entityidList, currentLayer);
	        callback && callback();
	        return ;
    	}
		
        tagFilter.queryEntities().then(function(tagEntityList){
    		currentLayer = iD.Layers.getLayersByModelName(tagModelName)[0];
    		entityidList = tagEntityList.map(function(d){
				if(!currentLayer) return null;
				var state = _.find(d.tag, {k: 'STATE'});
				if (state.v == '4' && iD.User.isWorkRole()) {
					return null;
				}
    			let entityid = iD.Entity.id.fromOSM('node', d.id, currentLayer.id);
				parse2UnloadData(d, entityid);
    			return entityid;
    		});
    		// 没有筛选条件时，未保存的新建要素，保持在列表上方
    		if(tagFilter.emptyFilter()){
    			entityidList.unshift(...getCreatedEntityidList());
    		}
    		entityidList = _.compact(entityidList);
        	
	        $wrap.call(content, entityidList, currentLayer);
	        callback && callback();
        });
    }
    
    function content($wrap, entityidList, currentLayer) {
    	$wrap.selectAll('div.tag-list-raw').data([]).exit().remove();
    	
        var $items = $wrap.selectAll('div.tag-list-raw').data(entityidList);
        $tagListRaw = $items.enter().append('div')
        	.attr('class', 'tag-list-raw collpase')
        	.each(function(d){
        		var $this = d3.select(this);
        		$this.classed('unload', false);
        		if(!context.hasEntity(d)){
        			// 地图上对应的要素未加载
        			$this.classed('unload', true);
        			$this.classed('in', false);
        			openMap[d] = false;
        			$this.call(_renderRaw, d);
        			return ;
        		}
        		$this.call(_renderRaw, d);
        		var entity = context.hasEntity(d);
        		// 弹窗展示；
        		if(entity && dialog_models.includes(entity.modelName)){
        			return ;
        		}
	    		$this.call(drawWriteTags, d);
	    	});
    	$items.exit().remove();
    	
    	$wrap.selectAll('div.tag-list-raw').each(function(){
        	var $item = d3.select(this);
        	var entityid = $item.datum();
        	if(!entityid){
        		return ;
        	}
        	var entity = context.hasEntity(entityid);
        	var lay = entity && iD.Layers.getLayer(entity.layerId);
        	var $list = $item.select('ul.tag-list');
        	$list.classed('no-pointer-events', false);
        	/*
        	if((lay && lay.tagReadOnly) || (entity && !iD.util.entityInPlyGon(entity, context))){
        		$list.classed('no-pointer-events', true);
        	}
        	*/
        	if(!lay || lay.tagReadOnly){
        		$list.classed('no-pointer-events', true);
        	}
        });

        var dialogSelected = getDialogCheckTagSelected();
    	
    	let tempOpen = {};
    	$items.each(function(d){
    		var $this = d3.select(this);
    		if(d == selectEntityid || d == dialogSelected){
    			$this.classed('selected', true);
    		}else {
    			$this.classed('selected', false);
    		}
    		if($this.classed('unload')){
    			$this.classed('selected', false);
    			openMap[d] = false;
    		}
    		if(openMap[d]){
    			tempOpen[d] = true;
    			$this.classed('in', true);
    		}
    	});
    	openMap = tempOpen;
    	/*
    	console.log('展开的内容：', _.compact(_.map(_.keys(openMap), function(key){
    		if(openMap[key]){
    			return key;
    		}
    	})));
    	*/
		/*
        for(let i = 0; i<tagEntityList.length; i++){
        	let entity = tagEntityList[i];
        	let $tagListRaw = $wrap.append('div').attr('class', 'tag-list-raw collpase').data([entity.id]);
        	let titleText = '标记标题-' + (entity.tags.NAME || entity.id);
        	let $titleWrap = $tagListRaw.append('div').attr('class', 'raw-title-wrap');
        	let $titleText = $titleWrap.append('span').attr('class', 'tagmark-title').attr('title', titleText).text(titleText);
        	
        	$titleWrap.on('click.tagmark', function(){
        		let $parent = d3.select(this.parentNode);
        		if($parent.classed('in')){
        			$parent.classed('in', false);
        		}else {
        			$parent.classed('in', true);
        		}
        	});
        	
        	let $locate = $tagListRaw.append('div')
        		.attr('class', 'tagmark-icon-locate')
        		.attr('title', '位置定位')
        		.style('background-image', 'url("' + context.imagePath("cursor-draw2x.png") + '")');
        	$locate.on('click.tagmark', function(){
        		let $parent = d3.select(this.parentNode);
        		let datum = context.hasEntity($parent.datum());
        		if(!datum){
        			return ;
        		}
        		var player = iD.picUtil.player;
        		if(datum.tags.TRACKPOINTID && player && player._zrender){
        			// 视频上定位
	        		player.locateTrackPointToPlayer(datum.tags.TRACKPOINTID, datum.tags.TRACKID);
	        	}
        		if(datum.extent){
	        		context.extent(datum.extent());
		    		context.map().zoom(20);
        		}
        	});
        	
        	$tagListRaw.call(drawWriteTags, entity.id);
        }
        */

        function selectValueChange(d) {
        	/*if(arguments[3]){
        		d = d3.event.target.parentNode.__data__;
        	}*/
        	if (!d) {
        		d = d3.event.target.parentNode.__data__;
        	}
            var tag = {};
            tag[d.fieldName] = this.options[this.selectedIndex].value;
            let entityid = $(this).closest('.tag-list-raw')[0].__data__;
            
            var entity = context.hasEntity(entityid);
            /*
            if(entity && entity.modelName == iD.data.DataType.CHECK_TAG){
	    		if(tag.hasOwnProperty('STATE')){
	    			var $edit = $(this).closest('.tag-list-raw').find('ul.tag-list li.tag-row').filter(function(){
	    				var lid = this.__data__;
	    				if(lid && lid.fieldName == 'EDITBY'){
	    					return true;
	    				}
	    				return false;
	    			});
	    			if($edit.length){
	    				tag.EDITBY = iD.User.getInfo().username;
	    				$edit.find('input.value').val(tag.EDITBY);
	    			}
	    		}
	    	}
            */
            event.change(tag, entityid);
            context.event['entityedite'] && context.event['entityedite']({entitys: [entityid]});
        }

        function keyValueChange(d) {
            var that = this,
                _currentObj = d3.select(that),
                _value = that.value,
                flag = /^\d+(\.\d+)?$/.test(_value);
            
            let entityid = $(this).closest('.tag-list-raw')[0].__data__;
            context.event['entityedite'] && context.event['entityedite']({entitys: [entityid]});
            //加入验证规则
            // if (d.type !== 'varchar') {
            //     //即为数字
            //     _currentObj.classed('error', false)
            //         .attr('placeholder', '');
            //     if (_value.length > 0 && !flag) {
            //         _currentObj.classed('error', true)
            //             .property('value', '')
            //             .attr('placeholder', t('inspector.input_placeholder_error'));
            //         return;
            //     }
            // }
        }

        function valueChange(d) {
            var that = this,
                _currentObj = d3.select(that),
                _value = that.value;
            _currentObj.classed('error', false)
                .attr('placeholder', '');

            var tag = {};
            tag[d.fieldName] = _value;
            let entityid = $(this).closest('.tag-list-raw')[0].__data__;
            event.change(tag, entityid);
        }
        
        function drawWriteTags(wrapper, id) {
        	var entity = context.entity(id);
        	var _writeTags = getWriteReadTags(id).write;
        	let currentLayer = iD.Layers.getLayer(entity.layerId, entity.modelName);
        	let parentId = false;
        	
            var $list = wrapper.selectAll('.tag-list')
                .data([0]);
            $list.enter().append('ul')
                .attr('class', 'tag-list collapse-body');

            var $items = $list.selectAll('li')
                .data(_writeTags, function(d) {
                    return d.id;
                });
                
           selectGroups(_writeTags);

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
                    	if (!parentId || parentId == e.parentId) {
                    		subarr.push({
                    			"name": e.name,
            					"value": e.value  
                    		});
                    		parentId = e.parentId;
                    	}
                    });
                    if (subarr.length > 0) {
                    	var optionData = _.clone(subarr);
                    } else {
                    	var optionData = _.clone(d.fieldInput.values);
                    }
                    //插入空选项
                    optionData.unshift({
                        name: '==请选择==',
                        value: '',
                        values: []
                    });

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

                } else if (d.fieldInput.type === 'selectgroup') {
                	//级联菜单走这里
                	var select = d3.select(that).append('select')
                        .attr('class', 'value')
                        .on('change.selectgroup', function(o) {
                        	if (!o) {
                        		return;
                        	}
                        	let selectvalue = this.value;//获取value
                        	
                        	let falg = false;
                        	let sublist;
                        	o.fieldType.fieldTypeValues.filter(function(e){
                        		if (selectvalue == e.value) {
                        			sublist = _.clone(selectGroup[e.id]);
                        			parentId = e.id;
                        			if (!sublist) {
                        				sublist = [];
                        			}
                        			//插入空选项
				                    sublist.unshift({
				                        name: '==请选择==',
				                        value: '',
				                        values: []
				                    });
                        		}
                        	})
                        	

                        	var subtypeselect = $list.select("li[data-fld='SUBTYPE']"),
                        	subtypeoptionData = _.clone(sublist);
                   			subtypeselect.selectAll('option').remove();
                        	var suboptions = subtypeselect.select('select').selectAll('option')
                        	.data(subtypeoptionData)
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
	                        
//	                        $items.select("li[data-fld='SUBTYPE'] select")
//	                        	.value("").dispatch("change", true);
	                        /*let $subselect = subtypeselect.select('select');
	                        $subselect.value("").dispatch("change", true);*/
                        });
                        
                    var optionData = _.clone(d.fieldInput.values);
                    
                    var selectvalue = d.value;
                    d.fieldInput.values.filter(function(e){
                        if (selectvalue == e.value) {
                        	parentId = e.id;
                        }
                    })
                    
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
                    return iD.util.substring(d.title, intercept);
                })
                .attr('title', function(d) {
                    return d.title;
                });

            //附加事件，填充值，必须创建完元素后设置，创建元素时设置值不起作用
            $items.select('input.value')
                .value(function(d) {;
                    return textFormat(d, d.value);
                })
                .property('title', function(d) {
                    return d.value;
                })
                .property('disabled', function(d) {
                    return !rawEditable(d, tagModelName) || isDateField(d);
                })
                .on('change', valueChange)
                .on('keyup', keyValueChange)
                .on('blur', valueChange);

            $items.select('select.value')
                .on('change.selectvaluechange', selectValueChange)
                .each(function(item) {
                    //获得所有options
                    d3.select(this).selectAll('option')
                        .each(function(option) {
                            //如果当前option.value == 当前tag.value则选中
                            d3.select(this).property('selected', option.value == item.value);
                        });
                })
                .property('disabled', function(d) {
//                  return !currentLayer || !currentLayer.editable || d.readOnly === '1';
                    return !rawEditable(d, tagModelName);
                });


            $items.exit().remove();
        };
    }
    
    function textFormat(d, text){
    	if(isDateField(d) && !isNaN(text)){
    		return iD.util.dateFormat(new Date(Number(text)), 'yyyy-MM-dd hh:mm');
    	}
    	return text;
    }
    function isDateField(d){
    	return ['CREATETIME'].includes(d.fieldName);
    }

    rawTagMarkEditor.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        return rawTagMarkEditor;
    };
    rawTagMarkEditor.selectEntity = function(_) {
        if (!arguments.length) return selectEntityid;
        selectEntityid = _;
        return rawTagMarkEditor;
    };
    rawTagMarkEditor.clearHtml = function(_) {
        if (!arguments.length) return clearHtml;
        clearHtml = _;
        return rawTagMarkEditor;
    };

    rawTagMarkEditor.modelName = function(_) {
        if (!arguments.length) return tagModelName;
        tagModelName = _;
        return rawTagMarkEditor;
    };
    
    rawTagMarkEditor.tagFilter = function(_) {
        if (!arguments.length) return tagFilter;
        tagFilter = _;
        return rawTagMarkEditor;
    };

    return d3.rebind(rawTagMarkEditor, event, 'on');
};