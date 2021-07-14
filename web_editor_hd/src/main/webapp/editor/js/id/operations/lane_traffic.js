iD.operations.LaneTraffic = function(selectionIDs, context) {
    var selectId = selectionIDs[0];
    var wayModelName = iD.data.DataType.HD_LANE;
    // var wayModelName = iD.data.DataType.DIVIDER;

    var _this = {};
    _this.disable = false; //控制当前按钮是否可用

    var operation = function() {

        context.transportation.set(selectId);

        context.enter(iD.modes.Select(context, selectionIDs));
    };


    operation.available = function() {
        if (!(iD.Task.working && iD.Task.working.task_id == iD.Task.d.task_id)) return false;
        var entity = context.entity(selectId);
        if (entity.modelName != wayModelName) return false;
        var editable;
        var layer;
        var geometry = context.geometry(selectId);

        var editable = d3.select("body").attr("role") == "check" || iD.Layers.getLayer(entity.layerId, entity.modelName).editable;
        if (selectionIDs.length != 1) {
            return false;
        }
        layer = iD.Layers.getLayer(entity.layerId);
        if (!layer || !editable) {
            return false;
        }

        return geometry == "line" && !operation.disabled();
    };

    operation.disabled = function() {
        return _this.disable;
    };

    operation.tooltip = function() {
        return t('operations.lane_traffic.description');
    };

    operation.id = 'traffic';
    operation.keys = [t('operations.lane_traffic.key')];
    operation.title = t('operations.lane_traffic.title');

    return operation;
}