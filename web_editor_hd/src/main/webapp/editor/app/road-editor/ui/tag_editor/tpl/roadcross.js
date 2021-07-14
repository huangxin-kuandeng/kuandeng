iD.ui.TagEditorTpl.RoadCross = function() {
    return {
        title: '综合交叉点属性编辑',
        fieldsGroup: [{
            title: '基本信息',
            fields: [{
                fieldName: 'name_chn'
            },{
                fieldName: 'spell'
            }]
        }
        /*
        , {
            title: '交通信息',
            fields: [{
//              fieldName: 'signlight',
                fieldName: 'SIGNLIGHT',
                fieldRender: 'check'
            },{
                fieldName: 'railway'
            }]
        }
        */
        ],
        onValidate: function(d, fieldOpts, $editor, uiField, opts){
        	return d;
        }
    };
};