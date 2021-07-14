iD.ui.TagEditor = {
    readOnly: function(input, readonly) {
        input.property('readOnly', !!readonly)
            .classed('no-pointer-events readonly', !!readonly);
    },
    disable: function(input, readonly) {
        input.style('opacity', !!readonly ? '0.5' : '1');
        input.property('disabled', !!readonly)
            .classed('no-pointer-events disabled', !!readonly);
    },
    toastr: function(selection, msg, opts) {
        opts = opts || {};
        var $inputWrap = $(selection.node()).closest('div.form-field');
        if ($inputWrap.position() && $inputWrap.position().top < 120) {
            opts.placement = 'bottom';
        }
        //  	var $group = $inputWrap.closest('div.field-group');
        //  	var $groupWrap = $group.closest("div.KDSEditor-inspector-body");

        opts = _.assign({
            timeout: 5000,
            placement: 'top',
            delay: 0
        }, opts);


        var toolBox = selection.append('div')
            .attr('class', 'no-pointer-events toastr-box ' +
                (opts.className ? opts.className : '')),

            toolTip = bootstrap.tooltip()
            .title(msg)
            .placement(opts.placement);

        toolBox.call(toolTip);

        if (!opts.delay) {
            toolTip.show(toolBox);

        } else {
            setTimeout(function() {
                toolTip.show(toolBox);
            }, opts.delay);
        }

        var destroyToolTip = function() {
            toolTip.destroy(toolBox);
            toolBox.remove();
        }

        setTimeout(destroyToolTip, opts.timeout);

    },
    findInputRender: function(fieldTpl, fieldModel, tags) {

        //console.log('fieldModel',fieldModel);

        if (fieldTpl.fieldRender) {
            return {
                type: fieldTpl.fieldRender,
                render: iD.ui.TagEditorInput[fieldTpl.fieldRender]
            };
        }

        if (!fieldModel) {
            ///console.error('No field model: ', fieldName, fields);

            fieldModel = {};
            return;
        }

        var fieldInput = fieldTpl.inputType || fieldModel.fieldInput;

        if (_.isString(fieldInput)) {
            fieldInput = {
                type: fieldInput
            };
        }

        var inputRender = null,
            fieldOpts = null;

        switch (fieldInput.type) {
            case 'text':
                switch (fieldModel.fieldType) {
                    case 'varchar':
                    case 'integer':
                        inputRender = iD.ui.TagEditorInput.text;
                        break;

                    default:
                        //console.warn('Unknown fieldType: ', fieldModel.fieldType, fieldModel);
                        break;
                }
                break;

            case 'select':
                // inputRender = iD.ui.TagEditorInput.select;
                inputRender = iD.ui.TagEditorInput.combo;
                var comboOpts = {};

                _.each(fieldModel.fieldInput.values, function(opt) {
                    comboOpts[opt.value] = opt.name;
                });

                fieldOpts = {
                    "strings": {
                        "options": comboOpts
                    }
                }
                break;
                // case 'selectgroup':
                //     inputRender = iD.ui.TagEditorInput.selectgroup;
                //     break;
                // case 'selectgroup2':
                //     inputRender = iD.ui.TagEditorInput.selectgroup2;
                //     break;

            default:
                console.warn('Unknown input type: ', fieldInput);
        }

        if (!inputRender) {
            //console.warn('Can not find inputRender: ', fieldInput, fieldModel);
            return;
        }

        return {
            field: fieldOpts,
            render: inputRender,
            type: fieldInput.type
        };
    },
    findUiField: function(opts, fieldName) {
        return (typeof opts.uiFields != 'undefined' && typeof opts.uiFields[fieldName] != 'undefined') ?
            opts.uiFields[fieldName].input : false;
    },
    renderField: function($field, opts, selection) {
        var fieldTpl = $field.datum(),
            fieldName = fieldTpl.fieldName,
            // opts.fields
            //          fields = opts.uiFields || {},
            fields = opts.fields || {},
            tags = opts.tags,
            fieldModel = fields[fieldName];
        if (!fieldModel) {
            return;
        }
        var fieldDispatch = d3.dispatch('change', 'render');

        var $fieldWarp = $field.selectAll('div.KDSEditor-form-field-warp').data([fieldTpl]);

        $fieldWarp
            .enter()
            .append('div')
            .attr('class', 'KDSEditor-form-field-warp');
        $fieldWarp.exit().remove();

        var inputRender = iD.ui.TagEditor.findInputRender(fieldTpl, fieldModel, tags);

        if (!inputRender) {
            //console.warn('No inputRender', fieldTpl, tags, fieldModel, fields);
            $field.selectAll('*').remove();
            return;
        }

        var fldTag = inputRender.type + '_' + fieldName,
            oldFldTag = $field.attr('data-fldtag');

        if (oldFldTag && oldFldTag != fldTag) {
            console.warn('Field not match exists html structure', $field);

            $field.selectAll('*').remove();
        }
        $field.attr('data-fldtag', fldTag);


        var $label = /*$field*/ $fieldWarp.selectAll('label.form-label')
            .data([fieldTpl]);

        $label.enter()
            .append('label')
            .attr('class', 'form-label KDSEditor-form-label');

        $label.html(function(d) {
            return fieldTpl.fieldLabel || (fieldModel && fieldModel.fieldTitle) || fieldName;
        });

        var wrap = $label.append('div')
            .attr('class', 'form-label-button-wrap KDSEditor-form-label-button-wrap');

        // wrap.append('button')
        //     .attr('class', 'modified-icon')
        //     .attr('tabindex', -1)
        //     .append('div')
        //     .attr('class', 'KDSEditor-icon undo');


        // wrap.append('button')
        //     .attr('class', 'remove-icon')
        //     .append('div')
        //     .attr('tabindex', -1)
        //     .attr('class', 'KDSEditor-icon delete');


        var fieldOpts = _.assign({}, opts, {
            fieldName: fieldName,
            fieldId: fieldName + '_' + (fieldModel ? fieldModel.modelId : opts.layer.modelId),
            fieldTpl: fieldTpl,
            fieldModel: fieldModel
        });


        $label.attr('for', function(fieldTpl) {
            return 'preset-input-' + fieldOpts.fieldId;
        })

        var parentId = fieldModel.fieldType && fieldModel.fieldType.parentId;

        var uiField = iD.ui.TagEditorInput.UIField(inputRender.render, _.assign({
            id: fieldOpts.fieldId,
            key: fieldName,
            parentId: parentId,
            type: inputRender.type,
            placeholder: function() {
                return '';
            },
            t: function(scope, options) {
                return t(scope, options);
            }
        }, inputRender.field, {
            fieldModel: fieldModel
        }), fieldOpts);
        opts.uiFields = opts.uiFields || {};
        opts.uiFields[fieldOpts.fieldName] = uiField;

        var $inpField = /*$field*/ $fieldWarp.selectAll('.form-input-field')
            .data([uiField]);

        $inpField.enter()
            .append('div')
            .attr('class', 'form-input-field');

//      if (tags[uiField.key] === undefined) {
//          tags[uiField.key] = uiField.fieldModel.defaultValue;
//      }

        var uiFieldCopy = _.cloneDeep(uiField);

        $inpField.call(uiField.input, fieldOpts, function() {
            if (parentId) {
                return iD.ui.TagEditor.renderFieldValues(opts, uiFieldCopy, parentId, arguments);
            }
            return null;
        });

        // if(uiFieldCopy.key == 'SUBTYPE'){
        //     $inpField.call(uiField.input,  uiFieldCopy);
        // }else{
        //     $inpField.call(uiField.input,  _.assign(uiFieldCopy,fieldOpts));
        // }

        // var entityType = opts.entity.modelName;

        //var readOnly = !iD.Static.layersInfo.isEditable(entityType) || !opts.layer.enable || fieldModel.readOnly === '1';
        //      if (fieldModel && !(typeof fieldModel.readOnly != "undefined")) {}
        // var readOnly = !iD.Static.layersInfo.isEditable(entityType) || !opts.layer.editable || (fieldModel && typeof fieldModel.readOnly != "undefined" && fieldModel.readOnly === '1');
        var modelConfig = iD.Layers.getLayer(opts.entity.layerId, opts.entity.modelName);
        var readOnly = (modelConfig && !modelConfig.editable) || !opts.layer.editable || (fieldModel && typeof fieldModel.readOnly != "undefined" && fieldModel.readOnly === '1');
        var role = d3.select('body').attr('role');
        if (role === 'check') {
            readOnly = true;
        }

        if (!iD.Task.working || iD.Task.working.task_id !== iD.Task.d.task_id) {
            readOnly = true;
        }

        uiField.input.readOnly(readOnly);

        uiField.input.tags(tags);

        $field.classed('readonly', readOnly)
            .classed('modified', function() {
                return uiField.modified();
            })
            .classed('present', function() {
                return uiField.present();
            })


        // function revert() {
        //     d3.event.stopPropagation();
        //     d3.event.preventDefault();
        //     uiField.input.change(uiField.revert());
        //     //opts.dispatch.change(uiField.revert());//fixed remove&revert 需要出发验证
        // }

        // function remove() {
        //     d3.event.stopPropagation();
        //     d3.event.preventDefault();
        //     uiField.input.change(uiField.revert());//fixed remove&revert 需要出发验证
        //     //opts.dispatch.change(uiField.remove());
        // }

        // wrap.select('button.remove-icon')
        //     .on('click', remove);

        // wrap.select('button.modified-icon')
        //     .on('click', revert);

        //$field.html(tags[fieldName] + JSON.stringify(fieldModel));

        /*
            @param eventTriggerType 新增参数，用来区别combo下拉框是否是点击触发，普通input默认是undefined
        */
        uiField.input.on('change.fldv', function(d, eventTriggerType) {
            // add opts增加属性，multiRoadTagFlag:true/false 用来判断属性编辑是否选中多条道路同时编辑
            var multiRoadTagFlag = false;
            if (d3.select("#multiEditor").size() > 0) {
                if (d3.select("#multiEditor")[0][0].checked) {
                    multiRoadTagFlag = true;
                }
            }
            opts.isMultiRoadTag = 0;
            opts.multiRoadTagFlag = multiRoadTagFlag;
            if (eventTriggerType) {
                opts.eventTriggerType = eventTriggerType;
            }
            var newTag = {};
            if (fieldOpts.fieldModel.fieldTypeId) {
                newTag = iD.ui.TagEditor.renderFieldParents(selection, fieldOpts, opts, fieldDispatch);
            }
            newTag = _.assign(newTag, d);
            fieldDispatch.change(newTag, fieldOpts, $inpField, uiField, opts);

        });


        if (fieldTpl.onRender) {
            $field.call(fieldTpl.onRender, fieldOpts, uiField.input);
        }
        fieldDispatch.render($field, fieldOpts, uiField.input);

        return fieldDispatch;
    },

    /* 修改select下拉选项时,检索parentId为当前下拉fieldId的进行重绘 */
    renderFieldParents: function(selection, fieldOpts, opts, fieldDispatch) {
        var fieldTypeId = fieldOpts.fieldModel.fieldTypeId,
            uiFields = opts.uiFields || {},
            newTag = {};
        if (fieldOpts.fieldModel.childGroup && fieldOpts.fieldModel.childGroup.length) {
            fieldOpts.fieldModel.childGroup.forEach(key => {
                var fieldInputs = uiFields[key];
                opts.tags[key] = fieldInputs.fieldModel.defaultValue;
                newTag[key] = fieldInputs.fieldModel.defaultValue;
                var fieldInputsKey = '.field-group .field-group-list .form-field-' + key + ' .form-input-field';
                var $field = d3.select(fieldInputsKey);
                var uiFieldCopy = _.cloneDeep(fieldInputs);
                var defaultValues = null;
                $field.call(fieldInputs.input, fieldInputs, function() {
                    if (fieldTypeId) {
                        var fieldValues = iD.ui.TagEditor.renderFieldValues(opts, uiFieldCopy, fieldTypeId, arguments);
                        defaultValues = fieldValues.find(d => { return d.value == fieldInputs.fieldModel.defaultValue });
                        return fieldValues;
                    }
                    return null;
                });
                if (defaultValues) {
                    fieldInputs.input.tags(opts.tags);
                }
            })
        }
        return newTag;
    },

    renderFieldValues: function(opts, uiField, parentId, argument) {
        var parentValue = [];
        var fieldInputValue = argument[0] || [];
        var uiFields = opts.uiFields;
        for (var ui in uiFields) {
            if (uiFields[ui].fieldModel.fieldTypeId === parentId) {
                var keyValue = d3.select('.form-field-' + uiFields[ui].key + ' select').value();

                parentValue = argument[0].find(d => {
                    return (d.value == keyValue)
                });

                var parentFieldInputValue = uiFields[ui].fieldModel.fieldInput && uiFields[ui].fieldModel.fieldInput.values || [];

                parentValue = parentFieldInputValue.find(d => { return d.value == keyValue });

                continue;
            }
        }
        if (parentValue) {
            return fieldInputValue.filter(d => { return (d.parentId == parentValue.id || !d.id) });
        }
        return [];
    },

    renderFieldGrpList: function($fieldList, opts, selection) {

        var fieldGrpDispatch = d3.dispatch('change', 'render'),
            grpTpl = $fieldList.datum();

        var $fields = $fieldList.selectAll('.form-field')
            .data(grpTpl.fields, function(d) {
                return d.fieldName;
            });

        var $enter = $fields.enter()
            .append('div')
            .attr('class', function(d) {
                return 'form-field-' + d.fieldName + ' form-field KDSEditor-form-field';
            });

        $fields.order().each(function(d) {

            var field = iD.ui.TagEditor.renderField(d3.select(this), opts, selection);
            if (field) {
                field.on('change.grp', function() {

                    if (grpTpl.onChange) {
                        grpTpl.onChange.apply($fieldList, arguments);
                    }
                    if (grpTpl.onValidate) {
                        //grpTpl.onValidate.apply($fieldList, arguments);
                    }

                    fieldGrpDispatch.change.apply(fieldGrpDispatch, arguments);

                });
                //console.error("属性字段错误");
            }
        });

        $fields.exit().remove();

        if (grpTpl.onRender) {
            $fieldList.call(grpTpl.onRender, opts);
        }

        fieldGrpDispatch.render($fieldList, opts);

        return fieldGrpDispatch;
    },

    renderFieldGroups: function(selection, tpl, opts) {
        var fieldGrpsDispatch = d3.dispatch('change', 'render');

        var $form = selection,
            $fieldGroups = $form.selectAll('.field-group')
            .data(tpl.fieldsGroup);

        var $enter = $fieldGroups.enter().append('div')
            .attr('class', 'field-group');

        // $enter.append('h3')
        //     .attr('class', 'field-group-title');

        $enter.append('div')
            .attr('class', 'field-group-list');

        // $fieldGroups.selectAll('.field-group-title').html(function(d) {
        //     return d.title;
        // });
        // 
        function packLockKey(key) {
            return 'data-l-' + key;
        }

        function lock(key) {
            $form.attr(packLockKey(key), 1);
        }

        function unlock(key) {
            $form.attr(packLockKey(key), null);
        }

        function isLocked(key) {
            return !!$form.attr(packLockKey(key));
        }

        function clone2(obj) {
            var o, obj;
            if (obj.constructor == Object) {
                o = new obj.constructor();
            } else {
                o = new obj.constructor(obj.valueOf());
            }
            for (var key in obj) {
                if (o[key] != obj[key]) {
                    if (typeof(obj[key]) == 'object') {
                        o[key] = clone2(obj[key]);
                    } else {
                        o[key] = obj[key];
                    }
                }
            }
            //o.toString = obj.toString;
            //o.valueOf = obj.valueOf;
            return o;
        }

        $fieldGroups.selectAll('.field-group-list').each(function(d) {

            iD.ui.TagEditor.renderFieldGrpList(d3.select(this), opts, selection).on('change.grps', function() {

                lock('initValidate');

                var old_sel = clone2(arguments[0]);
                if (tpl.onChange) {
                    tpl.onChange.apply(selection, arguments);
                }

                let changeVals = arguments[0];
                if (tpl.onValidate) {
                    changeVals = tpl.onValidate.apply(selection, arguments);
                }

                fieldGrpsDispatch.change.apply(fieldGrpsDispatch, arguments);
                // console.log('值发生变化：', changeVals);
                arguments[3].input.tags(_.assign({}, arguments[1].tags, changeVals)); //将onValidate的结果重置回验证后的属性。

                if (!isLocked('fldChange')) {
                    opts.dispatch.change(changeVals, arguments, old_sel, tpl);
                }

                unlock('initValidate');

            });
        });

        $fieldGroups.exit().remove();

        if (tpl.onRender) {
            selection.call(tpl.onRender, opts);
        }

        fieldGrpsDispatch.render(selection, opts);

        if (tpl.onInitValidate && !isLocked('initValidate')) { //初始化时，触发一次Validate

            if (opts.context.mode().id == 'select') {

                lock('fldChange');
                //console.warn('onInitValidate');
                for (var p in opts.uiFields) {
                    opts.uiFields[p].input.change();
                    break;
                }
                unlock('fldChange');

            }
            //selection.selectAll('.preset-input')[0][0].change();
        }

        return fieldGrpsDispatch;
    },
    /**
     * 验证字段
     */
    createInputValidate: function() {
        function strLimitIndex(str, maxLen) {
            let limitIndex = str.length;
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                let np = 0;
                //单字节加1 
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    np = 1;
                } else {
                    np = 2;
                }
                if ((len + np) > maxLen) {
                    limitIndex = i;
                    break;
                }
                len += np;
            }
            return limitIndex;
        }

        var numberReg = /^(\d+)/g;

        var inputValidate = {
            text: function(str, length) {
                // 数据库汉字2字符
                str = str == undefined ? '' : str;
                if (length != undefined) {
                    str = str.slice(0, strLimitIndex(str, length));
                }
                return str;
            },
            number: function(str, length) {
                str = str == undefined ? '' : str;
                let rst = numberReg.exec(str);
                if (rst && rst[1]) {
                    str = rst[1];
                }
                if (length != undefined) {
                    str = str.slice(0, strLimitIndex(str, length));
                }

                return Number(str);
            }
        };

        return inputValidate;
    },
    /**
     * 生成tpl中用的fieldList
     * @param {Object} modelEntity
     */
    createTplFieldList: function(modelEntity, displayFields = []) {
        var fields = modelEntity.getFields(modelEntity.getGeoType());
        var fieldOptList = [];
        for (var i in fields) {
            let field = fields[i];
            if (displayFields.length) {
                if (!_.include(displayFields, field.fieldName)) {
                    continue;
                }
            }
            if (field.display == '0') {
                continue;
            }
            let fieldObj = {};
            fieldObj.fieldName = field.fieldName;
            if (field.fieldInput == 'radio') {
                fieldObj.fieldRender = 'select';
            } else if (_.isObject(field.fieldInput)) {
                if (field.fieldInput.type == 'mulselect') {
                    fieldObj.fieldRender = 'mulselect';
                } else if (field.fieldInput.type == 'select') {
                    fieldObj.fieldRender = 'select';
                }
            } else {
                fieldObj.fieldRender = 'text';
            }
            fieldOptList.push(fieldObj);
        }

        return fieldOptList;
    }

};

