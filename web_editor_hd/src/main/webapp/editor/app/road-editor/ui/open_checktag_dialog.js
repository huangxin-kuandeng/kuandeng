(function() {

var singleDialog = null;
var LAST_POSITION = [];

iD.ui.openCheckTagDialog = function(context, entityid, opts) {
    if (singleDialog && !singleDialog.closed) {
        destoryDialog(singleDialog);
    }
    singleDialog = null;
    opts = opts || {};

    var entity = context.entity(entityid);
    var entityEditor = iD.ui.EntityEditor(context),
        rawTagEditor = uiCheckTagEditor(context),
        tagModelName = iD.data.DataType.QUALITY_TAG;
    var entityTags = _.clone(entity.tags);

    var dialog = Dialog.open({
        Title: opts.title || '质检标记详情',
        InnerHtml: '<div id="checktag_dialog_html" class="checktag_dialog_html" data-id="' + entityid + '"></div>',
        Width: 520,
        Height: 540,
        Left: LAST_POSITION[0] || '50%',
        Top: LAST_POSITION[1] || '50%',
        Modal: false,
        CancelEvent: function() {
            rawTagEditor.on('change.checktag_dialog', null);
            context.event.on('saveend.checktag_dialog', null);
            context.history().on('change.checktag_dialog', null);
            iD.User.on('dvr.checktag_dialog', null);

            var domDiv = dialog.getDialogDiv();
            if(domDiv && domDiv.style){
                LAST_POSITION = [parseInt(domDiv.style.left), parseInt(domDiv.style.top)];
            }
            dialog.close();
        }
    });
    singleDialog = dialog;

    // doms
    var $selection = d3.select('#checktag_dialog_html');
    var $root = d3.select('#_DialogDiv_' + dialog.ID).style('border', '1px solid #999');
    var $dialogTitle = $root.select('#_Title_' + dialog.ID);
    var $dialogContainer = $root.select('#_Container_' + dialog.ID);

    $dialogContainer.style({
        'overflow': 'hidden',
        'padding': '0px 5px 5px'
    });

    var $tagEditorWrapper = $selection.append('div').attr('class', 'checktag_field_content');

    refreshTagEditor();
    if (!opts.title) {
        refreshTitle();
    }

    rawTagEditor.on('change.checktag_dialog', function(tags) {
        execChangeTags(tags);
    });

    function refreshTitle() {
        // var $select = $tagEditorWrapper.select('li[data-fld=TYPE] select.value');
        // if ($select.size()) {
        //     var o = $select.node().selectedOptions[0] || {};
        //     dialog.Title = iD.Entity.id.toOSM(entityid) + ' ' + (o.text || '');
        //     $dialogTitle.text(dialog.Title);
        // }
        dialog.Title = ([false, '质检员', '验收员', '质量评估员', '基于资料的打标服务', '基于车道模型的打标服务', '逻辑检查项服务', '后自动化服务', '融合前单轨迹核线检查', '融合后单轨迹核线检查', '多轨迹核线检查', '静态激光点云真值评估'][entityTags.TAG_SOURCE] || '质检') + '标: ' + iD.Entity.id.toOSM(entity.id);
        $dialogTitle.text(dialog.Title);
    }

    function execChangeTags(tags) {
        entityEditor.entityID(entityid).changeTags(tags);
        Object.assign(entityTags, tags);
        refreshTagEditor();
    }

    function refreshTagEditor() {
        $tagEditorWrapper.call(rawTagEditor.entityID(entityid));
    }

    // buttons
    // var $buttons = $selection
    //     .append('div')
    //     .attr('class', 'tagmark_dialog_buttons filter-buttons');
    // var $copy = $buttons
    //     .append('button')
    //     .attr('type', 'button')
    //     .attr('class', 'btn btn-default');

    // 新增数据保存后没有最新id，直接关闭；
    if (parseInt(iD.Entity.id.toOSM(entityid)) < 0) {
        context.event.on('saveend.checktag_dialog', function() {
            destoryDialog(dialog);
        });
    }
    iD.User.on('dvr.checktag_dialog', function() {
        // 切换任务时触发
        destoryDialog(dialog);
    });
    context.history().on('change.checktag_dialog', function(difference, extent){
        if(!singleDialog || singleDialog.closed) return ;
        if(!difference || difference.length() != 1) return;
        let d = difference.changes()[entityid];
        if(!d) return ;
        // 撤销时删除
        if(d.base && !d.head){
            destoryDialog(dialog);
            return ;
        }
        if(!d.base || !d.head || !locEqual(d.base, d.head)) return ;
        if(difference.modified().length){
            refreshTagEditor();
        }else if(difference.deleted().length){
            destoryDialog(dialog);
        }
    });
};

function locEqual(a, b){
    return a[0] == b[0] &&
        a[1] == b[1] &&
        a[2] == b[2];
}

function destoryDialog(dialog){
    if (dialog && !dialog.closed) {
        dialog.CancelEvent && dialog.CancelEvent();
        !dialog.closed && dialog.close();
    }
};

function uiCheckTagEditor(context){
    var event = d3.dispatch('change');
    var entityId;
    var entityTags;
    var modelEntity;
    var currentLayer;
    var inputMapping = {};

    
    var FIELD_GROUP;
    var FIELD_TYPE_GROUP;

    // 一个父字段，可能有多个子字段
    function initFieldGroup(modelEntity){
        FIELD_GROUP = {};
        FIELD_TYPE_GROUP = {};
        var fields = modelEntity.getFields(modelEntity.getGeoType());
        fields.forEach(function(d){
            let type = d.fieldType;
            if(!type) return ;
            FIELD_TYPE_GROUP[type.id] = d;
            if(type.parentId){
                if(!FIELD_GROUP[type.parentId]){
                    FIELD_GROUP[type.parentId] = [];
                }
                FIELD_GROUP[type.parentId].push({
                    fieldName: d.fieldName,
                    typeId: type.id,
                    data: d
                });
            }
        });
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
                    selectGroup[s.parentId].push(Object.assign({}, s, {
                        "typeId": t.fieldType && t.fieldType.id || ''
                    }));
                }
            });
        });
    }
    
    /**
     * 修改父节点，刷新子节点
     * @param {Object} mapping inputMapping
     * @param {Object} d 
     * @param {String} selectValue 
     */
    function updateSubSelectList(mapping, d, selectValue){
        let subFields = FIELD_GROUP[d.fieldType && d.fieldType.id];
        if(!subFields || !subFields.length) return ;
        
        var subTags = {};
        
        subFields.forEach(function(sub){
            var sublist = [];
            var subFieldName = sub.fieldName;
            var subTypeId = sub.typeId;
            d.fieldType.fieldTypeValues.filter(function(e){
                if (selectValue == e.value) {
                    sublist = (_.clone(selectGroup[e.id]) || []).filter(function(v){
                        return v.typeId == subTypeId;
                    }); 
                }
            });
            //插入空选项
            // sublist.unshift({
            //     name: '==请选择==',
            //     value: ''
            // });
            // 默认值
            var linkDefaultValue = sublist.filter(function(v){
                return v.value == '0';
            })[0] == null ? '' : '0';
            // console.log(d.fieldName + '修改，初始化 ' + subFieldName, sub, sublist, linkDefaultValue);

            
            let linkedFieldName = subFieldName;
            let subselect = mapping[linkedFieldName]
            let subValue = subselect?subselect.value(): '';
            subselect && subselect.render(sublist);
    
            if(subValue != linkDefaultValue){
                subselect && subselect.value(linkDefaultValue);
                // 手动触发子select的change事件，会导致selectValueChange提前执行
                // entity_edtior.js中会重新渲染属性列表
                // $subselect.dispatch('change');
                subTags[subFieldName] = linkDefaultValue;
            }else {
                subTags[subFieldName] = subValue;
            }
        });
        subFields.forEach(function(sub){
            var tags = updateSubSelectList(mapping, sub.data, subTags[sub.fieldName]);
            tags && Object.assign(subTags, tags);
        });
        return subTags;
    }

    /**
     * 父节点渲染列表，子节点空列表
     * @param {Object} select 
     * @param {Object} d 
     */
    function updateSelectOptions(select, d){
        var type = d.fieldType;
        var subarr = [];
        if(!type || !type.parentId){
            d.fieldInput.values && d.fieldInput.values.filter(function(e){
                subarr.push({
                    "name": e.name,
                    "value": e.value
                });
            });
        }
        var optionData = _.clone(subarr);
        //插入空选项
        // optionData.unshift({
        //     name: '==请选择==',
        //     value: '',
        //     values: []
        // });

        select.render(optionData);
    }

    function checkTag(selection){
        inputMapping = {};
        var entity = context.hasEntity(entityId);
        if (!entity) {
            return;
        }
        modelEntity = iD.ModelEntitys[entity.modelName];
        if(!modelEntity) return ;
        currentLayer = iD.Layers.getLayerById(entity.layerId);
        entityTags = _.clone(entity.tags);

        var entries = [];
        modelEntity.getFields(modelEntity.getGeoType()).forEach(function (field) {
            var _name = field.fieldName || '',
                //可能无中文名称，就用name代替
                _title = field.fieldTitle || _name;
            var _value = entityTags[_name] || '';
            field.title = _title;
            field.value = _value;

            entries.push(field);
        });
        var _writeTags = entries.filter(function (d) {
            // display，0不渲染
            return d.display != '0';
        });
        selectGroups(_writeTags);
        initFieldGroup(modelEntity);

        selection.node().innerHTML = '';

        var row1 = selection.append('div').attr('class', 'list-raw');
        var enter = row1.selectAll('div.list-select').data([
            'MODEL',
            'FEATURE',
            'ERROR_TYPE',
            'ATTRIBUTE'
        ]);
        enter.exit().remove();
        enter.enter()
            .append('div')
            .attr('class', 'list-select')
            .each(function(fieldName){
                let field = getField(fieldName);
                let s = new uiSelect(d3.select(this), field);
                s.disabled(getFieldDisabled(field));
                inputMapping[fieldName] = s;
                
                bindInputEvents(s);

                updateSelectOptions(s, field);
            });

        var row2 = selection.append('div').attr('class', 'list-raw');

        enter = row2.selectAll('div.row').data([
            ['DESC'],
            ['STATE'],
            ['CREATE_BY', 'EDIT_BY', 'CHECK_BY'],
            ['FEATURE_ID'],
            ['TAG_SOURCE'/*, 'QA_TYPE'*/]
        ]);
        enter.exit().remove();
        var rowList = enter.enter()
            .append('div')
            .attr('class', 'row');
        var colEnter = rowList.selectAll('div.col').data((d)=>d);
        colEnter.exit().remove();
        colEnter.enter()
            .append('div')
            .attr('class', 'col')
            .each(function(fieldName){
                var $this = d3.select(this);
                var len = d3.select(this.parentNode).datum().length;
                if(len > 1){
                    $this.style('width', (100/len).toString().slice(0, 6) + '%');
                }
                let field = getField(fieldName);
				let cloneFiled =  _.cloneDeep(field);
				
				if( iD.User.isWorkRole() && (fieldName == "STATE") ){
					
					let _index = _.findIndex(cloneFiled.fieldInput.values, function(o) { return o.value == "1"; });
					cloneFiled.fieldInput.values.splice(_index, 1);
					cloneFiled.fieldType.fieldTypeValues.splice(_index, 1);
					
				}
				
				
                let input;
                let fieldType = cloneFiled.fieldInput.type || cloneFiled.fieldInput;
                if(['select', 'selectgroup'].includes(fieldType)){
                    input = new uiSelect($this, cloneFiled);
                }else if(['text'].includes(fieldType)) {
                    input = new uiText($this, cloneFiled);
                }
				
				if( !iD.User.isWorkRole() || (fieldName != "STATE") ){
					input.disabled(getFieldDisabled(cloneFiled));
				}

                $this.classed('list-' + input.type, true);
                inputMapping[fieldName] = input;

                bindInputEvents(input);

                if(input.type == 'select'){
                    updateSelectOptions(input, cloneFiled);
                }
            });
        // 修改部分样式
        {
            let $fid = row2.selectAll('div.col[data-fld=FEATURE_ID]');
            if($fid.size()){
                $fid.select('.label-name').style('width', '126px');
                $fid.select('.content').style('width', 'calc(100% - 126px)');
            }
        }
        
        // var row3 = selection.append('div').attr('class', 'list-raw');

        for(let name in inputMapping){
            let input = inputMapping[name];
            input.value(entityTags[name]);
            if(input.type == 'select'){
                updateSubSelectList(inputMapping, input.getField(), input.value());
            }
        }

        // 错误属性特殊，非级联菜单，但是要根据FEATURE和TYPE生成列表；
        var inputFeature = inputMapping['FEATURE'];
        var inputType = inputMapping['ERROR_TYPE'];
        if(inputFeature){
            var inputAttribute = inputMapping['ATTRIBUTE'];
            let model = iD.ModelEntitys[inputFeature.value()];
            inputAttribute.render(getFieldOptions_ATTRIBUTE(model, entity));

            inputFeature.on('change.field_FEATURE', function(d, value){
                let model = iD.ModelEntitys[value];
                inputAttribute.value('');
                inputAttribute.triggerChange();
                inputAttribute.render(getFieldOptions_ATTRIBUTE(model, entity));
            });
            inputType.on('change.field_TYPE', function(){
                let model = iD.ModelEntitys[inputFeature.value()];
                inputAttribute.value('');
                inputAttribute.triggerChange();
                inputAttribute.render(getFieldOptions_ATTRIBUTE(model, entity));
            });
        }
    }

    function bindInputEvents(input){
        if(input.type == 'select'){
            input.on('change', function(d, value){
                var subTags = updateSubSelectList(inputMapping, d, value);
                        
                function triggerChange(evt, v){
                    selectValueChange(d, v, subTags);
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                }
    
                // 没有子选项
                triggerChange(d3.event, value);
    
                // if(!_.isEmpty(subTags)){
                //     triggerChange(d3.event, value);
                // }
            });
        }else {
            input.on('change', function(d, value){
                keyValueChange(d, value);
            });
        }
    }

    function getFieldDisabled(d){
        // 问题类型，只有质检员和验收员可修改；
        if(d.fieldName == 'QA_TYPE' && !(iD.User.isCheckRole() || iD.User.isVerifyRole())){
            return true;
        }
        return !currentLayer || !currentLayer.editable || d.readOnly == '1';
    }

    var ATTRIBUTE_filter = [
        'AREA_FLAG',
        'OPERATOR',
        'SOURCE',
        'SDATE',
        'FLAG',
        'TASK_ID',
        'BATCH',
        'SEQ'
    ];

    function getFieldOptions_ATTRIBUTE(model, entity){
        // 类型“属性错误”、“属性缺失”、“规格错误”时显示
        if(entity && !['3', '4', '8'].includes(entity.tags.ERROR_TYPE+'')){
            return [];
        }
        return model && model.getFields(model.getGeoType()).filter(function(d){
            return !ATTRIBUTE_filter.includes(d.fieldName);
        }).map(function(d){
            return {
                name: d.fieldTitle || d.fieldName,
                value: d.fieldName
            };
        }) || [];
    }

    function getField(fieldName){
        var fields = modelEntity.getFields(modelEntity.getGeoType())
        return fields.filter(d=>d.fieldName == fieldName)[0];
    }

    function keyValueChange(d, value) {
        iD.UserJobHeartbeat.setJobStatus();
     
        var tag = {};
        tag[d.fieldName] = value;
        event.change(tag);
        context.event.entityedite && context.event.entityedite({entitys: [entityId]});
    }

    function selectValueChange(d, value, mergeTags) {
        iD.UserJobHeartbeat.setJobStatus();
     
        var tag = {};
        tag[d.fieldName] = value;
        if(mergeTags){
            Object.assign(tag, mergeTags);
        }
        event.change(tag);
        context.event.entityedite && context.event.entityedite({entitys: [entityId]});
    }

    checkTag.entityID = function(v){
        if(!arguments.length) return entityId;
        entityId = v;
        return this;
    }

    return d3.rebind(checkTag, event, 'on');
}

