iD.ui.TagEditorTpl.RoadAttribute = function () {
    function isObjectEmpty(obj) {
        if (typeof obj === "object" && !(obj instanceof Array)) {
            var hasProp = false;
            for (var prop in obj) {
                hasProp = true;
                break;
            }
            return hasProp;
        }
        return false;
    }
    function adjustTags(d, fieldOpts, $editor, uiField, opts) {
        if (!isObjectEmpty(d)) {
            return firstAdjustTags(d, fieldOpts, $editor, uiField, opts);
        } else {
            return normalAdjustTags(d, fieldOpts, $editor, uiField, opts);
        }
    }
    
    //第一次初始化
    function firstAdjustTags(d, fieldOpts, $editor, uiField, opts) {
    	
        return d;
    }


    //修改属性
    function normalAdjustTags(d, fieldOpts, $editor, uiField, opts) {
        var tags = _.extend({}, fieldOpts.context.entity(fieldOpts.entity.id).tags, d),
            errorMsgs = [],
            warningMsgs = [];

        //自动从半角转全角
        function SBC(text) {
            return text.replace(/[\x20-\x7e]/g, function ($0) {
                return $0 == " " ? "\u3000" : String.fromCharCode($0.charCodeAt(0) + 0xfee0);
            });
        }

        //全角转半角
        function dbc2sbc(str) {
            return str.replace(/[\uff01-\uff5e]/g, function (a) {
                return String.fromCharCode(a.charCodeAt(0) - 65248);
            }).replace(/\u3000/g, " ");
        }

        //判断字符串是否为空格
        function strInvalid(str) {
            var dst = str.replace(/(^\s*)|(\s*$)/g, "");
            if (dst == 'undefined' || dst == '' || !dst) {
                return true;
            }
            return false;
        }

        if (opts.multiRoadTagFlag) {
            opts.isMultiRoadTag++;
            if (opts.isMultiRoadTag > 1) { //批量赋值
                return d;
            }
        }

        if (errorMsgs.length > 0) {
            $editor.call(iD.ui.TagEditor.toastr, errorMsgs.join('<br/>'), {
                className: 'error'
            });
        }
        if (warningMsgs.length > 0) {
            $editor.call(iD.ui.TagEditor.toastr, warningMsgs.join('<br/>'), {
                className: 'warning'
            });
        }
        // opts.fromValidate = true;
        return firstAdjustTags(d, fieldOpts, $editor, uiField, opts);
    }

    return {
        title: '道路属性变化点',
//      onChange: firstAdjustTags,
        onValidate: adjustTags,
        onInitValidate: false,//初始化时触发验证开关
        fieldsGroup: [{
            title: '基本信息',
            fields: []
            // fields: [{
            //     fieldName: 'TYPE',
            //     // 级联下拉列表
            //     fieldRender: 'selectgroup',
            //     fieldLabel: '属性类型',
            //     // 级联组
            //     fieldLinkGroup: ['VALUE']
            // }]
        }]
    };
}
;