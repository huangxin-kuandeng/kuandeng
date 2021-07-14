/*
 * @Author: tao.w
 * @Date: 2020-03-24 16:17:07
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-08 14:46:00
 * @Description:  图像正射图切层  凑合实现
 */

iD.ui.orthographicSwitch = function (context) {
    var singleDialog = null;
    var btnDatas = [{
        id: 'btn-orthographic-switch',
        title: '道路切换',
        action: function () {
            context.enter(iD.modes.Browse(context));
        }
    }];
    let isActive = false;
    let clickTimeId;

    // var paggingParam = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     pageTotal: 1,
    //     total: 0
    // };


    function showDialog(loc) {
        if (!iD.Task.d) return;
        var tracks = iD.svg.Pic.dataMgr.tracks;
        let trackNodes = iD.util.getBoundsTracks(loc, tracks, 5);
 
        singleDialog = Dialog.open({
            Title: '范围内轨迹，请选择',
            InnerHtml: '<div><div id="trackwhite_dialog_html" class="trackwhite_dialog_html taskinfo_dialog_context"></div></div>',
            Width: 280,
            Height: 650,
            Modal: false,
            CancelEvent: function () {
                singleDialog.close();
                context.event.track_highlight({trackId:''})
                singleDialog = null;
            }
        });
        setContent(trackNodes);
    }

    function setContent(trackNodes) {
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
        $taskinfoDialogHtml.html("");
        let $row =  $taskinfoDialogHtml.selectAll('div')
            .data(trackNodes)
            .enter()
            .append("div")
            .attr("class", "row")
            .text(d=>{
                return d.tags.trackId
            })
            .on('mouseover',function(){
                let datum = d3.select(this).datum();
                context.event.track_highlight({trackId:datum.tags.trackId})
            })
            .on('click',function(e){
                let datum = d3.select(this).datum();
                context.event.track_highlight({trackId:''})
                let oMap = context.background().getOverlayLayers('orthographicMap').source().data();
                let laserVerticalView = context.background().getOverlayLayers('groundMesh').source().data();
                let aboveGroundMap = context.background().getOverlayLayers('aboveGroundMap').source().data();
                let tracks = iD.svg.Pic.dataMgr.tracks;
                let track = tracks.find(t=>{ return t.trackId == datum.tags.trackId})
                context.measuringTrack = track;
                oMap.height =  datum.loc[2].toFixed(1);
                laserVerticalView.height =  datum.loc[2].toFixed(1);
                aboveGroundMap.height =  datum.loc[2].toFixed(1);
                context.background().layerUpdate('orthographicMap');
                context.background().layerUpdate('groundMesh');
                context.background().layerUpdate('aboveGroundMap');
                singleDialog.close();
                singleDialog = null;
            })

    }


    function initEvent(surface) {

        surface.on('mousedown.orthographic', function (d) {
            var lastMousePos = [d3.event.offsetX, d3.event.offsetY];
            var lastMouseTarget = d3.event.target;
            if (!isActive) return;
            // if(lastMouseTarget == this){
            //     // trackContext && trackContext.mousedown(d3.event);
            // }
            surface.on('mouseup.orthographic', function (d) {
                // if(lastMouseTarget == this){
                //     // trackContext && trackContext.mouseup(d3.event);
                // }

                var upPos = [d3.event.offsetX, d3.event.offsetY]
                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {
                    var targetEvent = d3.event;
                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }
                    clickTimeId = setTimeout(function () {
                        clickTimeId = null;
                        var oldEvent = d3.event;
                        d3.event = targetEvent;
                        if(singleDialog){
                            singleDialog.close();
                            singleDialog = null;
                        }
                        var loc = editor.context.map().mouseCoordinates();
                        showDialog(loc);
                        buttonActive(false);

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }
                lastMousePos = null;
                lastMouseTarget = null;
                surface.on('mouseup.orthographic', null);
            });
        })
    }

    function buttonActive(_active) {
        let $button = d3.select('.btn-orthographic-switch');
        $button.classed('active', _active);
        isActive = _active;
    }
    return function (selection) {
        initEvent(context.surface())
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function (d) {
                return d.id;
            })
            .on('click.uizoom', function (d) {
                let $button = d3.select(this);
                isActive = !$button.classed('active');
                $button.classed('active', isActive);
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
    };
};