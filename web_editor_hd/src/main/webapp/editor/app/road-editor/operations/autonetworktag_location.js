iD.operations.operationAutoNetWorkTagLocation = function(selectedIDs, context) {
    var entity = context.entity(selectedIDs[0])

    var operation = function() {
        var trackId = entity.tags.TRACKID,
        trackPointId = entity.tags.TRACKPOINTID,
        taracks = iD.picUtil.player.dataMgr.tracks,
        track = _.find(taracks, {trackId: trackId}),
        trackPointIndex = _.findIndex(track.nodes, {id: trackPointId});
        console.log("目标轨迹：", track.trackId);
        console.log("目标轨迹点：", track.nodes[trackPointIndex].id);
        iD.picUtil.player.switchPlayerTrackId(track.trackId);
        d3.select('.footer-progress-range').value(parseInt(trackPointIndex)).trigger('change');
    };

    operation.available = function() {
        if(!iD.picUtil.player) return false;
        return (entity.modelName == iD.data.DataType.AUTO_NETWORK_TAG && selectedIDs.length == 1) > 0 ? true : false;
    };

    operation.disabled = function() {
    	return false;
    };

    operation.tooltip = function() {
        return t('operations.autonetworktag_location.description');
    };

    operation.id = 'autonetworktagLocation';
    operation.keys = [iD.ui.cmd('AL')];
    operation.title = t('operations.autonetworktag_location.title');

    return operation;
};
