/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-10-13 10:23:45
 * @Description: 
 */
iD.operations.operationMeasureinfoLocation = function(selectedIDs, context) {
    var graph = context.graph(),
        entity = context.entity(selectedIDs[0]),
        relations = graph.parentRelations(entity, iD.data.DataType.MEASUREINFO) || [];

    var operation = function() {
        var measureinfo = relations[0],
            PARAMETER = JSON.parse(measureinfo.tags.PARAMETER),
            targetTrackId = PARAMETER.Paras.nodes[0].trackId,
            targetTrackPointId = PARAMETER.Paras.nodes[0].trackPointId,
            taracks = iD.picUtil.player.dataMgr.tracks,
            track = _.find(taracks, {trackId: targetTrackId});
        if(!track){
            return ;
        }
        var trackPointIndex = _.findIndex(track.nodes, {id: targetTrackPointId});
        console.log("目标轨迹：", track.trackId);
        console.log("目标轨迹点：", track.nodes[trackPointIndex].id);
		iD.logger.editElement({
            'tag' : "menu_measureinfo_location"
        });			//点击定位量测信息操作时增加埋点
        iD.picUtil.player.switchPlayerTrackId(track.trackId);
        d3.select('.footer-progress-range').value(parseInt(trackPointIndex)).trigger('change');
        context.buriedStatistics().merge(1,entity.modelName,1000);
    };

    operation.available = function() {
        if(!iD.picUtil.player) return false;
        let dataType = iD.data.DataType;
        let modelFlag = [dataType.DIVIDER_NODE,dataType.PAVEMENT_DISTRESS_NODE,dataType.PAVEMENT_DISTRESS_PL_NODE].includes(entity.modelName)
        let flag = (relations.length && modelFlag && selectedIDs.length == 1) ;
        return (relations.length && flag && selectedIDs.length == 1) > 0 ? true : false;
    };

    operation.disabled = function() {
    	return false;
    };

    operation.tooltip = function() {
        return t('operations.measureinfo_location.description');
    };

    operation.id = 'measureinfoLocation';
    operation.keys = [iD.ui.cmd('V')];
    operation.title = t('operations.measureinfo_location.title');

    return operation;
};
