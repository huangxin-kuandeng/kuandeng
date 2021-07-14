/*
 * @Author: tao.w
 * @Date: 2019-10-14 11:21:15
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-27 19:52:39
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 默认按钮列表，无绘制操作
iD.svg.PicDraw.defaultButtonList = function (context, drawTool) {
    const constant = drawTool.getConstant();
    var player = drawTool.getPlayer();
    var playerFooter = player.getPlayerFooter();
    var drawStatus = {};

    // 图片类型的select values
    const picParams = [
        { value: 0, name: "原始" },
        // { value: 1, name: "车道线" },
        { value: 3, name: "路面要素" },
        { value: 4, name: "病害识别" },
        // { value: 5, name: "杆状物、路牌" },
        // { value: 6, name: "车道线、杆状物、路牌" },
        { value: 7, name: "全要素" }
    ];

    function drawPlus() { }
    _.assign(drawPlus.prototype, {
        init: function (arg1) {
            drawStatus = arg1;
        },
        getId: function () {
            return 'default';
        },
        renderBtn: function (selection) {
            if (!player.isSubPlayer) {
                renderButtons(selection);
            } else {
                renderButtonsSubPlayer(selection);
            }

            selection.selectAll('input[type=checkbox]')
                .attr('tabindex', -1)
                .on('focus.pic_player', function () { this.blur(); });
        }
    });

    function renderButtonsSubPlayer(selection) {
        renderTrackList(selection);
    }

    function renderButtons(selection) {
        // 不走通用逻辑的按钮，clearFooter时也会使用__active判断
        var exceptClearClass = 'except_action';
        // 打开测量面板时保留的按钮
        var epilineClass = 'epliline_tool_btn';
        // 无用的按钮，通过右侧工具按钮空值显示/隐藏
        var uselessClass = 'footer_useless_btn';
        var sys9Remove = 'sys9-remove';

        //          selection.append('button')
        //              .attr('type','button')
        //              .text('平移线')
        //              .data([constant.MOVE_LINE]);
        var objectPGLabel = selection.append("label")
            .attr('class', sys9Remove);

        objectPGLabel.append("input")
            .attr("class", "objectPGTxt")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                if (this.checked) {
                    context.variable.checkObjectPGTXT = true;
                } else {
                    context.variable.checkObjectPGTXT = false;
                }
                player.resetCanvas();
            }).property('checked', context.variable.checkObjectPGTXT);
        objectPGLabel.append("span")
            .html("文字");

        var seElement = selection.append("select")
            .attr('class', epilineClass)
            .attr("style", "width: 98px;")
            .on("change", function (e) {
                this.blur && this.blur();
                var e = d3.event;
                playerFooter.event.imagetype_change(e, this);
                if (player._show_maskrcnn) {
                    player.loadMaskrcnn2Canvas();
                }
            });
        
        let _picParams = _.clone(picParams);
        if (iD.Task.d.tags.branchDataType != '3') {
            _picParams = _picParams.filter(d=>{
                return d.value != 4;
            })
        }

        var options = seElement.selectAll("option").data(_picParams);
        options.enter().append("option").text(function (d, i) {
            return d.name;
        }).value(function (d, i) {
            return d.value;
        });
        seElement.value(player.getPicUrlParam().type);

        selection.append("select")
            .attr('id', "_sublist")
            .attr("style", "width: 98px;")
            .on("change", function (e) {
                this.blur && this.blur();
                var e = d3.event;
                playerFooter.event.imagebatch_change(e, this);
            });

        selection.append('button')
            .attr('id', '_newest_batch')
            .attr('class', exceptClearClass + ' ' + epilineClass + ' ' + uselessClass)
            .attr('type', 'button')
            .text('最新批次');

        selection.append("select")
            .attr("class", "pic-current-trackid ")
            .attr("style", "height: 100%;padding: 0px 2px;font-size: 14px;margin-right: 6px;background: #FFFFFF;")
            .on("change", function (e) {
                this.blur && this.blur();
                var e = d3.event;
                playerFooter.event.track_change(e, this);
            });

        var maskRecog = selection.append("label");

        let maskInput =  maskRecog.append("input")
            .attr("class", "playerMaskRecog")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                if (this.checked) {
                    player.showMaskrcnn()
                } else {
                    player.hideMaskrcnn();
                }
            }).property('checked', player && player._show_maskrcnn);
        maskRecog.append("span")
            .html("识别");
        
        // var depthContainer = selection.append("span");    
        // let depthInput = depthContainer.append("input")
        //     .attr("class", "playerDepth")
        //     .attr("type", "checkbox")
        //     .style("float", "inherit");
        //     depthInput.on("click", function () {
        //         if (this.checked) {
        //             player.showDepth()
        //         } else {
        //             player.hideDepth();
        //         }
        //     }).property('checked', player && player._show_depth);
       
        //     depthContainer.append("span")
        //     .html("深度");

        if (iD.Task.d.tags.dbCode == 'fusion') {
            selection.append('button')
                .attr('type', 'button')
                .text('跳自动化')
                .on('click', toAutoPage);
        }

        var linkagePcloud = selection.append("span");
        linkagePcloud.append("input")
            .attr("class", "playerLinkagePcloud")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                if (this.checked) {
                    player._linkage_pcloud = true;
                } else {
                    player._linkage_pcloud = false;
                }
            }).property('checked', player && player._linkage_pcloud);
        linkagePcloud.append("span")
            .html("点云联动");

        selection.append('button')
            .attr('class', uselessClass)
            .attr('type', 'button')
            .text('虚线模式');
        selection.append('button')
            .attr('class', epilineClass + ' ' + uselessClass)
            .attr('type', 'button')
            .text('清除');
        selection.append('button')
            .attr('class', uselessClass)
            .attr('type', 'button')
            .text('三维');
        selection.append('button')
            .attr('class', uselessClass)
            .attr('type', 'button')
            .text('点云');

        var hideDivider = selection.append("label");
        hideDivider.append("input")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                player.zrenderDividerVisibleChange(this.checked);
            }).property('checked', player && player.zrenderDividerVisible);
        hideDivider.append("span")
            .html("车道线");
        
        var hideObjectPL = selection.append("label");
        hideObjectPL.append("input")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                player.zrenderObjectPLVisibleChange(this.checked);
            }).property('checked', player && player.zrenderObjectPLVisible);
            hideObjectPL.append("span")
            .html("定位线");

        var hideTrack = selection.append("label");
        hideTrack.append("input")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                player.zrenderTrackVisibleChange(this.checked);
            }).property('checked', player && player.zrenderTrackVisible);
        hideTrack.append("span")
            .html("轨迹");

        var hidePotree = selection.append("label");
        hidePotree.append("input")
            .attr("type", "checkbox")
            .style("float", "inherit")
            .on("click", function () {
                player.potreeVisibleChange(this.checked);
            }).property('checked', player && player.potreeVisible);
        hidePotree.append("span")
            .html("激光");

        var hideFeature = selection.append("label");
            hideFeature.append("input")
                .attr("type", "checkbox")
                .style("float", "inherit")
                .on("click", function () {
                    context.variable.renderFilter = this.checked;
                    // mgrEvent.loaded();
                    player.resetCanvas();
                    if (context.potreePlayer && context.potreePlayer.potree) {
                        context.potreePlayer.potree.entityTOpotree(context.potreePlayer.context, context.potreePlayer.viewer)
                    }
                }).property('checked', true);
            hideFeature.append("span")
                .html("隐藏对向要素");

        // if(iD.User.authQueryTag()){
        //     selection.append('button')
        //         .attr('class', uselessClass)
        //         .attr('type','button')
        //         .text('标记');
        //     selection.append('button')
        //         .attr('class', uselessClass)
        //         .attr('type','button')
        //         .text('标记轨迹点')
        //         .on('click.pic-player', player.markTrackPointRequest);
        // }

        if (iD.User.isTrackControlPointRole()) {
            selection.selectAll('.' + sys9Remove).remove();
        }
    }


    function renderTrackList(selection) {
        selection.append("select")
            .attr("class", "pic-current-trackid ")
            .on("change", function (e) {
                this.blur && this.blur();
                var e = d3.event;
                playerFooter.event.track_change(e, this);
            });
    }

    function toAutoPage() {
        var url = window.location.href;
        if (window.location.hash) {
            url = url.replace(window.location.hash, '')
        }
        if (window.location.search) {
            url = url.replace(window.location.search, '')
        }
        var newWin = window.open('about:blank', '_blank');
        var trackId = player.wayInfo.trackId;
        var trackPointId = player.pic_point.id;
        var autoUrl = iD.config.URL.kts + 'task/findTopology?&bussCode=auto&taskId=' + iD.Task.d.task_id;
        d3.json(autoUrl).get(function (err, data) {
            var notFond = "未查询到自动化任务";
            if (err || !data || !data.result) {
                Dialog.alert(notFond);
                return;
            }
            let taskObj = data.result.filter(function (d) {
                return d.tags.filter(function (tag) {
                    console.log(tag.k == 'trackIds' && (tag.v || '').split(',').includes(trackId), d);
                    return tag.k == 'trackIds' && (tag.v || '').split(',').includes(trackId);
                })[0];
            })[0];
            if (!taskObj) {
                Dialog.alert(notFond);
                return;
            }
            var taskId = taskObj.tags.filter(function (tag) {
                return tag.k == 'taskId';
            })[0];
            taskId = taskId && taskId.v;
            if (!taskId) {
                Dialog.alert(notFond);
                return;
            }
            newWin.location.href = url + '?history=true&taskID=' + taskId
                + '&trackIds=' + trackId + '&trackPointId=' + trackPointId;
        });
    }

    return new drawPlus();
}
