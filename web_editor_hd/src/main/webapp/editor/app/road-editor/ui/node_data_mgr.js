/**
 *  2016/1/23.
 * 行车引导线编辑的数据管理类
 */
iD.ui.NodeLineInfo.dataMgr = function (context) {
    var mgrEvent = d3.dispatch('loading', 'loaded');

    function DataMgr() {
        this.directOptions = {
            label: "顺行道路",
            options: [{
                label: '-1-未调查',
                value: -1
            }, {
                label: '100-顺行',
                value: 100
            }, {
                label: '101-前方',
                value: 101
            }, {
                label: '102-右前方',
                value: 102
            }, {
                label: '103-右方',
                value: 103
            }, {
                label: '104-右后方',
                value: 104
            }, {
                label: '105-后方',
                value: 105
            }, {
                label: '106-左后方',
                value: 106
            }, {
                label: '107-左方',
                value: 107
            }, {
                label: '108-左前方',
                value: 108
            }, {
                label: '110-保持在中央车道行驶',
                value: 110
            }, {
                label: '111-保持在左侧车道行驶',
                value: 111
            }, {
                label: '112-保持在右侧车道行驶',
                value: 112
            }, {
                label: '180-保持在中央车道行驶2',
                value: 180
            }, {
                label: '181-保持在左侧车道行驶2',
                value: 181
            }, {
                label: '182-保持在右侧车道行驶2',
                value: 182
            }, {
                label: '190-保持在中央行驶(1车道)',
                value: 190
            }, {
                label: '191-保持在左侧行驶(1车道)',
                value: 191
            }, {
                label: '192-保持在右侧行驶(1车道)',
                value: 192
            }
            ]
        };

        this.context = context;
    }

    _.assign(DataMgr.prototype, {
        //根据maat的进入道路和结点找到唯一的saat
        getSaatFromMaat: function (context, datum) {
            var fWayId = datum.memberByRole(iD.data.RoleType.FROAD_ID).id;
            var nodeId;
            if(datum.modelName == iD.data.DataType.NODECONN){
            	nodeId = datum.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
            }else if(datum.modelName == iD.data.DataType.C_NODECONN){
            	nodeId = datum.memberByRole(iD.data.RoleType.C_NODE_ID).id;
            }
            var fWay = context.entity(fWayId);
            var node = context.entity(nodeId);
            var graph = context.graph();
            var relations = [];
            if (node.modelName == iD.data.DataType.C_NODE) {
                var mtype = iD.data.DataType.C_NODEINFO;
            } else {
                var mtype = iD.data.DataType.NODEINFO;
            }

            var relations1 = graph.parentRelations(fWay).filter(function (d) {
                return d.modelName == mtype;
            });
            var relations2 = graph.parentRelations(node).filter(function (d) {
                return d.modelName == mtype;
            });

            function isInObjectArr(id, arrs) {
                for (var i = 0; i < arrs.length; i++) {
                    if (arrs[i].id == id) {
                        return true;
                    }
                }
                return false;
            }

            for (var i = 0; i < relations1.length; i++) {
                if (isInObjectArr(relations1[i].id, relations2)) {
                    relations.push(relations1[i]);
                }
            }
            return relations;
        },
        getMaatFromSaat: function (context, datum) {
            var wayId = datum.memberByRole(iD.data.RoleType.ROAD_ID).id;
            var nodeId;
            if(datum.modelName == iD.data.DataType.NODECONN){
            	nodeId = datum.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
            }else if(datum.modelName == iD.data.DataType.C_NODECONN){
            	nodeId = datum.memberByRole(iD.data.RoleType.C_NODE_ID).id;
            }
            var way = context.entity(wayId);
            var isMaap = false, isSyMaat = false;
            if (!way) return [];

            return context.graph().parentRelations(way).filter(function (d) {
                isMaap = d.modelName == iD.data.DataType.NODECONN;
                isSyMaat = d.modelName == iD.data.DataType.C_NODECONN;
                if (isMaap && d.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id == nodeId && d.memberByRole(iD.data.RoleType.FROAD_ID).id == wayId) {
                    return true;
                }
                if (isSyMaat && d.memberByRole(iD.data.RoleType.C_NODE_ID).id == nodeId && d.memberByRole(iD.data.RoleType.FROAD_ID).id == wayId) {
                    return true;
                }
                
                return false;
            });
        },

        updataGuidancePicArr: function (context, saat, type, value) {
            var rels = this.getMaatFromSaat(context, saat);
            var i = 0, len = rels.length;
            var datum;
            var picArr;
            for (; i < len; i++) {
                picArr = this.getGuidancePic(rels[i], context, type);
                _.each(picArr, function (d) {
                    if (value == "") {
                        context.replace(iD.actions.DeleteRelation(d.id), "删除对应的GuidancePic");
                    } else {
                        datum = d.mergeTags({"pic_ar": ""});
                        datum = datum.mergeTags({"pic_bk": ""});
                        context.replace(iD.actions.AddEntity(datum), "修改对应箭头信息");
                    }
                })

            }

        },
        //切换relation数组排序
        sortRealtions:function(arr,rel){
            if(!rel){
                return arr;
            }
            var wayId;
            var wayArr = []; //存放优先数组，线ID相同
            var bArr = [];
            var i=0;len = arr.length;
            var tempRelation;
            if(rel.modelName == iD.data.DataType.NODEINFO || rel.modelName == iD.data.DataType.C_NODEINFO){
                wayId = rel.memberByRole(iD.data.RoleType.ROAD_ID).id;
            }else{
                wayId = rel.memberByRole(iD.data.RoleType.FROAD_ID).id;
            }
            for(;i<len;i++){
                tempRelation = arr[i];
                if(tempRelation.modelName == iD.data.DataType.NODEINFO || tempRelation.modelName == iD.data.DataType.C_NODEINFO){
                    if(wayId == tempRelation.memberByRole(iD.data.RoleType.ROAD_ID).id){
                        wayArr.push(tempRelation);
                    }else{
                        bArr.push(tempRelation);
                    }
                }else{
                    if(wayId == tempRelation.memberByRole(iD.data.RoleType.FROAD_ID).id || wayId == tempRelation.memberByRole(iD.data.RoleType.TROAD_ID).id){
                        wayArr.push(tempRelation);
                    }/*else{
                        bArr.push(tempRelation);
                    }*/
                }
            }
            return wayArr.concat(bArr);
        },
        drawImage: function (canvas, imageUrl) {
            var image = new Image();
            var done = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                var imageData = context.getImageData(0, 0, image.width, image.height);
                var pixels = imageData.data;
                var backgroundColor = pixels.slice(0, 4);
                for (var i = 0, n = pixels.length; i < n; i += 4) {
                    if (pixels[i] === backgroundColor[0]
                        && pixels[i + 1] === backgroundColor[1]
                        && pixels[i + 2] === backgroundColor[2]
                        && pixels[i + 3] === backgroundColor[3]) {
                        pixels[i] = 0;
                        pixels[i + 1] = 0;
                        pixels[i + 2] = 0;
                        pixels[i + 3] = 0;
                    }
                }
                context.putImageData(imageData, 0, 0);
            };
            image.onload = done;
            image.crossOrigin = 'Anonymous';
            image.src = imageUrl;
            if (image.complete || image.complete === undefined) {
                done();
            }
        },

        //获得GuidancePic或者getGuidancePicC关系根据maat和对应的type数组过滤
        getGuidancePic: function (rel, context, type) {
            if (rel.modelName == iD.data.DataType.NODECONN) {
                var mtype = iD.data.DataType.GUIDANCEPICTURE;
            } else {
                var mtype = iD.data.DataType.GUIDANCEPICTUREC;
            }
            var secondRels = [];
            secondRels = context.graph().parentRelations(rel).filter(function (r) {
                if (r.modelName == mtype) {
                    return true;
                }
                return false;
            });
            if (type) {
                secondRels = secondRels.filter(function (relation) {
                    if (type.indexOf(relation.tags.type) > -1) {
                        return true;
                    }
                    return false;
                })
            }
            return secondRels;
        },

        //传入maat或者tgd，取其父关系获得laneinfo或者laneinfoc关系
        getLaneInfoRel: function (rel, context) {
            var secondRels = [];
            secondRels = context.graph().parentRelations(rel).filter(function (r) {
                if (r.modelName == iD.data.DataType.LANEINFO || r.modelName == iD.data.DataType.C_LANEINFO) {
                    return true;
                }
                return false;
            })
            return secondRels;
        },

        getGuidanceVoiceRel: function (rel, context) {
            if (rel.modelName == iD.data.DataType.NODECONN) {
                var mtype = iD.data.DataType.GUIDANCEVOICE;
            } else {
                var mtype = iD.data.DataType.GUIDANCEVOICEC;
            }
            var secondRels = [];
            secondRels = context.graph().parentRelations(rel).filter(function (r) {
                if (r.modelName == mtype) {
                    return true;
                }
                return false;
            })
            return secondRels;
        },

        getAssistInfo: function (rel, context) {
            if (rel.modelName == iD.data.DataType.NODECONN) {
                var mtype = iD.data.DataType.ASSISTINFO;
            } else {
                var mtype = iD.data.DataType.ASSISTINFOC;
            }
            var secondRels = [];
            secondRels = context.graph().parentRelations(rel).filter(function (r) {
                if (r.modelName == mtype) {
                    return true;
                }
                return false;
            })
            return secondRels;
        },

        getGuidanceSP: function (rel, context) {
            if (rel.modelName == iD.data.DataType.NODECONN) {
                var mtype = iD.data.DataType.GUIDANCESIGNPOST;
            } else {
                var mtype = iD.data.DataType.GUIDANCESIGNPOSTC;
            }
            var secondRels = [];
            secondRels = context.graph().parentRelations(rel).filter(function (r) {
                if (r.modelName == mtype) {
                    return true;
                }
                return false;
            });
            return secondRels;
        },

        getRefNameChnArr: function (context, nodeId) {
            var results = [];
            var saatArrs = this.getSaatArrs(nodeId);
            saatArrs.forEach(function (d) {
                var wayMember = d.memberByRole(iD.data.RoleType.ROAD_ID);
                var way = context.entity(wayMember.id);
                if (way.tags.NAME_CHN && way.tags.NAME_CHN != "") {
                    var str = iD.ui.TagName.dbc2sbc(way.tags.NAME_CHN);
                    results.push(str);
                }
            })
            return this.unique(results);
        },

        unique: function (arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        },
        //用第二个数组更新第一个数组元素， 现在根据code相同
        updataArray: function (arr1, arr2) {
            var i = 0, j = 0, ilen = arr2.length, jlen = arr2.length;
            for (; i < ilen; i++) {
                for (j = 0; j < jlen; j++) {
                    if (arr1[i].code == arr2[j].code) {
                        arr1[i] = arr2[j];
                    }
                }
            }
        },

        getMaatArrs: function (nodeId) {
            var context = this.context;
            var entity = context.entity(nodeId);
            var maatArrs = [];
            var relations = context.graph().parentRelations(entity);
            var maatObject = {};
            if (entity.modelName == iD.data.DataType.ROAD_NODE) {
                var maatType = iD.data.DataType.NODECONN;
                relations.forEach(function (rel) {
                    if (rel.modelName == maatType) {
                        var fWayId = rel.memberByRole(iD.data.RoleType.FROAD_ID).id;
                        var tWayId = rel.memberByRole(iD.data.RoleType.TROAD_ID).id;
                        if ((fWayId != tWayId)) {
                            rel = iD.util.tagExtend.updateAcceTagOfNMaat(context.graph(), rel);
                            if (!maatObject[fWayId])maatObject[fWayId] = [];
                            maatObject[fWayId].push(rel);
                            // maatArrs.push(rel);
                        }
                    }
                })
            } else {
                var maatType = iD.data.DataType.C_NODECONN;
                relations.forEach(function (rel) {
                    if (rel.modelName == maatType) {
                        var fWayId = rel.memberByRole(iD.data.RoleType.FROAD_ID).id;
                        var tWayId = rel.memberByRole(iD.data.RoleType.TROAD_ID).id;
                        if ((fWayId != tWayId)) {
                            rel = iD.util.tagExtend.updateAcceTagOfCMaat(context.graph(), rel);
                            if (!maatObject[fWayId])maatObject[fWayId] = [];
                            maatObject[fWayId].push(rel);
                            // maatArrs.push(rel);
                        }
                    }
                })
            }

            var Maatkeys = _.sortBy(Object.keys(maatObject));
            Maatkeys.forEach(function (key) {
                maatArrs = maatArrs.concat(maatObject[key])
            })
            return maatArrs;
        },

        getSaatArrs: function (nodeId) {
            var context = this.context;
            var entity = context.entity(nodeId);
            var saatArrs = [], saatObject = {};
            var relations = context.graph().parentRelations(entity);
            if (entity.modelName == iD.data.DataType.ROAD_NODE) {
                var saatType = iD.data.DataType.NODEINFO;
            } else {
                var saatType = iD.data.DataType.C_NODEINFO;
            }
            relations.forEach(function (d) {
                if (d.modelName == saatType) {
                    var way = d.memberByRole(iD.data.RoleType.ROAD_ID).id;
                    saatObject[way] = d;
                }
            })
            var saatkeys = _.sortBy(Object.keys(saatObject));
            saatkeys.forEach(function (key) {
                saatArrs = saatArrs.concat(saatObject[key])
            })
            return saatArrs;
        },

        //传入对应的saat/maat-type关系，获取laneinfo的arrow字段或者saat的laneinfo字段
        getArrowTag: function (relation, type) {
            var arrow = {'id': "", 'arrowTag': "", 'lane_no': ""};
            var context = this.context;
            if (arguments.length == 1) {
                if (relation.modelName == iD.data.DataType.NODEINFO || relation.modelName == iD.data.DataType.C_NODEINFO) {
                    return {'id': relation.id, 'arrowTag': relation.tags.LANEINFO};
                }
            } else if (relation.modelName == iD.data.DataType.NODECONN || relation.modelName == iD.data.DataType.C_NODECONN) {
                var laneInfoRel = context.graph().parentRelations(relation).filter(function (rel) {
                    if (rel.modelName == iD.data.DataType.LANEINFO || rel.modelName == iD.data.DataType.C_LANEINFO) {
                        return true;
                    }
                    return false;
                });
                if (laneInfoRel.length == 1) {
                    arrow.id = laneInfoRel[0].id;
                    arrow.arrowTag = laneInfoRel[0].tags.ARROW;
                    arrow.lane_no = laneInfoRel[0].tags.LANE_NO;
                    return arrow;
                }
            }

            return arrow;
        },

        isMaat: function (entity) {
            if (entity.modelName == iD.data.DataType.NODECONN || entity.modelName == iD.data.DataType.C_NODECONN) {
                return true;
            }
            return false;
        },

        isSaat: function (entity) {
            if (entity.modelName == iD.data.DataType.NODEINFO || entity.modelName == iD.data.DataType.C_NODEINFO) {
                return true;
            }
            return false;
        },

        isAccessable: function (entity) {
            if (entity.modelName == iD.data.DataType.NODECONN || entity.modelName == iD.data.DataType.C_NODECONN) {
                if (entity.tags.ACCESSABLE == "0") {
                    return true;
                }
            }
            return false;
        },
        //分隔符需要绘制出来
        seperateArrow : function(arrow) {
            var arr = arrow.split(/\b|/g);
            if (arr[arr.length - 1] == "") {
                arr.splice((arr.length - 1), 1);
            }
            var arrowArr=[], str;
            for(var i= 0, r=arr.length; i<r; i++) {
                if (str==undefined){
                    str = arr[i] ;
                }
                else {
                    if (arr[i]=="|") {
                        if (str) {
                            arrowArr.push(str) ;
                            str = undefined ;
                        }
                        arrowArr.push(arr[i]) ;
                    } else {
                        str = str +  arr[i] ;
                    }
                }
            }
            if (str) {
                arrowArr.push(str) ;
            }
            return arrowArr ;
        },
        //对arrow箭头字符串进行解码,返回数组每个编码
        parseArrowTag: function (arrow, arrowOptions) {
            var results = [];
            var options = arrowOptions;
            //var arrowArr = arrow.split(/\b|\|/g); 中间的|线需要绘制出来
            //if (arrowArr[arrowArr.length - 1] == "") {
            //    arrowArr.splice((arrowArr.length - 1), 1);
            //}
            var arrowArr = this.seperateArrow(arrow) ;
            arrowArr.forEach(function (sub) {
                if (sub == "|") {
                    results.push("LINE");
                } else {
                    var temp = sub;
                    var count = 0;
                    while (temp.length != 0) {
                        var length = temp.length;
                        if (options.indexOf(temp) > -1) {
                            results.push(temp);
                            count += temp.length;
                            temp = sub.slice(count);
                        } else {
                            temp = temp.slice(0, length - 1);
                        }
                    }
                }
            });

            return results;
        },

        //获取对应的saat上的关联的道路或者maat上的进入和退出道路数组
        getHighlightIds: function (datum) {
            var selectedIds = [];
            if (datum.modelName == iD.data.DataType.NODEINFO || datum.modelName == iD.data.DataType.C_NODEINFO) {
                var wayId = datum.memberByRole(iD.data.RoleType.ROAD_ID).id;
                selectedIds.push(wayId);
            } else {
                var fWayId = datum.memberByRole(iD.data.RoleType.FROAD_ID).id;
                var tWayId = datum.memberByRole(iD.data.RoleType.TROAD_ID).id;
                selectedIds.push(fWayId);
                selectedIds.push(tWayId);
            }
            return selectedIds;
        },

        //获得最终输入的maat上的箭头
        getLaneInfoTag: function () {
            var laneinfoTag = "";
            //var selectArrs = d3.selectAll('.line-info-panel .main-context .maat-line-info .result-line-info span')[0];
            var selectArrs = d3.selectAll(".line-info-panel .main-context .maat-line-info .thumbnail span")[0];
            var length = selectArrs.length;
            selectArrs.forEach(function (selection, index) {
                var str = selection.className.split('-')[1];
                if (str == "LINE") {
                    if (index == (length - 1)) {
                        str = ""
                    } else {
                        str = '|'
                    }
                }
                laneinfoTag += str;
            })
            return laneinfoTag;
        },

        getPathResults: function () {
            var pathSelection = d3.selectAll(".line-info-path .sub-line-info-path .line-info-path-title .thumbnail")[0];
            var pathResults = [];
            for (var i = 0; i < pathSelection.length; i++) {
                var tgd = d3.select(pathSelection[i]).data()[0];
                var pathVals = d3.select(pathSelection[i]).selectAll('span')[0];
                var length = pathVals.length;
                var tgdTag = "";
                pathVals.forEach(function (selection, index) {
                    var str = selection.className.split('-')[1];
                    if (str == "LINE") {
                        if (index == (length - 1)) {
                            str = ""
                        } else {
                            str = '|'
                        }
                    }
                    tgdTag += str;
                })
                pathResults.push({
                    'tgd_id': tgd.id,
                    'arrowTag': tgdTag
                })
            }

            return pathResults;
        },

        dealLaneInfoNoInput: function () {
            //联动文本输入框的内容
            var childNodes = d3.select('.line-info-panel .maat-line-info .lane-info-number-input').node().childNodes;
            var lane_no_tmp = "", lane_no = "";
            for (var k = 0; k < childNodes.length; k++) {
                var value = childNodes[k].value;
                if (value == "") continue;
                lane_no_tmp += value + "|";
            }
            if (lane_no_tmp[lane_no_tmp.length - 1] == "|") {
                lane_no = lane_no_tmp.substring(0, lane_no_tmp.length - 1);
            }
            d3.select('.line-info-panel .maat-line-info .lane-info-number-manul input').value(lane_no);
        },

        parseStr2IntArr: function (value, splitStr) {
            var valueArr = value ? value.split(splitStr) : [];
            if (!valueArr[valueArr.length - 1])valueArr.splice(valueArr.length - 1, 1);
            for (var i = 0; i < valueArr.length; i++) {
                valueArr[i] = parseInt(valueArr[i]);
            }
            return valueArr;
        },

        //获取maat图标中图标个数和车道数
        getLaneInfoLineNum: function () {
            var arrowNodes = d3.select('.line-info-panel .maat-line-info .line-info-title .thumbnail').node().childNodes;
            var length2 = 0, lineLength = 0;
            for (var k = 0; k < arrowNodes.length; k++) {
                if (d3.select(arrowNodes[k]).attr('class') != "image-LINE") {
                    length2++;
                } else if (k != (arrowNodes.length - 1)) {
                    lineLength++;
                }
            }
            if (lineLength == 0) {
                if (arrowNodes.length != 0) {
                    return 1;
                } else {
                    return 0;
                }
            }
            var lanoInfoLength = lineLength + 1;    //车道数
            return lanoInfoLength;
        },

        getLaneInfoTagObject: function (value) {
            var result = new Object();
            for (var i = 0; i < value.length; i++) {
                var key = value[i];
                if (key == "|")continue;
                if (!result[key]) {
                    result[key] = 1;
                } else {
                    result[key] += 1;
                }
            }
            return result;
        },

        isStringAndSplit: function (value) {
            if (value == "")return true;
            var valueArr = value.split('|');
            for (var i = 0; i < valueArr.length; i++) {
                var key = parseInt(valueArr[i]);
                if (isNaN(key) || key == 0) {
                    return false;
                } else if (key > 50) {
                    return false;
                }
            }
            return true;
        },

        //获取某个关系里具体的数据模型值
        getModelObjectByDatatype: function (datatype, tag,title) {
            var layers = iD.Layers;
            var fieldHash = {},tagHash={},tagValueArr=[];
            return tagHash;
            var currentLayer = layers.getLayer();
            // var currentLayer = layers.getCurrentEnableLayer();
            if (!currentLayer || !currentLayer.modelEntity()) return tagHash;
            var modelEntity = currentLayer.modelEntity(),
                geoType = modelEntity.getGeoType();
            if (currentLayer.isRoad()) {
                var typeModelEntity = currentLayer.typeModelEntity()[datatype];
                if (typeModelEntity) { //只针对子图层
                    geoType = typeModelEntity.modelId;
                    modelEntity = typeModelEntity.model;
                } else {
                    geoType = '';
                }
            }

            var fields = modelEntity.getFields(geoType);

            for (var i = 0, len = fields.length; i < len; i++) {
                var fieldName = fields[i].fieldName;
                fieldHash[fieldName] = fields[i];
            }

            if(fieldHash[tag]){
                tagHash.label = title;
                var values = fieldHash[tag].fieldInput.values;
                for(var j=0;j<values.length;j++){
                    tagValueArr.push({label:values[j].name,
                                        value:values[j].value});
                }
                tagHash.options = tagValueArr;
            }

            return tagHash;
        },

        isZeroBugTask:function(){
            if(iD.Task&&iD.Task.d){
                var task = iD.Task.d;
                var task_type = task.task_type;
                return task_type==7;
            }
            return false;
        },

        isZeroBugQcTask:function(){
            if(iD.Task&&iD.Task.d){
                var task = iD.Task.d;
                var task_type = task.qc_type;
                return task_type==7;
            }
            return false;
        },

        isRealPictureTask:function(){
            // console.log('isRealPictureTask 方法引用需要去除');
            return false;
            return (iD.Task && iD.Task.isScene(iD.data.TransScene.REALPICTURE)) ? true :false;
        },

        //类似与属性更新的任务类型配置
        isTagUpdateAlikeTask:function(){
            if(iD.Task){
                /*
                 if (transScene == scene.TAGSUPDATE ||   //3-属性更新套餐
                 transScene == scene.ROADFACILITY || //5-道路设施套餐
                 transScene == scene.ROADSIGN ||     //6-路牌专项套餐
                 transScene == scene.ADASROAD ||     //7-ADAS专项套餐
                 transScene == scene.FULLSCENE       //9527-全场景套餐
                 ) */
                var scene = iD.data.TransScene;
                return iD.Task.isScene([scene.TAGSUPDATE,scene.ROADFACILITY,scene.ROADSIGN,scene.ADASROAD,scene.FULLSCENE]) ;
            }
            return false;
        },

        //判断当前任务的场景
        //iD.data.TransScene.scene
        isScene : function(scene){
            return (iD.Task && iD.Task.isScene(scene)) ? true :false;
        },

        isCameraTask:function(){
        var task = iD.Task.d;
        if(!task)   return false;
        var taskClasses = task.task_classes;
        if(taskClasses==iD.data.TaskClass.CAMEREGULAR||taskClasses==iD.data.TaskClass.CAMECOMP
            ||taskClasses==iD.data.TaskClass.CAMETICKET||taskClasses==iD.data.TaskClass.ONEMILE){
            return true;
        }
        return false;
        },

        isDisabledLabel:function(d,context){
            if (d.modelName == iD.data.DataType.NODECONN || d.modelName == iD.data.DataType.C_NODECONN) {
                if (d.tags.ACCESSABLE == "1") {
                    return true;
                }
                return false;
            }else if(d.modelName == iD.data.DataType.C_NODEINFO){
                //saat的属性置灰
                var road_member = d.memberByRole(iD.data.RoleType.ROAD_ID);
                var nodeId = d.memberByRole(iD.data.RoleType.C_NODE_ID).id;
                let topoEntity = iD.TopoEntity();
                let cmembers = topoEntity.getCrossNodeMembers(context.graph(), nodeId) || [];
                var nodeArr = cmembers.map(function(member){
                    return member.id;
                });
                var way = context.entity(road_member.id),direction = way.tags.DIRECTION;
                if(d.tags.INNERARC =='1'){
                    return true;
                }
                if(direction=='1'||(direction=='2'&&nodeArr.indexOf(way.last())>-1)||(direction=='3'&&nodeArr.indexOf(way.first())>-1)){
                    return false;
                }else {
                    return true;
                }
            }else{
                //saat的属性置灰
                var road_member = d.memberByRole(iD.data.RoleType.ROAD_ID);
                var nodeId = d.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
                var way = context.entity(road_member.id),direction = way.tags.DIRECTION;
                if(direction=='1'||(direction=='2'&&way.last()==nodeId)||(direction=='3'&&way.first()==nodeId)){
                    return false;
                }else {
                    return true;
                }
            }
        },

        isActivableLabel: function (d, context) {
            var self = this;
            var tags = d.tags;
            if (this.isSaat(d)) {
                if (tags.LT_TURN_L != '0' || (tags.LT_UTRUN_L&&tags.LT_UTRUN_L != '0') || tags.WAIT_L != '0' || tags.LANEINFO) {
                    return true;
                } else {
                    return false;
                }
            }else  if (this.isMaat(d)) {
                var lane_info_rel = self.getLaneInfoRel(d, context);
                var gd_voice_rel = self.getGuidanceVoiceRel(d, context);
                var assist_info_rel = self.getAssistInfo(d, context);
                var guidancesp_rel = self.getGuidanceSP(d, context);
                var guidancePicArrImage = self.getGuidancePic(d, context, ['20', '21']);
                var guidancePicArrSide = self.getGuidancePic(d, context, ['40']);
                var guidancePicArrRear = self.getGuidancePic(d, context, ['10', '11']);
                if(lane_info_rel.length>0&&lane_info_rel[0].tags.ARROW){
                    return true;
                }else if(gd_voice_rel.length>0&&gd_voice_rel[0].tags.VOICE_INFO){
                    return true;
                }else if(assist_info_rel.length>0&&assist_info_rel[0].tags.DIR_SLOPE){
                    return true;
                }else if(guidancesp_rel.length>0&&guidancesp_rel[0].tags.TEXTVALUE){
                    return true;
                }else if(guidancePicArrImage.length>0&&guidancePicArrImage[0].tags.PIC_BK){
                    return true;
                }else if(guidancePicArrSide.length>0&&guidancePicArrSide[0].tags.PIC_BK){
                    return true;
                }else if(guidancePicArrRear.length>0&&guidancePicArrRear[0].tags.PIC_BK){
                    return true;
                }else {
                    return false;
                }
            }
        },

        //判断行车引导线编码的数字是否为有效的
        isLaneNoValidate: function(value,maat,context,self){
            var selection = d3.select(".line-info-panel .maat-line-info .lane-info-number .lane-info-number-manul input");
            var valueArr = self.dataMgr.parseStr2IntArr(value,'|');
            var saat = self.dataMgr.getSaatFromMaat(context,maat)[0];
            var laneinfo = saat.tags.LANEINFO;
            var length1 = laneinfo?laneinfo.split('|').length:0;
            var lanoInfoLength = self.dataMgr.getLaneInfoLineNum();

            if(length1<lanoInfoLength||lanoInfoLength==0){
                Dialog.alert("行车引导线编辑不符合要求,请重新编辑");
                return  true;
            }else if(!self.dataMgr.isStringAndSplit(value)){
                Dialog.alert("行车引导线编号录入非法字符");
                selection.node()&&selection.value("");
                return true;
            }else{
                for(var p= 0;p<(valueArr.length-1);p++){
                    if(parseInt(valueArr[p])>=parseInt(valueArr[p+1])){
                        Dialog.alert("行车引导线编号必须从小到大录入");
                        return true;
                    }
                }
            }

            return false;
        }

    })

    return d3.rebind(new DataMgr(), mgrEvent, 'on');

}
