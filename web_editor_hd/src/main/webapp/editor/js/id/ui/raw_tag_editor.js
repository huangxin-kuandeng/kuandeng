iD.ui.RawTagEditor = function(context) {
    var event = d3.dispatch('change'),
        state,
        tags,
        id,
        currentLayer,
        modelEntity,
        geoType,
        fields,
        intercept =  5;
    function reIntercept(){
        var width = window.innerWidth;
        var height =  window.innerHeight;
            intercept = width > 1300 ? 5 : 3;
            intercept = width < 820 ? 1 : intercept;
    }

    function rawTagEditor(selection) {
        var entity = context.entity(id);

            currentLayer = iD.Layers.getLayer(entity.layerId);
            modelEntity = currentLayer.modelEntity();
            geoType = modelEntity.getGeoType();

        if(currentLayer.isRoad()){
            /**
			//针对导航路网有多个geoType,所以做特殊处理
            //获得当前Tags中的DataType
			var _datatype = tags['datatype'] || '';
                _geoType = currentLayer.dataModelGeoType[_datatype.toLowerCase()] || '';
            if(!_.isEmpty(_geoType)){
                geoType = _geoType;
            }*/
			var _datatype = tags['datatype'] || '';
                typeModelEntity = currentLayer.typeModelEntity()[_datatype];
			if (typeModelEntity) {//只针对子图层
				geoType = typeModelEntity.modelId;
				modelEntity = typeModelEntity.model;
			} else {
				geoType = '';
			}
        }
        reIntercept();
        fields = modelEntity.getFields(geoType);        
        selection.call(content);

        d3.select(window).on('resize.rawTagEditor', function(){
            reIntercept();
            selection && content && selection.call(content);
        });
    }

    function content($wrap) {
        var entity = context.entity(id),
            //节点Tag
            entries = d3.entries(tags);     


        //对entries进行转换
        var _tags = []; 
        _(fields).each(function(field){

            var _name = field.fieldName || '',
                //可能无中文名称，就用name代替
                _title = field.fieldTitle || _name,  
                //如果_value为空，则用默认值代替
                _value = tags[_name] || field.defaultValue; 

            field.title = _title;
            field.value = _value;
            
            _tags.push(field);
            
        });
        entries = _tags;

        var _writeTags = _.filter(entries,function(d){ return d.readOnly === '0'}),
            _readonlyTags = _.filter(entries,function(d){ return d.readOnly === '1'});
        

        //可读区域
        $wrap.call(drawWriteTags);

        //只读区域
        $wrap.call(drawReadOnlyTags);

        function selectValueChange(d){
            var tag = {};
            tag[d.fieldName] = this.options[this.selectedIndex].value;
            event.change(tag);
        }

        function keyValueChange(d){
             var that = this,
                _currentObj = d3.select(that),
                _value = that.value,
                flag = /^\d+(\.\d+)?$/.test(_value);

            //加入验证规则
            if(d.fieldType !== 'varchar'){
                //即为数字
                _currentObj.classed('error',false)
                    .attr('placeholder','');
                if(_value.length > 0 && !flag){
                    _currentObj.classed('error',true)                        
                        .property('value','')
                        .attr('placeholder',t('inspector.input_placeholder_error'));
                        return;
                }        
            }
        }
        function valueChange(d) {
            var that = this,
                _currentObj = d3.select(that),
                _value = that.value;
                _currentObj.classed('error',false)
                    .attr('placeholder','');

            var tag = {};
            tag[d.fieldName] = _value;
            event.change(tag);
        }

        function drawWriteTags(wrapper){
            var $list = wrapper.selectAll('.tag-list')
                                .data([0]);
            $list.enter().append('ul')
                .attr('class', 'tag-list');

            var $items = $list.selectAll('li')
                .data(_writeTags, function(d) { return d.id; });


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
                //针对select类型，输出下拉列表框
                if(d.fieldInput.type === 'select'){

                   var select = d3.select(that).append('select')
                        .attr('class','value'),
                        optionData = _.clone(d.fieldInput.values);
                    //插入空选项
                    optionData.unshift({name:'==请选择==',value:'',values:[]});
      
                    var options = select.selectAll('option')
                        .data(optionData)
                        .enter()
                        .append('option')
                        .attr('value',function(o){return o.value;})
                        .attr('title',function(o){return o.name;})
                        .attr('label',function(o){
                            return iD.util.substring(o.name,8);
                        })
                        .text(function(o){ 
                            return iD.util.substring(o.name,8);
                        });

                }else{
                    d3.select(that).append('input')
                        .property('type', 'text')
                        .attr('class', 'value KDSEditor-input')
                        .attr('maxlength', function(item){
                            return parseInt((item.size || 80),10);
                        });
                }
            });

            // Update
            $items.order();
        

            $items.select('label.key')
                .html(function(d) { return iD.util.substring(d.title,intercept); })
                .attr('title',function(d){return d.title;});

            //附加事件，填充值，必须创建完元素后设置，创建元素时设置值不起作用
            $items.select('input.value')
                .value(function(d) { return d.value; })
                .property('title',function(d){ return d.value;})
                .property('disabled',function(d){ return !currentLayer.editable ;})
                .on('change', valueChange)
                .on('keyup', keyValueChange)
                .on('blur', valueChange);

            $items.select('select.value')
                .on('change',selectValueChange)
                .each(function(item){
                    //获得所有options
                    d3.select(this).selectAll('option')
                        .each(function(option){
                            //如果当前option.value == 当前tag.value则选中
                            d3.select(this).property('selected',option.value == item.value);
                        });
                })
                .property('disabled',function(d){ return !currentLayer.editable || d.readOnly === '1';});



            $items.exit().remove();
        };

        function drawReadOnlyTags(wrapper){
            wrapper.selectAll('.readonly-title')
                    .data([0])
                    .enter()
                    .append('h2')
                    .attr('class','readonly-title')
                    .text(t('inspector.readonly_title'));

            var $readOnlyList = wrapper.selectAll('.tag-list-readonly')
                .data([0]);

            $readOnlyList.enter().append('ul')
                .attr('class', 'tag-list-readonly');

            var $readOnlyItems =$readOnlyList.selectAll('li')
                .data(_readonlyTags, function(d) { return d.fieldName; }),

                $readOnlyEnter = $readOnlyItems.enter().append('li')
                                .attr('class','tag-row cf');

            $readOnlyEnter.append('div')
                .attr('class', 'key-wrap')
                .append('label')
                .attr('class', 'key KDSEditor-label');

            $readOnlyEnter.append('div')
                .attr('class', 'input-wrap-position')
                .append('label')
                .attr('class', 'value KDSEditor-label');


            $readOnlyItems.select('label.key')
                .html(function(d) { return iD.util.substring(d.title,intercept ); })
                .attr('title',function(d){return d.title;});
            $readOnlyItems.select('label.value')
                .html(function(d) { return d.value; })
                 .attr('title',function(d){return d.value;});


            $readOnlyItems.order().exit().remove();
        };
    }

    rawTagEditor.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        return rawTagEditor;
    };

    rawTagEditor.tags = function(_) {
        if (!arguments.length) return tags;
        tags = _;
        return rawTagEditor;
    };

    rawTagEditor.entityID = function(_) {
        if (!arguments.length) return id;
        id = _;
        return rawTagEditor;
    };

    return d3.rebind(rawTagEditor, event, 'on');
};
