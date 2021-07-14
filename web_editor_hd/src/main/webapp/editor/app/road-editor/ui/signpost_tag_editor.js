/**
 * 批量路牌属性编辑
 * @param {Object} context
 */
iD.ui.SignpostTagEditor = function(context) {

    var entityEditor = iD.ui.EntityEditor(context), 
    selectGroup, saveSignPostDatas = {}, 
    editTag = {},
    isevent = true,
    keybinding,
    isSaveEnd = false, 
    checkTags = [],
    selectSignDom = null;

    function signpost(){
        var that = this;
        keybinding = d3.keybinding('signpost_tag_editor')
            .on('Q', function() { that.$prevClass && that.$prevClass.node().click(); })
            .on('E', function() { that.$nextClass && that.$nextClass.node().click(); });
        that.$prevClass = null;
        that.$nextClass = null;
        context.history().on('change.signpostTagEditor', function (difference) {
            if (difference) {
                var changes = difference.changes();
                var flag = false;
                var traffic_sign;
                for (let i in changes) {
                    var entity = changes[i];
                    if (entity.base && !entity.head && entity.base.modelName == iD.data.DataType.TRAFFICSIGN) {//删除
                        var id = entity.base.id.split('_');
                        let index = _.findIndex(that.addFeatures, {'id': Number(_.last(id))});
                        if (index != -1) {//如果存在新增数组中，清除该条记录
                            that.addFeatures.splice(index, 1);
                        } else {
                            that.removeFeatures.push(parseInt(_.last(id)));
                            that.removeFeatures = _.intersection(that.removeFeatures);
                        }
                        //如果存在traffciSignClass中也要删除
                        for (let i in that.traffciSignClass) {
                            let ts = that.traffciSignClass[i];
                            let index = _.findIndex(ts, {'signId': entity.base.id});
                            if (index != -1) {//如果存在新增数组中，清除该条记录
                                ts.splice(index, 1);
                                if (ts.length == 1) {
                                    delete that.traffciSignClass[i];
                                }
                            }
                        }
                    } else if (entity.base && !entity.head && entity.base.modelName == iD.data.DataType.QUALITY_TAG) {//删除标记
                        let index = _.findIndex(checkTags, {'id': entity.base.id});
                        if (index != -1) {//如果存在新增数组中，清除该条记录
                            checkTags.splice(index, 1);
                        }
                    } else if (entity.base && entity.base.modelName == iD.data.DataType.TRAFFICSIGN_NODE) {//修改
                        var node = entity.base;
                        if (!traffic_sign) {
                            traffic_sign = context.graph().parentWays(node)[0];
                            if (traffic_sign && traffic_sign.modelName == iD.data.DataType.TRAFFICSIGN) {
                                var saveTS = context.variable.saveTrafficsignSrc[traffic_sign.osmId()];
                                let index = _.findIndex(that.modifiedFeatures, {'id': parseInt(traffic_sign.osmId())});
                                if (index != -1) {//如果存在新增数组中，清除该条记录
                                    that.modifiedFeatures[index].src = saveTS && saveTS.src;
                                    that.modifiedFeatures[index].pixels = saveTS && saveTS.pixels;
                                } else {
                                    that.modifiedFeatures.push({
                                        id: parseInt(traffic_sign.osmId()),
                                        trackId: iD.picUtil.player.wayInfo.trackId,
                                        trackPointId: iD.picUtil.player.getCurrentPic_node(),
                                        src: saveTS && saveTS.src,
                                        pixels: saveTS && saveTS.pixels
                                    });
                                }
                            }
                        }
                    }
                    if (entity.head && entity.head.modelName == iD.data.DataType.TRAFFICSIGN) {//新增
                        var id = entity.head.id.split('_');
                        let index = _.indexOf(that.removeFeatures, parseInt(_.last(id)));
                        if (index != -1) {//如果存在删除数组中，清除该条记录
                            that.removeFeatures.splice(index, 1);
                        } else {
                            let index = _.indexOf(that.addFeatures, parseInt(_.last(id)));
                            if (index != -1) {//如果存在新增数组中，清除该条记录
                                that.addFeatures.splice(index, 1);
                            } else {
                                id = Number(_.last(id));
                                let index = _.findIndex(that.messageTrafficSigns, {'signId': id});
                                if (index == -1) {
                                    let saveTS = context.variable.saveTrafficsignSrc[id];
                                    that.addFeatures.push({
                                        id: parseInt(id),
                                        trackId: iD.picUtil.player.wayInfo.trackId,
                                        trackPointId: iD.picUtil.player.getCurrentPic_node(),
                                        src: saveTS && saveTS.src,
                                        pixels: saveTS && saveTS.pixels
                                    });
                                }
                            }
                        }
                        flag = true;
                    }
                }
                if (flag && context.variable.signpostTagEditor.signpostDialog) {
                    var $signPost = d3.select('.signpost-table');
                    if ($signPost.node()) {
                        $signPost.html('');
                        that.createContent(that.traffciSignClass, $signPost, that.fields);
                    }
                }
            }
        });
        //TODO 图片加载完成后，临时完成事件
        iD.Task.on('finish.signpostTagEditor', function() {
            that.addFeatures.forEach(function(f){
                updateFeatures(f);
            });

            that.modifiedFeatures.forEach(function(f){
                updateFeatures(f);
            });
        })

        context.event.on("saveend.signpostTagEditor", function(data) {
            if (data && data.code == '0') {
                context.connection().on('loaded.signpostTagEditor',d=>{
                    let result = data.result;
                    let nodes = result.nodeDiffs;
                    let ways = result.wayDiffs;
                    that.synchroPB(nodes, ways, that);
                })
            }
        });

        /*context.event.on('taskChage.signpostTagEditor', function(data, callback) {
            if (isSaveEnd) {
                Dialog.alert('新增路牌还未同步, 请点击Signpost同步到服务器！');
                return;
            }
            messageTrafficSigns = [];
            traffciSignClass = {};
            fields = {};
            pbRoot = null;
            that.signpostDialog && that.signpostDialog.close();
            that.signpostDialog = null;
            callback && callback();
        });*/

        function updateFeatures(feature) {
            let type = 'w';
            var lay = that.getLayerByName(iD.data.DataType.TRAFFICSIGN)
            if(!lay){
                return ;
            }
            var sim = iD.Entity.id.delimiter || "_";
            var entity = context.hasEntity(type + lay.identifier + sim + feature.id) || context.hasEntity(type + sim + feature.id);
            if (entity) {
                let saveTS = context.variable.saveTrafficsignSrc[feature.id];
                feature.src = saveTS && saveTS.src;
                feature.pixels = saveTS && saveTS.pixels;
            }
        }

    }

    _.assign(signpost.prototype, {
        currentNum: 0,
        pageSize: 8,
        pageCont: 0,
        pages: [],
        parentId: false,
        removeFeatures: [],//删除路牌过滤数组 '60000002'
        addFeatures: [],//新增路牌过滤数组
        modifiedFeatures: [],//修改路牌过滤数组
        messageTrafficSigns: [],//记录pb返回数据
        dialog: null,
        isWorker: true,
        getFieldOptions_ATTRIBUTE: function(type){
            let model = iD.ModelEntitys[iD.data.DataType.TRAFFICSIGN];
            let ATTRIBUTE_filter = [
                'OPERATOR',
                'SOURCE',
                'SDATE',
                'FLAG',
                'TASKID',
                'BATCH',
                'SEQ'
            ];
            // 类型“属性错误”、“属性缺失”、“规格错误”时显示
            // if (this.isWorker) {
            //     if(type && !['1', '6', '8'].includes(type+'')){
            //         return [];
            //     }
            // } else {
                if(type && !['3', '4', '7'].includes(type+'')){
                    return [];
                }
            // }
            return model && model.getFields(model.getGeoType()).filter(function(d){
                return !ATTRIBUTE_filter.includes(d.fieldName);
            }).map(function(d){
                return {
                    name: d.fieldTitle || d.fieldName,
                    value: d.fieldName
                };
            }) || [];
        },
        createSelectInput: function(attribute, $selectDiv, isCheck) {
            let that = this;
            
            if (attribute.type === 'select') {
    
                var select = $selectDiv.append('select')
                    .attr('class', 'value');
                
                var subarr = [];
                
                if (attribute.fieldName == 'ATTRIBUTE' || (attribute.checkState != '' && attribute.fieldName == 'STATE')) {
                    attribute.values && attribute.values.filter(function(e){
                        subarr.push({
                            "name": e.name,
                            "value": e.value  
                        });
                    });
                } else {
                    attribute.values && attribute.values.filter(function(e){
                        if (!that.parentId || that.parentId == e.parentId) {
                            subarr.push({
                                "name": e.name,
                                "value": e.value  
                            });
                            that.parentId = e.parentId;
                        }
                    });
                }
                if (subarr.length > 0) {
                    var optionData = _.clone(subarr);
                } else {
                    if (attribute.fieldName == 'SUBTYPE' || attribute.fieldName == "ATTRIBUTE") {
                        var optionData = [];
                    } else {
                        var optionData = _.clone(attribute.values);
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
    
                // select.data([attribute])
                var v = attribute.SHAPE;
                if (attribute.fieldName == 'SUBTYPE') {
                    v = attribute.SUBTYPE || attribute.value;
                } else if (attribute.fieldName == 'ATTRIBUTE') {
                    v = attribute.checkAttrbute;
                } else if (attribute.fieldName == 'STATE') {
                    v = attribute.checkState;
                }
                select.data([
                    {
                        fieldTitle: _.clone(attribute.fieldTitle),
                        values: _.clone(attribute.values),
                        type: _.clone(attribute.type),
                        fieldName: _.clone(attribute.fieldName),
                        value: _.clone(v),
                        entityId: _.clone(attribute.entityId),
                        disabled: attribute.disabled
                    }
                ])
    
            } else if (attribute.type === 'selectgroup') {
                //级联菜单走这里
                var select = $selectDiv.append('select')
                    .attr('class', 'value')
                    .on('change.selectgroup', function(o) {
                        if (!o) {
                            return;
                        }
                        let selectvalue = this.value;//获取value
                        
                        let sublist;
                        
                        if (!that.isWorker) {
                            sublist = that.getFieldOptions_ATTRIBUTE(selectvalue);
                            //插入空选项
//                          sublist.unshift({
//                              name: '==请选择==',
//                              value: '',
//                              values: []
//                          });
                        } else {
                            o.values.filter(function(e){
                                if (selectvalue == e.value) {
                                    sublist = _.clone(selectGroup[e.id]);
                                    that.parentId = e.id;
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
                        }

                        if (!sublist) {
                           	sublist = [];
//                          sublist =[{
//                              name: '==请选择==',
//                              value: '',
//                              values: []
//                          }];
                        }
                        
                        let $parentElement = d3.select(this.parentElement.parentElement.parentElement);
                        
                        if (that.isWorker) {
                            var subtypeselect = $parentElement.select("li[data-fld='SUBTYPE']");
                        } else {
                            var subtypeselect = $parentElement.select("li[data-fld='ATTRIBUTE']");
                        }

                        var $subselect = subtypeselect.select('select.value'),
	                    subselect = $subselect.node(),
	                    // subValue = subselect.value;
                        
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

                        // if(subValue != ''){
	                    //    	var oldV = _.pluck(sublist, 'value').filter(function(v){
	                    //    		return v.value == subValue;
	                    //    	})[0];
	                    //    	if(!oldV){
	                    //    		subselect.value = '';
	                    //    		$subselect.dispatch('change');
	                    //    	}
                        // }
                        this.blur();
                    });
                    
                var optionData = _.clone(attribute.values);
                
                if (that.isWorker && !isCheck) {
                    var selectvalue = attribute.TYPE;
                    var v = attribute.TYPE;
                } else {
                    var selectvalue = attribute.checkErrorType;
                    var v = attribute.checkErrorType;
                }
                attribute.values.filter(function(e){
                    if (selectvalue == e.value) {
                        that.parentId = e.id;
                    }
                })
    
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
    
                // select.data([attribute])
                select.data([
                    {
                        fieldTitle: _.clone(attribute.fieldTitle),
                        values: _.clone(attribute.values),
                        type: _.clone(attribute.type),
                        fieldName: _.clone(attribute.fieldName),
                        value: _.clone(v),
                        entityId: _.clone(attribute.entityId),
                        disabled: attribute.disabled
                    }
                ])
            } else if (attribute.type === 'textarea' ){
                var txt = attribute.CONT;
                if(!that.isWorker || isCheck) {
                    txt = attribute.checkDESC;
                }
                var input = $selectDiv.append('textarea')
                    .property({
                        rows: '8',
                        cols: '26'
                    })
                    .html(txt);

                input.data([
                    {
                        fieldTitle: _.clone(attribute.fieldTitle),
                        values: _.clone(attribute.values),
                        type: _.clone(attribute.type),
                        fieldName: _.clone(attribute.fieldName),
                        value: _.clone(txt),
                        entityId: _.clone(attribute.entityId),
                        disabled: attribute.disabled
                    }
                ])
            } else {
                
                var input = $selectDiv.append('input')
                        .property('type', 'text')
                        .attr('class', 'value KDSEditor-input')
                        .attr('maxlength', function(item) {
                            return parseInt(80, 10);
                        });

                input.data([
                    {
                        fieldTitle: _.clone(attribute.fieldTitle),
                        values: _.clone(attribute.values),
                        type: _.clone(attribute.type),
                        fieldName: _.clone(attribute.fieldName),
                        value: _.clone(attribute.value),
                        entityId: _.clone(attribute.entityId),
                        disabled: attribute.disabled
                        }
                    ])
            }
        },
        
        getLayerByName: function(name){
            var result;
            var layers = iD.Layers.getLayers();
            for(let lay of layers){
                if(iD.util.getModelNameByItem(lay.models || [], name)){
                    result = lay;
                    break;
                }
            }
            return result;
        },
    
        createSignDom: function(trafficSigns, signpostDialog, p) {
            var that = this;
            
            d3.select(document)
                .call(keybinding);
           
            that.messageTrafficSigns = trafficSigns;
            that.pbRoot = p;
            if (isevent) {
                checkTags = [];
                let entities= context.graph().entities;
                for (let i in entities){
                    let entity = entities[i];
                    if (entity && entity.modelName == iD.data.DataType.QUALITY_TAG) {
                        checkTags.push(entity);
                    }
                }
                isevent = false;
            }

            if (iD.User.isCheckRole() || iD.User.isVerifyRole()) {
                this.isWorker = false;
            }
            that.signpostDialog = signpostDialog;
            var $signPost = d3.select('.signpost-table');
            if (!$signPost.node()) {
                $signPost = signpostDialog.element.append('div')
                    .attr('class', 'signpost-table')
                    .attr('id', 'signpost')
                    .style({
                        height: (signpostDialog.options.height - 88)+'px',
                        width: '100%',
                        overflow: 'auto'
                    });
            }
            that.currentNum = 0;
            that.pageCont = 0;
    
            $signPost.html('');
            that.fields = {};
            if (that.isWorker) {
                let modelEntity = iD.ModelEntitys[iD.data.DataType.TRAFFICSIGN];
                let geoType = modelEntity.getGeoType();
                that.fields = modelEntity.getFields(geoType);
            } else {
                let modelEntity = iD.ModelEntitys[iD.data.DataType.QUALITY_TAG];
                let geoType = modelEntity.getGeoType();
                that.fields = modelEntity.getFields(geoType);
            }

            that.traffciSignClass = {};
            trafficSigns.forEach(ts => {
                var src = ts.signSrc;
                var trackId = ts.trackId;
                var trackPointId = ts.trackPointId;
                let type = 'w';
                var lay = that.getLayerByName(iD.data.DataType.TRAFFICSIGN)
                if(!lay){
                    return ;
                }
                var sim = iD.Entity.id.delimiter || "_";
                var entity = context.hasEntity(type + lay.identifier + sim + ts.signId) || context.hasEntity(type + sim + ts.signId);
                // var entity = context.hasEntity(signId);
                if (entity) {
                    let signId = entity.id;
                    let type = entity.tags.TYPE || -1;
                    let subtype = entity.tags.SUBTYPE || -1;
                    let shape = entity.tags.SHAPE || -1;
                    let id = [type, subtype, shape].join('_');
                    if (that.traffciSignClass[id]) {
                        that.traffciSignClass[id].push({
                            src,
                            trackId,
                            trackPointId,
                            signId,
                            entity,
                            pixels: ts.pixels
                        })
                    } else {
                        that.traffciSignClass[id] = [];
                        let pngsrc = [type, subtype].join('_');
                        if ([type, subtype].includes(-1) || subtype == '0') {
                            pngsrc = '-1';
                        }
                        if (type == '3') {
                            pngsrc = '3'
                        } else if (type == '4'){
                            pngsrc = '4';
                        } else if (type == '5') {
                            pngsrc = '5';
                        } else if (type == '99') {
                            pngsrc = '99';
                        }
                        if (['2_1043', '2_1044', '2_1045', '1_0', '2_0'].includes(pngsrc)) {
                            pngsrc = '-1';
                        }
                        var img = 'dist/img/trafficsigns/' + pngsrc + '.png';
                        
                        // img = 'dist/img/trafficsigns/-1.png';
                        that.traffciSignClass[id].push({
                            src: img
                        })
                        that.traffciSignClass[id].push({
                            src,
                            trackId,
                            trackPointId,
                            signId,
                            entity,
                            pixels: ts.pixels
                        })
                        that.pageCont += 1;
                    }
                }
            })

            // trafficSigns = Object.values(traffciSignClass);

            this.selectGroups(that.fields);
    
            this.createContent(that.traffciSignClass, $signPost, that.fields);

            //分页dom
            let $pageDom = d3.select('.signpost_pagedom');

            if (!$pageDom.node()) {
                $pageDom = signpostDialog.element.append('div')
                    .attr('class', 'signpost_pagedom');
            }
            $pageDom.html('');
            let $paging = $pageDom.append('div')
                .attr('class', 'paging');
            that.$prevClass = $paging.append('button')
                .attr({
                    'type': 'button',
                    id: 'prevPage',
                    'class': 'disabled'
                })
                .style({
                    'float': 'left'
                })
                .text('<< 上一类')
                .on('click', function(){
                    var $this = $(this);
                    if($this.hasClass('disabled')) return;
                    
                    that.currentNum--;
                    if (that.currentNum == 0) {
                        $this.addClass('disabled');
                    } else {
                        $this.removeClass('disabled');
                    }
                    $('#nextPage').removeClass('disabled');
                    $signPost.html('');
                    that.createContent(that.traffciSignClass, $signPost, that.fields);
                    d3.select(this.parentNode).select('.pageNum').text((that.currentNum+1) + '/' + that.pageCont);
                });
                    
            $paging.append('span')
                .attr('class', 'pageNum')
                .html('1/'+Object.values(that.traffciSignClass).length);
            
            var classNext = '';
            if (Object.values(that.traffciSignClass).length < 2) {
                classNext = 'disabled';
            }
            that.$nextClass = $paging.append('button')
                .attr({
                    'type': 'button',
                    id: 'nextPage',
                    'class': classNext
                })
                .style({
                    'float': 'right'
                })
                .text('下一类 >>')
                .on('click', function(){
                    var $this = $(this);
                    if($this.hasClass('disabled')) return;

                    that.currentNum++;

                   if (that.currentNum == that.pageCont - 1) {
                        $this.addClass('disabled');
                    } else {
                        $this.removeClass('disabled');
                    }
                    $('#prevPage').removeClass('disabled');
                    $signPost.html('');
                    that.createContent(that.traffciSignClass, $signPost, that.fields);
                    d3.select(this.parentNode).select('.pageNum').text((that.currentNum+1) + '/' + that.pageCont);
                });

            let $oper = $pageDom.append('div')
                .attr('class', 'oper');

            $oper.append('button')
                .attr({
                    'type': 'button',
                    id: 'signpost_refresh'
                })
                .style({
                    'float': 'left'
                })
                .text('刷新')
                .on('click', function(){
                   that.refresh();
                });

            $oper.append('button')
                .attr({
                    'type': 'button',
                    id: 'signpost_localtion'
                })
                .style({
                    'float': 'right'
                })
                .text('定位')
                .on('click', function(){
                    if (selectSignDom) {
                        let eid = selectSignDom.attr('data-flg');
                        let selfData = saveSignPostDatas[eid.split('&')[0]];
                        let tid = selfData.trackId;
                        let entityId = selfData.signId;
                        let track = iD.svg.Pic.dataMgr.getTrack(tid);
                        if(!track) {
                            Dialog.alert('无法定位路牌，轨迹点ID:'+tid+'不存在');
                            return;
                        }
                        let frameIndex = _.findIndex(track.nodes, {id:selfData.trackPointId});
                        context.map().lightEntity([entityId]);
                        iD.picUtil.player.switchPlayerTrackId(tid, function(){
                            let progressRange = d3.select('.footer-progress-range');
                            progressRange.value(parseInt(frameIndex)).trigger('change');
                        })
                    }
                });
        },

        showAttribute: function(ids, attributes, isCheck = false){
            var that = this;
            var entityId = ids.split('&')[0];
            var checkId = ids.split('&')[1];
            if (!entityId && !checkId) return;

            if (this.dialog) {
                var $signPostAttr = d3.select('.signpost-attribute');
                this.dialog.widget().style('display', 'block');
            } else {
                this.dialog = iD.dialog(null, {
                    width: 420,
                    height: 390,
                    // appendTo: '#id-container',
                    autoOpen: false,
                    resizable: true,
                    closeBtn: true,
                    onTask: true,
                    destroyOnClose: false,
                    beforeClose: function(){
                        editTag = {};
                        d3.select(window).on('keyup.signpost_tag_editor', null);
                    }
                });
                this.dialog.widget().select('.ui-dialog-titlebar-close.iconfont.icon-close')
                    .on('click', function(){
                        if (selectSignDom) {
                            selectSignDom.attr('class', '');
                            selectSignDom = null;
                        }
                    });

                var $signPostAttr = this.dialog.element.append('div')
                    .attr('class', 'signpost-attribute');
            }
            d3.select(window).on('keyup.signpost_tag_editor', function(){
                if (d3.event.keyCode == 13) {
                    that.submit();
                }
            });
            $signPostAttr.html('');

            var entity = context.hasEntity(entityId);
            var checkTag = context.graph().entities[checkId];
            let currentLayer = context.layers().getLayer(entity.layerId, entity.modelName);
            console.log('当前选择要素:', entity)
            
            var $ul = $signPostAttr.append('ul')
                .attr('class', 'tag-list clearfix');

            // if(that.isWorker) {
            //     $ul.style('padding-bottom', '22px');
            // }

            attributes.forEach(a => {
                a.TYPE = entity.tags.TYPE;
                a.SUBTYPE = entity.tags.SUBTYPE;
                a.SHAPE = entity.tags.SHAPE;
                a.CONT = entity.tags.CONT;
                a.entityId = entity.id;
                a.checkType = '';
                a.checkDESC = '';
                a.checkState = '';
                a.checkId = '';
                a.checkAttrbute = '';
                a.checkErrorType = '';
                if (checkTag) {
                    a.checkErrorType = checkTag.tags.ERROR_TYPE;
                    a.checkDESC = checkTag.tags.DESC;
                    a.checkState = checkTag.tags.STATE;
                    a.checkAttrbute = checkTag.tags.ATTRIBUTE;
                    a.checkId = checkTag.id;
                    if (isCheck) {
                        a.entityId = checkTag.id;
                    }
                    if (a.fieldName == 'ATTRIBUTE') {
                        a.values = that.getFieldOptions_ATTRIBUTE(checkTag.tags.ERROR_TYPE);
                    }
                    a.value = checkTag.tags.ATTRIBUTE;
                } else {
                    a.value = '';
                }
                // var fieldName = a.fieldName;
                var height = '50px';
                if (a.fieldName == 'CONT' || a.fieldName == 'DESC') {
                    height = '164px';
                }
                // if (!that.isWorker) {
                //     if (a.fieldName == "SUBTYPE") {
                //         fieldName = '错误属性';
                //     } else if (a.fieldName == 'CONT') {
                //         fieldName = '描述';
                //     } else if (a.fieldName == 'SHAPE') {
                //         return;
                //     }
                // }
                let $li = $ul.append('li')
                    .attr({
                        class: 'tagrow',
                        'data-fld': a.fieldName
                    });
                let $div = $li.append('div')
                    .attr('class', 'key-wrap');
                let $label = $div.append('label')
                    .attr({
                        'class': 'KDSEditor-label',
                        title: a.fieldTitle
                    })
                    .text(a.fieldTitle);
                
                let $selectDiv = $li.append('div')
                    .attr('class', 'input-wrap-position')
                    .style('height', height);
    
                this.createSelectInput(a, $selectDiv, isCheck);

                $signPostAttr.selectAll('select.value')
                    .on('change.selectvaluechange', this.selectValueChange)
                    .each(function() {
                        //获得所有options
                        var item = d3.select(this).data()[0];
                        d3.select(this).selectAll('option')
                            .each(function(option) {
                                // debugger
                            //如果当前option.value == 当前tag.value则选中
                                d3.select(this).property('selected', option.value == item.value);
                                if (option.value == item.value) {
                                    d3.select(this.parentElement).attr('title', option.name);
                                }
                            });
                    })
                    .property('disabled', function(d) {
                        return d.disabled;
                    });
                
                $signPostAttr.selectAll('input')
                    .on('change', this.valueChange)
                    .on('keyup', this.keyValueChange)
                    .on('blur', this.valueChange)
                    .property('disabled', function(d) {
                        return d.disabled;
                    });

                $signPostAttr.selectAll('textarea')
                    .on('change', this.valueChange)
                    .on('keyup', this.keyValueChange)
                    .on('blur', this.valueChange)
                    .property('disabled', function(d) {
                        return d.disabled;
                    });
            })

            /*if (!that.isWorker) {
                let $li = $ul.append('li')
                    .attr({
                        class: 'tagrow',
                        'data-fld': 'STATE'
                    });
                let $div = $li.append('div')
                    .attr('class', 'key-wrap');
                let $label = $div.append('label')
                    .attr({
                        'class': 'KDSEditor-label',
                        title: '状态'
                    })
                    .text('状态');
                
                let $stateDom = $li.append('div')
                    .attr('class', 'input-wrap-position');

                
                let $error = $stateDom.append('div')//未修改
                    .attr('class', 'check')
                    .style({
                        color: '#83C3FF',
                        border: '1px solid #83C3FF',
                        'border-radius': '5px 0px 0px 5px'
                    })
                    .html('未修改')
                    .on('click', function(){

                    });
                let $check = $stateDom.append('div')//已修改
                    .attr('class', 'check')
                    .html('已修改')
                    .on('click', function(){
                        
                    });
                let $cross = $stateDom.append('div')//搁置
                    .attr('class', 'check')
                    .style({
                        'border-radius': '0px 5px 5px 0px'
                    })
                    .html('搁置')
                    .on('click', function(){
                        
                    });
            }*/

            let $oper = $signPostAttr.append('div')
                .attr('class', 'oper');                

            let $submit = $oper.append('button')
                .on('click', function(){
                    that.submit();
                })
                .html('确定');
            
            if (that.isWorker && !isCheck) {
                let $remove = $oper.append('button')
                    .style({
                        float: 'right',
                        'background-color': '#ff0000'
                    })
                    .attr('data-flg', entity.id)
                    .on('click', function(){
                        let $this = d3.select(this);
                        let entityId = $this.attr('data-flg');
                        // let entity = context.hasEntity(entityId);
                        if (entityId) {
                            let selectedIDs = [entityId];
                            var action = iD.actions.DeleteMultiple(selectedIDs, context),
                            geometry = context.geometry(entityId)
                            annotation = t('operations.delete.annotation.' + geometry);
                            context.event['before_delete'] && context.event['before_delete']({selectedIDs});
                            context.perform(
                                action,
                                annotation);
                            context.event['delete'] && context.event['delete']({selectedIDs});
                        }
                        that.dialog.close();
                        if (selectSignDom) {
                            selectSignDom.attr('class', '');
                            selectSignDom = null;
                        }
                    })
                    .html('删除');
            } else {
                $oper.style('left', '40%');
            }


            this.dialog.open();
        },

        submit: function() {
            var that = this,
                entityId = editTag.entityId;

            if (selectSignDom) {
                selectSignDom.attr('class', '');
                selectSignDom = null;
            }
            let entity = context.hasEntity(entityId);
            if (!entity) {
                that.dialog.close();
            }

            let tags = {};
            for (let i in editTag) {
                if (i != 'entityId') {
                    tags[i] = editTag[i];
                }
            }
            if (that.isWorker) {
                if(entityId) {
                    if (entity) {
                        context.map().lightEntity([entityId]);
                        entityEditor.entityID(entityId).changeTags(tags);
                    } else {
                        Dialog.alert("该要素不存在！");
                    }
                }
            } else {
                d3.select('#'+entityId+'_check').style('display', 'block');
                var $parentElement = d3.select(d3.select('#'+entityId+'_check').node().parentElement);
                var dataFlg = $parentElement.attr('data-flg');
                if (dataFlg.split('&')[1]) {
                    var checkId = dataFlg.split('&')[1];
                    entityEditor.entityID(checkId).changeTags(tags);
                } else {
                    let locs = _.pluck(context.graph().childNodes(entity), 'loc');
                    let z = (locs[0][2] + locs[2][2]) / 2;
                    let loc = iD.util.getLocsCenter(locs);
                    loc[2] = z;
                    let checkTag = that.addCheckTag(loc, entityId);
                    $parentElement.attr('data-flg', entityId+'&'+checkTag.id);
                }
            }
            that.dialog.close();
        },
        
        createContent: function(traffciSignClass, $signPost, fields){

            var trafficSigns = [], that = this;
            
            if (that.addFeatures.length) {
                that.addFeatures.forEach(function(f){
                    // let entityId = 'wsign-' + iD.Task.d.task_id + '-1_' + f.id;
                    // let entity = context.hasEntity(entityId);
                    let type = 'w';
                    var lay = that.getLayerByName(iD.data.DataType.TRAFFICSIGN)
                    if(!lay){
                        return ;
                    }
                    var sim = iD.Entity.id.delimiter || "_";
                    var entity = context.hasEntity(type + lay.identifier + sim + f.id) || context.hasEntity(type + sim + f.id);
                    if (entity) {
                        let entityId = entity.id;
                        let type = entity.tags.TYPE || -1;
                        let subtype = entity.tags.SUBTYPE || -1;
                        let shape = entity.tags.SHAPE || -1;
                        let id = [type, subtype, shape].join('_');
                        if (traffciSignClass[id]) {
                            var saveTS = context.variable.saveTrafficsignSrc[f.oldId || entity.osmId()];
                            var index = _.findIndex(traffciSignClass[id], {signId: entityId});
                            if (index == -1) {
                                traffciSignClass[id].push({
                                    src: f.src || saveTS && saveTS.src,
                                    trackId: f.trackId,
                                    trackPointId: f.trackPointId,
                                    signId: entityId,
                                    entity,
                                    pixels: saveTS && saveTS.pixels
                                });
                            } else {
                                traffciSignClass[id][index].src = f.src || saveTS && saveTS.src;
                                traffciSignClass[id][index].pixels = saveTS && saveTS.pixels;
                            }
                        } else {
                            traffciSignClass[id] = [];
                            let pngsrc = [type, subtype].join('_');
                            
                            if ([type, subtype].includes(-1) || subtype == '0') {
                                pngsrc = '-1';
                            }
                            if (type == '3') {
                                pngsrc = '3'
                            } else if (type == '4'){
                                pngsrc = '4';
                            } else if (type == '5') {
                                pngsrc = '5';
                            } else if (type == '99') {
                                pngsrc = '99';
                            }
                            if (['2_1043', '2_1044', '2_1045', '1_0', '2_0'].includes(pngsrc)) {
                                pngsrc = '-1';
                            }

                            var img = 'dist/img/trafficsigns/' + pngsrc + '.png';
                            
                            // img = 'dist/img/trafficsigns/-1.png';
                            traffciSignClass[id].push({
                                src: img
                            })
                            let saveTS = context.variable.saveTrafficsignSrc[f.oldId || entity.osmId()]
                            traffciSignClass[id].push({
                                src:f.src || saveTS && saveTS.src,
                                trackId: f.trackId,
                                trackPointId: f.trackPointId,
                                signId: entityId,
                                entity,
                                pixels: saveTS && saveTS.pixels
                            })
                            that.pageCont += 1;
                        }
                    }
                })                
            }

            if (that.modifiedFeatures.length) {
                that.modifiedFeatures.forEach(function(f){
                    let type = 'w';
                    var lay = that.getLayerByName(iD.data.DataType.TRAFFICSIGN)
                    if(!lay){
                        return ;
                    }
                    var sim = iD.Entity.id.delimiter || "_";
                    var entity = context.hasEntity(type + lay.identifier + sim + f.id) || context.hasEntity(type + sim + f.id);
                    if (entity) {
                        let type = entity.tags.TYPE || -1;
                        let subtype = entity.tags.SUBTYPE || -1;
                        let shape = entity.tags.SHAPE || -1;
                        let id = [type, subtype, shape].join('_');
                        if (traffciSignClass[id]) {
                            var index = _.findIndex(traffciSignClass[id], {signId: entity.id});
                            if (index != -1) {
                                traffciSignClass[id][index].src = f.src;
                                traffciSignClass[id][index].pixels = f.pixels;
                            }
                        } 
                    }
                });
            }

            var tss = Object.values(traffciSignClass);

            tss.forEach(function(t) {
                var arr = [];
                arr.push(t[0]);
                for (let i = 1; i < t.length; i++) {
                    if(!_.include(that.removeFeatures, t[i].signId.toString())){
                        arr.push(t[i]);
                    }
                }
                trafficSigns.push(arr);
            });

            if (isSaveEnd) {
                that.synchroPB(null, null, that);
            }
            
            // var trafficSigns = tss, that = this;
            var currentDatas = trafficSigns[this.currentNum];

            if (!currentDatas) return;

            var $ul = $signPost.append('ul');

            var attribute = []
            if (that.isWorker) {
                fields.forEach(function(d) {
                    // if (d.fieldName == 'TYPE') {
                    if (['TYPE', 'SUBTYPE', 'SHAPE', 'CONT'].includes(d.fieldName)) {
                        var type = d.fieldInput.type;
                        if (d.fieldName == 'CONT') {
                            type = 'textarea';
                        }
                        if(d.fieldName == 'SHAPE') {
                            attribute.splice(2, 0, {
                                fieldTitle: d.fieldTitle,
                                values: d.fieldInput.values,
                                type,
                                fieldName: d.fieldName,
                                value: d.value,
                                disabled: false
                            })
                        } else {
                            attribute.push({
                                fieldTitle: d.fieldTitle,
                                values: d.fieldInput.values,
                                type,
                                fieldName: d.fieldName,
                                value: d.value,
                                disabled: false
                            })
                        }   
                    }
                })
            } else {
                fields.forEach(function(d) {
                    // if (d.fieldName == 'TYPE') {
                    // if (['ERROR_TYPE', 'ATTRIBUTE', 'DESC', 'STATE'].includes(d.fieldName)) {
                    //     var type = d.fieldInput.type;
                    //     if (d.fieldName == 'DESC') {
                    //         type = 'textarea';
                    //     } else if (d.fieldName == 'ATTRIBUTE') {
                    //         type = 'select';
                    //     } else if (d.fieldName == 'TYPE') {
                    //         type = 'selectgroup';
                    //     }
                    //     attribute.push({
                    //         fieldTitle: d.fieldTitle,
                    //         values: d.fieldInput.values,
                    //         type,
                    //         fieldName: d.fieldName,
                    //         value: d.value,
                    //         DESC: d.DESC
                    //     });
                    // }
                    var type = d.fieldInput.type;
                    if (d.fieldName == 'ERROR_TYPE') {
                        type = 'selectgroup';
                        attribute[0] = {
                            fieldTitle: d.fieldTitle,
                            values: d.fieldInput.values,
                            type,
                            fieldName: d.fieldName,
                            value: d.value,
                            DESC: d.DESC,
                            disabled: false
                        }
                    } 
                    if (d.fieldName == 'ATTRIBUTE') {
                        type = 'select';
                        attribute[1] = {
                            fieldTitle: d.fieldTitle,
                            values: d.fieldInput.values,
                            type,
                            fieldName: d.fieldName,
                            value: d.value,
                            DESC: d.DESC,
                            disabled: false
                        }
                    }
                    if (d.fieldName == 'DESC') {
                        type = 'textarea';
                        attribute[2] = {
                            fieldTitle: d.fieldTitle,
                            values: d.fieldInput.values,
                            type,
                            fieldName: d.fieldName,
                            value: d.value,
                            DESC: d.DESC,
                            disabled: false
                        }
                    }
                    if (d.fieldName == 'STATE') {
                        attribute[3] = {
                            fieldTitle: d.fieldTitle,
                            values: d.fieldInput.values,
                            type,
                            fieldName: d.fieldName,
                            value: d.value,
                            DESC: d.DESC,
                            disabled: false
                        }
                    }
                })
            }
            for (let i = 0; i < currentDatas.length; i++) {
                var data = currentDatas[i];
                // if (!data.pixels) return;
                let src = data.src;
                let checkTag = false;
                //检查当前牌子，是否已经被打过标记点
                checkTags.forEach(function(tag) {
                    let entity = context.hasEntity(data.signId);
                    if (entity) {
                        let osmId = entity.osmId();
                        if (tag.tags.FEATURE_ID == osmId) {
                            checkTag = true;
                            data.checkType = tag.tags.TYPE;
                            data.checkDESC = tag.tags.DESC;
                            data.checkState = tag.tags.STATE;
                            data.checkId = tag.id;
                            return;
                        }
                    }
                })

                let entityId = data.signId || '';
                if (data.signId) {
                    if (src) {
                        src = 'data:image/png;base64,' + src;
                    } else {
                        src = '../../dist/img/logo.jpg';
                    }

                    if (!saveSignPostDatas[data.signId]) {
                        saveSignPostDatas[data.signId] = {
                            trackId: data.trackId,
                            trackPointId: data.trackPointId,
                            signId: data.signId,
                            src: src
                        }
                    }
                }
                let $li = $ul.append('li')
                    .attr('data-flg', entityId+'&'+(data.checkId?data.checkId:''))
                    .on('click', function() {
                        let $this = d3.select(this);
                        selectSignDom = $this;
                        let entityId = $this.attr('data-flg');
                        // console.log('entityId:', entityId)
                        if(entityId && entityId != '&') {
                            $('.signpost-table li').siblings().removeClass('active');
                            $this.attr('class', 'active');

                            that.showAttribute(entityId, attribute, false);
                        }
                    });
                let img = $li.append('img')
                    .attr({
                        'src': src,
                        width: '100%',
                        height: '100%'
                    });                

                if (!data.signId) {
                    $li.append('span').html('示例')
                } else {
                    let $canvasDom = $li.append('div')
                    .style({
                        position: 'relative',
                        top: -(parseInt($li.style('height')) + 1) + 'px',
                        cursor: 'pointer'
                    });

                    $canvasDom.append('canvas')
                        .attr({
                            'id': entityId+'_canvas',
                            'width': parseInt($li.style('width')),
                            'height': parseInt($li.style('height'))
                        })

                    let $checkFlag = $li.append('div')
                        .attr({
                            'id': entityId+'_check'
                        })
                        .style({
                            position: 'absolute',
                            top: 0,
                            left: (parseInt($li.style('height')) + 2) + 'px',
                            width: '37px',
                            height: '34px',
                            display: checkTag ? 'block' : 'none'
                        })
                        .on('click', function(e){
                            if (that.isWorker) {
                                let $this = d3.select(this);
                                let $parentElement = d3.select($this.node().parentElement);
                                let dataFlag = $parentElement.attr('data-flg');
                                // let checkTagId = dataFlag.split('&')[1];
                                if(dataFlag) {
                                    let modelEntity = iD.ModelEntitys[iD.data.DataType.QUALITY_TAG];
                                    let geoType = modelEntity.getGeoType();
                                    let _fields = modelEntity.getFields(geoType);
                                    let _attribute = [];
                                    _fields.forEach(function(d) {
                                        var type = d.fieldInput.type;
                                        if (d.fieldName == 'ERROR_TYPE') {
                                            type = 'selectgroup';
                                            _attribute[0] = {
                                                fieldTitle: d.fieldTitle,
                                                values: d.fieldInput.values,
                                                type,
                                                fieldName: d.fieldName,
                                                value: d.value,
                                                DESC: d.DESC,
                                                disabled: true
                                            }
                                        } 
                                        if (d.fieldName == 'ATTRIBUTE') {
                                            type = 'select';
                                            _attribute[1] = {
                                                fieldTitle: d.fieldTitle,
                                                values: d.fieldInput.values,
                                                type,
                                                fieldName: d.fieldName,
                                                value: d.value,
                                                DESC: d.DESC,
                                                disabled: true
                                            }
                                        }
                                        if (d.fieldName == 'DESC') {
                                            type = 'textarea';
                                            _attribute[2] = {
                                                fieldTitle: d.fieldTitle,
                                                values: d.fieldInput.values,
                                                type,
                                                fieldName: d.fieldName,
                                                value: d.value,
                                                DESC: d.DESC,
                                                disabled: true
                                            }
                                        }
                                        if (d.fieldName == 'STATE') {
                                            _attribute[3] = {
                                                fieldTitle: d.fieldTitle,
                                                values: d.fieldInput.values,
                                                type,
                                                fieldName: d.fieldName,
                                                value: d.value,
                                                DESC: d.DESC
                                            }
                                        }
                                    })                            
                                    that.showAttribute(dataFlag, _attribute, true);
                                }
                                d3.event.stopPropagation();
                            }
                        });

                    $checkFlag.append('img')
                        .attr({
                            src: 'dist/img/trafficsigns/red.png',
                            width: '100%',
                            height: '100%'
                        });

                    let canvas = document.getElementById(entityId+'_canvas');
                    let ctx = canvas.getContext("2d");
                    let points = _.clone(data.pixels);
                    if (!points || !points.length) continue;
                    points = points.reverse();
                    let source_width = points[2].pixelX - points[0].pixelX;//原图宽度
                    let source_height = points[2].pixelY - points[0].pixelY;//原图高度
                    let scaleX = source_width / parseInt($li.style('width'));
                    let scaleY = source_height / parseInt($li.style('height'));
                    // points = getTopLeftPoints(points);
                    ctx.beginPath();
                    let offsetX = 20;
                    let offsetY = 30;
                    var x = (points[0].pixelX - points[0].pixelX + offsetX) / scaleX;
                    var y = (points[0].pixelY - points[0].pixelY + offsetY) / scaleY;
                    ctx.moveTo(x, y);
                    for (let j = 1; j < points.length; j++) {
                        var p1 = points[j];
                        if (j == 1) {
                            offsetX = -20;
                            offsetY = 30;
                        } else if( j == 2){
                            offsetX = -20;
                            offsetY = -20;
                        } else if(j == 3){
                            offsetX = 20;
                            offsetY = -20;
                        } else {
                            offsetX = 20;
                            offsetY = 30;
                        }                           
                        x = (p1.pixelX - points[0].pixelX + offsetX) / scaleX;
                        y = (p1.pixelY - points[0].pixelY + offsetY) / scaleY;
                        ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = '#FFF';
                    ctx.lineWidth = '2';
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            function getTopLeftPoints(pixels) {
                var arr = [];
                for (let i = 1; i < pixels.length; i++){
                    arr.push(pixels[i]);
                }
                arr.push(pixels[1]);
                return arr;
            }
        },
        
        //生成级联select对象数组。格式 {Array[parentId] = [sub1, sub2, sub3], ……}
        selectGroups: function(writeTags) {
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
        },
        
        selectValueChange:function (d) {
            /*if(arguments[3]){
                d = d3.event.target.parentNode.__data__;
            }*/
            if (!d) {
                d = d3.event.target.parentNode.__data__;
            }
            iD.UserJobHeartbeat.setJobStatus();
         
            editTag[d.fieldName] = this.options[this.selectedIndex].value;
            if (d.fieldName == 'TYPE') {
                editTag['SUBTYPE'] = ''; 
            }
            if (d.fieldName == 'ERROR_TYPE') {
                editTag['ATTRIBUTE'] = ''; 
            }
            editTag['entityId'] = d.entityId;
            this.blur();
            // context.event['entityedite'] && context.event['entityedite']({entitys: [d.entityId]});
        },

        keyValueChange: function(d) {
            var that = this,
                _currentObj = d3.select(that),
                _value = that.value,
                flag = /^\d+(\.\d+)?$/.test(_value),
                id = d.entityId;
            
            editTag[d.fieldName] = _value;
            editTag['entityId'] = id;
            context.event['entityedite'] && context.event['entityedite']({entitys: [id]});
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
        },

        valueChange: function(d) {
            var that = this,
                // _currentObj = d3.select(that),
                _value = that.value;
                // _fieldTitle = '修改'+d.fieldTitle+' :'+_value;
            // _currentObj.classed('error', false)
            //     .attr('placeholder', '');

            // var tag = {};
            editTag[d.fieldName] = _value;
            editTag['entityId'] = d.entityId;
            // entityEditor.entityID(d.entityId).changeTags(tag);
        },

        refresh: function() {
            let protoUrl = "./dist/proto/traffic_sign.proto";
            var that = this;
            var loading = iD.ui.Loading(iD.User.context)
                .message('正在刷新路牌数据，请稍等……')
                .blocking(true);
            d3.select('body').call(loading);
            protobuf.load(protoUrl, function (err, root) {
                loading && loading.close();
                //请求PB数据及解析
                let pbUrl = iD.config.URL.hbase_support + 'text/laser_middle_result/laser_sign_element_pb/query?key=' + iD.Task.d.tags.laserSignElement
                // let protoUrl = "./dist/proto/traffic_sign.proto";
                //解析PB
                iD.util.parsePBData(pbUrl, root, 'kd.mapping.proto.TrafficSigns', function(message, p){
                // iD.util.parsePBData(pbUrl, protoUrl, function(message){
                    that.createSignDom(message.trafficSigns, that.signpostDialog, p);
                })
            });
        },

        synchroPB: function(nodes, ways, that){
            var flag = false;
            if (!ways) {
                ways = that.addFeatures;
            }

            if (nodes && nodes.length) {
                let type = 'n';
                var lay = that.getLayerByName(iD.data.DataType.QUALITY_TAG)
                if(lay){
                    var sim = iD.Entity.id.delimiter || "_";
                    var id = '';
                    for (let i = 0; i < nodes.length; i++) {
                        id = type + lay.identifier + sim + nodes[i].oldId;
                        let node = context.hasEntity(type + lay.identifier + sim + nodes[i].newId) || context.hasEntity(type + sim + nodes[i].newId);
                        if(node && node.modelName == iD.data.DataType.TRAFFICSIGN_NODE) {
                            let way = context.graph().parentWays(node)[0];
                            let osmWayId = way.osmId();
                            // let index = _.findIndex(ways, {newId: osmWayId});
                            let index = _.findIndex(ways, {newId: parseInt(osmWayId)});
                            if (index == -1) {
                                ways.push({
                                    oldId: parseInt(osmWayId), 
                                    newId: parseInt(osmWayId), 
                                    newVersion: null
                                })
                            }
                        } else {
                            let index = _.findIndex(checkTags, {id: id});
                            if (index == -1) {
                                id = type + sim + nodes[i].oldId;
                                index = _.findIndex(checkTags, {id: id});
                            }
                            if (index != -1) {
                                let checktag = checkTags[index];
                                //let ct = context.hasEntity(type + lay.identifier + sim + nodes[i].newId) || context.hasEntity(type + sim + nodes[i].newId);
                                //if (ct) {
                                    checktag.id = type + lay.identifier + sim + nodes[i].newId;
                                    var feature = context.hasEntity('w' + lay.identifier + sim + checktag.tags.FEATURE_ID) || context.hasEntity(type + sim + checktag.tags.FEATURE_ID);
                                    let $signpost = d3.select('#signpost');
                                    let $li = $signpost.selectAll('li[data-flg="'+feature.id+'&'+id+'"]');
                                    if($li.node()) {
                                        $li.attr('data-flg', feature.id+'&'+checktag.id);
                                    }
                                //}
                            }
                        }
                    }
                }
            }

            if (ways && ways.length) {//新增路牌
                for (let i = 0 ; i < ways.length; i++) {
                    let type = 'w';
                    var lay = that.getLayerByName(iD.data.DataType.TRAFFICSIGN)
                    if(!lay){
                        continue ;
                    }
                    var sim = iD.Entity.id.delimiter || "_";
                    var osmId = ways[i].newId || ways[i].id;// || that.addFeatures[i].id;
                    var entity = context.hasEntity(type + lay.identifier + sim + osmId) || context.hasEntity(type + sim + osmId);
                    if (!entity) continue;
                    
                    var oldId = ways[i].oldId;// || that.addFeatures[i].id;//判断如果先绘制再同步PB，则用oldId。
                    let saveTS = context.variable.saveTrafficsignSrc[type + lay.identifier + sim + oldId] || context.variable.saveTrafficsignSrc[type + sim + oldId] || context.variable.saveTrafficsignSrc[oldId];
                    var feature = _.filter(that.addFeatures, {id: osmId})[0] || _.filter(that.addFeatures, {id: oldId})[0] || _.filter(that.modifiedFeatures, {id: osmId})[0] || _.filter(that.modifiedFeatures, {id: oldId})[0];
                    if (!feature) continue;

                    let index = _.findIndex(that.messageTrafficSigns, {signId: osmId});
                    if (index == -1) {
                        that.messageTrafficSigns.push(new TrafficSign({
                            trackId: feature.trackId,
                            trackPointId: feature.trackPointId,
                            signSrc: feature.src || saveTS && saveTS.src,
                            signId: osmId,
                            pixels: saveTS && saveTS.pixels
                        }))
                    } else {
                        that.messageTrafficSigns[index].signSrc = saveTS && saveTS.src || '';
                        that.messageTrafficSigns[index].pixels = saveTS && saveTS.pixels || [];
                    }
                    if (!that.pbRoot) isSaveEnd = true;
                    if (ways[i].newId) {
                        feature.oldId = _.clone(oldId);
                        feature.id = ways[i].newId;
                        feature.src = saveTS && saveTS.src || '';
                        feature.pixels = saveTS && saveTS.pixels || [];
                    }
                    flag = true;
                }
            }

            if (that.removeFeatures.length) {
                that.removeFeatures.forEach(function(f){
                    let index = _.findIndex(that.messageTrafficSigns, {signId: parseInt(f)});
                    if (index != -1) {
                        that.messageTrafficSigns.splice(index, 1);
                        flag = true;
                    }
                });                    
            }
            if (flag && that.pbRoot) {
                console.log('messageTrafficSigns', that.messageTrafficSigns);
                var msg = that.pbRoot.create(new TrafficSigns(that.messageTrafficSigns));
                var buf = that.pbRoot.encode(msg).finish();
                //使用xmlpost 保存逻辑 参考connection.js 1694
                that.savePb(buf);
                that.addFeatures = [];
                that.removeFeatures = [];
                isSaveEnd = false;
                context.connection().on('loaded.signpostTagEditor', null);
            }
        },

        savePb: function (uploaddata) {
            var loading = iD.ui.Loading(iD.User.context)
                .message('正在同步路牌数据到服务器，请稍等……')
                .blocking(true);
            d3.select('body').call(loading);
            var saveLoader = function (err, data) {
                loading && loading.close();
                if (!data || err) {
                    Dialog.alert('PB文件保存失败！')
                    return;
                }
                var res = JSON.parse(data.response);
                if (res && res.code != "0") {
                    Dialog.alert('code:' + res.code + ':' +res.message);
                }
            }

            var header = {'Content-Type': 'application/json'};
            var formData = uploaddata;//JSON.stringify(uploaddata);
            let url = iD.config.URL.hbase_support + 'text/laser_middle_result/laser_sign_element_pb/save?gzip=true&update=true&key=' + iD.Task.d.tags.laserSignElement
                
            context.connection().oauth.ohauth.rawxhr("POST", url, formData, header, saveLoader);
        },

        addCheckTag: function(loc, entityId) {
            var layer =  iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.QUALITY_TAG);
            var layerid = layer.id;
            var entity = context.hasEntity(entityId);
            var mergeTags = {
                CREATE_BY: iD.User.getInfo().username,
                PROJECT_ID: iD.Task.d.tags.projectId || ''
            };
            if(iD.User.isCheckRole()){
                mergeTags.TAG_SOURCE = '1';
            }else if(iD.User.isVerifyRole()){
                mergeTags.TAG_SOURCE = '2';
            }else if(iD.User.isQualityAssessorRole()){
                mergeTags.TAG_SOURCE = '3';
            }
            mergeTags.MODEL = 'LOCALIZATION_OBJECT';
            mergeTags.FEATURE = 'TRAFFICSIGN';
            
            if (entity) {
                mergeTags.FEATURE_ID = entity.osmId();
            }
            mergeTags = _.extend(mergeTags, editTag);
            delete mergeTags.entityId;

            var modelEntity = iD.ModelEntitys[iD.data.DataType.QUALITY_TAG];
            if(!modelEntity) return;                    
                    
            var node = iD.Node({
                layerId : layerid,
                identifier:layer.identifier,
                loc : loc,
                modelName: iD.data.DataType.QUALITY_TAG,
                tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.QUALITY_TAG, layer), mergeTags)
            });
            iD.util.tagExtend.updateTaskTag(node);
            checkTags.push(node);
            context.perform(
                iD.actions.AddEntity(node),
                t('operations.checkTag.title'));
            iD.logger.editElement({
                'tag': "add_check_tag",
                'modelName': iD.data.DataType.QUALITY_TAG
            });
                    
            context.enter(
                iD.modes.Select(context, [node.id])
                    .suppressMenu(true)
                    .newFeature(true));

            context.event.entityedite && context.event.entityedite({entitys: [node.id]});
            return node;
        }

    })

    class TrafficSign {
        constructor(param) {
            this.trackId = param.trackId;
            this.trackPointId = param.trackPointId;
            this.signSrc = param.signSrc;
            this.signId = param.signId;
            this.pixels = param.pixels;

            return this;
        }
    }

    class TrafficSigns {
        constructor(trafficSigns) {
            this.trafficSigns = trafficSigns;
            this.trackId = iD.picUtil.player.wayInfo.trackId;
        }
    }

    return new signpost();
};