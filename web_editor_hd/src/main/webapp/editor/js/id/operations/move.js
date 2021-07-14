iD.operations.Move = function(selectedIDs, context) {
    const selectModelName = [
        iD.data.DataType.TRAFFICSIGN,
        iD.data.DataType.TRAFFICLIGHT,
        iD.data.DataType.ROAD_FACILITIES,
        iD.data.DataType.OBJECT_PL,
        iD.data.DataType.OBJECT_PG,
        iD.data.DataType.DIVIDER,
        iD.data.DataType.BARRIER_GEOMETRY
    ];
    var selectEntitys = [];

    var extent = selectedIDs.reduce(function(extent, id) {
            return extent.extend(context.entity(id).extent(context.graph()));
        }, iD.geo.Extent());
    var  annotation = selectedIDs.length === 1 ?
        t('operations.move.annotation.' + context.geometry(selectedIDs[0])) :
        t('operations.move.annotation.multiple');

        function newEntitys() {
            let way, nodes, actions = [],entityIDs = [],_ids2NewNode ={},
                newWay;
            for (let i = 0; i < selectEntitys.length; i++) {
                way = selectEntitys[i];
                nodes = context.graph().childNodes(way);
                let newIds = [];
                let lay1 = iD.Layers.getLayer(way.layerId);
                nodes.forEach(node => {
                    let nodeId = _ids2NewNode[node.id];
                    if (!nodeId) {
                        let n = iD.Node({
                            layerId: node.layerId,
                            identifier: lay1.identifier,
                            modelName: node.modelName,
                            loc: _.clone(node.loc),
                            tags: nodes.tags
                        });
                        nodeId = n.id;
                        n.mergeTags(iD.util.tagExtend.updateTaskTag(n))
                        _ids2NewNode[node.id] = nodeId;
                        actions.push(iD.actions.AddEntity(n));
                    }
    
                    newIds.push(nodeId);
                })
                newWay = iD.Way({
                    modelName: way.modelName,
                    layerId: way.layerId,
                    identifier: lay1.identifier,
                    nodes: newIds,
                    tags: way.tags
                });
                entityIDs.push(newWay.id);
                newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
                actions.push(iD.actions.AddEntity(newWay));
            }
            context.perform.apply(this, actions);
            return entityIDs;
        }        
    var operation = function() {
        let ids = newEntitys();
        context.enter(iD.modes.Move(context, ids));
    };

    operation.available = function() {
        selectEntitys = [];
        if (!(iD.Task.working && iD.Task.working.task_id == iD.Task.d.task_id)) return false;
       
        if(selectedIDs.length<2) return false;
        var entity;
        for (let i = 0; i < selectedIDs.length; i++) {
            entity = context.entity(selectedIDs[i]);
            if (!iD.Layers.getLayer(entity.layerId, entity.modelName).editable) return false;
            if (selectModelName.includes(entity.modelName)){
                selectEntitys.push(entity);
            }
        }



        return selectEntitys.length > 1
        //    context.entity(selectedIDs[0]).type !== 'node' ||
        //    (context.entity(selectedIDs[0]).type === 'node' && selectedIDs.length === 1&&!entity.isRoadCross());//单点选中


        return true;
    };

    operation.disabled = function() {
        var reason;
//        if (extent.area() && extent.percentContainedIn(context.extent()) < 0.8) {
//            reason = 'too_large';
//        }
        return iD.actions.Move(selectedIDs).disabled(context.graph()) || reason;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.move.' + disable) :
            annotation;
            //t('operations.move.description');
    };

    operation.id = 'move';
    operation.keys = [t('operations.move.key')];
    operation.title = t('operations.move.title');

    return operation;
};




iD.overoperations.Move = function(selected, context) {

    var operation = function() {
       context.enter(iD.modes.NewMove(context, selected));
    };

    operation.available = function() {
        if(selected instanceof iD.Marker || !selected.editable)
            return false;
        return   (selected.vertices == 'm') ? false : true;
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.move.' + disable) :
            t('operations.move.description');
    };

    operation.id = 'move';
    operation.keys = [t('operations.move.key')];
    operation.title = t('operations.move.title');

    return operation;
};