function uiSelect(selection, field){
    var value;
    var dispatch = d3.dispatch('change');
    var disabled = false;

    selection.node().innerHTML = '';
    selection.attr('data-fld', field.fieldName);
    selection
        .append('label')
        .attr('class', 'label-name')
        .text(function(){
            return field.fieldTitle || field.fieldName
        });
    var optionWrap = selection
        .append('div')
        .attr('class', 'select-options content');

    // this.type = field.fieldInput.type || field.fieldInput || 'select';
    this.type = 'select';

    function updateSelected(){
        var div = optionWrap.selectAll('div.selected');
        div.size() && div.classed('selected', false);
        div = optionWrap.selectAll('div.option').filter(function(){
            return this.getAttribute('value') == value;
        });
        div.size() && div.classed('selected', true);
    }

    function triggerChange(){
        dispatch.change(field, value);
    }

    this.render = function(optionList = []){
        var self = this;
        // optionWrap.selectAll('div.option').remove();
        optionWrap.selectAll('div.option')
            .data(optionList)
            .enter()
            .append('div').attr('class', 'option')
            .attr('value', function(o) {
                return o.value;
            })
            .attr('title', function(o) {
                return o.name;
            })
            .text(function(o) {
                return o.name;
            })
            .on('click', function(){
                if(disabled) return ;
                let v = this.getAttribute('value');
                self.value(v);
                triggerChange();
            });
        updateSelected();
    }

    this.getField = function(){
        return field;
    }

    this.element = function(){
        return selection;
    }

    this.disabled = function(v){
        if(!arguments.length) return disabled;
        disabled = v == true;
        selection.classed('disabled', disabled);
        return this;
    }

    this.value = function(v){
        if(!arguments.length) return value;
        value = v;
        updateSelected();
        return this;
    }
    this.triggerChange = triggerChange;

    d3.rebind(this, dispatch, 'on');

    this.render();
}

