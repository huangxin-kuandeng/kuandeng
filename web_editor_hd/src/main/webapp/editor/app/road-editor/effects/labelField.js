/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-21 20:22:46
 * @Description: 
 */
iD.effects = iD.effects || {};
/**
 * 配置字段显示/隐藏
 * @param {Object} context
 */

iD.effects.labelField = function (context) {
    let objPG = _.compact(['SUBTYPE'].map(function (fname) {
        return iD.ModelEntitys[iD.data.DataType.OBJECT_PG].getFields().filter(function (d) {
            return d.fieldName == fname;
        })[0];
    }));
    let objPD = _.compact(['TYPE'].map(function (fname) {
        return iD.ModelEntitys[iD.data.DataType.PAVEMENT_DISTRESS].getFields().filter(function (d) {
            return d.fieldName == fname;
        })[0];
    }));
    let objPDL = _.compact(['TYPE'].map(function (fname) {
        return iD.ModelEntitys[iD.data.DataType.PAVEMENT_DISTRESS_PL].getFields().filter(function (d) {
            return d.fieldName == fname;
        })[0];
    }));
    var effect = {
        id: 'label-field',
        button: 'label-field',
        title: t('effects.labelField.title'),
        iconText: 'LB',
        description: t('effects.labelField.description'),
        key: 'Shift+R',
        enable: false,
        apply: function (context, open, selectedids) {
            var self = this, graph = context.graph();
            self.enable = open == null ? false : open;
            var LABEL_FILTERS = iD.labels.effectEntityFilter;
            LABEL_FILTERS.remove(iD.data.DataType.DIVIDER);
            LABEL_FILTERS.remove(iD.data.DataType.OBJECT_PG);
            LABEL_FILTERS.remove(iD.data.DataType.PAVEMENT_DISTRESS);
            LABEL_FILTERS.remove(iD.data.DataType.PAVEMENT_DISTRESS_PL);
            if (!self.enable) {
                refreshMap();
                return;
            }
            // 地面标记显示子类型中文文字SUBTYPE字段
            LABEL_FILTERS.set(iD.data.DataType.OBJECT_PG, function (entity) {
                var content = "";
                // let objPG = _.compact(['SUBTYPE'].map(function (fname) {
                //     return iD.ModelEntitys[iD.data.DataType.OBJECT_PG].getFields().filter(function (d) {
                //         return d.fieldName == fname;
                //     })[0];
                // }));
                var list = [];
                objPG.forEach(function (d) {
                    if (!d.fieldInput || !d.fieldInput.values || !d.fieldInput.values.length) {
                        return;
                    }
                    var f = _.find(d.fieldInput.values, { value: '' + entity.tags[d.fieldName] });
                    if (f && f.name) {
                        list.push(f.name);
                    }
                });
                return {
                    name: 'SUBTYPE',
                    value: list.join('-')
                };
                // let values = {
                //     "0":"未调查",
                //     "1":"文字",
                //     "2":"箭头",
                //     "3":"数字",
                //     "4":"符号",
                //     "5":"减速带",
                //     "6":"防滑带",
                //     "7":"人行横道",
                //     "8":"禁止停车",
                //     "9":"导流带",
                //     "10":"车距确认线",
                //     "11":"直行箭头",
                //     "12":"左转箭头",
                //     "13":"右转箭头",
                //     "14":"掉头箭头",
                //     "15":"直行加左转箭头",
                //     "16":"直行加右转箭头",
                //     "17":"直行加掉头箭头",
                //     "18":"左转加掉头箭头",
                //     "19":"左转加右转箭头",
                //     "20":"左弯或向左合流箭头",
                //     "21":"右弯或向右合流箭头",
                //     "31":"限速",
                //     "32":"限制时间"
                // }
                // switch (entity.tags.SUBTYPE.toString()) {
                //     case "1":
                //         content = "文字";
                //         break;
                //     case "2":
                //     case "11":
                //     case "12":
                //     case "13":
                //     case "14":
                //     case "15":
                //     case "16":
                //     case "17":
                //     case "18":
                //     case "19":
                //     case "20":
                //     case "21":
                //         content = "箭头";
                //         break;
                //     case "3":
                //         content = "数字";
                //         break;
                //     case "4":
                //         content = "符号";
                //         break;
                //     case "5":
                //         content = "减速带";
                //         break;
                //     case "6":
                //         content = "防滑带";
                //         break;
                //     case "7":
                //         content = "人行横道";
                //         break;
                //     case "8":
                //         content = "禁止停车";
                //         break;
                //     case "9":
                //         content = "导流带";
                //         break;
                //     case "10":
                //         content = "车距确认线";
                //         break;
                //     case "99":
                //         content = "其他";
                //         break;
                // }
                // return {
                //     name: 'SUBTYPE',
                //     value: content
                // };
            });

            LABEL_FILTERS.set(iD.data.DataType.DIVIDER, function (entity) {
                if (!entity || entity.modelName != iD.data.DataType.DIVIDER) {
                    return false;
                }
                return {
                    name: 'DIVIDER_NO',
                    value: entity.tags.DIVIDER_NO
                };
            });
            LABEL_FILTERS.set(iD.data.DataType.PAVEMENT_DISTRESS, function (entity) {
                if (!entity || entity.modelName != iD.data.DataType.PAVEMENT_DISTRESS) {
                    return false;
                }
               
                var list = [];
                objPD.forEach(function (d) {
                    if (!d.fieldInput || !d.fieldInput.values || !d.fieldInput.values.length) {
                        return;
                    }
                    var f = _.find(d.fieldInput.values, { value: '' + entity.tags[d.fieldName] });
                    if (f && f.name) {
                        list.push(f.name);
                    }
                });
                return {
                    name: 'TYPE',
                    value: list.join('-')
                };
                 
            });
            LABEL_FILTERS.set(iD.data.DataType.PAVEMENT_DISTRESS_PL, function (entity) {
                if (!entity || entity.modelName != iD.data.DataType.PAVEMENT_DISTRESS_PL) {
                    return false;
                }
                  
                var list = [];
                objPDL.forEach(function (d) {
                    if (!d.fieldInput || !d.fieldInput.values || !d.fieldInput.values.length) {
                        return;
                    }
                    var f = _.find(d.fieldInput.values, { value: '' + entity.tags[d.fieldName] });
                    if (f && f.name) {
                        list.push(f.name);
                    }
                });
                return {
                    name: 'TYPE',
                    value: list.join('-')
                };
            });
            refreshMap();
        }
    };

    function refreshMap() {
        //重新渲染地图
        context.map().dimensions(context.map().dimensions());
    }

    return effect;
};
