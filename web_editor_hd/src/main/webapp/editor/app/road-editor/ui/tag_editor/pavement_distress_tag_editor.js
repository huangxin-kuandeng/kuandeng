iD.ui.TagEditor.PavementDistressTagEditor = function(context) {

    var dispatch = d3.dispatch('change');

    function tagEditor(selection, opts) {
		
        var tpl = iD.ui.TagEditorTpl.PavementDistress(),
            tags = opts.tags,
            entityID = opts.id,
            entity = context.entity(entityID),
            currentLayer = iD.Layers.getLayer(entity.layerId),
            modelEntity = iD.ModelEntitys[entity.modelName],
            geoType = modelEntity.getGeoType();

        var fields = modelEntity.getFields(geoType);
        tpl.fieldsGroup[0].fields = iD.ui.TagEditor.createTplFieldList(modelEntity);
        
        var fieldHash = {};
        for (var i = 0, len = fields.length; i < len; i++) {
        	var fieldObj = fields[i];
			
			// fieldHash[fieldObj.fieldName] = fieldObj;
            fieldHash[fieldObj.fieldName] = selectFieldOpts(fieldObj, fields, tags);
        }

        context.container().select('.KDSEditor-inspector-wrap  .KDSEditor-header h3').text(tpl.title);

        iD.ui.TagEditor.renderFieldGroups(selection, tpl, {
            layer: currentLayer,
            dispatch: dispatch,
            context: context,
            entity: entity,
            tags: tags,
            fields: fieldHash
        });
 
    }


	/* 生成新的对象--提供下拉选择项 */
    function selectFieldOpts(opts, fields, tags) {
		let newFieldOpts = _.cloneDeep(opts),
			fieldInput = newFieldOpts.fieldInput,
			filedValues = (fieldInput && fieldInput.values) ? fieldInput.values : null,
			parentId = (filedValues && filedValues[0].parentId) ? filedValues[0].parentId : false;
		if(parentId){
			/* 获取parentId所在的父级关系 */
			let fieldName = null;
			let fieldIndex = null;
			_(fields).each( (d, i)=>{
				if(d.fieldInput && d.fieldInput.values && !fieldName){
					d.fieldInput.values.forEach(function(w){
						if(w.id == parentId){
							fieldIndex = i;
							fieldName = d.fieldName;
							return false;
						}
					});
				}
			} );
			
			let fieldValue = tags[fieldName] || null;
			if(fieldValue){
				let newParentValue = fields[fieldIndex].fieldInput.values.filter(function(e){
					return e.value == fieldValue;
				});
				let dataValue = filedValues.filter(function(e){
					return e.parentId == newParentValue[0].id;
				});
				newFieldOpts.fieldInput.values = dataValue;
			}else{
				newFieldOpts.fieldInput.values = [];
			}
			
		}
		return newFieldOpts;
    }

    tagEditor.available = function(entity) {
        return  [iD.data.DataType.PAVEMENT_DISTRESS_PL].includes(entity.modelName);
    }

    return d3.rebind(tagEditor, dispatch, 'on');
};