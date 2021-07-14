iD.ui = function (context) {
    var User = iD.User;
    User.context = context;
    function render(container) {

        //添加一个app提示
        //container.call(iD.ui.RoadTip(context));
        //container.call(iD.ui.RoadMergeTip(context));
        var map = context.map();

        if (iD.detect().opera) container.classed('opera', true);

        container.append('svg')
            .attr('id', 'defs')
            .call(iD.svg.Defs(context));

        var isNoneLeft = isNoneFooter = isNoneTop = isNoneRight = isNoneRight2 = tilelayer = 'none', uiNone = context.options.ui;
        if (!(typeof uiNone === 'object') && !uiNone) {
            isNoneLeft = isNoneFooter = isNoneTop = isNoneRight = isNoneRight2 = tilelayer = 'block';
        }
        if (typeof uiNone === 'object') {
            if (uiNone.panel != false) {
                isNoneLeft = 'block'
            }
            if (uiNone.bar != false) {
                isNoneTop = 'block'
            }
            if (uiNone.zoom != false) {
                isNoneRight = 'block';
            }

            if (uiNone.toolbar != false) {
                isNoneRight2 = 'block';
            }
            if (uiNone.tilelayer != false) {
                tilelayer = 'block';
            }
            if (uiNone.footer != false) {
                isNoneFooter = 'block';
            }
        }
        // if(isNoneLeft === 'block'){
        // 	container.append('div')
        // 	.attr('id', 'KDSEditor-sidebar')
        // 	.attr('class', 'col3')
        // 	.call(ui.sidebar);
        // }

        // 左侧列表
        container.append('div')
            .attr('id', 'leftbar')
            .attr('class', 'col3')
            .call(ui.leftbar);

        ui.openDialog.open();


        // 中间两个窗口
        var outerWrap = container.append('div')
            .attr('id', 'KDSEditor-outer-wrap');

        // 右侧工具条s
        var rightTool = container.append('div')
            .attr('id', 'rightmenu-tools')
            .attr('class', 'model-right-tools');

        // 轨迹点图例说明
        // container.append('div')
        // 	.attr('id', "track-legend-control")
        //     .attr('class', 'track-legend-control')
        //     .call(iD.ui.TrackLegend(context));

        var allWrap = outerWrap.append('div')
            .attr('id', 'KDSEditor-all-wrap');

        // 轨迹图像容器
        // model-pos-left
        var picplayer = allWrap.append('div')
            .attr('id', 'KDSEditor-picplayer')
            .attr('class', 'picplayer-dialog hide');
        // 副窗口
        // model-pos-right
        var picplayerSub = allWrap.append('div')
            .attr('id', 'KDSEditor-sub-picplayer')
            .attr('class', 'picplayer-dialog sub hide');

        // 地图容器
        // model-pos-right
        var content = allWrap.append('div')
            .attr('id', 'KDSEditor-content')
            .attr('class', '');

        var bar = content.append('div')
            .attr('id', 'KDSEditor-bar')
            .attr('style', 'display:' + isNoneTop)
            .attr('class', 'KDSEditor-div');

        var m = content.append('div')
            .attr('id', 'map')
            .call(map);

        // bar.append('div')
        //     .attr('class', 'KDSEditor-spacer KDSEditor-col13');

        // bar.append('div')
        // .attr('class', 'poi-search')
        // .call(iD.ui.PoiSearch(context));

        var limiter = bar.append('div')
            .attr('class', 'KDSEditor-limiter');

        // .attr('style', 'display:none')
        // 初始化按钮列表，保存、回退撤销等按钮；
        User.on('login.topbar', function () {

            limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap task-list')
                .call(ui.taskList);

            limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap joined')
                .call(iD.ui.UndoRedo(context));

            limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap')
                .call(iD.ui.Save(context));
            /* TODO 20180201 用不到
            limiter.append('div')
                .attr('class', 'button-wrap joined col3')
                .call(iD.ui.Modes(context), limiter);
            */

            limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap joined effects-group')
                .call(iD.ui.Effects(context));


            var actionButtons = limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap joined');

            var reportButtons = limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap joined report-button');

            var button3 = reportButtons.append('button').attr({
                'id': 'button3',
                'title': '查看检查报告',
            });

            button3.append('span')
                .attr('class', 'text-center')
                .text('查看检查报告');

            var button4 = reportButtons.append('button').attr({
                'id': 'button4',
                'title': 'Signpost',
            });

            button4.append('span')
                .attr('class', 'text-center')
                .text('Signpost');

            var buttonRun = reportButtons.append('button').attr({
                'id': '_btn_rerun_',
                'title': '重跑',
            });
            buttonRun.append('span')
                .attr('class', 'text-center')
                .text('重跑');

            var buttonCehck = reportButtons.append('button').attr({
                'id': '_btn_tocheck_',
                'title': '检查',
            });
            buttonCehck.append('span')
                .attr('class', 'text-center')
                .text('检查');
            var buttonAllCehck = reportButtons.append('button').attr({
                'id': '_btn_tocheck_all_',
                'title': '检查全部',
            });
            buttonAllCehck.append('span')
                .attr('class', 'text-center')
                .text('检查全部');

            //--------------------------------------
            var button2 = reportButtons.append('button').attr({
                'id': 'button2',
                'title': '完成',
            });
            button2.append('span')
                .attr('class', 'text-center')
                .text('完成');

            var button5 = reportButtons.append('button').attr({
                'id': 'button5',
                'title': '取消',
            });
            button5.append('span')
                .attr('class', 'text-center')
                .text('取消');

            var topoRefresh = limiter.append('div')
                .attr('id', 'topoRefresh')
                .call(ui.topoRefresh);

            // 质检报表
            var reportform = content.append('div')
                .attr('id', 'reportform')
                .call(ui.reportform);

            // 质量标记报表
            var markupform = content.append('div')
                .attr('id', 'markupform')
                .call(ui.markupform)
            // .call(iD.ui.MarkupStatistics(context));

            content.append('div')
                .attr({
                    'class': 'markupform-control',
                    'title': '质量标记报表'
                })
                .call(function (selection) {
                    let button = selection.append('button')
                        .attr('tabindex', -1)
                        .on('click.user-control', function (d) {
                            let $taskid = iD.Task.taskId();
                            if (!$taskid) {
                                return;
                            }
                            let $markupDialog = d3.select('.markupDialog'),
                                $MarkupCtr = d3.select(this.parentNode),
                                $display = $markupDialog.style('display');
                            if ($display == 'none') {
                                iD.ui.markupDialog.open();
                                $MarkupCtr.style('display', 'none');
                            } else {
                                iD.ui.markupDialog.close();
                                $MarkupCtr.style('display', 'block');
                            }
                        });

                    button.append('span')
                        .text('□');
                });

            var effectform = content.append('div')
                .attr('id', 'effectform')
                .call(iD.ui.EffectForm(context));

            // 精度检查是否通过
            var accuracyButtons = limiter.append('div')
                .attr('class', 'KDSEditor-button-wrap joined accuracy-button')
                .call(ui.accuracyform);

            actionButtons.call(iD.ui.RoadCrossing(context));
            content.append('div')
                .attr('class', 'KDSEditor-spinner')
                .call(iD.ui.Spinner(context));

            //content
            //    .call(iD.ui.Attribution(context));

            content.append('div')
                .style('display', 'none')
                .attr('class', 'help-wrap map-overlay KDSEditor-fillL KDSEditor-col5 content');

            var controls = content.append('div')
                .attr('class', 'map-controls');

            controls.append('div')
                .attr('class', 'map-control zoomlevel-control')
                .attr('style', 'display:' + isNoneRight)
                .call(iD.ui.ZoomLevel(map));

            controls.append('div')
                .attr('class', 'map-control zoombuttons')
                .attr('style', 'display:' + isNoneRight)
                .call(iD.ui.Zoom(context));

            // 新增{拉框放大，鼠标多边形,鼠标测距}功能
            /* 2015/9/8  屏蔽该功能
            controls.append('div')
                .attr('class', 'map-control lasszoombuttons')
                .attr('style', 'display:' + isNoneRight2)
                .call(iD.ui.LassoZoom(context));
            */
            // controls
            rightTool.append('div')
                .attr('class', 'map-control geolocate-control')
                .attr('style', 'display:' + isNoneRight)
                .call(iD.ui.Geolocate(map, context));

            rightTool.append('div')
                .attr('class', 'map-control toolbarbuttons')
                .attr('style', 'display:' + isNoneRight2)
                .call(iD.ui.toolbar.Toolbar(context));

            rightTool.append('div')
                .attr('class', 'map-control roadfilter-control')
                .attr('style', 'display:' + isNoneRight)
                .call(iD.ui.RoadFilterControl(context));

            controls.append('div')
                .attr('class', 'map-control background-control')
                .attr('style', 'display:' + tilelayer)
                .call(iD.ui.Background(context));


            // 查看坐标位置的按钮
            rightTool.append('div')
                .attr('class', 'map-control nodesearch-control')
                .attr('style', 'display:' + isNoneRight)
                .call(iD.ui.NodeSearchControl(context));

            // 切换 要素编辑模式视图、属性编辑模式视图
            // rightTool.append('div')
            //     .attr('class', 'map-control editcheck-tag-control')
            //     .call(iD.ui.EditCheckTagControl(context));

            // 切换 要素编辑模式视图、属性编辑模式视图
            rightTool.append('div')
                .attr('class', 'map-control view-modechange-control')
                .call(iD.ui.ViewModeChange(context, content, picplayer, allWrap));

            // // 任务信息
            // rightTool.append('div')
            //     .attr('class', 'map-control view-modechange-control')
            //     .call(iD.ui.TaskInfoPolygon(context));

            // 精度质检标记
            rightTool.append('div')
                .attr('class', 'map-control add-autocheckwork')
                .call(iD.ui.AddAutoCheckWorkTag(context));

            // 自动组网标记
            rightTool.append('div')
                .attr('class', 'map-control add-autonetwork')
                .call(iD.ui.AddAutoNetWorkTag(context));

            // 参考线里程
            rightTool.append('div')
                .attr('class', 'map-control distance-rline')
                .call(iD.ui.DistanceRLine(context));

            // 查询设备信息
            rightTool.append('div')
                .attr('class', 'map-control device-info')
                .call(iD.ui.DeviceInfo(context));

            // // 设置任务中轨迹白名单
            // rightTool.append('div')
            //     .attr('class', 'map-control task-whitelist')
            //     .call(iD.ui.TaskWhiteList(context));

            rightTool.append('div')
                .attr('class', 'map-control switchingLayer')
                .call(iD.ui.orthographicSwitch(context));

            rightTool.append('div')
                .attr('class', 'map-control switchingLayer')
                .call(iD.ui.usePLY(context));

            rightTool.append('div')
                .attr('class', 'map-control switchingLayer')
                .call(iD.ui.useHeight(context));

            // potree加载PB
            // rightTool.append('div')
            //     .attr('class', 'map-control task-whitelist')
            //     .call(ui.LoadProtocol);

            // 退出按钮
            rightTool.append('div')
                .attr('class', 'map-control user-control')
                .call(function (selection) {
                    let button = selection.append('button')
                        .attr('tabindex', -1)
                        .attr('class', 'user-control-logout')
                        .on('click.user-control', function (d) {
                            iD.User && iD.User.logout(function () {
                                window.location.reload();
                            });
                        });

                    button.append('span')
                        .attr('class', 'text-center')
                        .text('退出');
                });

            // controls.append('div')
            //     .attr('class', 'map-control help-control')
            //     .call(iD.ui.Help(context));
            //     
            iD.svg.Pic.dataMgr.setContext(context);
            // iD.svg.orthographicMapMgr.setContext(context);


            context.ui().layermanager.on('roadEdit.ui', function (layeInfo, display) {
                if (!layeInfo || !layeInfo.type) {
                    return;
                }
                if (layeInfo.type == "auto_checkwork") {
                    rightTool.selectAll('.map-control.add-autocheckwork').classed('hide', !layeInfo.editable);
                }
                if (layeInfo.type == "auto_network") {
                    rightTool.selectAll('.map-control.add-autonetwork').classed('hide', !layeInfo.editable);
                }
            });
            // var $managerPane = container.select('.map-overlay');
            // $managerPane.call(context.ui().layermanager);

            // 初始化标定-控制点
            // if(iD.User.isTrackControlPointRole()){
            //     ui.taskList.enterSys9();
            // }

        });



        // limiter.append('div')
        //     .attr('class', 'KDSEditor-button-wrap joined col-road1')
        //     .call(iD.ui.ButtonGroup(context));



        //鹰眼
        var overview, isClose = false;
        context.overview_isBand = true;//触发先执行, 加此标识做延时判断, 有待完善
        function getBoundsByLocs(locs) {
            var minll = [Infinity, Infinity], maxll = [0, 0], loc;
            for (var i in locs) {
                loc = locs[i];
                if (minll[0] > loc[0]) minll[0] = loc[0];
                if (minll[1] > loc[1]) minll[1] = loc[1];

                if (maxll[0] < loc[0]) maxll[0] = loc[0];
                if (maxll[1] < loc[1]) maxll[1] = loc[1];
            }
            return [minll, maxll];
        }
        context.event.on('openoverview', function (opt) {
            if (overview) overview.remove(); overview = null;
            var ov = context.overview(context);
            ov.zoom(0);
            var extentC, _extent;
            if (opt.extent) {
                extentC = iD.geo.Extent(opt.extent).center();
            } else if (opt.locs) {
                _extent = getBoundsByLocs(opt.locs);
                extentC = iD.geo.Extent(_extent).center();
            } else return;
            ov.center(extentC);
            ov.init(opt, _extent);
            var style = opt.style || { width: 400, height: 350 }, delt = 7,
                dw = style.width - delt, dh = style.height - delt;
            overview = content.append('div')
                .attr('class', 'map-overview')
                .attr('style', function () {
                    var whstr = '';
                    if (style.width) whstr += ';width: ' + style.width + 'px;';
                    if (style.height) whstr += ';height: ' + style.height + 'px;';
                    return whstr;
                });
            var overviewmain = overview.append('div')
                .attr('class', 'map-overview-main')
                .attr('style', function () {
                    var whstr = '';
                    if (style.width) whstr += ';width: ' + dw + 'px;';
                    if (style.height) whstr += ';height: ' + dh + 'px;';
                    return whstr;
                })
                .call(ov);

            var overviewnode = overview.node(),
                overviewmainnode = overviewmain.node(),
                w = parseInt(iD.util.getStyleValue(overviewnode, 'width')),
                h = parseInt(iD.util.getStyleValue(overviewnode, 'height'));

            var __extent = opt.extent ? opt.extent : _extent,
                extentMinXY = context.overview_projection([__extent[0][0], __extent[1][1]]),
                extentMaxXY = context.overview_projection([__extent[1][0], __extent[0][1]]),
                extentW = extentMaxXY[0] - extentMinXY[0]; extentH = extentMaxXY[1] - extentMinXY[1];
            //移动矩形
            var x = 0, y = 0, dx = 0, dy = 0, l = 0, t = 0, nl = 0, nt = 0, draging = false;
            var vmW = extentW / 4, vmH = extentH / 6, locate_wh = 6;
            function setNodeLT(node, l, t) {
                node.style.left = (l + vmW / 2 - locate_wh) + 'px';
                node.style.top = (t + vmH / 2 - locate_wh) + 'px';
            }
            function locMvLTByMCenter() {
                var x = extentMinXY[0] - vmW / 2, y = extentMinXY[1] - vmH / 2;
                var cter = context.map().center();
                var cpixel = context.overview_projection(cter);
                var lt = [cpixel[0] - vmW / 2, cpixel[1] - vmH / 2],
                    rb = [cpixel[0] + vmW / 2, cpixel[1] + vmH / 2];

                if (cpixel[0] > extentMinXY[0] && cpixel[0] < extentMaxXY[0]) x = lt[0];
                if (cpixel[1] > extentMinXY[1] && cpixel[1] < extentMaxXY[1]) y = lt[1];
                if (cpixel[0] > extentMaxXY[0]) x = extentMaxXY[0] - vmW / 2;
                if (cpixel[1] > extentMaxXY[1]) y = extentMaxXY[1] - vmH / 2;
                return [x, y];
            }
            var x_y = locMvLTByMCenter();
            var viewMv = overviewmain.append('div')
                .attr('class', 'overview-viewMv')
                .attr('style', function () {
                    var str = '';
                    if (style.width) str += ';left: ' + x_y[0] + 'px;';
                    if (style.height) str += ';top: ' + x_y[1] + 'px;';
                    if (style.width) str += ';width: ' + vmW + 'px;';
                    if (style.height) str += ';height: ' + vmH + 'px;';
                    return str;
                })
                .on('mousedown', function () {
                    d3.event.stopPropagation();
                    x = d3.event.x || d3.event.clientX; y = d3.event.y || d3.event.clientY;
                    l = parseInt(iD.util.getStyleValue(this, 'left'));
                    t = parseInt(iD.util.getStyleValue(this, 'top'));
                    draging = true;
                })
                .on('mousemove.drag', function () {
                    if (!draging) return;
                    dx = (d3.event.x || d3.event.clientX) - x; dy = (d3.event.y || d3.event.clientY) - y;
                    nl = l + dx; nt = t + dy;
                    this.style.left = nl + 'px';
                    this.style.top = nt + 'px';

                    setNodeLT(locatenode, nl, nt);
                })
                .on('mouseup', function () {
                    if (!draging) return;
                    dx = (d3.event.x || d3.event.clientX) - x; dy = (d3.event.y || d3.event.clientY) - y,
                        nl = l + dx; nt = t + dy;

                    if (nl + vmW / 2 < extentMinXY[0]) nl = extentMinXY[0] - vmW / 2;
                    if (nt + vmH / 2 < extentMinXY[1]) nt = extentMinXY[1] - vmH / 2;
                    if ((nl + vmW / 2) > extentMaxXY[0]) nl = extentMaxXY[0] - vmW / 2;
                    if ((nt + vmH / 2) > extentMaxXY[1]) nt = extentMaxXY[1] - vmH / 2;

                    this.style.left = nl + 'px';
                    this.style.top = nt + 'px';

                    setNodeLT(locatenode, nl, nt);

                    draging = false;

                    var loc = context.overview_projection.invert([nl + vmW / 2, nt + vmH / 2]);
                    context.map().center(loc);
                });

            var viewMvnode = viewMv.node();
            context.event.on('moveoverview', function () {
                var xy = locMvLTByMCenter();

                viewMvnode.style.left = xy[0] + 'px';
                viewMvnode.style.top = xy[1] + 'px';

                setNodeLT(locatenode, xy[0], xy[1]);
            });

            var locate = overviewmain.append('div')
                .attr('class', 'overview-locate')
                .attr('style', function () {
                    var ltstr = '';
                    if (style.width) ltstr += ';left: ' + (x_y[0] + vmW / 2 - locate_wh) + 'px;';
                    if (style.height) ltstr += ';top: ' + (x_y[1] + vmH / 2 - locate_wh) + 'px;';
                    return ltstr;
                });
            var locatenode = locate.node();

            var btn = overview.append('div')
                .attr('class', 'map-overview-btn')
                .on('click', function () {
                    if (isClose) {
                        _open();
                        isClose = false;
                    } else {
                        _close();
                        isClose = true;
                    }
                });
            function _open() {
                var _w = style.width ? style.width : w, _h = style.height ? style.height : h;
                overviewnode.style.width = _w + 'px';
                overviewnode.style.height = _h + 'px';
                overviewmainnode.style.width = (_w - delt) + 'px';
                overviewmainnode.style.height = (_h - delt) + 'px';
                btn.attr('class', 'map-overview-btn');
            }
            function _close() {
                overviewnode.style.width = '14px';
                overviewnode.style.height = '14px';
                overviewmainnode.style.width = '14px';
                overviewmainnode.style.height = '14px';
                btn.attr('class', 'map-overview-btn-close');
            }
            function _open_close() {
                if (isClose) _close();
                else _open();
            }
            _open_close();

        });
        context.event.on('closeoverview', function () {
            if (overview) overview.remove(); overview = null;
        });

        //信息窗口
        var infowindow, infowindow_position, infowindow_size;
        context.infowindow_isBand = true;//触发先执行, 加此标识做延时判断, 有待完善
        function getLt(position, infowindow_size) {
            var lt = context.projection(position),
                offset_center_x = -10 + 30 / 2 - infowindow_size[0] / 2 - 2,
                offset_center_y = -10 * 2 - 23 - infowindow_size[1] - 4;
            lt[0] = lt[0] + offset_center_x;
            lt[1] = lt[1] + offset_center_y;
            return lt;
        }
        context.event.on('openinfowindow', function () {
            if (infowindow) infowindow.remove(); infowindow = null;
            infowindow_position = arguments[0][1];
            infowindow_size = arguments[0][0].size || [300, 100];
            var lt = getLt(infowindow_position, infowindow_size);
            infowindow = m.append('div')
                .attr('class', 'KDSEditor-info')
                .attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;')
                .call(ui.infowindow, arguments);
        });
        context.event.on('closeinfowindow', function () {
            if (infowindow) infowindow.remove(); infowindow = null;
            infowindow_position = null; infowindow_size = null;
        });
        context.event.on('moveinfowindow', function () {
            if (infowindow && infowindow_position) {
                var lt = getLt(infowindow_position, infowindow_size);
                infowindow.attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;');
            }
        });
        context.event.on('changeinfowindow', function (opt) {
            if (infowindow) {
                ui.infowindow.updateContent(opt).updateSize(opt);
                infowindow_size = opt.size || infowindow_size;
                var lt = getLt(infowindow_position, opt.size);
                infowindow.attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;');
            }
        });
        var footer = content.append('div')
            .attr('id', 'KDSEditor-footer')
            .attr('class', 'KDSEditor-fillD')

            .style('display', isNoneFooter)
            .style('z-index', '301');
        footer.append('div')
            .attr('id', 'scale-block')
            .call(iD.ui.Scale(context));

        window.onbeforeunload = function () {
            return context.save();
        };

        window.onunload = function () {
            context.history().unlock();
        };

        d3.select(window).on('resize.editor', function () {
            map.dimensions(m.dimensions());
        });

        function pan(d) {
            return function () {
                context.pan(d);
            };
        }

        // pan amount
        var pa = 5;

        var keybinding = d3.keybinding('main')
            .on('⌫', function () { d3.event.preventDefault(); });
        /*.on('←', pan([pa, 0]))
        .on('↑', pan([0, pa]))
        .on('→', pan([-pa, 0]))
        .on('↓', pan([0, -pa]));*/

        d3.select(document)
            .call(keybinding);

        context.enter(iD.modes.Browse(context));



        // var authenticating = iD.ui.Loading(context)
        // .message(t('loading_auth'));
        /*
        if (iD.User.getInfo().username) {
            iD.User.dispatch.login();
        }
       */
        // context.connection()
        //     .on('authenticating.ui', function() {
        //         context.container()
        //             .call(authenticating);
        //     })
        //     .on('authenticated.ui', function() {
        //         authenticating.close();
        //     });

        //增加footer 经纬度显示    
        var fmouse = iD.util.fastMouse(d3.select("#supersurface").node());
        var mouseMoveProjection = function (obj) {


            var mouseEvent = obj.event;
            var peojection = editor.pixelToLonlat(fmouse(mouseEvent));

            var dataObj = { "lan": peojection[0], "lat": peojection[1] };
            var dataArray = [dataObj];
            var geInfo = d3.select("#KDSEditor-footer").selectAll("#geoProjectionInfo").data(dataArray);
            var update = geInfo;
            var insert = geInfo.enter();

            update.text(function (d, i) { return getLoc(d) });
            insert.append("div").attr("id", "geoProjectionInfo").classed("geoProjection", true).text(function (d, i) { return getLoc(d) });
            geInfo.exit().remove();
        }
        // mouseMoveProjection = _.debounce(mouseMoveProjection, 300);

        function getLoc(d) {
            var str = "L=" + d.lan.toFixed(7) + "  B=" + d.lat.toFixed(7);
            if (context.selectedIDs().length == 1) {
                var node = context.hasEntity(context.selectedIDs()[0]);
                if (node && node.loc && node.loc[2] != null) {
                    str += '  H=' + node.loc[2];
                }
            }
            return str;
        }

        // d3.select("#supersurface").on("mousemove.projection",function(){


        //     mouseMoveProjection({"event":d3.event});
        // })
        d3.select("#supersurface").on("click.projection", function () {


            mouseMoveProjection({ "event": d3.event });
        })

    }



    function ui(container) {
        context.container(container);
        context.loadLocale(function () {
            render(container);
        });
    }
    ui.updateLayer = function (layer) {
        ui.layermanager.update && ui.layermanager.update(layer);
    }
    ui.taskList = iD.ui.TaskList(context);
    ui.sidebar = iD.ui.Sidebar(context);
    ui.reportform = iD.ui.ReportForm(context);
    ui.markupform = iD.ui.MarkupStatistics(context);
    ui.topoRefresh = iD.ui.topoRefresh(context);
    ui.accuracyform = iD.ui.AccuracyForm(context);
    ui.leftbar = iD.ui.LeftBar(context);
    // ui.navtab = iD.ui.NavTab(context);
    ui.layermanager = iD.ui.LayerManager(context);
    ui.effectform = iD.ui.EffectForm(context);

    //ui.panorama = iD.ui.Panorama(context);
    ui.infowindow = iD.ui.Infowindow(context);
    ui.openDialog = iD.ui.openDialog(context);
    // ui.LoadProtocol = iD.ui.LoadProtocol(context);

    return ui;
};

