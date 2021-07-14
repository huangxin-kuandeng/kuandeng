/**
 * 添加自动组网标记点
 * @param {Object} context
 */
iD.modes.AddAutoNetWorkTag = function(context) {
	
    var mode = {
        id: 'add-auto-netkwork',
        button: 'point-auto-netkwork',
        title:'',// t('modes.add_point.title'),
        description: t('operations.autoNetWorkTag.description'),
        key: 'Ctrl+8'
    };
    
    var MAX_RANGE = 20;

    var behavior = iD.behavior.Draw(context, false)
        .tail(t('operations.autoNetWorkTag.tail'))
        .on('click', add)
        .on('clickWay', add)
        .on('clickNode', add)
        .on('cancel', cancel)
        .on('finish', cancel);
    
    function add(loc, node) {
        var trackNode = getNearestTrackPoint();
        if(!trackNode) return ;
        loadAutoTaskId(trackNode.tags.trackId, function(autoTaskid){
            // load adcode
            var opts = {
                tags: {
                    FUSIONTASKID: iD.Task.d.tags.multiTrackLaneTaskId,
                    AUTOTASKID: autoTaskid,
                    TRACKID: trackNode.tags.trackId,
                    TRACKPOINTID: trackNode.id,
                    STATE: '1'
                }
            };
            var action = iD.actions.AddAutoNetWorkTag(trackNode.loc, opts);
            context.perform(action,
                t('operations.autoNetWorkTag.title'));
            context.enter(iD.modes.Browse(context));
        });
    }
    
    function cancel() {
        context.enter(iD.modes.Browse(context));
    }
    
    function loadAutoTaskId(trackid, callback){
        var nowTaskid = iD.Task.d && iD.Task.d.task_id;
        if(!nowTaskid) return ;
        
        // var url =  iD.config.URL.kts + 'task/' + nowTaskid + '/data/chain/auto';
        var url = iD.config.URL.kts + 'task/findTopology?&bussCode=auto&taskId=' + nowTaskid;
        d3.json(url)
            .get(function(err, data){
                var autoTaskid = '';
            	if (err || !data || !data.result) {
                    Dialog.alert("未查询到自动化任务！");
                    //return;
                } else {
                    let info = _.filter(data.result || [], function(d){
                        return _.filter(d.tags || [], function(tinfo){
                            return tinfo.k == 'trackIds' && tinfo.v.indexOf(trackid) > -1;
                        }).length > 0;
                    })[0];

                    autoTaskid = (info && info.id) || '';
                }
            	
            	callback && callback(autoTaskid);
            });
    }

    function getNearestTrackPoint(){
        var trackList = iD.svg.Pic.dataMgr.tracks || [];
        var allNodes = _.compact(_.flatten(_.pluck(trackList, 'nodes')));
        if(!allNodes.length) return ;
        var rst = iD.svg.Pic.dataMgr.pic.getNearestNode(allNodes, context.map().mouseCoordinates());
        var trackNode = rst.node;
        // 像素单位，轨迹点大概8像素
        if(!trackNode || rst.dist > 12){
            return ;
        }
        return trackNode;
    }

    function loadTrackPoint(callback){
        var picPlayer = iD.picUtil.player;
        var dataMgr = iD.svg.Pic.dataMgr;
        if(!picPlayer || !dataMgr || !dataMgr.trackIds.length) {
            // Dialog.alert("没有轨迹列表");
            callback();
            return ;
        }
        var fusionTaskId = iD.Task.d.tags.fusionTaskId;
        var posParam = iD.Task.getPosParam();
        var offsetCal = fusionTaskId && posParam.offsetCal || false;
        var loc = editor.context.map().mouseCoordinates();
        var kieVersion = iD.Task.d.tags.kieVersion;
        d3.json(iD.config.URL.krs + 'v3/track/get/near/byxy?' + iD.util.parseParam2String({
            xy: loc.join(','),
            r: 2,
            showDeviceInfo: false,
            offsetCal: offsetCal,
            kieVersion: kieVersion,
            trackIds: dataMgr.trackIds.join(','),
            showPoint: false,
            fusionTaskId: fusionTaskId
        })).get(function(error, data){
            if(error || !data || data.code != '0' || !data.result){
                // Dialog.alert('点击位置没有查询到轨迹点');
                callback();
                return ;
            }
            let obj = data.result;
            let info = obj.nearestTrackPointInfo;
            let node = {
                id: info.trackPointId,
                tags: info,
                loc: [info.x, info.y, info.z]
            }
            if(!node.tags.trackId){
                node.tags.trackId = obj.track.trackId;
            }
            callback(node)
        });
    }

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};