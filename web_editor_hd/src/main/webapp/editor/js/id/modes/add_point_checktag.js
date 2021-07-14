/**
 * 添加质检的标记点
 * @param {Object} context
 */
iD.modes.AddPointCheckTag = function(context) {
	if(!iD.User.isEditCheckSystemAndRole()){
		return false;
    }
    var tagModelName = iD.data.DataType.QUALITY_TAG;
    var mode = {
        id: 'add-point-checktag',
        button: 'point-checktag',
        title:'',// t('modes.add_point.title'),
        description: t('operations.checkTag.description'),
        key: 'Alt+5'
    };

    var behavior = iD.behavior.Draw(context, false)
        .tail(t('operations.checkTag.tail'))
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc, fromId) {
//  	var currLayer = context.layers().getCurrentEnableLayer();
    	var layer =  iD.Layers.getCurrentModelEnableLayer(tagModelName);
        var layerid =  layer.id;
        var mergeTags = {
            CREATE_BY: iD.User.getInfo().username,
			CHECK_STEP: iD.Task.d.protoData.taskDefinitionKey,
			CHECK_PROCESS: iD.Task.d.tags.processDefinitionKey,
            PROJECT_ID: iD.Task.d.tags.projectId || ''
        };
        if(iD.User.isCheckRole()){
            mergeTags.TAG_SOURCE = '1';
        }else if(iD.User.isVerifyRole()){
            mergeTags.TAG_SOURCE = '2';
        }else if(iD.User.isQualityAssessorRole()){
            mergeTags.TAG_SOURCE = '3';
        }
        if(fromId){
            mergeTags.FEATURE_ID = iD.Entity.id.toOSM(fromId);
        }

        var modelEntity = iD.ModelEntitys[tagModelName];
        if(!modelEntity) return;
        if(fromId){
            var entity = context.entity(fromId);
            var fields = modelEntity.getFields(modelEntity.getGeoType()) || [];
            var MODEL, FEATURE;
            for(let f of fields){
                if(f.fieldName == 'MODEL'){
                    MODEL = f;
                }else if(f.fieldName == 'FEATURE'){
                    FEATURE = f;
                }
                if(MODEL && FEATURE) break;
            }
            if(MODEL && FEATURE){
                // 查MODEL
                var v = _.find(FEATURE.fieldInput && FEATURE.fieldInput.values || [], {value: entity.modelName});
                var pv;
                if(v && v.parentId){
                    pv = _.find(MODEL.fieldInput && MODEL.fieldInput.values || [], {id: v.parentId});
                }
                if(pv && pv.value){
                    mergeTags.MODEL = pv.value;
                    mergeTags.FEATURE = v.value;
                }
            }
        }else {
            mergeTags.MODEL = 'LANE';
        }
        
        var node = iD.Node({
			layerId : layerid,
            loc : loc,
            identifier:layer.identifier,
			modelName: tagModelName,
			tags: _.extend({}, iD.util.getDefauteTags(tagModelName, layer), mergeTags)
		});
		iD.util.tagExtend.updateTaskTag(node);

        context.perform(
            iD.actions.AddEntity(node),
            t('operations.checkTag.title'));
        iD.logger.editElement({
            'tag': "add_check_tag",
            'modelName': tagModelName
        });
        
        iD.ui.openCheckTagDialog(context, node.id);
        
        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));
        // add node envent
        // context.event.add({'type' : node.type, 'entity' : node});
        context.event.entityedite && context.event.entityedite({entitys: [node.id]});
        context.buriedStatistics().merge(0,iD.data.DataType.CHECK_TAG);
//      if (currLayer.continues) context.enter(iD.modes.AddPoint(context));
    }

    function addWay(loc, sideIds, way) {
        var nodes = sideIds.map(function(id){return context.entity(id);})
        loc = iD.util.getBetweenPointLoc(nodes[0].loc, nodes[1].loc, loc);
        add(loc, way.id);
    }

    function addNode(node) {
        add(node.loc, node.id);
    }

    function cancel() {
        context.enter(iD.modes.Browse(context));
    }
    
    mode.enter = function() {
        context.buriedStatistics().merge(1,iD.data.DataType.CHECK_TAG);
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
};
