iD.ui.TagEditorTpl.RoadNode = function() {
    return {
        title: '路口属性编辑',
        fieldsGroup: [{
            title: '基本信息',
            fields: [
            {
                fieldName: 'NAME_CHN'
            },
            {
                fieldName: 'TOLLGATE',
                fieldRender: 'check'
            },/* {
                fieldName: 'gate_info',
                onRender: function(selection, opts) {

                    selection.classed('KDSEditor-inspector-hidden', opts.tags.tollgate === '0')
                }
            }, {
                fieldName: 'gate_lane',
                onRender: function(selection, opts) {

                    selection.classed('KDSEditor-inspector-hidden', opts.tags.tollgate === '0')
                }
            }*/]
        }, /*{
            title: '交通信息',
            fields: [{
                fieldName: 'signlight',
                fieldRender: 'check'
            }]
        }*/
        ],
        onValidate: function(d, fieldOpts, $editor, uiField, opts){
        	return d;
        }
    };
};