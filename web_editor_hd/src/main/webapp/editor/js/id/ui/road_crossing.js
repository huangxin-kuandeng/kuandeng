/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:37
 * @LastEditors: tao.w
 * @LastEditTime: 2021-03-08 12:46:06
 * @Description: 
 */
/**
 * 编辑器上方的添加道路、添加属性变化点、添加复杂路口等按钮
 * @param {Object} context
 */
iD.ui.RoadCrossing = function (context) {
    //var modes = [ iD.modes.AddRoad(context), iD.modes.AddRoadCross(context)/**, iD.modes.AddSpeedCamera(context)*/, iD.modes.AddZlevel(context), iD.modes.DisconnectRoad(context), iD.modes.AddIsland(context)];
    // var originModes = [ iD.modes.AddRoad(context), iD.modes.AddWalkroad(context),iD.modes.AddIsland(context),iD.modes.AddPlacename(context),iD.modes.QcRoadInfoTag(context),iD.modes.QcCrossInfoTag(context),iD.modes.QcMultiInfoTag(context),iD.modes.QcQuestionTag(context),iD.modes.QcAddTag(context),iD.modes.QcMinusTag(context)];

    return function (selection) {

        //更改初始化加载编辑按钮
        var modes = [];
        var role = d3.select('body').attr('role') || 'work';
        selection.classed(role + 'er-action', true);
        iD.Static && iD.Static.actionRole[role].forEach(function (value) {
            let subMode = iD.modes[value](context);
            subMode && modes.push(subMode);
        });
        let configs = {
            'asphalt1': {
                'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': 1,
                    'TYPE': 1
                }
            },
            'asphalt2': {
                'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': 1,
                    'TYPE': 2
                }
            },
            'asphalt3': {
                'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': 1,
                    'TYPE': 3
                }
            },
            'cement1': {
                'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 32
                }
            },
            'cement2': {
                'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                }
            },
            'cement3': {
                'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                }
            },
            'cement4': {
                'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                }
            },
            'cement5': {
                'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                }
            },
            'cement6': {
                'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                }
            },

        }
        let tempButtons = [
            {
                id: 'add-asphalt1',
                button: 'asphalt1',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_asphalt1.description'),
                key: "Ctrl+Q",
                iconText: '纵缝',
                'model': 'AddPavementDistreesLine1',
                // 'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': "1",
                    'TYPE': "1"
                },
                enable: true
            },
            {
                id: 'add-asphalt2',
                button: 'asphalt2',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_asphalt2.description'),
                key: "Ctrl+Q",
                iconText: '横缝',
                'model': 'AddPavementDistreesLine1',
                // 'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': "1",
                    'TYPE': "2"
                },
                enable: true
            },
            {
                id: 'add-asphalt3',
                button: 'asphalt3',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_asphalt3.description'),
                key: "Ctrl+Q",
                iconText: '龟裂',
                'model': 'AddPavementDistreesLine',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': "1",
                    'TYPE': "3"
                },
                enable: true
            },
            {
                id: 'add-cement1',
                button: 'cement1',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement1.description'),
                key: "Ctrl+Q",
                iconText: '裂缝',
                'model': 'AddPavementDistreesLine1',
                // 'model': 'add-pavementDistreesLine1',
                'opts': {
                    'MATERIAL': "2",
                    'TYPE': "32"
                },
                enable: true
            },
            {
                id: 'add-cement2',
                button: 'cement2',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement2.description'),
                key: "Ctrl+Q",
                iconText: '碎板',
                'model': 'AddPavementDistreesLine',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': "2",
                    'TYPE': "31"
                },
                enable: true
            },
            {
                id: 'add-cement3',
                button: 'cement3',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement3.description'),
                key: "Ctrl+Q",
                iconText: '板角',
                'model': 'AddPavementDistreesLine',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': "2",
                    'TYPE': "33"
                },
                enable: true
            },
            {
                id: 'add-cement4',
                button: 'cement4',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement4.description'),
                key: "Ctrl+Q",
                iconText: '坑洞',
                'model': 'AddPavementDistreesLine',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': "2",
                    'TYPE': "38"
                },
                enable: true
            },
            {
                id: 'add-cement5',
                button: 'cement5',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement5.description'),
                key: "Ctrl+Q",
                iconText: '边角',
                'model': 'AddPavementDistreesLine1',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': "2",
                    'TYPE': "36"
                },
                enable: true
            }
            /* ,{
                id: 'add-cement6',
                button: 'cement6',
                title: '',//t('modes.add_line.title'),
                description: t('modes.add_cement6.description'),
                key: "Ctrl+Q",
                iconText: '1111',
                'model': 'AddPavementDistreesLine',
                // 'model': 'add-pavementDistreesLine',
                'opts': {
                    'MATERIAL': 2,
                    'TYPE': 31
                },
                enable: true
            } */
        ];

        if (role == 'work') {
            tempButtons.forEach(d => {
                let subMode = iD.modes[d.model](context, d);
                subMode && modes.push(subMode);
            })
        }

        var buttons = selection.selectAll('button')
            .data(modes)
            .enter().append('button')
            .attr('class', 'KDSEditor-col6-1')
            .attr('id', function (d) { return d.id; })
            .on('click', function (d) {
                var is_active = d3.select(this).classed("active");
                // 回到浏览模式
                context.enter(iD.modes.Browse(context));
                if (!is_active) {
                    buttons.classed("active", false);
                    // 进入当前按钮对应模式
                    context.enter(d);
                }
                d3.select(this).classed("active", !is_active);
            })
            .call(bootstrap.tooltip()
                .placement('bottom')
                .html(true)
                .title(function (d) {
                    return iD.ui.tooltipHtml(d.description, d.key);
                    //return iD.ui.tooltipHtml(d.id + '.tooltip', d.key);
                }));

        buttons.append('div').classed('for-border', true).append('span')
            .attr('class', function (d) {
                return 'KDSEditor-icon ' + d.id + (d.iconText ? ' icon-text' : '');
            }).text(function (d) {
                return d.iconText || '';
            })
            // .attr('class', function (d) { return 'KDSEditor-icon ' + d.id; });

        var keybinding = d3.keybinding('road_crossing');

        //快捷键
        modes.forEach(function (m) {
            keybinding.on(m.key, function () {
                buttons.each(function (o) {
                    if (m.button === o.button && !d3.select(this).property('disabled')) {
                        if (context.editable() && (iD.Task.working && iD.Task.working.task_id == iD.Task.d.task_id)) context.enter(m);
                    }
                });
            });
        });

        d3.select(document)
            .call(keybinding);

        context.ui().layermanager.on('change.road_crossing', function (d, type) {
            if (d && d._parentType == "elements") {
                context.map().redraw();
            }
            update(d);
        });
        context.ui().layermanager.on('nodisplay.road_crossing', function (d) {
            var bb = buttons.classed("active");
            if (bb) {
                alert('请退出编辑操作模式');
            }
            context.barButtonActive1 = bb;
        });


        context.on('enter.road_crossing', function (entered) {
            buttons.classed('active', function (mode) {
                if (entered.drawroad && entered.drawroad === mode.button) {
                    return true;
                } else {
                    return entered.button === mode.button;
                }
            });
            inDrawLineMode();
        });

        context.on('exit.road_crossing', function (exited) {
            context.container().classed('mode-' + exited.id, false);
        });

        context.event.on('change_scene.road_crossing', function () {
            update();
        });

        iD.Task && iD.Task.on('start', function () {
            update();
        });

        context.map()
            .on('move.road_crossing', _.debounce(update, 500));
        //导航工具箱"继续绘制道路"按钮, 绘制时按钮选中状态
        function inDrawLineMode() {
            // var layer = context.layers().getCurrentEnableLayer(), cMode = context.mode();
            var layer = context.layers().getLayer(), cMode = context.mode();
            if (cMode.id === 'draw-line' && layer && layer.isRoad()) {
                buttons.each(function (b) {
                    var btn = d3.select(this);
                    if (b.id === 'add-road') {
                        btn.classed("active", true);
                        context.__road_line_btn___ = btn;
                    }
                });
            }
        }

        // 场景
        var dividerActionIds = ['add-divider', 'add-barrier', 'add-objectPt', 'add-objectPG', 'add-road-attribute', 'add-rectPG', 'add-objectPG', 'add-road', 'add-roadcross', 'add-junction', 'add-pavementDistreesLine', 'add-pavementDistreesLine1', 'add-pavementDistreesLine2'];
        var otherActionIds = [];

        var modelActions = {
            'DIVIDER': ['add-divider', 'add-junction'],
            'BARRIER_GEOMETRY': ['add-barrier'],
            'OBJECT_PG': ['add-objectPG', 'add-rectPG'],
            'OBJECT_PT': ['add-objectPt'],
            'OBJECT_PL': ['add-ObjectPl'],
            'ROAD_ATTRIBUTE': ['add-road-attribute'],
            'ROAD': ['add-road', 'add-roadcross'],
            'PAVEMENT_DISTRESS': ['add-pavementDistreesLine', 'add-asphalt3', 'add-cement2', 'add-cement3', 'add-cement4', 'add-cement5', 'add-cement6'],
            'PAVEMENT_DISTRESS_PL': ['add-pavementDistreesLine1', 'add-pavementDistreesLine2', 'add-asphalt1', 'add-asphalt2', 'add-cement1'],
            'QUALITY_TAG': ['add-point-checktag']
        }

        function update(d) {
            if (!iD.Task || !iD.Task.working || iD.Task.working.task_id != iD.Task.d.task_id || !context.map().editable()) {
                buttons.classed('hide', true);
                var qcalltag = d3.select('.allqctag_cnt');
                qcalltag.classed('hide', true);
                return;
            }

            var elements = editor.context.layers().getLayers();
            // if (d && d.type) {
            //     var data = elements[d.type];
            //     elements = {};
            //     elements[d.type] = data;
            // }
            buttons.classed('hide', true);
            let layer;
            // for(var key in elements) {
            //     var value = elements[key];
            //     if(value){
            //         var actions = value.action;
            //         var curButtons = buttons.filter(function(d) {
            //             return actions.indexOf(d.id) !== -1;
            //         });
            //         layer = context.layers().getLayerById(value.children[0]);
            //         var visiable = layer.display;
            //         var editable = layer.editable;
            //         var role = d3.select('body').attr('role') || 'work';
            //         var disabled = !editable;
            //         curButtons.classed('hide', !visiable || !editable);
            //     }
            // }
            for (var key in elements) {
                var value = elements[key];
                var models = value.models || {};
                if (value) {
                    layer = context.layers().getLayerById(value.id || value.children[0]);
                    var curButtons = null;
                    for (var modelname in models) {
                        var modleConfig = models[modelname];
                        var modleAction = modelActions[modelname];
                        if (modelActions[modelname] && modleConfig.editable) {
                            curButtons = buttons.filter(function (d) {

                                var flag = modleAction.indexOf(d.id) !== -1;
                                if (!flag) return flag;

                                return flag;
                            });
                        }
                        if (layer && layer.editable && curButtons) {
                            curButtons.classed('hide', false);
                        }
                    }

                }
            }
        }

        function setButtonVisible() {
            buttons.each(function () {
                if (this.disabled) this.style.display = 'none';
                else this.style.display = 'block';
            });
        }

        update();
    };
};
