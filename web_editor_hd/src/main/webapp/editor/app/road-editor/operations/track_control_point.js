/**
 * 关联标定控制点与控制点关联菜单
 */
iD.operations.trackControlPoint = function(selectedIDs, context) {
	var control, //控制点
			trackControl,//标定控制点
			player = iD.picUtil.player;

	function recordData(point, shape){
		if(!shape) return ;
		var p = player.reductionPoint([point.shape.cx, point.shape.cy]);
		var pixel = {
			x: p[0],
			y: p[1]
		};
		var node = context.hasEntity(shape._entityid);
		var pos = {
			longitude: node.loc[0],
			latitude: node.loc[1],
			height: node.loc[2]
		};
		
		var deviceId = player.wayInfo.deviceId;
		var trackId = player.wayInfo.trackId;
		var trackPointId = player.pic_point.id;
		
		var result = {
			deviceId,
			trackId,
			trackPointId,
			mapping: [{
				pixel,
				pos
			}]
		};
		
		var pointNode = context.hasEntity(point._entityid);
		if(pointNode){
            pointNode._record = result;
            pointNode._light_entityids = [node.id];
		}
		
		_TRACK_CONTRL_RECORED_.push(result);
	}

	function getShape(id){
		var shapeList = player._zrender.storage._roots || [];
		for(var shape of shapeList){
            if(!shape._entityid) continue;
            if(shape._entityid == id) {
				return shape;
			} else {
				continue;
			}
            
        }
	}

	var operation = function() {
        recordData(getShape(trackControl.id), getShape(control.id));

		var graph = context.graph();

		graph= graph.replace(trackControl);

		context.perform(iD.actions.Noop(), '');
		context.enter(iD.modes.Browse(context));
	}
	
	operation.available = function(){
		if(selectedIDs.length != 2) return false;
		
		var graph = context.graph();
		var entity1 = context.entity(selectedIDs[0]);
		var entity2 = context.entity(selectedIDs[1]);
		
		if (entity1._type == "SearchPoint") {
			control = entity1;
		} else if (entity1._type == "PlaceName") {
			trackControl = entity1;
		}
		if (entity2._type == "PlaceName") {
			trackControl = entity2;
		} else if (entity2._type == "SearchPoint") {
			control = entity2;
		}
		
		return !operation.disabled() && control && trackControl;
	}
	
	operation.disabled = function() {
		if(!control && !trackControl) {
			return true;
		}
		return false;
	}
	operation.tooltip = function() {
		return t('operations.trackControlPoint.description');
	}
	operation.id = 'merge';
	operation.keys = ['C'];
	operation.title = t('operations.trackControlPoint.description');
	return operation;
}