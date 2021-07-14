/*
 * @Author: tao.w
 * @Date: 2020-10-15 14:27:24
 * @LastEditors: tao.w
 * @LastEditTime: 2021-06-25 18:06:52
 * @Description: 
 */
const _template = {
    "lane": {
        "id": "lane",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "R_PL_LANE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_TL_LANE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_PG_LANE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "ROAD_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_C_NODE_ROAD_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "ROAD": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "C_NODECONN": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "C_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "NODECONN": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "C_TRAFFICRULE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TRAFFICRULE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TURN_GUIDANCE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "C_NODEINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "NODEINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "C_LANEINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "LANEINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "ROAD_ATTRIBUTE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_ROAD_RA": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_ROAD": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "DIVIDER": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_ROAD_DIVIDER": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_SIGN_ROAD": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_DREF": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "DIVIDER_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "DIVIDER_ATTRIBUTE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "LANE_ATTRIBUTE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "LANE_ATTRIBUTE_RESTRICTION": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_OPG": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_SIGN": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "OBJECT_PL": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_OPL": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_OPT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_IDIVIDER_OPT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_ODIVIDER_OPT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_OPT_OPG": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_OPT_OPT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_TL_STOPLINE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "JUNCTION": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_JUNCTION": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "LIMITHEIGHT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_LH": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TRAFFICLIGHT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TRAFFICLIGHT_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_TRAFFICLIGHT_TREF": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_DIVIDER_TL": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "BRIDGE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_BRIDGE_LH": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "OBJECT_PL_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "BRIDGE_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "BARRIER_GEOMETRY": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "BARRIER_GEOMETRY_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_BARRIER_BREF": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_BARRIER_DIVIDER": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "ROAD_FACILITIES": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "ROAD_FACILITIES_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_ROAD_FACILITIES": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TOLLGATE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "MEASUREINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "HD_LANE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_SIGN_LANE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "HD_LANE_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "HD_LANE_CONNECTIVITY": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "pole": {
        "id": "pole",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "LAMPPOST": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "R_LAMPPOST_LREF": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "MEASUREINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "ground": {
        "id": "ground",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "OBJECT_PG": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "OBJECT_PT": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "OBJECT_PG_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "PAVEMENT_DISTRESS": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "PAVEMENT_DISTRESS_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "PAVEMENT_DISTRESS_PL": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "PAVEMENT_DISTRESS_PL_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "DEV_LINE": {
                "display": false,
                "editable": false,
                "editlock": true
            },
            "DEV_LINE_NODE": {
                "display": false,
                "editable": false,
                "editlock": true
            },
            "DEV_POLYGON": {
                "display": false,
                "editable": false,
                "editlock": true
            },
            "DEV_POLYGON_NODE": {
                "display": false,
                "editable": false,
                "editlock": true
            },
            "TRAFFIC_SEMANTIC": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "MEASUREINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "sign": {
        "id": "sign",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "TRAFFICSIGN": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TRAFFICSIGN_NODE": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "TRAFFIC_SEMANTIC": {
                "display": true,
                "editable": true,
                "editlock": false
            },
            "MEASUREINFO": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "question_tag": {
        "id": "question_tag",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "QUESTION_TAG": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "pick_mark_tag": {
        "id": "pick_mark_tag",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "PICK_MARK_TAG": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "quality_tag": {
        "id": "quality_tag",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "QUALITY_TAG": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    },
    "accuracy_tag": {
        "id": "accuracy_tag",
        "url": "",
        "saveUrl": "",
        "display": true,
        "editable": true,
        "identifier": "",
        "isBbox": false,
        "models": {
            "ACCURACY_TAG": {
                "display": true,
                "editable": true,
                "editlock": false
            }
        }
    }
}
const _dataLayerUITemplate = [{
        "name": "车道线",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["lane"],
        "models": ["ROAD_ATTRIBUTE", "DIVIDER", "R_ROAD_DIVIDER", "R_DIVIDER_DREF", "DIVIDER_NODE", "DN_PRECSION",
            "R_REF_DIVIDER_NODE", "DIVIDER_ATTRIBUTE", "LANE_ATTRIBUTE", "R_LANE_DIVIDER", "HD_LANE_GROUP", "HD_R_LANE_GROUP", "LG_ROADNODE_INDEX", "LANE_ATTRIBUTE_RESTRICTION", "JUNCTION", "R_DIVIDER_JUNCTION", "R_DIVIDER_TL", "R_TL_LANE", "ADAS_NODE", "R_ADAS_ROAD", "HD_DIVIDER_SCH", "R_DIVIDER_SCH", "HD_LANE_SCH", "R_LANE_SCH", "R_DIVIDER_OPG", "OBJECT_PL", "R_DIVIDER_OPL", "R_DIVIDER_OPT", "R_IDIVIDER_OPT", "R_ODIVIDER_OPT", "R_DIVIDER_SIGN", "R_DIVIDER_LH", "OBJECT_PL_NODE", "R_BARRIER_DIVIDER",
            "TOLLGATE", "R_TL_STOPLINE", "R_PL_LANE", "HD_LANE_CONNECTIVITY", "MEASUREINFO"
        ]
    },
    {
        "name": "中心线",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["lane"],
        "models": ["HD_LANE", "HD_LANE_NODE", "R_SIGN_LANE", 'R_PG_LANE']
    },
    {
        "name": "护栏",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["lane"],
        "models": ["BARRIER_GEOMETRY", "BARRIER_GEOMETRY_NODE", "R_BARRIER_BREF", "MEASUREINFO"]
    },
    {
        "name": "杆状物",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["pole", "ground"],
        "models": ["OBJECT_PT", "R_OPT_OPG", "R_OPT_OPT", "LAMPPOST", "R_LAMPPOST_LREF", "MEASUREINFO"]
    },
    {
        "name": "路牌/交通灯",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["sign", "lane"],
        "models": ["TRAFFICSIGN", "R_TRAFFICSIGN", "TRAFFICSIGN_INFO", "TRAFFICSIGN_NODE", "TRAFFICLIGHT",
            "TRAFFICLIGHT_NODE", "R_TRAFFICLIGHTGROUP", "R_TRAFFICLIGHTPATH", "TRAFFIC_SEMANTIC", "MEASUREINFO"
        ]
    },
    {
        "name": "地面定位目标",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": ["ground"],
        "types": ["ground"],
        "models": ["OBJECT_PG", "R_OPG_OPG", "OBJECT_PG_NODE", "TRAFFIC_SEMANTIC"]
    },
    {
        "name": "道路上方结构",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["lane"],
        "models": ["LIMITHEIGHT", "BRIDGE", "BRIDGE_NODE", "R_BRIDGE_LH", "ROAD_FACILITIES", "ROAD_FACILITIES_NODE", "R_ROAD_FACILITIES", "MEASUREINFO"]
    },
    {
        "name": "二维路网",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["lane"],
        "models": ["ADMIN_AREA", 'R_SIGN_ROAD', "ADMIN_AREA_NODE", "RAILWAY", "RAILWAY_NODE", "LANDUSE", "LANDUSE_NODE", "POI", "C_NODE", "ROAD_NODE", "R_C_NODE_ROAD_NODE", "ROAD", "C_NODECONN", "NODECONN", "C_TRAFFICRULE", "TRAFFICRULE", "C_NODEINFO", "NODEINFO", "C_LANEINFO", "LANEINFO", "R_ROAD_RA", "R_ROAD", "ZLEVEL", "R_ZLEVEL_ROAD"]
    },
    {
        "name": "公路病害",
        "editable": false,
        "display": false,
        "editlock": false,
        "displaylock": false,
        "layerIds": [],
        "types": ["ground"],
        "models": ["PAVEMENT_DISTRESS", "PAVEMENT_DISTRESS_NODE", "PAVEMENT_DISTRESS_PL", "PAVEMENT_DISTRESS_PL_NODE", "R_PD_OPT"]
    },
    {
        "name": "中间线数据",
        "editable": false,
        "display": false,
        "editlock": true,
        "displaylock": false,
        "layerIds": [],
        "types": ["ground"],
        "models": ["DEV_LINE", "DEV_LINE_NODE"]
    }, {
        "name": "中间面数据",
        "editable": false,
        "display": false,
        "editlock": true,
        "displaylock": false,
        "layerIds": [],
        "types": ["ground"],
        "models": ["DEV_POLYGON", "DEV_POLYGON_NODE"]
    }
]
const _tagLayerUITemplate = [{
    "name": "问题记录标记",
    "editable": false,
    "display": false,
    "editlock": false,
    "displaylock": false,
    "layerIds": [],
    "types": ["question_tag"],
    "models": ["QUESTION_TAG"]
}, {
    "name": "图像标记",
    "editable": false,
    "display": false,
    "editlock": false,
    "displaylock": false,
    "layerIds": [],
    "types": ["pick_mark_tag"],
    "models": ["PICK_MARK_TAG"]
}, {
    "name": "质检标",
    "editable": false,
    "display": false,
    "editlock": false,
    "displaylock": false,
    "layerIds": [],
    "types": ["quality_tag"],
    "models": ["QUALITY_TAG"]
}, {
    "name": "精度标记",
    "editable": false,
    "display": false,
    "editlock": false,
    "displaylock": false,
    "layerIds": [],
    "types": ["accuracy_tag"],
    "models": ["ACCURACY_TAG"]
}]

const _sourceTemplate = [{
    "title": "底图层",
    "label": "底图层",
    "layers": [{
        "name": "地图",
        "type": 'Map',
        "display": false,
        "displaylock": false,
        "event": "background",
        "unique": "background",
        "children": [],
        "action": []
    }, {
        "name": "影像",
        "type": "wms",
        "display": false,
        "displaylock": false,
        "event": "background",
        "unique": "background",
        "children": [],
        "action": []
    }, {
        "name": "mapbox",
        "type": 'mapbox',
        "display": false,
        "displaylock": false,
        "event": "background",
        "unique": "background",
        "children": [],
        "action": []
    }, {
        "name": "Google",
        "type": "google",
        "display": false,
        "displaylock": false,
        "event": "background",
        "unique": "background",
        "children": [],
        "action": []
    }, {
        "name": "彩色正射图",
        "type": "aboveGroundMap",
        "display": true,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }, {
        "name": "俯视图",
        "type": "groundMesh",
        "display": false,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }, {
        "name": "临时路网",
        "type": "groundMesh1",
        "display": false,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }, {
        "name": "正射图",
        "type": "orthographicMap",
        "display": true,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }, {
        "name": "轨迹",
        "type": "pic",
        "display": true,
        "displaylock": false,
        "event": "pic",
        "children": [],
        "action": []
    }, {
        "name": "任务框",
        "type": "task_frame",
        "display": false,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }, {
        "name": "UTM",
        "type": "utm",
        "display": false,
        "displaylock": false,
        "event": "tag",
        "children": [],
        "action": []
    }]
}]

const _other = ['PAVEMENT_DISTRESS', 'PAVEMENT_DISTRESS_NODE', 'PAVEMENT_DISTRESS_PL', 'PAVEMENT_DISTRESS_PL_NODE', "DEV_POLYGON", "DEV_POLYGON_NODE", "DEV_LINE", "DEV_LINE_NODE"];
iD.Template = {
    /**
     * @description:  获取数据图层URL
     * @param {type} 
     * @return {type} 
     */
    dataLayers: [],
    sourceLayers: [],
    getDataLayerUrl: function (lay, task) {
        let baseServer = iD.config.URL.kds_data;
        let url = baseServer + 'data/' + lay.taskKey + '?';
        if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
            url += 'namespace=road-detection&';
        }
        if (task.featureGroup) {
            let _str = encodeURIComponent(task.featureGroup.content);
            url += '&filter=' + _str;
        }
        // 
        // url = url + '&t=' + new Date().getTime();
        return url;
    },
    getTagLayerUrl: function (lay, task) {
        var params = {};
        var result;
        if ([iD.data.DataType.QUALITY_TAG, iD.data.DataType.ACCURACY_TAG].includes(lay.taskKey)) {
            result = [{
                k: 'TASK_ID',
                op: 'eq',
                v: iD.Task.d.task_id + ''
            }];
            //很奇怪的需求， 不看自己的标要看别的任务的标
            if (task.tags.type == 'multi_track_lane') {
                result = [{
                    k: 'TASK_ID',
                    op: 'eq',
                    v: iD.Task.d.tags.trackEpilineCheck + ''
                }];
            }
        } else {
            result = [{
                k: 'TASKID',
                op: 'eq',
                v: iD.Task.d.task_id + ''
            }];
            // params.tagsJson = JSON.stringify(result);
        }
        if (task.featureGroup) {
            result.push({
                "k": "FEATURE_GROUP",
                "type": "string",
                "v": task.featureGroup.featureGroupId,
                "op": "eq"
            })
        }

        params.tagsJson = JSON.stringify(result);
        
        for (let k in params) {
            params[k] = encodeURIComponent(params[k]);
        }
        
        let _str = iD.util.parseParam2String(params);
        let dataUrl = iD.config.URL.kd_tag + 'tag/osm/' + lay.taskKey + '/query?' + _str; //+ '&t=' + new Date().getTime();
        return dataUrl;
    },
    /**
     * @description: 初始化数据层配置，只做基本属性配置
     * @param {type} 
     * @return {type} 
     */
    buildDataLayerConfiguration: function (layers, display, editable, task) {
        let configs = [];

        function refreshLayerModel(models, isDisPlay = false, iseditor = false) {
            Object.values(models).map(d => {
                d.display = isDisPlay;
                d.editable = iseditor;
            })
            return models;
        }

        function filterModels(models) {
            let isDisease = false;
            if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
                isDisease = true;
            }
            let obj = {};
            for (key in models) {
                if (isDisease) {
                    if (_other.includes(key)) {
                        obj[key] = models[key];
                    }
                } else {
                    if (!_other.includes(key)) {
                        obj[key] = models[key];
                    }
                }
            }
            return obj;
        }

        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let l = _.cloneDeep(_template[layer.layer]);
            if (!l) continue;
            l.id = layer.taskKey;
            l.display = display;
            l.type = layer.type;
            l.editable = editable;

            refreshLayerModel(l.models, display, editable);
            if (l.type == 'ground') {
                l.models = filterModels(l.models);
            }
            l.url = this.getDataLayerUrl(layer, task);
            configs.push(l);
        }
        return configs;
    },

    buildTagLayerConfiguration: function (layers, display, editable, task) {
        let configs = [];

        function refreshLayerModel(models, isDisPlay = false, iseditor = false) {

            Object.values(models).map(d => {
                d.display = isDisPlay;
                d.editable = iseditor;
            })
            return models;
        }

        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let l = _.cloneDeep(_template[layer.layer]);
            l.id = layer.taskKey;
            l.type = layer.type;
            l.display = display;
            l.editable = editable;
            refreshLayerModel(l.models, display, editable);
            l.url = this.getTagLayerUrl(layer, task);
            configs.push(l);
        }
        return configs;
    },


    layerStatus: function (type, subtype) {
        let status = {
            display: true,
            editable: true,
            editlock: false,
            displaylock: false
        }
        var tagtypes = ["quality_tag", "accuracy_tag"];
        let history = iD.util.urlParamHistory();
        if (history) {
            status.editable = false;
            status.editlock = true;
        }
        if (type == 'tag') {
            if (iD.User.isWorkRole() && tagtypes.includes(subtype)) {
                status.editable = false;
                status.editlock = true;
            }
            if (['question_tag', 'pick_mark_tag'].includes(subtype)) {
                status.editable = false;
                status.display = false;
            }
            if ('pick_mark_tag' === subtype) {
                status.editlock = false;
            }

        } else if (type == 'main') {
            if (!iD.User.isWorkRole()) {
                status.editable = false;
                status.editlock = true;
            }
        } else {
            status.editable = false;
            status.display = false;
            status.editlock = true;
        }
        return status
    },

    updateLayer: function (layer, configs, status) {
        // let models = layer;
        let models = configs.reduce((accumulator, arrayElement) => {
            return accumulator.concat(arrayElement.models)
        }, [])
        if (status.editable) {
            layer.editable = true
        }
        if (status.display) {
            layer.display = true
        }
        for (m in layer.models) {
            if (models.includes(m) && !['DEV_LINE', 'DEV_LINE_NODE', 'DEV_POLYGON', 'DEV_POLYGON_NODE'].includes(m)) {
                layer.models[m].editable = status.editable;
                layer.models[m].display = status.display;
            }
        }
        return true;
    },

    tagUIconfiguration: function (source) {
        let layers = source.layers;
        let configs = _.cloneDeep(_tagLayerUITemplate);
        let templates = [];
        for (let i = 0; i < layers.length; i++) {
            let l = layers[i];

            let status = this.layerStatus(source.type, l.type);

            // configs.filter(d=>{ return d.types.includes(l.type)})
            let c = configs.filter(d => {
                return d.types.includes(l.type)
            });
            if (!c.length) console.warn('标图层配置出错');
            c.map(d => {
                d.layerIds.push(l.id);
                Object.assign(d, status);
            })
            this.updateLayer(l, c, status);
            templates.push(...c);
        }

        let obj = {
            "title": "标",
            "label": "标",
            "layers": templates
        }
        return obj;
    },

    dataUIconfigUration: function (source) {
        let layers = source.layers;
        let configs = _.cloneDeep(_dataLayerUITemplate);

        let status = this.layerStatus(source.type);
        let templates = [];
        for (let i = 0; i < layers.length; i++) {
            let l = layers[i];
            let _modes = Object.keys(l.models);
            if (source.type == 'main') {
                l.identifier = '';
                if (this._eventCount < 5) {
                    l._key = 'Ctrl+' + this._eventCount;
                    this._eventCount++;
                }
            } else {
                l.identifier = l.id;
            }

            if (source.type == 'comparative') {
                l.style = function (entity) {
                    if (entity.isArea()) {
                        return {
                            "fill": "#FF00FF",
                            "opacity": 0.2
                        };
                    } else {
                        return {
                            "stroke": "#FF00FF",
                            'opacity': '1',
                            "stroke-width": 2
                        };
                    }
                }
            }

            let c = configs.filter(d => {
                return d.types.includes(l.type) && _modes.filter(function (val) {
                    return d.models.indexOf(val) > -1
                }).length
            });
            if (!c.length) console.warn(l.type, '层配置出错');
            c.map((d, i) => {
                d.layerIds.push(l.id);
                Object.assign(d, status);
            })
            this.updateLayer(l, c, status);
            c.forEach(element => {
                if (element.name == '中间线数据' || element.name == '中间面数据') {
                    element.display = false;
                    element.editable = false;
                    element.editlock = true;

                }
            });
            templates.push(...c);

        }
        const UITitle = {
            'main': '',
            'tag': '标',
            'source': '来源',
            'edge': '接边',
            'comparative': '对比'
        }
        //图层去重
        templates = _.uniq(templates);
        if (source.type == 'main') {
            for (let i = 1; i < templates.length; i++) {
                if (i > 4) break;
                templates[i]._key = 'Ctrl+' + i;
            }
        }
        let obj = {
            "title": UITitle[source.type],
            "label": UITitle[source.type],
            "layers": templates
        }
        return obj;
    },

    buildUIConfiguration: function (layers) {
        let dataLayers = [];
        let configuration = {
            "dataLayers": dataLayers,
            'sourceLayers': _sourceTemplate
        };
        for (let i = 0; i < layers.length; i++) {
            let l = layers[i];

            let config;
            if (l.type == 'tag') {
                config = this.tagUIconfiguration(l);
            } else {
                config = this.dataUIconfigUration(l);
            }
            dataLayers.push(config);
        }
        return configuration;
    }
};