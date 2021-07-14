iD.ui.TagEditorTpl.Road = function () {

    var flag = false;

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
        var originalAdas = fieldOpts.entity.tags.adas;
        var adasValue = { 'originalValue': originalAdas, 'newValue': d.adas };
        if (originalAdas != '0' && typeof d.adas != 'undefined' && (originalAdas != d.adas)) {
            var adasPasswordTip = iD.ui.AdasPasswordTip(editor.context, passwordRight, passwordWrong, null, adasValue);
            adasPasswordTip.perform('ADAS字段取值由非0修改为其他值,请输入密码：');
        }
        else {
            if (!isObjectEmpty(d)) {
                return firstAdjustTags(d, fieldOpts, $editor, uiField, opts);
            } else {
                return normalAdjustTags(d, fieldOpts, $editor, uiField, opts);
            }
        }
        function passwordRight(adasRoads, adasValue) {
            var context = editor.context, slope_src;
            var newAdasValue = adasValue.newValue;
            if (newAdasValue == '0') {
                slope_src = '0';
            }
            else if (newAdasValue == '1') {
                slope_src = '1';
            }
            else if (newAdasValue == '2') {
                slope_src = '2';
            }
            else if (newAdasValue == '3') {
                slope_src = '3';
            }
            else if (newAdasValue == '4') {
                slope_src = '4';
            }
            else if (newAdasValue == '5') {
                slope_src = '5';
            }
            else if (newAdasValue == '6') {
                slope_src = '6';
            }
            else if (newAdasValue == '7') {
                slope_src = '7';
            }
            else if (newAdasValue == '8') {
                slope_src = '1';
            }
            var selectedTags = { 'adas': newAdasValue, 'slope_src': slope_src };
            var way = opts.entity;
            if (way) {
                way = way.mergeTags(selectedTags);
                context.perform(
                    iD.actions.AddEntity(way),
                    "更改ADAS数据标识");
            }
        }

        function passwordWrong() {
            delete d.adas;
            return normalAdjustTags(d, fieldOpts, $editor, uiField, opts);
        }
    }

    //第一次初始化
    function firstAdjustTags(d, fieldOpts, $editor, uiField, opts) {
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD);
        function uiFieldDisable(fieldName, bool) {
            let readonly = opts.fields[fieldName] && opts.fields[fieldName].readOnly == '1';
            let uiInput = iD.ui.TagEditor.findUiField(opts, fieldName);
            bool = readonly || bool;
            if (!currentLayer || !currentLayer.editable) {
                uiInput.disable(true);
            } else if (readonly && uiInput.readOnly) {
                uiInput.readOnly(readonly);
            } else if (uiInput.disable) {
                uiInput.disable(bool);
            }
        }
        // 2015-09-23 add 如果是侧边栏选择多条道路编辑，则不走现有规则
        //if (opts.multiRoadTagFlag) {
        //    return d;
        //}
        //return d;
        var tags = _.extend({}, fieldOpts.context.entity(fieldOpts.entity.id).tags, d);

        //道路名称只允许录入文字和数字， 用户填写完成后，自动将数字转为全角。
        if (typeof tags.ROAD_CLASS != 'undefined') {
            if (tags.ROAD_CLASS == '' && tags.FC == '') {
                uiFieldDisable('FC', true);
            }
        }
        /*
         道路等级-车道数
         等级为49-小路的道路，AVE_LANES=1
         道路等级（ROAD_CLASS）为小路（49），其功能等级（FC/LC_1/LC_2）为6.0.0
         */
        if (typeof tags.ROAD_CLASS != 'undefined' && tags.ROAD_CLASS == '49') {
            uiFieldDisable('FC', true);
        }
        else if (typeof tags.ROAD_CLASS != 'undefined' && tags.ROAD_CLASS != '49') {
            uiFieldDisable('FC', false);
        }

        /*
         道路名称-道路方向
         道路名称为“步行街”，则道路方向为双向禁行
         */
        if (typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN == '步行街') {
            uiFieldDisable('DIRECTION', true);
        }
        else if (typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN != '步行街') {
            uiFieldDisable('DIRECTION', false);
        }
        /*
         道路方向-道路状态
         步行街的道路状态：正常通行
         步行街的车道数：1车道
         步行街的道路宽度：3m
         双向禁行（步行街）：FOW制作为“14-商业步行街”
         道路方向（DIRECTION）为4-“双向禁行”（步行街）时，其FC=6
         */
        if ((typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN == '步行街')
            || (typeof tags.DIRECTION != 'undefined' && tags.DIRECTION == '4')) {
            uiFieldDisable('STATUS', true);
            uiFieldDisable('FC', true);
        }
        else {
            uiFieldDisable('STATUS', false);
            uiFieldDisable('FC', false);
        }

        /*
         道路状态-道路等级
         道路状态（STATUS）为2-“禁止通行”时，其功能等级（FC/LC_1/LC_2）为6.0.0
         */
        if (typeof tags.STATUS != 'undefined' && tags.STATUS == '2') {
            uiFieldDisable('FC', true);
        }
        else {
            uiFieldDisable('FC', false);
        }

        //道路类型 = 轮渡航线
        if (typeof tags.LINK_TYPE != 'undefined' && tags.LINK_TYPE == '1') {
            //配置联动置灰 FIX
            //  iD.ui.TagEditor.findUiField(opts, 'road_class').disable(false);
            uiFieldDisable('FORM_WAY', true);
            uiFieldDisable('DIRECTION', true);
            uiFieldDisable('STATUS', true);
        } else if (typeof tags.LINK_TYPE != 'undefined' && tags.LINK_TYPE != '1') {
            //  iD.ui.TagEditor.findUiField(opts, 'road_class').disable(false);
            uiFieldDisable('FORM_WAY', false);
            uiFieldDisable('DIRECTION', false);
            uiFieldDisable('STATUS', false);
        }
        /*
         道路所有-道路等级
         内部道路的道路等级：必须不高于“45000-城市次干路”；如：乡道。
         */
        //owner_ship总结: 因为跟置灰有关
        if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000')
            || (typeof tags.LINK_TYPE != 'undefined' && tags.LINK_TYPE == '1')
            || (typeof tags.FORM_WAY != 'undefined' && (tags.FORM_WAY == '3' || tags.FORM_WAY == '4' || tags.FORM_WAY == '5' || tags.FORM_WAY == '7' || tags.FORM_WAY == '8' || tags.FORM_WAY == '11' ||
                tags.FORM_WAY == '12' || tags.FORM_WAY == '13' || tags.FORM_WAY == '14' || tags.FORM_WAY == '16' || tags.FORM_WAY == '53' || tags.FORM_WAY == '56' || tags.FORM_WAY == '58'))
            || (typeof tags.ROAD_CLASS != 'undefined' && (tags.ROAD_CLASS == '42000' || tags.ROAD_CLASS == '51000'))) {

            if (typeof tags.OWNER_SHIP != 'undefined' && tags.OWNER_SHIP != 0) {
                //delete d.OWNER_SHIP;
            }
            else {
                uiFieldDisable('OWNER_SHIP', true);
            }
        }
        else {
            uiFieldDisable('OWNER_SHIP', false);
        }

        return d;
    }


    //修改属性
    function normalAdjustTags(d, fieldOpts, $editor, uiField, opts) {

        //   console.log('nornal before ', d);
        for (var key in d) {
            if (key !== undefined && fieldOpts.fields[key] != undefined) {
                window.primaryKey = key;
            }
        }

        // 2015-09-23 add 如果是侧边栏选择多条道路编辑，则不走现有规则
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

        //判断字符串是否为"引路”、“掉头”、“出口”、“入口”、“桥”、“立交桥”、“辅路”等通用名称
        function getInvalidRoadname(str) {
            if (str.length > 0) {
                if (str.indexOf(" ") >= 0) {
                    //alert('str中包含arr[i]字符串') ;
                    return "空格";
                }

                var arr = ["引路", "掉头", "出口", "入口", "桥", "立交桥", "辅路"];
                for (var i = 0; i < arr.length; i++) {
                    if (str == arr[i]) {
                        return arr[i];
                    }
                }
            }
            return undefined;
        }

        //道路名称只允许录入文字和数字， 用户填写完成后，自动将数字转为全角。
        /*
         道路名称与别名录入名称一致无限制
         别名与别名录入名称一致无限制
         */
        function roadNameChanged(name_chn, d, fname_chn, tags) {
            if (typeof name_chn != 'undefined' && d.name_trigger.indexOf('NAME_CHN') > -1) {
                //var reg = new RegExp("^[a-\z\A-\Z\0-9\u4E00-\u9FA5]*$");
                var reg = /#+/;
                var reg2 = /\s+/g; //空白字符
                var half = dbc2sbc(name_chn);
                half = half.replace(reg2, "");
                if (half.length > 0 && reg.test(half)) {
                    return '录入非法字符，请重新输入';
                } else {
                    var name = SBC(half);
                    /*if (((typeof d.alias_chn3 != 'undefined') && d.alias_chn3.length > 0 && name == d.alias_chn3) ||
                        ((typeof d.alias_chn2 != 'undefined') && d.alias_chn2.length > 0 && name == d.alias_chn2) ||
                        ((typeof d.alias_chn1 != 'undefined') && d.alias_chn1.length > 0 && name == d.alias_chn1)) {
                        return '道路名称与别名一致，请重新输入';
                    }*/
                    if ((typeof fname_chn != 'undefined') && fname_chn.length > 0 && name == fname_chn) {
                        return '道路名称曾用名一致，请重新输入';
                    }

                    //道路是步行街时（DIRECTION=4），不允许道路名称为空
                    if (typeof tags.DIRECTION != 'undefined' && tags.DIRECTION == "4") {
                        if (name == '') {
                            return '步行街不允许道路名称为空';
                        }
                    }

                    //roadclass=41000或43000，且formway=1,则名称、别名中不能出现末尾关键字是“出口”或“入口”的情况
                    if (typeof tags.ROAD_CLASS != 'undefined' && (tags.ROAD_CLASS == "41000" || tags.ROAD_CLASS == "43000") &&
                        typeof tags.FORM_WAY != 'undefined' && tags.FORM_WAY == '1') {
                        if (name.indexOf("出口") == name.length - 2 || name.indexOf("入口") == name.length - 2) {
                            return '别名中不能出现末尾关键字是出口或入口';
                        }
                    }

                    name = getInvalidRoadname(name);
                    if (name) {
                        return '道路名称不能为' + name + ',请重新输入';
                    } else {
                        return 'ok';
                    }
                }
            }
            return 'null';
        }

        function fnameChanged(fname_chn, tags) {
            if (typeof fname_chn != 'undefined') {
                var reg = /#+/;
                var reg2 = /\s+/g; //空白字符
                var half = dbc2sbc(fname_chn);
                half = half.replace(reg2, "");
                if (half.length > 0 && reg.test(half)) {
                    return '录入非法字符，请重新输入';
                } else {
                    var name = SBC(half);
                    if ((typeof tags.NAME_CHN != 'undefined') && tags.NAME_CHN.length > 0 && name == tags.NAME_CHN) {
                        return '道路名称曾用名一致，请重新输入';
                    }
                    /*else if (((typeof tags.alias_chn3 != 'undefined') && tags.alias_chn3.length > 0 && name == tags.alias_chn3) ||
                        ((typeof tags.alias_chn2 != 'undefined') && tags.alias_chn2.length > 0 && name == tags.alias_chn2) ||
                        ((typeof tags.alias_chn1 != 'undefined') && tags.alias_chn1.length > 0 && name == tags.alias_chn1)) {
                        return '曾用名与别名一致，请重新输入';
                    }*/

                    name = getInvalidRoadname(half);
                    if (name) {
                        return '曾用名不能为' + name + ',请重新输入';
                    } else {
                        return 'ok';
                    }
                }
            }
            return 'null';
        }

        function aliasChanged(alias_chn, index, d, fname_chn, tags) {
            var alias = 'alias_chn' + index;
            if (typeof alias_chn != 'undefined' && d.name_trigger.indexOf(alias) > -1) {
                var reg = /#+/;
                var reg2 = /\s+/g; //空白字符
                var half = dbc2sbc(alias_chn);
                half = half.replace(reg2, "");
                if (reg.test(half)) {
                    return '录入非法字符，请重新输入';
                } else {
                    var name = SBC(half);
                    if ((typeof d.NAME_CHN != 'undefined') && d.NAME_CHN.length > 0 && name == d.NAME_CHN) {
                        return '道路名称别名一致，请重新输入';
                    }
                    /*if ((index != 3 && (typeof d.alias_chn3 != 'undefined') && d.alias_chn3.length > 0 && name == d.alias_chn3) ||
                        (index != 2 && (typeof d.alias_chn2 != 'undefined') && d.alias_chn2.length > 0 && name == d.alias_chn2) ||
                        (index != 1 && (typeof d.alias_chn1 != 'undefined') && d.alias_chn1.length > 0 && name == d.alias_chn1)) {
                        return '别名与别名一致，请重新输入';
                    }*/
                    if ((typeof fname_chn != 'undefined') && fname_chn.length > 0 && name == fname_chn) {
                        return '别名与曾用名一致，请重新输入';
                    }

                    //别名总长
                    if (index == 1 && /*typeof d.alias_chn1 != 'undefined' &&*/ typeof d.ALIAS_CHN != 'undefined') {
                        //道路别名三个文本输入框字数总和不能超过３２个字，如果超过，则舍弃一个道路别名
                        if (d.ALIAS_CHN.length > 32) {
                            return '别名总长超过32个字符';
                        }
                    }

                    //roadclass=41000或43000，且formway=1,则名称、别名中不能出现末尾关键字是“出口”或“入口”的情况
                    if (typeof tags.ROAD_CLASS != 'undefined' && (tags.ROAD_CLASS == "41000" || tags.ROAD_CLASS == "43000") &&
                        typeof tags.FORM_WAY != 'undefined' && tags.FORM_WAY == '1') {
                        if (name.indexOf("出口") == name.length - 2 || name.indexOf("入口") == name.length - 2) {
                            return '别名中不能出现末尾关键字是出口或入口';
                        }
                    }

                    name = getInvalidRoadname(half);
                    if (name) {
                        return '别名不能为' + name + ',请重新输入';
                    } else {
                        return 'ok';
                    }
                }
            }
            return 'null';
        }

        //道路名称/别名变更
        if (typeof d.name_trigger != 'undefined') {

            var reval = roadNameChanged(d.NAME_CHN, d, tags.fname_chn, tags);
            if (reval == 'ok') {
                d.NAME_CHN = SBC(d.NAME_CHN.replace(/\s+/g, ""));
            }
            else if (reval != 'null') {
                errorMsgs.push(reval);
                delete d.NAME_CHN;
            }

            //别名3
            /*reval = aliasChanged(d.alias_chn3, 3, d, tags.fname_chn, tags);
            if (reval == 'ok') {
                d.alias_chn3 = SBC(d.alias_chn3.replace(/\s+/g, ""));
            }
            else if (reval != 'null') {
                errorMsgs.push(reval);
                delete d.alias_chn3;
                d.alias_chn = '';
            }*/

            //别名2
            /*reval = aliasChanged(d.alias_chn2, 2, d, tags.fname_chn, tags);
            if (reval == 'ok') {
                d.alias_chn2 = SBC(d.alias_chn2.replace(/\s+/g, ""));
            }
            else if (reval != 'null') {
                errorMsgs.push(reval);
                delete d.alias_chn2;
                d.alias_chn = d.alias_chn3;
            }*/

            //别名1
            /*reval = aliasChanged(d.alias_chn1, 1, d, tags.fname_chn, tags);
            if (reval == 'ok') {
                d.alias_chn1 = SBC(d.alias_chn1.replace(/\s+/g, ""));
            }
            else if (reval != 'null') {
                errorMsgs.push(reval);
                delete d.alias_chn1;
                d.alias_chn = d.alias_chn3 + '|' + d.alias_chn2;
            }*/

            //删除触发器
            delete d.name_trigger;
        }

        //曾用名
        reval = fnameChanged(d.fname_chn, tags);
        if (reval == 'ok') {
            d.fname_chn = SBC(d.fname_chn.replace(/\s+/g, ""));
        }
        else if (reval != 'null') {
            errorMsgs.push(reval);
            delete d.fname_chn;
        }

        //道路名称只允许录入文字和数字， 用户填写完成后，自动将数字转为全角。
        if (typeof d.ROAD_CLASS != 'undefined') {
            var obj = {
                "41000": ["1", "4"],
                "42000": ["2", "4"],
                "43000": ["2", "4"],
                "44000": ["4", "1"],
                "45000": ["5", "1"],
                "47000": ["6", "0"],
                "51000": ["3", "2"],
                "52000": ["5", "1"],
                "53000": ["5", "1"],
                "54000": ["6", "0"],
                "49": ["6", "0"],
                "100": ["6", "0"]
            };
            if (tags.ROAD_CLASS == d.ROAD_CLASS && tags.FC == '') {
                d.FC = obj[tags['ROAD_CLASS']][0];
                d.lc_1 = obj[tags['ROAD_CLASS']][1];
                d.lc_2 = d.lc_1;
                //iD.ui.TagEditor.findUiField(opts, 'FC').disable(true);
            }

            /*
             道路等级-公共道路
             等级为41000、43000的道路所有必须为0-公共道路
             */
            //在own_ship总结中
            /*
             道路等级-铺设道路
             等级为41000、43000的道路必须为2-已铺设
             */
            if (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000') {
                d.paver = '2';
            }
        }
        /*
         道路等级-车道数
         等级为49-小路的道路，AVE_LANES=1
         道路等级（ROAD_CLASS）为小路（49），其功能等级（FC/LC_1/LC_2）为6.0.0
         */
        if (typeof d.ROAD_CLASS != 'undefined' && d.ROAD_CLASS == '49') {
            d.ave_lanes = '1';
            d.lc_1 = '0';
            d.lc_2 = '0';
            d.FC = '6';
            //iD.ui.TagEditor.findUiField(opts, 'FC').disable(true);
        }
        //else if (typeof d.road_class != 'undefined' && d.road_class != '49') {
        //    iD.ui.TagEditor.findUiField(opts, 'FC').disable(false);
        //}
        if (tags.ROAD_CLASS == '49' && typeof d.FC != 'undefined' && d.FC != '6') {
            errorMsgs.push('道路等级和功能等级关联，当道路等级为小路时，功能等级为6！');
            delete d.FC;
        }

        /*
         道路构成-道路方向
         FORM_WAY=1-上下线分离、3-JCT、4-环岛、8-引路+JCT、9-出口、10-入口、11-提右A、12-提右B、13-提左A、14-提左B，
         则道路方向必须为正向/逆向通行
         */
        if (typeof d.FORM_WAY != 'undefined') {
            if (d.FORM_WAY == '1' || d.FORM_WAY == '3' || d.FORM_WAY == '4' || d.FORM_WAY == '8' || d.FORM_WAY == '9' || d.FORM_WAY == '10' ||
                d.FORM_WAY == '11' || d.FORM_WAY == '12' || d.FORM_WAY == '13' || d.FORM_WAY == '14') {
                if (tags.DIRECTION != 2 && tags.DIRECTION != 3) {
                    errorMsgs.push('道路构成与行驶方向关联，行驶方向必须为正向通行或者逆向通行！');
                    delete d.FORM_WAY;
                }
                /* else if (d.FORM_WAY == '3' || d.FORM_WAY == '8' || d.FORM_WAY == '9' || d.FORM_WAY == '10' ||
                     d.FORM_WAY == '13' || d.FORM_WAY == '14') {
                     if (typeof tags.navitype != 'undefined' && tags.navitype != 2) {
                         d.navitype = "2";
                     }
                 }*/
            }
            else if (d.FORM_WAY == '17') {
                d.ROAD_CLASS = '47000';
                d.lc_1 = '0';
                d.lc_2 = '0';
                d.FC = '6';
                /*if (tags.ave_lanes == '') {
                    d.ave_lanes = '1';
                }*/
                if (tags.WIDTH == '' || tags.WIDTH == '-1') {
                    d.WIDTH = '3.0';
                }
            }
            else if (d.FORM_WAY == '59') {
                d.ROAD_CLASS = '47000';
                d.OWNER_SHIP = '1';  //内部道路
                d.fow = '3';
                if (tags.FC == '') {
                    d.lc_1 = '0';
                    d.lc_2 = '0';
                    d.FC = '6';
                }
                /*if (tags.ave_lanes == '') {
                    d.ave_lanes = '1';
                }*/
                if (tags.WIDTH == '' || tags.WIDTH == '-1') {
                    d.WIDTH = '3.0';
                }
            }
        }

        if (tags.FORM_WAY == '1' || tags.FORM_WAY == '3' || tags.FORM_WAY == '4' || tags.FORM_WAY == '8' || tags.FORM_WAY == '9' || tags.FORM_WAY == '10' ||
            tags.FORM_WAY == '11' || tags.FORM_WAY == '12' || tags.FORM_WAY == '13' || tags.FORM_WAY == '14') {
            if (typeof d.DIRECTION != 'undefined' && d.DIRECTION != 2 && d.DIRECTION != 3) {
                errorMsgs.push('道路构成与行驶方向关联，行驶方向必须为正向通行或者逆向通行！');
                delete d.DIRECTION;
            }
        }
        /*
         道路构成-道路所有
         道路构成（FORM_WAY）为3-JCT、4-环岛、5-服务区、7-辅路、8-引路+JCT、11-提右A、12-提右B、13-提左A、
         14-提左B、16-左右转车道、53-服务区+JCT、56-服务区+引路、58-服务区+引路+JCT时，道路所有必须为“公共道路”
         */
        //own_ship总结中完成
        /*
         道路等级-道路所有
         国道、省道的道路所有必须为“公共道路”
         */
        //own_ship总结中完成
        /*
         道路方向-道路名称
         步行街名称不能为空
         */
        if (typeof d.DIRECTION != 'undefined' && d.DIRECTION == '4' && (typeof tags.NAME_CHN == 'undefined' || tags.NAME_CHN == '' || tags.NAME_CHN == false)) {
            errorMsgs.push('行驶方向与道路名称关联，行驶方向为双向禁行时道路名称不能为空！');
            delete d.DIRECTION;
        }
        /*
         道路名称-道路方向
         道路名称为“步行街”，则道路方向为双向禁行
         */
        if (typeof d.NAME_CHN != 'undefined' && d.NAME_CHN == '步行街') {
            d.DIRECTION = '4';
            //iD.ui.TagEditor.findUiField(opts, 'direction').disable(true);
        }
        //else if (typeof d.name_chn != 'undefined' && d.name_chn != '步行街') {
        //    iD.ui.TagEditor.findUiField(opts, 'direction').disable(false);
        //}
        /*
         道路方向-道路状态
         步行街的道路状态：正常通行
         步行街的车道数：1车道
         步行街的道路宽度：3m
         双向禁行（步行街）：FOW制作为“14-商业步行街”
         道路方向（DIRECTION）为4-“双向禁行”（步行街）时，其FC=6
         */
        if ((typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN == '步行街')
            || (typeof tags.DIRECTION != 'undefined' && tags.DIRECTION == '4')) {
            if (typeof d.FC != 'undefined' && d.FC != '6') {
                errorMsgs.push('道路等级被强关联，不能修改！');
                delete d.FC;
            }
            if (typeof d.STATUS != 'undefined' && d.STATUS != '0') {
                errorMsgs.push('道路状态被强关联，不能修改！');
                delete d.STATUS;
            }
        }

        if ((typeof d.NAME_CHN != 'undefined' && d.NAME_CHN == '步行街')
            || (typeof d.DIRECTION != 'undefined' && d.DIRECTION == '4')) {
            d.STATUS = '0';
            d.ave_lanes = '1';
            d.lane_wide = '3';
            d.WIDTH = '3';
            d.fow = '14';
            d.FC = '6';
            d.lc_1 = '0';
            d.lc_2 = '0';
            //iD.ui.TagEditor.findUiField(opts, 'STATUS').disable(true);
            //iD.ui.TagEditor.findUiField(opts, 'FC').disable(true);
        }
        //else {
        //iD.ui.TagEditor.findUiField(opts, 'STATUS').disable(false);
        //iD.ui.TagEditor.findUiField(opts, 'FC').disable(false);
        //}

        /*
         道路状态-道路方向
         禁止通行道路的道路方向不能为“双向禁行”
         */
        if (typeof d.STATUS != 'undefined' && d.STATUS == '2' && tags.DIRECTION == '4') {
            errorMsgs.push('道路状态与行驶方向关联，道路状态为禁止通行时行驶方向不能为双向禁行！');
            delete d.STATUS;
        }
        if (typeof d.DIRECTION != 'undefined' && d.DIRECTION == '4' && tags.STATUS == '2') {
            errorMsgs.push('道路状态与行驶方向关联，道路状态为禁止通行时行驶方向不能为双向禁行！');
            delete d.DIRECTION;
        }
        //当道路方向由“4-双向禁行"转为其他取值（1、2、3）时，
        //若无其他强制关联项，则FOW取值由”14-商业步行街“转为”3-普通道路“；
        if (typeof d.DIRECTION != 'undefined' && d.DIRECTION != '4' /*&& tags.fow == '14'*/) {
            d.fow = '3';
        }
        /*
         道路状态-道路等级
         道路状态（STATUS）为2-“禁止通行”时，其功能等级（FC/LC_1/LC_2）为6.0.0
         */
        if (typeof d.STATUS != 'undefined' && d.STATUS == '2') {
            d.FC = '6';
            d.lc_1 = '0';
            d.lc_2 = '0';
            //iD.ui.TagEditor.findUiField(opts, 'FC').disable(true);
        }
        //else {
        //    iD.ui.TagEditor.findUiField(opts, 'FC').disable(false);
        //}
        if (typeof tags.STATUS != 'undefined' && tags.STATUS == '2') {
            if (typeof d.FC != 'undefined' && d.FC != '6') {
                errorMsgs.push('道路状态与功能等级关联，道路状态为禁止通行时，功能等级为6！');
                delete d.FC;
            }
        }


        /*
         道路等级-道路名称
         高速道路主线（ROAD_CLASS==41000、43000&&FORM_WAY==1），名称或别名中不能出现末尾关键字是“出口”或“入口”的情况
         */

        if (typeof tags.NAME_CHN != 'undefined' && typeof tags.ALIAS_CHN != 'undefined') {
            if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') && (tags.FORM_WAY == '1') && typeof d.NAME_CHN != 'undefined') {
                // console.log('ddkcjsakl', d);
                if ((d.NAME_CHN.lastIndexOf('出口') == d.NAME_CHN.length - 2) || (d.NAME_CHN.lastIndexOf('入口') == d.NAME_CHN.length - 2)) {
                    errorMsgs.push('高速道路主线,名称中不能出现末尾关键字是“出口”或“入口”!');
                    delete d.NAME_CHN;
                }
            }
            if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') && (tags.FORM_WAY == '1') && typeof d.ALIAS_CHN != 'undefined') {
                if ((d.ALIAS_CHN.lastIndexOf('出口') == d.ALIAS_CHN.length - 2) || (d.ALIAS_CHN.lastIndexOf('入口') == d.ALIAS_CHN.length - 2)) {
                    errorMsgs.push('高速道路主线,别名中不能出现末尾关键字是“出口”或“入口”!');
                    delete d.ALIAS_CHN;
                }
            }

            if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') && (tags.FORM_WAY == '1')/* && typeof d.alias_chn1 != 'undefined'*/) {
                /*if ((d.alias_chn1.lastIndexOf('出口') == d.alias_chn1.length - 2) || (d.alias_chn1.lastIndexOf('入口') == d.alias_chn1.length - 2)) {
                    errorMsgs.push('高速道路主线,别名中不能出现末尾关键字是“出口”或“入口”!');
                    delete d.alias_chn1;
                    delete d.alias_chn;
                }*/
            }
            if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') && (tags.FORM_WAY == '1')/* && typeof d.alias_chn2 != 'undefined'*/) {
                /*if ((d.alias_chn2.lastIndexOf('出口') == d.alias_chn2.length - 2) || (d.alias_chn2.lastIndexOf('入口') == d.alias_chn2.length - 2)) {
                    errorMsgs.push('高速道路主线,别名中不能出现末尾关键字是“出口”或“入口”!');
                    delete d.alias_chn2;
                    delete d.alias_chn;
                }*/
            }
            if ((tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') && (tags.FORM_WAY == '1') /*&& typeof d.alias_chn3 != 'undefined'*/) {
                /*if ((d.alias_chn3.lastIndexOf('出口') == d.alias_chn3.length - 2) || (d.alias_chn3.lastIndexOf('入口') == d.alias_chn3.length - 2)) {
                    errorMsgs.push('高速道路主线,别名中不能出现末尾关键字是“出口”或“入口”!');
                    delete d.alias_chn3;
                    delete d.alias_chn;
                }*/
            }
            if ((typeof tags.NAME_CHN != 'undefined' && (tags.NAME_CHN.lastIndexOf('入口') == tags.NAME_CHN.length - 2 || tags.NAME_CHN.lastIndexOf('出口') == tags.NAME_CHN.length - 2)) && tags.FORM_WAY == '1') {
                if (typeof d.ROAD_CLASS != 'undefined' && (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000')) {
                    errorMsgs.push('高速道路主线,名称或别名中不能出现末尾关键字是“出口”或“入口”');
                    delete d.ROAD_CLASS;
                }
            }
            if (((typeof tags.NAME_CHN != 'undefined' && (tags.NAME_CHN.lastIndexOf('入口') == tags.NAME_CHN.length - 2 || tags.NAME_CHN.lastIndexOf('出口') == tags.NAME_CHN.length - 2)))
                && (tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000')) {
                if (d.FORM_WAY != 'undefined' && d.FORM_WAY == '1') {
                    errorMsgs.push('高速道路主线,名称或别名中不能出现末尾关键字是“出口”或“入口”');
                    delete d.FORM_WAY;
                }
            }
            if ((typeof tags.ALIAS_CHN != 'undefined' && (tags.ALIAS_CHN.lastIndexOf('入口') == tags.ALIAS_CHN.length - 2 || tags.NAME_CHN.lastIndexOf('出口') == tags.NAME_CHN.length - 2)) && tags.FORM_WAY == '1') {
                if (typeof d.ROAD_CLASS != 'undefined' && (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000')) {
                    errorMsgs.push('高速道路主线,名称或别名中不能出现末尾关键字是“出口”或“入口”');
                    delete d.ROAD_CLASS;
                }
            }
            if (((typeof tags.ALIAS_CHN != 'undefined' && (tags.ALIAS_CHN.lastIndexOf('入口') == tags.ALIAS_CHN.length - 2 || tags.NAME_CHN.lastIndexOf('出口') == tags.NAME_CHN.length - 2)))
                && (tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000')) {
                if (d.FORM_WAY != 'undefined' && d.FORM_WAY == '1') {
                    errorMsgs.push('高速道路主线,名称或别名中不能出现末尾关键字是“出口”或“入口”');
                    delete d.FORM_WAY;
                }
            }
        }
        /*
         道路等级-道路名称
         高速道路（ROAD_CLASS==41000、43000）的道路构成（FORM_WAY）不能为6-引路
         */
        if (tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '43000') {
            if (typeof d.FORM_WAY != 'undefined' && d.FORM_WAY == '6') {
                errorMsgs.push('高速道路的道路构成不能为引路！');
                delete d.FORM_WAY;
            }
        }
        if (tags.FORM_WAY == '6') {
            if (typeof d.ROAD_CLASS != 'undefined' && (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000')) {
                errorMsgs.push('高速道路的道路构成不能为引路！');
                delete d.ROAD_CLASS;
            }
        }
        /*
         道路等级-收费道路
         道路等级为41000-高速 并且 TOLL_FLAG无值时，则TOLL_FLAG=1-收费道路
         //该项内容，仅对新增重点工程道路有效；已有数据不满足该关联项。
         */
        if (tags.ROAD_CLASS == '41000' && (typeof tags.TOLL_FLAG == 'undefined' || tags.TOLL_FLAG == '')) {
            d.TOLL_FLAG = '1';
        }
        /*
         道路等级-车道宽度
         道路等级为高速公路、城市快速路时车道宽度设为3.5m，其他道路等级车道宽度设为3m
         */
        if (typeof d.ROAD_CLASS != 'undefined') {
            /*if (d.ROAD_CLASS == '41000' && typeof tags.isnewway != 'undefined') {
                d.TOLL_FLAG = '1';
                d.navitype = '2';
            }*/
            if (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000') {
                d.lane_wide = '3.5';
                if (typeof tags.ave_lanes != 'undefined' && tags.ave_lanes > 0) {
                    //d.WIDTH = parseFloat(tags.ave_lanes * 3.5).toFixed(1);
                }
            }
            else {
                d.lane_wide = '3';
                if (typeof tags.ave_lanes != 'undefined' && tags.ave_lanes > 0) {
                    //d.WIDTH = parseFloat(tags.ave_lanes * 3).toFixed(1);
                }
            }
        }
        /*
         道路名称-道路等级-道路构成
         高速道路名称为服务区则构成也应是服务区（FORM_WAY=5-服务区/56：服务区+引路/53：服务区+JCT/58：服务区+引路+JCT）
         道路名称后3个字为“服务区”
         */
        if ((typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN != "" && tags.NAME_CHN.substring(tags.NAME_CHN.length - 3, tags.NAME_CHN.length) == '服务区') &&
            tags.ROAD_CLASS == '41000' && typeof d.FORM_WAY != 'undefined') {
            if (d.FORM_WAY != '5' && d.FORM_WAY != '56' && d.FORM_WAY != '53' && d.FORM_WAY != '58') {

                errorMsgs.push('道路等级为高速公路，且道路名称后3个字为“服务区”时，道路构成须包含“服务区”！');
                delete d.FORM_WAY;
            }
        }
        if (typeof d.ROAD_CLASS != 'undefined' && d.ROAD_CLASS == '41000') {
            if ((tags.FORM_WAY != '5' && tags.FORM_WAY != '56' && tags.FORM_WAY != '53' && tags.FORM_WAY != '58')
                && (typeof tags.NAME_CHN != 'undefined' && tags.NAME_CHN != "" && tags.NAME_CHN.substring(tags.NAME_CHN.length - 3, tags.NAME_CHN.length) == '服务区')) {
                errorMsgs.push('道路等级为高速公路，且道路名称后3个字为“服务区”时，道路构成须包含“服务区”！');
                delete d.ROAD_CLASS;
            }
        }
        if (typeof d.NAME_CHN != 'undefined' && d.NAME_CHN != '' && d.NAME_CHN.substring(d.NAME_CHN.length - 3, d.NAME_CHN.length) == '服务区') {
            if ((tags.FORM_WAY != '5' && tags.FORM_WAY != '56' && tags.FORM_WAY != '53' && tags.FORM_WAY != '58')
                && tags.ROAD_CLASS == '41000') {
                errorMsgs.push('道路等级为高速公路，且道路名称后3个字为“服务区”时，道路构成须包含“服务区”！');
                delete d.NAME_CHN;
            }
        }
        /*
         道路构成-道路等级
         道路构成含JCT时，道路等级必须为41000/43000。
         */
        if (typeof d.FORM_WAY != 'undefined' && (d.FORM_WAY == '3' || d.FORM_WAY == '8' || d.FORM_WAY == '53' || d.FORM_WAY == '58')) {
            if (tags.ROAD_CLASS != '41000' && tags.ROAD_CLASS != '43000') {
                errorMsgs.push('道路构成与道路等级关联， 道路构成含JCT时道路等级需为高速道路/城市快速路!');
                delete d.FORM_WAY;
            }
        }
        if (typeof d.ROAD_CLASS != 'undefined' && d.ROAD_CLASS != '41000' && d.ROAD_CLASS != '43000') {
            if (tags.FORM_WAY == '3' || tags.FORM_WAY == '8' || tags.FORM_WAY == '53' || tags.FORM_WAY == '58') {
                errorMsgs.push('道路构成与道路等级关联， 道路构成含JCT时道路等级需为高速道路/城市快速路!');
                delete d.ROAD_CLASS;
            }
        }
        /*
         道路构成-道路方向
         上下线分离道路，其道路方向必须为正向/逆向通行
         */
        if (typeof d.FORM_WAY != 'undefined' && d.FORM_WAY == '1') {
            if (tags.DIRECTION != '2' && tags.DIRECTION != '3') {
                errorMsgs.push('行驶方向必须为正向通行或者逆向通行！')
                delete d.FORM_WAY;
            }
        }
        if (tags.FORM_WAY == '1') {
            if (typeof d.DIRECTION != 'undefined' && d.DIRECTION != '2' && d.DIRECTION != '3') {
                errorMsgs.push('行驶方向必须为正向通行或者逆向通行！')
                delete d.DIRECTION;
            }
        }
        //道路类型 = 轮渡航线
        if (typeof tags.LINK_TYPE != 'undefined' && tags.LINK_TYPE == '1') {
            // d.ROAD_CLASS = '45000';
            d.ave_lanes = '1';
            d.lane_wide = '3';
            d.WIDTH = '3';
            d.FORM_WAY = '15';
            d.DIRECTION = '1';
            d.STATUS = '0';
            d.fow = '-1';
            //配置联动置灰
            //  iD.ui.TagEditor.findUiField(opts, 'road_class').disable(false);
            //iD.ui.TagEditor.findUiField(opts, 'FORM_WAY').disable(true);
            //iD.ui.TagEditor.findUiField(opts, 'direction').disable(true);
            //iD.ui.TagEditor.findUiField(opts, 'STATUS').disable(true);
        }
        //else if (typeof tags.LINK_TYPE != 'undefined' && tags.LINK_TYPE != '1') {
        //  iD.ui.TagEditor.findUiField(opts, 'road_class').disable(false);
        //iD.ui.TagEditor.findUiField(opts, 'FORM_WAY').disable(false);
        //iD.ui.TagEditor.findUiField(opts, 'direction').disable(false);
        //iD.ui.TagEditor.findUiField(opts, 'STATUS').disable(false);
        //}
        if (tags.LINK_TYPE == '1') {
            /*if (typeof d.road_class != 'undefined' && d.road_class != '45000') {
             errorMsgs.push('道路类型与道路等级关联，道路类型为轮渡航线时，道路等级必须为城市次干路！');
             delete d.road_class;
             }*/
            if (typeof d.FORM_WAY != 'undefined' && d.FORM_WAY != '15') {
                errorMsgs.push('道路类型与道路等级关联，道路类型为轮渡航线时，道路构成必须为普通道路！');
                delete d.FORM_WAY;
            }
            if (typeof d.DIRECTION != 'undefined' && d.DIRECTION != '1') {
                errorMsgs.push('道路类型与道路等级关联，道路类型为轮渡航线时，道路构成必须为双向通行！');
                delete d.DIRECTION;
            }
            if (typeof d.STATUS != 'undefined' && d.STATUS != '0') {
                errorMsgs.push('道路类型与道路等级关联，道路类型为轮渡航线时，道路状态为正常通行！');
                delete d.STATUS;
            }
        }
        /*
         道路构成-道路等级
         环岛（FORM_WAY）的道路等级ROAD_CLASS不能为小路“49”
         */
        if (typeof d.FORM_WAY != 'undefined' && d.FORM_WAY == '4') {
            if (tags.ROAD_CLASS == '49') {
                errorMsgs.push('道路等级不能为49！')
                delete d.FORM_WAY;
            }
        }
        if (typeof tags.FORM_WAY != 'undefined' && tags.FORM_WAY == '4') {
            if (d.ROAD_CLASS == '49') {
                errorMsgs.push('道路等级不能为49！')
                delete d.ROAD_CLASS;
            }
        }
        /*
         道路构成-道路方向
         引路（连接高速时）（FORM_WAY 与JCT相关，需要补充）的道路方向不能为双向通行
         //若推动车厂客户取消该限制，
         ps:道路构成与JCT相关时，道路方向不能为双向通行
         */
        if (tags.FORM_WAY == '3' || tags.FORM_WAY == '8' || tags.FORM_WAY == '53' || tags.FORM_WAY == '58') {
            if (typeof d.DIRECTION != 'undefined' && d.DIRECTION == '1') {
                errorMsgs.push('道路构成与JCT相关时，道路方向不能为双向通行!');
                delete d.DIRECTION;
            }
        }
        if (typeof d.FORM_WAY != 'undefined' && (d.FORM_WAY == '3' || d.FORM_WAY == '8' || d.FORM_WAY == '53' || d.FORM_WAY == '58')) {
            if (tags.DIRECTION == '1') {
                errorMsgs.push('道路构成与JCT相关时，道路方向不能为双向通行!');
                delete d.FORM_WAY;
            }
        }
        /*
         道路所有-道路等级
         内部道路的道路等级：必须不高于“45000-城市次干路”；如：乡道。
         */
        if (tags.OWNER_SHIP == '1') {
            if (typeof d.ROAD_CLASS != 'undefined' && (d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '42000' || d.ROAD_CLASS == '43000' || d.ROAD_CLASS == '44000')) {
                errorMsgs.push('道路所有为内部道路时,道路等级不能高于城市次干路即45000！');
                delete d.ROAD_CLASS;
            }
        }
        if (typeof d.OWNER_SHIP != 'undefined') {
            if (d.OWNER_SHIP == '1') {
                if (tags.ROAD_CLASS == '41000' || tags.ROAD_CLASS == '42000' || tags.ROAD_CLASS == '43000' || tags.ROAD_CLASS == '44000') {
                    errorMsgs.push('道路所有为内部道路时,道路等级不能高于城市次干路即45000！');
                    delete d.OWNER_SHIP;
                }
            } else if (d.OWNER_SHIP == '3' || d.OWNER_SHIP == '4') {
                d.fow = '7';
                d.navitype = '2';
            }
        }
        //owner_ship总结: 因为跟置灰有关
        if ((d.ROAD_CLASS == '41000' || d.ROAD_CLASS == '43000')
            || (typeof d.LINK_TYPE != 'undefined' && d.LINK_TYPE == '1')
            || (typeof d.FORM_WAY != 'undefined' && (d.FORM_WAY == '3' || d.FORM_WAY == '4' || d.FORM_WAY == '5' || d.FORM_WAY == '7' || d.FORM_WAY == '8' || d.FORM_WAY == '11' ||
                d.FORM_WAY == '12' || d.FORM_WAY == '13' || d.FORM_WAY == '14' || d.FORM_WAY == '16' || d.FORM_WAY == '53' || d.FORM_WAY == '56' || d.FORM_WAY == '58'))
            || (typeof d.ROAD_CLASS != 'undefined' && (d.ROAD_CLASS == '42000' || d.ROAD_CLASS == '51000'))) {

            if (typeof d.OWNER_SHIP != 'undefined' && d.OWNER_SHIP != 0) {
                errorMsgs.push('道路所有已被强关联，不能修改');
                delete d.OWNER_SHIP;
            }
            else {
                d.OWNER_SHIP = '0';
                //iD.ui.TagEditor.findUiField(opts, 'OWNER_SHIP').disable(true);
            }
        }
        //else {
        //iD.ui.TagEditor.findUiField(opts, 'OWNER_SHIP').disable(false);
        //}

        //道路别名不为空，则名称一定不为空
        if (typeof d.NAME_CHN != 'undefined' && d.NAME_CHN == '') {
            if (typeof tags.ALIAS_CHN != 'undefined' && tags.ALIAS_CHN != '') {
                errorMsgs.push('道路别名不为空时,中文名称一定不为空！');
                delete d.NAME_CHN;
            }
        }
		
		//道路别名不为空，则格式化别名：大写、全角
        if (typeof d.ALIAS_CHN != 'undefined' &&  d.ALIAS_CHN!='') {
            d.ALIAS_CHN = SBC( d.ALIAS_CHN.toUpperCase() );
        }

        //根据道路名称自动截取 出汉字前文件赋值到ROUTE_NO
        if (typeof d.NAME_CHN != 'undefined' &&  d.NAME_CHN!='') {
			
			let prefix_g = (d.NAME_CHN.indexOf('国道') > -1 ) ? 'G' : '',
				prefix_s = (d.NAME_CHN.indexOf('省道') > -1 ) ? 'S' : '',
				prefix_y = (d.NAME_CHN.indexOf('县道') > -1 ) ? 'Y' : '',
				prefix = prefix_g || prefix_s || prefix_y || '',
				route_ = d.NAME_CHN.match( /^[^\u4e00-\u9fa5]+/g);
			
            if(route_){
				let routeNo = route_.join('');
				let newRouteNo = SBC( prefix + routeNo );
				if(routeNo!=''){
					d.ROUTE_NO = newRouteNo;
				}
				//a.match( /[^\u4E00-\u9FFF]/g).join('')
			}
			d.NAME_CHN = SBC( d.NAME_CHN.toUpperCase() );
        }
        //adas来源与坡度来源联动
        // if (typeof d.adas != 'undefined') {
        //     if (d.adas == '0') {
        //         d.slope_src = '0';
        //     }
        //     else if (d.adas == '1') {
        //         d.slope_src = '1';
        //     }
        //     else if (d.adas == '2') {
        //         d.slope_src = '2';
        //     }
        //     else if (d.adas == '3') {
        //         d.slope_src = '3';
        //     }
        //     else if (d.adas == '4') {
        //         d.slope_src = '4';
        //     }
        //     else if (d.adas == '5') {
        //         d.slope_src = '5';
        //     }
        //     else if (d.adas == '6') {
        //         d.slope_src = '6';
        //     }
        //     else if (d.adas == '7') {
        //         d.slope_src = '7';
        //     }
        //     else if (d.adas == '8') {
        //         d.slope_src = '1';
        //     }
        // }

        //当NAVITYPE取值由人可走道路（NAVITYPE<>2/3/6/7）变为人不可走道路（NAVITYPE=2/3/6/7）时，删除步导点与道路ROAD的关联关系（REL_WKET_ROAD）；
        //当NAVITYPE取值由人不可走道路（NAVITYPE=2/3/6/7）变为人可走道路（NAVITYPE<>2/3/6/7）时，增加步导点与道路ROAD的关联关系（REL_WKET_ROAD）；
        // if (typeof d.navitype != 'undefined' && typeof tags.navitype != 'undefined')
        // {
        //     if ( ['2','3','6','7'].indexOf(tags['navitype'])<0 &&
        //          ['2','3','6','7'].indexOf(d.navitype)>=0)
        //     {
        //         //删除步导点与道路ROAD的关联关系（REL_WKET_ROAD）
        //     }
        //     else if ( ['2','3','6','7'].indexOf(tags['navitype'])>=0 &&
        //                ['2','3','6','7'].indexOf(d.navitype)<0)
        //     {
        //         //增加步导点与道路ROAD的关联关系（REL_WKET_ROAD）
        //     }
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
        return firstAdjustTags(d, fieldOpts, $editor, uiField, opts);
    }

    return {
        title: '道路属性编辑',
        onValidate: adjustTags,
        onInitValidate: true,//初始化时触发验证开关
        fieldsGroup: [{
            title: '名称',
            fields: [{
                fieldName: 'NAME_CHN',
                fieldRender: 'inputGroup',
                fieldLabel: '中文名称',
                fieldOptions: [{
                    name: 'ALIAS_CHN',
                    title: '道路别名'
                }],
            }
            ]
        }/*, {
            title: '分类',
            fields: [{
                fieldName: 'LINK_TYPE',
                fieldLabel: '道路类型'
            }
                , {
                    fieldName: 'road_class',
                    fieldLabel: '道路等级'
                }, {
                    fieldName: 'FC',
                    fieldLabel: '功能等级'
                }]
        }, {
            title: '主要属性',
            fields: [{
                fieldName: 'DIRECTION',
                fieldLabel: '行驶方向'
            }, {
                fieldName: 'OWNER_SHIP',
                fieldLabel: '道路所有'
            }, {
                fieldName: 'FORM_WAY',
                fieldLabel: '道路构成'
            }, {
                fieldName: 'STATUS',
                fieldLabel: '道路状态'
            }, {
                fieldName: 'adas',
                fieldLabel: 'ADAS来源'
            }]
        }, {
            title: '步导属性',
            fields: [{
                fieldName: 'navitype',
                fieldLabel: '步行导航'
            }]
        }*/
        ]/*,
        onValidate: function(d, fieldOpts, $editor, uiField, opts){
//      	let fieldMadel = fieldOpts.fieldMadel;
//      	let fieldSize = fieldMadel.fieldSize;
//      	if (fieldMadel.fieldName == "NAME_CHN") {
//      		if (d.length > fieldSize) {
//      			
//      		}
//      	}
        	return d;
        }*/
    };
}
    ;