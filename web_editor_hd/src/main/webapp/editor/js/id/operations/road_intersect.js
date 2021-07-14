iD.operations.RoadIntersect = function(selectedIDs, context) {
    var lnglat;
    
    var operation = function(){
		var action = iD.actions.RoadIntersect(selectedIDs, context, lnglat), annotation = t('operations.intersect.annotation.road');
	 	context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
        context.event.entityedite({entitys: []});
	};

	operation.available = function() {
	    if(iD.Task.definedLinearWork() || iD.User.isWorkRole()) return false;
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;

        if (selectedIDs.length < 2) return false;     //支持多条道路修相交打断
        let layer = iD.Layers.getLayer(context.entity(selectedIDs[0]).layerId);

        if(layer && !layer.isRoad()) return false
        //有相同的首尾结点之一的道路不能相交打断
        var hasSameNode = function (wayA, wayB) {
            var hasSameNode = false;
            var wayA_fNode = wayA.nodes[0];
            var wayA_tNode = wayA.nodes[wayA.nodes.length - 1];
            var wayB_fNode = wayB.nodes[0];
            var wayB_tNode = wayB.nodes[wayB.nodes.length - 1];
            if (wayA_fNode == wayB_fNode || wayA_fNode == wayB_tNode || wayA_tNode == wayB_fNode || wayA_tNode == wayB_tNode){
                hasSameNode = true;
                return hasSameNode;
            }
            return hasSameNode;
        }

        var isAvailable = function(selectedIDs){
            var isAvailable = false;
            for (var i = 0; i < selectedIDs.length; i++) {
                for (var j = i + 1; j < selectedIDs.length; j++) {
                    var wayA = context.graph().entity(selectedIDs[i]);
                    var wayB = context.graph().entity(selectedIDs[j]);
                    if(!hasSameNode(wayA,wayB)){
                        isAvailable = true;
                    }
                }
            }

            return isAvailable;
        }

        var isEditable = function(selectedIDs){
            for (var i = 0; i < selectedIDs.length; i++) {
                var entity = context.graph().entity(selectedIDs[i]);
                var editable = iD.Layers.getLayer(entity.layerId, entity.modelName).editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
                if(editable) return true;
            }
            return false;
        }

        // var entity = context.entity(selectedIDs[0]);
        //var editable = iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
		lnglat = context.map().mouseCoordinates();
		// var layer = context.layers().getCurrentEnableLayer(), graph = context.graph();
		//if (layer && !layer.isRoad() || selectedIDs.length !== 2) return false;

        var legal = true;
		selectedIDs.forEach(function (id) {
			!(context.entity(id).modelName == iD.data.DataType.DIVIDER) && (legal = false);
//			!(context.entity(id).geometry(graph) === 'line') && (legal = false);
		});
		return isEditable(selectedIDs)&&legal&&isAvailable(selectedIDs) && !operation.disabled();
	};

    operation.disabled = function() {
//      return !this.available();
        return false;
    };

    operation.tooltip = function() {
        return t('operations.intersect.description.road');
    };

    operation.id = 'intersect-road';
    operation.keys = [t('operations.intersect.key')];
    operation.title = t('operations.intersect.title');

    return operation;
} 