iD.ui.TagEditorTpl = {};

iD.ui.TagEditorInput = {

    UIField: function(inputRender, field, opts) {

        var dispatch = opts.dispatch,
            context = opts.context,
            entity = opts.entity,
            tags = opts.tags;

        field = _.clone(field);

        field.input = inputRender(field, context, opts);
        // .on('change', function() {
        //     opts.dispatch.change.apply(opts.dispatch, arguments);
        // });

        if (field.input.entity) field.input.entity(entity);

        field.keys = field.keys || [field.key];

        //field.show = show;

        field.shown = function() {
            return field.id === 'name' || field.show || _.any(field.keys, function(key) {
                return !!tags[key];
            });
        };

        field.modified = function() {
            var original = context.graph().base().entities[entity.id];
            return _.any(field.keys, function(key) {

                return original ? tags[key] !== original.tags[key] : tags[key];
            });
        };

        field.revert = function() {
            var original = context.graph().base().entities[entity.id],
                t = {};
            field.keys.forEach(function(key) {
                t[key] = original ? original.tags[key] : undefined;
            });
            return t;
        };

        field.present = function() {
            return _.any(field.keys, function(key) {
                return tags[key];
            });
        };

        field.remove = function() {
            var t = {};
            field.keys.forEach(function(key) {
                t[key] = undefined;
            });
            return t;
        };

        return field;
    }

};