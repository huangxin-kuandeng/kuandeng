iD.ui.TagEditorTpl.DividerAttribute = function () {
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
	    function isUpdateTag(fieldName, value){
			return d[fieldName] == value && opts.tags[fieldName] != value;
		}
    	/*
    	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_ATTRIBUTE);
    	function uiFieldDisable(fieldName, bool){
    		let readonly = opts.fields[fieldName] && opts.fields[fieldName].readOnly == '1';
    		let uiInput = iD.ui.TagEditor.findUiField(opts, fieldName);
    		bool = readonly || bool;
    		if(!currentLayer || !currentLayer.editable){
    			uiInput.disable(true);
    		}else if(readonly && uiInput.readOnly){
    			uiInput.readOnly(readonly);
    		}else if(uiInput.disable) {
    			uiInput.disable(bool);
    		}
    	}
    	*/
    	
        var tags = _.extend({}, fieldOpts.context.entity(fieldOpts.entity.id).tags, d);
        // 只有当人工虚拟分隔线时，分隔线类型显示19之后的取值；
        // if(d.VIRTUAL != undefined){
		// 	var uiInput = iD.ui.TagEditor.findUiField(opts, 'TYPE');
	    //     uiInput && uiInput.refreshOption && uiInput.refreshOption(d);
        // }
        
        // if(d.VIRTUAL == "0" && d.TYPE == null){
        // 	// 非虚拟分隔线，根据分隔线类型设置默认字段
    	// 	d.TYPE = tags.TYPE;
        // }

//      if(d.VIRTUAL == "1" || d.VIRTUAL == "2" || d.VIRTUAL == "3"){
        // if(isUpdateTag("VIRTUAL", "1") || isUpdateTag("VIRTUAL", "2") || isUpdateTag("VIRTUAL", "3")){
        // 	// 路口虚拟分隔线
        // 	// 缺失虚拟分隔线
        // 	// 人工虚拟分隔线
        // 	// 分隔线颜色
        // 	d.COLOR = "0";
        // 	// 分隔线类型
        // 	d.TYPE = "0";
        // 	// 通行类型
        // 	d.DRIVE_RULE = "0";
        // 	// 分隔线材质
        // 	d.MATERIAL = "0";
        // 	// 分隔线宽度
        // 	d.WIDTH = "0";
        // }
        
        // if(d.TYPE != null && tags.VIRTUAL == "0"){
        // 	// 非虚拟分隔线、分隔线类型更改
        // 	if(d.TYPE == "1"){
        // 		// 行车道边缘线
        // 		d.COLOR = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "2"; // 20cm
        // 		d.DRIVE_RULE = "1";
        // 	}else if(d.TYPE == "2" || d.TYPE == "3"){
        // 		// 白虚线，白实线
        // 		d.COLOR = "1"; // 白色
        // 		d.MATERIAL = "1"; // 路标漆
        // 		d.WIDTH = "1"; // 15cm
        // 		if(d.TYPE == "2"){
        // 			d.DRIVE_RULE = "2"; // 虚线
        // 		}else if(d.TYPE == "3"){
        // 			d.DRIVE_RULE = "1"; // 实线
        // 		}
        // 	}else if(d.TYPE == "4"){
        // 		// 公交车专用车道
        // 		d.COLOR = "3"; // 橙色
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "3"; //25cm
        // 	}else if(d.TYPE == "5"){
        // 		// 道路出入口标线
        // 		d.COLOR = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "4"; // 45cm
        // 		d.DRIVE_RULE = "2";
        // 	}else if(d.TYPE == "6"){
        // 		// 左转待转区线
        // 		d.COLOR = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "1"; // 15cm
        // 		d.DRIVE_RULE = "2";
        // 	}else if(d.TYPE == "7"){
        // 		// 可变导向车道线
        // 		d.COLOR = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "";
        // 	}else if(d.TYPE == "8"){
        // 		// 纵向减速标线
        // 		d.COLOR = "2";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "4"; // 45cm
        // 		d.DRIVE_RULE = "2";
        // 	}else if(d.TYPE == "9" || d.TYPE == "10"){
        // 		// 黄虚线，黄实线
        // 		d.COLOR = "2"; // 黄色
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "1";
        // 		if(d.TYPE == "9"){
        // 			d.DRIVE_RULE = "2";
        // 		}else if(d.TYPE == "10"){
        // 			d.DRIVE_RULE = "1";
        // 		}
        // 	}else if(d.TYPE == "11"){
        // 		// 纵向减速标线
        // 		d.COLOR = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "";
        // 	}else if(d.TYPE == "12" || d.TYPE == "13"){
        // 		// 双黄虚线，双黄实线
        // 		d.COLOR = "2"; // 黄色
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "";
        // 		if(d.TYPE == "12"){
        // 			d.DRIVE_RULE = "2"; // 虚线
        // 		}else if(d.TYPE == "13"){
        // 			d.DRIVE_RULE = "1"; // 实线
        // 		}
        // 	}else if(d.TYPE == "14" || d.TYPE == "15" || d.TYPE == "16" || d.TYPE == "17"){
        // 		// 白左实右虚线，黄左实右虚线，白左虚右实线，黄左虚右实线
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "1"; // 15cm
        // 		if(d.TYPE == "14" || d.TYPE == "16"){
        // 			d.COLOR = "1"; // 白色
        // 		}else if(d.TYPE == "15" || d.TYPE == "17") {
        // 			d.COLOR = "2"; // 黄色
        // 		}
        // 		if(d.TYPE == "14" || d.TYPE == "15"){
        // 			d.DRIVE_RULE = "3"; // 左实右虚
        // 		}else if(d.TYPE == "16" || d.TYPE == "17"){
        // 			d.DRIVE_RULE = "4"; // 左虚右实
        // 		}
        // 	}else if(d.TYPE == "18"){
        // 		// HOV专用车道线
        //         d.COLOR = "1";
        //         d.DRIVE_RULE = "1";
        // 		d.MATERIAL = "1";
        // 		d.WIDTH = "3"; // 25cm
        // 	}else if(+d.TYPE >= "19" && +d.TYPE <= '32'){
        //         d.COLOR = "0";
        //         d.DRIVE_RULE = "1";
        //         d.WIDTH = "";
        //     }else if(d.TYPE == "33"){
        //         // 停靠站标线
        //         d.COLOR = "1";
        //         d.DRIVE_RULE = "2";
        //         d.WIDTH = "4"; // 45cm
        //     }else if(d.TYPE == "34" || d.TYPE == "35" || d.TYPE == "36"){
        //         // 行车道左边缘线、行车道右边缘线、应急车道线
        //         d.COLOR = "1";
        //         d.DRIVE_RULE = "1";
        //         d.WIDTH = "2"; // 20cm
        //     }
        // }
        
        for(var fieldName in d){
        	if(!d.hasOwnProperty(fieldName) || fieldName == uiField.key) continue ;
        	var uiInput = iD.ui.TagEditor.findUiField(opts, fieldName);
	        uiInput && uiInput.tags && uiInput.tags(d);
        }
        
        return d;
    }


    //修改属性
    function normalAdjustTags(d, fieldOpts, $editor, uiField, opts) {
        var tags = _.extend({}, fieldOpts.context.entity(fieldOpts.entity.id).tags, d),
            errorMsgs = [],
            warningMsgs = [];

        //自动从半角转全角
        // function SBC(text) {
        //     return text.replace(/[\x20-\x7e]/g, function ($0) {
        //         return $0 == " " ? "\u3000" : String.fromCharCode($0.charCodeAt(0) + 0xfee0);
        //     });
        // }

        //全角转半角
        // function dbc2sbc(str) {
        //     return str.replace(/[\uff01-\uff5e]/g, function (a) {
        //         return String.fromCharCode(a.charCodeAt(0) - 65248);
        //     }).replace(/\u3000/g, " ");
        // }

        //判断字符串是否为空格
        // function strInvalid(str) {
        //     var dst = str.replace(/(^\s*)|(\s*$)/g, "");
        //     if (dst == 'undefined' || dst == '' || !dst) {
        //         return true;
        //     }
        //     return false;
        // }

        //判断字符串是否为"引路”、“掉头”、“出口”、“入口”、“桥”、“立交桥”、“辅路”等通用名称
        // function getInvalidRoadname(str) {
        //     if (str.length > 0) {
        //         if (str.indexOf(" ") >= 0) {
        //             //alert('str中包含arr[i]字符串') ;
        //             return "空格";
        //         }

        //         var arr = ["引路", "掉头", "出口", "入口", "桥", "立交桥", "辅路"];
        //         for (var i = 0; i < arr.length; i++) {
        //             if (str == arr[i]) {
        //                 return arr[i];
        //             }
        //         }
        //     }
        //     return undefined;
        // }

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
        title: '车道分隔线属性变化点',
//      onChange: firstAdjustTags,
        onValidate: adjustTags,
        onInitValidate: false,//初始化时触发验证开关
        fieldsGroup: [{
            title: '基本信息',
            fields: [{
                fieldName: 'VIRTUAL',
                fieldRender: 'select',
                fieldLabel: '虚拟分隔线类型'
            }]
        }]
    };
}
;