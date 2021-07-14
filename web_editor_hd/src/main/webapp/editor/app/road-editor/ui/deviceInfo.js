/**
 * 显示当前轨迹设备信息
 * @param {Object} context
 */
iD.ui.DeviceInfo = function(context) {
    var btnDatas = [{
        id: 'btn-device-info',
        title: '设备信息',
        action: function(){
            show();
        }
    }];

    function show(){
        var player = iD.picUtil.player;
        if(!iD.Task.d || !player || !player.dataMgr) return ;
        var deviceId = player.wayInfo.deviceId;
        player.dataMgr.getDeviceInfo(deviceId).then(function(data){
            if(!data) {
                Dialog.alert(deviceId + ' 设备信息查询失败');
                return ;
            }
            Dialog.alert([
                '<table class="table table-condensed" style="text-align: left;">',
                '<tr><td>trackId</td><td>' + player.wayInfo.trackId + '</td></tr>',
                '<tr><td>deviceId</td><td>' + deviceId + '</td></tr>',
                '<tr><td>deviceName</td><td>' + (data.name || '') + '</td></tr>',
                '<tr><td>deviceCode</td><td>' + (data.code || '') + '</td></tr>',
                '</table>'
            ].join(''));
        });

    }

    return function(selection) {
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { return d.id; })
            .on('click.uizoom', function(d) { 
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .title(function(d) {
                    return d.title;
                }));

        button.append('span')
            .attr('class', 'text-fill')
            .text(function(d) { 
                var str = d.title;
                for(var key in d.style){
                    this.style[key] = d.style[key];
                }
                return str.substring(0, d.titleNum || 4);
            });
    };
};