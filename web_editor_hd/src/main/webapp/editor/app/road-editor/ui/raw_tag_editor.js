/**
 * 属性列表key/value(输入框)列表
 * 点击divider_node时会显示关系（iD.ui.TagEditorInput.relations）
 * @param {Object} context
 */
iD.ui.RawTagEditor = function(context) {
    var event = d3.dispatch('change'),
        state,
        tags,
        id,
        currentLayer,
        modelEntity,
        geoType,
        fields,
        intercept = 6;
    var currentRoadIndex = 0,
        selectIdsLength = 0,
        selectIds = [];


    // 渲染 key/value
    var tagEditors = [
        iD.ui.TagEditor.RoadTagEditor(context),
        iD.ui.TagEditor.RoadNodeTagEditor(context),
        iD.ui.TagEditor.RoadCrossTagEditor(context),
        iD.ui.TagEditor.PavementDistressTagEditor(context),
        // iD.ui.TagEditor.DividerNodeTagEditor(context),
        iD.ui.TagEditor.PoiTagEditor(context),
        iD.ui.TagEditor.DividerAttributeTagEditor(context),
        iD.ui.TagEditor.LaneAttributeTagEditor(context),
        iD.ui.TagEditor.RoadAttributeTagEditor(context)
    ];

    _.each(tagEditors, function(editor) {
        editor.on('change', event.change);
    });

    // 部分字段特殊处理，优先fieldObj.readOnly
    function updateFieldInputStatus(inputDom, d, entityid) {
        var entity = context.hasEntity(entityid);
        if (!entity) return;
        var $input = d3.select(inputDom);
        // 当前节点在范围外，禁止编辑节点类型
        if (d.fieldName == 'DASHTYPE' &&
            entity.modelName == iD.data.DataType.DIVIDER_NODE &&
            !context.transactionEditor()) {
            if (!iD.util.entityInPlyGon(entity, context)) {
                $input.property('disabled', true);
            }
        }
    }

    /**
     * 上一个
     * */
    function previousRoad() {

        currentRoadIndex = currentRoadIndex - 1;
        if (currentRoadIndex < 1) {
            currentRoadIndex = 1;
            return;
        }

        var selectid = selectIds[currentRoadIndex - 1];
        //      d3.select("#multiRoadEditor_footer #currentRoadInfo").text(currentRoadIndex + "/" + selectIdsLength);
        d3.select("#currentRoadPageNumber").value(currentRoadIndex);

        if (d3.event) {
            d3.event._isFromList = true;
        }
        context.enter(iD.modes.Select(context, [selectid], null, true)
            .newFeature(true));
        //      iD.util.entityRelationFooterHighlightSelector(context.entity(selectid), context, true);
        // toogleRoadName_ZHState();
    }

    /**
     * 下一个
     * */
    function nextRoad() {

        currentRoadIndex = currentRoadIndex + 1;
        if (currentRoadIndex > selectIdsLength) {
            currentRoadIndex = selectIdsLength;
            return;
        }

        var selectid = selectIds[currentRoadIndex - 1];
        //      d3.select("#multiRoadEditor_footer #currentRoadInfo").text(currentRoadIndex + "/" + selectIdsLength);
        d3.select("#currentRoadPageNumber").value(currentRoadIndex);

        if (d3.event) {
            d3.event._isFromList = true;
        }

        context.enter(iD.modes.Select(context, [selectid], null, true)
            .newFeature(true));
        //      iD.util.entityRelationFooterHighlightSelector(context.entity(selectid), context, true);
        // toogleRoadName_ZHState();
    }

    function locationEntity(entity) {
        var selExtent = iD.geo.Extent(),
            map = context.map(),
            graph = context.graph();
        var oldExtentArea = selExtent.area() || 1;

        selExtent = selExtent.extend(entity.extent(graph));

        if (parseInt(map.extentZoom(selExtent)) < 20) {
            map.zoom(20);
        } else {
            map.extent(selExtent);
        }

    }

    /**
     * 多数据选择属性显示，页码处理
     * @param wrapper DOM
     * @parma entity 当前选中实体
     * Tilden
     * */
    function presetFooter(wrapper, entity) {
        if (_.include([
                iD.data.DataType.DIVIDER_ATTRIBUTE,
                iD.data.DataType.LANE_ATTRIBUTE,
                iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION,
                iD.data.DataType.BARRIER
            ], entity.modelName)) {
            return;
        }

        var data = []
        var d3Obj = d3.select("#KDSEditor-sidebar");
        if (d3Obj.size() > 0) {
            // 若有关系成员列表，优先使用
            let selectIds = d3Obj.attr("data-member-multiselectids") || d3Obj.attr("data-multiselectids");
            if (selectIds) {
                data.push(selectIds);
            }
        }

        var preset_footer = wrapper.append("div").attr('class', 'preset-form form-input-field checkselect').attr('id', 'multiRoadEditor_footer');
        var roadNav = preset_footer.append("div").attr('class', 'preset-form form-input-field');
        selectIds = data.length > 0 ? data[0].split(",") : data;
        if (!selectIds || !selectIds.length) {
            return;
        }
        var index = _.indexOf(selectIds, entity.id);
        currentRoadIndex = (index || 0) + 1;
        selectIdsLength = selectIds.length;
        var ul = roadNav.append("nav").append("ul").attr("class", "pagination");
        // 上一个
        ul.append("li").append("a").on("click", previousRoad).attr({
            "aria-label": "Previous",
            "href": "#"
        }).append("span").attr({
            "aria-hidden": true
        }).text("«");
        // 页码
        var $input = ul.append("li").append("input").attr({
            "aria-label": "Number",
            "type": "text",
            "id": 'currentRoadPageNumber',
            "min": 1,
            "max": selectIdsLength
        }).value(currentRoadIndex);

        ul.append("li").append("a").attr({
            "href": "#"
        }).append("span").attr({
            "aria-hidden": true,
            "id": "currentRoadInfo"
        }).text("/" + selectIdsLength);
        // 下一个
        ul.append("li").append("a").on("click", nextRoad).attr({
            "aria-label": "Next",
            "href": "#"
        }).append("span").attr({
            "aria-hidden": true
        }).text("»");

        roadNav
            .append("nav")
            .append("ul").attr("class", "pagination")
            .append("li").append("a").on("click", _returnHomeList).attr({
                "href": "#"
            }).text("返回");

        $input
            .on('change', _roadPageNumberChange)
            .on('keyup', function() {
                var evt = d3.event;
                if (!evt) return false;
                if (evt.keyCode == 13 || evt.keyCode == 108) {
                    _roadPageNumberChange.call(this);
                }
                return false;
            });

        ul.selectAll('li').classed('clearfix', true).style('float', 'left');

        locationEntity(entity);
    }

    function _roadPageNumberChange() {
        var num = Number(this.value);
        var min = Number(this.min),
            max = Number(this.max);
        if (isNaN(num)) {
            num = min;
        }
        if (num < min) {
            num = min
        }
        if (num > max) {
            num = max
        }
        this.value = num;
        // 更改页码
        currentRoadIndex = num - 1;
        nextRoad();
    }
    /**
     * 返回要素列表
     */
    function _returnHomeList() {
        //  	if(!selectIds || !selectIds.length){}
        var d3Obj = d3.select("#KDSEditor-sidebar");
        if (d3Obj.size() > 0) {
            var str = d3Obj.attr("data-multiselectids") || '';
            if (str.length) {
                selectIds = str.split(',');
            }
        }
        context.enter(iD.modes.Select(context, selectIds)
            .suppressMenu(true));
    }

    function reIntercept() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        intercept = width > 1300 ? 6 : 3;
        intercept = width < 820 ? 1 : intercept;
    }

    function rawTagEditor(selection) {
        //console.log("rawTagEditor",selection);
        selection.html('');
        var $form = selection.selectAll('.preset-form')
            .data([0]);

        $form.enter().append('div')
            .attr('class', 'preset-form inspector-inner fillL3');
        var tagEditorPanes = $form.selectAll('.tag_editor_pane')
            .data(tagEditors);

        tagEditorPanes.enter().append('div')
            .attr('class', 'tag_editor_pane');


        var entity = context.entity(id);
        var matchedTagEditor = null;

        tagEditorPanes.each(function(d) {

            var available = !matchedTagEditor && d.available(entity);

            if (available) {
                matchedTagEditor = d;
            }

            var pane = d3.select(this);

            pane.classed('KDSEditor-inspector-hidden', !available);

            if (available) {
                pane.call(d, {
                    id: id,
                    tags: tags
                });
                pane.on && pane.on('change.raw_tag_editor', function() {
                    context.event['entityedite'] && context.event['entityedite']({
                        entitys: []
                    });
                });
            }
        });

        var $tagContent = selection.selectAll('.tag-content')
            .data([0]);

        $tagContent.enter().append('div')
            .attr('class', 'tag-content');

        if (matchedTagEditor) {
            $tagContent.html('');
            //判断如果加载过，则不重复加载
            if (d3.select(".preset-form.form-input-field.checkselect").data([0]).empty()) {
                presetFooter(selection, entity);
            }
            return;

        } else {


            // currentLayer = entity.layerInfo();
            currentLayer = context.layers().getLayer(entity.layerId, entity.modelName);
            // modelEntity = currentLayer.modelEntity();
            modelEntity = iD.ModelEntitys[entity.modelName];
            if (!modelEntity) {
                selection.selectAll('.tag-list').remove();
                return;
            }
            geoType = modelEntity.getGeoType();
        }
        reIntercept();
        fields = modelEntity.getFields(geoType);
        selection.call(content);

        d3.select(window).on('resize.rawTagEditor', function() {
            reIntercept();
            selection && content && selection.call(content);
        });
    }
    var selectGroup;
    //生成级联select对象数组。格式 {Array[parentId] = [sub1, sub2, sub3], ……}
    function selectGroups(writeTags) {
        var parentOptions = {};
        selectGroup = {};
        //遍历tags中所有的属性项
        writeTags.forEach(function(t) {
            //遍历每个属性项中所有满足parentId不为空的进行创建对象数组并赋值
            t.fieldInput.values && t.fieldInput.values.forEach(function(s) {
                parentOptions[s.id] = t.id;
                if (s.parentId && !selectGroup[s.parentId]) {
                    var cid = parentOptions[s.parentId];
                    selectGroup[s.parentId] = {
                        cid: cid,
                        fieldName: t.fieldName,
                        options: []
                    };
                }
                if (selectGroup[s.parentId]) {
                    selectGroup[s.parentId].options.push({
                        "name": s.name,
                        "value": s.value
                    });
                }
            });
        });
    }

    function content($wrap) {
        var entity = context.hasEntity(id),
            //节点Tag
            entries = d3.entries(tags);
        if (!entity) {
            return;
        }

        //console.log(entries);

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
        if (entity.modelName == iD.data.DataType.DEFAULT) {
            let _idx = 1;
            _tags = _.map(entity.tags, function(v, k) {
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
        //console.log(tags, fields, _tags);
        entries = _tags;

        var _writeTags = _.filter(entries, function(d) {
                //TODO:现在是全部可以编辑， 需要个性
                //              d.readOnly = '0';
                //              return true;
                // display，0不渲染
                return d.display != '0';
                return d.readOnly == '0'
            }),
            _readonlyTags = _.filter(entries, function(d) {
                return d.readOnly == '1'
            });


        //可读区域
        $wrap.call(drawWriteTags);

        //只读区域
        //$wrap.call(drawReadOnlyTags);

        function selectValueChange(d) {
            /*if(arguments[3]){
            	d = d3.event.target.parentNode.__data__;
            }*/
            if (!d) {
                d = d3.event.target.parentNode.__data__;
            }
            iD.UserJobHeartbeat.setJobStatus();

            var tag = {},
                _fieldTitle = '修改' + d.fieldTitle + ' :' + d.value;
            tag[d.fieldName] = this.options[this.selectedIndex].value;

            var v_id = this.options[this.selectedIndex].getAttribute('name');
            if (selectGroup && selectGroup[v_id] && selectGroup[v_id].fieldName) {
                var c_fieldName = selectGroup[v_id].fieldName;
                var c_field = fields.find(d => {
                    return d.fieldName == c_fieldName;
                })
                if (c_field) {
                    tag[c_fieldName] = c_field.defaultValue;
                }
            }

            event.change(tag);
            // var  ob = [{
            //     'attributeName': d.fieldName || '',
            //     'originalValue': d.value || '',
            //     'newValue':tag[d.fieldName] || '',
            //     'action':'update'
            // }]
            // iD.logger.editElement('propertyPanel', modelEntity._modelName, '', _fieldTitle,null,ob);
            context.event['entityedite'] && context.event['entityedite']({
                entitys: [id]
            });
        }

        function keyValueChange(d) {
            var that = this,
                _currentObj = d3.select(that),
                _value = that.value,
                flag = /^\d+(\.\d+)?$/.test(_value);
            context.event['entityedite'] && context.event['entityedite']({
                entitys: [id]
            });
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
                _value = that.value,
                _fieldTitle = '修改' + d.fieldTitle + ' :' + _value;
            _currentObj.classed('error', false)
                .attr('placeholder', '');

            var tag = {};
            tag[d.fieldName] = _value;
            event.change(tag);
            // var  ob = [{
            //     'attributeName': d.fieldName || '',
            //     'originalValue': d.value || '',
            //     'newValue':tag[d.fieldName] || '',
            //     'action':'update'
            // }]
            // iD.logger.editElement('propertyPanel', modelEntity._modelName, '', _fieldTitle,null,ob);
        }
        //车道信息使用--Tilden
        function selectValueChange_other(d) {
            /*if(arguments[3]){
                d = d3.event.target.parentNode.__data__;
            }*/
            if (!d) {
                d = d3.event.target.parentNode.__data__;
            }
            iD.UserJobHeartbeat.setJobStatus();

            var tag = {},
                _fieldTitle = '修改' + d.fieldTitle + ' :' + d.value;
            tag[d.fieldName] = this.options[this.selectedIndex].value;
            event.change(tag);
        }

        function otherValueChange(d) {
            var that = this,
                _value = d.value,
                _fieldTitle = '修改' + d.fieldTitle + ' :' + _value;

            var tag = {};
            tag[d.fieldName] = _value;
            event.change(tag);
            // iD.logger.editElement('propertyPanel', modelEntity._modelName, '', _fieldTitle);
        }

        function fileValueChange(d, input) {
            var files = input ? input.files : null;
            if (!files) {
                Dialog.alert('图像上传失败！');
                return;
            }

            var file = files[0];
            var fileName = file.name;
            var fileTypes = fileName.split('.');
            var fileType = fileTypes[1] || '';
            // var formData = new FormData();
            // formData.append("file", file);
            // formData.append("appCode", "fruit");
            var data = {
                'projectId': iD.Task.d.tags.projectId,
                'taskId': iD.Task.d.tags.taskId,
                'taskFrameId': iD.Task.d.tags.taskFrameId,
                'modelName': modelEntity._modelName,
                'fileType': fileType
            };

            uploadFiles(data, file, function(datas) {
                if (!datas || datas.code != '0') {
                    var message = datas ? ('图像上传失败：' + datas.message) : '图像上传失败：上传接口请求失败！';
                    Dialog.alert(message);
                    return;
                }
                var tag = {};
                tag[d.fieldName] = datas.result.fileId;
                event.change(tag);
            })
        }

        function uploadFiles(data, file, callback) {
            var s_data = JSON.stringify(data);
            var url = iD.config.URL.krs + 'image/upload/uploadFileStream?request=' + encodeURI(s_data);

            if (!!file) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function() {
                    var binary = this.result;
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url);
                    xhr.overrideMimeType("application/octet-stream");
                    //直接发送二进制数据
                    // if(xhr.sendAsBinary){
                    // 	xhr.sendAsBinary(binary);
                    // }else{
                    xhr.send(binary);
                    // }
                    xhr.onreadystatechange = function(e) {
                        if (xhr.readyState === 4 && xhr.status === 200) {

                            var response = xhr.response ? JSON.parse(xhr.response) : {};

                            callback && callback(response);
                        }
                    }
                }
            }
        }

        // 获取当前纹理url
        function loadImageSrc(url) {
            return new Promise((resolve, reject) => {
                d3.json(url)
                    .header("Content-Type", "application/json;charset=UTF-8")
                    .post({}, function(error, result) {
                        resolve(result);
                    });
            })
        }

        var previewDialog = null;
        var lastPreviewImg = null;
        async function fileValuePreview(d = null) {
            if (!d || !d.value) {
                previewDialog && previewDialog.close();
                return;
            }

            var previewImg = d.id + '_' + d.fieldName + '_' + d.value;
            var openType = true;
            if (!lastPreviewImg || lastPreviewImg != previewImg) {
                lastPreviewImg = previewImg;
                if (!previewDialog) {
                    previewDialog = iD.dialog(null, {
                        width: 600,
                        autoOpen: false,
                        closeBtn: false,
                        destroyOnClose: false,
                        title: '图像预览',
                        appendTo: '#id-container',
                        // position: {
                        // 	at: 'center top',
                        // 	my: 'center top'
                        // }
                    });

                    var imagePreviewPanel = previewDialog.element.append('div')
                        .attr('class', 'image-preview-panel');

                    imagePreviewPanel.append('img')
                        .attr({
                            src: '',
                            width: '100%',
                            height: '100%'
                        });
                }
                var loading = iD.ui.Loading(context).message("图像加载中,请稍后").blocking(false);
                context.container().call(loading);

                var imageUrl = '';
                var s_data = 'fileId=' + d.value;
                var url = iD.config.URL.krs + 'image/upload/findFiles?findType=1&request=' + encodeURI(s_data);
                var imageDatas = await loadImageSrc(url);

                loading && loading.close();

                if (!imageDatas || imageDatas.code != '0') {
                    openType = false;
                    var message = imageDatas ? ('图像加载失败：' + imageDatas.message) : '图像加载失败！';
                    Dialog.alert(message);
                } else if (imageDatas.result && imageDatas.result.length) {
                    openType = true;
                    var dataBytes = imageDatas.result[0].dataBytes,
                        imageType = imageDatas.result[0].fileType || '';

                    // var xhr = new XMLHttpRequest();
                    // xhr.responseType = 'arraybuffer';
                    // var blob = new Blob([dataBytes], { type: imageType });
                    // var imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);

                }
                imageUrl = "data:image/png;base64," + dataBytes;
                previewDialog.element.select('img').attr('src', imageUrl);

            }

            openType && previewDialog.open();
        }

        function drawWriteTags(wrapper) {
            var entity = context.entity(id);

            var $list = wrapper.selectAll('.tag-list')
                .data([0]);
            $list.enter().append('ul')
                .attr('class', 'tag-list clearfix');

            var $items = $list.selectAll('li')
                .data(_writeTags, function(d) {
                    return d.id;
                });

            _writeTags.forEach(function(w) {
                if (w.tags && w.tags.R_LINE == "1") {
                    isRLine = true;
                }
            });

            /*_writeTags.forEach(function(w){
            	if (w.fieldName== "TYPE") {
            		w.fieldType.fieldTypeValues.forEach(function(t) {
            			selectGroup[t.id] = [];
            		});
            	}
            	if (w.fieldName== "SUBTYPE") {
            		w.fieldType.fieldTypeValues.forEach(function(s) {
            			selectGroup[s.parentId].push({
            				"name": s.name,
            				"value": s.value            				
            			})
            		})
            	}
            })*/
            selectGroups(_writeTags);

            var $enter = $items.enter().append('li')
                .attr('class', function(d) {
                    let new_c = 'tag-row cf select-' + d.id;
                    return new_c;
                })
                .attr('data-fld', function(d) {
                    return d.fieldName;
                });

            $enter.append('div')
                .attr('class', 'key-wrap')
                .append('label')
                .attr('class', 'key KDSEditor-label');

            var $inputWrapPosition = $enter.append('div')
                .attr('class', 'input-wrap-position');
            //增加车道信息默认值定义--Tilden
            var defaultNewRelation = {
                vehicle: '0',
                type: '0',
                timeInfo: {
                    timeRange: [{
                        start: "00:00",
                        end: "24:00"
                    }],
                    weather: ''
                }

            };

            $inputWrapPosition.each(function(d) {
                var that = this;
                var domLi = this.parentNode;
                //针对select类型，输出下拉列表框
                if (d.fieldInput.type === 'select') {

                    var select = d3.select(that).append('select')
                        .attr('class', 'value');

                    var subarr = [];
                    var newParentId = null;
                    var parentType = (d.fieldInput.values.length && d.fieldInput.values[0].parentId) ? true : false;

                    /* select类型的选项存在parentId时执行 */
                    if (parentType) {
                        newParentId = 'empty';
                        var parentForm = d.fieldInput.values;
                        var parentId = d.fieldInput.values[0].parentId || null;
                        /* 获取parentId对应的父级数据 */
                        if (selectGroup[parentId]) {
                            /* 父级数据 */
                            var parentData = _writeTags.filter(function(e) {
                                return e.id == selectGroup[parentId].cid;
                            });
                            /* 获取父级value对应的选项数据 */
                            var newParentData = parentData.length && parentData[0].fieldInput.values.filter(function(e) {
                                return e.value == parentData[0].value;
                            });
                            /* 获取父级DOM节点是否存在当前VALUE选项;获取选项的ID */
                            // var newParentVal = newParentData.length ? newParentData[0].value : 'empty';
                            // var nodes = d3.selectAll('.select-' + selectGroup[parentId].cid + ' select option[value="' + newParentVal + '"]').node();

                            newParentId = newParentData.length ? newParentData[0].id : 'empty';

                        }
                    }

                    /* 根据父级的ID获取该select的待选项 */
                    d.fieldInput.values && d.fieldInput.values.filter(function(e) {
                        if (!newParentId || newParentId == e.parentId) {
                            subarr.push({
                                "name": e.name,
                                "id": e.id,
                                "value": e.value
                            });
                        }
                    });
                    var optionData = _.clone(subarr);

                    //插入空选项
//                  optionData.unshift({
//                      name: '==请选择==',
//                      value: '',
//                      values: []
//                  });

                    var options = select.selectAll('option')
                        .data(optionData)
                        .enter()
                        .append('option')
                        .attr('value', function(o) {
                            return o.value;
                        })
                        .attr('name', function(o) {
                            return o.id;
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
                            let selectvalue = this.value; //获取value

                            let falg = false;
                            let sublist;
                            o.fieldType.fieldTypeValues.filter(function(e) {
                                if (selectvalue == e.value) {
                                    sublist = _.clone(selectGroup[e.id]);
                                    parentId = e.id;
                                    if (!sublist) {
                                        sublist = [];
                                    }
                                    //插入空选项
//                                  sublist.unshift({
//                                      name: '==请选择==',
//                                      value: '',
//                                      values: []
//                                  });
                                }
                            })

                            //TODO 获取dom方式临时方式，Tilden
                            //VALUE方式是因为Road_Attribute命名不规范导致
                            var subtypeselect = $list.select("li[data-fld='SUBTYPE']")[0][0] ? $list.select("li[data-fld='SUBTYPE']") : $list.select("li[data-fld='VALUE']");
                            var $subselect = subtypeselect.select('select.value');
                            var subselect = $subselect.node();
                            var subValue = subselect.value;

                            var subtypeoptionData = _.clone(sublist);
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

                            // if(subValue != ''){
                            // 	var oldV = _.pluck(sublist, 'value').filter(function(v){
                            // 		return v.value == subValue;
                            // 	})[0];
                            // 	if(!oldV){
                            // 		subselect.value = '';
                            // 		$subselect.dispatch('change');
                            // 	}
                            // }
                            //	                        $items.select("li[data-fld='SUBTYPE'] select")
                            //	                        	.value("").dispatch("change", true);
                            /*let $subselect = subtypeselect.select('select');
                            $subselect.value("").dispatch("change", true);*/
                        });

                    var optionData = _.clone(d.fieldInput.values);

                    var selectvalue = d.value;
                    d.fieldInput.values.filter(function(e) {
                        if (selectvalue == e.value) {
                            parentId = e.id;
                        }
                    })

                    //                  if (d.fieldName == "TYPE") {
                    //                  	let value = d.value;
                    //                  	d.fieldInput.values.filter(function(a) {
                    //                  		if (a.value == value) {
                    //                  			return parentId = a.id;
                    //                  		}
                    //                  	})
                    //                  }

                    //                  if (d.fieldName == "SUBTYPE") {
                    //                  	if (parentId) {
                    //                  		var optionData = selectGroup[parentId]
                    //                  	} else {
                    //                  		var optionData = [];
                    //                  	}
                    //                   	/*if (entity.tags.SUBTYPE == "NULL") {
                    //                    		var optionData = [];
                    //                     }*/
                    //                  }
                    //初始化默认列表
//                  optionData.unshift({
//                      name: '==请选择==',
//                      value: '',
//                      values: []
//                  });

                    var options = select.selectAll('option')
                        .data(optionData)
                        .enter()
                        .append('option')
                        .attr('value', function(o) {
                            return o.value;
                        })
                        .attr('name', function(o) {
                            return o.id;
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
                } else if (_.include(["TIME", "VEHICLE", "WEATHER"], d.fieldName) && entity.modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION) {
                    var $domLi = d3.select(domLi);
                    $domLi.classed('higher', true);
                    var $label = $domLi.select('label.KDSEditor-label');
                    //车道信息定制--Tilden
                    if (d.fieldName == "TIME" && d.fieldInput == "text") {
                        $domLi.style("height", "auto");
                        $label.style('line-height', '91px');
                        let $iwp = d3.select(that);
                        // $iwp.parentNode.select("label.key");
                        var render = iD.ui.RoadRule.TimeRange({
                            limit: 5,
                            btns: true,
                            add: function($data) {
                                addTimeClick($data, render, d, currentLayer);
                            },
                            remove: function(_t) {
                                deleteTimeClick(render, d, _t);
                            },
                        })
                        render($iwp);
                        var timeRange = d.value && d.value != 0 ? iD.convertGDFToInfo(d.value).timeRange : defaultNewRelation.timeInfo.timeRange;
                        render.val(timeRange);
                        $iwp.selectAll(".hour")
                            .on('change', function() {
                                var timeObj = render.getVal();
                                var time = iD.convertInfoToGDF({
                                    timeRange: timeObj
                                });
                                d.value = time;
                                otherValueChange(d);
                            })
                            .property('disabled', function(d) {
                                return !currentLayer || !currentLayer.editable || d.readOnly == '1';
                            });
                        $iwp.selectAll(".minute")
                            .on('change', function() {
                                var timeObj = render.getVal();
                                var time = iD.convertInfoToGDF({
                                    timeRange: timeObj
                                });
                                d.value = time;
                                otherValueChange(d);
                            })
                            .property('disabled', function(d) {
                                return !currentLayer || !currentLayer.editable || d.readOnly == '1';
                            });
                    } else if (d.fieldName == "VEHICLE" && d.fieldInput == "text") {
                        $domLi.style("height", "auto");
                        $label.style('line-height', '450px');
                        var render = iD.ui.RoadRule.CarList({
                            currentLayer: currentLayer
                        });
                        let $iwp = d3.select(that)

                        render($iwp);
                        render.on("change", function() {
                            var carSelectedIds = render.getVal();
                            var vehicles = iD.util._Util._createHexadecimalBySelectedCars(carSelectedIds);
                            d.value = vehicles;
                            otherValueChange(d);
                        })
                        var vehicles = d.value || defaultNewRelation.vehicle;
                        render.val(vehicles.split(','));
                        //render.val(vehicles);
                    } else if (d.fieldName == "WEATHER" && d.fieldInput == "text") {
                        $domLi.style("height", "auto");
                        $label.style('line-height', '240px');
                        let $iwp = d3.select(that);

                        var render = iD.ui.RoadRule.Weather();
                        render($iwp);
                        render.on("change", function() {
                            // var weatherBits = {
                            //     "sunny": 0,
                            //     "rain": 0,
                            //     "ice": 0,
                            //     "fog": 0,
                            //     "wind": 0
                            // }

                            var weatherVals = render.getVal();
                            d.value = weatherVals;
                            if (weatherVals.indexOf('0') != -1) {
                                weatherVals = '0';
                                d.value = '0';
                            }

                            otherValueChange(d);
                            d.value == '0' ? render.val(weatherVals.split(',')) : false;

                        })
                        var weather = d.value || defaultNewRelation.timeInfo.weather;
                        // let _w = iD.util._Util._getWeatherNamesByCode(weather);
                        render.val(weather.split(','));

                        if (!currentLayer || !currentLayer.editable || d.readOnly == '1') {
                            render.disable(true);
                        }
                    } else {
                        $domLi.classed('higher', false);
                    }
                } else if (d.fieldInput == "checkbox") {

                    var _options = {
                        'id': d.fieldName,
                        'key': d.fieldName,
                        'fieldModel': {
                            'fieldInput': {
                                'values': d.fieldType.fieldTypeValues
                            }
                        }
                    }
                    let $iwp = d3.select(that);

                    var render = iD.ui.TagEditorInput.checkgroup(d);
                    render($iwp);
                    render.on("change", function(v) {
                        d.value = v;
                        otherValueChange(d);
                    })

                } else if (d.fieldInput == "imageinput") {

                    var file_image_border = d3.select(that).append('a')
                        .attr('class', 'file-image-border');

                    var file_image = file_image_border.append('a')
                        .attr('class', 'file-image glyphicon glyphicon-file-upload')
                        .attr('title', '图片上传');

                    file_image.append('input')
                        .property('type', 'file')
                        // .property('accept', 'image/png')
                        .attr('data-value', '')
                        .on('change', function() {
                            fileValueChange(d, this);
                        })

                    var file_preview = file_image_border.append('a')
                        .attr('class', 'file-preview glyphicon glyphicon-img-magnifier')
                        .attr('title', '图片预览')
                        .on('click', function() {
                            fileValuePreview(d);
                        })
                        .on('mouseout', function() {
                            fileValuePreview();
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
            /*
            .style("height", function(d) {
                if (d.fieldName == "TIME") {
                    return "91px";
                } else if (d.fieldName == "VEHICLE") {
                    return "270px";
                } else if (d.fieldName == "WEATHER") {
                    return "150px";
                }
                return "100%";
            });
			*/
            //附加事件，填充值，必须创建完元素后设置，创建元素时设置值不起作用
            $items.select('input.value')
                .value(function(d) {
                    return textFormat(d, d.value);
                })
                .property('title', function(d) {
                    return d.value;
                })
                .property('disabled', function(d) {
                    return !currentLayer || !currentLayer.editable || d.readOnly == '1' || isDateField(d);
                })
                .on('change', valueChange)
                .on('keyup', keyValueChange)
                .on('blur', valueChange)
                .each(function(d) {
                    updateFieldInputStatus(this, d, id);
                });

            //file文件是否可以上传的权限
            $items.select('input[type=file]')
                .attr('class', function(d) {
                    if (!currentLayer || !currentLayer.editable || d.readOnly == '1' || isDateField(d)) {
                        return 'noUploading';
                    }
                    return '';
                })
                // .each(function(d){
                // 	updateFieldInputStatus(this, d, id);
                // });


            var selectEvent = selectValueChange;
            if (entity.modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION || entity.modelName == iD.data.DataType.TRAFFIC_SEMANTIC) {
                selectEvent = selectValueChange_other;
            }
            $items.select('select.value')
                .on('change.selectvaluechange', selectEvent)
                .each(function(item) {
                    //获得所有options
                    d3.select(this).property('value', item.value);
                    d3.select(this).selectAll('option')
                        .each(function(option) {
                            //如果当前option.value == 当前tag.value则选中
                            d3.select(this).property('selected', option.value == item.value);
                            if (option.value == item.value) {
                                d3.select(this.parentElement).attr('title', option.name);
                            }
                        });
                })
                .property('disabled', function(d) {
                    return !currentLayer || !currentLayer.editable || d.readOnly == '1';
                })
                .each(function(d) {
                    updateFieldInputStatus(this, d, id);
                });


            $items.exit().remove();
            /* 
            if(entity && entity.modelName == iD.data.DataType.DIVIDER){
                clearAttribute(wrapper);
                let dividerInput = iD.ui.TagEditorInput.relations(context, iD.data.DataType.BARRIER);
                dividerInput.entity(entity);
                var $dividerRelation = wrapper.selectAll('.tag-divider-attribute')
                    .data([0]);
                        $dividerRelation.enter().append('div')
                        .attr('class', 'tag-divider-attribute');
                var $dividerTitle = $dividerRelation.selectAll('.tag-title')
                    .data([0]);
                $dividerTitle.enter().append('div')
                    .attr('class', 'tag-title');
                var $dividerContainer  = $dividerRelation.selectAll('.tag-container')
                    .data([0]);
                $dividerContainer.enter().append('div')
                    .attr('class', 'tag-container');
                $dividerContainer.call(dividerInput);
                dividerInput.on('delete', function(){
                    $dividerContainer.call(dividerInput);
                });
            }else 
             */
            if (entity && entity.modelName == iD.data.DataType.DIVIDER_NODE) {
                clearAttribute(wrapper);
                // var isLinear = iD.User.isLinearRole();
                // 20181101 线性编辑显示DA -@lixiaoguang
                //------------------------divider-attribute----------------------
                let dividerInput = iD.ui.TagEditorInput.relations(context, iD.data.DataType.DIVIDER_ATTRIBUTE);
                dividerInput.entity(entity);

                var $dividerRelation = wrapper.selectAll('.tag-divider-attribute')
                    .data([0]);
                $dividerRelation.enter().append('div')
                    .attr('class', 'tag-divider-attribute');
                var $dividerTitle = $dividerRelation.selectAll('.tag-title')
                    .data([0]);
                $dividerTitle.enter().append('div')
                    .attr('class', 'tag-title');
                var $dividerContainer = $dividerRelation.selectAll('.tag-container')
                    .data([0]);
                $dividerContainer.enter().append('div')
                    .attr('class', 'tag-container');
                $dividerContainer.call(dividerInput);
                dividerInput.on('delete', function() {
                    $dividerContainer.call(dividerInput);
                });

                // 线性编辑不显示DA/LA
                // if(!isLinear){
                let isRLine = false;
                // context.graph().parentWays(entity).forEach(function(w){
                // 	if(w.tags && w.tags.R_LINE == "1"){
                // 		isRLine = true;
                // 	}
                // });
                //------------------------lane-attribute-------------------------
                // DIVIDER是参考线时，不显示
                // if(!isRLine){
                let laneInput = iD.ui.TagEditorInput.relations(context, iD.data.DataType.LANE_ATTRIBUTE);
                laneInput.entity(entity);
                var $laneRelation = wrapper.selectAll('.tag-lane-attribute')
                    .data([0]);
                $laneRelation.enter().append('div')
                    .attr('class', 'tag-lane-attribute');
                var $laneTitle = $laneRelation.selectAll('.tag-title')
                    .data([0]);
                $laneTitle.enter().append('div')
                    .attr('class', 'tag-title');
                var $laneContainer = $laneRelation.selectAll('.tag-container')
                    .data([0]);
                $laneContainer.enter().append('div')
                    .attr('class', 'tag-container');
                $laneContainer.call(laneInput);
                laneInput.on('delete', function() {
                    $laneContainer.call(laneInput);
                });
                // }
                // }

                // $relation = wrapper.selectAll('.tag-relation')
                //     .data([0]);
                // $relation.enter().append('div')
                //     .attr('class', 'tag-relation');
                // $relation.call(input);

            } else if (entity && (entity.modelName == iD.data.DataType.ROAD_NODE ||
                    entity.modelName == iD.data.DataType.C_NODE)) {
                // 渲染左侧列表中的MAAT样式
                /*
                clearAttribute(wrapper);
                let maatInput = iD.ui.TagEditorInput.maat(context);
                maatInput.entity(entity);
                var $maatRelation = wrapper.selectAll('.tag-maat-attribute')
                    .data([0]);
                $maatRelation.enter().append('div')
                    .attr('class', 'tag-maat-attribute');
                var $maatTitle = $maatRelation.selectAll('.tag-title')
                    .data([0]);
                $maatTitle.enter().append('div')
                    .attr('class', 'tag-title');
                var $maatContainer  = $maatTitle.selectAll('.tag-container')
                    .data([0]);
                $maatContainer.enter().append('div')
                    .attr('class', 'tag-container');
                $maatContainer.call(maatInput);
				*/
            } else if (entity && (entity.modelName == iD.data.DataType.TRAFFICSIGN ||
                    entity.modelName == iD.data.DataType.OBJECT_PG)) {
				
                clearAttribute(wrapper);
				
				let laneInput = iD.ui.TagEditorInput.traffic_semantic(context, iD.data.DataType.TRAFFIC_SEMANTIC);
				laneInput.entity(entity);
				var $laneRelation = wrapper.selectAll('.tag-lane-attribute')
				    .data([0]);
				$laneRelation.enter().append('div')
				    .attr('class', 'tag-lane-attribute');
				var $laneTitle = $laneRelation.selectAll('.tag-title')
				    .data([0]);
				$laneTitle.enter().append('div')
				    .attr('class', 'tag-title');
				var $laneContainer = $laneRelation.selectAll('.tag-container')
				    .data([0]);
				$laneContainer.enter().append('div')
				    .attr('class', 'tag-container');
				$laneContainer.call(laneInput);
				laneInput.on('delete', function() {
				    $laneContainer.call(laneInput);
				});
				
			} else {
                clearAttribute(wrapper);
            }
            //          console.log(selectIds)
            //判断如果加载过，则不重复加载
            if (d3.select(".preset-form.form-input-field.checkselect").data([0]).empty()) {
                presetFooter(wrapper, entity);
            }

            var _index = _.indexOf(selectIds, entity.id);
            //          console.log("index:",_index);
            if (selectIds.length) {
                if (_index == -1) {
                    d3.select(".preset-form.form-input-field.checkselect").remove();
                }
            }

            /*if (entity.modelName == iD.data.DataType.QUESTION_TAG || entity.modelName == iD.data.DataType.ANALYSIS_TAG) {
                var opt = {
                    title: entity.id,
                    content: wrapper.html(),
                    width: parseInt(wrapper.style("width")),
                    height: parseInt(wrapper.style("height"))
                }
                iD.opendialog(null, opt);
            }*/
        };

        /* 新增时间区间DOM */
        function addTimeClick($data, render, d, currentLayer) {
            $data.selectAll(".hour")
                .on('change', function() {
                    var timeObj = render.getVal();
                    var time = iD.convertInfoToGDF({
                        timeRange: timeObj
                    });
                    d.value = time;
                    otherValueChange(d);
                })
                .property('disabled', function(d) {
                    return !currentLayer || !currentLayer.editable || d.readOnly == '1';
                });
            $data.selectAll(".minute")
                .on('change', function() {
                    var timeObj = render.getVal();
                    var time = iD.convertInfoToGDF({
                        timeRange: timeObj
                    });
                    d.value = time;
                    otherValueChange(d);
                })
                .property('disabled', function(d) {
                    return !currentLayer || !currentLayer.editable || d.readOnly == '1';
                });

            var timeObj = render.getVal();
            var time = iD.convertInfoToGDF({
                timeRange: timeObj
            });
            if (d.value !== time) {
                d.value = time;
                otherValueChange(d);
            }

        }

        /* 删除时间区间DOM */
        function deleteTimeClick(render, d, _t) {
            var timeObj = render.getVal();
            var time = iD.convertInfoToGDF({
                timeRange: timeObj
            });
            d.value = time;
            otherValueChange(d);
        }

        function clearAttribute(wrapper) {
            wrapper.selectAll('.tag-divider-attribute').remove();
            wrapper.selectAll('.tag-lane-attribute').remove();
            wrapper.selectAll('.tag-maat-attribute').remove();
        }

        // function drawReadOnlyTags(wrapper) {
        //     wrapper.selectAll('.readonly-title')
        //         .data([0])
        //         .enter()
        //         .append('h2')
        //         .attr('class', 'readonly-title')
        //         .text(t('inspector.readonly_title'));
        //
        //     var $readOnlyList = wrapper.selectAll('.tag-list-readonly')
        //         .data([0]);
        //
        //     $readOnlyList.enter().append('ul')
        //         .attr('class', 'tag-list-readonly');
        //
        //     var $readOnlyItems = $readOnlyList.selectAll('li')
        //         .data(_readonlyTags, function(d) {
        //             return d.fieldName;
        //         }),
        //
        //         $readOnlyEnter = $readOnlyItems.enter().append('li')
        //         .attr('class', 'tag-row cf');
        //
        //     $readOnlyEnter.append('div')
        //         .attr('class', 'key-wrap')
        //         .append('label')
        //         .attr('class', 'key KDSEditor-label');
        //
        //     $readOnlyEnter.append('div')
        //         .attr('class', 'input-wrap-position')
        //         .append('label')
        //         .attr('class', 'value KDSEditor-label');
        //
        //
        //     $readOnlyItems.select('label.key')
        //         .html(function(d) {
        //             return iD.util.substring(d.title, intercept);
        //         })
        //         .attr('title', function(d) {
        //             return d.title;
        //         });
        //     $readOnlyItems.select('label.value')
        //         .html(function(d) {
        //             return d.value;
        //         })
        //         .attr('title', function(d) {
        //             return d.value;
        //         });
        //
        //
        //     $readOnlyItems.order().exit().remove();
        // };
    }

    function textFormat(d, text) {
        if (isDateField(d) && !isNaN(text)) {
            return iD.util.dateFormat(new Date(Number(text)), 'yyyy-MM-dd hh:mm');
        }
        return text;
    }

    function isDateField(d) {
        return ['CREATETIME'].includes(d.fieldName);
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