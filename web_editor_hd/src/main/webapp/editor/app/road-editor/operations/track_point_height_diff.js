/**
 * 显示轨迹点与两个前方交会点相交的车高的差值
 */
iD.operations.trackPointHeightDiff = function(selectedIDs, context) {
	var COPY_PASTE_KEY = 'map_editor_copy_board_plane';
	//	let selectedLamp = [];
	var entities = [];

	var operation = function() {
		let nodes = iD.picUtil.player.wayInfo.nodes || [];
		let crossLoc = iD.util.getSegmentIntersectNodesLoc(entities, nodes)[0];
		if(!crossLoc || !crossLoc.length){
			Dialog.alert(t('operations.track_point_height_diff.noCross'));
			return ;
		}
		let edge = iD.geo.chooseEdge(nodes, context.projection(crossLoc), context.projection);
		if(!edge || isNaN(edge.index)){
			Dialog.alert(t('operations.track_point_height_diff.noCross'));
			return ;
		}
		
		nodes[edge.index - 1].loc
		let intersectionLoc = iD.util.getBetweenPointLoc(entities[0].loc, entities[1].loc, crossLoc);
		let trackLoc = iD.util.getBetweenPointLoc(nodes[edge.index - 1].loc, nodes[edge.index].loc, crossLoc);
		
		let diffZ = trackLoc[2] - intersectionLoc[2];
		Dialog.alert('相交位置轨迹与前方交会点高程差值：' + diffZ);
	}
	
	operation.available = function(){
		if(window._systemType != 8) return false;
		if(selectedIDs.length != 2) return false;
		if(!iD.picUtil.player || !iD.picUtil.player.wayInfo){
			return false;
		}
		selectedIDs.forEach(function(sid){
			let et = context.entity(sid);
			if(et && et.isPlaceName && et.isPlaceName()){
				entities.push(et);
			}
		});
		if(entities.length != 2){
			return false;
		}
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		return false;
	}
	operation.tooltip = function() {
		return t('operations.track_point_height_diff.description');
	}
	operation.id = 'split';
	operation.keys = ['none'];
	operation.title = t('operations.track_point_height_diff.title');
	return operation;
}