function uiText(selection, field){
    var value;
    var dispatch = d3.dispatch('change');
    var disabled = false;

    selection.node().innerHTML = '';
    selection.attr('data-fld', field.fieldName);
    selection
        .append('label')
        .attr('class', 'label-name')
        .text(function(){
            return field.fieldTitle || field.fieldName
        });
    var inputWrap = selection
        .append('div')
        .attr('class', 'content');

    this.type = 'text';

    function updateInput(){
        var input = inputWrap.selectAll('input').node();
        input.value = value;
        input.disabled = disabled;
        input.title = input.value;
    }

    function triggerChange(){
        dispatch.change(field, value);
    }

    this.render = function(v){
        var self = this;
        // inputWrap.node().innerHTML = '';
        inputWrap.append('input')
            .attr('type', 'text')
            .on('change', function(){
                if(disabled) return ;
                self.value(this.value);
                triggerChange();
            });
        v && this.value(v);
        updateInput();
    }

    this.getField = function(){
        return field;
    }

    this.element = function(){
        return selection;
    }

    this.disabled = function(v){
        if(!arguments.length) return disabled;
        disabled = v == true;
        selection.classed('disabled', disabled);
        return this;
    }

    this.value = function(v){
        if(!arguments.length) return value;
        value = v;
        updateInput();
        return this;
    }
    this.triggerChange = triggerChange;

    d3.rebind(this, dispatch, 'on');

    this.render();
}

})();