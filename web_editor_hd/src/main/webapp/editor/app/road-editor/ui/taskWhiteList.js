/**
 * 设置任务中轨迹白名单
 * @param {Object} context
 */
iD.ui.TaskWhiteList = function(context) {
    var singleDialog = null,countIds;
    var btnDatas = [{
        id: 'btn-task-whitelist',
        title: '设白名单',
        action: function(){
            showDialog();
        }
    }];

    var paggingParam = {
        pageNum: 1,
        pageSize: 10,
        pageTotal: 1,
        total: 0
    };
    // 临时轨迹信息，提交成功后才会刷到context.variable中
    var trackWhiteList = {};

    function showDialog(){
        if(!iD.Task.d) return ;
        var tracks = iD.svg.Pic.dataMgr.tracks,
        trackIds = _.map(tracks, "trackId");
        // trackIds.push("226_20180623055716019","126_20180623055716019","326_20180623055716019","426_20180623055716019","526_20180623055716019","626_20180623055716019")
        // trackIds = _.map(context.variable.testDatas, "trackId");
        paggingParam.total = trackIds.length;
        paggingParam.pageTotal = Math.ceil(paggingParam.total / paggingParam.pageSize);
        countIds = [];
        var arr = [], flag = paggingParam.pageSize;
        for (let i = 0; i < trackIds.length; i++) {
            if (i == trackIds.length - 1) {
                arr.push(trackIds[i]);
                countIds.push(arr);
            } else if (i == flag) {
                countIds.push(arr);
                arr = [];
                arr.push(trackIds[i]);
                flag += paggingParam.pageSize;
            } else{
                arr.push(trackIds[i])
            }
        }
        trackWhiteList = _.clone(context.variable.trackWhiteListStatus);

        singleDialog = Dialog.open({
            Title: iD.Task.d.task_id + ' 所有轨迹展示',
            InnerHtml: '<div><div id="trackwhite_dialog_html" class="taskinfo_dialog_html taskinfo_dialog_context"></div><div id="taskinfo_dialog_page"></div></div>',
            Width: 280,
            Height: 650,
            Modal: false,
            CancelEvent: function(){
                singleDialog.close();
                singleDialog = null;
            }
        });
        renderPaggingBtn(d3.select("#taskinfo_dialog_page"));

        setContent(paggingParam.pageNum - 1);
    }

    function setContent(index) {
        var content = '',
        $container = d3.select('#_Container_' + singleDialog.ID);
        $container
            .style('width', '100%');

        var $taskinfoDialogHtml = $container.select('#trackwhite_dialog_html')
            .style({
                "text-align": "left",
                "font-size": "14px",
                "padding": "14px 10px"
            })
        $taskinfoDialogHtml.html("");

        for(let i of countIds[index]){
            let d = i;
            if(!d) continue;
            // let name = d.name;
            let infos = d;
            var $row = $taskinfoDialogHtml.append("div")
                .attr("class", "row")
                .style({
                    "cursor": "pointer",
                    "height": "32px"
                })

            var $titleSpan = $row.append("input")
                .attr("type", "checkbox")
                .attr("name", "track")
                .attr("value", d)
                .style({
                    "width": "20px",
                    "height": "20px"
                })
                .on("change", function () {
                    trackWhiteList[this.value] = this.checked;
                });
            $titleSpan.property("checked", trackWhiteList[d]);

            var $content = $row.append('div')
                .style({
                    "position": "relative",
                    "left": "41px",
                    "top": "-23px",
                    "width": "230px"
                })
                .append("span")
                .attr("class", "line")
                .on("click", function(){
                    let checkbox = d3.select(this.parentNode.parentNode).select('input[name=track]').node();
                    if(checkbox && iD.picUtil.player){
                        iD.picUtil.player.switchPlayerTrackId(checkbox.value);
                    }
                })
                .html(d);
        }
    }

    function renderPaggingBtn($buttons){
        // isPagging
        var $prev, $home, $next, $total;
        $total = d3.select($buttons.node().parentNode).append('div')
            .attr('class', 'filter-total-count hide');

        $prev = $buttons.append('button')
            .attr('class', 'btn btn-default')
            .text('上一页')
            .on('click', function() {
                if(paggingParam.pageNum <= 1){
                    paggingParam.pageNum = 1;
                }else {
                    paggingParam.pageNum --;
                }
                // 清空记录的旧数据，重新搜索
                // triggerSearchBtn();
                updatePaggingBtn();
            });

        $home = $buttons.append('button')
            .attr('class', 'btn btn-default page_home')
            .text('首页')
            .on('click', function() {
                paggingParam.pageNum = 1;
                // 清空记录的旧数据，重新搜索
                // triggerSearchBtn();
                updatePaggingBtn();
            });

        $next = $buttons.append('button')
            .attr('class', 'btn btn-default')
            .text('下一页')
            .on('click', function() {
                if(paggingParam.pageNum >= paggingParam.pageTotal){
                    paggingParam.pageNum = paggingParam.pageTotal;
                }else {
                    paggingParam.pageNum ++;
                }
                // 清空记录的旧数据，重新搜索
                // triggerSearchBtn();
                updatePaggingBtn();
            });
        $next = $buttons.append('button')
            .attr('class', 'btn btn-default submit')
            .style({
                "background-color": "#337ab7",
                "border-color": "#337ab7",
                "color": "#fff"
            })
            .text('提交')
            .on('click', function() {
                var whiteTracks = [];
                for (let i in trackWhiteList){
                    if (trackWhiteList[i]){
                        whiteTracks.push(i);
                    }
                }
                let d = {
                    "taskId": iD.Task.d.task_id,
                    "trackIds": whiteTracks
                }
                //http://192.168.2.105:33300/kts/task/writeTaskWhiteList
                //application/json; charset=utf-8
                d3.json(iD.config.URL.kts+'task/writeTaskWhiteList')
                    .header("Content-Type", "application/json; charset=utf-8")
                    .post(JSON.stringify(d), function(error, data) {
                        if(error || !data || data.code != '0'){
                            Dialog.alert('更新轨迹白名单失败！' + (data && data.message ? '<br/>' + data.message: ''));
                            return;
                        }
                        Dialog.alert('更新轨迹白名单成功！');
                        context.variable.trackWhiteListStatus = _.clone(trackWhiteList);
                        if(iD.picUtil.player){
                            iD.picUtil.player.dataMgr.pic.redrawTracks();
                        }
                    });
            });

        updatePaggingBtn = function(total){
            if(!isNaN(total)){
                paggingParam.total = total;
            }
            // var totalCount = paggingParam.total;
            // paggingParam.pageTotal = Math.round(totalCount / paggingParam.pageSize);
            // paggingParam.pageTotal = parseInt((totalCount + paggingParam.pageSize - 1) / paggingParam.pageSize);

            // if(oldFilterResultData){
                $home.text('首页 (' + paggingParam.pageNum + '/' + paggingParam.pageTotal + ')');
                $total.classed('hide', false).text('总条数: ' + paggingParam.total);
            // }else {
            //     $home.text('首页');
            //     $total.classed('hide', true).text('');
            // }
            setContent(paggingParam.pageNum - 1);
        }

        updatePaggingBtn();
    }


    return function(selection) {
        // if(iD.User.isPrecisionRole()) {
            var button = selection.selectAll('button')
                .data(btnDatas)
                .enter().append('button')
                .attr('tabindex', -1)
                .attr('class', function (d) {
                    return d.id;
                })
                .on('click.uizoom', function (d) {
                    d.action();
                })
                .call(bootstrap.tooltip()
                    .placement('left')
                    .title(function (d) {
                        return d.title;
                    }));

            button.append('span')
                .attr('class', 'text-fill')
                .text(function (d) {
                    var str = d.title;
                    for (var key in d.style) {
                        this.style[key] = d.style[key];
                    }
                    return str.substring(0, d.titleNum || 4);
                });

            // getTrackWhiteListStatus();
        // }
    };
};