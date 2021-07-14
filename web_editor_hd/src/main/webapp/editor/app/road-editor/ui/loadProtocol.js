/**
 * 绘制多边形，任务信息
 * @param {Object} context
 */
iD.ui.LoadProtocol = function(context) {
    //	var clipboard = null, clipboard2 = null;
    var dispatch = d3.dispatch('loaded');
    var loadXhr = null;
    var loading = iD.ui.Loading(context).message("PB加载中 ...").blocking(true);
    var elementId = 'load_protocol_div';
    let LidarRoadGrids;
    protobuf.load('./svg/pb/lidar_road_grid.proto', function(error, root) {
        if (error) {
            Dialog.alert('lidar_road_grid.proto 加载失败');
            return;
        }
        LidarRoadGrids = root.lookupType('kd.mapping.proto.LidarRoadGrids');
    });

    var buttonDatas = [{
        id: 'load-protocol',
        title: '加载PB',
        action: function(button) {
            if (!LidarRoadGrids) return;
            var rect = button.node().getBoundingClientRect();
            showDialog({
                top: rect.top + 'px',
                left: 'auto',
                // right: window.outerWidth - rect.left + 'px'
                right: '48px'
            });
        }
    }];

    function showDialog(pos) {
        var div = d3.select('#' + elementId);
        if(!div.size()){
            div = context.container().append('div').attr('id', elementId).attr('class', 'common-dialog');
        }
        div.html('');
        div.classed('hide', false);
        var $shade = div.append('div').attr('class', 'loading hide');
        $shade.append('div').attr('class', 'content').text('加载中...');
        _.each(pos, function(v, k){
            div.style(k, v);
        });
        div.append('div').attr('class', 'title').text('加载Protocol Buffers');
        div.append('div').attr('class', 'title-close').on('click', function(){
            div.classed('hide', true);
        });
        var body = div.append('div').attr('class', 'body');
        var input = body.append('textarea')
            .property('cols', 5)
            .property('name', 'url');
        input.value('./svg/pb/lidar_ground_output.pb');
        // body.append('button').attr('class', 'button gray').text('取消');
        body.append('button').attr('class', 'button blue').text('加载').on('click', function(){
            let url = input.value();
            if(!url) return ;
            url = url.trim();
            $shade.classed('hide', false);

            loadPBFile(url, function(byteArray){
                $shade.classed('hide', true);
                byteArray2Potree(byteArray);
            }, function(){
                $shade.classed('hide', true);
                Dialog.alert('加载失败');
            });
        });
    }

    function loadPBFile(url, fun, errFun) {
        if(loadXhr) loadXhr.abort();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.withCredentials = true
        xhr.responseType = "arraybuffer";
        xhr.onload = function(evt) {
            var arrayBuffer = xhr.response;
            var byteArray;
            if (arrayBuffer) {
                byteArray = new Uint8Array(arrayBuffer);
            } else {
                byteArray = new Uint8Array()
            }
            fun && fun(byteArray);
        }
        xhr.onerror = function(evt) {
            errFun && errFun(evt);
        }
        xhr.send(null);
        loadXhr = xhr;
    }

    function byteArray2Potree(byteArray){
        var grids = LidarRoadGrids.decode(byteArray);
        dispatch.loaded(grids);
    }

    function showLoading() {
        context.container().call(loading);
    }

    function hideLoading() {
        loading.close();
    }

    function render(selection) {
        var button = selection.selectAll('button')
            .data(buttonDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) {
                return d.id;
            })
            .on('click', function(d) {
                d.action(button);
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(false)
                .title(function(d) {
                    //                  return iD.ui.tooltipHtml(d.title, d.key);
                    return d.title;
                }));

        button.append('span')
            .attr('class', 'text-fill')
            .text(function(d) {
                var str = d.title;
                for (var key in d.style) {
                    this.style[key] = d.style[key];
                }
                return str.substring(0, d.titleNum || 4);
            });
    };


    return d3.rebind(render, dispatch, 'on');
};