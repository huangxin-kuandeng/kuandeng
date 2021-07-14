iD.trackControlPointHandle = function(context){
    var LOADED_TRACK = {};
    var LAST_TRACK_ID;
    // 保存
    context.event.on('sys9_save.track_control_point', function(){
        saveMarkPointDatas();
    });

    // 查询控制点
    context.event.on('sys9_enter.track_control_point', function(){
        window._TRACK_CONTRL_RECORED_ = [];
        LOADED_TRACK = {};

        // 20190604 控制点改为图层加载
        // loadControlDatas(function(entities){
        //     mergeEntities(entities);
        // });
    });
    
    // 视频渲染轨迹-查询标记点
    context.event.on('picplayer_render.track_control_point', function(player){
        if(!iD.User.isTrackControlPointRole()) return ;
        var track = player.wayInfo;
        var trackId = track.trackId;
        if(LAST_TRACK_ID == trackId) return ;
        if(LOADED_TRACK[trackId]) return ;
        LAST_TRACK_ID = trackId;

        loadMarkPoints(track, function(datas){
            parseMarkPoints(player, datas);
            LOADED_TRACK[trackId] = true;
        });
    });

    function parseMarkPoints(player, datas){
        var nodes = [];
        datas.forEach(function(d){
            var loc;
            var p = d.mapping[0] && d.mapping[0].pixel;
            var trackNode = _.find(player.wayInfo.nodes, {
                id: d.trackPointId
            });
            if(!trackNode || !p || !p.x || !p.y) return ;
            var xy = player.transformPoint([p.x, p.y]);
            var lonlat = iD.picUtil.pixelToLngLat(xy, trackNode);
            loc = [lonlat.lng, lonlat.lat, lonlat.elevation];
            if(!loc) return ;

            var node = iD.Node({
                _type: iD.data.DataType.PLACENAME,
                tags: {
                    colortype: 2,
                    query_load: true
                },
                loc: loc,
                _record: d
            });
            nodes.push(node);
        });
        if(nodes.length){
            mergeEntities(nodes);
            player.resetCanvas();
        }
    }

    function loadMarkPoints(track, callback){
        var krs = iD.config.URL.krs;
        d3.json(krs + 'calParam/query?' + iD.util.parseParam2String({
            trackIds: track.trackId,
            deviceId: track.deviceId
        })).get(function(error, data) {
            var result = data && data.result && data.result[track.trackId] || [];
            callback && callback(result);
        });
    }

    function mergeEntities(entities){
        var history = context.history();
        history.merge(entities, null, null, true);
    }
    
    function loadControlDatas(callback){
        d3.text('./track_control_points.txt', null, function(msg){
            var datas = msg.split('\n');
            var entities = [];
            datas.forEach(function(str, i){
                var loc = str.split(/,|，/);
                if(loc.length < 3){
                    return ;
                }
                var tmp = loc[0];
                loc[0] = loc[1];
                loc[1] = tmp;
                var node = new iD.Node({
                    loc: [+loc[0], +loc[1], +loc[2]],
                    _type: iD.data.DataType.SEARCH_POINT,
                    tags: {
                        name_chn: '控制点',
                        colortype: loc[3] || 1,
                        index: i + 1
                    },
                });
                entities.push(node);
            });
            
            if(entities.length){
                callback && callback(entities);
            }
        });
    }
    
    function saveMarkPointDatas(){
        var bodyParam = [];
        var entities = context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]))
            .filter(function(entity){
                if(entity._type == iD.data.DataType.PLACENAME
                    && entity._record
                    && !entity.tags.query_load){
                    bodyParam.push(entity._record);
                    return true;
                }
                return false;
            });

        var krs = iD.config.URL.krs;
        d3.json(krs + 'calParam/save')
            .header("Content-Type", "application/json;charset=UTF-8")
            .post(JSON.stringify(bodyParam), function(error, data) {
                if (error || !data || data.code != '0') {
                    Dialog.alert('标定信息保存失败');
                    return;
                }
                Dialog.alert('标定信息保存完成');
                entities.forEach(function(d){
                    d.tags.query_load = true;
                });

                // context.flush();
                var player = iD.picUtil.player;
                if(player){
                    player.clearMark();
                    player.resetCanvas();
                }
            });
    }
    
    function getMarkDatas(){
        var markDatas = editor.context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity])).filter(function(d){
          return d.isPlaceName && d.isPlaceName() && d._record;
        }).map(function(d){ return d._record; });
        return markDatas;
    };

    function getTrackDatas(){
        var markDatas = getMarkDatas();
        var trackDatas = _.uniq(_.pluck(markDatas, 'trackId')).map(function(tid){
            var track = _.clone(iD.svg.Pic.dataMgr.getTrack(tid));
            delete track.nodes;
            return track;
          });
        return trackDatas;
    }
    function getTrackPointDatas(){
        var markDatas = getMarkDatas();
        var trackPointDatas = _.uniq(_.pluck(markDatas, 'trackPointId')).map(function(id){
          var n = iD.svg.Pic.dataMgr.pointId2Node(id);
          var node = _.clone(n);
          node.tags = _.clone(n.tags);
          delete node.tags.picUrl;
          return node;
        });
        return trackPointDatas;
    }

    iD.trackControlPointHandle.logMarkDatas = function(){
        console.log(JSON.stringify(getMarkDatas()));
    }

    iD.trackControlPointHandle.logTrackDatas = function(){
        console.log(JSON.stringify(getTrackDatas()));
    }

    // 原始xyz、rpa，重新计算RTC
    iD.trackControlPointHandle.logTrackPointDatas = function(){
        var trackPoints  = getTrackPointDatas();
        var group = _.groupBy(trackPoints, function(d){
            return d.tags.trackId;
        });
        _.each(group, function(nodes, trackId){
            var firstNode = iD.picUtil.player.dataMgr.getTrack(trackId).nodes[0];
            nodes.forEach(function(node){
                var param = {
                    x: node.tags.x,
                    y: node.tags.y,
                    z: node.tags.z,
                    roll: node.tags.roll,
                    pitch: node.tags.pitch,
                    azimuth: node.tags.azimuth
                };
                var obj = iD.util.pos2CameraRTC(param, firstNode.tags, param.z);
                node.tags.R = obj.R;
                node.tags.C = obj.C;
                node.tags.T = obj.T;
            });
        });
        console.log(JSON.stringify(trackPoints));
    }
}