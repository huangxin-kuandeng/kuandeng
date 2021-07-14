/**
 * 实际的图层列表 面板，在iD.ui.LayerPane中初始化
 * @param {Object} context
 */
iD.ui.LayerManager = function (context) {
    var dispatch = d3.dispatch('change', 'setting', 'nodisplay', 'sublayerlist', 'video', 'tag',
        'pano', 'background', 'hotspot', 'pic', 'walkEdit', 'roadEdit', 'pointEdit'),

        modelEntityLoaded = false,
        selection;
    
    let keys = ["Alt+1", "Alt+2", "Alt+3", "Alt+4"];
   
  
    function dispatchPic(d) {


        // if (currentTask.basic_data_type.indexOf('DVR') === -1) {
        // 	alert('当前任务无DVR');
        // 	return;
        // }
        return true;
    }

    function drawList(selection, subConfigLayers) {
        var root = {};
        // var staticLayers = subConfigLayers?subConfigLayers:getStaticLayers();
        var _dataLayers = iD.Template.dataLayers || [];
        var _sourceLayers = iD.Template.sourceLayers || [];
        if (!_dataLayers.length && !_sourceLayers.length) {
            return;
        }
        var staticLayers = _dataLayers.concat(_sourceLayers);
        // for (var rootLayer in staticLayers) {
        for (var c = 0; c < staticLayers.length; c++) {
            var layerData = staticLayers[c];
            
            if(c==0 && !_.isEmpty(layerData.layers)){
                _eventLayers = layerData.layers.slice(0,4);
            }
            var layer = selection //.append('div').data([layerData])
                .append('div').attr('class', 'root');

            layer.append('div').text(function (d) {
                // return d.name;
                return layerData.label;
            }).classed('dropdown', true).on('click', function (d) {
                var root = d3.select(this.parentNode);
                root.classed('close', !root.classed('close'));
            });

            var menu = layer.append('ul').classed('dropdown-menu', true);
            var sublayers = false;
            var sublayersObject = null;
            var items = menu.selectAll('.item').data(layerData.layers || []).enter()
                // var items = menu.selectAll('.item').data(layerData.children || []).enter()
                .append('li').attr('class', function (d) {
                    var layer_id = d.layerIds ? d.layerIds.join('_') : d.type;
                    if (d.subLayer) {
                        sublayers = d.subLayer;
                        sublayersObject = d3.select(this);
                        return 'item subItem' + layer_id;
                    } else {
                        return 'item item-' + layer_id;
                    }
                }).html(function (d) {
                    return '<span class="layer-title" title="' + d.name + '">' + d.name + '</span>';
                });

            if (sublayers) {
                sublayersObject.call(layerManager, sublayers)
            }
            var colorDiv = items.filter(function (d) {
                if (d.subLayer) {
                    return false;
                } else {
                    return true;
                }
            }).append('div').attr('class', 'default-color').each(function (d) {
                if (d.defaultColor) {
                    this.style["background-color"] = d.defaultColor;
                }
            });

            var displayButton = items.filter(function (d) {
                var editor_type = d.hasOwnProperty('display');
                return editor_type === true;
            }).append('i').attr('class', function (d) {
                var display_active = d.display ? ' active' : '';
                var display_lock = d.displaylock ? ' lock' : '';
                return ('display' + display_active + display_lock);
            })

            var editButton = items.filter(function (d) {
                var editor_type = d.layerIds && d.hasOwnProperty('editable');
                return editor_type === true;
            }).append('i').attr('class', function (d) {
                var editor_active = d.editable ? ' active' : '';
                var editor_lock = d.editlock ? ' lock' : '';
                return ('edit' + editor_active + editor_lock);
            })

            // 底图层 中的点击
            displayButton && displayButton.on('click', function (d) {
                if (d.disable) {
                    return;
                }

                if (d.type === 'pic') {
                    if (!iD.User.authTrail()) {
                        Dialog.alert(t("permission.trail_no_display"));
                        return;
                    }
                }

                var type = d.type;
                var trigger;
                var picTrigger;
                if (type === 'pic') {
                    picTrigger = dispatchPic(d);
                    if (!picTrigger) {
                        return;
                    }
                }

                var layerIds = d.layerIds || [];

                //				切换的bug
                if (d.hasOwnProperty('editable')) {
                    // 要素图层
                    // iD.Static.layersInfo.toggleStatus(d, 'display');
                    d.display = !d.display;
                    if (!d.display) {
                        let $editBtn = d3.select(this.parentNode).selectAll('i.edit');
                        // iD.Static.layersInfo.setLayerStatus(d.type, 'editable', false);
                        d.editable = false;
                        $editBtn.classed('active', d.editable);
                    }
                } else {
                    // resource
                    // 栅格底图等
                    d.display = !d.display;
                }

                d3.select(this).classed('active', d.display);
                // if (!d.display) {
                // 	if (this.nextSibling) {
                // 		d.editable = false;
                // 		iD.Static.layersInfo.setStatus(type, 'editable', false);
                // 		d3.select(this.nextSibling).classed('active', false);
                // 	}
                // }
                // context.map().center(context.map().center());
                context.enter(iD.modes.Browse(context));
                dispatch.change(d, 'display');

                if (trigger) {
                    var id = iD.Task.d.basic_id;
                    dispatch.video(id, d.display);
                }
                if (picTrigger) {
                    dispatch.pic(iD.Task.d, d.display);
                }

            }).on('click.event', function (d) {

                if (d.type === 'pic') {
                    if (!iD.User.authTrail()) {
                        return;
                    }
                }

                var layerIds = d.layerIds || [],
                    _event = d.event || 'roadEdit';

                // 背景图切换 id.js
                if (_event && (_event != 'pic')) {
                    dispatch[_event](d, d.display);
                }
                if (d.unique && d.display) {
                    displayButton.filter(function (cur) {
                        return d.unique === cur.unique && d.type !== cur.type;
                    }).classed('active', function (cur) {
                        cur.display = false;
                        return false;
                    });
                }
            });

            editButton && editButton.on('click', function (d) {
                // 编辑按钮
                if (!iD.Task.d) {
                    Dialog.alert("未选择任务，无法编辑");
                    return;
                }

                var layerIds = d.layerIds || [],
                    _event = d.event || 'roadEdit';

                var type = d.type;

                context.enter(iD.modes.Browse(context));
                let $editBtns = d3.select(this.parentNode.parentNode).selectAll('li.item i.edit');
                // 融合系统时是多批次处理，只能有一个批次可编辑
                /*
                if(window._systemType == 2 && $editBtns.filter('.active').size() > 0 && $editBtns.filter('.active').node() != this){
                    Dialog.alert(t("不能同时编辑多个批次"));
                    return ;
                }
                */
                // iD.Static.layersInfo.toggleStatus(d, 'editable');
                // d.editable = iD.Static.layersInfo.getElementStatus(d.type, 'editable');
                d.editable = !d.editable;
                d3.select(this).classed('active', d.editable);
                if (d.hasOwnProperty('display')) {
                    // 不显示时开启编辑
                    if (d.editable && !d.display) {
                        let $displayBtn = d3.select(this.parentNode).selectAll('i.display');
                        // iD.Static.layersInfo.setLayerStatus(d.type, 'display', true);
                        // d.display = iD.Static.layersInfo.getElementStatus(d.type, 'display');

                        d.display = true;
                        $displayBtn.classed('active', d.display);
                    }
                }

                dispatch.change(d, 'display');

                /* var _selfBtn = this;
                if(d.editOnly){
                    $editBtns.filter(function(){
                        return this != _selfBtn;
                    }).each(function(_d){
                        _d.editable = iD.Static.layersInfo.getElementStatus(_d.type, 'editable');
                        d3.select(this).classed('active', _d.editable);
                    });
                } */

                if (_event) {
                    dispatch[_event](d, d.display);
                }
            });
        }
        var keybinding = d3.keybinding('layerManager');
        keys.forEach(function (m) {
            keybinding.on(m, (e)=>{
                let i = [49,50,51,52].indexOf(d3.event.keyCode);
                if( i!=-1){
                    let ids = _eventLayers[i].layerIds.join('_');
                    let item = d3.select('.item-'+ ids+' .edit');
                    let isActive = item.classed('active');
                    if(isActive){
                        item = d3.select('.item-'+ ids+' .display');
                    }
                    item.dispatch('click');
                }
               
            });
        });
        d3.select(document)
        .call(keybinding);
    }

    function layerManager(selection, subConfigLayers) {

        // var roadData = context.layers().getLayers()[0];
        // roadData.sublayers.forEach(function(layer) {
        // 	layer.enable = false;
        // });

        // var elements = iD.Static.layersInfo.getElements();
        // var role = d3.select('body').attr('role');
        let $container = selection.append('div').attr('class', 'background-container').data([0]);
        drawList($container, subConfigLayers);


        dispatch.change();
        iD.User.on('dvr', function () {
            var ele = d3.select('.item-video')
            var data = ele.data();
            data.display = false;
            ele.data([data]);
            // iD.Static.layersInfo.setStatus('video', 'display', false);
            // iD.Static.layersInfo.setLayerStatus('video', 'display', false);
            ele.classed('active', false);
            dispatch.video(null, false);
            //切换任务时候出发，众包资料需要切换任务时删除原来的dom节点借助dvr事件

            dispatch.pic(iD.Task && iD.Task.d, true);
        });

    };

    function getStaticLayers() {
        // var layers = _.clone(iD.Static.layers, true);
        if (!iD.Static) return;
        var layers = _.clone(iD.Static.layersInfo.getResourceElements(), true);
        var data = iD.Task.d;
        var temp = layers.resource.children;
        var role = iD.User.getRole().role;

        if (data) {
            var type = data.basic_data_type;
            // dispatch.tag('t_pkb_tag', false);
            // dispatch.tag('t_pkb_shp', false);
            // dispatch.tag('key_projects_tag', false);
            // dispatch.tag('user_feed_back', false);
            // dispatch.tag('t_user_feedback_pkb_tag', false);
            // dispatch.tag('t_user_feedback_pkb_shp', false);
            if (type.indexOf('DVR') === -1) {
                parse('video');
            }
            // if (data.task_classes != 2 ||data.task_type != 2 || data.trk_id=="") {
            //
            // 	//隐藏左侧众包按钮
            // 	 parse('pic');
            //
            // }

            /*if (type.indexOf('TAG') === -1) {
                if (data.task_classes === 7) {
                    parse('user_feed_back');
                    parse('t_pkb_shp');
                    parse('key_projects_tag');
                }
                else{
                    parse('user_feed_back');
                }
            } else {*/
            // if (data.task_classes === 1) {
            // 	parse('key_projects_tag');
            // 	parse('t_pkb_tag');
            // 	parse('t_pkb_shp');
            // 	if (data.task_type == '3') {
            // 		parse('user_feed_back');
            // 		dispatch.tag('t_user_feedback_pkb_tag', true);
            // 		dispatch.tag('t_user_feedback_pkb_shp', true);
            // 	}
            // 	else{
            // 		parse('t_user_feedback_pkb_tag');
            // 		parse('t_user_feedback_pkb_shp');
            // 		dispatch.tag('user_feed_back', true);
            // 	}
            // } else if (data.task_classes === 2) {
            // 	parse('user_feed_back');
            // 	parse('t_user_feedback_pkb_tag');
            // 	parse('t_user_feedback_pkb_shp');
            // 	if (data.task_type == '3') {
            // 		parse('key_projects_tag');
            // 		dispatch.tag('t_pkb_tag', true);
            // 		dispatch.tag('t_pkb_shp', true);
            // 	}
            // 	else {
            // 		parse('t_pkb_tag');
            // 		parse('t_pkb_shp');
            // 		dispatch.tag('key_projects_tag', true);
            // 	}
            //
            // } else if (data.task_classes === 7) {
            // 	parse('user_feed_back');
            // 	parse('t_user_feedback_pkb_tag');
            // 	parse('t_user_feedback_pkb_shp');
            // 	parse('t_pkb_tag');
            // 	parse('t_pkb_shp');
            // 	parse('key_projects_tag');
            // }
            //	}

            // if (data.parent_task_id === 0 && role === 'work') {
            // 	parse('tag');
            // }

        }
        // dispatch.hotspot('hotspot_weekly', false);
        // dispatch.hotspot('hotspot_monthly', false);
        // dispatch.background('wms', true);
        function parse(key) {
            var index = -1;
            temp.forEach(function (ele, i) {
                if (ele.type === key) {
                    index = i;
                    return;
                }
            });
            if (index >= 0) {
                temp.splice(index, 1);
            }
        }

        return layers;
    }
 
    layerManager.initialization = async function () {
        iD.Template.dataLayers = [];
        iD.Template.sourceLayers = [];
        d3.selectAll('.map-controls .background-container .root').remove();
        // await iD.config.loadTaskVersionInfo(iD.Task.d).then(data=>{});
        await iD.config.loadTaskVersionInfo(iD.Task.d).then(function (data) {
            iD.Template.dataLayers = (data && data.dataLayers) ? data.dataLayers : [];
            iD.Template.sourceLayers = (data && data.dataLayers) ? data.sourceLayers : [];

     
        });
    }
    layerManager.redrawLayerList = function () {
        drawList(d3.select('.map-controls .background-container'));
    }
    layerManager.update = function () {
        dispatch.change();
    }

    return d3.rebind(layerManager, dispatch, 'on');
};
