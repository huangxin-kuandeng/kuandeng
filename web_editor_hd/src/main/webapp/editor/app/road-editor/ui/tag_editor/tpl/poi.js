iD.ui.TagEditorTpl.Poi = function() {
    return {
        title: 'poi属性编辑',
        fieldsGroup: [{
            title: '基本信息',
            fields: [{
                fieldName: 'DIRECTION',
                fieldRender: 'select'
            }]
        }],
        onValidate: function(d, fieldOpts, $editor, uiField, opts){
        	return d;
        }
    };
};