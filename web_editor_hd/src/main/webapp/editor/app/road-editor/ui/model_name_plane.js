/*
 * @Author: tao.w
 * @Date: 2020-09-07 16:35:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-09 10:49:39
 * @Description: 
 */

iD.ui.modelNamePlane = function (context, options = {}) {

    var modelNamePlane = {};
    let modelDialog = null;
    let container;
    let modelName = options.modelName;
    var selectGroup;
    let radios = [{ name: 'edge', 'label': '底边缘', 'value': 1,'default':true }, { name: 'edge', 'label': '上边缘', 'value': 2 }];

    function initDialog() {
        modelDialog = iD.dialog(null, {
            width: 400,
            height: 'auto',
            appendTo: '#id-container',
            autoOpen: false,
            modal: true,
            resizable: true,
            closeBtn: true,
            onTask: true,
            destroyOnClose: false
        });
        modelDialog.widget().classed('modelNamePlane', true);
        modelDialog.widget().select('.ui-dialog-titlebar-close.iconfont.icon-close')
            .on('click', function () {
                context.enter(iD.modes.Browse(context));
            });
        container = modelDialog.element.append('div')
            .attr('class', 'modelSelectContainer');
        let footer = modelDialog.element.append('div')
            .attr('class', 'modelSelectFooter')
        footer.append('button')
            .attr('type', 'button')
            .text('确定')
            .on('click', (e) => {
                modelDialog.close();
            })
    }
    //生成级联select对象数组。格式 {Array[parentId] = [sub1, sub2, sub3], ……}
    function selectGroups(writeTags) {
        selectGroup = {};
        //遍历tags中所有的属性项
        writeTags.forEach(function (t) {
            //遍历每个属性项中所有满足parentId不为空的进行创建对象数组并赋值
            t.fieldInput.values && t.fieldInput.values.forEach(function (s) {
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
    function createSelectInput(_writeTags, selection) {

        var $list = selection.selectAll('.tag-list')
            .data([0]);
        $list.enter().append('ul')
            .attr('class', 'tag-list clearfix');

        var $items = $list.selectAll('li')
            .data(_writeTags, function (d) {
                console.log(d.id)
                return d.id;
            });


        selectGroups(_writeTags);

        var $enter = $items.enter().append('li')
            .attr('class', 'tag-row cf')
            .attr('data-fld', function (d) {
                return d.fieldName;
            });

        $enter.append('div')
            .attr('class', 'key-wrap')
            .append('label')
            .attr('class', 'key KDSEditor-label');

        var $inputWrapPosition = $enter.append('div')
            .attr('class', 'input-wrap-position');
        var parentId = false;
        $inputWrapPosition.each(function (d) {
            var that = this;

            //针对select类型，输出下拉列表框
            if (d.fieldInput.type === 'select') {

                var select = d3.select(that).append('select')
                    .attr('class', 'value');

                var subarr = [];

                d.fieldInput.values && d.fieldInput.values.filter(function (e) {
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
                    if (d.fieldName == 'SUBTYPE') {
                        var optionData = [];
                    } else {
                        var optionData = _.clone(d.fieldInput.values);
                    }
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
                    .attr('value', function (o) {
                        return o.value;
                    })
                    .attr('title', function (o) {
                        return o.name;
                    })
                    .attr('label', function (o) {
                        return iD.util.substring(o.name, 8);
                    })
                    .text(function (o) {
                        return iD.util.substring(o.name, 8);
                    });

            } else if (d.fieldInput.type === 'selectgroup') {
                //级联菜单走这里
                var select = d3.select(that).append('select')
                    .attr('class', 'value')
                    .on('change.selectgroup', function (o) {
                        if (!o) {
                            return;
                        }
                        let selectvalue = this.value;//获取value

                        let falg = false;
                        let sublist;
                        o.fieldType.fieldTypeValues.filter(function (e) {
                            if (selectvalue == e.value) {
                                sublist = _.clone(selectGroup[e.id]);
                                parentId = e.id;
                                if (!sublist) {
                                    sublist = [];
                                }
                                //插入空选项
//                              sublist.unshift({
//                                  name: '==请选择==',
//                                  value: '',
//                                  values: []
//                              });
                            }
                        })

                        //TODO 获取dom方式临时方式，Tilden
                        //VALUE方式是因为Road_Attribute命名不规范导致
                        var subtypeselect = $list.select("li[data-fld='SUBTYPE']")[0][0] ? $list.select("li[data-fld='SUBTYPE']") : $list.select("li[data-fld='VALUE']");
                        var $subselect = subtypeselect.select('select.value');
                        var subselect = $subselect.node();
                        // var subValue = subselect.value;

                        var subtypeoptionData = _.clone(sublist);
                        subtypeselect.selectAll('option').remove();
                        var suboptions = subtypeselect.select('select').selectAll('option')
                            .data(subtypeoptionData)
                            .enter()
                            .append('option')
                            .attr('value', function (o) {
                                return o.value;
                            })
                            .attr('title', function (o) {
                                return o.name;
                            })
                            .attr('label', function (o) {
                                return iD.util.substring(o.name, 8);
                            })
                            .text(function (o) {
                                return iD.util.substring(o.name, 8);
                            });

                    });

                var optionData = _.clone(d.fieldInput.values);

                var selectvalue = d.value;
                d.fieldInput.values.filter(function (e) {
                    if (selectvalue == e.value) {
                        parentId = e.id;
                    }
                })

                //初始化默认列表
//              optionData.unshift({
//                  name: '==请选择==',
//                  value: '',
//                  values: []
//              });

                var options = select.selectAll('option')
                    .data(optionData)
                    .enter()
                    .append('option')
                    .attr('value', function (o) {
                        return o.value;
                    })
                    .attr('title', function (o) {
                        return o.name;
                    })
                    .attr('label', function (o) {
                        return iD.util.substring(o.name, 8);
                    })
                    .text(function (o) {
                        return iD.util.substring(o.name, 8);
                    });
            } else {
                d3.select(that).append('input')
                    .property('type', 'text')
                    .attr('class', 'value KDSEditor-input')
                    .attr('maxlength', function (item) {
                        return parseInt((item.size || 80), 10);
                    });
            }
        });

        // Update
        $items.order();


        $items.select('label.key')
            .html(function (d) {
                return d.title;
                return iD.util.substring(d.title, 6);
            })
            .attr('title', function (d) {
                return d.title;
            });

        //附加事件，填充值，必须创建完元素后设置，创建元素时设置值不起作用
        // $items.select('input.value')
        //     .value(function(d) {
        //     	return textFormat(d, d.value);
        //     })
        //     .property('title', function(d) {
        //         return d.value;
        //     })
        //     .on('change', valueChange)
        //     .on('keyup', keyValueChange)
        //     .on('blur', valueChange)
        //     .each(function(d){
        //     	updateFieldInputStatus(this, d, id);
        //     });
        function selectValueChange(d) {
            if (!d) {
                d = d3.event.target.parentNode.__data__;
            }

            d.value = this.options[this.selectedIndex].value;
            if (context.variable.aboveGround.attr.hasOwnProperty(d.fieldName)) {
                context.variable.aboveGround.attr[d.fieldName] = d.value;
                let type = iD.Mapping.aboveGround[modelName][d.value];
                context.variable.aboveGround.type = type;
            }

        }
        var selectEvent = selectValueChange;

        $items.select('select.value')
            .on('change.selectvaluechange', selectEvent)
            .each(function (item) {
                //获得所有options
                d3.select(this).selectAll('option')
                    .each(function (option) {
                        //如果当前option.value == 当前tag.value则选中
                        d3.select(this).property('selected', option.value == item.defaultValue);
                        if (option.value == item.value) {
                            d3.select(this.parentElement).attr('title', option.name);
                        }
                    });
            })

        $items.exit().remove();
    }

    function getFields(modelName, attr = []) {
        let modelEntity = iD.ModelEntitys[modelName];
        let geoType = modelEntity.getGeoType();
        let fields = modelEntity.getFields(geoType);

        fields = fields.filter(d => { return attr.includes(d.fieldName) });
        var _tags = [];
        _(fields).each(function (field) {

            let _title = field.fieldTitle;
            let _value = field.defaultValue;

            field.title = _title;
            field.value = _value;

            _tags.push(field);
        });
        return fields;
    }
    function radio(selection) {

        $container = selection.append('div')
            .attr('class', 'edge-radio');

        $radioList = $container.selectAll('label.radio')
            .data(radios);

        var $newChecks = $radioList.enter()
            .append('label')
            .attr('class', 'radio');

        $newChecks.append('input')
            .attr('type', 'radio')
            .attr('class', 'inp-radio');

        $newChecks.append('span')
            .attr('class', 'label');

        $radioList.selectAll('input.inp-radio')
            .attr('name', function (d) {
                return d.name;
            })
            .attr('value', function (d) {
                return d.value;

            }).on('click', function (d) {
                context.variable.aboveGround.edge = d.value;
            }).property('checked', function (d) {
                return !!d.default;
            });

        $radioList.selectAll('span.label').html(function (d) {
            return d.label;
        });
    };
    function update() {
        let attr = options.attr;
        if (!attr) {
            console.error('模型选择面板无属性');
            return
        }
        let fields = getFields(modelName, attr);
        // let _container = container.select('.modelSelectContainer');
        createSelectInput(fields, container);

        let _attr = {};
        if (fields == 0 || fields.length > 1) {
            console.error('模型选择面板无属性');
            return
        }
        radio(container);
        _attr[fields[0].fieldName] = fields[0].defaultValue;

        let type = iD.Mapping.aboveGround[modelName][fields[0].defaultValue];
        context.variable.aboveGround = {
            modelName: modelName,
            attr: _attr,
            edge:1,
            type,
            isEditor: true
        }
    }

    modelNamePlane.show = function () {
        if (modelDialog == null) initDialog();
        modelDialog.open();
        update();
        // modelDialog.element.style('height', 'auto');
    }

    modelNamePlane.hide = function (_) {
        modelDialog.close();
    }

    return modelNamePlane;
}
