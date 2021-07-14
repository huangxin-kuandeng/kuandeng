/**
 * 激光线偏移
 */
iD.ui.BarrierOffsetTip = function (context, options) {
    var tipUtil = iD.ui.TipUtil(context);
    var dispatch = d3.dispatch('confirm', 'close');
    var DEFAULT_TYPE;
    var modelEntityMap;
    var center = [];
    var selectValue = '';
    var roadExpandTip = {};
    var screenX, screenY, modal;
    options = Object.assign({
    	value: 30,
    	step: 1,
        min: 0,
        enterEntity:null,
        actionCreateNew: true,
        actionCreateType: true,
        actionOffsetLeft: true,
        actionOffsetRight: true,
        actionOffsetUp: true,
        actionOffsetDown: true
    }, options);

    function closeExpandBox() {
        var delDiv = document.getElementById('barrier-offset-box');
        if (delDiv != null){
            delDiv.parentNode.parentNode.removeChild(delDiv.parentNode);
            delDiv.parentNode.removeChild(delDiv);
        }
        
        if(options.enterEntity){
            context.buriedStatistics().merge(0,options.enterEntity.modelName);
        }else {
            let _name = context.buriedStatistics().getRecording().name;
            if(_name){
                context.buriedStatistics().merge(0,_name);
            }
        }
        modal && modal.close();
        modal = null;
    }

    roadExpandTip.perform = function (selection, perforFun) {
        var left, right, originalRoadTag = true;
        var createOffsetObject = false;
        var expandFieldWrapper;
        screenX = tipUtil.getMousePos().X;
        screenY = tipUtil.getMousePos().Y;
        closeExpandBox();
        
        modal = iD.ui.modal(selection);
        // 透明遮罩层
        modal.classed('transparent', true);
        modal.on('autoclose', function(){
            dispatch.close();
        });
        // 不使用全部鼠标事件
        modal.style('pointer-events', 'none');

        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');
        modal.append('div')
            .attr('class', 'road-expand-box')
            .attr('id', 'barrier-offset-box')
            // 全部鼠标事件
            .style('pointer-events', 'all')
            .style('width', '160px')
            // .style('height', function(){
            //     return options.height ? options.height + 'px' : '';
            // })
            ;
        var expandBox = d3.select('.road-expand-box');
        var titleTable = expandBox.append('table')
            .attr('class', 'expand-title-table')
            .attr('id', 'expand-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'expand-title-content-td')
            .text(options.title || t('operations.expand.offset-kerb'));
        tr.append('td')
            .attr('class', 'expand-title-close-td')
            .on('click', function () {
                dispatch.close();
                closeExpandBox();
            })
            .append('span')
            .attr('class', 'expand-title-close-span')
            .text('×');

        var expandContent = expandBox.append('div')
            .attr('class', 'road-expand-content');
        
        var arrowContent = expandContent.append('div')
            .attr('class', 'content-arrow')
            .style('text-align', 'center');
        
        var arrowDatas = ['left', 'up', 'right', 'down'].filter(function(d){
            let s = d.split('');
            let type = s.shift().toUpperCase() + s.join('');
            let k = 'actionOffset' + type;
            if(options.hasOwnProperty(k)){
                return options[k];
            }
            return true;
        });
        
        var $large = arrowContent.selectAll('div.large').data(arrowDatas);
        $large.exit().remove();
        $large.enter()
            .append('div')
            .attr('class', (v)=>'large ' + v + ' glyphicon glyphicon-arrow-'+v)
            .on('click', (d)=>{
                executeFun(d, false);
            });
        
        var $mini = arrowContent.selectAll('div.mini').data(arrowDatas);
        $mini.exit().remove();
        $mini.enter()
            .append('div')
            .attr('class', (v)=>{
                let s = 'mini ' + v;
                v = v == 'up' ? 'top' :
                    v == 'down' ? 'bottom' :
                    v;
                return s + ' glyphicon glyphicon-triangle-'+v;
            })
            .on('click', (d)=>{
                executeFun(d, true)
            });

        
        // if(modelEntityMap && options.actionCreateType){
        if(options.actionCreateType){
            expandFieldWrapper = expandContent.append('div')
                .attr('class', 'expand-offset');
            renderFieldList(expandFieldWrapper);
        }

        var expandRight = expandContent.append('div')
            .attr('class', 'expand-offset')
            .style('margin-top', '5px');
        expandRight.append('input')
            .attr('id', 'expand-offset-value')
            .attr('class', 'expand-text-right')
            .attr('min', options.min)
            .attr('value', options.value)
            .attr('type', 'number')
            .attr('step', options.step)
        expandRight.append('lable')
            .attr('class', 'meter')
            .text('厘米')
        
        if(options.actionCreateNew){
            var expandRight = expandContent.append('div')
                .style('text-align', 'center')
                .style('margin-top', '5px');
            expandRight.append('input')
                .attr('id', 'expand-offset-create')
                .attr('type', 'checkbox')
                .property('checked', !createOffsetObject);
            expandRight.append('lable')
                .attr('class', 'meter')
                .text('偏移原有线');
        }
        
        function executeFun(type, miniType){
            var userInputParam = {'left': '', 'right': '', 'originalRoadTag': '', 'heightDiff': 0};
            var domCreate = document.getElementById('expand-offset-create');
            if(domCreate){
                createOffsetObject = !domCreate.checked;
            }
            var value;
            if(miniType){
                value = 0.01;
            }else {
                value = +document.getElementById('expand-offset-value').value;
                value /= 100;
            }
            if(type == 'left'){
                userInputParam.left = value;
            }else if(type == 'right') {
                userInputParam.right = value;
            }else if(type == 'up'){
                userInputParam.heightDiff = value;
            }else if(type == 'down'){
                userInputParam.heightDiff = -value;
            }else {
                return ;
            }

            if(expandFieldWrapper && expandFieldWrapper.size()){
                // var radio = expandFieldWrapper.select("input[type=radio]:checked");
                // var modelName = radio.attr('data-model');
                if(!selectValue) return ;
                userInputParam.createNewModelName = selectValue;
                
                // var selects = d3.select(radio.node().parentNode).selectAll('.field-select select');
                var newTags = {};
                // selects.each(function(d){
                //     if(!d || !d.fieldName) return ;
                //     newTags[d.fieldName] = this.value + '';
                // });
                userInputParam.newTags = newTags;
            }
            
            userInputParam.originalRoadTag = originalRoadTag;
            userInputParam.createOffsetObject = createOffsetObject;
            // console.log('userInputParam', userInputParam);
            perforFun(userInputParam);
            dispatch.confirm(userInputParam);
        }

        new tipUtil.dragDrop({
            target: document.getElementById('barrier-offset-box'),
            bridge: document.getElementById('expand-title-table')
        });
    }

    function renderFieldList(wrapper){
        if(!options.enterEntity) return;
        
        var $select = wrapper.append('select')
            .attr('class', 'model_entity_select')
            .on('change',function(d){
                selectValue = this.value;
            });
        $select.data([0]);
        let dataType = iD.data.DataType;
        let modes = [
            {v: dataType.DIVIDER,n:'车道线'},
            {v: dataType.BARRIER_GEOMETRY,n:'BARRIER'},
            {v: dataType.OBJECT_PL,n:'辅助线'}
        ]
        var $options = $select.selectAll('option')
        .data(modes)
        .enter()
        .append('option')
        .property('selected', function(d){
            let flag =  d.v == options.enterEntity.modelName;
            if(flag) selectValue = d.v ;
            return flag;
        })
        .attr('value', function(d){
            return d.v;
        })
        .text(function(d){
            return d.n;
        })
        wrapper.append('lable')
        .attr('class', 'selectModelLabel')
        .text('类型')
        // var selectDomId = '';
        // [
        //     iD.data.DataType.BARRIER_GEOMETRY,
        //     iD.data.DataType.DIVIDER,
        //     iD.data.DataType.OBJECT_PL
        // ].forEach(function(modelName){
        //     if(!modelEntityMap[modelName]) return ;
        //     var renderFun;
        //     if(modelName == iD.data.DataType.BARRIER_GEOMETRY){
        //         selectDomId = 'expand-barrier-TYPE';
        //         renderFun = renderField_BARRIER;
        //     }else if(modelName == iD.data.DataType.OBJECT_PL){
        //         selectDomId = 'expand-object_pl';
        //         renderFun = renderField_OBJECT_PL;
        //     }else {
        //         return ;
        //     }
        //     var row = wrapper.append('div')
        //         .attr('class', 'expand-field-row');
        //     row.append('input')
        //         .attr('class', 'field_radio')
        //         .attr('name', 'field_radio')
        //         .attr('type', 'radio')
        //         .attr('title', modelName)
        //         .attr('data-model', modelName);
        //         // .attr('for', selectDomId);
        //     var selectWrap = row.append('div')
        //         .attr('class', 'field-select');
        //     renderFun(selectWrap, selectDomId);
        // });

        // var radios = wrapper.selectAll('input[name=field_radio]');
        // radios.on('change', function(){
        //     var self = this;
        //     radios.each(function(){
        //         if(self === this) return ;
        //         changeRadioStatus(this);
        //     });
        //     changeRadioStatus(this);
        // });
        // if(radios.node() && !radios.node().checked){
        //     radios.node().click();
        // }
    }

    function changeRadioStatus(self){
        let group = d3.select(self.parentNode);
        let selects = group.selectAll('select');
        selects.property('disabled', !self.checked);
    }

    function renderField_BARRIER(row, selectDomId){
        var modelEntity = modelEntityMap[iD.data.DataType.BARRIER_GEOMETRY];
        var field = _.find(modelEntity.getFields(modelEntity.getGeoType()), {
            fieldName: 'TYPE'
        });
        var $select = row.append('select')
            .attr('data-field', field.fieldName);
            // .attr('id', selectDomId);
        $select.data([field]);
        var $options = renderSelectDom($select, field);

        $options.property('selected', function(d){
            return DEFAULT_TYPE != null && d.value == DEFAULT_TYPE;
        });
        if(EFAULT_TYPE == null && $options.node()){
            $options.node().selected = true;
            $select.trigger('change');
        }
    }

    function renderField_OBJECT_PL(row, selectDomId){
        var modelEntity = modelEntityMap[iD.data.DataType.OBJECT_PL];
        var fieldArray = modelEntity.getFields(modelEntity.getGeoType());
        var fieldType = _.find(fieldArray, {
            fieldName: 'TYPE'
        });
        var fieldSubType = _.find(fieldArray, {
            fieldName: 'SUBTYPE'
        });
        var $select = row.append('select')
            .attr('data-field', fieldType.fieldName);
        $select.data([fieldType]);

        var $options = renderSelectDom($select, fieldType);

        var $selectSub = row.append('select')
            .attr('data-field', fieldSubType.fieldName);
        $selectSub.data([fieldSubType]);

        $select.on('change', function(field){
            $selectSub.value('');

            var value = this.value;
            var inputValues = (field.fieldInput && field.fieldInput.values || []);
            var valueObj = inputValues.filter(function(d){
                return d.value == value;
            })[0];
            if(!valueObj) return ;

            renderSelectDom($selectSub, fieldSubType, {
                optionFilter: function(v){
                    return v && v.parentId == valueObj.id;
                }
            });
        })

        if($options.node()){
            $options.node().selected = true;
            $select.trigger('change');
        }
    }

    function renderSelectDom($select, field, opts){
        $select.html('');
        opts = Object.assign({
            optionFilter: function(){
                return true;
            }
        }, opts);
        var renderValues = (field.fieldInput && field.fieldInput.values || []).filter(opts.optionFilter);
        var $options = $select.selectAll('option')
            .data(renderValues)
            .enter()
            .append('option')
            .attr('value', function(d){
                return d.value;
            })
            .text(function(d){
                return d.name;
            });
        return $options;
    }

    roadExpandTip.center = function (_) {
        if (_) {
            center = _;
            return this;
        } else {
            return center;
        }
    }

    roadExpandTip.setDefaultType = function(v){
        DEFAULT_TYPE = v;
        return this;
    }

    roadExpandTip.modelEntityMap = function(v){
        if(!v) return modelEntityMap;
        modelEntityMap = v;
        return this;
    }

    return d3.rebind(roadExpandTip, dispatch, 'on');
}