iD.ui.tooltipHtml = function (text, key) {
    return '<span>' + text + '</span>' + '<div class="keyhint-wrap">' + '<span> ' + (t('tooltip_keyhint')) + ' </span>' + '<span class="keyhint"> ' + key + '</span></div>';
};

iD.ui.dispEntity = function (context, datum) {

    var footer = d3.select("#KDSEditor-footer");
    var geoRoadInfo = d3.select("#geoRoadInfo");
    if (!geoRoadInfo.node()) geoRoadInfo = footer.append("div");
    geoRoadInfo.text("");


    if (!datum)
        return;
    if (!(datum.type == "way") || (datum.tags && (datum.modelName != iD.data.DataType.HIGHWAY && datum.modelName != iD.data.DataType.WALKLINK)))
        return;
    //var entity = datum;
    var len = datum.tags.length;
    var num = datum.nodes.length;
    var floatLen = parseFloat(len).toFixed(1);
    if (len != "")
        geoRoadInfo.attr("class", "geoProjection").attr("id", "geoRoadInfo").text("道路长度：" + parseFloat(len).toFixed(1) + "米  " + "形状点个数：" + num + "个");


};

iD.ui.dispMultiEntity = function (context, selectedIDs) {


    var footer = d3.select("#KDSEditor-footer");
    var geoRoadInfo = d3.select("#geoRoadInfo");
    if (!geoRoadInfo.node()) geoRoadInfo = footer.append("div");
    geoRoadInfo.text("");

    if (!selectedIDs.length) {
        return;
    }
    var datum = context.graph().entity(selectedIDs[0]);
    if (!datum)
        return;
    if (!(datum.type == "way") || (datum.tags && (datum.modelName != iD.data.DataType.HIGHWAY && datum.modelName != iD.data.DataType.WALKLINK)))
        return;

    var entities = [];
    var counts = 0,
        totalLength = 0;
    selectedIDs.forEach(function (selectedID) {
        var entity = context.graph().entity(selectedID);
        entities.push(entity);
        counts++;
        totalLength += parseFloat(entity.tags.length);
    })

    //console.log("道路条数:"+counts);
    //console.log("道路总长"+totalLength);

    geoRoadInfo.attr("class", "geoProjection").attr("id", "geoRoadInfo").text("道路长度：" + totalLength.toFixed(1) + "米  " + "道路条数：" + counts + "条");

}

iD.ui.toolbar = {};